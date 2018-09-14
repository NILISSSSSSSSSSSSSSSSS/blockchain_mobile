import $http from 'plugins/$http'
import store from '@/store'
import { axiospost } from 'api/axios'

// 登录
export function login(params) {
  return $http.post('/users/signin', params)
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 获取用户详情
export function getUserDetail() {
  const userInfo = store.getters.getUserInfo
  if (userInfo) {
    let data = {}
    data.code = 0
    data.data = userInfo
    return Promise.resolve(data)
  }
  return $http.get('/users/detail')
    .then(res => {
      if (res.data.code === 0) store.commit('setUserInfo', res.data.data)
      return Promise.resolve(res.data)
    })
}

// 两步验证
export function twoVerify(params) {
  return $http.post('/users/signin_twophase', params)
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 注册
export function register(params) {
  return $http.post('/users/signup', params)
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 手机注册
export function register_mobile(params) {
  return $http.post('/users/signup_moblie', params)
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 邮箱验证
export function verifyEmail(params) {
  return $http.post('/users/verify_email', params)
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 手机验证
export function verifyPhone(params) {
  return $http.post('/users/verify_moblie', params)
    .then(res => {
      return Promise.resolve(res.data)
    })
}

//根据IP获取当前所在的地区
export function region(data) {
  return $http.post(`/index/ipinfo`, data).then(res => {
    return Promise.resolve(res.data)
  })
}

// 资金流水
export function transactions(params={}) {
  return $http.post(`/account/transactions`, params).then(res => {
    return Promise.resolve(res.data)
  })
}

//验证码登录的接口
//获取验证码
export function getValidateCode(obj){
  return axiospost('/users/signin_sendcode',obj)
}
//验证码方式登录
export function validateLogin(obj){
  return axiospost('/users/authcode_signin',obj)
}
