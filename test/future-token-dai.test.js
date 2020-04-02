var FT = artifacts.require("FutureToken");
var MockPool = artifacts.require("MockExternalPool");
var MockDai = artifacts.require("MockDaiToken");


require("./test-setup");

contract('Future token DAI', function ([owner, oracle]) {
  var ft, pool, dai;
  var currentPeriod, period1plus, period6plus;

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
    currentPeriod = parseInt(await ft.getCurrentPeriod());
    period6plus = currentPeriod + 6;
    period1plus = currentPeriod + 1;
    console.log("Current period: " + currentPeriod + " in 6 months: " + period6plus);
  });


  it("should mint and approve", async function () {
    await dai.mint(owner, 100);
    //Max value approval
    await dai.approve(ft.address, 1000000);
  });


  it("should deposit in current period", async function () {
    (await ft.balanceOf(owner, 0)).should.be.bignumber.equal('0');

    await ft.deposit(100, 0);

    (await ft.balanceOf(owner, currentPeriod)).should.be.bignumber.equal('100');
    (await ft.getTotalInterests()).should.be.bignumber.equal('0');

    (await ft.getTotalCollateral()).should.be.bignumber.equal('100');
    (await dai.balanceOf(pool.address)).should.be.bignumber.equal('100');
  });


  it("should withdraw money", async function () {
    await ft.withdraw(50, currentPeriod);

    //Depositor
    (await dai.balanceOf(owner)).should.be.bignumber.equal('50');
    //Pool
    (await ft.balanceOf(owner, currentPeriod)).should.be.bignumber.equal('50');
    (await ft.getTotalCollateral()).should.be.bignumber.equal('50');
    (await dai.balanceOf(pool.address)).should.be.bignumber.equal('50');
  });


  it("should warp money to future", async function () {
    await ft.warp(50, currentPeriod, period6plus);

    //Future tokens
    (await ft.balanceOf(owner, currentPeriod)).should.be.bignumber.equal('0');
    (await ft.balanceOf(owner, period6plus)).should.be.bignumber.equal('50');
    //Depositor
    (await dai.balanceOf(owner)).should.be.bignumber.equal('53');
    //Pool
    (await ft.getTotalCollateral()).should.be.bignumber.equal('47');
    (await dai.balanceOf(pool.address)).should.be.bignumber.equal('47');
  });



  it("should warp money to present", async function () {
    await ft.warp(50, period6plus, period1plus);

    //Future tokens
    (await ft.balanceOf(owner, period1plus)).should.be.bignumber.equal('50');
    (await ft.balanceOf(owner, period6plus)).should.be.bignumber.equal('0');
    //Depositor
    (await dai.balanceOf(owner)).should.be.bignumber.equal('51');
    //Pool
    (await ft.getTotalCollateral()).should.be.bignumber.equal('49');
    (await dai.balanceOf(pool.address)).should.be.bignumber.equal('49');
  });


  it("should withdraw rest of the money", async function () {
    await ft.withdraw(50, period1plus);

    //Future tokens
    (await ft.balanceOf(owner, period1plus)).should.be.bignumber.equal('0');
    (await ft.balanceOf(owner, period6plus)).should.be.bignumber.equal('0');
    //Depositor
    (await dai.balanceOf(owner)).should.be.bignumber.equal('100');
    //Pool
    (await ft.getTotalCollateral()).should.be.bignumber.equal('0');
    (await dai.balanceOf(pool.address)).should.be.bignumber.equal('0');
  });

});
