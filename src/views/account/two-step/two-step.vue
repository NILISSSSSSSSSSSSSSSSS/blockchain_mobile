<template>
  <div class="two-step">
    <g-head>
      <van-nav-bar
        :title='$t("account.twoVerification")'
        left-arrow
        @click-left="onClickLeft"
      />
    </g-head>
    <van-cell-group>
      <van-field
        autofocus="autofocus"
        v-model="code" :placeholder='$t("account.googleTwoVerification")' @input="_twoVerify" />
    </van-cell-group>
    <div v-if="getTwoStep" class="hint">{{$t("account.pleace")}} {{ $timeFormat(getTwoStep.expire) }} {{$t("account.complete")}}</div>
  </div>
</template>

<script>
import { twoVerify } from 'api/account'
import { mapGetters } from 'vuex'
import { qhEnter } from 'api/futures'
export default {
  data() {
    return {
      code: ''
    }
  },
  computed: {
    ...mapGetters(['getTwoStep'])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!this.getTwoStep) {
        this.onClickLeft()
      }
    },
    onClickLeft() {
      this.$router.push('/user/login')
    },
    _twoVerify() {
      if (this.code.length !== 6) return
      let obj = {
        code: this.code
      }
      if (this.getTwoStep.authMode === 'email') {
        obj.email = this.getTwoStep.email
        obj.authMode = 'email'
      }
      if (this.getTwoStep.authMode === 'phone') {
        obj.phone = this.getTwoStep.phone
        obj.authMode = 'phone'
      }
      twoVerify(obj)
        .then(data => {
          if (data.code === 0) {
            this.$toast(this.$t("account.verificationSuccess"))
            this.$store.commit('setToken', data.data.token)
            localStorage.setItem("loginTime", data.data.loginTime);
            this.$store.commit('setUserInfo', null)
            
            this.tiaoZhuanPanDuan();
          
              // console.log(localStorage.getItem('routeState'))
              // location.href=localStorage.getItem('routeState')
          } else {
            this.code = ''
          }
        })
    },
    
 tiaoZhuanPanDuan(){
      //如果是场内交易
            if(localStorage.getItem("footerActive")=="innerTrade"){
                qhEnter()
                .then(data => {
                  if (data.code !== 0) return
                  this.$store.commit('setFuturesUrl', data.data.address);
                  window.location.href=data.data.address
                })
            }
            //如果不是场内交易
            else{
                let routeState =  $vm.routeState;
                if(routeState){
                  location.href=routeState
                }else{
                  this.$router.push("/trade")
                }
            }
    },
  }
}
</script>

<style lang="scss" scoped>
  .van-cell-group {
    margin: 32px 16px;
  }
  .hint {
    margin: 0 16px;
  }
</style>
