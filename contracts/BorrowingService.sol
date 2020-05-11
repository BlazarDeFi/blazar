pragma solidity ^0.5.0;

import "./IExternalPool.sol";

/***
  @title BorrowingService
  @notice A contract handling assets borrowing and collateral management
*/

contract BorrowingService {

  //A original asset that is going to be deposited and redeemed
  address public originalAsset;

  //An oracle authorized to set interest rates
  address public interestRatesOracle;

  //An external lending pool that is being used as a stopgap for outstanding deposits
  IExternalPool public externalPool;

  //Current interest rate for new loans
  uint256 public interestRate;

  /**
  * @dev The annotated function may only be called by the interest rates oracle
  * which is set once during the contract creation
  **/
  modifier onlyInterestRatesOracle() {
    require(msg.sender == interestRatesOracle, "The caller is not the interest rates oracle");
    _;
  }

  constructor(address _interestRatesOracle, IExternalPool _externalPool, address _originalAsset) public {
    externalPool = _externalPool;
    interestRatesOracle = _interestRatesOracle;
    originalAsset = _originalAsset;
  }


  /**
  * @dev Sets the current interest rate based:
  * on current deposits, loans, reserve and external pools rats
  **/
  function setInterestRates(uint _newRate) external onlyInterestRatesOracle {
    interestRate = _newRate;
  }




  function getCollateralPrice(address _collateral) public view returns (uint256) {
    return 1;
  }

  function getRequiredCollateral(address _collateral, uint256 _loanAmount) public view returns(uint256) {
    return 1;
  }





}
