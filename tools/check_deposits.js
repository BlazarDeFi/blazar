const fs = require('fs');
const ethers = require('ethers');
const FUTURE_TOKEN =  require('../build/contracts/FutureToken.json');

const ETH_ADDRESS = "0x000000000000000000000000000000000000000E";

const mnemonic = fs.readFileSync("../.secret").toString().trim();

let provider = new ethers.providers.InfuraProvider('kovan', "4151b2d00d774670adf72249002fae04");
let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
let wallet = mnemonicWallet.connect(provider);


provider.getBlockNumber().then((blockNumber) => {
  console.log("Current block number: " + blockNumber);
});

let futureToken = new ethers.Contract("0xA871B3DE11DC65268d746588E33c49A40E18b4A0", FUTURE_TOKEN.abi, wallet);




async function deposit() {
  let tx = await futureToken.deposit(1000, 1, {value: 1000});
  console.log(tx);
}

deposit();

