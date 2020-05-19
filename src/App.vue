<template>
  <md-app id="app">
    <md-app-toolbar class="md-primary">
      <img class="app-logo" src="/static/blazar.png"/>
      <span class="md-title">BLAZAR</span>



        <md-tabs class="md-primary" style="margin-left: 200px;" md-sync-route>
          <md-tab
            key="new_deposit"
            to="/"
            md-label="New deposit"
            exact>
          </md-tab>

          <md-tab
            key="new_loan"
            to="/borrow"
            md-label="New loan"
            exact>
          </md-tab>

          <md-tab
            key="future"
            to="/future"
            md-label="Future tokens"
            exact>

          </md-tab>
          <md-tab
            key="history"
            to="/history"
            md-label="History"
            exact>

          </md-tab>
        </md-tabs>


      <div class="md-toolbar-section-end" >
        <md-tabs class="md-primary" md-sync-route>
        <md-tab
          key="stats"
          to="/stats"
          md-label="Stats"
          exact>
        </md-tab>
        </md-tabs>

        <a href="https://github.com/BlazarDeFi/blazar" target="_blank" style="color: white;">
          <i class="fa fa-github" style="font-size:32px"></i>
        </a>
      </div>
     </md-app-toolbar>

    <md-app-content>
      <div>


        <md-dialog :md-active.sync="showNoWeb3">
          <md-app-toolbar class="md-accent">
            <span class="md-title">
              <md-icon>warning</md-icon>
              Cannot connect to the Ethereum Blockchain
            </span>


          </md-app-toolbar>

          <md-dialog-content>
            Viewing this content requires using a Web3 browser such as Metamask.
            Please connect to the Kovan testnet.
            <br/><br/>
            Please refresh the window after setting up the Web3 plugin.

          </md-dialog-content>

        </md-dialog>

        <md-dialog :md-active.sync="showWrongNetwork">
          <md-app-toolbar class="md-accent">
            <span class="md-title">
              <md-icon>warning</md-icon>
              Cannot connect to the Kovan testnet
            </span>
          </md-app-toolbar>

          <md-dialog-content>
            Please make sure you are connecting to the Kovan testnet using your web3 browser.
            <br/><br/>
            Please refresh the window after updating the Web3 plugin.

          </md-dialog-content>

        </md-dialog>


        <router-view></router-view>
      </div>
    </md-app-content>

  </md-app>
</template>



<script>
  import State from '@/state'
  import { EventBus } from './event-bus.js';

  export default {
    data() {
      return {
        showWelcome: false,
        showNoWeb3: false,
        showWrongNetwork: false,
        show3Box: false,
        ida: State.ida,
        desktopScreen: false,
        showMobileScreen: false
      }
    },
    methods: {
    }

  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .md-app-content.md-theme-default {
    background-color: #F5F5F5;
  }

  .md-toolbar-row {
    width: auto;
  }

  .md-toolbar.md-theme-default.md-primary {
    background-color: #8A48DB;
  }

  .md-tabs.md-theme-default.md-primary .md-tabs-navigation {
    background-color: #8A48DB;
  }

  .md-dialog.md-theme-default {
    max-width: 768px;
    background-color: #f5f5f5;
  }
  .md-dialog-content {
    padding: 20px;
  }

  .md-app-container {
    overflow-x: hidden;
  }

  img.app-logo {
    height: 40px;
  }

</style>

