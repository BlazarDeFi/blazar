/* eslint-disable */
<template>
  <div class="page">

    <div style="height: 20px;"></div>


    <div class="md-layout md-gutter">

      <div class="md-layout-item">
        <md-card>
          <md-ripple>

            <md-card-header class="md-layout-item md-size-100">
              <md-card-header-text>
                <div class="md-title">Future tokens</div>
                <div class="md-subhead">
                  Each red dot indicates when your fTokens are redeemable.<br/>
                  Click on each one to transfer them or change their maturity date.
                </div>
              </md-card-header-text>


            </md-card-header>


            <md-card-content>

              <md-table>
                <md-table-row>
                  <md-table-head>Currency</md-table-head>
                  <md-table-head>Total</md-table-head>

                  <md-table-head>Apr</md-table-head>
                  <md-table-head>May</md-table-head>
                  <md-table-head>Jun</md-table-head>
                  <md-table-head>Jul</md-table-head>
                  <md-table-head>Aug</md-table-head>
                  <md-table-head>Sep</md-table-head>
                  <md-table-head>Oct</md-table-head>
                  <md-table-head>Nov</md-table-head>
                  <md-table-head>Dec</md-table-head>
                </md-table-row>

                <md-table-row v-if="balances['ETH']">
                  <md-table-cell>
                    <img src="https://testnet.aave.com/static/media/eth.1a64eee6.svg"
                         style="height: 24px; margin-right: 3px;"> ETH
                  </md-table-cell>
                  <md-table-cell><b>{{balances['ETH'][12] | fullEthToUsd}}</b></md-table-cell>
                  <md-table-cell v-for="i in 9" :key="i">
                    <md-button class="md-fab md-mini" style="color: white;"
                               v-if="balances['ETH'] && balances['ETH'][i + 2] > 0"
                               @click="transfer(balances['ETH'][i + 2], i + 2, 'ETH')">
                      {{balances['ETH'][i + 2]}}
                    </md-button>
                    <span v-else>-</span>
                  </md-table-cell>
                </md-table-row>

                <md-table-row v-if="balances['DAI']">
                  <md-table-cell>
                    <img src="https://testnet.aave.com/static/media/dai.59d423e0.svg"
                         style="height: 24px; margin-right: 3px; margin-top: -3px;"> DAI
                  </md-table-cell>
                  <md-table-cell><b>{{balances['DAI'][12] | token}}</b></md-table-cell>

                  <md-table-cell v-for="i in 9" :key="i">
                    <md-button class="md-fab md-mini" style="color: white;" v-if="balances['DAI'][i + 2] > 0"
                               @click="transfer(balances['DAI'][i + 2], i + 2, 'DAI')">
                      {{balances['DAI'][i + 2] | token}}
                    </md-button>
                    <span v-else>-</span>
                  </md-table-cell>
                </md-table-row>
              </md-table>


            </md-card-content>
          </md-ripple>
        </md-card>
      </div>
    </div>


    <md-dialog :md-active.sync="showTransferDialog" style="width: 500px; height: 380px;">
      <md-dialog-title>Transfer</md-dialog-title>


      <form novalidate>
        <div class="form-container">
          <div class="value-box">
            <md-field>
              <label for="value">Value <span class="max-link" @click="setMaxValue()">(max: {{this.selectedMax}})</span></label>
              <md-input name="value" id="spaceValue" v-model="value"/>
            </md-field>
          </div>

          <md-tabs md-dynamic-height @md-changed="onTabChange">
            <md-tab id="spaceTab" md-label="In space">

              <md-field>
                <label for="spaceAddress">Target address</label>
                <md-input name="spaceAddress" id="spaceAddress" v-model="spaceAddress"/>
              </md-field>

            </md-tab>

            <md-tab id="timeTab" md-label="In time">


              <div style="font-size: 12px; color: gray;">Target month: <b>{{timeTarget}}</b></div>
              <!--<md-input name="timeTarget" id="timeTarget" v-model="timeTarget" />-->
              <range-slider
                class="slider"
                min="4"
                max="12"
                step="1"
                v-model="timeTarget">
              </range-slider>


              <div style="font-size: 14px;" v-if="price > 0">
                You will receive:
                <span style="color: green;">
                  <b>{{price | formatCurrency(selectedCurrency)}}</b>
                </span>
              </div>

              <div style="font-size: 14px; " v-if="price < 0">
                You will need to pay:
                  <span style="color: red;">
                    <b>{{price | formatCurrency(selectedCurrency)}}</b>
                  </span>
              </div>

              <div style="font-size: 14px; color:red" v-if="price == 0">
                Please select the target period
              </div>


            </md-tab>

            <md-tab id="withdrawTab" md-label="Withdraw">
              <div style="font-size: 14px; text-align: center; margin-top: 20px;">
                You will need to pay:
                  <span style="color: red;">
                    <b>{{withdrawPrice | formatCurrency(selectedCurrency)}}</b>
                  </span>
              </div>
            </md-tab>

          </md-tabs>

          <div style="text-align: center; margin-top: 10px;">
            <md-button class="md-primary md-raised" @click="executeTransfer()" :disabled="transferTab==='timeTab' && price === 0">Transfer</md-button>
          </div>

        </div>
      </form>


    </md-dialog>

    <md-dialog :md-active.sync="showSpaceTransferModal">
      <div class="container">
        <img
          src="https://media2.giphy.com/media/pZdilWYCMEEus/giphy.gif?cid=790b761182bf4ed027d156fc665d39b1dc7b4082c2f482b6&rid=giphy.gif"
          alt="Snow" style="width:100%;">
        <div class="image-overlay">Transferring your tokens in space</div>
      </div>
    </md-dialog>

    <md-dialog :md-active.sync="showTimeTransferModal">
      <div class="container">
        <img src="https://i.giphy.com/media/xT8qB50yhFINpFTymI/giphy.webp" alt="Snow" style="width:100%;">
        <div class="image-overlay">Transferring your tokens in time ...</div>
      </div>
    </md-dialog>

    <md-dialog :md-active.sync="showWithdrawalModal" style="height: 320px;">
      <div class="container">
        <img src="https://46.media.tumblr.com/561d3c7b20c0b5263f57bb476b831710/tumblr_inline_nzs8f6PS2J1tuh146_500.gif" alt="Snow" style="width:100%;">
        <div class="image-overlay">Withdrawing tokens ...</div>
      </div>
    </md-dialog>





  </div>
