<template>
  <div class="marquee" id="marquee">
    <div id="con1">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    speed: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    this.$nextTick()
      .then(() => {
        const box = document.querySelector('#marquee')
        const con1 = document.querySelector('#con1')
        this.timmer = setInterval(()=> {
          this.scrollUp(box, con1)
        }, this.speed)
      })
  },
  destroyed() {
    clearInterval(this.timmer)
  },
  methods: {
    scrollUp(box, con1) {
      if (box.scrollLeft >= con1.clientWidth) {
        box.scrollTop = 0
      } else {
        box.scrollLeft++
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .marquee {
    position: fixed;
    bottom: 60px;
    height: 32px;
    width: 100%;
    margin: 0;
    padding: 8px 0;
    overflow: hidden;

    z-index: 100;
    color: #f60;
    background-color: #fff7cc;

    #con1 {
      display: flex;
      width: 99999px;
      height: 100%;
      overflow: hidden;
    }
  }
</style>

<!--<style lang="scss" scoped>
  .my-marquee {
    position: fixed;
    bottom: 68px;
    left: 0;
    right: 0;
    height: 40px;
    z-index: 100;
    color: #f60;
    padding: 9px 15px;
    font-size: 12px;
    line-height: 1.5;
    background-color: #fff7cc;
  }
</style>-->
