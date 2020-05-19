import {getBorrowingService} from "./contracts.js";
import {getMainAccount} from "./network";
import state from "@/state";

export async function getBorrowingRate() {
  let borrowing = await getBorrowingService();
  let rate = (await borrowing.interestRate())/100;
  console.log("Current borrowing rate: " + rate);
  state.currencies.dai.borrowingRate = rate;
}


export async function borrow(_amount, _time, _currency) {
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






