<template>
  <div class="chat-message" ref="chatMessage">
    <div class="messages">
      <div class="item clearfix"
        v-for="(item, index) in messages" :key="index">
        <div class="time">{{$timeFormat(item.time)}}</div>

        <div v-if="item.msgType === 'text'">
          <div v-if="item.userId === userId" class="self">
            <span class="message">{{item.context}}</span>
            <img :src="item.avatar?item.avatar:defaultAvatar">
          </div>
          <div v-else class="other">
             <img :src="item.avatar?item.avatar:defaultAvatar">
             <span class="message">{{item.context}}</span>
          </div>
        </div>

        <div v-if="item.msgType === 'system'" class="info">
          <span class="message">{{systemInfo(item.context)}}</span>
        </div>

        <div v-if="item.msgType === 'img'">
          <div v-if="item.userId === userId" class="self">
            <span class="message">
              <img style="width: 100%;" :src="item.context">
            </span>
            <img :src="item.avatar?item.avatar:defaultAvatar">
          </div>
          <div v-else class="other">
             <img :src="item.avatar?item.avatar:defaultAvatar">
             <span class="message">
               <img style="width: 100%;" :src="item.context">
             </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTradeDetails } from 'api/trade'
import { systemConfigMixins } from "mixins/mixin"

export default {
  mixins: [systemConfigMixins],
  props: {
    socketId: String
  },
  data() {
    return {
      messages: [],
      defaultAvatar: require('../../../../assets/image/avatar-default.png'),
      chatRecord: [],
      userId: ''
    }
  },
  computed: {
    ...mapGetters(['getMessages'])
  },
  created() {
    this.getRecord();
    this.getMsg();
    //切换前后台 修改document title
    var hiddenProperty = 'hidden' in document ? 'hidden' :
        'webkitHidden' in document ? 'webkitHidden' :
        'mozHidden' in document ? 'mozHidden' :
        null;
    var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
    var onVisibilityChange = function(){
        if (!document[hiddenProperty]) {
            if(this.systemConfig && this.systemConfig.siteName){
              document.title = this.systemConfig.siteName
            }
            else{
              document.title =""
            }
            
        }
    }
    document.addEventListener(visibilityChangeEvent, onVisibilityChange);
  },
  watch: {
    '$route.params.id': {
      handler: function(){
        this.messages = [];
        this.chatRecord = [];
        this.getRecord();
      }
    },
    // 出现新消息滚动到底部
    messages: {
      handler(val) {
        this.$nextTick().then(() => {
          this.toBottom(this.$refs.chatMessage)
        })
      },
      deep: true
    }
  },
  methods: {
    // 将dom滚动到底部
    toBottom(el) {
      el.scrollTop = el.scrollHeight - el.clientHeight
    },
    // 获取消息
    getMsg() {
      // socket msg事件
      this.$socket.on('msg', (data)=>{
        console.log("发送新消息")
        console.log(this.socketId)
        if(document.visibilityState && document.visibilityState == 'hidden'){
          document.title = this.$t("chat.msg1");
        }
        if(data.from != this.socketId){
          let title = '';
          let options = {};
          if(data.msgType == 'system'){
            title = this.$t("chat.msg0")
            options = {body: data.context};
          }else if(data.msgType == 'img'){
            title = data.nickName;
            options = {icon: data.avatar?data.avatar:this.defaultAvatar, body: '[图片]'};
          }else{
            title = data.nickName;
            options = {icon: data.avatar?data.avatar:this.defaultAvatar, body: data.context};
          }
        }
        console.log(data)
        // 接收到socket消息更新消息列表，如果是系统消息则更新状态
        this.messages.push(Object.assign({}, data, {
          userId: data.from
        }))
     
        if(data.msgType === 'system') {
          // 通过系统消息通知状态更新
          this.$store.commit('setSystem', data.context)
          if (data.context === 'appeal') {
            this.$store.commit('setAppealId', data.userId)
          }
        }
      })
    },
    // 获取历史消息
    getRecord() {
      const route = this.$route;
      this.orderCode = route.params.id
      getTradeDetails({id: this.orderCode})
        .then(data => {
          if (data.code === 0) {
            this.chatRecord = data.data.chat;
            this.messages = this.chatRecord.concat([])
            for (let i of this.messages.concat([]).reverse()) {
              if (i.msgType === 'system' && i.context === 'appeal') {
                this.$store.commit('setAppealId', i.userId)
                break
              }
            }
            // 用于判断消息是否是本人所发
            this.userId = data.data.userId;
            this.$store.commit('setUserId', this.userId)
          }
        })
    },
    // 翻译系统消息
    systemInfo(context) {
      if(context == 'pay_ok'){
        return this.$t("chat.msg2");
      }else if(context == 'cancel_order'){
        return this.$t("chat.msg3");
      }else if(context == 'coin_ok'){
        return this.$t("chat.msg4");
      }else if(context == 'delay'){
        return this.$t("chat.msg5");
      }else if(context == 'appeal'){
        return this.$t("chat.msg6");
      } else if (context === 'appeal_cancel') {
        return this.$t("chat.msg7");
      }else{
        return context
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-message {
  background-color: #eee;
  height: 360px;
  overflow-y: scroll;
  .messages {
    padding: 16px 8px;
    .time {
      text-align: center;
    }
    .self, .other {
      img {
        width: 30px;
        vertical-align: middle;
      }
      .message {
        position: relative;
        display: inline-block;
        padding: 10px;
        max-width: 70%;
        border-radius: 4px;
        background-color: #b2e281;
        word-break: break-all;
        vertical-align: top;
        line-height: 1.2;
        &::before {
          content: " ";
          position: absolute;
          top: 9px;
          right: 100%;
          border: 6px solid transparent;
          border-right-color: #b2e281;
        }
      }
    }
    .self {
      text-align: right;
      .message {
        margin-right: 6px;
        text-align: left;
        &::before {
          left: 100%;
          border: 6px solid transparent;
          border-left-color: #b2e281;
        }
      }
    }
    .other {
      .message {
        margin-left: 6px;
      }
    }
    .self, .other, .info {
      margin: 12px 0;
    }
    .info {
      text-align: center;
      .message {
        display: inline-block;
        padding: 10px;
        line-height: 1.2;
        word-break: break-all;
        max-width: 70%;
        background-color: #fdf6ec;
        color: #e6a23c;
        border-radius: 4px;
      }
    }
  }
}
</style>
