<template>
    <div id="app" ref="app">
        <router-view/>
        <g-footer></g-footer>
        <!-- <MyLoading v-show="globalShow" /> -->
    </div>
</template>

<script>
import GFooter from "components/footer/footer";
import MyLoading from 'components/loading/loading'
import { getConfigParam, updateApp } from "api/api";
import { getCommon } from "api/common";

export default {
  data() {
    return {
      selectPhoneCode: true,
      bottom: "",
      globalShow: false
    };
  },
  components: {
    GFooter,
    MyLoading
  },
  created() {
    this._getCommon()
  },
  mounted() {
    var _this = this;
    document.addEventListener(
      "deviceready",
      function() {
        localStorage.setItem("isApp", "true");
        _this.updateApk(); //打包成apk需要解开
      },
      false
    );
  },
  methods: {
    // 将common存入vuex
    _getCommon() {
      getCommon("yes").then(res => {
        if (res.code === 0) {
          let str = res.data || "";
          if (str) {
            document.title = str.siteName || "";
          }
          localStorage.setItem("systemConfig", JSON.stringify(str));
        }
      });
    },

    updateApk() {
      var _this = this;
      updateApp().then(data => {
        console.log(data.version+"::"+this.Version);
        if (data.version > this.Version) {
          console.log("开始Apk更新")
          this.$dialog
            .confirm({
              title: this.$t("common.jianCeGengXin"),
              message: this.$t("common.jianCeGengXin1")
            })
            .then(() => {
              console.log("ok");
              window.requestFileSystem(
                window.TEMPORARY,
                5 * 1024 * 1024,
                function(fs) {
                  console.log("file system open: " + fs.name);
                  fs.root.getFile(
                    "blockwallet.apk",
                    { create: true, exclusive: false },
                    function(fileEntry) {
                      console.log("fileEntry是"+fileEntry)
                      fileEntry.remove(function() {
                        console.log("File successufully removed.");
                        _this.downloadApk(fileEntry, data.appUrl, true);
                      }, _this.onErrorRemoveFile);
                    },
                    _this.onErrorCreateFile
                  );
                },
                _this.onErrorLoadFs
              );
            })
            .catch(() => {
              console.log("cancel");
            });
        }
      });
    },
    downloadApk(fileEntry, uri, readBinaryData) {
      console.log("下载apk")
      var _this = this;
      var fileTransfer = new FileTransfer();
      var fileURL = fileEntry.toURL();
      fileTransfer.download(
        uri,
        fileURL,
        function(entry) {
          console.log("Successful download...");
          console.log("download complete: " + entry.toURL());
          if (readBinaryData) {
            // Read the file...
            _this.openApk(entry.toURL());
          } else {
            // Or just display it.
            // displayImageByFileURL(entry);
          }
        },
        function(error) {
          console.log("download error source " + error.source);
          console.log("download error target " + error.target);
          console.log("upload error code" + error.code);
        },
        null, // or, pass false
        {}
      );
    },
    openApk(toURL) {
      console.log("打开apk")
      var _this = this;
      setTimeout(() => {
        cordova.plugins.fileOpener2.open(
          toURL, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
          "application/vnd.android.package-archive",
          {
            error: function(e) {
              console.log(
                "Error status: " + e.status + " - Error message: " + e.message
              );
            },
            success: function() {
              console.log("file opened successfully");
            }
          }
        );
      }, 2000);
    },
    onErrorLoadFs(error) {
      //FileSystem加载失败回调
      console.log("文件系统加载失败！");
    },
    onErrorCreateFile(error) {
      //文件创建失败回调
      console.log("文件创建失败！");
    },
    onErrorRemoveFile() {
      console.log("文件删除失败！"); //文件删除失败回调
    }
  }
};
</script>

<style lang="scss">
@import "~assets/style/index.scss";
#app {
  padding-top: $header-height;
  padding-bottom: $footer-height; // overflow: auto;
  // height: 100%;
}
</style>
<style>
html,
body {
  /* height: 100%; */
  width: 100%;
}
</style>

<style>
.ways .van-tab {
  background-color: #f2f2f2;
}

.ways .van-tabs__nav-bar {
  background-color: transparent;
}

.ways .van-tab--active {
  background-color: #ffffff;
  color: #38f;
}
</style>