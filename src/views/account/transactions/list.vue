<template>
  <div class="adver-list">
    <van-list
      v-if="totalList.length > 0"
      v-model="loading"
      :finished="true"
      @load="loadList"
      :offset="10"
    >
      <van-cell v-for="(item, index) in totalList" :key="index">
        <template>
          <div class="order">
            <div class="main">
              <div class="name">
                <span class="trade">
                  {{ item.type | transactionsFilter }}
                </span>
              </div>
              <div v-if="item.type === 'transfer_in' || item.type === 'transfer_out'">
                {{$t("account.nickname")}}: {{ item.destNickName }}
              </div>
              <div class="id" v-else>
                {{$t("account.detailed")}}：
                <span v-if="item.tradeHash">{{item.tradeHash}}</span>
                <span v-else-if="item.orderCode">{{item.orderCode}}</span>
                <span v-else-if="item.refId">{{item.refId}}</span>
                <del v-else-if="item.poolId">&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;</del>
              </div>
              <div class="time">
                {{$t("account.releaseTime")}}：{{$timeFormat(item.createTime)}}
              </div>
              <div class="price">
                {{$t("account.amount")}}：
                <span v-if="item.amount">{{item.amount.toFixed(6) + ' ' + item.currency}}</span>
                <span v-if="item.currencyAmount">{{item.currencyAmount.toFixed(6) + ' ' + item.currency}}</span>
              </div>
            </div>
          </div>
        </template>
      </van-cell>
    </van-list>
    <no-data v-if="noData"></no-data>
    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import { transactions } from 'api/account'

export default {
  data() {
    return {
      loading: false,
      totalList: [],
      page: 1,
      pageSize: 5,
      totalCount: 0,
      isRefresh: false
    }
  },
  computed: {
    finished() {
      return (this.page * this.pageSize) >= this.totalCount
    },
    noData() {
      return !this.loading && this.totalList.length === 0
    }
  },
  created() {
    this._transactions()
  },
  methods: {
    _transactions() {
      if(!this.isRefresh) this.loading = true
      return transactions({})
        .then(data => {
          this.loading = false
          if (data.code !== 0) return
          this.totalList = data.data
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 列表懒加载
    loadList() {
      if (this.finished || this.isRefresh) return
      this.page += 1
      this._transactions()
        .then(list => {
          if (list) this.totalList = this.totalList.concat(list)
        })
    },
    handleClickAdver(id) {
      this.$router.push(`/advertisement/detail/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.adver-list {
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

