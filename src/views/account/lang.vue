<template>
  <div>
    <g-head>
      <van-nav-bar
        :title='$t("account.lang")'
        left-arrow
        @click-left="onClickLeft"
      />
    </g-head>
    <van-radio-group v-model="radio" @change="langChange">
      <van-cell-group>
        <van-cell title="中文" clickable @click="radio = 'cn'">
          <van-radio name="cn" />
        </van-cell>
        <van-cell title="English" clickable @click="radio = 'en'">
          <van-radio name="en" />
        </van-cell>
        <van-cell title="Vietexc" clickable @click="radio = 'vietexc'">
          <van-radio name="vietexc" />
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getCommon} from "api/common"
export default{
  data(){
    return{
      langList: [],
      radio: "cn",
      // currentLang:"cn"
    }
  },
  created() {
     this.radio=localStorage.getItem('language')|| 'cn';
  },
  methods:{
    onClickLeft() {
      this.$router.push('/account')
    },
    langChange(value){
      console.log(value)
      localStorage.setItem('language', value);
      location.reload();
    }
  }
}
</script>

<style>

</style>