<template>
  <div class="register">
    <g-head>
      <van-nav-bar :title='$t("account.register")' left-arrow @click-left="onClickLeft" />
    </g-head>

    <!-- 切换注册方式 -->
    <!-- <div class="hide-wallet">
        <div></div>
        <van-button type="primary" size="small" @click="chnangeRegisterWays">{{ registerText }}</van-button> -->
      <!-- <span>{{ registerText }}</span>
      <van-switch v-model="registerType" /> -->
    <!-- </div> -->

    <van-tabs v-model="active" class="ways" @click="selectRegisterWays">
        <van-tab :title='$t("account.phoneRegister")'>
        </van-tab>
        <van-tab :title='$t("account.emailRegister")'>
        </van-tab>
    <!-- <van-tab v-for="item,index in changeWays" :key="index" :title="item">
    </van-tab> -->
    </van-tabs>
    <!-- 手机注册 -->
    <div class="box" v-show="registerType">
      <van-popup v-model="selectPhoneCode" position="bottom" :overlay="false">
        <van-picker :columns="countryArr" @confirm="onChangeCountry" show-toolbar @cancel="selectPhoneCode = false" />
      </van-popup>
      <van-cell :title='$t("account.selectRegion")' is-link :value="selectPhoneText" @click="selectPhoneCode = true" />

      <van-cell-group>
        <van-field v-model="phone" :label='$t("account.phoneNumber")' icon="clear" :placeholder='$t("account.inputPhoneNumber")' @click-icon="phone = ''" />
      </van-cell-group>
    </div>

    <van-cell-group>
      <!-- 邮箱注册 -->
      <van-field v-show="!registerType" v-model="email" :label='$t("account.email")' icon="clear" :placeholder='$t("account.inputEmail")' @click-icon="email = ''" />

      <van-field v-model="password" type="password" :label='$t("account.password")' :placeholder='$t("account.inputPwd")' icon="clear" @click-icon="password = ''" />

      <van-field v-model="password2" type="password" :label='$t("account.surePwd")' :placeholder='$t("account.inputPwdAgain")' icon="clear" @click-icon="password2 = ''" />

      <van-field center v-model="code" :label='$t("account.verify")' :placeholder='$t("account.inputVerify")' icon="clear" @click-icon="code = ''">
        <van-button @click="getCode" :disabled="canSend" slot="button" size="small" type="primary">
          {{$t("account.sendVerify")}}
          <span v-if="countDown > 0"> ({{countDown}})</span>
        </van-button>
      </van-field>

      <van-field v-model="inviteCode" :label='$t("account.inviteCode")' :placeholder='$t("account.writeInviteCode")' :disabled="inviteFlag ? false : true" :icon="inviteFlag ? 'clear' : ''" @click-icon="inviteFlag ? inviteCode = '' : ''" />
    </van-cell-group>

    <div class="submit">
      <van-button type="primary" :disabled="disabled" @click="handleRegister">{{$t("account.register")}}</van-button>
    </div>
  </div>
</template>

<script>
import {
    register,
    verifyEmail,
    login,
    region,
    register_mobile,
    verifyPhone
} from "api/account";
import countryData from "plugins/country.json";

