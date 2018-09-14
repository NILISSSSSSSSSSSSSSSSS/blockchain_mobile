<template>
  <div class="article">
    <g-head>
      <van-nav-bar
        :title='$t("hc.articleDetail")'
        left-arrow
        @click-left="onClickLeft"
      />
    </g-head>
    <div class="main">
      <h1>{{ article.title }}</h1>
      <div v-html="article.context" ref="html"></div>
    </div>

    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import { getArticleDetail } from 'api/hc'

export default {
  data() {
    return {
      article: {},
      loading: false,
      lang: localStorage.language || "cn"
    }
  },
  watch: {
    article: {
      handler(val) {
        if (!val.context) return
        this.$nextTick()
          .then(() => {
            const images = this.$refs.html.querySelectorAll('img')
            for (let x of images) {
              x.style.maxWidth = '90%'
            }
          })
      },
      deep: true
    }
  },
  created() {
    this.init()
    this._getArticleDetail(this.lang)
  },
  methods: {
    init() {
      this.id = this.$route.params.id
      if (!this.id) this.onClickLeft()
    },
    onClickLeft() {
      this.$router.push('/hc')
    },
    _getArticleDetail(lang) {
      this.loading = true
      getArticleDetail({lang,id: this.id})
        .then(data => {
          this.loading = false
          if (data.code === 0) {
            this.article = data.data
          }
        })
        .catch(err => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
 .article {
   padding: 16px 8px;
 }
 h1 {
   text-align: center;
 }
</style>
