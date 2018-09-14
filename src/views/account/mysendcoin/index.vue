<template>
  <div class="adver-list">
    <g-head>
      <van-nav-bar
        :title='$t("mySendCoin.mysendCoin")'
        left-arrow
        @click-left="onClickLeft"
      />
    </g-head>
    <div class="list">
      <coin-list></coin-list>
    </div>
  </div>
</template>

<script>
import coinList from './coinList'

export default {
  methods: {
    onClickLeft() {
      this.$router.push('/account')
    }
  },
  components: {
    coinList
  }
}
</script>

<style lang="scss" scoped>

</style>
