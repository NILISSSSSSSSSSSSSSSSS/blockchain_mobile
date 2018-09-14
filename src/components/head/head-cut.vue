<template>
  <div class="cut">
    
  </div>
</template>

<script>
export default {
  props: {
    text1: {
      type: String,
      default: ''
    },
    text2: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      select: 1
    }
  },
  watch: {
    select: {
      handler(val) {
        this.$emit('cut', val)
      },
      immediate: true
    }
  },
  methods: {
    cut(num) {
      this.select = num
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>

