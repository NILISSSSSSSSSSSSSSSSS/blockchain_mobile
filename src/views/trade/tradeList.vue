<template>
  <div class="trade-list">
    <van-list
      v-model="loading"
      :finished="finished"
      @load="loadList"
      :offset="10"
    >
      <van-cell v-if="totalList.length > 0"
        v-for="(item, index) in totalList" :key="index">
        <template>
          <router-link
            :to="'/trade/offers/' + item._id" class="trade-adver">
            <!-- 头像 -->
            <div class="avatar">
              <img v-if="item.owner.avatar" style="border-radius: 50%;" :src="item.owner.avatar">
              <img v-else src="~assets/image/avatar-default.png">
            </div>
            <div class="main">
              <div class="name">
                <span>{{item.owner.name}}</span>
                <img v-for="pay in item.allowPay" :key="pay"
                  :src="require('../../assets/image/payment_' + pay + '.png')">
              </div>
              <div class="price">
                {{$t("common.price")}}: {{ item.floatPrice.toFixed(6) }} {{ item.fiatCurrency }}
              </div>
              <div class="info">
                 {{$t("common.jiaoYi")}} {{ item.owner.tradeCount }} |
                 {{$t("common.trade")}} {{ (item.owner.positiveRate * 100).toFixed(2) + '%' }}
              </div>
              <div class="limit">
                {{$t("common.xianE")}}: {{ item.orderFloorPrice.toFixed(2) }} - {{ item.orderCeilPrice.toFixed(2) }}
                {{ trade === 'buy' ? item.fiatCurrency : item.currency }}
              </div>
              <div class="onLineBox">
                 <span class="circle_onLine " :class="{circle_green: item.owner.isOnline}"></span> 
                  {{ $t('common.online', {msg: $dateAgo(item.owner.signinTime) }) }}
              </div>
            </div>
            <div class="button">
              <van-button type="primary" size="mini">{{tradeText}}</van-button>
            </div>
          </router-link>
        </template>
      </van-cell>
    </van-list>
    <no-data v-if="noData"></no-data>
  </div>
</template>

<script>
import { getAdverList } from 'api/trade'
import { mapGetters } from 'vuex'

export default {
  props: {
    refresh: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      totalList: [],
      loading: false,
      fiatCurrency: '',
      currency: '',
      trade: '',
      pageSize: 10,
      total: 0,
      page: 1,
      isRefresh: false,
      refreshEnd: true
    }
  },
  computed: {
    adverParams() {
     
      return {
        currency: this.currency,
        tradeType: this.trade,
        fiatCurrency: this.fiatCurrency,
        sort: 'priceAsc',
        pageSize: this.pageSize
      }
    },
    finished() {
      return (this.page * this.pageSize) >= this.total
    },
    noData() {
      return !this.loading && this.totalList.length === 0
    },
    tradeText() {
      return this.trade === 'buy' ?  this.$t("common.gouMai") : this.$t("common.chushou")
    },
    ...mapGetters(['getTradeSearch'])
  },
  watch: {
    adverParams: {
      handler(val) {
        this.page = 1
        this.totalList = []
        // 如果切换时还未请求完毕，等待请求完毕后再执行新请求
        if (this.loading) {
          this.refreshEnd = false
        } else this._getAdverList()
      },
      deep: true
    },
    refresh(val) {
      this.isRefresh = true
      this.page = 1
      this.totalList = []
      this._getAdverList(true).then(() => {
        this.isRefresh = false
        this.$emit('refreshEnd')
      })
    },
    // 监听vuex
    getTradeSearch: {
      handler(val) {
        this.fiatCurrency = val.fiatCurrency || 'CNY'
        this.currency = val.currency || 'BTC'
        this.trade = val.tradeType || 'buy'
      },
      deep: true,
      immediate: true
    },
    loading(val) {
      this.$emit('loadingChange', val)
      if (!val && !this.refreshEnd) {
        this.page = 1
        this.totalList = []
        this._getAdverList().then(() => {
          this.refreshEnd = true
        })
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.refreshEnd = true
    },
    _getAdverList() {
      if(!this.isRefresh) this.loading = true;
      document.getElementsByClassName("van-list__loading-text")[0].innerText="";//
      return getAdverList(Object.assign({}, this.adverParams, {page: this.page}))
        .then(data => {
          this.loading = false
          if (data.code === 0) {
            if (this.page === 1) this.totalList = data.data.list
            this.total = data.data.count
            return data.data.list
          }
        })
        .catch((err) => {
          this.loading = false
        })
    },
    // 列表懒加载
    loadList() {
      if (this.finished || this.isRefresh) return
      if (this.timmer) clearTimeout(this.timmer)
      this.page += 1
      this._getAdverList()
        .then(list => {
          if (list) this.totalList = this.totalList.concat(list)
        })
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
.circle_onLine{
    display: inline-block;
    width: 14px;
    height: 14px;
    background: #737272;
    border-radius: 100%;
    vertical-align: text-bottom;
    margin-right: 5px;
}
  .trade-list {
    min-height: 400px;
  }
  .trade-adver {
    display: flex;
    .avatar {
      width: 40px;
      img {
        width: 100%;
        height: 40px;
        border-radius: 50%;
      }
    }
    .main {
      flex: 1;
      padding: 0 8px;
      font-size: $font-size-x2;
      .name {
        img {
          vertical-align: middle;
        }
      }
      .price {
        color: $color-success;
      }
      img {
        width: 18px;
      }
      & > div {
        line-height: 1.6;
      }
    }
    .button {
      width: 50px;
      .el-button {
        position: relative;
        bottom: 0;
      }
    }
  }

  .circle_green{
    background: #4aca85;
  }
</style>
