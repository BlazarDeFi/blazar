var FT = artifacts.require("FutureToken");
var MockPool = artifacts.require("MockExternalPool");

const ETH_ADDRESS = "0x000000000000000000000000000000000000000E";

require("./test-setup");

contract('Future token ETH', function ([owner, oracle]) {
  var ft, pool;
  var currentPeriod, period1plus, period5plus;

  before("deploy future token", async function () {
    pool = await MockPool.new(ETH_ADDRESS);
    ft = await FT.new(oracle, pool.address, ETH_ADDRESS);
  });

  it("should set interest rate", async function () {
    await ft.setInterestRates(1200, {from: oracle});

    (await ft.interestRate()).should.be.bignumber.equal("1200");
  });


  it("should calculate correct period", async function () {
    currentPeriod = parseInt(await ft.getCurrentPeriod());
    period5plus = currentPeriod + 5;
    period1plus = currentPeriod + 1;
  });



  it("should calculate warping price", async function () {
    (await ft.getWarpPrice(100, 1)).should.be.bignumber.equal("1");
    (await ft.getWarpPrice(100, 3)).should.be.bignumber.equal("3");
    (await ft.getWarpPrice(100, 7)).should.be.bignumber.equal("7");
    (await ft.getWarpPrice(100, 12)).should.be.bignumber.equal("12");
  });


  it("should deposit in current period", async function () {
    (await ft.balanceOf(owner, 0)).should.be.bignumber.equal('0');

    await ft.deposit(100, 0, {value: 100});

    (await ft.balanceOf(owner, currentPeriod)).should.be.bignumber.equal("100");
    (await ft.getTotalInterests()).should.be.bignumber.equal("0");

    //External pool
    (await ft.getTotalCollateral()).should.be.bignumber.equal("100");
    (await web3.eth.getBalance(pool.address)).should.be.equal("100");
  });


  it("should warp money forward", async function () {
    await ft.warp(100, currentPeriod, period5plus);

    (await ft.balanceOf(owner, currentPeriod)).should.be.bignumber.equal("0");
    (await ft.getTotalInterests()).should.be.bignumber.equal("5");
    (await ft.balanceOf(owner, period5plus)).should.be.bignumber.equal("100");

    //External pool
    (await ft.getTotalCollateral()).should.be.bignumber.equal("95");
    (await web3.eth.getBalance(pool.address)).should.be.equal("95");
  });


  it("should warp money backward", async function () {
    await ft.warp(80, period5plus, currentPeriod, {value: 4});

    (await ft.balanceOf(owner, currentPeriod)).should.be.bignumber.equal("80");
    (await ft.getTotalInterests()).should.be.bignumber.equal("1");
    (await ft.balanceOf(owner, period5plus)).should.be.bignumber.equal("20");

    //External pool
    (await ft.getTotalCollateral()).should.be.bignumber.equal("99");
    (await web3.eth.getBalance(pool.address)).should.be.equal("99");
  });


  it("should withdraw the money from current period", async function () {
    await ft.withdraw(80, currentPeriod);

    (await ft.balanceOf(owner, currentPeriod)).should.be.bignumber.equal("0");
    (await ft.balanceOf(owner, period5plus)).should.be.bignumber.equal("20");
    (await ft.getTotalInterests()).should.be.bignumber.equal("1");
  });


  it("should withdraw the money from past period", async function () {
    await ft.withdraw(20, period5plus, {value: 1});

    (await ft.balanceOf(owner, currentPeriod)).should.be.bignumber.equal("0");
    (await ft.balanceOf(owner, period5plus)).should.be.bignumber.equal("0");
    (await ft.getTotalInterests()).should.be.bignumber.equal("0");
  });

});



