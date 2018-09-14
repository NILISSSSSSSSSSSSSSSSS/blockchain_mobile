import $http from 'plugins/$http'

// 获取钱包列表
export function getWalletsList() {
  return $http.get('/account/wallets').then(res => {
    return Promise.resolve(res.data)
  })
}

// 申请钱包地址
export function applyaddress(currency) {
  return $http.post('/account/applyaddress', {
    currency
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
