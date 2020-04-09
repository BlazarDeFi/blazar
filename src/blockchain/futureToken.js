import {getFutureToken, getBackingToken} from "./contracts.js";
import {getMainAccount} from "./network";
import state from "@/state";

const SCALING_FACTOR = 1;
const CURRENCIES = ['ETH'];

export async function getLendingData() {
  console.log("Getting lending deta");
  let fc = await getFutureCoin();
  let main = await getMainAccount();
  let data = await fc.getLendingPoolData(main);

  console.log(data);
}

export async function makeDeposit(_amount, _time, _currency) {
  console.log("Depositing: " + _amount + " of: " + _currency + " for: " + _time + " months");
  let ft = await getFutureToken(_currency);
  let wei = web3.toWei(_amount / SCALING_FACTOR, 'ether');

  if (_currency !== 'ETH') {
    let main = await getMainAccount();
    let bt = await getBackingToken(_currency);
    let allowance = await bt.allowance(main, ft.address);
    console.log("Allowance of " + _currency + " : " + web3.fromWei(allowance, 'ether'));
    if (allowance == 0) {
      await bt.approve(ft.address, web3.toWei(1000, 'ether'));
    }
    let tx = await ft.deposit(wei, _time);
    console.log(tx);
  } else {
    let tx = await ft.deposit(wei, _time, {value: wei});
    console.log(tx);
  }

}

export async function spaceTransfer(_to, _id, _amount, _currency) {
  console.log("Transfering in space: " + _amount + " to: " + _to + " from period: " + _id);
  let fc = await getFutureToken(_currency);
  let wei = web3.toWei(_amount / SCALING_FACTOR, 'ether');
  let tx = await fc.spaceTransfer(_to, _id, wei);

  console.log(tx);
}

export async function timeTransfer(_to, _id, _amount, _currency) {
  console.log("Transferring " + _currency + " in time: " + _amount + " to: " + _to + " from period: " + _id);
  let ft = await getFutureToken(_currency);
  let wei = web3.toWei(_amount / SCALING_FACTOR, 'ether');
  let price = _to < _id ? await ft.getWarpPrice(wei, _id - _to) : 0;
  console.log("Paying price: " + price);
  let tx = await ft.warp(wei, _id, _to, {value: _currency === 'ETH' ? price : 0});
  console.log(tx);
}

export async function withdraw(_amount, _from, _currency) {
  console.log("Withdraw: " + _amount);
  let ft = await getFutureToken(_currency);
  let wei = web3.toWei(_amount / SCALING_FACTOR, 'ether');
  var tx;
  if (_currency === 'ETH') {
    let period = _from - 3;
    let price = await ft.getWarpPrice(wei, period);
    console.log("Withdrawal price for period: " + period +" : " + web3.toWei(price, 'ether'));
    tx = await ft.withdraw(wei, _from, {value: price});
  } else {
    tx = await ft.withdraw(wei, _from);
  }

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
  // if (total > 0) {
  //   let rawInterests = await ft.getTotalInterests();
  //   balances[77] = web3.fromWei(rawInterests, 'ether') * SCALING_FACTOR;
  // }
  console.log(balances);
  return balances;
}

export async function getBalances() {
  console.log("Getting balances...");
  let main = await getMainAccount();
  var balances = {};
  balances['ETH'] = await getBalance(main, 'ETH');
  balances['DAI'] = await getBalance(main, 'DAI');

  return balances;
}

async function getDepositsForCurrency(_currency) {
  let ft = await getFutureToken(_currency);
  let main = await getMainAccount();
  let depositEvents = await ft.getPastEvents('Deposit', {
    address: ft.address,
    filter: {_account: main},
    fromBlock: 0,
    toBlock: 'latest'
  });
  console.log(depositEvents);
  depositEvents.forEach( event => {
    state.myActions.push({
      label: "New deposit",
      time: event.blockNumber,
      amount: web3.fromWei(event.returnValues._value, 'ether'),
      maturity: event.returnValues._period,
      interest: web3.fromWei(event.returnValues._interests, 'ether'),
      currency: state.currencies[_currency.toLowerCase()],
      tx: event.transactionHash
    });
  });
}


async function getTimeTravelsForCurrency(_currency) {
  let ft = await getFutureToken(_currency);
  let main = await getMainAccount();
  let timeTravelEvents = await ft.getPastEvents('TimeTravel', {
    address: ft.address,
    filter: {_account: main},
    fromBlock: 0,
    toBlock: 'latest'
  });
  console.log(timeTravelEvents);
  timeTravelEvents.forEach( event => {
    state.myActions.push({
      label: "Time travel",
      time: event.blockNumber,
      amount: web3.fromWei(event.returnValues._value, 'ether'),
      maturity: event.returnValues._from + "->" + event.returnValues._to,
      interest: web3.fromWei(event.returnValues._interests, 'ether'),
      currency: state.currencies[_currency.toLowerCase()],
      tx: event.transactionHash
    });
  });
}

export async function getHistory() {
  console.log("Getting history...");
  state.myActions.splice(0, state.myActions.length);
  await getDepositsForCurrency('ETH');
  await getDepositsForCurrency('DAI');

  await getTimeTravelsForCurrency('ETH');
  await getTimeTravelsForCurrency('DAI');
}


