<template>
  <div class="loading">
    <van-loading type="spinner" color="white" />
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .loading {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 100px;
    height: 100px;
    background-color: #7c7c7c;
    border-radius: 6px;
    .van-loading {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>

