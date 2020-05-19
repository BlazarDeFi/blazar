import {getBorrowingService} from "./contracts.js";
import {getMainAccount} from "./network";
import state from "@/state";

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
  let tx = await borrowing.borrow(wei, ETH_ADDRESS, {value: collateral, gasLimit:5000000});
  console.log(tx);
}






