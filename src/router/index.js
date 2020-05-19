import Vue from 'vue'
import Router from 'vue-router'
import Deposit from '@/components/Deposit'
import Borrow from '@/components/Borrow'
import Future from '@/components/Future'
import Stats from '@/components/Stats'
import History from '@/components/History'


Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'Deposit',
      component: Deposit
    },
    {
      path: '/borrow',
      name: 'Borrow',
      component: Borrow
    },
    {
      path: '/future',
      name: 'future',
      component: Future
    },
    {
      path: '/history',
      name: 'history',
      component: History
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats
    }
  ]
})
