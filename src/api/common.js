import $http from 'plugins/$http'
import store from '@/store'

// 获取法币和数字币列表, 使用vuex缓存数据
export function getCommon(isPubAdvertise = 'no') {
  // const common = store.getters.getCommon
  
  return $http.get(`/common?isPubAdvertise=${isPubAdvertise}`).then(res => {
    if (res.data.code === 0) store.commit('setCommon', res.data.data)
    return Promise.resolve(res.data)
  })
}

// 成交的交易轮询
export function getOrdersInfo(init) {
  return $http.post('/index/ordersinfo').then(res => {
    if (res.data.code === 0) {
      const ms = res.data.data.time
      let oldMs
      if (init) oldMs = 0
      else {
        const lamp = store.getters.common ? store.getters.common.lampRefresh : 10
        oldMs = ms - 1000 * lamp
      }
      let list = res.data.data.list.filter(item => {
        return item.time >= oldMs && item.time <= ms
      })
      list.sort(function (x1, x2) {
        return x1.time - x2.time
      })
      return Promise.resolve(list)
    } else return Promise.reject(res.data)
  })
}
