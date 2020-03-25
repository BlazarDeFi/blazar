pragma solidity ^0.5.0;

import "./IExternalPool.sol";
import "./IAssetBacked.sol";

/************
@title MockExternalPool
@notice Mock implementation of external lending pool for test purpose
*/

contract MockExternalPool is IExternalPool {

  uint256 balance;

  function isEthBacked() internal returns(bool) {
    IAssetBacked callee = IAssetBacked(msg.sender);
    return callee.isEthBacked();
  }

  function backingAsset() internal returns(IERC20) {
    IAssetBacked callee = IAssetBacked(msg.sender);
    return callee.backingAsset();
  }

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

  function balanceOf(address account) external view returns(uint256) {
    return balance;
  }


}
