<template>
  <div class="integral" v-if="base.currency">
    <g-head class="g-head">
      <van-nav-bar
         :title='$t("wallets.jiFenZhuanHuan")'
        left-arrow
        @click-left="onClickLeft" >
      </van-nav-bar>
    </g-head>

    <!-- 切换转换方式 -->
    <div class="hide-wallet">
      <span>{{ transText }}</span>
      <van-switch v-model="transType" />
    </div>

    <div class="box">
      <!-- usdt余额 -->
      <span class="text-pay">
        {{base.fromCurrency}} {{$t("wallets.yuE")}}: {{base.fromAmount.toFixed(6)}}
      </span>
      <!-- panda积分 -->
      <span class="text-pay">
        {{base.currency}} {{$t("wallets.jiFen")}}: {{base.amount.toFixed(6)}}
      </span>
      <van-cell-group
        class="over-percent">
        <!-- 转换数量 -->
        <van-field
          :label='$t("wallets.zhuanHuanShuLiang")'
          @input="onChangeTransfer"
          v-model="amount" type="number"
          :placeholder='$t("wallets.huaZhuangShuLiang")'
        />
          <!-- panda -->
        <van-field
          style="background-color: #eee"
          :label="transType ? base.currency : base.fromCurrency"
          v-model="transNumber"
          disabled />
      </van-cell-group>
      <!-- 按钮 -->
      <div class="submit">
        <van-button :disabled="disabled"
          type="primary" @click="_transfer">{{transText}}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getBase,transQH } from 'api/futures'

export default {
  data() {
    return {
      amount: 0,
      isCreateQh: false,
      disabled: false,
      base: {},
      // true 转换为期货积分，false转换为数字币
      transType: true
    }
  },
  computed: {
    transText() {
      return this.transType ? `${this.$t("wallets.zhuanHuanWei")}${this.base.currency}` : `${this.$t("wallets.zhuanHuanWei")}${this.base.fromCurrency}`
    },
    transNumber() {
      if (this.amount === 0) return 0
      if (this.transType) {
        return (this.amount * this.base.rate).toFixed(6)
      } else {
        return (this.amount / this.base.rate).toFixed(6)
      }
    }
  },
  watch: {
    transType(val) {
      this.amount = 0
    }
  },
  created() {
    this._getBase()
  },
  methods: {
    onClickLeft() {
      this.$router.push('/wallets')
    },
    _getBase() {
      getBase()
        .then(data => {
          if (data.code !== 0) return
          this.base = data.data
        })
    },
    _transfer() {
      if (this.amount <= 0) {
        this.$toast.fail(this.$t("wallets.huaZhangShuLiang0"))
        return
      }
      this._transQH(+this.amount, this.transType)
    },
    _transQH(fromAmount, isToQH) {
      transQH({fromAmount, isToQH})
        .then(data => {
          if (data.code !== 0) return
          this.$toast(this.$t("wallets.zhuanHuanChengGong"))
          this.amount = 0
          this._getBase()
        })
    },
    onChangeTransfer() {
      const f = this.amount.split('.')[1]
      const len = f ? f.length : 0
      if (len > 2) {
        setTimeout(() => {
          this.amount = Number(this.amount).toFixed(6)
        }, 20)
      }
    },
  }
}
</script>

<style lang="scss">
  .integral {
    .box {
      .van-cell__value {
        margin-left: 20px;
        padding-left: 20px;
        border-left: 1px solid #bbb;
        text-align: left;
      }
      .van-cell__title {
        text-align: justify;
        text-justify: distribute-all-lines;
        text-align-last: justify;
      }
    }
    .submit {
      .van-button:first-child {
        margin-right: 12px;
      }
      .van-button:last-child {
        margin-left: 12px;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .box {
    padding: 8px 0;
    .text-pay {
      display: block;
      padding:8px;
    }
    .submit {
      display: flex;
      justify-content: center;
      padding: 16px;
      text-align: center;
    }
  }
  .hide-wallet {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        height: 48px;
        margin-bottom: 0px;
        border-bottom: 1px solid #e5e5e5;
        background-color: #fff;
        line-height: 32px;
        font-size: 14px;
    }
</style>
