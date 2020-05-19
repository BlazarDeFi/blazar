import contract from "truffle-contract";
import { getWeb3, getMainAccount } from "./network.js";

import LENDING_POOL_JSON from '@contracts/LendingPool.json'
import AAVE_EXTERNAL_POOL_JSON from '@contracts/AaveExternalPool.json'
import FUTURE_TOKEN_JSON from '@contracts/FutureToken.json'
import IR_STRATEGY_JSON from '@contracts/DefaultReserveInterestRateStrategy.json'
import ERC20_JSON from '@contracts/ERC20.json'
import CHAINLINK_JSON from '@contracts/AggregatorInterface.json'
import BORROWING_JSON from '@contracts/BorrowingService.json'

import deployment from './deployment.json';

var setup = async function(json) {
  let web3 = await getWeb3();
  let main = await getMainAccount();
  let c = contract(json);
  c.setProvider(web3.currentProvider);
  c.defaults({
    from: main,
    gas: 7000000
  });
  return c;
};

var ir, dai, pool, borrowingService;
let ft = {};
let bt = {};
let chainLink = {};

export async function getFUTURE_TOKEN() {
  return await setup(FUTURE_TOKEN_JSON);
}

export async function getCHAINLINK() {
  return await setup(CHAINLINK_JSON);
}

export async function getAAVE_EXTERNAL_POOL() {
  return await setup(AAVE_EXTERNAL_POOL_JSON);
}

export async function getERC20() {
  return await setup(ERC20_JSON);
}

export async function getBORROWING() {
  return await setup(BORROWING_JSON);
}

export async function getLendingPool() {
  if (pool === undefined) {
    let LENDING_POOL = await setup(LENDING_POOL_JSON);
    pool = await LENDING_POOL.at(deployment.LENDING_POOL);
    console.log("Linked lending pool: " + pool.address);
  }
  return pool;
}

export async function getInterestRatesStrategy() {
  if (ir === undefined) {
    let IR = await setup(IR_STRATEGY_JSON);
    ir = await FC.at(deployment.INTEREST_RATES_STRATEGY);
    console.log("Linked interest rates strategy: " + ir.address);
  }
  return ir;
}


export async function getFutureToken(currency) {
  console.log("Getting future token contract for: " + currency);
  if (ft[currency] === undefined) {
    let FT = await setup(FUTURE_TOKEN_JSON);
    ft[currency] = await FT.at(deployment['FUTURE_TOKEN_' + currency]);
    console.log("Linked future token " + currency + ": " + ft[currency].address);
  }
  return ft[currency];
}


export async function getBackingToken(currency) {
  console.log("Getting backing token contract for: " + currency);
  if (bt[currency] === undefined) {
    let ft = await getFutureToken(currency);
    let address = await ft.backingAsset();
    let ERC20 = await getERC20();
    bt[currency] = await ERC20.at(address);
    console.log("Linked backing token " + currency + ": " + bt[currency].address);
  }
  return bt[currency];
}


export async function getExternalPool() {
  let EXTERNAL_POOL = await getAAVE_EXTERNAL_POOL();
  let pool = await EXTERNAL_POOL.at(deployment.A_EXTERNAL_POOL);
  return pool;
}


export async function getDaiToken() {
  if (dai === undefined) {
    let DAI = await getERC20();
    dai = await DAI.at(deployment.DAI);
    console.log("Linked dai token: " + dai.address);
  }
  return dai;
}


export async function getChainLink(currency) {
  if (chainLink[currency] === undefined) {
    let CHAINLINK = await getCHAINLINK();
    chainLink[currency] = await CHAINLINK.at(deployment["CHAINLINK_" + currency.toUpperCase()]);
    console.log("Linked chainlink- " + currency + " : " + chainLink.address);
  }
  return chainLink[currency];
}


export async function getBorrowingService() {
  if (borrowingService === undefined) {
    let BORROWING = await getBORROWING();
    borrowingService = await BORROWING.at(deployment.BORROWING_SERVICE);
    console.log("Borrowing service linked: " + borrowingService.address);
  }
  return borrowingService;
}





