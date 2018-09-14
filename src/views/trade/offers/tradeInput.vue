<template>
  <div v-if="detail.tradeType" class="trade-input">
    <div class="box d2" v-if="showUSDT">
      <!-- 是否使用USDT支付 -->
      <div class="allow-pay">
        <van-cell-group>
          <van-cell
            :title="textUSDT">
            <van-checkbox v-model="isUSDT" />
          </van-cell>
        </van-cell-group>
      </div>
    </div>

    <h3>{{ $t('common.ask', { msg: trade }) }}</h3>
    <div class="limit">
      {{$t("common.xianE")}}:
      <span v-if="detail.orderCeilPrice >= detail.orderFloorPrice">
      {{ detail.orderFloorPrice.toFixed(2) }} - {{ detail.orderCeilPrice.toFixed(2) }}
      {{  detail.tradeType === 'buy' ? detail.currency : detail.fiatCurrency }}
      </span>
      <span v-else>{{$t("common.yiShouWan")}}</span>
    </div>
    <div class="input">
      <van-cell-group>
        <van-field
          v-if="!isUSDT"
          v-model="fiatCurrency"
          type="number"
          :label="detail.fiatCurrency"
          :placeholder='$t("common.buyMoney")'
          @input="handleFiatCurrency"
        />

        <van-field
          v-if="isUSDT"
          v-model="usdt"
          type="number"
          label="USDT"
         :placeholder='$t("common.buyMoney")'
          @input="handleFiatCurrency"
        />

        <van-field
          v-model="currency"
          type="number"
          :label="detail.currency"
         :placeholder='$t("common.buyAmount")'
          @input="handleCurrency"
        />
      </van-cell-group>
      <div class="radio" v-if="!isUSDT">
        <van-radio v-for="(item, index) in detail.allowPay" :key="index"
          :name="item" v-model="payType">{{item | payTypeFilter}}</van-radio>
      </div>
    </div>

    <div class="submit">
      <van-button @click="handleCreate" type="primary" :disabled="disabled">{{submitText}}</van-button>
    </div>
  </div>
</template>

<script>
import { convert, createTrade } from 'api/trade'

export default {
  props: {
    detail: {
      type: Object,
      default: () => { return {} }
    },
    adverId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      payType: '',
      currency: 0,
      fiatCurrency: 0,
      convertTo: '',
      isCommit: true,
      isUSDT: false,
      usdt: 0,
      configFiatBi:"USDT"
    }
  },
  created(){
    this.configFiatBi= localStorage.getItem("configFiatBi");
  },
  computed: {
    trade() {
      return this.detail.tradeType === 'buy' ? this.$t("common.maiChu") : this.$t("common.gouMai")
    },
    disabled() {
      return !(this.currency && (this.fiatCurrency || this.usdt) && (this.payType || this.isUSDT) && this.isCommit)
    },
    submitText() {
      return this.detail.tradeType === 'buy' ? this.$t("common.liJiMaiChu") : this.$t("common.liJiMaiRu")
    },
    id() {
      return this.detail._id
    },
    convertAmount() {
      if (this.convertTo === 'currency' && this.isUSDT) return this.usdt
      if (this.convertTo === 'currency' && !this.isUSDT) return this.fiatCurrency
      if (this.convertTo === 'fiatCurrency') return this.currency
      else return ''
    },
    textUSDT() {
      return this.detail.tradeType === 'buy' ? this.$t("common.ask2",{msg:this.configFiatBi}) : this.$t("common.ask3",{msg:this.configFiatBi})
    },
    showUSDT() {
      return this.detail.isUSDT
    }
  },
  watch: {
    isUSDT(val) {
      this.fiatCurrency = 0
      this.currency = 0
      this.usdt = 0
    }
  },
  methods: {
    // 转换数字币与法币
    _convert(amount, convertTo) {
      convert({id: this.id, amount, convertTo})
        .then(data => {
          if (data.code === 0) {
            if (convertTo === 'currency') {
              this.currency = this.isUSDT ? data.data.usdtAmount.toFixed(8)
                : data.data.convertVal.toFixed(8)
            } else if (convertTo === 'fiatCurrency') {
              if (this.isUSDT) {
                this.usdt = data.data.usdtAmount.toFixed(2)
              } else {
                this.fiatCurrency = data.data.convertVal.toFixed(2)
              }
            }
          }
        })
    },
    handleFiatCurrency() {
      // 降低频率
      if (this.timmer) clearTimeout(this.timmer)
      this.timmer = setTimeout(() => {
        if (!this.fiatCurrency && !this.usdt) return
        this.convertTo = 'currency'
        const num = this.isUSDT ? this.usdt : this.fiatCurrency
        this._convert(num, 'currency')
      }, 300)
    },
    handleCurrency() {
      if (this.timmer) clearTimeout(this.timmer)
      this.timmer = setTimeout(() => {
        if (!this.currency) return
        this.convertTo = 'fiatCurrency'
        this._convert(this.currency, 'fiatCurrency')
      }, 300)
    },
    _createTrade() {
      this.isCommit = false
      return createTrade({
        advertiseId: this.adverId,
        payType: this.payType,
        convertTo: this.convertTo,
        convertAmount: this.convertAmount,
        usdt: this.isUSDT
      })
      .then(data => {
        this.isCommit = true
        if (data.code === 0) {
          return data.data.orderCode
        }
      })
      .catch(err => {
        this.isCommit = true
      })
    },
    // 创建订单
    handleCreate() {
      this._createTrade().then(code => {
        if (code) this.$router.push(`/trade/trading/${code}`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.trade-input {
  padding: 16px 8px;
  background-color: #fff;
  h3 {
    margin: 0;
  }
  .limit {
    margin: 12px 0;
    color: $color-success;
  }
  .radio {
    display: flex;
    flex-wrap: wrap;
    margin: 14px 0;
    .van-radio {
      margin-right: 12px;
    }
  }
  .submit {
    text-align: center;
    margin-top: 16px;
    .van-button {
      width: 90%;
    }
  }
  .box {
    margin-bottom: 16px;
  }
}
</style>

