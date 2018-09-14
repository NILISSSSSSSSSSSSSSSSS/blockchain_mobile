<template>
  <div class="register">
    <g-head>
      <van-nav-bar :title='$t("account.unbindTwoVerification")' left-arrow @click-left="onClickLeft" />
    </g-head>

    <!-- 切换解绑方式 -->
    <div class="hide-wallet">
      <span>{{ registerText }}</span>
      <van-switch v-model="registerType" />
    </div>

    <!-- 手机解绑 -->
    <!-- <div class="box" v-show="registerType">
      <van-popup v-model="selectPhoneCode" position="bottom" :overlay="false">
        <van-picker :columns="countryArr" @confirm="onChangeCountry" show-toolbar @cancel="selectPhoneCode = false" />
      </van-popup>
      <van-cell title="选择地区" is-link :value="selectPhoneText" @click="selectPhoneCode = true" />

      <van-cell-group>
        <van-field v-model="phone" label="手机号码" icon="clear" placeholder="请输入手机号码" @click-icon="phone = ''" />
      </van-cell-group>
    </div> -->

    <van-cell-group>
      <!-- 邮箱解绑 -->
      <van-field center v-model="code" :label='$t("account.verify")' :placeholder='$t("account.inputVerify")' icon="clear" @click-icon="code = ''">
        <van-button @click="getCode" :disabled="canSend" slot="button" size="small" type="primary">
          {{$t("account.sendVerify")}}
          <span v-if="countDown > 0"> ({{countDown}})</span>
        </van-button>
      </van-field>

    </van-cell-group>

    <div class="submit">
      <van-button type="primary" :disabled="disabled" @click="handleRegister">{{$t("account.unbind")}}</van-button>
    </div>
  </div>
</template>

<script>

import {unbindingGetCode, unbindingSend} from "api/api"
import {mapMutations} from 'vuex'

export default {
    data() {
        return {
            code: "",
            countDown: 0,
            registerType: false,
        };
    },
    computed: {
        disabled() {
            return !this.code;
        },
        canSend() {
            return this.countDown > 0;
        },
        registerText() {
            return this.registerType ? this.$t("account.usePhoneUnbind") : this.$t("account.useEmailUnbind");
        }
    },
    created() {
    },
    destroyed() {
        clearInterval(this.timmer);
    },
    methods: {
        onClickLeft() {
            this.$router.push("/account");
        },
        // 注册
        handleRegister() {
            let postData = {
                authMode: this.registerType ? 'phone' : 'email',
                authCode: this.code.trim()
            }
            unbindingSend(postData).then((res) =>{
                if(res.code == 0){
                    this.$toast.success(res.msg[0] || this.$t("account.unbindSuccess"))
                    this.setTwoStep("")
                    this.$router.push('/account')
                }else{
                    // this.$toast.fail(res.msg[0])
                }
            })
        },
        // 获取验证码
        getCode() {
            let postData = {
                authMode: this.registerType ? 'phone' : 'email'
            }
            unbindingGetCode(postData).then((res) => {
                if(res.code == 0){
                    this.$toast(this.$t("account.verifyIsSend"))
                    this._countDown();
                } else if(res.code == 30017) {
                    // this.$toast(this.$t('err.30017'))
                }
            })
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
        ...mapMutations({
            'setTwoStep': 'setTwoStep'
        })
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
        margin: 16px 0;
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
