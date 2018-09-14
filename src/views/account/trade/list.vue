<template>
  <div class="register">
    <g-head>
      <van-nav-bar :title='$t("account.tradeSetting")' left-arrow @click-left="onClickLeft" />
    </g-head>

    <van-list>
        <van-cell is-link v-for="item in tradeList" :key="item.paytype" @click="tradeSet(item)">
            <div class="item">
                <span class="name">{{$t("account.tradeWay")}}</span>
                <span class="val">{{item.paytype}} / {{item.paytype | payTypeFilter}}</span>
                <span class="status">{{item.isSet ? $t("account.alreadySet") : $t("account.notSet")}}</span>
            </div>
        </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getTradeList } from "api/api"

export default {
    data() {
        return {
            tradeList: []
        };
    },
    computed: {
    },
    created() {
        this._getTradeList()
    },
    destroyed() {
    },
    methods: {
        onClickLeft() {
            this.$router.push("/account");
        },
        tradeSet(item){
            this.$router.push({
                path: `/account/tradeSetting/${item.paytype}`
            })
        },
        _getTradeList(){
            getTradeList({
                payType: 'all'
            }).then((res) => {
                if(res.code == 0){
                    this.tradeList = res.data
                }
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.register {
    .item{
        display: flex;
        justify-content: space-between;
        .name{
            margin-right: 20px;
        }
        .status{
            margin-right: 6px;
        }
    }
}
span.val {
    flex: 1;
    padding-left: 2%;
}
</style>
