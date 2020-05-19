var AaveExternalPool = artifacts.require("./AaveExternalPool.sol");
var FutureToken = artifacts.require("./FutureToken.sol");

const ETH_ADDRESS = "0x000000000000000000000000000000000000000E";


module.exports = function(deployer) {
  deployer.deploy(FutureToken,
    "0x21d0c79c5be59af6d61c262286809d0b78d1e156", //Interest rates oracle
    AaveExternalPool.address,
    ETH_ADDRESS); //ETH symbol
};
