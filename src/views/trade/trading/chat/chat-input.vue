<template>
  <div class="chat-input">
    <div class="can">
      <!-- web端上传 -->
      <van-uploader  v-if="!isApp" :after-read="afterRead" :action="actionUrl + '/websocket/uploadimg'" accept="image/png, image/jpeg, image/jpg" multiple
        :max-size="1024 * 1024 * 1" @oversize="oversize"> <van-icon name="photograph" />
      </van-uploader>
      <!-- app上传 -->
      <van-icon v-else  @click="appSend" name="photograph" class="appImg"/>
     
      <van-cell-group>
        <van-field v-model="message"  :placeholder="$t('chat.sendState')" />
      </van-cell-group>
      <div class="send" @click="sendMessage">
        <img src="~assets/image/send.png">
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { upload } from 'api/trade'

export default {
  data() {
    return {
      message: '',
      actionUrl: ''
    }
  },
  computed: {
    ...mapGetters(['getRemark']),
    isApp(){
      return  localStorage.getItem("isApp")=="true" ? true : false
    }
  },
  watch: {
    getRemark(val) {
      const content = {
        msgType: "text",
        context: val
      };
      this.$socket.emit("msg", content);
    }
  },
  created() {
    this.actionUrl = this.serverIP;
  },
  methods: {
    //app端cordova图片参数设置
    setOptions(srcType) {
            var options = {
                // Some common settings are 20, 50, and 100
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                // In this app, dynamically set the picture source, Camera or photo gallery
                sourceType: srcType,
                mediaType: Camera.MediaType.PICTURE
            }
            return options;
        },
    //app端图片读取
    appSend() {
            var that = this;
            var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
            var options = this.setOptions(srcType);
            // console.log('getMYPIC')
            navigator.camera.getPicture(function(imageBase64){
                // console.log('suc')
                var base64 = "data:image/jpeg;base64," + imageBase64;
                var tmpBlob = convertBase64UrlToBlob(base64);
                let isLt2M = tmpBlob.size / 1024 / 1024 ;
                if(isLt2M>1){
                  that.$toast.fail(that.$t("chat.chaoGuo1MB"))
                  return
                }
                console.log("app发送图片"+tmpBlob.size)
                that.allSendImg(tmpBlob)
              
            }, function() {
                console.log('fail')
                that.$toast.fail(that.$t("account.getPictureFail"))
                return 
            }, options);
            function convertBase64UrlToBlob(urlData) {
                var bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte

                //处理异常,将ascii码小于0的转换为大于0
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                }

                return new Blob([ab], { type: "image/png" });
            }
        },
    // web端图片读取
    afterRead(obj) {
      console.log(obj)
      this.allSendImg(obj.file)
    },
    //发送图片
    allSendImg(file){
      console.log("发送图片")
      const formData = new FormData()
      formData.append("img", file);
      upload({url: this.actionUrl, file: formData})
        .then(data => {
          if (data.code === 0) {
            const content = {
              msgType: "img",
              context: data.data
            };
            this.$socket.emit("msg", content);
          } 
        }).catch(err=>{
          this.$toast.fail(this.$t("图片发送失败"))
        })
    },
    // 文件大小超过限制
    oversize() {
      this.$toast.fail(this.$t("chat.chaoGuo1MB"))
    },
    // 发送消息
    sendMessage() {
      if (this.message.trim() === "") return
      const content = {
        msgType: "text",
        context: this.message
      }
      //this.updateSession(content);
      this.$socket.emit("msg", content)
      this.message = ""
    }
  }
}
</script>

<style lang="scss" scoped>
  .chat-input {
    padding: 0 8px;
    position: fixed;
    bottom: 0;
    width: 100%;
    background: white;
    .appImg{
      font-size: 25px ;
      color:black;
      line-height: 40px;
    }
    .can {
      display: flex;
      height: 100%;
    }
    .van-uploader {
      width: 32px;
      .van-icon {
        line-height: 40px;
        font-size: 25px;
      }
    }
    .van-cell-group {
      flex: 1;
    }
    .send {
      position: relative;
      width: 32px;
      img {
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translateY(-50%);
      }
    }
  }
</style>
