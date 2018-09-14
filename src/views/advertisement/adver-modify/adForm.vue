<template>
  <div class="ad-form" v-if="currencyArr.length > 0">
    <div class="box d1 forbid">
      <!-- 交易类型 -->
      <van-cell :title='$t("common.jiaoYiLeiXing")' is-link :value="tradeTypeText" />
      <!-- 选择数字币 -->
      <van-cell :title='$t("common.xuanZeBiZhong")' is-link :value="form.currency" />
      <!-- 法币 -->
      <van-cell :title='$t("common.huoBi")' is-link :value="form.fiatCurrency" />
    </div>

    <div class="box d2">
      <!-- 支付方式 -->
      <div class="allow-pay">
        <span class="text-pay">{{$t("common.zhiFuFangShi")}}：</span>
        <van-checkbox-group v-model="form.allowPay">
          <van-cell-group>
            <van-cell v-for="(item, index) in payArr" :title="item.payType | payTypeFilter" :key="index">
              <div class="canUseBox">
                <!-- <router-link tag="span" to="/account/tradeSetting/:payType" class="gotoSet">{{ !item.canUse ? '前去预设' : ''}}</router-link> -->
                <span class="gotoSet" @click="gotoSetting(item.payType)">{{ !item.canUse ? $t("common.qianQuYuSe") : ''}}</span>
                <van-checkbox :disabled="!item.canUse ? true : false" :name="item.payType" class="checkbox"></van-checkbox>
              </div>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
    </div>

    <div class="box d2">
      <!-- 是否使用USDT支付 -->
      <div class="allow-pay">
        <van-cell-group>
          <van-cell :title="textUSDT">
            <van-checkbox v-model="form.isUSDT" />
          </van-cell>
        </van-cell-group>
      </div>
    </div>

    <div class="box d1">
      <!-- 出售价设置 -->
      <van-popup v-model="selectExchange" position="bottom" :overlay="false">
        <van-picker  :cancel-button-text="$t('common.cancel')" :confirm-button-text="$t('common.sure')" :columns="exchanges" @confirm="onChangeExchange" show-toolbar @cancel="selectExchange = false" />
      </van-popup>
      <van-cell :title='$t("common.duiBiaoJiaoYiSuo")' is-link :value="exchangeText" @click="selectExchange = true" />
    </div>

    <div class="box">
      <!-- 溢价 -->
      <span class="text-pay">{{$t("common.yiJia")}}{{`(${overPercentPrice})`}}</span>
      <van-cell-group class="over-percent">
        <van-field v-model="form.overPercent" @input="onChangeOverPercent" />
      </van-cell-group>
      <span class="scope">{{$t("common.yiJiaFanWei")}}：{{overPercentScope}}</span>
    </div>

    <div class="box d3">
      <!-- 最高/低 价 -->
      <van-cell-group>
        <van-field v-model="form.limitPrice" :label="textBest" />
      </van-cell-group>

      <!-- 最小限额-->
      <van-cell-group>
        <van-field v-model="form.orderFloorPrice" :label="textFloor" />
      </van-cell-group>

      <!-- 最大限额-->
      <van-cell-group>
        <van-field v-model="form.orderCeilPrice" :label="textCeil" />
      </van-cell-group>
    </div>

    <div class="box">
      <!-- 溢价 -->
      <span class="text-pay">{{$t("common.yiJiaText1")}}</span>
      <van-cell-group class="over-percent">
        <van-field v-model="form.maxOrderLimit" type="number" />
      </van-cell-group>
    </div>

    <div class="box">
      <!-- 自动回复消息 -->
      <span class="text-pay">
         {{$t("advertisement.adShouXuFei5",{msg1:textTrade})}}:
      </span>
      <van-cell-group class="over-percent">
        <van-field v-model="form.autoReplyBefore" />
      </van-cell-group>
    </div>

    <div class="box">
      <!-- 必须成交次数 -->
      <span class="text-pay">{{$t("common.biXuChengJiaoCiShu")}}</span>
      <van-cell-group class="over-percent">
        <van-field v-model="form.tradeCountLimit" type="number" />
      </van-cell-group>
    </div>

    <div class="box d2">
      <!-- 卖家/买家限制 -->
      <div class="allow-pay">
        <span class="text-pay">{{$t("advertisement.maiJixXianZhi")}}：</span>
        <van-cell-group>
          <van-cell :title='$t("common.duiFangBiXuShouJiYanZheng")'>
            <van-checkbox v-model="form.isIdentityVerify" />
          </van-cell>
          <van-cell :title='$t("common.duiFangBiXuErCiYanZheng")'>
            <van-checkbox v-model="form.isadvancedVerify" />
          </van-cell>
        </van-cell-group>
      </div>
    </div>

    <div class="submit">
      <van-button @click="_modifyAdver" type="primary" :disabled="forbiddenSubmit">{{$t("advertisement.queRenXiuGai")}}</van-button>
    </div>
  </div>
</template>

<script>
import { isNumber } from "assets/js/utils";
import { submitAdver, modifyAdver } from "api/advertisement";
import { getAdvertsDetails } from "api/trade";

