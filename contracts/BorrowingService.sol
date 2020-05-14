pragma solidity ^0.5.0;

import "./IExternalPool.sol";
import "./IAssetsPriceProvider.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/***
  @title BorrowingService
  @notice A contract handling assets borrowing and collateral management
*/

contract BorrowingService is Ownable {

  using SafeMath for uint256;


  /**
    * @dev emitted after the deposit action
    * @param _collateralRatio new collateral ratio
  **/
  event CollateralRatioUpdated(address _collateralAddress, uint256 _collateralRatio);

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





}
