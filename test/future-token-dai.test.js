var FT = artifacts.require("FutureToken");
var MockPool = artifacts.require("MockExternalPool");
var MockDai = artifacts.require("MockDaiToken");


require("./test-setup");

contract('Future token DAI', function ([owner, oracle]) {
  var ft, currentPeriod, pool, dai;

  before("deploy future token", async function () {
    pool = await MockPool.new();
    dai = await MockDai.new();
    ft = await FT.new(oracle, pool.address, dai.address);
  });

  it("should set interest rate", async function () {
    await ft.setInterestRates(1200, {from: oracle});

    (await ft.interestRate()).should.be.bignumber.equal("1200");
  });


  it("should calculate correct period", async function () {
    currentPeriod = await ft.getCurrentPeriod();
    currentPeriod.should.be.bignumber.equal("2");
  });


  it("should mint and approve", async function () {
    await dai.mint(owner, 100);
    //Max value approval
    await dai.approve(ft.address, 1000000);
  });


  it("should deposit in current period", async function () {
    (await ft.balanceOf(owner, 0)).should.be.bignumber.equal('0');

    await ft.deposit(100, 0);

    (await ft.balanceOf(owner, 2)).should.be.bignumber.equal('100');
    (await ft.getTotalInterests()).should.be.bignumber.equal('0');

    (await pool.balanceOf(ft.address)).should.be.bignumber.equal('100');
    (await dai.balanceOf(pool.address)).should.be.bignumber.equal('100');
  });


  it("should withdraw money", async function () {
    await ft.withdraw(50);

    //Depositor
    (await dai.balanceOf(owner)).should.be.bignumber.equal('50');
    //Pool
    (await ft.balanceOf(owner, 2)).should.be.bignumber.equal('50');
    (await pool.balanceOf(ft.address)).should.be.bignumber.equal('50');
    (await dai.balanceOf(pool.address)).should.be.bignumber.equal('50');
  });


  it("should warp money to future", async function () {
    await ft.warp(50, 2, 8);

    //Future tokens
    (await ft.balanceOf(owner, 2)).should.be.bignumber.equal('0');
    (await ft.balanceOf(owner, 8)).should.be.bignumber.equal('50');
    //Depositor
    (await dai.balanceOf(owner)).should.be.bignumber.equal('53');
    //Pool
    (await pool.balanceOf(ft.address)).should.be.bignumber.equal('47');
    (await dai.balanceOf(pool.address)).should.be.bignumber.equal('47');
  });


  it("should warp money to present", async function () {
    await ft.warp(50, 8, 2);

    //Future tokens
    (await ft.balanceOf(owner, 2)).should.be.bignumber.equal('50');
    (await ft.balanceOf(owner, 8)).should.be.bignumber.equal('0');
    //Depositor
    (await dai.balanceOf(owner)).should.be.bignumber.equal('50');
    //Pool
    (await pool.balanceOf(ft.address)).should.be.bignumber.equal('50');
    (await dai.balanceOf(pool.address)).should.be.bignumber.equal('50');
  });

});
