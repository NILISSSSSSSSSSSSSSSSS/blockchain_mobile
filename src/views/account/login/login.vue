<template>
  <div class="login">
    <g-head>
      <van-nav-bar :title='$t("account.login")' :left-text='$t("account.cancel")' :right-text='$t("account.register")' @click-left="onClickLeft" @click-right="onClickRight" />
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
        <!-- <van-tab v-for="item,index in changeWays" :key="index" :title="item">
        </van-tab> -->
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

      <van-field v-model="password" type="password" :label='$t("account.password")' icon="clear" :placeholder='$t("account.inputPwd")' required @click-icon="password = ''" />
    </van-cell-group>

    <div class="submit">
      <van-button type="primary" :disabled="disabled" @click="handleLogin">{{$t("account.login")}}</van-button>
    </div>
    <div>
      <span class="forget" @click="hint">
        {{$t("account.forgotPwd")}}
      </span>
      <span class="valicode" @click="codeLogin">
        {{$t("account.valiLogin")}}
      </span>
    </div>
  </div>
</template>

<script>
import { login, region } from "api/account";
import countryData from "plugins/country.json";
import { systemConfigMixins } from "mixins/mixin";
import { qhEnter } from 'api/futures'
export default {
  mixins: ["systemConfigMixins"],
  data() {
    return {
      active: 0,
      email: "",
      password: "",
      logining: false,
      phone: "",
      loginType: true,
      countryArr: [],
      callingCode: "86",
      selectPhoneText: "CN +86",
      selectPhoneCode: false
    };
  },
  computed: {
    disabled() {
      return !((this.email || this.phone) && this.password && !this.logining);
    },
    // loginText() {
    //   return this.loginType ?  "使用邮箱登录":"使用手机登录";
    // }
  },
  created() {
    this.$store.commit("setShowFooter", 1);
    this.getCountryArr();
    //this.getIp()
  },
  watch:{
    active(val){
      console.log(val)
    }
  },
  methods: {
    // getIp() {
    //   this.publicIp().then(ip => {
    //     console.log(ip)
    //     this.getCurrentRegion({address: ip})
    //   });
    // },
    // getCurrentRegion(data) {
    //     region(data).then(data => {
    //         let country = data.data.country;
    //         countryData.map((item, index) => {
    //             if (item.code === country) {
    //                 this.callingCode = countryData[index].callingCode;
    //                 this.selectPhoneText = `${item.code} +${
    //                     this.callingCode
    //                 }`;
    //             }
    //         });
    //     });
    // },
    selectLoginWays(index) {
      this.phone=this.email=this.password=''
      if(index) this.loginType=false
      else this.loginType=true
    },
    onClickLeft() {
      this.$router.push("/account");
    },
    onClickRight() {
      this.$router.push("/user/register");
    },
    hint() {
      this.$router.push({
        path: "/user/find-pass"
      });
    },
    codeLogin() {
      this.$router.push({
        path: "/valicode/login"
      })
    },
    handleLogin() {
      this._login();
    },
    _login() {
      this.logining = true;
      if (!this.callingCode) {
        this.$toast.fail(this.$t("account.selectRegion1"));
        return;
      }
      let obj = {};
      if (this.loginType) {
        obj = {
          phone: this.callingCode + "" + this.phone,
          passwd: this.sha1(this.password),
          authMode: "phone"
        };
      } else {
        obj = {
          email: this.email,
          passwd: this.sha1(this.password),
          authMode: "email"
        };
      }
      login(obj)
        .then(data => {
          if (data.code === 0) {
            if (data.data.token) {
              this.$store.commit("setToken", data.data.token);
              this.$store.commit("setUserInfo", null);
               localStorage.setItem("loginTime", data.data.loginTime);
              
                this.tiaoZhuanPanDuan();

            } else if (data.data.expire) {
              this.$store.commit("setTwoStep", {
                email: this.email,
                expire: data.data.expire,
                phone: this.callingCode + "" + this.phone,
                authMode: obj.authMode
              });
              this.$router.push("/account/two-step");
            }
            else {
                // location.href=localStorage.getItem('routeState')
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
  },
  route: {
    canActivate(transition){
      console.log('transition',transition)
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
.valicode{
  float: right;
  padding-right: 16px;
}

</style>
<style>
.login .van-field .van-cell__title{
  min-width: 100px;
}
</style>


