pragma solidity ^0.5.0;

import "./IExternalPool.sol";
import "./IAssetBacked.sol";
import "./IAssetsPriceProvider.sol";
import "./Calendar.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

/***
  @title BorrowingService
  @notice A contract handling assets borrowing and collateral management
*/

contract BorrowingService is Ownable, IAssetBacked {

  using SafeMath for uint256;

  address public constant ETHER = address(0xE);


  /**
  * @dev emitted after the deposit action
  * @param account an address of the borrower
  * @param value the borrowed amount
  * @param originationTime the exact time when the loan was taken
  * @param maturityPeriod a period on which loan is expected to be returned
  **/
  event Borrow(address indexed account, uint256 value, uint256 originationTime, uint256 maturityPeriod);


  /**
    * @dev emitted when the collateral ratio is updated by the admin
    * @param collateralAddress address of the collateral
    * @param newCollateralRatio value of the new collateral ratio
  **/
  event CollateralRatioUpdated(address collateralAddress, uint256 newCollateralRatio);

  //A original asset that is going to be deposited and redeemed
  address public originalAsset;

  //An oracle authorized to set interest rates
  address public interestRatesOracle;

  //An external lending pool that is being used as a stopgap for outstanding deposits
  IExternalPool public externalPool;

  //Current interest rate for new loans
  uint256 public interestRate;

  //Defines the required collateral to loan ratio per asset expressed in percents
  mapping(address => uint256) public collateralRatios;

  //An oracle-linked contract providing price per crypto-asset denominated in USD
  IAssetsPriceProvider assetsPriceProvider;


  //Current status of protocol debt clustered by periods
  mapping(uint256 => uint256) debt;

  //Current status of user debt clustered by periods
  mapping(address => mapping(uint256 => uint256)) userDebt;



  /**
  * @dev The annotated function may only be called by the interest rates oracle
  * which is set once during the contract creation
  **/
  modifier onlyInterestRatesOracle() {
    require(msg.sender == interestRatesOracle, "The caller is not the interest rates oracle");
    _;
  }

  constructor(
    address _originalAsset,
    address _interestRatesOracle,
    IExternalPool _externalPool,
    IAssetsPriceProvider _assetsPriceProvider
  ) public {
    originalAsset = _originalAsset;
    externalPool = _externalPool;
    interestRatesOracle = _interestRatesOracle;
    assetsPriceProvider = _assetsPriceProvider;
  }



  function borrow(uint256 _loanAmount, address _collateralAddress, uint256 loanDuration) external payable {
    uint256 collateralAmount = getRequiredCollateral(_collateralAddress, _loanAmount);
    uint256 maturityPeriod = getCurrentPeriod().add(loanDuration);

    if (this.isEthBacked()) {
      require(msg.value >= collateralAmount, "Not enough ether attached to the transaction");
      externalPool.deposit.value(collateralAmount)(collateralAmount);
    } else {
      IERC20(originalAsset).transferFrom(msg.sender, address(externalPool), collateralAmount);
      externalPool.deposit(collateralAmount);
    }
    externalPool.borrow(_loanAmount, originalAsset, msg.sender);

    //Update debt accounting
    debt[maturityPeriod] = debt[maturityPeriod].add(_loanAmount);
    userDebt[msg.sender][maturityPeriod] = userDebt[msg.sender][maturityPeriod].add(_loanAmount);

    emit Borrow(msg.sender, _loanAmount, now, maturityPeriod);
  }



  /**
  * @dev Sets the current interest rate based:
  * on current deposits, loans, reserve and external pools rats
  **/
  function setInterestRates(uint _newRate) external onlyInterestRatesOracle {
    interestRate = _newRate;
  }


  /**
  * @dev Sets the current collateral ratio in percents
  **/
  function setCollateralRatio(address _collateralAddress, uint _newCollateralRatio) external onlyOwner {
    require(_newCollateralRatio > 100);
    collateralRatios[_collateralAddress] = _newCollateralRatio;

    emit CollateralRatioUpdated(_collateralAddress, _newCollateralRatio);

  }

  function getCollateralRatio(address _collateralAddress) public view returns (uint256) {
    return collateralRatios[_collateralAddress];
  }

  function getCollateralPrice(address _collateral) public view returns (uint256) {
    return assetsPriceProvider.getAssetPrice(_collateral);
  }

  function getRequiredCollateral(address _collateralAddress, uint256 _loanAmount) public view returns(uint256) {
    uint256 loanValue = _loanAmount.mul(assetsPriceProvider.getAssetPrice(originalAsset));
    uint256 collateralValue = loanValue.mul(getCollateralRatio(_collateralAddress)).div(100);
    return collateralValue.div(assetsPriceProvider.getAssetPrice(_collateralAddress));
  }

  function getUserDebt(address _user, uint256 _maturityPeriod) external view returns(uint256) {
    return userDebt[_user][_maturityPeriod];
  }

  function getUserDebt12months(address _user, uint256 _startPeriod) external view returns(uint256[] memory) {
    uint256[] memory result = new uint256[](12);
    for(uint256 i = 0; i<12; i++) {
      result[i] = userDebt[_user][_startPeriod + i];
    }
    return result;
  }

  function getTotalDebt(uint256 maturityPeriod) external view returns(uint256) {
    return debt[maturityPeriod];
  }

  function isEthBacked() external view returns(bool) {
    return true;
  }

  function backingAsset() external view returns(IERC20) {
    return IERC20(ETHER);
  }

  function getCurrentPeriod() public view returns(uint256) {
    return Calendar.getCurrentMonth();
  }





}
