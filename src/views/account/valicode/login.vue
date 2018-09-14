<template>
  <div class="login">
    <!-- 验证码登录 -->
    <g-head>
      <van-nav-bar :title='$t("account.valiLogin")' left-arrow   @click-left="onClickLeft" /> 
    </g-head>

    <!-- 切换登录方式 -->
    <!-- <div class="hide-wallet">
      <div></div>
      <van-button type="primary" size="small" @click="chnangeLoginWays">{{ loginText }}</van-button> -->
      <!-- <span>{{ loginText }}</span>
      <van-switch v-model="loginType" /> -->
    <!-- </div> -->
    <van-tabs v-model="active" class="ways" @click="selectLoginWays">
        <van-tab :title='$t("account.phoneLogin")'>
        </van-tab>
        <van-tab :title='$t("account.emailLogin")'>
        </van-tab>
    </van-tabs>

    <!-- 手机登录 -->
    <div class="box" v-show="loginType">
      <van-popup v-model="selectPhoneCode" position="bottom" :overlay="false">
        <van-picker :columns="countryArr" @confirm="onChangeCountry" show-toolbar @cancel="selectPhoneCode = false" />
      </van-popup>
      <van-cell :title='$t("account.selectRegion")' is-link :value="selectPhoneText" @click="selectPhoneCode = true" />

      <van-cell-group>
        <van-field v-model="phone" :label='$t("account.phoneNumber")' icon="clear" :placeholder='$t("account.inputPhoneNumber")' @click-icon="phone = ''" />
      </van-cell-group>
    </div>

    <van-cell-group>
      <van-field v-show="!loginType" v-model="email" :label='$t("account.email")' icon="clear" autofocus="autofocus" :placeholder='$t("account.inputEmail")' required @click-icon="email = ''" />

      <!-- <van-field v-model="password" type="password" :label='$t("account.password")' icon="clear" :placeholder='$t("account.inputPwd")' required @click-icon="password = ''" /> -->
      <van-field center v-model="code" :label='$t("account.verify")' :placeholder='$t("account.inputVerify")' icon="clear" @click-icon="code = ''">
        <van-button @click="getCode" :disabled="canSend" slot="button" size="small" type="primary">
          {{$t("account.sendVerify")}}
          <span v-if="countDown > 0"> ({{countDown}})</span>
        </van-button>
      </van-field>
    </van-cell-group>

    <div class="submit">
      <van-button type="primary" :disabled="disabled" @click="handleLogin">{{$t("account.login")}}</van-button>
    </div>
    
  </div>
</template>

<script>
import { getValidateCode, region, validateLogin } from "api/account";
import countryData from "plugins/country.json";
import { systemConfigMixins } from "mixins/mixin";
import { qhEnter } from 'api/futures'
export default {
  mixins: ["systemConfigMixins"],
  data() {
    return {
      active: 0,
      email: "",
      logining: false,
      phone: "",
      loginType: true,
      countryArr: [],
      callingCode: "86",
      selectPhoneText: "CN +86",
      selectPhoneCode: false,
      code: "",
      countDown: 0
    };
  },
  computed: {
    disabled() {
      return !((this.email || this.phone) && this.code);
    },
    canSend() {
      return this.countDown > 0;
    }
  },
  created() {
    this.$store.commit("setShowFooter", 1);
    this.getCountryArr();
    //this.getIp()
  },
  watch: {
    active(val) {
      console.log(val);
    }
  },
  methods: {
    selectLoginWays(index) {
      // console.log(index)
        this.phone = this.email = this.code = "";
      if(index === 0){
        this.loginType = true
      }else{
        this.loginType = false
      }
    },
    onClickLeft() {
      this.$router.push("/user/login");
    },
    handleLogin() {
      this._login();
    },
    _login() {
      let vertifyFlag  = this.verify()
      if(!vertifyFlag){
        return
      }
      let obj = {
        authCode: this.code.trim()
      };
      if (this.loginType) {
        obj.account = this.callingCode + "" + this.phone
        obj.authMode = "phone"
      } else {
        obj.account = this.email
        obj.authMode = "email"
      }
      validateLogin(obj)
        .then(data => {
          if (data.code === 0) {
            if (data.data.token) {
              this.$store.commit("setToken", data.data.token);
               localStorage.setItem("loginTime", data.data.loginTime);
              this.$store.commit("setUserInfo", null);
             
               this.tiaoZhuanPanDuan()
            }
          }
          this.logining = false;
        })
        .catch(err => {
          this.logining = false;
        });
    },
     tiaoZhuanPanDuan(){
      //如果是场内交易
            if(localStorage.getItem("footerActive")=="innerTrade"){
                qhEnter()
                .then(data => {
                  if (data.code !== 0) return
                  this.$store.commit('setFuturesUrl', data.data.address);
                  window.location.href=data.data.address
                })
            }
            //如果不是场内交易
            else{
                let routeState =  $vm.routeState;
                if(routeState){
                  location.href=routeState
                }else{
                  this.$router.push("/trade")
                }
            }
    },
    // 获取国家数据
    getCountryArr() {
      this.countryArr = countryData.map(obj => {
        return obj.name;
      });
    },
    // 获取验证码
    getCode() {
      if (!this.verify()) return;
      this._countDown();
      if (this.loginType) this._valiMobile();
      else this._valiEmail();
    },
    _valiEmail() {
      // 发送邮箱验证码
      getValidateCode({
        account: this.email,
        authMode: 'email'
      }).then(data => {
        if (data.code === 0) {
          this.$toast(this.$t("account.sendSuccess"));
        }
      });
    },
    _valiMobile() {
      getValidateCode({
        account: this.callingCode + "" + this.phone,
        authMode: 'phone'
      }).then(data => {
        if (data.code !== 0) return;
        this.$toast(this.$t("account.sendSuccess"));
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
    // 邮箱输入合法性校验
    verify() {
      if(this.loginType){
        if (!this.callingCode) {
          this.$toast.fail(this.$t("account.selectRegion1"));
          return;
        }
        if(!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
          this.phone
        )){
          this.$toast.fail(this.$t("account.phoneFormatError"));
          return false;  
        }
      }else{
        if(!/^.+@\w+\..+$/.test(this.email.trim() )) {
          this.$toast.fail(this.$t("account.emailFormatError"));
          return false;
        } 
      }
      return true
    },
    onChangeCountry(country) {    
      for (let x of countryData) {
        if (x.name === country) {
          this.callingCode = x.callingCode;
          this.selectPhoneText = `${x.code} +${x.callingCode}`;
          break;
        }
      }
      this.selectPhoneCode = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  .hide-wallet {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    height: 48px;
    margin-bottom: 16px;
    border-bottom: 1px solid #e5e5e5;
    background-color: #fff;
    line-height: 32px;
    font-size: 14px;
  }
  .box {
    margin: 0px 0 16px;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    background-color: #fff;
  }
}
.submit {
  padding: 16px;
  .van-button {
    width: 100%;
  }
}
.forget {
  padding-left: 16px;
  display: inline-block;
}
.valicode {
  float: right;
  padding-right: 16px;
}
</style>
<style>
.login .van-field .van-cell__title {
  min-width: 100px;
}
</style>


