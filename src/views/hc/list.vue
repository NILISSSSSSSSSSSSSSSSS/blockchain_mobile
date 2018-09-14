<template>
  <div class="list">
    <!-- 帮助中心 -->
    <div v-if="type === 'help'" class="help-box">
      <h3 class="title">{{ helpObj.lang }}</h3>
      <ul>
        <li class="message" v-for="(item, index) in helpObj.list.slice(0, showLen)" :key="index">
          <router-link :to="'/hc/article/' + item.id">{{item.title}} ({{ $timeFormat(item.time, false) }})</router-link>
        </li>
        <li v-if="helpObj.list.length > showLen" class="more">
          <span @click="showMore([helpObj.title, 'help'], helpObj.lang)">{{$t("hc.readMoreArticle")}}</span>
        </li>
      </ul>
    </div>
    <!-- 公告中心 -->
    <div v-if="type === 'notice'" class="notice-box">
      <router-link tag="div" :to="'/hc/article/' + item.id"
        v-for="(item, index) in noticeList.slice(0, showLen)" :key="index">
        {{item.title}} ({{ $timeFormat(item.time, false) }})
      </router-link>
      <li v-if="noticeList.length > showLen" class="more">
        <span @click="showMore(['notice'], this.$t('hc.notice'))">{{$t("hc.readMoreNotice")}}</span>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    helpObj: {
      type: Object,
      default: () => { return {} }
    },
    noticeList: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      showLen: 6
    }
  },
  methods: {
    showMore(tags, lang) {
      this.$router.push({path: '/hc/more', query: {
        tags: tags,
        lang: lang
      }})
    }
  }
}
</script>

<style lang="scss" scoped>
  .help-box {
    margin-top: 24px;
    .more {
      margin: 8px 0;
      span {
        color: $color-success;
      }
    }
  }
  .notice-box,
  .help-box .message {
    font-size: 14px;
    padding: 12px 0;
    cursor: pointer;
    border-bottom: 1px solid #ddd;

    a {
      color: $color-black;
    }
  }
</style>
