pragma solidity ^0.5.0;

import "./BaseExternalPool.sol";

/************
@title MockExternalPool
@notice Mock implementation of external lending pool for test purpose
*/

contract MockExternalPool is BaseExternalPool {

  uint256 balance;

  function deposit(uint256 amount) external payable {
    balance += amount;
  }

  function withdraw(uint256 amount, address payable beneficiary) external {
    balance -= amount;
    if (isEthBacked()) {
      beneficiary.transfer(amount);
    } else {
      backingAsset().transfer(beneficiary, amount);
    }
  }

  function totalBalance() external view returns(uint256) {
    return balance;
  }

}
