import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/trade'
    },

    {
      path: '/trade',
      component: () => import('views/trade/trade')
    },

    {
      path: '/trade/offers/:id',
      component: () => import('views/trade/offers/offers')
    },
    {
      path: '/trade/trading/:id',
      component: () => import('views/trade/trading/trading')
    },
    {
      path: '/orders',
      component: () => import('views/orders/orders')
    },

    {
      path: '/advertisement',
      component: () => import('views/advertisement/advertisement')
    },
    {
      path: '/advertisement/detail/:id',
      component: () => import('views/advertisement/adver-details/adver-details')
    },
    {
      path: '/advertisement/adver-list',
      component: () => import('views/advertisement/adver-list/adver-list')
    },
    {
      path: '/advertisement/modify/:id',
      component: () => import('views/advertisement/adver-modify/adver-modify')
    },

    {
      path: '/wallets',
      component: () => import('views/wallets/wallets')
    },
    {
      path: '/wallets/transfer',
      component: () => import('views/wallets/transfer/index')
    },
    {
      path: '/wallets/payment',
      component: () => import('views/wallets/payment/payment')
    },
    
    {
      path: '/account',
      component: () => import('views/account/account')
    },
    {
      path: '/user/login',
      component: () => import('views/account/login/login')
    },
    {
      path: '/valicode/login',
      component: () => import('views/account/valicode/login')
    },
    {
      path: '/account/mySiMu',
      component: () => import('views/mySiMu/index.vue')
    },
    {
      path: '/account/two-step',
      component: () => import('views/account/two-step/two-step')
    },
    {
      path: '/account/mysendcoin',
      component: () => import('views/account/mysendcoin/index')
    },

    {
      path: '/account/unbinding',
      component: () => import('views/account/two-step/unbinding')
    },
    {
      path: '/account/transactions',
      component: () => import('views/account/transactions/transactions')
    },
    {
      path: '/account/lang',
      component: () => import('views/account/lang')
    },
    {
      path: '/user/register',
      component: () => import('views/account/register/register')
    },
    {
      path: '/user/find-pass',
      component: () => import('views/account/find-pass/find-pass')
    },
    {
      path: '/account/tradeConfig',
      component: () => import('views/account/trade/list')
    },
    {
      path: '/account/tradeSetting/:payType',
      component: () => import('views/account/trade/setting')
    },
    {
      path: '/account/invitation',
      component: () => import('views/account/invitation')
    },
    {
      path: '/hc',
      component: () => import('views/hc/hc')
    },
    {
      path: '/hc/more',
      component: () => import('views/hc/more/more')
    },
    {
      path: '/hc/article/:id',
      component: () => import('views/hc/article/article')
    },

    {
      path: '/futures',
      component: () => import('views/futures/futures')
    },
    //快速交易
    {
      path: '/fast/trade',
      component: () => import('views/fast-trade/trade')
    }
  ]
})
router.beforeEach((to, from, next) => {
  // console.log(to,from)
  let prevRoutePath = from.path

  localStorage.setItem('prevRoutePath',prevRoutePath)
  next()
 })

 export default router
