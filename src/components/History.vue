/* eslint-disable */
<template>
  <div class="page">

    <div class="md-layout md-gutter">

      <md-card class="md-layout-item md-size-99">
        <md-ripple>

          <md-card-header class="md-layout-item md-size-100">
            <md-card-header-text>
              <div class="md-title">History</div>
              <div class="md-subhead">
                A list of your actions.
              </div>
            </md-card-header-text>


          </md-card-header>


          <md-card-content>

            <md-table>
              <md-table-row>
                <md-table-head>Action</md-table-head>
                <md-table-head>Time</md-table-head>
                <md-table-head>Amount</md-table-head>
                <md-table-head>Interest</md-table-head>
                <md-table-head>Transaction</md-table-head>
              </md-table-row>

              <md-table-row v-for="action in actions" :key="action.time">
                <md-table-head>{{action.label}}</md-table-head>
                <md-table-head>{{action.time}}</md-table-head>
                <md-table-head>{{action.amount | formatCurrency(action.currency)}}</md-table-head>
                <md-table-head>{{action.interest | formatCurrency(action.currency)}}</md-table-head>
                <md-table-head style="padding-left: 30px;">
                  {{action.tx | tx}}
                  <md-button :href="'https://kovan.etherscan.io/tx/'+ action.tx"
                             target="_blank" class="md-icon-button token-button" >
                    <md-icon style="font-size: 16px !important; padding-bottom: 4px;">open_in_new</md-icon>
                    <md-tooltip md-direction="top">View on Etherscan</md-tooltip>
                  </md-button>
                </md-table-head>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-ripple>
      </md-card>

    </div>
  </div>
</template>

<script>
  import {getHistory} from '@/blockchain/futureToken'
  import State from '@/state'

  export default {
    name: 'History',
    data() {
      return {
        actions: State.myActions,
      }
    },
    methods: {

    },
    beforeCreate: async function () {
      await getHistory();
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

  .token-button {
    margin-left: -5px !important;
    padding-top:3px;
  }

  .token-button .md-icon.md-theme-default {
    color: #8A48DB !important;
    padding-bottom: 18px !important;
  }


</style>
