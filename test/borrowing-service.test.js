var BorrowingService = artifacts.require("BorrowingService");
var MockPool = artifacts.require("MockExternalPool");
var MockDai = artifacts.require("MockDaiToken");
var MockAssetsPriceProvider = artifacts.require("MockAssetsPriceProvider");

const ETH_ADDRESS = "0x000000000000000000000000000000000000000E";


require("./test-setup");

contract('Borrowing service', function ([owner, oracle, borrower]) {
  var borrowing, pool, dai, priceProvider;

  before("deploy borrowing service", async function () {
    pool = await MockPool.new();
    dai = await MockDai.new();
    priceProvider = await MockAssetsPriceProvider.new();

    borrowing = await BorrowingService.new(dai.address, oracle, pool.address, priceProvider.address);
  });

  it("should set asset price", async function () {
    await priceProvider.setAssetPrice(ETH_ADDRESS, 100);
    await priceProvider.setAssetPrice(dai.address, 2);

    (await priceProvider.getAssetPrice(ETH_ADDRESS)).should.be.bignumber.equal("100");
    (await priceProvider.getAssetPrice(dai.address)).should.be.bignumber.equal("2");
  });

  it("should set collateral ratio", async function () {
    await borrowing.setCollateralRatio(ETH_ADDRESS, 150);

    (await borrowing.getCollateralRatio(ETH_ADDRESS)).should.be.bignumber.equal("150");
  });


  it("should fetch collateral price", async function () {

    (await borrowing.getCollateralPrice(ETH_ADDRESS)).should.be.bignumber.equal("100");

  });


  it("should calculate required min collateral", async function () {
    // Borrowed value = 1000 dai * 2USD/dai = 2000 USD
    // Collateral value = 2000USD * 150% = 3000
    // Collateral amount = 3000USD / 100USD/eth = 30 ETH
    (await borrowing.getRequiredCollateral(ETH_ADDRESS, 1000)).should.be.bignumber.equal("30");
  });


  it("should borrow funds", async function () {
    await dai.mint(pool.address, 1000);
    (await dai.balanceOf(pool.address)).should.be.bignumber.equal('1000');

    await borrowing.borrow(1000, dai.address, ETH_ADDRESS, {value: 30, from: borrower});

    (await web3.eth.getBalance(pool.address)).should.be.equal("30");
    (await dai.balanceOf(borrower)).should.be.bignumber.equal('1000');

  });



  //
  //
  // it("should mint and approve", async function () {
  //   await dai.mint(owner, 100);
  //   //Max value approval
  //   await dai.approve(ft.address, 1000000);
  // });
  //
  //
  // it("should deposit in current period", async function () {
  //   (await ft.balanceOf(owner, 0)).should.be.bignumber.equal('0');
  //
  //   await ft.deposit(100, 0);
  //
  //   (await ft.balanceOf(owner, currentPeriod)).should.be.bignumber.equal('100');
  //   (await ft.getTotalInterests()).should.be.bignumber.equal('0');
  //
  //   (await ft.getTotalCollateral()).should.be.bignumber.equal('100');
  //   (await dai.balanceOf(pool.address)).should.be.bignumber.equal('100');
  // });
  //
  //
  // it("should withdraw money", async function () {
  //   await ft.withdraw(50, currentPeriod);
  //
  //   //Depositor
  //   (await dai.balanceOf(owner)).should.be.bignumber.equal('50');
  //   //Pool
  //   (await ft.balanceOf(owner, currentPeriod)).should.be.bignumber.equal('50');
  //   (await ft.getTotalCollateral()).should.be.bignumber.equal('50');
  //   (await dai.balanceOf(pool.address)).should.be.bignumber.equal('50');
  // });
  //
  //
  // it("should warp money to future", async function () {
  //   await ft.warp(50, currentPeriod, period6plus);
  //
  //   //Future tokens
  //   (await ft.balanceOf(owner, currentPeriod)).should.be.bignumber.equal('0');
  //   (await ft.balanceOf(owner, period6plus)).should.be.bignumber.equal('50');
  //   //Depositor
  //   (await dai.balanceOf(owner)).should.be.bignumber.equal('53');
  //   //Pool
  //   (await ft.getTotalCollateral()).should.be.bignumber.equal('47');
  //   (await dai.balanceOf(pool.address)).should.be.bignumber.equal('47');
  // });
  //
  //
  //
  // it("should warp money to present", async function () {
  //   await ft.warp(50, period6plus, period1plus);
  //
  //   //Future tokens
  //   (await ft.balanceOf(owner, period1plus)).should.be.bignumber.equal('50');
  //   (await ft.balanceOf(owner, period6plus)).should.be.bignumber.equal('0');
  //   //Depositor
  //   (await dai.balanceOf(owner)).should.be.bignumber.equal('51');
  //   //Pool
  //   (await ft.getTotalCollateral()).should.be.bignumber.equal('49');
  //   (await dai.balanceOf(pool.address)).should.be.bignumber.equal('49');
  // });
  //
  //
  // it("should withdraw rest of the money", async function () {
  //   await ft.withdraw(50, period1plus);
  //
  //   //Future tokens
  //   (await ft.balanceOf(owner, period1plus)).should.be.bignumber.equal('0');
  //   (await ft.balanceOf(owner, period6plus)).should.be.bignumber.equal('0');
  //   //Depositor
  //   (await dai.balanceOf(owner)).should.be.bignumber.equal('100');
  //   //Pool
  //   (await ft.getTotalCollateral()).should.be.bignumber.equal('0');
  //   (await dai.balanceOf(pool.address)).should.be.bignumber.equal('0');
  // });

});
