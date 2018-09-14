<template>
  <div class="head">
    <slot></slot>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .head {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 46px;
    z-index: 100;
  }
</style>
