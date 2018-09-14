<template>
  <div class="trade">
    <g-head>
      <van-nav-bar>
        <div class="head-cut" slot="title">
          <div class="left" @click="cut(1)"
            :class="{active: select === 1}">{{$t('common.buyCurrency')}}</div>
          <div class="right"  @click="cut(2)"
            :class="{active: select === 2}">{{$t('common.sellCurrency')}}</div>
        </div>
         <div slot="right" >
           <van-icon name="search"  @click="search = !search" />
         </div>
        <van-icon name="add-o" slot="left" @click="handleClickAdver" />
      </van-nav-bar>
    </g-head>

    <div class="currency">
      <van-tabs :duration="0.5"
        @click="cutTabs" :active="activeCurrency">
        <van-tab
          v-for="(item, index) in currencyList" :key="index"
          :title="item">
        </van-tab>
      </van-tabs>
    </div>


    <van-pull-refresh  :loosing-text='$t("loading.siFangJikeShuaXin")' :loading-text='$t("loading.jiaZaiZhong")' :pulling-text='$t("loading.xiaLaJiKeShuaXin")'
      v-model="isLoading" @refresh="onRefresh">
      <trade-list @refreshEnd="refreshEnd" :refresh="refresh"
        @loadingChange="loadingChange"></trade-list>
    </van-pull-refresh>

   <!-- 币选择 -->
    <van-popup v-if="fiatCurrencyObj['CNY']" v-model="search" position="bottom">
      <van-picker show-toolbar :title="$t('common.pleaseChoose')"  :cancel-button-text="$t('common.cancel')"
       :confirm-button-text="$t('common.sure')" 
        @cancel="cancelSelect" @confirm="confirmSelect"
        :columns="columns" @change="handleSelect" />
    </van-popup>

    <my-marquee>
      <span
        v-for="(val, i) in ordersData"
        :key="i"
        style="margin-right: 24px;font-size: 12px;" >
        {{
          val.order.type === 'buy'
            ? `${val.order.customer} ${$t('common.use')} ${val.order.fiatCurrency} ${$t('common.gouMai')}
            ${val.order.amount.toFixed(6)}${val.order.currency} ${format(val.time, 'hh:mm:ss')}`
            : `${val.order.customer} ${$t('common.maiChu')} ${val.order.amount.toFixed(8)}${val.order.currency} ${$t('common.huanQu')} ${val.order.fiatCurrency} ${format(val.time, 'hh:mm:ss')}`
        }}
      </span>
    </my-marquee>

    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import TradeList from './tradeList'
import MyMarquee from 'components/my-marquee/myMarquee'
import { getCommon } from 'api/common'
import { mapGetters } from 'vuex'
import { getOrdersInfo } from 'api/common'