export default {
    props: {
        currencyArr: Array,
        fiatCurrency: Array,
        exchangeArr: Array,
        overPercentLimit: Object,
        payTypeCanUseArr: Array
    },
    data() {
        return {
            configFiatBi:"USDT",
            selectExchange: false,
            tradeTypeArr: [this.$t("common.gouMai"), this.$t("common.chushou")],
            fiatCurrencyArr: [],
            exchangeValue: 0,
            forbiddenSubmit: true,
            form: {
                currency: "ETH",
                fiatCurrency: "CNY",
                tradeType: "buy",
                allowPay: [],
                isUSDT: false,
                exchange: "average",
                overPercent: 0,
                limitPrice: null,
                orderFloorPrice: null,
                orderCeilPrice: null,
                lockMinute: 15,
                maxOrderLimit: 15,
                tradeCountLimit: 0,
                isIdentityVerify: false,
                isadvancedVerify: false,
                autoReplyBefore: ""
            }
        };
    },
    computed: {
        tradeTypeText() {
            return this.form.tradeType === "buy" ?  this.$t("common.gouMai") : this.$t("common.chushou");
        },
        payArr() {
            for (let i of this.fiatCurrency) {
                if (i.name === this.form.fiatCurrency) {
                    let tmp = [];
                    i.allowPay.forEach(payType => {
                        let obj = {
                            payType: payType
                        };
                        let index = this.payTypeCanUseArr.findIndex(item => {
                            return item.payType == payType;
                        });
                        if (index > -1) {
                            obj.canUse = this.payTypeCanUseArr[
                                index
                            ].isOrderShow;
                        }
                        tmp.push(obj);
                    });
                    return tmp;
                }
            }
            return [];
        },
        exchanges() {
            return this.exchangeArr.map(x => x.name);
        },
        exchangeText() {
            for (let i of this.exchangeArr) {
                if (i.name === this.form.exchange) {
                    this.exchangeValue = i.value;
                    return `${i.name}(${i.value.toFixed(2)})`;
                }
            }
        },
        overPercentScope() {
            if (this.overPercentLimit.min) {
                return `${this.accuracy(
                    this.overPercentLimit.min
                )}% - ${this.accuracy(this.overPercentLimit.max)}%`;
            }
            return "";
        },
        overPercentPrice() {
            if (!isNumber(this.form.overPercent))
                return this.exchangeValue.toFixed(6);
            return (
                +this.exchangeValue *
                (1 + this.accuracy2(this.form.overPercent))
            ).toFixed(6);
        },
        textBest() {
            return this.form.tradeType === "buy"
                ? this.$t("common.jieShouZuiGao")
                : this.$t("common.jieShouZuiDiJia");
        },
        textFloor() {
            return this.form.tradeType === "buy"
                ? `${this.$t("common.zuiXiaoXianE")}(${this.form.currency})`
                : `${this.$t("common.zuiXiaoXianE")}(${this.form.fiatCurrency})`;
        },
        textCeil() {
            return this.form.tradeType === "buy"
                ? `${this.$t("common.zuiDaXianE")}(${this.form.currency})`
                : `${this.$t("common.zuiDaXianE")}(${this.form.fiatCurrency})`;
        },
        textTrade() {
            return this.form.tradeType === "buy" ? this.$t("common.mai1") : this.$t("common.mai2");
        },
        textUSDT() {
            return this.form.tradeType === "buy"
                ? this.$t("common.ask3",{msg:this.configFiatBi})
                : this.$t("common.ask2",{msg:this.configFiatBi});
        }
    },
    watch: {
        fiatCurrency: {
            handler(val) {
                console.log(val);
                this.fiatCurrencyArr = val.map(x => x.name);
            },
            deep: true
        },
        form: {
            handler(val) {
                this.canSubmit();
            },
            deep: true
        }
    },
    created() {
         this.configFiatBi= localStorage.getItem("configFiatBi");
        this._getAdvertsDetails();
    },
    methods: {
        gotoSetting(payType) {
            this.$router.push(`/account/tradeSetting/${payType}`);
        },
        // 修改广告
        _modifyAdver() {
            if (!this._isSubmit()) return;
            const id = this.$route.params.id;
            modifyAdver({
                id,
                form: Object.assign({}, this.form, {
                    overPercent: this.accuracy2(this.form.overPercent)
                })
            }).then(data => {
                if (data.code !== 0) return;
                this.$toast( this.$t("common.updateSuccess"));
                this.$router.push(`/advertisement/detail/${id}`);
            });
        },
        _getAdvertsDetails() {
            const id = this.$route.params.id;
            getAdvertsDetails(id).then(data => {
                if (data.code !== 0) return;
                let obj = Object.assign(
                    {},
                    this.form,
                    { ...data.data },
                    {
                        overPercent: this.accuracy(data.data.overPercent)
                    }
                );
                for (let x in this.form) {
                    this.form[x] = obj[x];
                }
                this.$emit("updatePreset", {
                    tradeType: data.data.tradeType,
                    currency: data.data.currency,
                    fiatCurrency: data.data.fiatCurrency
                });
            });
        },
        // 小数=》百分比
        accuracy(num) {
            return num * 100;
        },
        // 百分比=》小数
        accuracy2(num) {
            let str = String(num);
            if (str.indexOf(".") === -1) return num / 100;
            const cifang = str.split(".")[1].length;
            return num * Math.pow(10, cifang) / (100 * Math.pow(10, cifang));
        },
        // 能否点击发布交易
        canSubmit() {
            this.forbiddenSubmit = true;
            for (let x in this.form) {
                if (this.form.hasOwnProperty(x)) {
                    if (this.form[x] == null) return;
                    if (
                        this.form[x] instanceof Array &&
                        this.form[x].length === 0
                    )
                        return;
                }
            }
            this.forbiddenSubmit = false;
        },
        onChangeExchange(exchange) {
            this.selectExchange = false;
            this.form.exchange = exchange;
        },
        onChangeOverPercent(num) {
            if (num === "-" || num === "") return;
            if (!isNumber(num)) {
                this.form.overPercent = 0;
            }
        },
        // 发布交易合法性校验
        _isSubmit() {
            if (
                !isNumber(this.form.orderFloorPrice) ||
                !isNumber(this.form.orderCeilPrice) ||
                !isNumber(this.form.limitPrice)
            ) {
                this.$toast.fail( this.$t("advertisement.xianENum"));
                return false;
            }
            if (
                Number(this.form.overPercent) <
                    this.overPercentLimit.min * 100 ||
                Number(this.form.overPercent) >
                    this.overPercentLimit.max * 100 ||
                isNaN(Number(this.form.overPercent))
            ) {
                this.$toast.fail(this.$t("advertisement.xianENum2"));
                return false;
            }
            if (
                Number(this.form.orderFloorPrice) < 0 ||
                Number(this.form.orderCeilPrice) < 0
            ) {
                this.$toast.fail(this.$t("advertisement.xianENum3"));
                return false;
            }
            //限额保留小数点后的位数的限制
            if (this.form.orderFloorPrice.toString().indexOf(".") > -1) {
                if (this.form.tradeType == "buy") {
                    if (
                        this.form.orderFloorPrice.replace(/^\d+\./, "").length >
                        8
                    ) {
                        this.$toast.fail(this.$t("advertisement.bi1"));
                        return false;
                    }
                } else {
                    if (
                        this.form.orderFloorPrice.replace(/^\d+\./, "").length >
                        2
                    ) {
                        this.$toast.fail(this.$t("advertisement.bi2"));
                        return false;
                    }
                }
            }
            if (this.form.orderCeilPrice.toString().indexOf(".") > -1) {
                if (this.form.tradeType == "buy") {
                    if (
                        this.form.orderCeilPrice.replace(/^\d+\./, "").length >
                        8
                    ) {
                        this.$toast.fail(this.$t("advertisement.bi1"));
                        return false;
                    }
                } else {
                    if (
                        this.form.orderCeilPrice.replace(/^\d+\./, "").length >
                        2
                    ) {
                        this.$toast.fail(this.$t("advertisement.bi2"));
                        return false;
                    }
                }
            }
            if (
                Number(this.form.orderFloorPrice) >
                Number(this.form.orderCeilPrice)
            ) {
                this.$toast.fail(this.$t("advertisement.bi3"));
                return false;
            }
            if (Number(this.form.orderFloorPrice) < 0) {
                this.$toast.fail(this.$t("advertisement.bi4"));
                return false;
            }
            return true;
        }
    }
};
</script>

