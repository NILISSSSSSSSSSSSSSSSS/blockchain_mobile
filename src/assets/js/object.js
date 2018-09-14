// 公告中心每条数据, 帮助中心more每条数据
export class Hc {
  constructor({title, id, lang, time}) {
    this.title = title
    this.id = id
    this.lang = lang
    this.time = time
  }
}

// 帮助中心每个主题数据
export class Help {
  constructor({title, objArr}) {
    this.title = title
    this.list = []
    objArr.forEach(x => {
      for (let j of x.tags) {
        if (j._id === title) {
          this.lang = j.lang
          let o = {}
          o.id = x._id
          o.title = x.title
          o.time = x.updateTime
          this.list.push(o)
        }
      }
    })
  }
}

