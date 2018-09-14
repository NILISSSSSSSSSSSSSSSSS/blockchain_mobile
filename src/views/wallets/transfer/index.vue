<template>
    <div class="register wallet-transfer">
        <g-head>
            <van-nav-bar  :title='$t("wallets.zanNeiZhuanZhang")' left-arrow @click-left="onClickLeft" />
        </g-head>
           <!-- 请选择币种 -->
            <van-cell :title='$t("wallets.input2")' is-link :value="coin" @click="selectCoin=true" center>{{balance}}{{this.currAmount}}</van-cell>
            <!-- <van-cell :title="balance" v-if="balance"></van-cell> -->
            <!-- 转币数量 -->
            <van-field center  @input="changeYue"  v-model="amount"    :label='$t("wallets.input3")' type="number" :placeholder='$t("wallets.input4")' icon="clear" @click-icon="amount=''"></van-field>


        <van-tabs v-model="active" class="ways" @click="selectTransferWays">
            <van-tab :title='$t("wallets.addressTransfer")'>
            </van-tab>
            <van-tab :title='$t("wallets.phoneTransfer")'>
            </van-tab>
            <van-tab :title='$t("wallets.emailTransfer")'>
            </van-tab>
            <!-- <van-tab v-for="item,index in changeWays" :key="index" :title="item">
            </van-tab> -->
        </van-tabs>
         <!-- 地址转账 -->
        <van-cell-group v-show="showAddress">
            <van-field center v-model="address" :label='$t("wallets.qianBaoDiZhi")' :placeholder='$t("wallets.inputMoneyAddress")' icon="clear" @click-icon="address = ''">
            </van-field>
        </van-cell-group>
        <!-- 手机转账 -->
        <div v-show="showPhone">
            
            <van-cell-group >
              <div v-for="(item,index) in phoneList" :key="index" class="phone-list">
                <van-cell :title='$t("account.selectRegion")' is-link :value="item.selectPhoneText" @click="showPicker(index)" />
                <i :class="['icon', 'iconfont', item.isFirst ? 'icon-zengjia' : 'icon-jian']" @click="addPhone(item.isFirst,index)" style="position: absolute;top: 54px;right: 40px;color: #38f;z-index: 555;font-size: 24px;" />
                <van-field v-model="item.phone" :label='$t("account.phoneNumber")' clearable icon="close" :placeholder='$t("account.inputPhoneNumber")' @click-icon="item.phone = ''" >
                </van-field>
              </div>
            </van-cell-group>
        </div> 
        <!-- 邮箱转账 -->
        <van-cell-group v-show="showEmail">
          <div class="phone-list" v-for="(item ,index) in emailList" :key="index" >
            <i :class="['icon', 'iconfont', item.isFirst ? 'icon-zengjia' : 'icon-jian']" @click="addEmail(item.isFirst,index)" style="position: absolute;top: 9px;right: 40px;color: #38f;z-index: 555;font-size: 24px;" />
            <van-field v-show="showEmail" center v-model="item.email" :label='$t("wallets.emailTransfer")' :placeholder='$t("wallets.otherEmail")' icon="clear" @click-icon="item.email = ''">
            </van-field>
          </div>
        </van-cell-group>

        <van-cell-group> 
             <!-- // 短信和谷歌验证 -->
            <van-tabs v-model="authMode" @click="selectAuthMode" class="code-box">
                <van-tab  :title='$t("yanZheng.duanXinYanZheng")'>
                    <van-field center v-model="phoneCode" :label='$t("yanZheng.yanZhengMa")' :placeholder='$t("yanZheng.pleaseHolder1")' icon="clear" @click-icon="phoneCode = ''" v-if="authlist.phone">
                        <van-button @click="getCode" :disabled="canSend" slot="button" size="small" type="primary">
                             {{$t("yanZheng.sendCode")}}
                            <span v-if="countDown > 0"> ({{countDown}})</span>
                        </van-button>
                    </van-field>
                    <van-cell :title="$t('yanZheng.goToGuanWang1')+` ${systemConfig.siteDomain ? systemConfig.siteDomain : '' }`+$t('yanZheng.mobileBngDing')" v-else></van-cell>
                </van-tab>
                <van-tab  :title='$t("yanZheng.code_google")'>
                    <van-field center v-model="googleCode" :label='$t("yanZheng.yanZhengMa")'  :placeholder='$t("yanZheng.pleaseHolder2")' icon="clear" @click-icon="googleCode = ''" v-if="authlist.twoPhase">
                    </van-field>
                    <van-cell :title="$t('yanZheng.goToGuanWang1')+` ${systemConfig.siteDomain ? systemConfig.siteDomain : '' }`+$t('yanZheng.googleErCiYAnZheng')" v-else></van-cell>
                </van-tab>
            </van-tabs>
        </van-cell-group>
        <div class="submit">
            <van-button type="primary" @click="handleRegister"> {{$t("common.tiJiao")}}</van-button>
        </div>
        <!-- 币种列表 -->
        <van-popup v-model="selectCoin" position="bottom">
            <van-picker :cancel-button-text="$t('common.cancel')" :confirm-button-text="$t('common.sure')" :columns="currencylist" value-key="currency" show-toolbar @confirm="sureSelectCoin" @cancel="selectCoin=false" />
        </van-popup>
        <!-- 选择区号   -->
        <van-popup v-model="selectPhoneCode" position="bottom" :overlay="true">
            <van-picker :columns="countryArr" @confirm="onChangeCountry" show-toolbar @cancel="selectPhoneCode = false" />
        </van-popup>
    </div>
