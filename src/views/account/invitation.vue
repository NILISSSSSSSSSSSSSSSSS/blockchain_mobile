<template>
  <div>
    <g-head>
      <van-nav-bar
        :title='$t("account.invitation")'
        left-arrow
        @click-left="onClickLeft"
      />
    </g-head>
    <div class="twoCode" >
      <div class="copy">
        <input :value="address"/>
        <span 
          v-clipboard:copy="address"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError">
          {{$t("account.clickToCopy")}}</span>
      </div>
      <div class="qrcode-content">
        <div class="qrcode" ref="qrcode">
          <qrcode-vue :value="address" :size="size" level="H" v-show="isApp"></qrcode-vue>
          <img src="" alt="" v-show="!isApp" class="web-img" ref="webImg">
        </div>
        <div class="downloadPic" @click="download" v-if="isApp">{{$t("account.clickToDownload")}}</div>
        <div class="longPress" v-else >{{$t("account.longPress")}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
// import html2canvas from 'html2canvas';
// import fileSaver from 'file-saver';
// import domtoimage from 'dom-to-image';
export default{
  data(){
    return{
      address:'', //"https://otcos.com/invite/"+localStorage.inviteCode
      size:"200",
      isApp: true,
      qrShow: true
    }
  },
  components:{QrcodeVue},
  created(){
    console.log(location)
    // console.log(window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '') + "/invite/" + localStorage.inviteCode)
    // 开发模式、线上模式
    if(this.serverIP !==""){
      this.address = this.serverIP + "/invite/" + localStorage.inviteCode
    }else{

      this.address = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '') + "/invite/" + localStorage.inviteCode;
      // this.address = location.host + "/invite/" + localStorage.inviteCode
    } 
    console.log(this.address)
  },
  mounted() {
    this.isApp = localStorage.getItem('isApp') || false;
    var canvas =document.getElementsByTagName("canvas");
    var base64 = canvas[0].toDataURL('image/jpeg'); 
    // console.log(base64);
    this.$refs.webImg.src = base64
  },
  methods:{
    onClickLeft() {
      this.$router.push('/account')
    },
    onCopy(){
      this.$toast(this.$t("wallets.copySuccess"))
    },
    onError(){  },
    download() {
      var _this = this;
      var canvas =document.getElementsByTagName("canvas");
      // console.log(canvas) 
      var imageDataUrl = canvas[0].toDataURL('image/jpeg'); 
      var date=new Date().getTime()
      console.log(date)
      var imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
      var success = function (msg) {
        console.log("success")
        _this.$toast(_this.$t("account.downloadSuccess"))
      };
      var error=function (msg) {
        console.log("error")
      };
      cordova.exec(
        success,
        error,
        'Canvas2ImagePlugin',
        'saveImageDataToLibrary',
        [imageData]
      );
      
      
      // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
      //   console.log("file system open: " + fs.name);
      //   fs.root.getDirectory('otcos', {create: true}, function (dirEntry) {
      //     dirEntry.getFile(date+".jpg", {create: true, exclusive: false }, function(fileEntry) {
      //         console.log("begain to download");
      //         _this.downloadPic(fileEntry, base64, true);
      //     },_this.onErrorCreateFile);
      //   },_this.onErrorGetDir)
      // },_this.onErrorLoadFs);
    },
    // convertBase64UrlToBlob(urlData){
    //   //去掉url的头，并转换为byte
    //   var bytes=window.atob(urlData.split(',')[1]);        
    //   //处理异常,将ascii码小于0的转换为大于0
    //   var ab = new ArrayBuffer(bytes.length);
    //   var ia = new Uint8Array(ab);
    //   for (var i = 0; i < bytes.length; i++) {
    //     ia[i] = bytes.charCodeAt(i);
    //   }
    //   return new Blob( [ab] , {type : 'application/octet-stream'}); //'application/octet-stream'
    // },
    downloadPic(fileEntry, uri, readBinaryData) {
      var _this = this;
      var fileTransfer = new FileTransfer();
      var fileURL = fileEntry.toURL();
      fileTransfer.download( uri,fileURL,function(entry) {
        console.log("download complete: " + entry.toURL());
          if (readBinaryData) { 
            _this.$toast(_this.$t("account.downloadSuccess")+"otcos")
           } else {     }
      },function(error) {
        console.log("upload error code" + error.code);
      },null, // or, pass false
      {}
      );
    },
    onErrorGetDir(){
    console.log("文件夹创建失败！")
    },
    onErrorLoadFs(error) {
      //FileSystem加载失败回调
      console.log("文件系统加载失败！");
    },
    onErrorCreateFile(error) {
      //文件创建失败回调
      console.log("文件创建失败！");
    },

  }
}
</script>

<style lang="scss" scoped>
 .twoCode{width: 100%; display: flex;flex-direction: column;align-items: center}
 .copy{
   width: 90%;
   height: 40px;
   line-height: 40px;
   border: 1px solid #f2f2f2;
   margin: 20px 0;
   display: flex;flex-direction: row;align-items: center;
   text-align: center;
   input{
     border:0;
     height: 38px;
     padding: 0 10px;
     flex: 3;
     text-align: center;
   }
   span{
     flex: 1;
      padding: 0 10px;
      background-color: #f2f2f2;
    }
  }
  .qrcode-content{
    width: 90%;
    padding: 30px 0;
    display: flex;flex-direction: column;align-items: center;
    border-radius: 5px;
    box-shadow: #f2f2f2 0px 0px 10px 5px;
  }
    .web-img{
      display: inline-block;
      width: 200px;
      height: 200px;
    }
  .downloadPic{
    width: 90%;
    padding: 15px;
    text-align: center;
    background-color: #38f;
    color: #ffffff;
    border-radius: 5px;
    margin-top: 30px;
  }

  .longPress{
    padding-top: 20px ;
    color: #f44;
    font-size: 12px;
  }
</style>