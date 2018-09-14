<template>
  <div class="adver-list">
      <van-button @click="wanFaBi()" style="margin:15px;margin-bottom:0px; " type="primary" size="small">{{$t('mySendCoin.wanToSend')}}</van-button>
    <van-list
      v-if="faBiList.length > 0"
      v-model="loading"
      :finished="finished"
      @load="loadList"
      :offset="10"
    >
      <van-cell v-for="(item, index) in faBiList" :key="index">
        <template>
          <div
             class="order">
            <div class="main">
              <div class="name">
                <span class="trade">
                 {{$t("mySendCoin.faBiZhongLei")}}： {{ item.currency }}
                </span>
              </div>
              <div class="id">
                 {{$t("mySendCoin.faBiShuLiang")}}： {{ item.amount }}
              </div>

              <div class="time">
                 {{$t("mySendCoin.faBiShiJian")}}： {{ item.createTime }}
              </div>
              <div class="price">
                  {{$t("mySendCoin.status")}}： {{ item.status | statusFilter}}
                    <!-- 如果等于申请中，显示取消按钮 -->
                   <van-button  v-if="item.status=='PUTIN' "  style="margin-left: 7px;"  type="primary" size="mini"  @click="cancelApplication(item)">{{ $t("common.cancel") }}</van-button>
              </div>
            </div>
          </div>
        </template>
      </van-cell>
    </van-list>
    <no-data v-if="noData"></no-data>
    <my-loading v-if="loading"></my-loading>
       <!-- 我要发币 -->
        <van-popup v-model="sendDialog"  >
            
         <div class="faBi_Row">{{$t('mySendCoin.wanToSend')}}</div>
                  <!-- 发币名称 -->
              <van-cell-group class="faBi_name">
                  <van-field v-model="currencyName" clearable :placeholder="$t('mySendCoin.faBiPlaceholder1')" />
              </van-cell-group>
            
                <!-- 发币数量 -->
              <van-cell-group>
                        <van-field v-model="faBiShuLiang" clearable icon="close"
                         @click-icon="faBiShuLiang = ''" 
                         @keyup="onlyNumber" 
                         @blur="onlyNumber" 
                         :placeholder="$t('mySendCoin.faBiPlaceholder2')" />
                        <!-- <van-field v-model="faBiShuLiang" type="number"  placeholder="数量： 1,000,000,000" /> -->
              </van-cell-group>
      
                <p class="faBi_text">{{$t('mySendCoin.faBiTips')}}</p>
           
              <!--  -->
              <div class="submit">
                <van-button type="default" size="small" @click="sendDialog=false">{{$t('common.cancel')}}</van-button>
                <van-button type="primary" size="small" @click="submit">{{$t('common.sure')}}</van-button>
            </div>
        </van-popup>
  </div>
</template>

