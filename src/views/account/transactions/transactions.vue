<template>
  <div class="adver-list">
    <g-head>
      <van-nav-bar
        :title='$t("account.capitalFlow")'
        left-arrow
        @click-left="onClickLeft"
      />
    </g-head>
    <div class="list">
      <list></list>
    </div>
  </div>
</template>

<script>
import List from './list'

export default {
  methods: {
    onClickLeft() {
      this.$router.push('/account')
    }
  },
  components: {
    List
  }
}
</script>

<style lang="scss" scoped>

</style>
