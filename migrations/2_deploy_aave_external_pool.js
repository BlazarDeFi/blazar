var AaveKovanDeployment = artifacts.require("./AaveKovanDeployment.sol");
var AaveExternalPool = artifacts.require("./AaveExternalPool.sol");


module.exports = function(deployer) {
  deployer.deploy(AaveKovanDeployment);
  deployer.link(AaveKovanDeployment, AaveExternalPool);
  deployer.deploy(AaveExternalPool, "0x580d4fdc4bf8f9b5ae2fb9225d584fed4ad5375c");
};