export default {
    data() {
        return {
            active: 0,
            // changeWays:["手机注册","邮箱注册"],

            email: "",
            password: "",
            password2: "",
            code: "",
            inviteCode: "",
            inviteFlag: true,
            countDown: 0,
            registering: false,
            phone: "",
            registerType: true,
            selectPhoneCode: false,
            countryArr: [],
            callingCode: "86",
            selectPhoneText: "CN +86"
        };
    },
    computed: {
      disabled() {
          return !(
              (this.email || this.phone) &&
              this.password &&
              this.password2 &&
              this.code &&
              !this.registering
          );
      },
      canSend() {
          return this.countDown > 0;
      },
    //   registerText() {
    //       return this.registerType ? "使用邮箱注册" : "使用手机注册";
    //   }
    },
    created() {
        const inviteCode = this.$route.query.inviteCode;
        if(inviteCode){
          this.inviteFlag = false
          this.inviteCode = inviteCode
        }else{
          this.inviteFlag = true
        }
        this.getCountryArr();
        //this.getIp();
    },
    destroyed() {
        clearInterval(this.timmer);
    },
    methods: {
        selectRegisterWays(index){
            this.phone=''
            this.email=''
            this.password=''
            this.password2=''
            this.code=''
            if(index) this.registerType=false
            else this.registerType=true
        },
        onClickLeft() {
            this.$router.push("/user/login");
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
        },
        // 获取国家数据
        getCountryArr() {
            this.countryArr = countryData.map(obj => {
                return obj.name;
            });
        },
        // 注册
        handleRegister() {
            if (!this.verify()) return;
            if (!this.callingCode) {
                this.$toast.fail(this.$t("account.selectRegion1"));
                return;
            }
            this.registering = true;
            if (this.registerType) this._verifyPhone();
            else this._verifyEmail();
        },
        _verifyEmail() {
            // const inviteCode = this.$route.query.inviteCode;
            const inviteCode = this.inviteCode;
            verifyEmail({ code: this.code, email: this.email, inviteCode })
                .then(data => {
                    if (data.code === 0) {
                        this.$toast(this.$t("account.registerSuccess"));
                        // 注册成功直接登录
                        this._login({
                            email: this.email,
                            passwd: this.sha1(this.password),
                            authMode: "email"
                        });
                    }
                    this.registering = false;
                })
                .catch(err => {
                    this.registering = false;
                });
        },
        _verifyPhone() {
            // const inviteCode = this.$route.query.inviteCode;
            const inviteCode = this.inviteCode;
            verifyPhone({
                code: this.code,
                phone: this.callingCode + "" + this.phone,
                inviteCode
            })
                .then(data => {
                    if (data.code === 0) {
                        this.$toast(this.$t("account.registerSuccess"));
                        // 注册成功直接登录
                        this._login({
                            phone: this.callingCode + "" + this.phone,
                            passwd: this.sha1(this.password),
                            authMode: "phone"
                        });
                    }
                    this.registering = false;
                })
                .catch(err => {
                    this.registering = false;
                });
        },
        // 获取验证码
        getCode() {
            if (!this.verify()) return;
            this._countDown();
            if (this.registerType) this._registerMobile();
            else this._register();
        },
        _register() {
            // 注册后发送邮箱验证码
            register({
                email: this.email,
                passwd: this.sha1(this.password)
            }).then(data => {
                if (data.code === 0) {
                    this.$toast(this.$t("account.sendSuccess"));
                }
            });
        },
        _registerMobile() {
            register_mobile({
                phone: this.callingCode + "" + this.phone,
                passwd: this.sha1(this.password)
            }).then(data => {
                if (data.code !== 0) return;
                this.$toast(this.$t("account.sendSuccess"));
            });
        },
        // 登录
        _login(params) {
            login(params).then(data => {
                if (data.code === 0) {
                    if (data.data.token) {
                        this.$store.commit("setToken", data.data.token);
                         localStorage.setItem("loginTime", data.data.loginTime);
                        this.$store.commit("setUserInfo", null);
                        this.$router.push("/account");
                    } else if (data.data.expire) {
                        this.$store.commit("setTwoStep", {
                            email: this.email,
                            expire: data.data.expire,
                            phone: this.callingCode + "" + this.phone,
                            authMode: params.authMode
                        });
                        this.$router.push("/account/two-step");
                    }
                }
            });
        },
        // 倒计时
        _countDown(ms = 1000 * 60) {
            const now = new Date().getTime();
            const end = now + ms;
            this.timmer = setInterval(() => {
                this.countDown = ((end - new Date().getTime()) / 1000).toFixed(
                    0
                );
                if (this.countDown <= 0) clearInterval(this.timmer);
            }, 1000);
        },
        // 邮箱输入合法性校验
        verify() {
            if (!/^.+@\w+\..+$/.test(this.email.trim()) && !this.registerType) {
                this.$toast.fail(this.$t("account.emailFormatError"));
                return false;
            } else if (
                !/^[1][3-9][0-9]{9}$/.test(
                    this.phone
                ) &&
                this.registerType
            ) {
                this.$toast.fail(this.$t("account.phoneFormatError"));
                return false;
            } else if (!/^\w{6,18}$/.test(this.password)) {
                this.$toast.fail(this.$t("account.passwordToast"));
                return false;
            } else if (this.password !== this.password2) {
                this.$toast.fail(this.$t("account.passwordNotSame"));
                return false;
            }
            return true;
        }
    }
};
</script>

<style lang="scss" scoped>
.register {
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
</style>
<style>
.register .van-field .van-cell__title{
    min-width: 100px;
}
</style>

