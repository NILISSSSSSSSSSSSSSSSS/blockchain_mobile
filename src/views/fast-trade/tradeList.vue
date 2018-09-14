<template>
  <div class="trade-list">
    <div class="list">
      <van-list v-model="loading" :finished="finished" @load="loadList" :offset="10" v-if="totalList.length > 0">
        <van-cell v-for="(item, index) in totalList" :key="index" class="adver-list">
          <template>
            <!-- <router-link :to="'/fast/trade/offers/' + item._id" class="trade-adver"> -->
            <div class="trade-adver" @click="gotoOffers(item._id)">
              <div class="avatar">
                <img v-if="item.owner.avatar" style="border-radius: 50%;" :src="item.owner.avatar">
                <img v-else src="~assets/image/avatar-default.png">
                <div class="button">
                  <van-button type="primary" size="mini">{{tradeText}}</van-button>
                </div>
                <p></p>
              </div>
              <div class="main">
                <div class="name">
                  <span>{{item.owner.name}}</span>
                </div>
                <div class="price">
                  {{$t("common.price")}}: {{ item.usdt_floatPrice ? item.usdt_floatPrice.toFixed(6) : ""}} {{configFiatBi}}
                </div>
                
                <div class="limit">
                  {{$t("common.zuiShao")}}: {{ item.tradeType == 'sell' ? `${(item.usdtFloorPrice + '').indexOf('.') !== -1 ? item.usdtFloorPrice.toFixed(2) : item.usdtFloorPrice}${configFiatBi}` : `${(item.orderFloorPrice + '').indexOf('.') !== -1 ? item.orderFloorPrice.toFixed(2) : item.orderFloorPrice} ${item.currency}` }}
                </div>
                <div class="limit">
                  {{$t("common.zuiDuo")}}: {{ item.tradeType == 'sell' ? `${(item.usdtCeilPrice + '').indexOf('.') !== -1 ? item.usdtCeilPrice.toFixed(2) : item.usdtCeilPrice} ${configFiatBi}` : `${(item.orderCeilPrice + '').indexOf('.') !== -1 ? item.orderCeilPrice.toFixed(2) : item.orderCeilPrice} ${item.currency}` }}
                </div>
              </div>
            </div>
            <!-- </router-link> -->
          </template>
        </van-cell>
      </van-list>
    </div>
    <no-data v-if="noData" style="height: 100%;"></no-data>
  </div>
</template>

<script>
// import { getAdverList } from "api/trade";
import { mapGetters } from "vuex";
import { getUsdtAdlist } from "api/api";

export default {
  props: {
    currencylist: Array,
    refresh: {
      type: Number,
      default: 0
    },
    tradeType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      configFiatBi:"",
      totalList: [],
      loading: false,
      // fiatCurrency: "",
      currency: "",
      trade: "",
      pageSize: 10,
      total: 0,
      page: 1,
      isRefresh: false,
      refreshEnd: true
    };
  },
  computed: {
    adverParams() {
      return {
        currency: this.currency,
        tradeType: this.tradeType,
        sort: "priceAsc",
        pageSize: this.pageSize
      };
    },
    finished() {
      return this.page * this.pageSize >= this.total;
    },
    noData() {
      return !this.loading && this.totalList.length === 0;
    },
    tradeText() {
      return this.tradeType === "buy" ? this.$t("common.maiRu") : this.$t("common.maiChu");
    },
    ...mapGetters(["getTradeSearch"])
  },
  watch: {

    adverParams: {
      handler(val) {
        this.page = 1;
        this.totalList = [];
        // 如果切换时还未请求完毕，等待请求完毕后再执行新请求
        if (this.loading) {
          this.refreshEnd = false;
        } else {
          window.scrollTo(0, 0);
          this._getAdverList();
        }
      },
      deep: true
    },
    refresh(val) {
      this.isRefresh = true;
      this.page = 1;
      this.totalList = [];
      this._getAdverList(true).then(() => {
        this.isRefresh = false;
        // console.log("isRefresh",this.isRefresh)
        this.$emit("refreshEnd");
      });
    },
    
  
    // 监听vuex
    getTradeSearch: {
      handler(val) {
        this.currency = val.currency || "BTC";
      },
      deep: true,
      immediate: true
    },
    //监听 currencylist，如果没有，则默认 BTC
    currencylist: {
　　　　handler(newValue, oldValue) {
           if(!newValue.includes(this.currency)){
             this.currency="BTC"
           }
　　　　},
　　　　deep: true
　　},
    loading(val) {
      // console.log("val",val,this.refreshEnd)
      this.$emit("loadingChange", val);
      if (!val && !this.refreshEnd) {
        this.page = 1;
        this.totalList = [];
        this._getAdverList().then(() => {
          this.refreshEnd = true;
        });
      }
    }
  },
  created() {
    this.configFiatBi= localStorage.getItem("configFiatBi");
    this.init();
  },
  methods: {
    init() {
      this.refreshEnd = true;
    },
    _getAdverList() {
      if (!this.isRefresh) {
        this.loading = true;
      }
      return getUsdtAdlist(
        Object.assign(
          {},
          this.adverParams,
          { page: this.page },
          {
            tradeType: this.adverParams.tradeType === "buy" ? "sell" : "buy"
          }
        )
      )
        .then(res => {
          this.loading = false;
          if (res.code === 0) {
            if (this.page === 1) this.totalList = res.data.list;
            this.total = res.data.count;
            this.$emit("compuHeight", this.totalList.length);
            return res.data.list;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 列表懒加载
    loadList() {
      // console.log(this.finished , this.isRefresh)
      if (this.finished || this.isRefresh) return;

      // console.log('loadLost:>>>>',this.finished , this.isRefresh)
      this.page += 1;
      this._getAdverList().then(list => {
        if (list) {
          this.totalList = this.totalList.concat(list);
          this.$emit("compuHeight", this.totalList.length);
        }
      });
    },
    gotoOffers(id) {
      // console.log(id);
      let currencyInfo = {
        tradeType: this.tradeText,
        currency: this.currency,
        advertiseId: id
      };
      this.$emit("trading", true, currencyInfo);
    }
  }
};
</script>

<style lang="scss" scoped>
.trade-list {
  // min-height: 700px;
  width: 100%;
  box-sizing: border-box;
}
.trade-adver {
  display: flex;
  .adver-list {
    height: 86px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .avatar {
    width: 32px;
    img {
      width: 100%;
      height: 32px;
      border-radius: 50%;
    }
    .button {
      width: 32px;
      .el-button {
        width: 100%;
        position: relative;
        bottom: 0;
      }
    }
  }
  .main {
    flex: 1;
    padding-left: 4px;
    font-size: $font-size-x2;
    .name {
      img {
        vertical-align: middle;
      }
    }
    .price {
      color: $color-success;
    }
    .limit {
      width: 100%;
    }
    img {
      width: 18px;
    }
    & > div {
      line-height: 1.6;
    }
  }
}
</style>
<style>
.button .van-button--mini {
  width: 100%;
}
.trade-list .van-cell {
  padding: 5px 10px;
  padding-right: 5px;
}
</style>

