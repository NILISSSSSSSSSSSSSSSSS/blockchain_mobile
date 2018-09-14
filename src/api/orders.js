import $http from 'plugins/$http'

// 获取订单列表
export function getOrderList(params) {
  return $http.get('/order/mine', { params: params })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