<style lang="scss">
.ad-form {
    .d1 {
        .van-cell__value {
            margin-left: 20px;
            padding-left: 20px;
            border-left: 1px solid #bbb;
            text-align: left;
        }
        .van-cell__title {
            width: 70px;
            text-align: justify;
            text-justify: distribute-all-lines;
            text-align-last: justify;
        }
        .over-percent {
            .van-cell__value {
                border-left: none;
            }
        }
    }
    .d3 {
        .van-cell__value {
            margin-left: 20px;
            padding-left: 20px;
            border-left: 1px solid #bbb;
            text-align: left;
        }
        .van-cell__title {
            width: 96px;
        }
    }
    .forbid {
        .van-cell {
            background-color: #eee;
        }
    }
}
</style>

<style lang="scss" scoped>
.ad-form {
    .box {
        margin-top: 16px;
        background-color: #fff;
        .text-pay {
            display: inline-block;
            padding: 12px;
            font-size: 14px;
            color: #666;
        }
    }
    .allow-pay {
        font-size: 14px;
        background-color: #fff;
    }
    .scope {
        display: inline-block;
        padding: 8px;
        color: #999;
    }
    .submit {
        padding: 16px 0;
        text-align: center;
    }
    .canUseBox {
        display: inline-block;
        .gotoSet {
            margin-right: 15px;
            vertical-align: middle;
        }
        .checkbox {
            display: inline-block;
            vertical-align: middle;
        }
    }
}
</style>
