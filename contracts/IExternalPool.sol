pragma solidity ^0.5.0;

/************
@title IExternalPool interface
@notice Interface for connection to external lending pools;
*/

interface IExternalPool {

  function deposit(uint256 amount) external payable;

  function withdraw(uint256 amount, address payable beneficiary) external;

  function totalBalance() external view returns(uint256);
}
