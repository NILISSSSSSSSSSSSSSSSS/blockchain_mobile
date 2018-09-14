import $http from 'plugins/$http'

// 获取文章列表
export function getArticleList({ lang = 'cn', pageSize = 20, pageType = '', tags = [] }) {
  console.log(lang)
  let url
  if (tags.length > 0) {
    let tagStr = ''
    tags.forEach(item => {
      tagStr += `&tags=${item}`
    })
    url = `/article/list?pageSize=${pageSize}&lang=${lang}${tagStr}`
  } else {
    url = `/article/list?pageSize=${pageSize}&lang=${lang}`
  }
  if (pageType) url += `&pageType=${pageType}`
  return $http.get(url).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取文章详情
export function getArticleDetail({ lang = 'cn', id }) {
  return $http.get(`/article/detail?articleId=${id}&lang=${lang}`).then(res => {
    return Promise.resolve(res.data)
  })
}
