<template>
  <div class="wallets">
    <g-head>
      <van-nav-bar
        :left-text="$t('wallets.yiJianFaBi')"
        :title='$t("wallets.ziChan")'
        :right-text='$t("wallets.fuKuan")'
        @click-right="onClickRight"
        @click-left="onClickLeft"
      />
    </g-head>

    <!-- 站内转账 -->
    <div class="hide-wallet zanNeiZhuanZhang">
      <router-link tag="div" to="/wallets/transfer" class="item">
        <!-- <van-icon name="question" class="question" /> -->
        <span> {{$t("wallets.zanNeiZhuanZhang")}}</span>
        <van-icon name="arrow" class="arrow"></van-icon>
      </router-link>
    </div>
    <!-- 隐藏所有 -->
    <div class="hideAll-wallet">
      <span>{{$t("wallets.hideMoney")}}</span>
      <van-switch v-model="hideAll" />
    </div>
    <!-- 隐藏0 -->
    <div class="hide-wallet pos-top">
      <span>{{$t("wallets.hide0Money")}}</span>
      <van-switch v-model="hide" />
    </div>
    <div class="list">
      <wallet-list :hide="hide" :hideAll="hideAll"></wallet-list>
    </div>
    <!-- 转入场内 -->
    <wallet-futures></wallet-futures>
  </div>
</template>

<script>
import WalletList from './wallet-list'
import WalletFutures from './wallet-futures'
import { getBase } from 'api/futures'

export default {
  data() {
    return {
      hide: true,
      hideAll: false,
      isCreateQh: false
    }
  },
  mounted() {
    var url=this.getUrl();
    url.includes('otcah.com') || url.includes('aaaex.vip') || url.includes('bibiex.io') ?  document.getElementsByClassName("van-nav-bar__left")[0].style.display="none" : ""
   
    this.$store.commit('setFooterActive', 'wallet')
    this._getBase()
  },
  created() {
    this.$store.commit("setShowFooter", 1);
  },
  methods: {
    onClickLeft(){
      this.$store.commit("setSendCoinFlag",true)
      this.$router.push('/account/mysendcoin')
    },
    onClickRight() {
      this.$router.push('/wallets/payment')
    },
    _getBase() {
      getBase()
        .then(data => {
          if (data.code !== 0) return
          this.isCreateQh = data.data.isCreateQh
          console.log(this.isCreateQh)
        })
    }
  },
  components: {
    WalletList,
    WalletFutures
  }
}
</script>

<style lang="scss" scoped>
  .hide-wallet,
  .hideAll-wallet {
    // position: fixed;
    top: $header-height;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    padding: 8px;
    height: 48px;
    border-bottom: 1px solid #e5e5e5;
    background-color: #fff;
    .van-switch {
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      line-height: 32px;
      font-size: 14px;
    }
  }
  .yiJianFaBi{
    top:46px;
  }
  .zanNeiZhuanZhang{
    top: 94px;
  }
  .integral {
    top: 142px;
  }
  .hideAll-wallet{
    top: 142px;
  }
  .pos-top {
    top: 190px;
  }
  .item{
    position: relative;
    width: 100%;
    .arrow{
      position: absolute;
      right: 8px;
      top: 8px;
      font-size: 16px;
    }
  }
  .list {
    // margin-top: 190px;
    overflow: scroll;
  }
  .gray {
    color: #999;
  }
</style>
<style>
.wallets .van-nav-bar__left{
  width: auto;
}
</style>


