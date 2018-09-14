<template>
  <div class="operate" v-if="orderInfo.orderType">
    <div class="text" v-if="showText">
      <p class="p1">
        <span>{{orderInfo.currency}}</span>
        {{$t("operate.not1")}}
        <span>{{time}}</span>
        {{$t("operate.not2")}}
      </p>
      <p class="p2">{{$t("operate.not3")}}</p>
      <p class="p3" style="color: red;">{{$t("operate.not4")}}</p>
    </div>
    <van-row v-if="showBuyer"
      class="submit">
      <template class="d1" v-if="showBuyer01">
        <van-col span="9" offset="2">
          <van-button @click="handleUpdateOrder('cancel')">{{$t("operate.quXiaoJiaoYi")}}</van-button>
        </van-col>
        <van-col span="9" offset="2">
          <van-button type="primary" @click="handleUpdateOrder('affirm')">{{$t("operate.biaoJiFuKuan")}}</van-button>
        </van-col>
      </template>
      <template class="d2" v-if="showBuyer02">
        <p class="p1">{{$t("operate.not5")}}</p>
        <van-col span="11" offset="1">
          <van-button disabled>{{$t("operate.not6")}}</van-button>
        </van-col>
        <van-col span="11" offset="1">
          <van-button @click="showAppeal = true">{{$t("operate.not7")}}</van-button>
        </van-col>
      </template>
    </van-row>
    <van-row v-else-if="showSeller" class="end">
      <van-col span="11" offset="1">
        <van-button :disabled="canRelease" @click="handleUpdateOrder('affirm')">{{sellerText}}</van-button>
      </van-col>
      <van-col span="11" offset="1">
        <van-button :disabled="canRelease" @click="showAppeal = true">{{$t("operate.not7")}}</van-button>
      </van-col>
    </van-row>
    <div class="appeal" v-else-if="orderInfo.appealStatus !== 'normal'">
      <p>{{orderInfo.orderStatus}}</p>
      <van-button @click="_cancelAppeal"
        v-if="canCancelAppeal" style="width: 120px;">{{$t("common.cancel")}}</van-button>
    </div>
    <van-row v-else class="end">
      <van-col span="10" offset="6">
        <van-button disabled>{{endText}}</van-button>
      </van-col>
    </van-row>
    <van-row v-if="canEvaluate" class="evaluate">
      <van-col span="10" offset="6">
        <van-button @click="showEvaluate = true">{{$t("common.pingJia")}}</van-button>
      </van-col>
    </van-row>

    <!-- 释放货币、确认付款 -->
    <van-dialog
      class="dialog"
      :title="dialogTitle"
        :confirmButtonText='$t("common.sure")'
          :cancelButtonText='$t("common.cancel")'
      v-model="show"
      show-cancel-button
      @confirm="handleConfirm"
    >
      <div v-if="showBuyer">
        <p class="p1">{{$t("operate.state1")}}</p>
        <p class="p2">{{$t("operate.state2")}}</p>
        <p class="p3">{{$t("operate.state3")}}</p>
        <van-cell-group>
          <van-field
            v-model="remark"
            :label='$t("operate.message1")'
            :placeholder='$t("operate.message3")'
            rows="2"
            autosize
          />
        </van-cell-group>
      </div>
      <div v-else>
        <p class="p1">{{$t("operate.message4")}}</p>
        <van-cell-group>
          <van-field
            v-model="remark"
            :label='$t("operate.message3")'
            :placeholder='$t("operate.message1")'
            rows="2"
            autosize
          />
        </van-cell-group>
      </div>
    </van-dialog>

    <!-- 申诉 -->
    <van-dialog
      class="dialog-appeal"
      v-model="showAppeal"
      show-cancel-button
      :title='$t("appeal.appeal")'
      @confirm="handleAppeal"
    >
      <p class="p1">{{$t("appeal.must1")}}</p>
      <p class="p2">{{$t("appeal.must2")}}</p>
      <p class="p3">{{$t("appeal.must3")}}</p>
      <p class="p4">{{$t("appeal.appealType")}}：</p>
      <van-radio-group v-model="appeal.appealType">
        <van-radio name="no_pay">{{$t("appeal.typeList.no_pay")}}</van-radio>
        <van-radio name="no_coin">{{$t("appeal.typeList.no_coin")}}</van-radio>
        <van-radio name="no_response">{{$t("appeal.typeList.no_response")}}</van-radio>
        <van-radio name="spite">{{$t("appeal.typeList.spite")}}</van-radio>
        <van-radio name="other">{{$t("appeal.typeList.other")}}</van-radio>
      </van-radio-group>
      <van-cell-group>
        <van-field
          v-model="appeal.msg"
          type="textarea"
          :placeholder='$t("appeal.textarea")'
          :rows="1"
        />
      </van-cell-group>
    </van-dialog>

    <!-- 评价 -->
    <van-dialog
      class="dialog-evaluate"
      v-model="showEvaluate"
      show-cancel-button
       :title='$t("common.pingJia")'
      @confirm="handleEvaluate"
    >
      <van-radio-group v-model="evaluate.comment">
        <van-radio name="good">{{$t("trade.haoPing")}}</van-radio>
        <van-radio name="middle">{{$t("trade.zhongPing")}}</van-radio>
        <van-radio name="bad">{{$t("trade.caPing")}}</van-radio>
      </van-radio-group>
      <van-cell-group>
        <van-field
          v-model="evaluate.str"
          type="textarea"
          :placeholder="$t('common.pingJiaCon')"
          :rows="1"
        />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
