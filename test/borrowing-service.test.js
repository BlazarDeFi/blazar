var BorrowingService = artifacts.require("BorrowingService");
var MockPool = artifacts.require("MockExternalPool");
var MockDai = artifacts.require("MockDaiToken");
var MockAssetsPriceProvider = artifacts.require("MockAssetsPriceProvider");

const ETH_ADDRESS = "0x000000000000000000000000000000000000000E";


require("./test-setup");

contract('Borrowing service', function ([owner, oracle, borrower]) {
  var borrowing, pool, dai, priceProvider;
  var currentPeriod, period1plus;

  before("deploy borrowing service", async function () {
    pool = await MockPool.new();
    dai = await MockDai.new();
    priceProvider = await MockAssetsPriceProvider.new();

    borrowing = await BorrowingService.new(dai.address, oracle, pool.address, priceProvider.address);
  });

  it("should calculate correct period", async function () {
    currentPeriod = parseInt(await borrowing.getCurrentPeriod());
    period1plus = currentPeriod + 1;
    console.log("Current period: " + currentPeriod + " in 1 months: " + period1plus);
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

    await borrowing.borrow(1000, ETH_ADDRESS, 1, {value: 30, from: borrower});

    (await web3.eth.getBalance(pool.address)).should.be.equal("30");
    (await dai.balanceOf(borrower)).should.be.bignumber.equal('1000');

  });


  it("should register borrowings", async function () {
    (await borrowing.getUserDebt(borrower, currentPeriod)).should.be.bignumber.equal('0');
    (await borrowing.getUserDebt(borrower, period1plus)).should.be.bignumber.equal('1000');

    (await borrowing.getTotalDebt(currentPeriod)).should.be.bignumber.equal('0');
    (await borrowing.getTotalDebt(period1plus)).should.be.bignumber.equal('1000');

    (await borrowing.getUserDebt12months(borrower, currentPeriod)).forEach( (item, index) => {
      item.should.be.bignumber.equal(index === 1 ? '1000' : '0');
    });

  });





});
