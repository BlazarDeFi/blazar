var AaveExternalPool = artifacts.require("./AaveExternalPool.sol");
var FutureToken = artifacts.require("./FutureToken.sol");

//Kovan dai
const DAI_ADDRESS = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";


module.exports = function(deployer) {
  deployer.deploy(FutureToken,
    "0x21d0c79c5be59af6d61c262286809d0b78d1e156", //Interest rates oracle
    AaveExternalPool.address,
    DAI_ADDRESS);
};
