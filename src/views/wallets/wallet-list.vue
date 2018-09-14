<template>
  <div class="wallet-list">
    <van-list
      v-if="showList.length > 0"
      v-model="loading"
      :finished="true"
    >
      <van-cell v-for="(item, index) in showList" :key="index" class="van-cell-border">
        <template>
          
          <div class="item">
            <div class="currency">
              {{item.currency}}
            </div>
            <span class="divide">|</span>
            <div class="amount">
              <div class="t">
              {{$t("wallets.zangHuYuE")}}：{{item.totalAmount.toFixed(6)}}
              </div>
              <div class="b">
                <div>{{$t("wallets.xiaDanDongJie")}}：{{item.orderFreeze.toFixed(6)}}</div>
                <div>{{$t("wallets.suoCang")}}：{{item.lockAmount.toFixed(6)}}</div>
              </div>
            </div>
          </div>

          <div  class="van-item-address" v-for="(subItem,index) in item.address"  :key="index"
            v-clipboard:copy="subItem.address"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">
            <span v-if="subItem.address" class="addressRow"><span class="address_name"></span>{{subItem.address}} <span class="clickCopy_span">{{$t("wallets.clickCopyAddress",{ msg1:item.currency,msg2:subItem.baseChain})}}</span></span>

          </div>
          <van-button style="margin-top:10px;margin-bottom:10px;" v-if="item.address.length==0"
              type="primary"
              size="small"
              @click="_applyaddress(item.currency)">{{$t("wallets.senQingDiZhi")}}</van-button>

        </template>
      </van-cell>
    </van-list>
    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import { getWalletsList, applyaddress } from 'api/wallets'

export default {
  props: {
    hide: {
      type: Boolean,
      default: false

    },
    hideAll: Boolean
  },
  data() {
    return {
      totalList: [],
      showList: [],
      loading: false
    }
  },
  watch: {
    hide(val) {
     
      if (this.hideAll) return
      if (val) {
        this.showList = this.totalList.filter(ele => {
          return ele.totalAmount > 0
        })
      } else {
        this.showList = this.totalList
      }
    },
    hideAll: {
      handler(val) {
        if (val) {
          this.showList = []
        } else if (this.hide) {
          this.showList = this.totalList.filter(ele => {
            return ele.totalAmount > 0
          })
        } else {
          this.showList = this.totalList
        }
      },
      immediate: true
    }
  },
  created() {
    this._getWalletsList()
  },
  methods: {
    _getWalletsList() {
      this.loading = true
      getWalletsList()
        .then(data => {
          this.loading = false
          if (data.code === 0) {
            this.totalList = data.data.currencyList
            if(!this.hideAll && this.hide){
               this.showList = this.totalList.filter(ele => {
                  return ele.totalAmount > 0
                })
                return;
            }
            if(!this.hideAll && !this.hide){
             this.showList = this.totalList;
             return;
            }
             
          }
        })
        .catch(err => {
          this.loading = false
        })
    },
    _applyaddress(currency) {
      this.loading = true
      applyaddress(currency)
        .then(data => {
          this.loading = false
          if (data.code === 0) {
            this.$toast(this.$t("wallets.senQingChengGong"))
            this._getWalletsList()
          }
        })
        .catch(err => {
          this.loading = false
        })
    },
    onCopy(){
      this.$toast(this.$t("wallets.copySuccess"))
    },
    onError(){

    }
  }
}
</script>

<style lang="scss" scoped>
.addressRow{
  display: block;
  margin-bottom: 6px;
}
.clickCopy_span{
      color: #38f;
}
em{
  font-style: normal;
}
  .van-cell-border:not(:last-child)::after{
    width: 100%;left:0;
    border-bottom-width:10px;
    border-color: #f2f2f2
  }
.item {
  display: flex;
  justify-content: space-around;
  padding-bottom: 10px;
  border-bottom:1px solid #e5e5e5;
  align-items: center;
  .currency {
    line-height: 72px;
  }
  .divide {
    line-height: 72px;
  }
}
.van-item-address{
  padding: 10px 0 5px;
  word-break: break-all
}
</style>

