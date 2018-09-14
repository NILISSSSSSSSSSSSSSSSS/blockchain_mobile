<template>
  <div class="adver-list">
    <van-list
      v-if="totalList.length > 0"
      v-model="loading"
      :finished="finished"
      @load="loadList"
      :offset="10"
    >
      <van-cell v-for="(item, index) in totalList" :key="index">
        <template>
          <div
            @click="handleClickAdver(item._id)"  class="order">
            <div class="main">
              <div class="name">
                <span class="trade">
                  {{ item.tradeType === 'buy' ? $t("common.gouMai") : $t("common.maiChu") }}
                  {{ item.currency }}
                </span>
              </div>
              <div class="id">
                {{$t("common.bianHao")}}：{{item._id}}
              </div>
              <div class="time">
                {{$t("common.faBuShiJian")}}：{{$timeFormat(item.createTime)}}
              </div>
              <div class="price">
                {{$t("common.fuDongDanJia")}}：{{ item.floatPrice.toFixed(6) }} {{ item.fiatCurrency }}
              </div>
              <div class="number">
                {{$t("common.jiaoYiXianE")}}：{{ item.orderFloorPrice }} -
                {{item.orderCeilPrice}}
                {{ item.tradeType === 'buy' ? item.currency : item.fiatCurrency}}
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
import { getADList } from 'api/advertisement'

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
    this._getADList()
  },
  methods: {
    _getADList() {
      if(!this.isRefresh) this.loading = true
      return getADList({page: this.page})
        .then(data => {
          this.loading = false
          if (data.code !== 0) return
          if(this.page === 1)  this.totalList = data.data.list
          this.totalCount = data.data.count
          return data.data.list
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 列表懒加载
    loadList() {
      if (this.finished || this.isRefresh) return
      this.page += 1
      this._getADList()
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

