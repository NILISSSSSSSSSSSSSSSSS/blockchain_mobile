<template>
  <div class="trade">
    <g-head>
      <van-nav-bar :title='$t("fastTrade.fastTradeTit1",{msg:this.configFiatBi})' />
    </g-head>

    <div class="currency">
      <van-tabs :duration="0.5" @click="cutTabs" :active="activeCurrency">
        <van-tab v-for="(item, index) in currencyList" :key="index" :title="item">
        </van-tab>
      </van-tabs>
    </div>
     <!-- 快速交易列表 -->
    <div class="list-wraper"> 
      <van-pull-refresh  :loosing-text='$t("loading.siFangJikeShuaXin")' :loading-text='$t("loading.jiaZaiZhong")' :pulling-text='$t("loading.xiaLaJiKeShuaXin")'  v-model="isLoading1" @refresh="onRefresh1" class="list" ref="left">
        <trade-list @refreshEnd="refreshEnd1"  :currencylist="currencyList"  :refresh="refresh1" @loadingChange="loadingChange" @trading="trading"  :tradeType="'buy'"></trade-list>
      </van-pull-refresh>

      <van-pull-refresh :loosing-text='$t("loading.siFangJikeShuaXin")' :loading-text='$t("loading.jiaZaiZhong")' :pulling-text='$t("loading.xiaLaJiKeShuaXin")' v-model="isLoading2" @refresh="onRefresh2" class="list" ref="right">
        <trade-list @refreshEnd="refreshEnd2" :currencylist="currencyList"  :refresh="refresh2" @loadingChange="loadingChange" @trading="trading"  :tradeType="'sell'"></trade-list>
      </van-pull-refresh>
    </div>

    <van-popup v-model="tradingFlag" position="bottom" class="offers" @click-overlay="popCancel">
      <div class="trade-input">
        <div class="title">{{popTitle}}</div>
        <!-- <van-field center v-model="trade.amount" label="买卖数量" type="number" placeholder="请输入买卖数量" icon="clear" @click-icon="trade.amount=''" /> -->

        <div class="buyAmount" v-if="isbuy">
          <p>{{$t("fastTrade.buyAsk1")}} {{this.configFiatBi}} ?</p>
          <van-cell-group>
            <van-field @input="handLeftAmount" v-model="trade.usdt" type="number" placeholder="0" icon="clear" @click-icon="trade.usdt=''"/>
          </van-cell-group>

          <p>{{$t("common.huanQu")}} {{labelTitle}}</p>
          <van-cell-group>
            <van-field @input="handRightAmount" v-model="trade.amount" type="number" placeholder="0" icon="clear" @click-icon="trade.amount=''"/>
          </van-cell-group>
          
        </div>

        <div class="buyAmount" v-else>
            <p >{{$t("fastTrade.buyAsk2")}} {{labelTitle}} ?</p>
            <van-cell-group>
              <van-field @input="handLeftAmount2" v-model="trade.amount" type="number" placeholder="0" icon="clear" @click-icon="trade.amount=''"/>
            </van-cell-group>

            <p>{{$t("common.huanQu")}} {{this.configFiatBi}}</p>
            <van-cell-group>
              <van-field @input="handRightAmount2" v-model="trade.usdt" type="number" placeholder="0" icon="clear" @click-icon="trade.usdt=''"/>
            </van-cell-group>
        </div>

        <van-tabs v-model="authMode" @click="selectAuthMode" class="code-box">
          <van-tab :title='$t("yanZheng.duanXinYanZheng")' class="tab-list">
            <van-field center v-model="trade.phoneCode" :label='$t("yanZheng.yanZhengMa")'  :placeholder='$t("yanZheng.pleaseHolder1")'  icon="clear" @click-icon="trade.phoneCode = '' " v-if="authlist.phone">
              <van-button @click="getCode" :disabled="canSend" slot="button" size="small" type="primary">
                 {{$t("yanZheng.sendCode")}}
                <span v-if="countDown > 0"> ({{countDown}})</span>
              </van-button>
            </van-field>
            <van-cell :title="$t('yanZheng.goToGuanWang1')+` ${systemConfig.siteDomain ? systemConfig.siteDomain : '' }`+$t('yanZheng.mobileBngDing')" v-else class="cell-tip"></van-cell>
          </van-tab>

          <van-tab :title='$t("yanZheng.code_google")' class="tab-list">
            <van-field center v-model="trade.googleCode" :label='$t("yanZheng.yanZhengMa")' :placeholder='$t("yanZheng.pleaseHolder2")' icon="clear" @click-icon="trade.googleCode = ''" v-if="authlist.twoPhase">
            </van-field>
            <van-cell :title="$t('yanZheng.goToGuanWang1')+`${systemConfig.siteDomain ? systemConfig.siteDomain : '' }`+$t('yanZheng.googleErCiYAnZheng')" v-else class="cell-tip"></van-cell>
          </van-tab>
        </van-tabs>

        <div class="submit">
          <van-button type="default" size="small" @click="popCancel">{{$t('common.cancel')}}</van-button>
          <van-button type="primary" size="small" @click="handleRegister">{{$t('common.sure')}}</van-button>
        </div>
      </div>
    </van-popup>

    <my-marquee class="my-marquee">
      <span v-for="(val, i) in ordersData" :key="i" style="margin-right: 24px;font-size:12px;">
        {{ val.order.type === 'buy' ? `${val.order.customer} ${$t('common.use')} ${val.order.fiatCurrency} ${$t('common.gouMai')} ${val.order.amount.toFixed(6)}${val.order.currency} ${format(val.time, 'hh:mm:ss')}` : `${val.order.customer} ${$t('common.maiChu')} ${val.order.amount.toFixed(6)}${val.order.currency} ${$t('common.huanQu')} ${val.order.fiatCurrency} ${format(val.time, 'hh:mm:ss')}` }}
      </span>
    </my-marquee>

    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import TradeList from "./tradeList";
