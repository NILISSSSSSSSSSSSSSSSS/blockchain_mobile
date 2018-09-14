<template>
  <div class="trading" ref="trading">
    <g-head>
      <van-nav-bar
        :title="title"
        left-arrow
        @click-left="onClickLeft"
      />
    </g-head>
    <order-info :orderInfo="orderInfo"></order-info>
    <pay-info :orderInfo="orderInfo"></pay-info>
    <operate @updateStatus="updateStatus"
      :orderInfo="orderInfo" :status="orderInfo.status"></operate>
    <chat v-if="orderType"></chat>

    <div class="top" @click="goTop">
      <van-icon name="upgrade"></van-icon>
    </div>

    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import { getTradeDetails } from 'api/trade'
import OrderInfo from './order-info'
import PayInfo from './pay-info'
import Operate from './operate'
import Chat from './chat/chat'

export default {
  data() {
    return {
      orderInfo: {},
      orderType: '',
      loading: false
    }
  },
  computed: {
    title() {
      if (!this.orderType) return ''
      let trade = this.orderType === 'buy' ? this.$t("common.gouMai") : this.$t("common.chuShou")
      return `${trade}${this.orderInfo.currency}(${this.orderInfo.otherUserName})`
    }
  },
  created() {
    this._getTradeDetails()
    this.$store.commit('setShowFooter', 0)
  },
  methods: {
    _getTradeDetails(load=true) {
      if(load) this.loading = true
      this.id = this.$route.params.id
      this.type = this.$route.query.type === 'orderId' ? 'orderId' : 'orderCode'
      if (!this.id) this.$router.push('/trade')
      getTradeDetails({id: this.id, type: this.type})
        .then(data => {
          this.loading = false
          if (data.code === 0) {
            this.orderInfo = data.data
            this.orderType = data.data.orderType
          }
        })
        .catch(err => {
          this.loading = false
        })
    },
    updateStatus() {
      this._getTradeDetails(false)
    },
    onClickLeft() {
      this.$router.push('/orders')
      this.$store.commit('setFooterActive', 4)
      this.$store.commit('setShowFooter', 1)
    },
    goTop() {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
  },
  components: {
    OrderInfo,
    PayInfo,
    Operate,
    Chat
  }
}
</script>

<style lang="scss" scoped>
  .trading {
    margin-bottom: -60px;
  }
  .top {
    position: fixed;
    right: 10px;
    bottom: 110px;
    .van-icon {
      font-size: 30px;
    }
  }
</style>
