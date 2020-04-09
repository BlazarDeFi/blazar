/* eslint-disable */
<template>
  <div class="page">

    <div style="height: 20px;"></div>

    <div class="md-layout md-gutter">

      <div class="md-layout-item md-size-70">

        <div class="text">I want to deposit <span class="dinput">{{deposit.toFixed(2)}}</span>
          <v-select :options="Object.values(currencies)" label="title" v-model="selectedCurrency" @input="onCurrencyChange()">
            <template v-slot:option="option">
              {{ option.title }}
            </template>
          </v-select>
        </div>

        <range-slider
          class="slider"
          min="0"
          :max="maxDeposit"
          :step="step"
          v-model="deposit">
        </range-slider>

        <div class="text">for <span class="dinput">{{time}}</span> months</div>

        <range-slider
          class="slider"
          min="1"
          max="9"
          step="1"
          v-model="time">
        </range-slider>

        <div class="text">
          and get <b> {{interest | formatCurrency(selectedCurrency)}} </b> now!
        </div>

        <div style="text-align: center">
          <md-button id="deposit-button" class="md-raised md-accent" @click="makeDeposit">Deposit</md-button>
        </div>


      </div>

      <div class="md-layout-item md-size-28">

      <div style="font-size: 36px; margin-bottom: 30px; margin-top: 40px;">Current rates: </div>

      <md-card >
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">ETH</div>
            <div class="md-subhead"><b>{{currencies.eth.rate}}%</b> APY</div>
            Your balance: <b>{{currencies.eth.balance | fullEthToUsd}}</b>
          </md-card-header-text>

          <md-card-media>
            <img src="https://testnet.aave.com/static/media/eth.1a64eee6.svg" style="height: 90px;" alt="Avatar">
          </md-card-media>
        </md-card-header>

      </md-card>

      <md-card>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">DAI</div>
            <div class="md-subhead"><b>{{currencies.dai.rate}}%</b> APY</div>
            Your balance: <b>{{currencies.dai.balance.toFixed(2)}} </b>
          </md-card-header-text>

          <md-card-media>
            <img src="https://testnet.aave.com/static/media/dai.59d423e0.svg" style="height: 90px;" alt="Avatar">
          </md-card-media>
        </md-card-header>

      </md-card>

      </div>

    </div>

    <md-dialog :md-active.sync="showModal">
      <div class="container">
        <img src="https://i.giphy.com/media/xT8qB50yhFINpFTymI/giphy.webp" alt="Snow" style="width:100%;">
        <div class="image-overlay">Transferring your interest from the future ...</div>
      </div>
    </md-dialog>

    <!--<button class="md-primary" @click="deployProxy()">Redeploy</button>-->

  </div>
</template>

<script>
  import { getLendingData, makeDeposit} from '@/blockchain/futureToken'
  import { getLendingConfig, getReserveData, depositDai } from '@/blockchain/aave'
  import { deployFutureToken} from '@/blockchain/deployer'
  import { getBalances} from '@/blockchain/wallet'
  import { getRates, calculateInterest } from '@/blockchain/stats'
  import State from '@/state'
  import RangeSlider from 'vue-range-slider'
  import 'vue-range-slider/dist/vue-range-slider.css'
  import 'vue-select/dist/vue-select.css';
  import vSelect from 'vue-select'

  export default {
    name: 'Home',
    components: {
      RangeSlider, vSelect
    },
    data() {
      return {
        showModal: false,
        currencies: State.currencies,
        deposit: 0,
        maxDeposit:0,
        time: 6,
        step: 0.01,
        precision: 3,
        init: function() {
          this.selectedCurrency = this.currencies.eth;
          return this;
        }
      }.init()
    },
    computed: {
      // a computed getter
      interest: function () {
        return calculateInterest(this.deposit, this.time, this.selectedCurrency);
      }
    },
    beforeCreate: async function () {
      window.redeploy = deployFutureToken;
      await getBalances();
      await getRates();
      this.onCurrencyChange();

    },
    methods: {
      onCurrencyChange: function() {
        console.log("Currency changed: " + this.selectedCurrency.title);
        this.deposit = this.selectedCurrency.balance / 2;
        this.maxDeposit = this.selectedCurrency.balance;
        this.step = this.selectedCurrency.step;
        this.precision = this.selectedCurrency.precision;
      },
      getData: async function () {
        await getReserveData();
      },
      deployProxy: async function () {
        console.log("Deploying FT");
        await deployFutureToken();
      },
      makeDeposit: async function () {
        this.showModal = true;
        try {
          await makeDeposit(this.deposit, this.time, this.selectedCurrency.title);
          this.$router.push({path: '/future'});
          let interestText = this.selectedCurrency.title == 'ETH'
            ? this.$options.filters.ethToUsd(this.interest)
            : (this.interest + " " + this.selectedCurrency.title);
          let toast = this.$toasted.show("You've just earned " + interestText + " interests !", {
            theme: "bubble",
            position: "top-center",
            duration : 5000,
            icon : 'sentiment_satisfied_alt'
          });
        } finally {
          this.showModal = false;
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" >

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

  .v-select {
    min-width: 150px;
    display: inline-block;
  }

  #deposit-button {
    border-radius: 30px;
    height: 50px;
    font-size: 16px;
    width: 100px;
  }

  .md-dialog {
    max-height: none;
    width: 550px;
    height: 550px;
  }

  .container {
    position: relative;
    text-align: center;
    color: white;
  }

  .image-overlay {
    position: absolute;
    top: 30px;
    left: 40px;
    font-size: 24px;
  }

  .range-slider-fill {
    background-color: #E84F89;
  }

  .vs__clear {
    display: none !important;
  }

  .v-select {
    min-width: 110px;
  }



</style>