</template>

<script>
import { getTranInfo, addrRelation, addrGetCode, transfer } from "api/api";
import { systemConfigMixins } from "mixins/mixin";
import countryData from "plugins/country.json";

const initPhoneList = [
  { phone: "", isFirst: true, selectPhoneText: "CN +86", callingCode: "86" }
];
const initEmialList = [{ email: "", isFirst: true }];
export default {
  mixins: [systemConfigMixins],
  data() {
    return {
      active: 0,
      address: "",
      phone: "",
      phoneList: initPhoneList,
      tmpPhoneIndex: 0,
      myPhone: "",
      email: "",
      emailList: initEmialList,
      showAddress: true,
      showPhone: false,
      showEmail: false,
      phoneCode: "",
      googleCode: "",
      countDown: 0,
      registerType: false,
      selectCoin: false,
      coin: "",
      currAmount: "",
      balance: "",
      amount: "",
      authMode: "phone",
      authlist: {},
      currencylist: [],
      selectPhoneText: "CN +86",
      selectPhoneCode: false,
      countryArr: [],
      callingCode: "86",
      userValue: "",
      valueType: "address",
      userTost: "wallets.input1",
      totalMoney: 0
    };
  },
  computed: {
    canSend() {
      return this.countDown > 0;
    }
  },
  created() {
    this.$store.commit("setShowFooter", 0);
    this._getTranInfo();
    this.getCountryArr();
  },
  destroyed() {
    clearInterval(this.timmer);
  },
  methods: {
    addPhone(isFirst, index) {
      if (isFirst) {
        console.log("add");
        let amountFlag = this.validateAmount(this.phoneList.length + 1);
        if (!amountFlag) {
          return;
        }
        // let amount = this.amount;
        // let balance = 100; // 余额
        // let length = this.phoneList.length;
        // if (balance < amount * length) {
        //   this.$toast.fail("余额不足");
        //   return;
        // } else {
        this.phoneList.push({
          phone: "",
          isFirst: false,
          selectPhoneText: "CN +86",
          callingCode: "86"
        });
        // }
      } else {
        console.log("reduce");
        this.phoneList.splice(index, 1);
      }
    },
    addEmail(isFirst, index) {
      if (isFirst) {
        console.log("add email");
        let amountFlag = this.validateAmount(this.emailList.length + 1);
        if (!amountFlag) {
          return;
        }
        this.emailList.push({ email: "", isFirst: false });
      } else {
        console.log("reduce email");
        this.emailList.splice(index, 1);
      }
    },
    showPicker(index) {
      this.tmpPhoneIndex = index;
      this.selectPhoneCode = true;
    },
    changeYue(val) {
      // if (this.coin.trim()) {
      //   if (!val) {
      //     this.currAmount = this.totalMoney;
      //     return;
      //   }
      //   if (this.totalMoney - val < 0) {
      //     this.currAmount = 0;
      //     return;
      //   }
      //   this.currAmount = this.totalMoney - val;
      // }
    },
    formReset1() {
      this.address = this.shouJiHao = this.youXiang = "";
    },
    onClickLeft() {
      this.$router.push("/wallets");
    },
    selectTransferWays(index) {
      // this.phone = this.address = this.email = "";
      // this.clear();
      if (!index) {
        this.showAddress = true;
        this.showEmail = this.showPhone = false;
        this.valueType = "address";
      } else if (index == 1) {
        this.showPhone = true;
        this.showEmail = this.showAddress = false;
        this.valueType = "phone";
      } else {
        this.showEmail = true;
        this.showAddress = this.showPhone = false;
        this.valueType = "email";
      }
    },
    clear() {
      this.phoneList = initPhoneList;
      this.emailList = initEmialList;
      this.address = "";
      this.amount = "";
      this.phoneCode = "";
      this.googleCode = "";
    },
    onChangeCountry(country) {
      for (let x of countryData) {
        if (x.name === country) {
          this.phoneList[this.tmpPhoneIndex].callingCode = x.callingCode;
          this.phoneList[this.tmpPhoneIndex].selectPhoneText = `${x.code} +${
            x.callingCode
          }`;
          break;
        }
      }
      this.selectPhoneCode = false;
    },
    getCountryArr() {
      this.countryArr = countryData.map(obj => {
        return obj.name;
      });
    },
    sureSelectCoin(coin) {
      this.clear();
      this.coin = coin.currency;
      this.totalMoney = coin.currAmount;
      this.currAmount = coin.currAmount;
      this.balance = `${coin.currency}${this.$t("wallets.yuE")}:`;
      this.selectCoin = false;
    },
    selectAuthMode(index) {
      if (index === 0) {
        this.authMode = "phone";
      } else if (index === 1) {
        this.authMode = "twoPhase";
      }
    },
    _getTranInfo() {
      getTranInfo().then(res => {
        if (res.code == 0) {
          this.authlist = res.data.authlist || {};
          this.currencylist = res.data.currencylist || [];
          this.myPhone = res.data.phone || "";
        }
      });
    },

    //提交按钮
    handleRegister() {
      let postData = {
        destType: this.valueType,
        destVal: "",
        currency: this.coin.trim(),
        amount: parseFloat(this.amount),
        authMode: this.authMode
      };

      console.log(this.showAddress,this.showPhone,this.showEmail)

      if (!this.coin.trim()) {
        this.$toast.fail(this.$t("wallets.input2"));
        return;
      } else if (!this.amount.toString().trim()) {
        this.$toast.fail(this.$t("wallets.input4"));
        return;
      }

      //验证转账数量
      let amountFlag = this.validateAmount(this.phoneList.length);
      if (!amountFlag) {
        return;
      }

      if (!this.address.trim() && this.showAddress) {
        this.$toast.fail(this.$t("wallets.addressBiTian"));
        return;
      } else if (this.address.trim() && this.showAddress) {
        postData.destVal = this.address;
      }

      if (this.showPhone) {
        let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
        let tmpArr = []
        console.log(this.phoneList)
        for (let i = 0; i < this.phoneList.length; i++) {
          let phone = this.phoneList[i].phone + "";
          console.log(phone)
          if (!reg.test(phone)) {
            this.$toast.fail(this.$t("wallets.rightPhone")); //请填写正确的手机号
            return;
          }
          if(tmpArr.length > 0){
            let index = tmpArr.findIndex((item) => {
              return item.phone === phone
            })
            if(index > -1){
              this.$toast.fail(this.$t("wallets.repeatPhone"))
              return 
            }
            tmpArr.push({
              val: this.phoneList[i].callingCode + this.phoneList[i].phone,
              code: this.phoneList[i].callingCode,
              phone: this.phoneList[i].phone
            })
          }else{
            tmpArr.push({
              val: this.phoneList[i].callingCode + this.phoneList[i].phone,
              code: this.phoneList[i].callingCode,
              phone: this.phoneList[i].phone
            })
          }
        }
        postData.destVal = tmpArr
      }

      if(this.showEmail){
        let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        let tmpArr = []
        for (let i = 0; i < this.emailList.length; i++) {
          let email = this.emailList[i].email;
          if (!reg.test(email)) {
            this.$toast.fail(this.$t("wallets.rightEmail"));
            return;
          }
          if(tmpArr.length > 0){
            let index = tmpArr.findIndex((item) => {
              return item.val === email
            })
            if(index > -1){
              this.$toast.fail(this.$t("wallets.repeatEmail"))
              return 
            }
            tmpArr.push({
              val: email
            })
          }else{
            tmpArr.push({
              val: email
            })
          }
        }
        postData.destVal = tmpArr
      }

      console.log(postData)
      // return

      // if (this.showPhone) {
      //   postData.remark = { code: this.callingCode, phone: this.phone };
      // }
      if (this.authMode == "phone") {
        if (!this.phoneCode.trim()) {
          this.$toast.fail(this.$t("yanZheng.pleaseHolder1"));
          return;
        }
        postData.authCode = this.phoneCode.trim();
      }

      if (this.authMode == "twoPhase") {
        if (!this.googleCode.trim()) {
          this.$toast.fail(this.$t("yanZheng.pleaseHolder2"));
          return;
        }
        postData.authCode = this.googleCode.trim();
      }
      if (!this.transferOnce) {
        this.transferOnce = true;
        transfer(postData)
          .then(res => {
            this.transferOnce = false;
            if (res.code == 0) {
              this.$toast.success(
                res.msg[0] || this.$t("wallets.zhuanZhangSuccess")
              );
              this.$router.push("/wallets");
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
      if (!this.myPhone) {
        this.$toast.fail(this.$t("yanZheng.shouJIweiKong"));
        return;
      }

      //发验证码前验证数量信息
      if (!this.coin) {
        this.$toast.fail(this.$t("wallets.input2"));
        return;
      }
      let amountFlag = this.validateAmount(this.phoneList.length);
      if (!amountFlag) {
        return;
      }

      this._countDown();
      addrGetCode({
        phone: this.myPhone
      }).then(res => {
        if (res.code == 0) {
          this.$toast.success(this.$t("yanZheng.yanZhengMaTips"));
        } else {
          this.$toast.fail(res.msg[0]);
        }
      });
    },
    validateAmount(length) {
      //先验证是否有选币种
      if (!this.coin) {
        this.$toast.fail(this.$t("wallets.input2"));
        return false;
      }
      let isNum = this.isNumber(this.amount);
      if (isNum) {
        let res = this.amount * length - this.currAmount > 0;
        // console.log("res余额: ", this.amount * length - this.currAmount);
        if (res) {
          this.$toast.fail(this.$t("wallets.balanceLess")); //提示余额不足
          return false;
        } else {
          return true;
        }
      } else {
        this.$toast.fail(this.$t("wallets.amountMoreTan2"));
        return false;
      }
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
    // isNumber(str) {
    //     let reg = /^(-?\d+)(\.\d+)?$/; //浮点数
    //     return reg.test(str);
    // }
    isNumber(num) {
      const number = +num;
      // discard NaN and Infinity
      if (number - number !== 0) return false;
      if (number) {
        if (number === num) return true;
      } else {
        return false;
      }
      if (typeof num === "string") {
        // discard number is ''
        if (number === 0 && num.trim() === "") return false;
        return true;
      }
      return false;
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
    margin: 16px 0;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    background-color: #fff;
  }
}
.transferWays {
}
.submit {
  padding: 16px;
  .van-button {
    width: 100%;
  }
}
.code-box {
  margin: 0 8px;
  margin-top: 40px;
}
.phone-list {
  position: relative;
}
</style>
<style>
.wallet-transfer .van-field .van-cell__title {
  min-width: 100px;
}
</style>

