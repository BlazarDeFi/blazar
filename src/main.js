// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueMaterial from 'vue-material'
import Vue2Filters from 'vue2-filters'
import Toasted from 'vue-toasted';


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

