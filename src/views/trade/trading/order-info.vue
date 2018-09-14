<template>
  <div class="order-info">
    <van-list
      v-if="orderInfo.orderType"
      v-model="loading"
      :finished="true"
    >
      <van-cell>
        <template>
          <div class="item">
            <div class="code">
              {{$t("common.dingDanBianHao")}}：{{orderInfo.orderCode}}
            </div>
            <div class="status tradeStatus">
              {{$t(`status['${orderInfo.orderStatus}']`)}}
            </div>
          </div>
        </template>
      </van-cell>
      <van-cell>
        <template>
          <div class="item">
            <div class="code">
               {{$t("common.jiaoYiJinE")}}：
            </div>
            <div class="status">
              {{orderInfo.fiatCurrencyAmount.toFixed(6)}}
              {{orderInfo.fiatCurrency}}
            </div>
          </div>
          <div class="item">
            <div class="code">
               {{$t("common.jiaoYiAmount")}}：
            </div>
            <div class="status">
              {{orderInfo.currencyAmount.toFixed(6)}}
              {{orderInfo.currency}}
            </div>
          </div>
          <div class="item">
            <div class="code">
              {{$t("common.danJia")}}：
            </div>
            <div class="status">
              {{orderInfo.unitPrice.toFixed(6)}}
              {{orderInfo.fiatCurrency}}
            </div>
          </div>
        </template>
      </van-cell>
      <van-cell>
        <template>
          <div class="item2">
            <div class="l">
              {{$t("common.jiaoYiBeiZhu")}}：
            </div>
            <div class="r" v-html="orderInfo.remark"></div>
          </div>
        </template>
      </van-cell>
      <van-cell>
        <template>
          <div class="item2">
            <div class="l">
              {{$t("common.jiaoYiShuoMing")}}：
            </div>
            <div class="r" v-html="orderInfo.desc"></div>
          </div>
        </template>
      </van-cell>
      <van-cell v-if="orderInfo.status === 'success'">
        <template>
          <div class="item3">
            <div class="l">
               {{$t("trade.pingJia1")}}：
            </div>
            <div class="r">
              <span v-if="orderInfo.commentToOther.comment">
                {{ orderInfo.commentToOther.str }}
                <strong>
                  ({{ evaluate(orderInfo.commentToOther.comment) }})
                </strong>
              </span>
              <span v-else style="color: gray;"> {{$t("trade.zanWu")}}</span>
            </div>
          </div>
          <div class="item3">
            <div class="l">
              {{$t("trade.pingJia2")}}：
            </div>
            <div class="r">
              <span v-if="orderInfo.commentToMe.comment">
                {{ orderInfo.commentToMe.str }}
                <strong>
                  ({{ evaluate(orderInfo.commentToMe.comment) }})
                </strong>
              </span>
              <span v-else style="color: gray;">{{$t("trade.zanWu")}}</span>
            </div>
          </div>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
export default {
  props: {
    orderInfo: {
      type: Object,
      default: () => {return {}}
    }
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    // 翻译评价等级
    evaluate(val) {
      if (val === 'good') return this.$t("trade.haoPing")
      if (val === 'bad') return this.$t("trade.caPing")
      if (val === 'middle') return this.$t("trade.zhongPing")
      return val
    }
  }
}
</script>

<style lang="scss" scoped>
  .item, .item2, .item3 {
    display: flex;
    justify-content: space-between;
    .status {
      width: 140px;
      margin-left: 10px;
      text-align: right;
    }
    .tradeStatus {
      color: $color-success;
    }
  }
  .item2 {
    .l {
      width: 70px;
      color: #999;
    }
    .r {
      flex: 1;
    }
  }
  .item3 {
    .l {
      width: 120px;
      color: #999;
    }
    .r {
      flex: 1;
    }
  }
</style>

