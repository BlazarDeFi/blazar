const fs = require('fs');
const ethers = require('ethers');
const CHAINLINK_PRICE_PROVIDER =  require('../build/contracts/ChainlinkPriceProvider.json');

const DAI_ADDRESS = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";
const ETH_ADDRESS = "0x000000000000000000000000000000000000000E";

const mnemonic = fs.readFileSync("../.secret").toString().trim();

let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
let provider = ethers.getDefaultProvider('kovan');

provider.getBlockNumber().then((blockNumber) => {
  console.log("Current block number: " + blockNumber);
});

let priceProvider = new ethers.Contract(CHAINLINK_PRICE_PROVIDER.networks["42"].address, CHAINLINK_PRICE_PROVIDER.abi, provider);

async function check() {
  let daiPrice = await priceProvider.getAssetPrice(DAI_ADDRESS);
  console.log("Dai price on Chainlink: " + daiPrice.toString());

  let ethPrice = await priceProvider.getAssetPrice(ETH_ADDRESS);
  console.log("ETH price on Chainlink: " + ethPrice.toString());
}

check();
