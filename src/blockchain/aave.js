import { getLendingPool, getInterestRatesStrategy} from "./contracts.js";
import {getMainAccount} from "./network";
import deployment from './deployment.json';


export async function getLendingData() {
  console.log("Getting lending deta");
  let pool = await getLendingPool();
  let main = await getMainAccount();
  let data = await pool.getUserAccountData(main);

  console.log(data);
}

export async function getLendingConfig() {
  console.log("Getting lending config");
  let pool = await getLendingPool();
  let data = await pool.getReserveConfigurationData(deployment.RESERVE);

  console.log(data);
}

export async function getReserveData() {
  console.log("Getting reserve data");
  let pool = await getLendingPool();
  let data = await pool.getReserveData(deployment.RESERVE);

  console.log("Aave deposit rate: " + data.liquidityRate.toString());
}

export async function depositDai() {
  console.log("Getting reserve data");
  let pool = await getLendingPool();
  let wei = web3.toWei(1, 'ether');
  let tx = await pool.deposit(deployment.DAI_RESERVE, wei, 0);
  console.log(tx);
}




