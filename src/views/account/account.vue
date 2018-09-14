<template>
  <div class="account">
    <g-head class="head">{{$t("common.woDe")}}</g-head>
    <account-info></account-info>
  
    <function-list class="function-list"></function-list>
  </div>
</template>

<script>
import AccountInfo from './account-info'
import FunctionList from './function-list'

export default {
  components: {
    AccountInfo,
    FunctionList
  },
  data() {
    return {
      visiter_id:"",
      visiter_name:"",
      avatar:"",
      business_id:"",
    }
  },
  created() {
    this.$store.commit('setShowFooter', 1)
  },
  method:{
   
  },
  computed: {
   
  },
  mounted(){
    this.$store.commit('setFooterActive', 'mine')
  }
}
</script>

<style lang="scss" scoped>
 
  .account {
    background-color: #eee;
  }
  .head {
    font-size: $font-size-x4;
    color: #fff;
    text-align: center;
    line-height: $header-height;
    background-color: $color-theme;
  }
  .function-list {
    margin-top: 16px;
  }
</style>

