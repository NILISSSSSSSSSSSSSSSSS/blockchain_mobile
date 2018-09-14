<template>
  <van-tabbar v-if="getShowFooter"
    id="footer"
    class="footer" v-model="active" @change="handleChange">
    <van-tabbar-item @click="a(item)"
      v-for="(item,index) in footerArr"
      :key="index"
      :icon="item.icon"
      
      :to="item.to"
      v-show="item.show"
      :dot="item.dot"
    >
      {{$t(item.text)}}
    </van-tabbar-item>
    
  </van-tabbar>
</template>

<script>
import {getNewOrderInfo} from 'api/api'
import {mapGetters,mapMutations} from 'vuex'
import { getTranInfo} from "api/api";
import { qhEnter } from 'api/futures'
export default {
  data() {
    return {
      active: 0,
      token: '',
      footerActive:"",
      // dotFlag: false
      orderMsg: [],
      time:null,
      futureAddress:"",
      footerArr: [
        {icon: 'exchange-record', to: '/trade', text: "common.changWai",show: true,dot: false , name: 'outTrade'},
        {icon: 'gold-coin', to: '', text: "common.changNei",show: this.enableFutures ,dot: false, name: 'innerTrade'},
        {icon: 'pending-orders', to: '/fast/trade', text: "common.kuaiSuJiaoYi",show: this.enableUSDT ,dot: false, name: 'fastTrade'},
        {icon: 'pending-payment', to: '/wallets', text: "common.ziChan",show: true,dot: false, name: 'wallet'},
        {icon: 'contact', to: '/account', text: "common.woDe",show: true,dot: this.getUnread, name: 'mine'}
      ]
    }
  },
  computed: {
    ...mapGetters(['getShowFooter', 'getFuturesUrl', 'getUnread', 'getShouldAbsolute', 'getCommon','getFooterActive']),
    enableUSDT() {
      return this.getCommon ? this.getCommon.enableUSDT : false
    },
    enableFutures() {
      return this.getCommon ? this.getCommon.enableFutures : false
    }
  },
  watch: {
     token(val) {
      if (val == "") {
        this.$router.push("/user/login");
        return;
      } else {
        this.getAjaxMsg();
      }
    },
   
    getShouldAbsolute: {
      handler(val) {
        this.$nextTick()
          .then(() => {
            const footer = document.querySelector('#footer')
            if (!footer) return
            if (val) {
              footer.style.position = 'absolute'
            } else {
              footer.style.position = 'fixed'
            }
          })
      },
      immediate: true
    },
    enableFutures(newVal){
      // console.log(newVal)
      this.footerArr[1].show = newVal
    },
    enableUSDT(newVal){
      this.footerArr[2].show = newVal
    },
    getFooterActive(newVal){
      // console.log(newVal)
      this.turnStrToIndex(newVal)
    }
  },
  created() {
    this.token = localStorage.getItem('token') || "";
        console.log(this.token)
    // console.log(this.token)
    if(this.token){
      this._getNewOrderInfo()
      this.getAjaxMsg()
    }
  },
  mounted(){
    this.turnStrToIndex(this.getFooterActive)
  },
  methods: {
    //跳转到场内
    a(item){
      if(item.icon=="gold-coin"){
         this.token = localStorage.getItem('token') || "";
        if(this.token){
          console.log(qhEnter)
          qhEnter()
          .then(data => {
            console.log(data.data.address)
            if (data.code !== 0) return;
            this.$store.commit('setFuturesUrl', data.data.address);
            this.futureUrl=data.data.address;
          
            window.location.href=this.futureUrl;
          })
        }
        else{
           this.$router.push("/user/login");
            this.$store.commit('setFuturesUrl', '')
        }
      }
    },
  
    handleChange(num) {
      //  localStorage.setItem('routeState', $vm.$router.currentRoute.path)
      let name = this.footerArr[num].name
      this.$store.commit('setFooterActive', name)
    },
    turnStrToIndex(newVal){
      let index = this.footerArr.findIndex((item) => {
        return item.name === newVal
      })
      if(index > -1){
        this.active = index
      }else{
        this.active = 0
      }
    },
    getAjaxMsg() {
      var that = this;
      this.time = setInterval(() => {
        this.token = localStorage.getItem('token') || ""
        if (!this.token) {
          clearInterval(this.time);
          return;
        }
        // console.log("timer")
        this._getNewOrderInfo()
      }, 3000);
    },
    _getNewOrderInfo(){
      var that = this;
      getNewOrderInfo().then(res => {
            if (res.code == 0) {
               var notificationLen=res.data.notification.length;
              // 如果另外一边在修改密码，这边就下线
              for(var i=0;i<notificationLen;i++){
                 if(res.data.notification[i].msgType=="relogin" && res.data.notification[i].time>localStorage.getItem('loginTime')){
                    this.$store.commit('setToken', '');
                    localStorage.setItem("loginTime", "");
                    $vm.$toast.fail(this.$t("common.passUpdatePleLogin"));
                    $vm.$router.push('/user/login');
                }
              }

              this.orderMsg = res.data.orders;
              var i;
              var len = this.orderMsg.length;
              var unread = 0;
              for (i = 0; i < len; i++) {
                if (this.orderMsg[i].unread == true) {
                  unread++;
                }
              }
              this.setUnread(unread)
            } else {
               if(res.code=10001){
                  clearInterval(this.time);
                 this.$router.push('/user/login');
               }
            }
          })
          .catch(err => {});
    },
    ...mapMutations({
      // 'setNewOrderMsg':'setNewOrderMsg',
      'setUnread': 'setUnread'
    })
  }
}
</script>

<style lang="scss">
.footer {
    .icon-add {
        .van-tabbar-item__icon {
            font-size: 32px;
        }
    }
}
</style>

<style lang="scss" scoped>
.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
  }
  .show {
    display: flex;
  }
  .hide {
    display: none;
  }

</style>

