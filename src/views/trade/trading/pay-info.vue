<template>
  <div class="pay-info">
    <van-list
      v-if="orderInfo.payType"
      v-model="loading"
      :finished="true"
    >
      <van-cell>
        <template>
          <span class="label">{{$t("common.zhiFuXinXi")}}:</span>
          <span class="payImg" @click="show = true">
            <img width="25"
            :src="require('../../../assets/image/payment_'+ orderInfo.payType +'.png')">
          </span>
          <div v-if="orderInfo.tradeQRCode" style="margin-top: 4px;line-height: 1.5">
            <img v-if="orderInfo.tradeQRCode.uploadfile"  :src="orderInfo.tradeQRCode.uploadfile" alt="" style="max-width: 150px;max-height: 150px;">
            <span v-else>{{orderInfo.tradeQRCode.accountInfo}}</span>
          </div>
        </template>
      </van-cell>
    </van-list>

    <van-popup v-model="show">
      <template v-if="orderInfo.tradeQRCode">
        <img v-if="orderInfo.tradeQRCode.uploadfile"
          width="240"
          :src="orderInfo.tradeQRCode.uploadfile">
        <span v-else class="no-qrcode">{{$t("trade.erWeiMa1")}}</span>
      </template>
    </van-popup>
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
      show: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .label {
    color: #999;
  }
  .payImg {
    display: inline-block;
    padding: 0px 12px;
    height: 28px;
    border: 1px solid #e5e5e5;
    vertical-align: middle;
    img {
      vertical-align: middle;
    }
  }
  .no-qrcode {
    display: inline-block;
    padding: 20px;
  }
</style>

