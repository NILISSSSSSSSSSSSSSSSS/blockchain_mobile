<template>
  <div>
      <g-head>
          <van-nav-bar :title='$t("account.wodeSiMu")' left-arrow @click-left="onClickLeft" />
      </g-head>
      <div class="siMuBox">
        <div onclick='javascript:location.href="http://gac.oyjyb.com"'>GAC{{$t("account.siMuAddress")}}： <span class="siMuAdd">http://gac.oyjyb.com</span></div>
         <!-- <div v-for="(item,index) in biBox"  :key="index" onclick=`javascript:location.href="${item.link}"`>{{item.currency}}{{$t("account.siMuAddress")}}</div> -->
      </div>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        biBox:[{link:"gac.oyjyb.com",currency:"GAC"}]
      }
    },
    methods:{
      onClickLeft() {
            this.$router.push("/user/login");
        },
    }
  }
</script>
<style lang="scss" scoped>
 .siMuBox{
   padding: 10px 15px;
 }
 .siMuBox>div{
    padding: 5px 0;
    font-size: 13px;
 }
 .siMuAdd{
  color: #38f;
 }
</style>