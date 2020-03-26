// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueMaterial from 'vue-material'
import Vue2Filters from 'vue2-filters'
import Toasted from 'vue-toasted';
import { getEthPrice } from './blockchain/stats';


Vue.use(Vue2Filters)
Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(Toasted)


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
  let ethPrice = await getEthPrice();
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
};

setupFilters();

