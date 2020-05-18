var AaveExternalPool = artifacts.require("./AaveExternalPool.sol");
var FutureToken = artifacts.require("./FutureToken.sol");

//Kovan dai
const DAI_ADDRESS = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";


module.exports = function(deployer) {
  deployer.deploy(FutureToken,
    "0xBC773Ca86D9071e163168a8A5aD25e235907F9e7", //Interest rates oracle
    AaveExternalPool.address,
    DAI_ADDRESS);
};
