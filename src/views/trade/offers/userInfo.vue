<template>
  <div class="user-info">
    <div v-if="detail.tradeType" class="info">
      <div class="head">
        <div class="avatar">
          <img v-if="detail.owner.avatar" :src="detail.owner.avatar">
          <img v-else src="~assets/image/avatar-default.png">
        </div>
        <div class="information">
          <div class="name">
            <span>{{detail.owner.name}}</span>
            <img v-for="pay in detail.allowPay" :key="pay"
              :src="require('../../../assets/image/payment_' + pay + '.png')">
          </div>
          <div class="limit">
            {{$t("common.xianE")}}:
            <span v-if="detail.orderCeilPrice >= detail.orderFloorPrice">
              {{ detail.orderFloorPrice.toFixed(2) }}-{{ detail.orderCeilPrice.toFixed(2) }}
              {{ detail.tradeType === 'buy' ? detail.currency : detail.fiatCurrency }}
            </span>
            <span v-else> {{$t("common.yiShouWan")}}</span>
          </div>
        </div>
        <div v-if="detail.floatPrice" class="price">
          {{ detail.floatPrice.toFixed(6) }}{{ detail.fiatCurrency }}
        </div>
      </div>
      <div class="body">
        <div class="item">
          <div class="t">{{detail.tradeCount}}</div>
          <div class="b">{{$t("common.jiaoYiCiShu")}}</div>
        </div>
        <div class="item">
          <div class="t">{{(detail.owner.positiveRate * 100).toFixed(2) + '%'}}</div>
          <div class="b">{{$t("trade.haoPing")}}</div>
        </div>
      </div>
    </div>
    <div class="remark">
  
      {{ detail.autoReplyBefore }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
      default: () => { return {} }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  padding: 16px 8px;
  background-color: #fff;
  .head {
    display: flex;
    .avatar {
      width: 50px;
      img {
        width: 100%;
      }
    }
    .information {
      flex: 1;
      padding: 0 4px;
      .name {
        margin-bottom: 16px;
        img {
          width: 18px;
          vertical-align: middle;
        }
      }
    }
    .price {
      width: 120px;
      line-height: 50px;
      font-size: 14px;
      color: $color-success;
    }
  }
  .body {
    display: flex;
    margin-top: 12px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.2);
    .item {
      width: 50%;
      text-align: center;
      div {
        margin-bottom: 8px;
      }
    }
  }
  .remark {
    padding: 24px 0;
    font-size: 14px;
  }
}
</style>
