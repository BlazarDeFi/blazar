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



  it("should calculate warping price", async function () {
    (await ft.getWarpPrice(100, 1)).should.be.bignumber.equal("1");
    (await ft.getWarpPrice(100, 3)).should.be.bignumber.equal("3");
    (await ft.getWarpPrice(100, 7)).should.be.bignumber.equal("7");
    (await ft.getWarpPrice(100, 12)).should.be.bignumber.equal("12");
  });


  it("should deposit in current period", async function () {
    (await ft.balanceOf(owner, 0)).should.be.bignumber.equal('0');

    await ft.deposit(100, 0, {value: 100});

    (await ft.balanceOf(owner, 2)).should.be.bignumber.equal("100");
    (await ft.getTotalInterests()).should.be.bignumber.equal("0");

    //External pool
    (await pool.balanceOf(ft.address)).should.be.bignumber.equal("100");
    (await web3.eth.getBalance(pool.address)).should.be.equal("100");
  });


  it("should warp money forward", async function () {
    await ft.warp(100, 2, 7);

    (await ft.balanceOf(owner, 2)).should.be.bignumber.equal("0");
    (await ft.getTotalInterests()).should.be.bignumber.equal("5");
    (await ft.balanceOf(owner, 7)).should.be.bignumber.equal("100");

    //External pool
    (await pool.balanceOf(ft.address)).should.be.bignumber.equal("95");
    (await web3.eth.getBalance(pool.address)).should.be.equal("95");
  });


  it("should warp money backward", async function () {
    await ft.warp(100, 7, 2, {value: 5});

    (await ft.balanceOf(owner, 2)).should.be.bignumber.equal("100");
    (await ft.getTotalInterests()).should.be.bignumber.equal("0");
    (await ft.balanceOf(owner, 7)).should.be.bignumber.equal("0");

    //External pool
    (await pool.balanceOf(ft.address)).should.be.bignumber.equal("100");
    (await web3.eth.getBalance(pool.address)).should.be.equal("100");
  });


  it("should withdraw the money", async function () {
    await ft.withdraw(100);

    (await ft.balanceOf(owner, 2)).should.be.bignumber.equal("0");
    (await ft.getTotalInterests()).should.be.bignumber.equal("0");
  });

});