import { getCommon, getOrdersInfo } from "api/common";
import { mapGetters } from "vuex";
import { systemConfigMixins } from "mixins/mixin";
import { getTranInfo, getCodeInfast, commitTradeInfast} from "api/api";
import { convert  } from 'api/axios'
import MyMarquee from "components/my-marquee/myMarquee";

// const itemHeight = 86;

export default {
  mixins: [systemConfigMixins],
  data() {
    return {
       configFiatBi:"",
      refresh1: 0,
      refresh2: 0,
      isLoading1: false,
      isLoading2: false,
      loading: false,
      currencyList: [],
      tradingFlag: false,
      currency: "",
      advertiseId: "",
      trade: {
        amount: "",
        phoneCode: "",
        googleCode: "",
        usdt:""
      },
      isbuy:true,
      authMode: "phone",
      countDown: "",
      authlist: {},
      phone: "",
      currencyInfo: {},
      popTitle: "",
      labelTitle:"",
      ordersData: [],
      timmer: null,
      userInfoOnce: false,
      tradeType:""
    };
  },
  computed: {
    // 当前的currency
    activeCurrency() {
      if (this.currencyList) {
        return this.currencyList.indexOf(this.currency);
      } else return 0;
    },
    canSend() {
      return this.countDown > 0;
    },
    ...mapGetters(["getTradeSearch", "getCommon"])
  },
  watch: {
    getTradeSearch: {
      handler(val) {
        this.currency = val.currency || "BTC";
      },
      deep: true,
      immediate: true
    },
    getCommon: {
      handler(val) {
        if (this.timmer) clearInterval(this.timmer);
        const m = val ? val.lampRefresh : 10;
        this.timmer = setInterval(() => {
          this._getOrdersInfo();
        }, 1000 * m);
      },
      deep: true,
      immediate: true
    }
  },
  created() {
     this.configFiatBi= localStorage.getItem("configFiatBi");

    if (!this.getCommon || !this.getCommon.enableUSDT) {
      this.$router.push("/trade");
    }
    this._getOrdersInfo(true);
    this._getCommon();
    //   this._getTranInfo();
    this.$store.commit("setShowFooter", 1);
  },
  mounted(){
    this.$store.commit("setFooterActive", 'fastTrade');
    this.$refs.left.$el.style.minHeight = (document.body.clientHeight - 150) + 'px'
    // console.log('mounted')
  },
  destroyed() {
    clearInterval(this.timmer);
  },
  methods: {
    //弹出交易对话框
    trading(flag, currencyInfo) {
      if (!this.userInfoOnce) {
        this._getTranInfo(flag, currencyInfo);
      } else {
        this.tradingFlag = flag;
        this.popTitle = currencyInfo.tradeType + currencyInfo.currency;
        this.labelTitle=currencyInfo.currency;
        
        currencyInfo.tradeType=='买入'? (this.tradeType='buy',this.isbuy=true):(this.tradeType='sell',this.isbuy=false);
        this.advertiseId = currencyInfo.advertiseId;
        this.clear();
      }
    },
    clear() {
      this.trade.usdt = "";
      this.trade.amount = "";
      this.trade.phoneCode = "";
      this.trade.googleCode = "";
    },
    //关闭交易对话框
    popCancel() {
      this.tradingFlag = false;
    },
    //修改左边来改变右边
    handLeftAmount(oldVal) {
      let val = Number(oldVal)
      if (isNaN(val)) {
        oldVal= 0
        return
      }
      if (val == 0){
        this.trade.amount=0;
        return
      }
      this.tradeType === 'buy' ? this.convertType="currency" : this.convertType="fiatCurrency"
      convert({id: this.advertiseId, amount: val, convertTo: this.convertType}).then(data => {
        if(data.code===0){
          this.trade.amount=data.data.usdtAmount.toFixed(8)
        }
      })
    },
    //修改右边来改变左边
    handRightAmount(oldVal) {
      let val = Number(oldVal)
      if (isNaN(val)) {
        oldVal= 0
        return
      }
      if (val == 0){
        this.trade.usdt=0;
        return
      }
      this.tradeType === 'buy' ? this.convertType="fiatCurrency" : this.convertType="currency"
      convert({id: this.advertiseId, amount: val, convertTo: this.convertType}).then(data => {
        if(data.code===0){
          this.trade.usdt=data.data.usdtAmount.toFixed(8)
        }
      })
    },
    handLeftAmount2(oldVal) {
      let val = Number(oldVal)
      if (isNaN(val)) {
        oldVal= 0
        return
      }
      if (val == 0){
        this.trade.usdt=0;
        return
      }
      this.tradeType === 'buy' ? this.convertType="currency" : this.convertType="fiatCurrency"
      convert({id: this.advertiseId, amount: val, convertTo: this.convertType}).then(data => {
        if(data.code===0){
          this.trade.usdt=data.data.usdtAmount.toFixed(8)
        }
      })
    },
    //修改右边来改变左边
    handRightAmount2(oldVal) {
      let val = Number(oldVal)
      if (isNaN(val)) {
        oldVal= 0
        return
      }
      if (val == 0){
        this.trade.amount=0;
        return
      }
      this.tradeType === 'buy' ? this.convertType="fiatCurrency" : this.convertType="currency"
      convert({id: this.advertiseId, amount: val, convertTo: this.convertType}).then(data => {
        if(data.code===0){
          this.trade.amount=data.data.usdtAmount.toFixed(8)
        }
      })
    },
    // 下拉刷新
    onRefresh1() {
      this.refresh1 += 1;
    },
    onRefresh2() {
      this.refresh2 += 1;
    },
    // 刷新完毕
    refreshEnd1() {
      this.$toast(this.$t("common.shuaXinSuccess"));
      this.isLoading1 = false;
    },
    refreshEnd2() {
      this.$toast(this.$t("common.shuaXinSuccess"));
      this.isLoading2 = false;
    },
    // 切换数字币类型
    cutTabs(...argv) {
      this.currency = argv[1];
      this.$store.commit("setTradeSearch", { currency: argv[1] });
    },
    loadingChange(val) {
      this.loading = val;
    },
    _getCommon() {
      getCommon("yes").then(res => {
        if (res.code === 0) {
          let tmpArr = [];
          res.data.currency.forEach(item => {
            if (item !== this.configFiatBi) {
              tmpArr.push(item);
            }
          });
          this.currencyList = tmpArr;
        }
      });
    },
    selectAuthMode(index) {
      // console.log(index)
      if (index === 0) {
        this.authMode = "phone";
      } else if (index === 1) {
        this.authMode = "twophase";
      }
    },
    _getTranInfo(flag, currencyInfo) {
      getTranInfo()
        .then(res => {
          if (res.code == 0) {
            this.authlist = res.data.authlist || {};
            this.currencylist = res.data.currencylist || [];
            this.phone = res.data.phone || "";
            this.userInfoOnce = true;

            this.tradingFlag = flag;
            this.popTitle = currencyInfo.tradeType + currencyInfo.currency;
            this.labelTitle=currencyInfo.currency;
            currencyInfo.tradeType=='买入'? (this.tradeType='buy',this.isbuy=true):(this.tradeType='sell',this.isbuy=false);

            // currencyInfo.tradeType=='买入'? this.tradeType="buy":this.tradeType="sell";
            this.advertiseId = currencyInfo.advertiseId;
            this.clear();
          } else {
            this.userInfoOnce = false;
          }
        })
        .catch(err => {
          this.userInfoOnce = false;
        });
    },
    handleRegister() {
      //验证转账数量
      let amount = this.trade.amount.trim();
      let isNum = this.isNumber(amount);
      // console.log(typeof +amount)
      if (isNum && +amount) {
      } else {
        this.$toast.fail(this.$t('common.zhuanBiDayu0'));
        return;
      }

      let postData = {
        advertiseId: this.advertiseId,
        authMode: this.authMode,
        convertAmount: +amount
      };
      if (this.authMode == "phone") {
        if (!this.trade.phoneCode.trim()) {
          this.$toast.fail(this.$t('yanZheng.pleaseHolder1'));
          return;
        }
        postData.authCode = this.trade.phoneCode.trim();
      }

      if (this.authMode == "twophase") {
        if (!this.trade.googleCode.trim()) {
          this.$toast.fail(this.$t('yanZheng.pleaseHolder2'));
          return;
        }
        postData.authCode = this.trade.googleCode.trim();
      }
     
      if (!this.transferOnce) {
        this.transferOnce = true;
        commitTradeInfast(postData)
          .then(res => {
            this.transferOnce = false;
            if (res.code == 0) {
              this.$toast.success( this.$t("common.tradeSuccess"));
              this.tradingFlag = false;
              // this.$router.push("/fast/trade");
            } else {
            }
          })
          .catch(err => {
            this.transferOnce = false;
          });
      }
    },
    // 获取验证码
    getCode() {
      if (!this.phone) {
        this.$toast.fail(this.$t("yanZheng.shouJIweiKong"));
        return;
      }
      let amount = this.trade.amount.trim();
      let isNum = this.isNumber(amount);
      if (isNum && +amount) {
      } else {
        this.$toast.fail(this.$t("common.zhuanBiDayu0"));
        return;
      }

      getCodeInfast().then(res => {
        if (res.code == 0) {
          this.$toast.success(this.$t("yanZheng.yanZhengMaTips"));
          this._countDown();
        } 
      });
    },
    // 倒计时
    _countDown(ms = 1000 * 60) {
      const now = new Date().getTime();
      const end = now + ms;
      this.timmer = setInterval(() => {
        this.countDown = ((end - new Date().getTime()) / 1000).toFixed(0);
        if (this.countDown <= 0) clearInterval(this.timmer);
      }, 1000);
    },
    isNumber(str) {
      let reg = /^(-?\d+)(\.\d+)?$/; //浮点数
      return reg.test(str);
    },
    // 订单轮询
    _getOrdersInfo() {
      getOrdersInfo()
        .then(list => {
          if (list) {
            this.ordersData = this.ordersData.concat(list.slice(0, 2));
          }
          if (this.ordersData.length > 60) {
            this.ordersData = [];
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  components: {
    TradeList,
    MyMarquee
  }
};
</script>

<style lang="scss" scoped>

.trade {
  padding-top: $van-tabs-height;
  height: 100%;
  overflow: hidden;
  .van-nav-bar {
    color: #303133;
  }
  .currency {
    position: fixed;
    top: $header-height;
    // top: 0;
    left: 0;
    right: 0;
    height: $van-tabs-height;
    z-index: 100;
  }
}

.list-wraper {
  display: flex;
  width: 100%;
  .list {
    width: 50%;
    box-sizing: content-box;
    // min-height: 700px;
    border-right: 1px solid #e5e5e5;
    // border-left: 1px solid #e5e5e5;
  }
}
.offers {
  // background-color: #eee;
  .title {
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 16px;
    /* color: #f44; */
  }
  .trade-input {
    padding: 12px 6px;
    .submit {
      padding: 16px 4px;
      text-align: center;
      .van-button {
        margin-right: 10px;
      }
    }
    .code-box {
      margin: 0 8px;
      margin-top: 0px;
    }
  }
}
</style>
<style>
  .offers .van-tab--active{
    color: #409EFF;
    border-bottom: #409EFF 2px solid
  }
  .offers .van-tabs__nav-bar{background-color:  transparent}
  .offers .van-button--primary{background-color: #409EFF;border: #409EFF}
  .van-field .van-cell__title {
    min-width: 60px;
}
.tab-list .van-cell{
  padding: 10px 0;
}
</style>
