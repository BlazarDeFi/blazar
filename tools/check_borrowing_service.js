const fs = require('fs');
const ethers = require('ethers');
const BORROWING_SERVICE =  require('../build/contracts/BorrowingService.json');

const DAI_ADDRESS = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";
const ETH_ADDRESS = "0x000000000000000000000000000000000000000E";

const mnemonic = fs.readFileSync("../.secret").toString().trim();

let provider = new ethers.providers.InfuraProvider('kovan', "4151b2d00d774670adf72249002fae04");
let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
let wallet = mnemonicWallet.connect(provider);


provider.getBlockNumber().then((blockNumber) => {
  console.log("Current block number: " + blockNumber);
});

let borrowing = new ethers.Contract(BORROWING_SERVICE.networks["42"].address, BORROWING_SERVICE.abi, wallet);


async function checkOwnBalance() {
  let address = await wallet.getAddress();
  let balance = await wallet.getBalance();
  console.log("Own balance (ETH) " + address + " : " + balance.toString());
}

async function checkCollateralPrice() {
  let collateralPrice = await borrowing.getCollateralPrice(ETH_ADDRESS);
  console.log("Eth price as collateral: " + collateralPrice.toString());
}

async function checkCollateralRatio() {
  let collateralRatio = await borrowing.getCollateralRatio(ETH_ADDRESS);
  console.log("Collateral ratio: " + collateralRatio.toString());
}

async function checkCollateralCalculations() {
  let wei = ethers.utils.parseEther('1');
  let collateralAmount = await borrowing.getRequiredCollateral(ETH_ADDRESS, wei);
  console.log("Calculated collateral: " + collateralAmount.toString());
}

async function borrowDai() {
  let wei = ethers.utils.parseEther('1');
  let collateralAmount = await borrowing.getRequiredCollateral(ETH_ADDRESS, wei);
  borrowing.borrow(wei, ETH_ADDRESS, {value: collateralAmount, gasLimit:5000000})
    .then(function(res){
      console.log(res);
    }).catch(function(err){
      console.log(err);
  });
}


checkOwnBalance();
checkCollateralPrice();
checkCollateralRatio();
checkCollateralCalculations();

borrowDai();

