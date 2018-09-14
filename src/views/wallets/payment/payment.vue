<template>
  <div class="payment">
    <g-head>
      <van-nav-bar
        :title='$t("wallets.fuKuan")'
        left-arrow
        @click-left="onClickLeft"
      />
    </g-head>
    <div v-if="!currencyArr.length">
      <van-cell-group>
        <van-cell :title='$t("wallets.avaiBalance")'  />
      </van-cell-group>
    </div>
    <div class="select" v-else>
      <!-- 选择数字币 -->
      <van-cell-group>
        <van-cell :title='$t("wallets.supportCurrencySort")' is-link :value="balance" @click="selectCurrency = true" />
      </van-cell-group>
      <!-- 二维码 -->
      <div class="qrcode" v-if="qrVal">
        <qrcode :value="qrVal" class="qr" size="300"></qrcode>
      </div>
    </div>
 
    <van-popup v-model="selectCurrency" position="bottom" :overlay="true">
      <van-picker :columns="currencyArr"   @change="onChangeCurrency"  value-key="currency"  />
    </van-popup>
  </div>
</template>

<script>
import { getWalletsList } from 'api/wallets'
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      selectCurrency: false,
      currencyArr: [],
      currency: ''
    }
  },
  computed: {
    qrVal() {
      if(this.currency){
        return `${this.get_Id}_${this.currency}`
      }else{
        return ""
      }
    },
    balance() {
      if(this.currency){
        let index = this.currencyArr.findIndex((item) => {
          return item.currency === this.currency
        })
        if(index > -1){
          return this.currency + this.$t("wallets.yuE") + ":" + this.currencyArr[index].availableAmount
        }
        return ""
      }
    },
    ...mapGetters(['get_Id', 'getToken'])
  },
  created() {
    if (!this.getToken) {
      this.$router.push('/account')
    }
    this._getWalletsList()
  },
  methods: {
    onClickLeft() {
      this.$router.push('/wallets')
    },
    onChangeCurrency(picker,item) {
      // console.log(currency)
      this.currency = item.currency
      if (!this.get_Id) {
        this.$router.push('/account')
      }
      this.selectCurrency = false
    },
    _getWalletsList(){
      getWalletsList().then((res) => {
        if(res.code == 0){
          let data = res.data;
          if(data.currencyList.length > 0){
            data.currencyList.forEach((item) => {
              if(item.totalAmount > 0 && item.enableTrade){
                this.currencyArr.push(item)
              }
            })
            if(this.currencyArr.length > 0){
              this.currency = this.currencyArr[0].currency
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .qrcode {
    margin-top: 24px;
    text-align: center;
  }
</style>

