<template>
  <div class="more">
    <g-head>
      <van-nav-bar
        :title="lang"
        left-arrow
        @click-left="onClickLeft"
      />
    </g-head>
    <div class="list">
      <ul>
        <li class="message" v-for="(item, index) in list" :key="index">
          <router-link :to="'/hc/article/' + item.id">{{item.title}} ({{ $timeFormat(item.time, false) }})</router-link>
        </li>
      </ul>
    </div>
    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import { getArticleList } from 'api/hc'
import { Hc } from 'assets/js/object'

export default {
  data() {
    return {
      lang: '',
      list: [],
      loading: false
    }
  },
  created() {
    this.init()
    this._getArticleList()
  },
  methods: {
    init() {
      const query = this.$route.query
      this.tags = query.tags
      this.lang = query.lang
    },
    onClickLeft() {
      this.$router.push('/hc')
    },
    _getArticleList() {
      this.loading = true
      getArticleList({tags: this.tags})
        .then(data => {
          this.loading = false
          if (data.code === 0) {
            data.data.forEach(item => {
              this.list.push(new Hc({
                id: item._id,
                time: item.updateTime,
                title: item.title,
                lang: item.tags[0].lang
              }))
            })
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
.more {
  padding: 0 12px;
}
.message {
  font-size: 14px;
  padding: 12px 0;
  cursor: pointer;
  border-bottom: 1px solid #ddd;

  a {
    color: $color-black;
  }
}
</style>
