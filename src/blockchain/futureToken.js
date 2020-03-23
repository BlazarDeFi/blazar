import {getFutureToken} from "./contracts.js";
import {getMainAccount} from "./network";

const SCALING_FACTOR = 1;
const CURRENCIES = ['ETH'];

export async function getLendingData() {
  console.log("Getting lending deta");
  let fc = await getFutureCoin();
  let main = await getMainAccount();
  let data = await fc.getLendingPoolData(main);

  console.log(data);
}

export async function makeDeposit(_amount, _time) {
  console.log("Depositing: " + _amount + " for: " + _time + " months");
  let ft = await getFutureToken();
  let wei = web3.toWei(_amount / SCALING_FACTOR, 'ether');
  let tx = await ft.deposit(wei, _time, {value: wei});

  console.log(tx);
}

export async function spaceTransfer(_to, _id, _amount) {
  console.log("Transfering in space: " + _amount + " to: " + _to + " from period: " + _id);
  let fc = await getFutureToken();
  let wei = web3.toWei(_amount / SCALING_FACTOR, 'ether');
  let tx = await fc.spaceTransfer(_to, _id, wei);

  console.log(tx);
}

export async function timeTransfer(_to, _id, _amount) {
  console.log("Transferring in time: " + _amount + " to: " + _to + " from period: " + _id);
  let fc = await getFutureToken();
  let wei = web3.toWei(_amount / SCALING_FACTOR, 'ether');
  let price = _to < _id ? await fc.getWarpPrice(wei, _id - _to, false) : 0;
  console.log("Paying price: " + price);
  let tx = await fc.warp(wei, _id, _to, {value: price});

  console.log(tx);
}

export async function withdraw(_amount) {
  console.log("Withdraw: " + _amount);
  let fc = await getFutureToken();
  let wei = web3.toWei(_amount / SCALING_FACTOR, 'ether');
  let tx = await fc.withdraw(wei);

  console.log(tx);
}

async function getBalance(account, currency) {
  let ft = await getFutureToken(currency);
  let rawBalances = await ft.balancesOfYear(account);


  let total = 0;
  let balances = rawBalances.map(b => {
    let f = web3.fromWei(b, 'ether') * SCALING_FACTOR;
    total += f;
    return f;
  });


  balances[12] = total;
  if (total > 0) {
    let rawInterests = await ft.getTotalInterests();
    balances[77] = web3.fromWei(rawInterests, 'ether') * SCALING_FACTOR;
  }
  console.log(balances);
  return balances;
}

export async function getBalances() {
  console.log("Getting balances...");
  let main = await getMainAccount();
  var balances = {};
  balances['ETH'] = await getBalance(main, 'ETH');
  return balances;
}