</template>

<script>
  import {getBalances, spaceTransfer, timeTransfer, withdraw} from '@/blockchain/futureToken'
  import {getLendingConfig, getReserveData} from '@/blockchain/aave'
  import {deployFutureCoin} from '@/blockchain/deployer'
  import { calculateInterest, getRates } from '@/blockchain/stats'
  import RangeSlider from 'vue-range-slider'
  import State from '@/state'
  import 'vue-range-slider/dist/vue-range-slider.css'

  export default {
    name: 'Future',
    components: {
      RangeSlider
    },
    data() {
      return {
        currencies: State.currencies,
        balances: {},
        showTransferDialog: false,
        selectedMax: 0,
        selectedPeriod: 0,
        selectedCurrency: '',
        spaceAddress: "",
        value: 0,
        showSpaceTransferModal: false,
        showTimeTransferModal: false,
        showWithdrawalModal: false,
        timeTarget: 0,
        transferTab: "spaceTab"
      }
    },
    computed: {
      // a computed getter
      price: function () {
        if (this.selectedCurrency) {
          let period = this.timeTarget - this.selectedPeriod - 1;
          return calculateInterest(this.value, period, this.selectedCurrency);
        } else {
          return 0;
        }
      },
      withdrawPrice: function() {
        return calculateInterest(this.value, this.selectedPeriod-2, this.selectedCurrency);
      }
    },
    beforeCreate: async function () {
      this.balances = await getBalances();
      await getRates();
    },
    methods: {
      transfer(val, period, currency) {
        this.selectedMax = val;
        this.selectedPeriod = period;
        this.selectedCurrency = this.currencies[currency.toLowerCase()];
        this.timeTarget = period + 1;
        console.log("Transferring " + this.selectedCurrency.title + " max: " + this.selectedMax + " from: " + this.selectedPeriod);
        this.showTransferDialog = true;
      },
      onTabChange: function(id) {
        this.transferTab = id;
      },
      executeTransfer: async function() {
        if (this.transferTab === "spaceTab") {
          await this.transferInSpace();
        } else if (this.transferTab === "timeTab") {
          await this.transferInTime();
        } else {
          await this.withdraw();
        }
      },
      transferInSpace: async function () {
        console.log("Transferring in space: " + this.value + " to: " + this.spaceAddress);
        this.showTransferDialog = false;
        this.showSpaceTransferModal = true;
        await spaceTransfer(this.spaceAddress, this.selectedPeriod, this.value, this.selectedCurrency.title);
        this.showSpaceTransferModal = false;
        this.balances = await getBalances();
      },
      transferInTime: async function () {
        console.log("Transferring in time: " + this.value + " from: " + this.selectedPeriod + " to: " + this.timeTarget);
        this.showTransferDialog = false;
        this.showTimeTransferModal = true;
        try {
          await timeTransfer(this.timeTarget - 1, this.selectedPeriod, this.value, this.selectedCurrency.title);
          if (this.timeTarget - 1 > this.selectedPeriod) {
            let toast = this.$toasted.show("You've just earned $" + (this.price * 223).toFixed(2) + " interests !", {
              theme: "bubble",
              position: "top-center",
              duration: 5000,
              icon: 'sentiment_satisfied_alt'
            });
          }
          this.balances = await getBalances();
        } finally {
          this.showTimeTransferModal = false;
        }
      },
      withdraw: async function () {
        console.log("Withdraw: " + this.value);
        this.showTransferDialog = false;
        this.showWithdrawalModal = true;
        await withdraw(this.value, this.selectedPeriod, this.selectedCurrency.title);
        this.showWithdrawalModal = false;
        this.balances = await getBalances();
      },
      setMaxValue: function () {
        console.log("Setting max value");
        this.value = this.selectedMax;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  div.page {
    padding: 0 20px 0 20px;
    width: 100%;
    height: 800px;
    text-align: center;
  }

  .form-container {
    padding: 20px;
    background-color: white;
  }

  .text {
    font-size: 36px;
    padding: 30px 0 30px 0;
  }

  .dinput {
    width: 50px;
    border-bottom: 1px solid gray;
  }

  .slider {
    /* overwrite slider styles */
    width: 500px;
  }

  .md-table-cell-container {
    padding: 0 !important;
  }

  .image-overlay {
    position: absolute;
    top: 30px;
    left: 20px;
    font-size: 24px;
    color: white;
  }

  .range-slider {
    padding: 0;
  }

  .slider {
    width: 420px !important;
  }

  .range-slider-fill {
    background-color: #E84F89;
  }

  .md-dialog-container {
    width: 500px;
  }

  .value-box {
    padding: 0 20% 0 15%;
  }

  .md-dialog .md-tabs-navigation {
    margin-left: 10%;
  }

  .md-dialog .md-tab {
    height: 100px;
  }

  span.max-link {
    text-decoration: underline;
    cursor: pointer;
  }


</style>
