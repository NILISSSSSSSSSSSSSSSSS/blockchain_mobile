import $http from 'plugins/$http'

export function axiosget(url, options) {
    return $http.get(url, {
        params: options
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err)
    })
}
export function axiospost(url, options, config) {
    return $http.post(url, options, config).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err)
    })
}

export function axiosdelete(url, options) {
    return $http.delete(url, {
        data: options
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err)
    })
}

export function axiosput(url, options, config) {
    // console.log(config)
    return $http.put(url, options, config).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err)
    })
}
export function convert({id, amount, convertTo}) {
    return $http.post(`/shop/convert/${id}`, {
      amount: amount,
      convertTo: convertTo
    }).then(res => {
      if (res.data.code === 0) return Promise.resolve(res.data)
      else return Promise.reject(res.data)
    })
  }