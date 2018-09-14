<template>
  <div class="order-list">
    <van-list
      v-model="loading"
      :finished="finished"
      @load="loadList"
      :offset="10"
    >
      <van-cell v-for="(item, index) in totalList" :key="index">
        <template>
          <div
            @click="handleSkip(item.orderCode)"  class="order">
            <div class="main">
              <div class="name">
                <span>{{item.otherUserName}}</span>
                <span class="trade">
                  {{ item.orderType === 'buy' ? $t("common.gouMai") : $t("common.maiChu") }}{{ item.currency }}
                </span>
              </div>
              <div class="id">
                {{$t("common.bianHao")}}：{{item.orderCode}}
              </div>
              <div class="time">
                 {{$t("common.time")}}：{{$timeFormat(item.createTime)}}
              </div>
              <div class="price">
               {{$t("common.danJia")}}：{{ item.unitPrice.toFixed(6) }} {{ item.fiatCurrency }}
              </div>
              <div class="number">
               {{$t("common.shuLiang")}}：{{ item.amount.toFixed(6) }}
              </div>
            </div>
            <div class="status">
              <div class="d1"> {{$t(`status['${item.orderStatus}']`)}} </div>
              <div class="d2">
                {{item.fiatCurrencyAmount.toFixed(6)}}
                {{item.fiatCurrency}}
              </div>
            </div>
          </div>
        </template>
      </van-cell>
    </van-list>
    <no-data v-if="noData"></no-data>
  </div>
</template>

<script>
import { getOrderList } from 'api/orders'
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
      loading: false,
      totalList: [],
      page: 1,
      pageSize: 5,
      totalCount: 0,
      isRefresh: false,
      refreshEnd: true
    }
  },
  computed: {
    ...mapGetters(['getOrderSearch']),
    finished() {
      return (this.page * this.pageSize) >= this.totalCount
    },
    noData() {
      return !this.loading && this.totalList.length === 0
    }
  },
  watch: {
    getOrderSearch: {
      handler(val) {
        this.page = 1
        this.totalList = []
        // 如果切换时还未请求完毕，等待请求完毕后再执行新请求
        if (this.loading) {
          this.refreshEnd = false
        } else this._getOrderList()
      },
      deep: true,
      immediate: true
    },
    refresh(val) {
      this.isRefresh = true
      this.page = 1
      this.totalList = []
      this._getOrderList().then(() => {
        this.isRefresh = false
        this.$emit('refreshEnd')
      })
    },
    loading(val) {
      this.$emit('loadingChange', val)
      if (!val && !this.refreshEnd) {
        this.page = 1
        this.totalList = []
        this._getOrderList().then(() => {
          this.refreshEnd = true
        })
      }
    }
  },
  created() {
  },
  methods: {
    _getOrderList() {
      if(!this.isRefresh) this.loading = true;
      // 加载中几个字不要
      if(document.getElementsByClassName("van-list__loading-text")[0] !==undefined){
       document.getElementsByClassName("van-list__loading-text")[0].innerText="";// 
      }
      
      return getOrderList(Object.assign({}, this.getOrderSearch, {page: this.page}))
        .then(data => {
          this.loading = false
          if (data.code === 0) {
            if(this.page === 1)  this.totalList = data.data.orders
            this.totalCount = data.data.orderCount
            return data.data.orders
          }
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 列表懒加载
    loadList() {
      if (this.finished || this.isRefresh) return
      this.page += 1
      this._getOrderList()
        .then(list => {
          if (list) this.totalList = this.totalList.concat(list)
        })
    },
    handleSkip(orderCode) {
      this.$store.commit('setFooterActive', 0)
      this.$router.push(`/trade/trading/${orderCode}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list {
  min-height: 400px;
  font-size: 12px;
  .trade {
    padding: 2px 4px;
    background-color: $color-success;
    color: #fff;
    font-size: 12px;
  }
  .status {
    width: 120px;
    margin-left: 10px;
    .d1 {
      color: $color-success;
    }
  }
}
.order{
  display: flex;
}
</style>
