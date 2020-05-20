import Vue from 'vue'
import Router from 'vue-router'
import Deposit from '@/components/Deposit'
import Borrow from '@/components/Borrow'
import Dashboard from '@/components/Dashboard'
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
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
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
