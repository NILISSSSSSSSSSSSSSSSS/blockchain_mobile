import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
// 通过 this.$store 访问
import store from './store'
import './filters'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

// vant
import Vant from 'vant';
import 'static/index.css';
// 自动在 Vue 的 prototype 上挂载 $xxx 方法
import { Toast } from 'vant';
import { Dialog } from 'vant';
import { Lazyload } from 'vant';

// 公用组件
import NoData from 'components/no-data/no-data'
import GHead from 'components/head/head'
import MyLoading from 'components/loading/loading'
import moment from 'moment'
import { dateAgo,getUrl,turnToBrower} from '@/common/util.js'

Vue.component('no-data', NoData)
Vue.component('g-head', GHead)
Vue.component('my-loading', MyLoading)
Vue.component('qrcode', VueQrcode)
Vue.component('InfiniteSlideBar', InfiniteSlideBar)

// config
import { ServerUrl ,Version} from 'api/config'
// import $http from 'plugins/$http'
// 第三方库           
import sha1 from 'sha1'
import vueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'
import VueQrcode from 'qrcode.vue'
import InfiniteSlideBar from 'vue-infinite-slide-bar'
import {format} from 'tools.js'
import $http from 'plugins/$http'
//import publicIp from 'ipify'

// 本地函数
import { timeFormat } from 'assets/js/time'

//引入iconfont字体图标
import 'assets/iconfont/iconfont.css'

//复制
import VueClipboard from 'vue-clipboard2' 

Vue.use(VueClipboard);
Vue.use(Vant);
Vue.use(Lazyload, {
  loading: require('assets/logo.png')
});

import VueI18n from 'vue-i18n'
// 多语言翻译
Vue.use(VueI18n); // 语言翻译
const i18n = new VueI18n({
  locale: 'cn',    // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'cn': require('@/lang/mobile_cn'),   // 中文语言包
    'en': require('@/lang/mobile_en') ,   // 英文语言包
    'vietexc': require('@/lang/mobile_vietexc') ,   // 越南语言包
  }
})



moment.locale('zh-cn') //中文时间

Vue.config.productionTip = false

Vue.prototype.sha1 = sha1
Vue.prototype.$timeFormat = timeFormat
Vue.prototype.format = format
Vue.prototype.serverIP = ServerUrl
Vue.prototype.Version = Version
Vue.prototype.$http = $http

Vue.prototype.$moment = moment
Vue.prototype.$dateAgo = dateAgo
Vue.prototype.getUrl = getUrl
Vue.prototype.turnToBrower = turnToBrower
/* eslint-disable no-new */
// document.addEventListener('deviceready', function () {
  window.$vm = new Vue({
    el: '#app',
    router,
    i18n,  // 不要忘记
    store,
    render: h => h(App)
  })
// }, false)

function firstClearToken(){
  var cc=localStorage.getItem("cleared") || "";
  //如果没有清除缓存
  if(!cc){
    localStorage.setItem("token","");
    localStorage.setItem("cleared","已清理");
  }
}
//强制清除一次toking
firstClearToken()

function languageGet(){
  // 语言
  var lan=localStorage.getItem('language') ||  'cn'
  $vm.$i18n.locale=lan;
}
function usdtConfig(){
  var url=$vm.getUrl();
  url.includes('geccex.com') ? localStorage.setItem("configFiatBi", "W") :  localStorage.setItem("configFiatBi", "USDT");
}

usdtConfig();
languageGet();

// window.cordovaBrower=null;