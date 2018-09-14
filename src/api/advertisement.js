import $http from 'plugins/$http'
import { axiosget ,axiospost } from 'api/axios';

// 获取刊登广告的一些数据
export function getPreset({ tradeType = 'buy', currency = 'BTC', fiatCurrency = 'CNY' }) {
  return $http.get(`/shop/preset?tradeType=${tradeType}&currency=${currency}&fiatCurrency=${fiatCurrency}`)
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 发布广告
export function submitAdver(params) {
  return $http.post(`/shop`, params)
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 获取广告列表
export function getADList({pageSize=5, page}) {
  return $http.get(`/shop/list?pageSize=${pageSize}&page=${page}`)
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 删除广告
export function deleteAdver({advertIds}) {
  return $http.patch('/shop', {advertIds, status: 'delete'})
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 修改广告上下架状态
export function modifyAdverStatus({advertIds, status}) {
  return $http.patch('/shop', { advertIds, status })
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 修改广告
export function modifyAdver({id, form}) {
  return $http.put(`/shop/${id}`, form)
    .then(res => {
      return Promise.resolve(res.data)
    })
}

//获取用户详情
export function getUserDetail(obj){
  return axiosget("/users/detail",obj)
}