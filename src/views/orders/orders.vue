<template>
  <div class="orders">
    <g-head class="g-head">
      <van-nav-bar
        left-arrow
        @click-left="onClickLeft" >
        <div slot="title" class="cut">
          <div class="one" @click="cutType(1)"
            :class="{active: select === 1}"> {{$t("order.all")}}</div>
          <div class="two"  @click="cutType(2)"
            :class="{active: select === 2}"> {{$t("order.maiDan")}}</div>
          <div class="three"  @click="cutType(3)"
            :class="{active: select === 3}"> {{$t("order.maiDan2")}}</div>
        </div>
      </van-nav-bar>
    </g-head>

    <div class="status">
      <van-tabs @click="cutStatus" :active="activeStatus">
        <van-tab
          v-for="(item, index) in statusList" :key="index"
          :title="item.label">
        </van-tab>
      </van-tabs>
    </div>

    <van-pull-refresh  :loosing-text='$t("loading.siFangJikeShuaXin")' :loading-text='$t("loading.jiaZaiZhong")' :pulling-text='$t("loading.xiaLaJiKeShuaXin")' v-model="isLoading" @refresh="onRefresh">
      <order-list @refreshEnd="refreshEnd" :refresh="refresh"
        @loadingChange="loadingChange"></order-list>
    </van-pull-refresh>

    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import OrderList from './order-list'

export default {
  data() {
    return {
      statusList: [],
      refresh: 0,
      isLoading: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getOrderSearch']),
    activeStatus() {
      if (this.getOrderSearch.orderStatus === 'waitPay') return 0
      if (this.getOrderSearch.orderStatus === 'waitCoin') return 1
      if (this.getOrderSearch.orderStatus === 'normal_success') return 2
      if (this.getOrderSearch.orderStatus === 'cancel') return 3
      if (this.getOrderSearch.orderStatus === 'expire') return 4
      if (this.getOrderSearch.orderStatus === 'commit') return 5
      if (this.getOrderSearch.orderStatus === 'appeal_success') return 6
      if (this.getOrderSearch.orderStatus === 'appeal_fail') return 7
      else return 1
    },
    select() {
      if (this.getOrderSearch.orderType === 'buy') return 2
      if (this.getOrderSearch.orderType === 'sell') return 3
      else return 1
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    init() {
      this.statusList = [
        {value: 'waitPay', label: this.$t("common.dengDaiFangKuan")},
        {value: 'waitCoin', label: this.$t("common.dengDaiFangBi")},
        {value: 'normal_success', label: this.$t("common.jiaoYiWanCheng")},
        {value: 'cancel', label: this.$t("common.yiQuXiao")},
        {value: 'expire', label: this.$t("common.yiGuoQi")},
        {value: 'commit', label: this.$t("common.senShuZhong")},
        {value: 'appeal_success', label: this.$t("common.shenShuChengGong")},
        {value: 'appeal_fail', label: this.$t("common.shenShuFail")},
      ]
      if (!this.getOrderSearch.orderStatus) {
        this.cutStatus(1)
      }
    },
    // 切换请求type
    cutType(num) {
      let orderType = ''
      if (num === 2) orderType = 'buy'
      if (num === 3) orderType = 'sell'
      this.$store.commit('setOrderSearch', {orderType})
    },
    // 切换请求状态
    cutStatus(...argv) {
      let orderStatus = ''
      if (argv[0] === 0) orderStatus = 'waitPay'
      if (argv[0] === 1) orderStatus = 'waitCoin'
      if (argv[0] === 2) orderStatus = 'normal_success'
      if (argv[0] === 3) orderStatus = 'cancel'
      if (argv[0] === 4) orderStatus = 'expire'
      if (argv[0] === 5) orderStatus = 'commit'
      if (argv[0] === 6) orderStatus = 'appeal_success'
      if (argv[0] === 7) orderStatus = 'appeal_fail'
      this.$store.commit('setOrderSearch', {orderStatus})
    },
    // 刷新
    onRefresh() {
      this.refresh += 1
    },
    // 刷新完毕
    refreshEnd() {
      this.$toast(this.$t("common.shuaXinSuccess"));
      this.isLoading = false;
    },
    loadingChange(val) {
      this.loading = val
    },
    onClickLeft() {
      this.$router.push('/account')
    }
  },
  components: {
    OrderList
  }
}
</script>

<style lang="scss">
  .orders {
    .status {
      .van-tabs {
        .van-tab {
          min-width: 90px;
        }
      }
    }
  }
</style>


<style lang="scss" scoped>
  .orders {
    padding-top: $van-tabs-height;
    overflow: hidden;
  }
  .van-nav-bar {
    padding-top: 8px;
  }
  .van-tabs {
    .van-tab {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
  .cut {
    display: flex;
    width: 210px;
    height: 30px;
    margin: 0 auto;
    border: 1px solid $color-theme;
    line-height: 30px;
    border-radius: 4px;
    color: $color-theme;
    .one, .two, .three {
      width: 33%;
      text-align: center;
    }
    .two {
      width: 34%;
    }
    .two {
      border-right: 1px solid $color-theme;
      border-left: 1px solid $color-theme;
    }
    .active {
      background-color: $color-theme;
      color: $color-white;
    }
  }
  .status {
    position: fixed;
    top: $header-height;
    left: 0;
    right: 0;
    height: $van-tabs-height;
    z-index: 100;
  }
</style>
<style>
.orders .status .van-tabs .van-tab {
  min-width: 120px;
}
</style>


