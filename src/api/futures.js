import $http from 'plugins/$http'

// 获取期货交易所url
export function qhEnter() {
  return $http.get('/qh/enter')
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 获取余额等信息
export function getBase() {
  return $http.post('/qh/base')
    .then(res => {
      return Promise.resolve(res.data)
    })
}

//获取是否是会员
export function membercheck() {
  return $http.get('/qh/membercheck')
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 划账，转入场内
export function transfer({ amount, remark="" }) {
  return $http.post('/qh/rj', { amount, remark })
    .then(res => {
      return Promise.resolve(res.data)
    })
}

// 积分转换
export function transQH({ isToQH, fromAmount }) {
  return $http.post('/qh/trans', { isToQH, fromAmount })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
