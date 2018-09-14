<template>
    <div class="register">
        <g-head>
            <van-nav-bar :title='$t("account.findPwd")' left-arrow @click-left="onClickLeft" />
        </g-head>

        <!-- 切换找回方式 -->
        <!-- <div class="hide-wallet">
            <div></div>
            <van-button type="primary" size="small" @click="chnangeRegisterWays">{{ registerText }}</van-button> -->
            <!-- <span>{{ registerText }}</span>
            <van-switch v-model="registerType" @change="toggleWay" /> -->
        <!-- </div> -->

        <van-tabs v-model="active" class="ways" @click="selectRegisterWays">
            <van-tab :title='$t("account.phoneRetrieve")'>
            </van-tab>
            <van-tab :title='$t("account.emailRetrieve")'>
            </van-tab>
            <!-- <van-tab v-for="item,index in changeWays" :key="index" :title="item">
            </van-tab> -->
        </van-tabs>
        <!-- 手机找回 -->
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
            <!-- 邮箱找回 -->
            <van-field v-show="!registerType" v-model="email" :label='$t("account.email")' icon="clear" :placeholder='$t("account.inputEmail")' @click-icon="email = ''" />

            <van-field v-model="password" type="password" :label='$t("account.password")' :placeholder='$t("account.inputPwd")' icon="clear" @click-icon="password = ''" />

            <van-field v-model="password2" type="password" :label='$t("account.surePwd")' :placeholder='$t("account.inputPwdAgain")' icon="clear" @click-icon="password2 = ''" />

            <van-field center v-model="code" :label='$t("account.verify")' :placeholder='$t("account.inputVerify")' icon="clear" @click-icon="code = ''">
                <van-button @click="getCode" :disabled="canSend" slot="button" size="small" type="primary">
                    {{$t("account.sendVerify")}}
                    <span v-if="countDown > 0"> ({{countDown}})</span>
                </van-button>
            </van-field>

            <!-- <van-field
        v-model="inviteCode"
        label="邀请码"
        placeholder="请填写邀请码(非必填)"
        icon="clear"
        @click-icon="inviteCode = ''"
      /> -->
        </van-cell-group>

        <div class="submit">
            <van-button type="primary" :disabled="disabled" @click="handleRegister">{{$t("account.sureSubmit")}}</van-button>
        </div>
    </div>
</template>

<script>
import {
    register,
    verifyEmail,
    login,
    region
} from "api/account";
import { findPw, findPwGetCode } from "api/api";
import countryData from "plugins/country.json";
// import publicIp from "public-ip";

export default {
    data() {
        return {
            active: 0,
            // changeWays:["手机找回","邮箱找回"],
            email: "",
            password: "",
            password2: "",
            code: "",
            inviteCode: "",
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
        // registerText() {
        //     return this.registerType ? "使用邮箱找回" : "使用手机找回";
        // }
    },
    created() {
        this.getCountryArr();
        // this.getIp();
    },
    destroyed() {
        clearInterval(this.timmer);
    },
    methods: {
        // getIp() {
        //     publicIp.v4().then(ip => {
        //         console.log(ip);
        //         this.getCurrentRegion({ address: ip });
        //     });
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
        selectRegisterWays(index) {
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
        toggleWay(){
            this.code = ""
            this.password = ""
            this.password2 = ""
        },
        // 注册
        handleRegister() {
            if (!this.verify()) return;
            if (!this.callingCode) {
                this.$toast.fail(this.$t("account.selectRegion"));
                return;
            }
            this.registering = true;

            let data = {
                uniquekey: this.registerType
                    ? this.callingCode + "" + this.phone
                    : this.email,
                code: this.code,
                password: this.sha1(this.password)
                // uniquekey: this.registerType
                //     ? this.phone
                //     : this.email,
            };
            findPw(data)
                .then(res => {
                    if (res.code == 0) {
                        this.$toast.success(this.$t("account.findPwdSuccess"));
                        this.$router.push({
                            path: "/user/login"
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
            if (this.registerType) {
                if (
                    !/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
                        this.phone.trim()
                    )
                ) {
                    this.$toast.fail(this.$t("account.phoneFormatError"));
                    return;
                }
                this.findPwByPhone();
            } else { //!/^.+@\w+\..+$/.test(this.email)
                if (!/^.+@\w+\..+$/.test(this.email.trim())) {
                    this.$toast.fail(this.$t("account.emailFormatError"));
                    return;
                }
                this.findPwByEmail();
            }
        },
        findPwByEmail() {
            let postData = {
                way: this.registerType ? "phone" : "email",
                uniquekey: this.email.trim()
            };
            findPwGetCode(postData).then(res => {
                if (res.code == 0) {
                    this.$toast.success(this.$t("yanZheng.yanZhengMaTips"));
                    this._countDown();
                }
            });
        },
        findPwByPhone() {
            let postData = {
                way: this.registerType ? "phone" : "email",
                uniquekey: this.callingCode + "" + this.phone.trim()
            };
            findPwGetCode(postData).then(res => {
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
                this.countDown = ((end - new Date().getTime()) / 1000).toFixed(
                    0
                );
                if (this.countDown <= 0) clearInterval(this.timmer);
            }, 1000);
        },
        // 邮箱输入合法性校验
        verify() {
            if (!/^\w+@\w+\.\w+$/.test(this.email) && !this.registerType) {
                this.$toast.fail(this.$t("account.emailFormatError"));
                return false;
            } else if (
                !/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
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
