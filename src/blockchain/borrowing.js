import {getBorrowingService} from "./contracts.js";
import {getMainAccount} from "./network";
import state from "@/state";
import {getFutureToken} from "./contracts";

const ETH_ADDRESS = "0x000000000000000000000000000000000000000E";

export async function getBorrowingRate() {
  let borrowing = await getBorrowingService();
  let rate = (await borrowing.interestRate())/100;
  console.log("Current borrowing rate: " + rate);
  state.currencies.dai.borrowingRate = rate;
}


export async function borrow(_amount, _time, _borrowingCurrency, _collateralCurrency) {
  console.log("Borrowing: " + _amount + " " + _borrowingCurrency + " for: " + _time + " months using collateral: " + _collateralCurrency);
  let borrowing = await getBorrowingService();
  let wei = web3.toWei(_amount, 'ether');
  let collateral = await borrowing.getRequiredCollateral(ETH_ADDRESS, wei);
  let tx = await borrowing.borrow(wei, ETH_ADDRESS, _time, {value: collateral, gasLimit:5000000});
  console.log(tx);
}


export async function getLoans() {
  let borrowing = await getBorrowingService();
  let main = await getMainAccount();
  let currentPeriod = await borrowing.getCurrentPeriod();
  console.log("Current period: " + currentPeriod.toString());
  let loans = await borrowing.getUserDebt12months(main, currentPeriod);
  loans = loans.map( item => {
    return  web3.fromWei(item, 'ether')
  });

  console.log(loans);
  return loans;
}






