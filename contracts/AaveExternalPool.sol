pragma solidity ^0.5.0;


import "./BaseExternalPool.sol";
import "./aave/tokenization/AToken.sol";
import "./aave/lendingpool/LendingPool.sol";
import "./AaveKovanDeployment.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/***
  @title AaveExternalPool
  @notice Contract forwading deposits to the Aave liquidity pool
*/
contract AaveExternalPool is BaseExternalPool, Ownable {

  LendingPool public lendingPool;

  mapping(address => address) internal tokenReserves;

  constructor(LendingPool _lendingPool) public {
    lendingPool = _lendingPool;

    //Setting Kovan reserve (should be moved to deployer)
    setReserve(ETHER, AaveKovanDeployment.ethAddress());
    setReserve(AaveKovanDeployment.daiAddress(), AaveKovanDeployment.daiAddress());
  }

  function setReserve(address token, address reserve) internal {
    tokenReserves[token] = reserve;
    if (token != ETHER) {
      address core = address(lendingPool.core());
      IERC20(token).approve(core, UINT256_MAX);
    }
  }

  function reserve() internal view returns(address) {
    return tokenReserves[address(backingAsset())];
  }

  function deposit(uint256 amount) external payable {
    if (isEthBacked()) {
      lendingPool.deposit.value(amount)(reserve(), amount, 0);
    } else {
      lendingPool.deposit(reserve(), amount, 0);
    }
  }

  function withdraw(uint256 amount, address payable beneficiary) external {
    address aTokenAddress;
    ( , , , , , , , , , , ,aTokenAddress, ) = lendingPool.getReserveData(reserve());
    AToken aToken = AToken(aTokenAddress);
    aToken.redeem(amount);
    if (isEthBacked()) {
      beneficiary.transfer(amount);
    } else {
      IERC20 depositedToken = IERC20(aToken.underlyingAssetAddress());
      depositedToken.transfer(beneficiary, amount);
    }
  }

  function totalBalance() external view returns(uint256) {
    address aTokenAddress;
    ( , , , , , , , , , , ,aTokenAddress, ) = lendingPool.getReserveData(reserve());
    AToken aToken = AToken(aTokenAddress);
    return aToken.balanceOf(address(this));
  }

  function () external payable {}
}
