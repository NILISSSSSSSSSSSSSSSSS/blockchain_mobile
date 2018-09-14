<template>
  <div class="offers">
    <g-head>
      <van-nav-bar :title="title" left-arrow @click-left="onClickLeft" />
    </g-head>
    <div v-if="detail.tradeType">
      <user-info :detail="detail"></user-info>
      <trade-input :detail="detail" :adverId="id" class="trade-input"></trade-input>
      <remind></remind>
    </div>

    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import { getAdvertsDetails_pub } from "api/trade";
import UserInfo from "./userInfo";
import TradeInput from "./tradeInput";
import Remind from "./remind";

export default {
  data() {
    return {
      detail: {},
      loading: false,
      id: ""
    };
  },
  computed: {
    title() {
      if (this.detail.tradeType) {
        let trade = this.detail.tradeType === "buy" ? this.$t("common.chushou") : this.$t("common.gouMai");
        return `${trade}${this.detail.currency}`;
      } else return "";
    }
  },
  created() {
    this._getAdvertsDetails();
  },
  methods: {
    onClickLeft() {
      this.$router.push("/trade");
    },
    _getAdvertsDetails() {
      this.id = this.$route.params.id;
      if (!this.id) {
        this.$router.push("/trade");
        return;
      }
      this.loading = true;
      getAdvertsDetails_pub(this.id)
        .then(data => {
          this.loading = false;
          if (data.code === 0) {
            this.detail = data.data;
            this.$store.commit("setShowFooter", 0);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  components: {
    UserInfo,
    TradeInput,
    Remind
  }
};
</script>

<style lang="scss" scoped>
.offers {
  background-color: #eee;
  .trade-input {
    margin: 12px 0;
  }
}
</style>
