pragma solidity ^0.5.0;


import "./aave/libraries/WadRayMath.sol";
import "./Calendar.sol";
import "./IExternalPool.sol";
import "./IAssetBacked.sol";
import "erc-1155/contracts/IERC1155.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";


/**
 * @title Future Token
 *
 */
contract FutureToken is IERC1155, IAssetBacked {
  using WadRayMath for uint256;
  using SafeMath for uint256;

  uint256 internal constant MAX_RATE = 10000;
  uint256 internal constant INTERESTS_SLOT = 7777777;
  address public constant ETHER = address(0xE);

  /**
  * @dev emitted after the redeem action
  * @param _account the address performing the redeem
  * @param _value the amount to be redeemed
  * @param _period the amount to be redeemed
  * @param _value interests received
  **/
  event Deposit(address indexed _account, uint256 _value, uint256 _period, uint256 _interests);

  /**
  * @dev emitted after the redeem action
  * @param _account the address performing the redeem
  * @param _value the amount to be redeemed
  * @param _from start maturity date
  * @param _to destination maturity date
  * @param _value interests received
  **/
  event TimeTravel(address indexed _account, uint256 _value, uint256 _from, uint256 _to, uint256 _interests);

  modifier onlyInterestRatesOracle() {
    require(msg.sender == interestRatesOracle, "The caller is not the interest rates oracle");
    _;
  }

  mapping (uint256 => mapping(address => uint256)) internal balances;

  IExternalPool public externalPool;

  //An oracle authorized to set interest rates
  address public interestRatesOracle;

  //A original asset that is going to be deposited and redeemed
  address public originalAsset;

  //Current interest rate for new deposits and time-travelling
  uint256 public interestRate;

  constructor(address _interestRatesOracle, IExternalPool _externalPool, address _originalAsset) public {
    externalPool = _externalPool;
    interestRatesOracle = _interestRatesOracle;
    originalAsset = _originalAsset;
    //DEFAULT_RATE
    interestRate = 1200;
  }

  function setInterestRates(uint _newRate) external onlyInterestRatesOracle {
    interestRate = _newRate;
  }

  /**
   * @notice ERC20 implementation internal function backing transfer() and transferFrom()
   * @dev validates the transfer before allowing it. NOTE: This is not standard ERC20 behavior
   **/
  function deposit(uint256 _amount, uint256 periodDiff) external payable {
    uint256 interests = getWarpPrice(_amount, periodDiff);
    uint256 currentPeriod = this.getCurrentPeriod();

    //Deposit to lending pool
    uint256 lendingPoolDeposit = _amount.sub(interests);
    if (this.isEthBacked()) {
      require(msg.value >= _amount, "Not enough ether attached to the transaction");
      externalPool.deposit.value(lendingPoolDeposit)(lendingPoolDeposit);
      //Return instant interests
      msg.sender.transfer(interests);
    } else {
      IERC20(originalAsset).transferFrom(msg.sender, address(externalPool), lendingPoolDeposit);
      externalPool.deposit(lendingPoolDeposit);
    }

    //Update internal ledger
    _mint(msg.sender, currentPeriod.add(periodDiff), _amount);
    _mint(msg.sender, INTERESTS_SLOT, interests);

    emit Deposit(msg.sender, _amount, periodDiff, interests);
  }



  function withdraw(uint256 _amount, uint256 _periodFrom) external payable {
    require(this.balanceOf(msg.sender, _periodFrom) >= _amount, "No enough funds available");

    uint256 currentPeriod = this.getCurrentPeriod();
    if (_periodFrom != this.getCurrentPeriod()) {
      _warp(msg.sender, _amount, _periodFrom, currentPeriod);
    }

    //Return funds from Aave
    uint256 lendingPoolBalance = this.getTotalCollateral();
    uint256 toRedeem = _amount > lendingPoolBalance ? lendingPoolBalance : _amount;
    externalPool.withdraw(toRedeem, msg.sender);

    _burn(msg.sender, currentPeriod, toRedeem);
  }

  function warp(uint256 _amount, uint256 _periodFrom, uint256 _periodTo) external payable {
    uint256 interests = _warp(msg.sender, _amount, _periodFrom, _periodTo);
    emit TimeTravel(msg.sender, _amount, _periodFrom, _periodTo, interests);
  }


  function _warp(address payable _account, uint256 _amount, uint256 _periodFrom, uint256 _periodTo) internal returns(uint256) {
    require(this.balanceOf(_account, _periodFrom) >= _amount, "No enough funds available");
    require(_periodTo >= this.getCurrentPeriod(), "Cannot transfer to the past");

    bool isForward = _periodTo > _periodFrom;
    uint256 periodDiff = isForward ? _periodTo.sub(_periodFrom): _periodFrom.sub(_periodTo);
    uint256 warpPrice = getWarpPrice(_amount, periodDiff);

    if (isForward) {
      balances[INTERESTS_SLOT][_account] = balances[INTERESTS_SLOT][_account].add(warpPrice);
      externalPool.withdraw(warpPrice, _account);
    } else {
      uint256 effectivePrice = warpPrice > balances[INTERESTS_SLOT][_account] ? balances[INTERESTS_SLOT][_account] : warpPrice;
      balances[INTERESTS_SLOT][_account] = balances[INTERESTS_SLOT][_account].sub(effectivePrice);
      if (this.isEthBacked()) {
        require(msg.value >= warpPrice, "Not enough ether attached to the transaction");
        externalPool.deposit.value(warpPrice)(warpPrice);
      } else {
        IERC20(originalAsset).transferFrom(_account, address(externalPool), warpPrice);
        externalPool.deposit(warpPrice);
      }
    }

    balances[_periodFrom][msg.sender] = balances[_periodFrom][msg.sender].sub(_amount);
    balances[_periodTo][msg.sender] = balances[_periodTo][msg.sender].add(_amount);

    emit TransferSingle(msg.sender, msg.sender, msg.sender, _periodTo, _amount);
    return warpPrice;
  }

  function getCurrentPeriod() external view returns(uint256) {
    return Calendar.getCurrentMonth();
  }


  function getWarpPrice(uint256 _amount, uint256 _periodDiff) public view returns(uint256) {
    uint256 formula = MAX_RATE.add(interestRate.mul(_periodDiff).div(12));
    return _amount.mul(formula).div(MAX_RATE).sub(_amount);
  }

  /**
     * @dev Internal function to mint an amount of a token with the given ID
     * @param to The address that will own the minted token
     * @param id ID of the token to be minted
     * @param value Amount of the token to be minted
     */
  function _mint(address to, uint256 id, uint256 value) internal {
    require(to != address(0), "ERC1155: mint to the zero address");

    balances[id][to] = value.add(balances[id][to]);
    emit TransferSingle(msg.sender, address(0), to, id, value);
  }


  /**
     * @dev Internal function to burn an amount of a token with the given ID
     * @param owner Account which owns the token to be burnt
     * @param id ID of the token to be burnt
     * @param value Amount of the token to be burnt
     */
  function _burn(address owner, uint256 id, uint256 value) internal {
    balances[id][owner] = balances[id][owner].sub(value);
    emit TransferSingle(msg.sender, owner, address(0), id, value);
  }

  function spaceTransfer(address _to, uint256 _id, uint256 _value) external {
    balances[_id][msg.sender] = balances[_id][msg.sender].sub(_value);
    balances[_id][_to] = balances[_id][_to].add(_value);
    emit TransferSingle(msg.sender, msg.sender, _to, _id, _value);
  }

  /**
      @notice Get the balance of an account's Tokens.
      @param _owner  The address of the token holder
      @param _id     ID of the Token
      @return        The _owner's balance of the Token type requested
   */
  function balanceOf(address _owner, uint256 _id) external view returns (uint256) {
    // The balance of any account can be calculated from the Transfer events history.
    // However, since we need to keep the balances to validate transfer request,
    // there is no extra cost to also privide a querry function.
    return balances[_id][_owner];
  }

  function balancesOfYear(address _owner) external view returns (uint256[] memory) {
    uint256[] memory balances = new uint256[](12);
    for(uint i = 0; i < 12; i++) {
      balances[i] = this.balanceOf(_owner, i);
    }
    return balances;
  }

  function getTotalInterests() external view returns (uint256) {
    return balances[INTERESTS_SLOT][msg.sender];
  }

  function getTotalCollateral() public view returns(uint256) {
    return externalPool.totalBalance();
  }

  function isEthBacked() external view returns(bool) {
    return originalAsset == ETHER;
  }

  function backingAsset() external view returns(IERC20) {
    return IERC20(originalAsset);
  }

  /**
      Default payable function to accept money from Lending Pools
   */
  function() external payable { }

  //IERC-1155 Functions to be implemented later
  function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids) external view returns (uint256[] memory) {}

  function setApprovalForAll(address _operator, bool _approved) external {}

  function isApprovedForAll(address _owner, address _operator) external view returns (bool) {}

  function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data) external { }

  function safeBatchTransferFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external { }

}
