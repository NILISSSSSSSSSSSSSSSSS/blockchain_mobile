<template>
  <div class="adver-details">
    <g-head>
      <van-nav-bar
         :title='$t("advertisement.adDetail")'
        left-arrow
        @click-left="onClickLeft"
      />
    </g-head>
    <div class="details">
      <van-notice-bar
        style="margin-bottom: 16px;"
        v-if="detail.status && !isOnline"
        :scrollable="false">
         {{$t("advertisement.guangGaoYiXiaJia")}}
      </van-notice-bar>
      <div v-if="detail.tradeType" class="info">
        <div class="head">
          <div class="avatar">
            <img v-if="detail.owner.avatar" :src="detail.owner.avatar">
            <img v-else src="~assets/image/avatar-default.png">
          </div>
          <div class="information">
            <div class="name">
              <span>
                {{detail.tradeType === 'buy' ?  this.$t("common.gouMai") : this.$t("common.chushou")}}
                {{detail.currency}}
              </span>
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
            {{ detail.floatPrice.toFixed(2) }} {{ detail.fiatCurrency }}
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
        <div class="body">
          <div class="item">
            <div class="t">
              {{'+' + detail.owner.positiveComment + ' / ' + '-' + detail.owner.negativeComment}}
            </div>
            <div class="b">{{$t("trade.pinaJiaShu")}}</div>
          </div>
          <div class="item">
            <div class="t">
              {{detail.tradeSum.amount == 0? '0' : detail.tradeSum.amount.toFixed(2)}} {{detail.currency}}
            </div>
            <div class="b">{{$t("advertisement.liShiChengJiao")}}</div>
          </div>
        </div>
        <div class="body">
          <div class="item">
            <div class="t">
              {{detail.LockMinute / 1000 / 60 +this.$t("common.minute")}}
            </div>
            <div class="b">{{$t("advertisement.fuKuanQiXian")}}</div>
          </div>
          <div class="item">
            <div class="t">
              {{detail.status | statusFilter}}
            </div>
            <div class="b">{{$t("advertisement.zhuangTai")}}</div>
          </div>
        </div>
        <div class="body">
          <div class="item">
            <div class="t">
              {{$timeFormat(detail.deadline, false)}}
            </div>
            <div class="b">{{$t("advertisement.guoQiShiJian")}}</div>
          </div>
          <div class="item">
            <div class="t">
              {{ detail.limitPrice }}
              {{ detail.fiatCurrency }}
            </div>
            <div class="b">
              {{ detail.tradeType === 'buy' ? $t('common.jieShouZuiGao') : $t('common.jieShouZuiDiJia') }}
            </div>
          </div>
        </div>
        <div class="body">
          <div class="item">
            <div class="t">
              {{detail.overPercent * 100 + '%'}}
            </div>
            <div class="b"> {{$t("common.yiJia")}}</div>
          </div>
          <div class="item">
            <div class="t">
              {{ detail.tradeCountLimit }}
            </div>
            <div class="b">
             {{$t("common.biXuChengJiaoCiShu")}}
            </div>
          </div>
        </div>
        <div class="body remark">
          <div class="item">
            <div class="t">
              {{ detail.autoReplyBefore }}
            </div>
            <div class="b"> {{$t("common.liuYan")}}</div>
          </div>
        </div>
        <div class="button">
          <div class="item">
            <van-button type="primary"
              @click="handleClickModify">{{$t("common.xiuGaiGuangGao")}}</van-button>
          </div>
          <div class="item">
            <van-button
              type="default"
              @click="_modifyAdverStatus">
              {{ isOnline ? $t('advertisement.xiajiaGuangGao') : $t('advertisement.shangjiaGuangGao') }}
            </van-button>
          </div>
          <div class="item">
            <van-button
              type="danger"
              @click="handleClickDelete">{{$t("advertisement.deleteGuangGao")}}</van-button>
          </div>
        </div>
      </div>
    </div>

    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import {getAdvertsDetails} from 'api/trade'
import {deleteAdver, modifyAdverStatus} from 'api/advertisement'

export default {
  data() {
    return {
      detail: {},
      loading: false
    }
  },
  computed: {
    isOnline() {
      return this.detail.status && this.detail.status === 'online'
    }
  },
  created() {
    this._getAdvertsDetails()
  },
  methods: {
    handleClickModify() {
      this.$router.push(`/advertisement/modify/${this.detail._id}`)
    },
    handleClickDelete() {
      this.$dialog.confirm({
         confirmButtonText:this.$t("common.sure"),
          cancelButtonText:this.$t("common.cancel"),
        title: this.$t("common.wenXinTiShi"),
        message:this.$t("common.queRenShanChuGuangGao")+"?"
      }).then(() => {
        // on confirm
        this._deleteAdver()
      }).catch(() => {
        // on cancel
      });
    },
    onClickLeft() {
      this.$router.push('/advertisement/adver-list')
    },
    _getAdvertsDetails() {
      this.loading = true
      const id = this.$route.params.id
      getAdvertsDetails(id)
        .then(data => {
          this.loading = false
          if (data.code !== 0) return
          this.detail = data.data
        })
        .catch(err => {
          this.loading = false
        })
    },
    _deleteAdver() {
      this.loading = true
      const advertIds = [this.detail._id]
      deleteAdver({advertIds})
        .then(data => {
          this.loading = false
          if (data.code !== 0) return
          this.$toast( this.$t("common.deleteSuccess"))
          this.$router.push('/advertisement/adver-list')
        })
        .catch(err => {
          this.loading = false
        })
    },
    _modifyAdverStatus() {
      this.loading = true
      const advertIds = [this.detail._id]
      const status = this.detail.status === 'offline' ? 'online' : 'offline'
      modifyAdverStatus({advertIds, status})
        .then(data => {
          this.loading = false
          if (data.code !== 0) return
          this.$toast( this.$t("advertisement.updateStatusSucc"))
          this._getAdvertsDetails()
        })
        .catch(err => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .details {
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
        padding: 0 10px;
        .name {
          margin-bottom: 16px;
          img {
            width: 18px;
            vertical-align: middle;
          }
        }
      }
      .price {
        width: 100px;
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
        .t {
          color: #67C23A;
        }
        div {
          margin-bottom: 8px;
        }
      }
    }
    .remark {
      .item {
        width: 100%;
      }
    }
    .button {
      padding: 24px 0;
      display: flex;
      .item {
        width: 33.33%;
        text-align: center;
      }
    }
  }
</style>