import { orderUpdate, appeal, evaluate, cancelAppeal } from 'api/trade'
import { mapGetters } from 'vuex'

export default {
  props: {
    orderInfo: {
      type: Object,
      default: () => {return {}}
    },
    status: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      time: '----',
      show: false,
      showAppeal: false,
      showEvaluate: false,
      remark: '',
      sellerText: '',
      appeal: {
        appealType: '',
        msg: ''
      },
      evaluate: {
        comment: 'good',
        str: '',
      },
    }
  },
  computed: {
    ...mapGetters(['getSystem', 'getUserId', 'getAppealId']),
    // 是否展示倒计时文字
    showText() {
      return this.status === 'waitPay' && this.orderInfo.orderType === 'buy' && this.orderInfo.appealStatus === 'normal'
    },
    // 是否展示买家按钮
    showBuyer() {
      return (this.status === 'waitPay' || this.status === 'waitCoin') &&
        this.orderInfo.orderType === 'buy' && this.orderInfo.appealStatus === 'normal'
    },
    showBuyer01() {
      return this.status === 'waitPay' && this.orderInfo.orderType === 'buy'
    },
    showBuyer02() {
      return this.status === 'waitCoin' && this.orderInfo.orderType === 'buy'
    },
    // 是否展示卖家按钮
    showSeller() {
      return (this.status === 'waitPay' || this.status === 'waitCoin') &&
        this.orderInfo.orderType === 'sell' && this.orderInfo.appealStatus === 'normal'
    },
    // 卖家能否点击释放货币, true表示禁用
    canRelease() {
      if (this.status === 'waitPay') {
        this.sellerText = this.$t("common.waitFuKuan")
        return true
      }
      if (this.status === 'waitCoin') {
        this.sellerText = this.$t("common.shiFangHuoBi")
        return false
      }
      return true
    },
    // 交易结束显示
    endText() {
      if (this.status === 'success') return this.$t("common.jiaoYiWanCheng")
      if (this.status === 'cancel') return  this.$t("common.jiaoYiQuXiao")
      if (this.status === 'expire') return  this.$t("common.jiaoYiChaoShi")
    },
    dialogTitle() {
      if (this.orderInfo.orderType === 'buy') return  this.$t("common.submitBuy")
      else if (this.orderInfo.orderType === 'sell') return  this.$t("common.shiFangHuoBi")
      else return ''
    },
    // 能否评价
    canEvaluate() {
      return this.status === 'success' && !this.orderInfo.commentToOther.comment
    },
    // 是否显示取消申诉
    canCancelAppeal() {
      return this.orderInfo.appealStatus === 'commit' && this.getUserId === this.getAppealId
    }
  },
  destroyed() {
    clearInterval(this.timmer)
  },
  watch: {
    orderInfo: {
      handler(val) {
        if (val.expire) {
          this._countDown(val.expire)
        }
      },
      deep: true,
      immediate: true
    },
    // waitPay, waitCoin, success, cancel, expire
    status(val) {
    },
    // socket 系统消息
    getSystem(val) {
      this.$emit('updateStatus')
    }
  },
  methods: {
    // 更新订单状态
    _orderUpdate(op) {
      if (!this.remark) {
        this.orderInfo.orderType === 'buy' ? this.remark = this.$t("common.fuKuanWanCheng") : this.remark = this.$t("common.yiShiFangHuoBi")
      }
      orderUpdate({
        orderCode: this.orderInfo.orderCode,
        op: op,
        remark: this.remark
      })
      .then(data => {
        if (data.code === 0) {
          if (op === 'affirm') {
            this.$toast(this.$t("operate.biaoJiChengGong"))
            this.$store.commit('setRemark', this.remark)
          }
          if (op === 'cancel') this.$toast(this.$t("common.orderCancelSuccess"))
          if (op === 'delay') this.$toast(this.$t("common.orderYanShiSuccess"))
          this.$emit('updateStatus')
        }
      })
    },
    // 处理交易按钮点击
    handleUpdateOrder(op) {
      if (op === 'affirm') {
        this.show = true
      }
      if (op === 'cancel') {
        this.$dialog.confirm({
          title: this.$t("common.tiShi"),
          confirmButtonText:this.$t("common.sure"),
          cancelButtonText:this.$t("common.cancel"),
          message: this.$t("common.queRenQuXiaoDingDan")
        }).then(() => {
          this._orderUpdate(op)
        }).catch(() => {
          // on cancel
        });
      }
    },
    // 处理确认付款和释放货币按钮
    handleConfirm() {
      this._orderUpdate('affirm')
    },
    // 申诉按钮
    handleAppeal() {
      if (!this.appeal.appealType) {
        this.$toast.fail(this.$t("appeal.shenSuNotKong"))
        return
      }
      this._appeal()
    },
    // 评价按钮
    handleEvaluate() {
      this._evaluate()
    },
    // 倒计时
    _countDown(ms) {
      if (this.timmer) clearInterval(this.timmer)
      const now = new Date().getTime()
      const end = ms
      if (now >= end) return
      this.timmer = setInterval(() => {
        const total = ((end - new Date().getTime()) / 1000).toFixed(0)
        const m = total / 60 >= 10 ? Math.floor(total / 60)
          : '0' + Math.floor(total / 60)
        const s = total % 60 >= 10 ? Math.floor(total % 60)
          : '0' + Math.floor(total % 60)
        this.time = m + ':' + s
        if (total <= 0) {
          clearInterval(this.timmer)
          setTimeout(() => this.$emit('updateStatus'), 3000)
          setTimeout(() => this.$emit('updateStatus'), 5000)
          setTimeout(() => this.$emit('updateStatus'), 7000)
          setTimeout(() => this.$emit('updateStatus'), 9000)
        }
      }, 1000)
    },
    // 申诉
    _appeal() {
      appeal({
        orderCode: this.orderInfo.orderCode,
        ...this.appeal
      }).then(data => {
        if (data.code === 0) {
          this.$toast(this.$t("appeal.tiJiaoShenSuSuccess"))
          this.$emit('updateStatus')
        }
      })
    },
    // 评论
    _evaluate() {
      evaluate(Object.assign(this.evaluate, {
        orderCode: this.orderInfo.orderCode
      }))
        .then(data => {
          if (data.code === 0) {
            this.$emit('updateStatus')
            this.$toast(this.$t("common.pingLunSuccess"))
          }
        })
    },
    // 取消申诉
    _cancelAppeal() {
      this.$dialog.confirm({
        title: this.$t("common.tiShi"),
        message: this.$t("common.queRenQuXiaoShenSu")
      }).then(() => {
        // on confirm
        cancelAppeal(this.orderInfo.orderCode)
          .then((data) => {
            if (data.code === 0) {
              this.$toast(this.$t("common.quXiaoShenSuChengGong"))
            }
          })
      }).catch(() => {
        // on cancel
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.operate {
  text-align: center;
  padding: 16px 8px;
  border-bottom: 1px solid #e5e5e5;
  .van-button {
    width: 100%;
  }
  .submit {
    .van-button {
      width: 100%;
    }

    .p1 {
      line-height: 1.3;
    }
  }
  .p1 {
    span {
      color: $color-success;
    }
  }
  .dialog {
    padding: 0 16px;
    font-size: 12px;
    text-align: left;
  }
  .appeal {
    font-size: 16px;
    color: gray;
  }
  .dialog-appeal, .dialog-evaluate {
    text-align: left;
    padding: 0 16px;
    .van-radio {
      padding: 3px 0;
    }
    .van-cell-group {
      margin: 12px 0;
    }
  }
  .dialog-evaluate {

  }
  .evaluate {
    padding: 16px 0;
  }
}
</style>
