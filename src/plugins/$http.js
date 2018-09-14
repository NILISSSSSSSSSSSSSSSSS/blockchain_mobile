import axios from 'axios'
import store from '@/store'
import { ServerUrl } from 'api/config'

const instance = axios.create({
  baseURL: ServerUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1000 * 20
});

//不弹出后台提示的黑名单
let whiteList = ['qh/membercheck']

instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  const token = store.getters.getToken
  if (token) {
    config.headers.Authorization = token
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
  let flag = true;
  whiteList.map((item)=>{
    if(response.config.url.indexOf(item) > -1){
      flag = false
    }
  })
  
  //30001身份验证未通过
  if (response.data.code === 30001) {
    //保存上一个路由状态
     if(window.location.href.indexOf('login')<0){
        console.log(window.location.href)
        $vm.routeState = window.location.href
     }
    if (store.getters.getToken) {
      $vm.$toast.fail($vm.$t(`err['${response.data.code}']`)) //身份验证未通过
    }
    store.commit('setToken', '');
    localStorage.setItem("loginTime", "");
    $vm.$router.push('/user/login');
  } 
  else if (response.data.code !== 0) {
    if (response.data.msg && flag) {
      $vm.$toast.fail($vm.$t(`err['${response.data.code}']`)  || "")
    }
  }
  return response;
}, function (error) {
  // $vm.$toast.fail($vm.$t('err["undefined"]')) //服务器连接错误
  return Promise.reject(error);
});


export default instance
