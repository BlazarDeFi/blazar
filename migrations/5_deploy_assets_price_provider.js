var AaveExternalPool = artifacts.require("./AaveExternalPool.sol");
var ChainlinkPriceProvider = artifacts.require("./ChainlinkPriceProvider.sol");

//Kovan dai
const DAI_ADDRESS = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";
const ETH_ADDRESS = "0x000000000000000000000000000000000000000E";


module.exports = function(deployer) {
  deployer.deploy(ChainlinkPriceProvider).then(function(instance) {
    instance.setChainlinkAggregator(ETH_ADDRESS, "0xD21912D8762078598283B14cbA40Cb4bFCb87581");
    instance.setChainlinkAggregator(DAI_ADDRESS, "0x7418A1a6E7dA5228c8DcC0eFfd0B68bE27695E9f");
  });
};

