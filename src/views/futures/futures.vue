<template>
  <div class="futures">
    <!-- <div class="button" v-if="getFuturesUrl == ''">
      <van-button type="primary" @click="_qhEnter">进入期货市场</van-button>
    </div> -->

    <div class="iframe" ref="iframe">
      <iframe
        v-if="getFuturesUrl"
        :src="getFuturesUrl"
        ref="futures"
        width="100%"
        height="100%"
        frameborder='0'
        >
        <p>Your browser does not support iframes.</p>
        
      </iframe>
    </div>

    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { qhEnter } from 'api/futures'

export default {
  data() {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters(['getFuturesUrl', 'getShowFooter', 'getCommon'])
  },
  watch: {
    getFuturesUrl(val) {
      console.log(val)
    }
  },
  created() {
    if (!this.getCommon || !this.getCommon.enableFutures) {
      this.$router.push('/trade')
    }
    //if (this.getFuturesUrl) this.setHeight()
    window.addEventListener("message", (event) => {
      if (this.getFuturesUrl && this.getFuturesUrl.indexOf(event.origin) !== -1) {
        if (event.data.msg === 'logonff') {
          // this.$store.commit('setFuturesUrl', '')
          this._qhEnter()
        }
      }
    }, false);

    this.$store.commit('setShouldAbsolute', true)
   
    this._qhEnter()
  },
  mounted() {
    this.setHeight()
    this.$store.commit('setFooterActive', 'innerTrade')
    const logout = this.$route.query.logout
    if (logout) {
      this.$nextTick()
        .then(() => {
          this.logoutFutures()
        })
    }
  },
  destroyed() {
    this.$store.commit('setShouldAbsolute', false)
  },
  methods: {
    setHeight() {
      setTimeout(() => {
        const iframe = this.$refs.iframe
        if (iframe) iframe.style.height = document.body.clientHeight - 56 + 'px'
      }, 20)
    },
    _qhEnter() {
      qhEnter()
        .then(data => {
          this.loading = false
          if (data.code !== 0) return
          this.$store.commit('setFuturesUrl', data.data.address)
          this.setHeight()
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 退出期货交易所
    logoutFutures() {
      //获取iframe元素
      const iFrame = this.$refs.futures
      //iframe加载完毕后再发送消息，否则子页面接收不到message
      if (iFrame) {
        iFrame.onload = () => {
          //iframe加载完立即发送一条消息
          iFrame.contentWindow.postMessage('logout','*')
          this.$store.commit('setFuturesUrl', '')
        }
      }
    },
    // footer
    isResize() {
      setTimeout(() => {
        const iFrame = this.$refs.futures
        iFrame.scrollIntoView(true)
      }, 200)
    }
  }
}
</script>

<style lang="scss" scoped>
  .futures {
    margin-top: -46px;
    height: 100%;
    .button {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 18px);
      z-index: 10;
    }
    .iframe {
      position: relative;
      overflow: scroll;
    }
  }
</style>

