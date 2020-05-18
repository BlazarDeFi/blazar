var AaveExternalPool = artifacts.require("./AaveExternalPool.sol");
var BorrowingService = artifacts.require("./BorrowingService.sol");
var ChainlinkPriceProvider = artifacts.require("./ChainlinkPriceProvider.sol");

//Kovan dai
const DAI_ADDRESS = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";
const ETH_ADDRESS = "0x000000000000000000000000000000000000000E";

module.exports = function(deployer) {
  deployer.deploy(BorrowingService,
    DAI_ADDRESS,
    "0xBC773Ca86D9071e163168a8A5aD25e235907F9e7", //Interest rates oracle
    AaveExternalPool.address,
    ChainlinkPriceProvider.address,
  ).then(function(instance) {
    instance.setCollateralRatio(ETH_ADDRESS, 300);
  })
};

