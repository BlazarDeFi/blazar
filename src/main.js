// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueMaterial from 'vue-material'
import Vue2Filters from 'vue2-filters'
import Toasted from 'vue-toasted';
import { getAssetPrice } from './blockchain/stats';
import AsyncComputed from 'vue-async-computed'


Vue.use(Vue2Filters)
Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(Toasted)
Vue.use(AsyncComputed)


window.addEventListener('load', function () {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App}
  })
})

async function setupFilters() {
  let ethPrice = await getAssetPrice("eth");
  console.log("Current ETH price: " + ethPrice);
  Vue.filter('ethToUsd', function (value) {
    if (!value) return ''
    value = value * ethPrice;
    return "$" + value.toFixed(2);
  });
  Vue.filter('fullEthToUsd', function (value) {
    if (!value) return '';
    let val = parseFloat(value);
    let usd = val * ethPrice;
    return val.toFixed(3) + " ($" + usd.toFixed(2) + ")";
  });
  Vue.filter('token', function (value) {
    if (!value) return '';
    let val = parseFloat(value);
    return val.toFixed(2);
  })
  Vue.filter('formatCurrency', function (value, currency, skip) {
    if (!value) return '';
    let val = parseFloat(value);
    if (currency.title === 'ETH') {
      let usd = val * ethPrice;
      let f = val.toFixed(3) + " ETH";
      if (!skip) {
        f +=" ($" + usd.toFixed(2) + ")"
      }
      return f;
    } else {
      return val.toFixed(2) + " " + currency.title;
    }
  })
  Vue.filter('tx', function (value) {
    if (!value) return '';
    return value.substr(0,6) + "..." + value.substr(value.length - 4);
  })
};

setupFilters();

