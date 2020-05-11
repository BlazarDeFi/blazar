import {getFutureToken, getChainLinkEth } from "./contracts.js";
import state from "@/state";


const CHAINLINK_PRECISION = 100000000;
const SCALING_FACTOR = 1;
const CURRENCIES = ['ETH'];
const ETH_QUERY_URL = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=88ef2a2548eace3ed76a7b5f2999c24fd90a204df704d3773fc0c76caa587c52';

async function getTreasure(currency) {
  let ft = await getFutureToken(currency);
  let b = await ft.getTotalCollateral();
  return web3.fromWei(b, 'ether');
}

export async function getTreasures() {
  console.log("Getting treasure...");
  var treasure = {};
  treasure['ETH'] = await getTreasure('ETH');
  treasure['DAI'] = await getTreasure('DAI');
  return treasure;
}


export async function getAssetPrice(currency) {
  let chainLink = await getChainLinkEth();
  let rawPrice = await chainLink.latestAnswer();
  let price = rawPrice / CHAINLINK_PRECISION;
  console.log("Getting price from Chainlink for " + currency + " : " + price);
  return price;
}


export async function getEthPrice() {
  let response = await fetch(ETH_QUERY_URL);
  let data = await response.json();


  await getAssetPrice('ETH');

  return data.USD;
}

export async function getDepositRate(currency) {
  let ft = await getFutureToken(currency);
  let ir = await ft.interestRate();
  return ir.toNumber()/100;
}

export async function getDepositRates() {
  console.log("Getting interest rates...");
  state.currencies.eth.rate = await getDepositRate('ETH');
  state.currencies.dai.rate = await getDepositRate('DAI');
}

export function calculateInterest(amount, period, currency) {
  let formula = (100+(currency.rate*Math.abs(period)/12))/100;
  console.log("F: " + formula);
  let interest =  Math.sign(period) * (amount * formula - amount);
  console.log("Calculate " + amount + " " + currency.title + " for: " + period + " = " + interest);
  return interest;
}
