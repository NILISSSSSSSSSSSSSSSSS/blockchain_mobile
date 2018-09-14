<template>
  <div class="chat">
    <chat-message class="chat-message"
      :socketId="socketId"></chat-message>
    <chat-input class="chat-input"
      @upload="upload"></chat-input>
  </div>
</template>

<script>
import ChatMessage from './chat-message'
import ChatInput from './chat-input'
import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';
import Vue from 'vue';
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      socketId: ''
    }
  },
  computed: {
    ...mapGetters(['getToken'])
  },
  created() {
    const orderCode = this.$route.params.id;
    if(this.$socket){
      // 如果socket已连接，则重新连接
      console.log("has");
      this.$socket.removeListener('joinok');
      this.$socket.removeListener('joinerr');
      this.$socket.removeListener('msg');
      this.$socket.close();
      // 开发模式、线上模式
      if(this.serverIP !==""){
        this.$socket.io.uri = `${this.serverIP}?token=${this.getToken}&orderCode=${orderCode}`
      }
      else{
      
       this.$socket.io.uri = `${window.location.protocol}//${window.location.host}?token=${this.getToken}&orderCode=${orderCode}`
      } 

      this.$socket.connect();
      this.joinok();
      this.joinerr();
    }else{
      // 建立socket连接
      console.log("new");
      
      if(this.serverIP !==""){
        Vue.use(VueSocketio, socketio(`${this.serverIP}?token=${this.getToken}&orderCode=${orderCode}`));
      }
      else{
        Vue.use(VueSocketio, socketio(`${window.location.protocol}//${window.location.host}?token=${this.getToken}&orderCode=${orderCode}`));//pc版使用
      }
      
      this.$socket.connect();
      this.joinok();
      this.joinerr();
    }
  },
  destroyed () {
    // 退出页面断开连接
    console.log('destory')
    this.$socket.removeListener('joinok');
    this.$socket.removeListener('joinerr');
    this.$socket.removeListener('msg');
    this.$socket.close();
  },
  sockets:{
    connect() {
      console.log('socket connected');
    },
    customEmit(val) {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },
  watch: {
    '$route.params.id': function(val){
      // 订单改变切换连接
      console.log('switch')
      const orderCode = val;
      this.$socket.close();

         // 开发模式、线上模式
      if(this.serverIP !==""){
        this.$socket.io.uri = `${this.serverIP}?token=${this.getToken}&orderCode=${orderCode}`
      }
      else{
       this.$socket.io.uri = `${window.location.protocol}//${window.location.host}?token=${this.getToken}&orderCode=${orderCode}`
      } 
     

      this.$socket.connect();
    }
  },
  methods: {
    // 加入房间成功
    joinok() {
      this.$socket.on('joinok', (data)=>{
        console.log('==========joinok')

        this.socketId = data;
      })
    },
    // 加入房间失败
    joinerr() {
      this.$socket.on('joinerr', ()=>{
        console.log('err')
        this.$socket.close();
        this.$router.push('/user/login');
        this.$toast.fail(this.$t("common.pleaseLogin"))
      })
    },
    // 断开连接
    close: function() {
      this.$socket.on('close', ()=>{
        console.log('close');
      })
    },
    upload: function(file){
      console.log('======up')
      console.log(file)
    },
  },
  components: {
    ChatMessage,
    ChatInput
  },
}
</script>

<style lang="scss" scoped>
.chat {
  height: 400px;
  .chat-input {
    height: 40px;
  }
}
</style>

