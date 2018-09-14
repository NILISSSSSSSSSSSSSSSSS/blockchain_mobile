<template>
  <div class="hc">
    <g-head>
      <van-nav-bar
        :title='$t("hc.help")'
        left-arrow
        @click-left="onClickLeft"
      />
    </g-head>
    <!-- 公告中心 -->
    <div class="notice-center">
      <h1>{{$t("hc.notice")}}</h1>
      <div v-if="noticeArr.length > 0" class="list">
        <hc-list
          type="notice" :noticeList="noticeArr"></hc-list>
      </div>
      <no-data v-else></no-data>
    </div>
     <!-- 帮助中心 -->
    <div class="help-center">
      <h1>{{$t("hc.help")}}</h1>
      <div v-if="helpArr.length > 0" class="list">
        <hc-list
          v-for="(item, index) in helpArr" :key="index"
          type="help" :helpObj="item"></hc-list>
      </div>
      <no-data v-else></no-data>
    </div>

    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import { getArticleList } from 'api/hc'
import HcList from './list'
import { Help, Hc } from 'assets/js/object'

export default {
  data() {
    return {
      noticeArr: [],
      helpArr: [],
      loading: false,
      lang: localStorage.language || "cn"
    }
  },
  created() {
    this._getArticleList(this.lang,['help'])
    this._getArticleList(this.lang,['notice'])
  },
  methods: {
    onClickLeft() {
      this.$router.push('/account')
    },
    _getArticleList(lang,tags=[]) {
      this.loading = true
      getArticleList({lang,tags})
        .then(data => {
          this.loading = false
          if (data.code === 0) {
            // 帮助中心列表
            if (tags.indexOf('help') > -1) {
              let helpTitle = []
              let help = []
              data.data.forEach(item => {
                item.tags.forEach(tag => {
                  if (tag._id !== 'help' && helpTitle.indexOf(tag._id) === -1) {
                    helpTitle.push(tag._id)
                  }
                })
                help.push(item)
              })
              this.normalize(helpTitle, help, 'helpArr')
            }
            // 公告中心列表
            if (tags.indexOf('notice') > -1) {
              this.noticeArr = []
              data.data.forEach(item => {
                this.noticeArr.push(new Hc({
                  title: item.title,
                  id: item._id,
                  lang: item.tags[0].lang,
                  time: item.updateTime
                }))
              })
            }
          }
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 将数据序列化为需要的数据结构
    normalize(titleArr, dataArr, arr) {
      this[arr] = []
      titleArr.forEach(item => {
        let obj = new Help({title: item, objArr: dataArr})
        this[arr].push(obj)
      })
    }
  },
  components: {
    HcList
  }
}
</script>

<style lang="scss" scoped>
  .notice-center, .help-center {
    padding: 0 16px;
    h1 {
      text-align: center;
    }
  }
</style>

