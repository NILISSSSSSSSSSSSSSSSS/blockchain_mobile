<template>
  <div class="funtion-list">
    <van-list>
      <!-- 帮助中心 -->
      <van-cell>
        <router-link tag="div" to="/hc" class="item">
          <van-icon name="question" class="question" />
          <span>{{$t("account.helpCenter")}}</span>
          <van-icon name="arrow" class="arrow"></van-icon>
        </router-link>
      </van-cell>

      <van-cell>
        <router-link tag="div" to="/account/lang" class="item">
          <!-- <van-icon name="question" class="question"></van-icon> -->
          <em class="question iconfont icon-duoyuyan"></em>
          <span>{{$t("account.lang")}}</span>
          <van-icon name="arrow" class="arrow"></van-icon>
        </router-link>
      </van-cell>
      <!-- 我的广告 -->
      <van-cell>
        <router-link tag="div"  to="/advertisement/adver-list"  class="item">
          <em class="question iconfont icon-guanggao2"></em>
          <span>{{$t("account.myAdvertise")}}</span>
          <van-icon name="arrow" class="arrow"></van-icon>
        </router-link>
      </van-cell>
      <!-- 场外订单 -->
      <van-cell>
        <router-link tag="div" to="/orders" class="item">
          <em class="question iconfont icon-guanggao"></em>
          <span>{{$t("account.overTheCounterOrders")}}</span>
          <em type="danger" class="msg" v-show="getUnread">{{getUnread ? getUnread : ""}}</em>
          <van-icon name="arrow" class="arrow"></van-icon>
        </router-link>
      </van-cell>
     

      <!-- 资金流水 -->
      <van-cell>
        <router-link tag="div" to="/account/transactions" class="item">
          <em class="icon-zijinliushuimingxi iconfont question"></em>
          <span>{{$t("account.capitalFlow")}}</span>
          <van-icon name="arrow" class="arrow"></van-icon>
        </router-link>
      </van-cell>
      <!-- 我的私募 （只有安徽才有） -->
      <van-cell v-if="isSiMuShow()" >
        <router-link tag="div" to="/account/mySiMu" class="item" >
          <em class="icon-zijinliushuimingxi iconfont question"></em>
          <span>{{$t("account.wodeSiMu")}}</span>
          <van-icon name="arrow" class="arrow"></van-icon>
        </router-link>
      </van-cell>

      <van-cell  v-if="isTwoStep">
        <router-link tag="div" to="/account/unbinding" class="item">
          <em class="iconfont question icon-jiebang"></em>
          <span>{{$t("account.unbindTwoVerification")}}</span>
          <van-icon name="arrow" class="arrow"></van-icon>
        </router-link>
      </van-cell>


      <!-- 我的发币 如果是路交所和吉交所就不显示-->
        <van-cell v-if="senCoinIsShow()">
          <div @click="gotoAdver"  class="item">
            <em class="icon-zijinliushuimingxi iconfont question"></em>
            <span>{{$t("mySendCoin.mysendCoin")}}</span>
            <van-icon name="arrow" class="arrow"></van-icon>
          </div>
      </van-cell>

      <!-- 我的邀请码 -->
       <van-cell v-if="isinvite">
        <router-link tag="div" to="/account/invitation" class="item">
          <em class="question iconfont icon-yaoqingma"></em>
          <span>{{$t("account.invitation")}}</span>
          <van-icon name="arrow" class="arrow"></van-icon>
        </router-link>
      </van-cell>
      <!-- 交易设置 -->
      <van-cell>
        <router-link tag="div" to="/account/tradeConfig" class="item">
          <em class="question iconfont icon-jiaoyi"></em>
          <span>{{$t("account.tradeSetting")}}</span>
          <van-icon name="arrow" class="arrow"></van-icon>
        </router-link>
      </van-cell>
      <!-- app下载链接 -->
      <van-cell v-if="isH5">
        <div class="item"  @click="appDownloadLink">
          <em class="question iconfont icon-yaoqingma"></em>
          <span>{{$t("account.appDownload")}}</span>
          <van-icon name="arrow" class="arrow"></van-icon>
        </div>
      </van-cell>
      <!-- 登出 -->
      <van-cell v-if="getToken">
        <div class="item" @click="handleLogOut">
          <em class="question iconfont icon-dengchu"></em>
          <span>{{$t("account.signOut")}}</span>
          <van-icon name="arrow" class="arrow"></van-icon>
        </div>
      </van-cell>

    </van-list>
  
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import { qhEnter } from 'api/futures'
import {  updateApp } from "api/api";
// import {getCommon} from 'api/common'

export default {
  data() {
    return {
      columns: [],
      langShow: false,
      langList: [],
      cangNeiIsShow:false,
    };
  },
  computed: {
    ...mapGetters([
      "getToken",
      "getTwoStep",
      "getInviteCode",
      "getFuturesUrl",
      "getUnread",
      "getCommon"
    ]),
    isTwoStep() {
      return this.getTwoStep ? true : false;
    },
    isinvite() {
      return this.getInviteCode ? true : false;
    },
    isH5(){
      if(localStorage.getItem("isApp")=="true"){
        console.log("不是h5")
        return false;
      }
      else{
        console.log("是h5")
        return true;
      }
    },
  },
 

  methods: {
    appDownloadLink(){
      updateApp().then(data => {
        var appUrl=data.appUrl;
        location.href=appUrl
      })
    },
    //我的发币是否显示
     senCoinIsShow() {
       var url=this.getUrl();
        return url.includes('otcah.com') || url.includes('aaaex.vip') || url.includes('bibiex.io') ? false : true;

     },
        //我的私募是否显示
        isSiMuShow() {
           var url=this.getUrl();
           return url.includes('otcah.com') || url.includes('otcex.test.net') ? true : false;
     },
    gotoAdver(){
      this.$store.commit("setSendCoinFlag",false)
      this.$router.push('/account/mysendcoin')
    },
    handleLogOut() {
      this.$dialog
        .confirm({
          title: this.$t("account.signOut"),
          message: this.$t("account.sureSignOut"),
          confirmButtonText: this.$t("common.sure"),
          cancelButtonText: this.$t("common.cancel")
        })
        .then(() => {
          this.setTwoStep("");
          this.setInviteCode("");
          this.$store.commit("setToken", "");
           localStorage.setItem("loginTime", "");
           $vm.routeState = window.location.href
        
          this.$router.push("/user/login");
        })
        .catch(() => {
          // on cancel
        });
    },
    ...mapMutations({
      setTwoStep: "setTwoStep",
      setToken: "setToken",
      setInviteCode: "setInviteCode"
    })
  }
};
</script>

<style lang="scss" scoped>
.item {
  position: relative;
  padding: 4px 0;
  .question {
    color: #ff9c6e;
    font-size: 20px;
  }
  .van-icon {
    vertical-align: middle;
    font-size: 20px;
  }
  span {
    margin-left: 16px;
  }
  .msg {
    // margin-left: 4px;
    // border-radius: 50%;
    // width: 18px;
    // height: 18px;
    // line-height: 18px;
    display: inline-block;
    color: #fff;
    text-align: center;
    background: #f44;
    font-size: 12px;
    padding: 0 6px;
    border-radius: 9px;
    transform: scale(0.9);
    min-width: 18px;
    line-height: 18px;
    box-sizing: border-box;
    font-style: normal;
  }
  .arrow {
    position: absolute;
    right: 8px;
    top: 8px;
    font-size: 16px;
  }
}
</style>