export default {
  data() {
    return {
      refresh: 0,
      isLoading: false,
      loading: false,
      currencyList: [],
      search: false,
      fiatCurrencyObj: {},
      currency: '',

      ordersData: [],
      timmer: null,
       
      
   
    }
  },
  computed: {
    // 当前的currency
    activeCurrency() {
      if (this.currencyList) {
        return this.currencyList.indexOf(this.currency)
      } else return 0
    },
    // 连级选择器数据
    columns() {
      if (this.fiatCurrencyObj['CNY']) {
        return [
          {
            values: Object.keys(this.fiatCurrencyObj),
            className: 'column1'
          },
          {
            values: this.fiatCurrencyObj['CNY'],
            className: 'column2'
          }
        ]
      } else {
        return []
      }
    },
    // 当前的类型
    select() {
      if (this.getTradeSearch.tradeType === 'sell') return 2
      else return 1
    },
    ...mapGetters(['getTradeSearch', 'getCommon'])
  },
  watch: {
    getTradeSearch: {
      handler(val) {
        this.currency = val.currency || 'BTC'
      },
      deep: true,
      immediate: true
    },
    "getCommon": {
      handler(val) {
        if (this.timmer) clearInterval(this.timmer)
        const m = val ? val.lampRefresh : 10
        this.timmer = setInterval(() => {
          this._getOrdersInfo()
        }, 1000 * m)
      },
      deep: true,
      immediate: true
    },
 
  },
  created() {
    this._getOrdersInfo(true)
    this._getCommon()
    this.$store.commit('setFooterActive', 'outTrade')
    this.$store.commit('setShowFooter', 1);
    //关闭app内部的h5浏览器
    // if(window.cordovaBrower){
    //   window.cordovaBrower.close();
    // }
  },
  destroyed() {
    clearInterval(this.timmer)
  },
  methods: {
    // 切换买币/卖币
    cut(num) {
      this.trade = num === 1 ? 'buy' : 'sell'
      this.$store.commit('setTradeSearch', {tradeType: this.trade,currency:this.currency})
    },
    // 下拉刷新
    onRefresh() {
      this.refresh += 1
    },
    // 刷新完毕
    refreshEnd() {
      this.$toast(this.$t('common.shuaXinSuccess'));
      this.isLoading = false;
    },
    // 切换数字币类型
    cutTabs(...argv) {
     
      this.currency = argv[1]
      this.$store.commit('setTradeSearch', {currency: argv[1]})
    },
    // 条件筛选值改变
    handleSelect(picker, values) {
      picker.setColumnValues(1, this.fiatCurrencyObj[values[0]]);
    },
    // 取消条件筛选
    cancelSelect() {
      this.search = false
    },
    // 确定筛选
    confirmSelect(values) {
      this.$store.commit('setTradeSearch', {fiatCurrency: values[0], currency: values[1]})
      this.currency = values[1]
      this.search = false
    },
    // 发布广告页面
    handleClickAdver() {
      this.$router.push('/advertisement')
    },
    loadingChange(val) {
      this.loading = val
    },
    _getCommon() {
      getCommon('yes')
        .then(data => {
          if (data.code === 0) {
            this.currencyList = data.data.currency
            this.currency=data.data.currency[0]
            this.$store.commit('setTradeSearch', {currency:this.currency})
            data.data.fiatCurrency.forEach(item => {
              this.fiatCurrencyObj[item.name] = this.currencyList
            })
          }
        })
    },
    // 订单轮询
    _getOrdersInfo(init) {
      getOrdersInfo(init)
        .then(list => {
          if (list) {
            this.ordersData = this.ordersData.concat(list.slice(0, 2))
          }
          if (this.ordersData.length > 60) {
            this.ordersData = []
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  components: {
    TradeList,
    MyMarquee
  }
}
</script>

<style lang="scss">
.trade {
  .van-notice-bar {
    position: absolute;
    bottom: 68px;
    left: 0;
    right: 0;
  }
}
</style>


<style lang="scss" scoped>
  .trade {
    padding-top: $van-tabs-height;
    overflow: hidden;
    .van-nav-bar {
      padding: 8px 0;
    }
    .currency {
      position: fixed;
      top: $header-height;
      left: 0;
      right: 0;
      height: $van-tabs-height;
      z-index: 100;
    }
  }
  .head-cut {
    display: flex;
    width: 140px;
    height: 30px;
    margin: 0 auto;
    border: 1px solid $color-theme;
    line-height: 30px;
    border-radius: 4px;
    color: $color-theme;
    .left {
      border-right: 1px solid $color-theme;
    }
    .left, .right {
      width: 50%;
    }
    .active {
      background-color: $color-theme;
      color: $color-white;
    }
  }
  .notice-bar {
    position: fixed;
    bottom: 68px;
    left: 0;
    right: 0;
    height: 40px;
    z-index: 100;
  }
  .mar {
    width: 9999px;
    display: flex;
  }
  .languageWrapper{
        position: absolute;
    right: 0;
    width: 90px;
    text-align: center;
  }
</style>

