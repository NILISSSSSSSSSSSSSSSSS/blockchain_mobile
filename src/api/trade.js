import $http from 'plugins/$http'

// 获取广告列表
export function getAdverList(params) {
  // 购买页面查询卖单，出售页面查询买单
  //params.tradeType = params.tradeType === 'buy' ? 'sell' : 'buy';
  // 不要改变传入对象
  let obj = Object.assign({}, params, {
    tradeType: params.tradeType === 'buy' ? 'sell' : 'buy'
  })

  return $http.get(`/shop/pubList`, { params: obj })
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 获取广告详情(公共接口)
export function getAdvertsDetails_pub(id) {
  return $http.post(`/shop/pubDetail`, {advertid: id})
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 获取广告详情(私有接口)
export function getAdvertsDetails(id) {
  return $http.get(`/shop/detail/${id}`).then(res => {
    return Promise.resolve(res.data)
  })
}

// 数字币和法币相互转换
export function convert({ id, amount, convertTo }) {
  return $http.post(`/shop/convert/${id}`, {
    amount: amount,
    convertTo: convertTo
  }).then(res => {
     return Promise.resolve(res.data)
  })
}

// 创建交易
export function createTrade({advertiseId, payType, convertTo, convertAmount, usdt}) {
  let url = '',
    obj = {
      advertiseId: advertiseId,
      convertTo: convertTo,
      convertAmount: Number(convertAmount)
    }
  if (usdt) {
    url = '/order/create_usdt'
  } else {
    url = '/order/create'
    obj.payType = payType
  }
  return $http.post(url, obj).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取交易详情
export function getTradeDetails({id, type = 'orderCode'}) {
  return $http.get(`/order/detail?${type}=${id}`).then(res => {
    return Promise.resolve(res.data)
  })
}

// 更新交易进度 op: affirm,delay,cancel
export function orderUpdate({orderCode, op, remark = null}) {
  return $http.post('/order/update', {
    orderCode: orderCode,
    op: op,
    remark: remark
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

//申诉接口
export function appeal(data) {
  return $http.post(`/order/appeal`, data).then(res => {
    return Promise.resolve(res.data)
  })
}

// 上传文件
export function upload({url, file}) {
  const config = {
    "Content-Type": "multipart/form-data"
  };
  return $http.post(`${url}/websocket/uploadimg`, file, config)
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 评价
export function evaluate(params) {
  return $http.post('/order/comment', params)
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 取消申诉
export function cancelAppeal(orderCode) {
  return $http.post('/order/cancelappeal', {orderCode})
    .then(res => {
      return Promise.resolve(res.data)
    })
}
