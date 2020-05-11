/* eslint-disable */
<template>
  <div class="page">

    <div class="md-layout md-gutter">

    <md-card class="md-layout-item md-size-49">
      <md-ripple>

        <md-card-header class="md-layout-item md-size-100">
          <md-card-header-text>
            <div class="md-title">Assets</div>
            <div class="md-subhead">
              Where deposits on Blazar are being put to work to generate interest.
            </div>
          </md-card-header-text>


        </md-card-header>


        <md-card-content>

          <md-table>
            <md-table-row>
              <md-table-head>Currency</md-table-head>
              <md-table-head>Pool</md-table-head>
              <md-table-head>Value</md-table-head>
            </md-table-row>

            <md-table-row>
              <md-table-cell>
                <img src="https://testnet.aave.com/static/media/eth.1a64eee6.svg"
                     style="height: 24px; margin-right: 3px;"> ETH
              </md-table-cell>
              <md-table-cell>Aave</md-table-cell>
              <md-table-cell><b>{{treasure.ETH | fullEthToUsd}}</b></md-table-cell>

            </md-table-row>

            <md-table-row>
              <md-table-cell>
                <img src="https://testnet.aave.com/static/media/dai.59d423e0.svg"
                     style="height: 24px; margin-right: 3px; margin-top: -3px;"> DAI
              </md-table-cell>
              <md-table-cell>Aave</md-table-cell>
              <md-table-cell><b>{{treasure.DAI | token}}</b></md-table-cell>
            </md-table-row>
          </md-table>


        </md-card-content>
      </md-ripple>
    </md-card>

    <md-card class="md-layout-item md-size-49">
      <md-ripple>

        <md-card-header class="md-layout-item md-size-100">
          <md-card-header-text>
            <div class="md-title">Liabilities</div>
            <div class="md-subhead">
              Where loans on Blazar are being funded from.
            </div>
          </md-card-header-text>


        </md-card-header>


        <md-card-content>

          <md-table>
            <md-table-row>
              <md-table-head>Currency</md-table-head>
              <md-table-head>Pool</md-table-head>
              <md-table-head>Value</md-table-head>
            </md-table-row>

            <md-table-row>
              <md-table-cell>
                <img src="https://testnet.aave.com/static/media/eth.1a64eee6.svg"
                     style="height: 24px; margin-right: 3px;"> ETH
              </md-table-cell>
              <md-table-cell>Aave</md-table-cell>
              <md-table-cell><b>0</b></md-table-cell>

            </md-table-row>

            <md-table-row>
              <md-table-cell>
                <img src="https://testnet.aave.com/static/media/dai.59d423e0.svg"
                     style="height: 24px; margin-right: 3px; margin-top: -3px;"> DAI
              </md-table-cell>
              <md-table-cell>Aave</md-table-cell>
              <md-table-cell><b>0</b></md-table-cell>
            </md-table-row>
          </md-table>


        </md-card-content>
      </md-ripple>
    </md-card>

    </div>



    <!--<div>-->
      <!--<md-button class="md-raised md-accent" @click="deployAaveEthExternalPool">Deploy Aave Eth Pool Connector</md-button>-->
      <!--<md-button class="md-raised md-accent" @click="deployFutureEthToken">Deploy Future Eth Token</md-button>-->
    <!--</div>-->


  </div>
</template>

<script>
  import {getLendingData, makeDeposit} from '@/blockchain/futureToken'
  import {getLendingConfig, getReserveData, depositDai} from '@/blockchain/aave'
  import {deployAaveExternalPool, deployFutureEthToken} from '@/blockchain/deployer'
  import {getTreasures} from '@/blockchain/stats'


  export default {
    name: 'Admin',
    data() {
      return {
        treasure: {}
      }
    },
    methods: {

    },
    beforeCreate: async function () {
      this.treasure = await getTreasures();
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

  .md-table-head-container {
    text-align: center;
  }


</style>