<script>
import { coinList } from "api/coinList.js";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false, //是否显示加载中提示
      faBiList: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      isRefresh: false,

      // 弹框
      sendDialog: false,
      currencyName: "",
      faBiShuLiang: "1,000,000,000"
    };
  },
  // 状态过滤
  filters: {
    statusFilter: function(value) {
      if (value == "PUTIN") return $vm.$t("mySendCoin.yiShenQing");
      else if (value == "INPROGRESS") return $vm.$t("mySendCoin.jinXingZhong");
      else if (value == "FINISHED") return $vm.$t("mySendCoin.yiWanCheng");
      else if (value == "CANCELLED") return $vm.$t("mySendCoin.yiQuXiao");
    }
  },
  computed: {
    finished() {
      console.log(this.faBiList.length + "nnnnnnn" + this.totalCount);
      return this.faBiList.length >= this.totalCount;
    },
    noData() {
      return !this.loading && this.faBiList.length === 0;
    },
    ...mapGetters(["getSendCoinFlag"])
  },
  created() {
    this._getCoinList();
    this.sendDialog = this.getSendCoinFlag;
  },
  methods: {
    wanFaBi() {
      this.currencyName = this.contact_address = "";
      this.faBiShuLiang = "1,000,000,000";
      this.sendDialog = true;
    },
    numToStr(val) {
      let tmp = num(val);
      if (tmp) {
        let length = ("" + tmp).length;
        let arr = [];
        for (let i = length - 1; i > 0; i--) {}
      }
    },
    onlyNumber(e) {
      let value = e.target.value + ""
      value = value.split(",").join();
      // console.log("onlyNumber",value )
      //得到第一个字符是否为负号
      var t = value.charAt(0);
      //先把非数字的都替换掉，除了数字和.
      value = value.replace(/[^\d\.]/g, "");
      //必须保证第一个为数字而不是.
      value = value.replace(/^\./g, "");
      //保证只有出现一个.而没有多个.
      value = value.replace(/\.{2,}/g, ".");
      //保证.只出现一次，而不能出现两次以上
      value = value
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      //如果第一位是负号，则允许添加
      // if (t == "-") {
      //   obj.value = "-" + obj.value;
      // }
      let dotIndex = value.indexOf('.') 
      let haveDot =  dotIndex > -1 ? true : false
      let tmpValue = ""
      if(haveDot){
        let dotPrev = value.slice(0,dotIndex)
        let dotNext = value.slice(dotIndex+1)
        // console.log(dotPrev,dotNext)
        tmpValue = this.addSysbom(dotPrev) + '.' + this.addSysbom(dotNext)
      }else{
        tmpValue = this.addSysbom(value)
      }
      
      this.faBiShuLiang = tmpValue
    },
    addSysbom(value){
      let tmpArr = value.split("")
      let count = 0
      let tmpValue = ""
      for(var i = tmpArr.length - 1; i >= 0; i-- ){
        count++
        if(count % 3 === 0){
          tmpValue = ',' + tmpArr[i] + tmpValue  
        }else{
          tmpValue = tmpArr[i] + tmpValue
        }
      }
      if(tmpValue.indexOf(',') === 0){
        tmpValue = tmpValue.slice(1)
      }
      return tmpValue
    },
    // 我要发币表单提交
    submit() {
      if (this.currencyName.length > 5) {
        this.$toast.fail(this.$t("mySendCoin.faBiNameXiaoYu5"));
        return;
      }
      if (this.currencyName == "") {
        this.$toast.fail(this.$t("mySendCoin.faBiPlaceholder1"));
        return;
      }
      if (!( /^[0-9a-zA-Z]+$/).test(this.currencyName)) {
        this.$toast.fail(this.$t("mySendCoin.faBiPlaceholder3"));
        return;
      }
 
      if (this.faBiShuLiang == "") {
        this.$toast.fail(this.$t("mySendCoin.faBiPlaceholder2"));
        return;
      }
      
      let tmpfabiAmount = Number(this.faBiShuLiang.split(",").join(""))
      if (tmpfabiAmount <= 0) {
        this.$toast.fail(this.$t("mySendCoin.shuLiangDaYu0"));
        return;
      }
      let data = {};
      data.currency = this.currencyName.toUpperCase();
      data.amount = tmpfabiAmount;

      console.log(data)

      this.$http.post("/issue_currency/submit", data).then(res => {
        if (res.data.code == 0) {
          this.$toast.success(this.$t("mySendCoin.faBiSuccess"));
          this.page = 1; //这里要设置为1，不然可能加载的是某一页的数据，而最新数据是在第一页
          this._getCoinList();
          this.sendDialog = false;
        }
      });
    },
    //   取消申请
    cancelApplication(val) {
      this.$dialog
        .confirm({
          confirmButtonText: this.$t("common.sure"),
          cancelButtonText: this.$t("common.cancel"),
          title: this.$t("mySendCoin.tip4"),
          message: this.$t("mySendCoin.tip1")
        })
        .then(() => {
          let data = {};
          data.issueId = val.issueId;

          this.$http.patch("/issue_currency/cancel", data).then(res => {
            if (res.data.code == 0) {
              this.page = 1; //这里要设置为1，不然可能加载的是某一页的数据，而最新数据是在第一页
              this._getCoinList();
              this.$toast.success(this.$t("mySendCoin.tip2"));
            }
          });
        });
    },

    //加载发币历史
    _getCoinList() {
      if (!this.isRefresh) this.loading = true;
      let dataParam = { page: this.page, pageSize: this.pageSize };
      return coinList(dataParam)
        .then(data => {
          this.loading = false;
          console.log(data.data.list);

          if (data.code !== 0) return;
          if (this.page === 1) this.faBiList = data.data.list;
          this.totalCount = data.data.count;
          return data.data.list;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 列表懒加载
    loadList() {
      if (this.finished || this.isRefresh) return;
      this.page += 1;
      this._getCoinList().then(list => {
        if (list) this.faBiList = this.faBiList.concat(list);
      });
    }
  }
};
</script>

<style>
.faBi_text {
  color: #38f;
  word-break: break-word;
  line-height: 1.7;
  font-size: 13px;
  padding: 0 15px;
  text-align: justify;
}
.faBi_name .van-field__control {
  text-transform: uppercase;
}
.adver-list .van-popup {
  border-radius: 7px;
}
</style>

<style lang="scss" scoped>
.adver-list {
  min-height: 400px;
  font-size: 12px;

  .status {
    width: 120px;
    margin-left: 10px;
    .d1 {
      color: $color-success;
    }
  }
}
.order {
  display: flex;
}

.submit {
  padding: 16px 4px;
  text-align: center;
}
.submit > button {
  margin-right: 20px;
}
.van-popup {
  width: 300px;
}
.faBi_Row {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
}
</style>

