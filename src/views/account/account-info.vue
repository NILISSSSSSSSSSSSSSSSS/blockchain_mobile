<template>
  <div class="account-info">
    <!-- 登陆后的状态 -->
    <div class="info" v-if="getToken">
      <div class="avatar" v-if="userInfo.name">
        <img v-if="userInfo.avatar" :src="userInfo.avatar">
        <img v-else src="../../assets/image/avatar-default-white.png">
      </div>
      <div class="information">
        <div class="top">{{userInfo.name}}</div>
        <div class="buttom">
          {{$t("account.trade")}} {{ userInfo.tradeCount }} |
          {{$t("account.praise")}}  {{ (userInfo.positiveRate * 100).toFixed(2) + '%' }}
        </div>
      </div>
    </div>
    <!-- 登陆前的状态 -->
    <router-link v-else tag="div" to="/user/login" class="on-login info">
      <div class="avatar">
        <img src="../../assets/image/avatar-default-white.png" alt="">
      </div>
      <div class="information">
        <div class="top">{{$t("account.logAndReg")}} </div>
        <div class="buttom">{{$t("account.readMore")}} </div>
      </div>
    </router-link>
        <!-- 客户服务按钮 -->
        <div class="wolive-form" id="wolive-kefu"  @click="keFuTiaoZhuan()" >
            <img src="../../assets/image/kefu.png" alt="">
          </div>
          
    <my-loading v-if="loading"></my-loading>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserDetail } from 'api/account'

export default {
  data() {
    return {
      userInfo: {},
      loading: false,

    }
  },
  computed: {
    ...mapGetters(['getToken']),
  },
  watch: {
    getToken: {
      handler(val) {
        if (val) this._getUserDetail()
      },
      immediate: true
    }
  },
 
  methods: {
    keFuTiaoZhuan(){
      var url=this.getUrl();
      let visiter_id=null;
      let visiter_name=null; 
      let avatar=""; 
      if(this.getToken){
        visiter_id=this.userInfo.id
        visiter_name=this.userInfo.nickName
          if(this.userInfo.avatar){
            avatar=this.userInfo.avatar; 
          }
        else{
          avatar=url+"/mobile/avatar-default.png" 
        }
      
      }
      else{
        visiter_id=parseInt(Math.random()*(100000000000-1000)+1000);
        visiter_name=`访客${visiter_id}`;
        
        avatar=url+"/mobile/avatar-default.png" 
      }
      location.href='http://kefu.servicevip.net/index/index/home?visiter_id='+visiter_id+'&visiter_name='+visiter_name+'&avatar='+avatar+'&business_id=service&groupid=1';
    },
    _getUserDetail() {
      this.loading = true
      getUserDetail()
        .then(data => {
          if (data.code === 0) {
            this.userInfo = data.data
            if (data.data.avatar) {
              let avatar = new Image()
              avatar.src = data.data.avatar
            }
            // localStorage.inviteCode=data.data.inviteCode
            if (data.data.inviteCode) {
              this.$store.commit('setInviteCode', data.data.inviteCode)
            } 
            this.$store.commit('set_Id', data.data._id)
          }
          else if(data.code === 30003){
              this.$router.push('/user/login');
          }
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
     .wolive-form {
          -webkit-transition: 0.2s ease-out;
        /* transition: 0.2s ease-out; */
        position: fixed;
        /* top: 50%; */
        width: 59px;
        bottom: 60px;
        right: 0px;
        font-size: 12px;
        background-color: #488bff;
        z-index: 9999;
        color: white;
        text-align: center;
        border-radius: 7px;
      img{
        margin-top:4px;
      }
    }

  .info {
    display: flex;
    padding: 24px 16px;
    color: #fff;
    background-color: $color-theme;
    .avatar {
      width: 60px;
      vertical-align: middle;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
    }
    .information {
      flex: 1;
      padding: 4px 16px;
      line-height: 1.8;
      .top {
        font-size: $font-size-x3;
      }
      .buttom {
        font-size: $font-size-x1;
      }
    }
  }
</style>
