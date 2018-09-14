<template>
  <div class="advertisement">
    <g-head>
      <van-nav-bar
        :title='$t("advertisement.fabuGuangGao")'
      />
    </g-head>
     <p class="advertip" v-if="!twoPhase">{{$t("advertisement.adverTip")}}</p>
    <rule :ruleInfo="ruleInfo"></rule>
    <ad-form
      :payTypeCanUseArr="payTypeCanUseArr"
      :currencyArr="currencyArr"
      :fiatCurrency="fiatCurrency"
      :exchangeArr="exchangeArr"
      :overPercentLimit="overPercentLimit"
      @updatePreset="updatePreset"></ad-form>

    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import { getPreset ,getUserDetail } from 'api/advertisement'
// import { getWalletsList } from 'api/wallets' //暂时用于判断token是否过期及是否登录
import { getCommon } from 'api/common'
import Rule from './rule'
import AdForm from './adForm'

export default {
  data() {
    return {
      ruleInfo: {},
      currencyArr: [],
      fiatCurrency: [],
      exchangeArr: [],
      overPercentLimit: {},
      loading: false,
      payTypeCanUseArr: [],
      twoPhase:false
    }
  },
  created() {
    // getWalletsList()
    this._getUserDetail()
    // this._getPreset({})
    this._getCommon()
  },
  methods: {
    _getUserDetail(){
      getUserDetail().then((res) => {
        if(res.code == 0){
          this.twoPhase= res.data.twoPhase
          this.payTypeCanUseArr = res.data.tradeQRCode || []
          console.log(this.payTypeCanUseArr)
        }
      })
    },
    updatePreset(val) {
      this._getPreset({tradeType: val.tradeType, currency: val.currency, fiatCurrency: val.fiatCurrency})
    },
    _getPreset({tradeType='buy', currency='BTC', fiatCurrency='CNY'}) {
      this.loading = true
      getPreset({tradeType, currency, fiatCurrency})
        .then(data => {
          this.loading = false
          if (data.code !== 0) return
          let obj = {}
          obj.trade = 'sell'
          obj.currency = data.data.currency
          // 广告可见时间
          obj.adVisibleTime = data.data.adVisibleTime
          // 成交手续费应交比例
          obj.orderFeePercent = data.data.orderFeePercent * 100
          // 挂单展示必须数量(卖)
          obj.minAmount = data.data.minAvailableAmountOfSell
          // 挂广告费用（当前币）
          obj.advertiseCostAmount = data.data.advertiseCostAmount
          // 官方手续费折扣
          obj.officialFeePercent = (1 - data.data.officialFeePercent) * 100
          // 官方币种
          obj.officialFee = data.data.officialCurrency
          // 广告费,self 本币支付，official官方币支付，optional优先使用官方币
          obj.adverFee = data.data.advertiseFeeSetting
          // 订单交易费，self 本币支付，official官方币支付，optional优先使用官方币
          obj.orderFee = data.data.orderFeeSetting
          this.ruleInfo = obj
          this.exchangeArr = data.data.exchange;
          console.log( this.exchangeArr)
          this.overPercentLimit = data.data.overPercentLimit
        })
        .catch(err => {
          this.loading = false
        })
    },
    _getCommon() {
      getCommon()
        .then(data => {
          if (data.code !== 0) return
          this.currencyArr = data.data.currency
          this.fiatCurrency = data.data.fiatCurrency
          let currency = "BTC"
          if(this.currencyArr.length > 0){
            currency = this.currencyArr[0]
          }
          this._getPreset({tradeType:'buy', currency: currency, fiatCurrency:'CNY'})
        })
    }
  },
  components: {
    Rule,
    AdForm
  }
}
</script>

<style lang="scss" scoped>
  .advertisement {
    background-color: #f8f9fa;
  }
  .advertip{
     padding: 10px;
    color: #38f;
    background: white;
    line-height: 1.7
  }
</style>

