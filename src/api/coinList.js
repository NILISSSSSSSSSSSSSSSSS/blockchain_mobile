import $http from 'plugins/$http'
import store from '@/store'

// 
export function coinList(params) {
  return $http.get('/issue_currency/list', {params})
    .then(res => {
      return Promise.resolve(res.data)
    })
}