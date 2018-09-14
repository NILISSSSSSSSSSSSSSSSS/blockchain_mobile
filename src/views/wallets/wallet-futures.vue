<template>
  <div class="wallet-futures">
    <div class="box">
      <!-- 余额 -->
      <span class="text-pay">
        {{base.fromCurrency}} {{$t("wallets.yuE")}}: {{usdtYeE}}
      </span>
      <van-cell-group class="over-percent">
        <!-- 转入数量 -->
        <van-field :label='$t("wallets.importAmount")' @input="onChangeTransfer" v-model="amount" type="number" :placeholder='$t("wallets.importAmount")'
        />
        <van-field style="background-color: #eee" :label="$t('wallets.innerAmount')" v-model="transNumber" disabled/>
      </van-cell-group>
      <div class="submit">
        <!-- :disabled="!isCreateQh" -->
        <van-button type="primary" @click="_transfer" :disabled="!isCreateQh"> {{$t("wallets.zhuanRuChangNei")}}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { getBase, transfer,membercheck } from 'api/futures'
  export default {
    data() {
      return {
        amount: 0,
        currency: '',
        qhAddress: '',
        isCreateQh: false,

        usdtYeE: 0,
        base: "",
        // true 转换为期货积分，false转换为数字币
        transType: true,
        member:false
      }
    },
    watch:{
    
    },
    created() {
      this._getBase();
      this._membercheck();
    },
    computed: {
      transNumber() {
        if (this.amount === 0) return 0
        if (this.transType) {
          return (this.amount * this.base.rate).toFixed(6)
        } else {
          return (this.amount / this.base.rate).toFixed(6)
        }
      }
    },
    methods: {
      _membercheck(){
      membercheck().then(data => {
        if (data.code == 0){
          this.member=true;
        }
        else if(data.code == 50016){
          this.member=false;
        }
        console.log(this.member)
        })
    },
      _getBase() {
        getBase()
          .then(data => {
            if (data.code !== 0) return

            this.base = data.data
            this.currency = data.data.currency
            this.qhAddress = data.data.qhAddress
            this.isCreateQh = data.data.isCreateQh
            this.usdtYeE = data.data.fromAmount.toFixed(6);
           
          })
      },
      // 转入
      _transfer() {
        if(!this.member){
          this.$toast.fail(this.$t("wallets.notNumber"))
          return;
        }
        if (+this.amount <= 0) {
          this.$toast.fail(this.$t("wallets.zhuanRuDayu0"))
          return
        }
        if (+this.amount > this.usdtYeE) {
          this.$toast.fail(this.$t("wallets.zhuanRuDayuE"))
          return
        }
        transfer({ amount: +this.amount })
          .then(data => {
            if (data.code !== 0) return
            this.$toast.fail(this.$t("wallets.zhuanChangNeiSuccess"))
            this.amount = 0

            this._getBase()
          })
      },
      onChangeTransfer() {
        const f = this.amount.split('.')[1]
        const len = f ? f.length : 0
        if (len > 2) {
          setTimeout(() => {
            this.amount = Number(this.amount).toFixed(2)
          }, 20)
        }
      },
    }
  }
</script>

<style lang="scss">
  .wallet-futures {
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
  }
</style>

<style lang="scss" scoped>
  .box {
    padding: 16px 0;
    .text-pay {
      display: inline-block;
      padding: 8px;
    }
    .submit {
      padding: 16px;
      text-align: center;
    }
  }
</style>