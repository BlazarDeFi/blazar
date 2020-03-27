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
                  Check when your funds become available
                </div>
              </md-card-header-text>


            </md-card-header>


            <md-card-content>

              <md-table>
                <md-table-row>
                  <md-table-head>Currency</md-table-head>
                  <md-table-head>Total</md-table-head>

                  <md-table-head>Jan</md-table-head>
                  <md-table-head>Feb</md-table-head>
                  <md-table-head>Mar</md-table-head>
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
                  <md-table-cell v-for="i in 12" :key="i">
                      <md-button class="md-fab md-mini" style="color: white;" v-if="balances['ETH'] && balances['ETH'][i - 1] > 0"
                                 @click="transfer(balances['ETH'][i - 1], i-1, 'ETH')">
                        {{balances['ETH'][i - 1]}}
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

                <md-table-cell v-for="i in 12" :key="i">
                  <md-button class="md-fab md-mini" style="color: white;" v-if="balances['DAI'][i - 1] > 0"
                             @click="transfer(balances['DAI'][i - 1], i-1, 'DAI')">
                    {{balances['DAI'][i - 1] | token}}
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


    <md-dialog :md-active.sync="showTransferDialog" style="width: 500px; height: 350px;">
      <md-dialog-title>Transfer</md-dialog-title>

      <md-tabs md-dynamic-height>
        <md-tab md-label="In space">
          <form novalidate>
            <div class="form-container">
              <md-field>
                <label for="spaceValue">Value (max: {{this.selectedMax}})</label>
                <md-input name="spaceValue" id="spaceValue" v-model="spaceValue" />
              </md-field>

              <md-field>
                <label for="spaceAddress">Target address</label>
                <md-input name="spaceAddress" id="spaceAddress" v-model="spaceAddress" />
              </md-field>
            </div>

            <div style="text-align: center">
              <md-button class="md-primary md-raised" @click="transferInSpace()">Transfer</md-button>
            </div>
          </form>
        </md-tab>

        <md-tab md-label="In time">
          <form novalidate>
            <div class="form-container">
              <md-field>
                <label for="timeValue">Value (max: {{this.selectedMax}})</label>
                <md-input name="timeValue" id="timeValue" v-model="timeValue" />
              </md-field>

              <div style="font-size: 12px; color: gray;">Target month: <b>{{timeTarget}}</b></div>
                <!--<md-input name="timeTarget" id="timeTarget" v-model="timeTarget" />-->
                <range-slider
                  class="slider"
                  min="3"
                  max="12"
                  step="1"
                  v-model="timeTarget">
                </range-slider>


              <div style="font-size: 14px;" v-if="price >= 0">You will receive: <span style="color: green;"><b>{{price}}</b> ETH (${{(price*223).toFixed(2)}})</span></div>

              <div style="font-size: 14px;" v-if="price < 0">You will need to pay: <span style="color: red;"><b>{{price}}</b> ETH (${{(price*223).toFixed(2)}})</span></div>


            </div>
            <div style="text-align: center; margin-top: 10px;">
              <md-button class="md-primary md-raised" @click="transferInTime()">Transfer</md-button>
            </div>
          </form>
        </md-tab>
        <md-tab md-label="Withdraw" v-if="selectedPeriod === 2">
          <div style="text-align: center">
            <md-button class="md-accent md-raised" @click="withdraw()" >Withdraw</md-button>
          </div>
        </md-tab>

      </md-tabs>
    </md-dialog>

    <md-dialog :md-active.sync="showSpaceTransferModal">
      <div class="container">
        <img src="https://media2.giphy.com/media/pZdilWYCMEEus/giphy.gif?cid=790b761182bf4ed027d156fc665d39b1dc7b4082c2f482b6&rid=giphy.gif" alt="Snow" style="width:100%;">
        <div class="image-overlay">Transferring your tokens in space</div>
      </div>
    </md-dialog>

    <md-dialog :md-active.sync="showTimeTransferModal">
      <div class="container">
        <img src="https://i.giphy.com/media/xT8qB50yhFINpFTymI/giphy.webp" alt="Snow" style="width:100%;">
        <div class="image-overlay">Transferring your tokens in time ...</div>
      </div>
    </md-dialog>


  </div>
</template>

<script>
  import {getBalances, spaceTransfer, timeTransfer, withdraw} from '@/blockchain/futureToken'
  import {getLendingConfig, getReserveData} from '@/blockchain/aave'
  import {deployFutureCoin} from '@/blockchain/deployer'
  import RangeSlider from 'vue-range-slider'
  import 'vue-range-slider/dist/vue-range-slider.css'

  export default {
    name: 'Future',
    components: {
      RangeSlider
    },
    data() {
      return {
        balances: {},
        showTransferDialog: false,
        selectedMax: 0,
        selectedPeriod: 0,
        selectedCurrency: '',
        spaceAddress: "",
        spaceValue: 0,
        showSpaceTransferModal: false,
        showTimeTransferModal: false,
        timeValue: 0,
        timeTarget: 0
      }
    },
    computed: {
      // a computed getter
      price: function () {
        let time = this.timeTarget - this.selectedPeriod - 1;
        let formula = (100 + (5 * Math.abs(time) / 12)) / 100;
        console.log("Formula: " + formula);
        if (time > 0) {
          return (this.timeValue - (this.timeValue / formula)).toFixed(5);
        } else {
          return -((this.timeValue*formula - this.timeValue).toFixed(5));
        }
      }
    },
    beforeCreate: async function () {
      this.balances = await getBalances();
    },
    methods: {
      transfer(val, period, currency) {
        this.selectedMax = val;
        this.selectedPeriod = period;
        this.selectedCurrency = currency;
        this.timeTarget = period + 1;
        console.log("Transferring " + this.selectedCurrency + " max: " + this.selectedMax + " from: " + this.selectedPeriod);
        this.showTransferDialog = true;
      },
      transferInSpace: async function () {
        console.log("Transferring in space: " + this.spaceValue + " to: " + this.spaceAddress);
        this.showTransferDialog = false;
        this.showSpaceTransferModal = true;
        await spaceTransfer(this.spaceAddress, this.selectedPeriod, this.spaceValue, this.selectedCurrency);
        this.showSpaceTransferModal = false;
        this.balances = await getBalances();
      },
      transferInTime: async function () {
        console.log("Transferring in time: " + this.timeValue + " from: " + this.selectedPeriod + " to: " + this.timeTarget);
        this.showTransferDialog = false;
        this.showTimeTransferModal = true;
        try {
          await timeTransfer(this.timeTarget -1, this.selectedPeriod, this.timeValue, this.selectedCurrency);
          if (this.timeTarget -1 > this.selectedPeriod) {
            let toast = this.$toasted.show("You've just earned $" + (this.price*223).toFixed(2) + " interests !", {
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
        console.log("Withdraw: " + this.selectedMax);
        this.showTransferDialog = false;
        this.showSpaceTransferModal = true;
        await withdraw(this.selectedMax);
        this.showSpaceTransferModal = false;
        this.balances = await getBalances();
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
    width: 470px !important;
  }

  .range-slider-fill {
    background-color: #E84F89;
  }

  .md-dialog-container {
    width: 500px;
  }


</style>
