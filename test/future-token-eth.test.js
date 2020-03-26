var FT = artifacts.require("FutureToken");
var MockPool = artifacts.require("MockExternalPool");

const ETH_ADDRESS = "0x000000000000000000000000000000000000000E";

require("./test-setup");

contract('Future token ETH', function ([owner, oracle]) {
  var ft, currentPeriod, pool;

  before("deploy future token", async function () {
    pool = await MockPool.new();
    ft = await FT.new(oracle, pool.address, ETH_ADDRESS);
  });

  it("should set interest rate", async function () {
    await ft.setInterestRates(1200, {from: oracle});

    (await ft.interestRate()).should.be.bignumber.equal("1200");
  });


  it("should calculate correct period", async function () {
    currentPeriod = await ft.getCurrentPeriod();
    currentPeriod.should.be.bignumber.equal("2");
  });

  it("should mint & allow dai", async function () {
    currentPeriod = await ft.getCurrentPeriod();
    currentPeriod.should.be.bignumber.equal("2");
  });


  // it("should deposit in current period", async function () {
  //   (await ft.balanceOf(owner, 0)).should.be.bignumber.equal('0');
  //
  //   let wei100 = web3.utils.toWei("100", 'ether');
  //
  //   await ft.deposit(wei100, 0, {value: wei100});
  //
  //   (await ft.balanceOf(owner, 2)).should.be.bignumber.equal(wei100);
  //   (await ft.getTotalInterests()).should.be.bignumber.equal('0');
  //
  //   (await ft.getTotalCollateral()).should.be.bignumber.equal(wei100);
  //   web3.utils.fromWei(await web3.eth.getBalance(pool.address)).should.be.equal("100");
  // });
  //
  //
  // it("should withdraw money", async function () {
  //   let wei50 = web3.utils.toWei("50", 'ether');
  //
  //   await ft.withdraw(wei50);
  //
  //   (await ft.balanceOf(owner, 2)).should.be.bignumber.equal(wei50);
  //
  //   (await ft.getTotalCollateral()).should.be.bignumber.equal(wei50);
  //   web3.utils.fromWei(await web3.eth.getBalance(pool.address)).should.be.equal("50");
  // });
  //
  //
  // it("should warp money", async function () {
  //   let wei50 = web3.utils.toWei("50", 'ether');
  //
  //   await ft.warp(wei50, 2, 8);
  //
  //   (await ft.balanceOf(owner, 2)).should.be.bignumber.equal('0');
  //   (await ft.balanceOf(owner, 8)).should.be.bignumber.equal(wei50);
  // });
  //
  // it("should warp back money", async function () {
  //   let wei50 = web3.utils.toWei("50", 'ether');
  //
  //   await ft.warp(wei50, 8, 2, {value: web3.utils.toWei("3", 'ether')});
  //
  //   (await ft.balanceOf(owner, 2)).should.be.bignumber.equal(wei50);
  //   (await ft.getTotalInterests()).should.be.bignumber.equal('0');
  //   (await ft.balanceOf(owner, 8)).should.be.bignumber.equal('0');
  // });

});



