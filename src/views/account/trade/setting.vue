<template>
    <div class="register">
        <g-head>
            <van-nav-bar :title='$t("account.editPayWay")' left-arrow @click-left="onClickLeft" />
        </g-head>

        <van-field center v-model="accountInfo" type="textarea" autosize :label='$t("account.accountInfo")'>
        </van-field>

        <van-cell :title='$t("account.uploadQrCcode")' class="photo-box">
            <van-uploader :after-read="onRead"  class="uploader" :max-size="MAX_SIZE" @oversize="overSize" v-if="!isApp">
                <!-- <van-icon name="photograph" class="photo" /> -->
                <van-button type="primary" size="mini" class="photo" @click="onRead">{{$t("account.clickUpload")}}</van-button>
            </van-uploader>
            <van-button type="primary" size="mini" class="photo" @click="upload" v-else>{{$t("account.clickUpload")}}</van-button>
        </van-cell>
        <div class="img-box" v-if="uploadFile" @click="preview">
            <img :src="uploadFile" alt="">
        </div>
        <van-cell>
            <van-checkbox v-model="isOrderShow">{{$t("account.showInOrder")}}</van-checkbox>
        </van-cell>
        <van-cell>
            <van-button type="primary" class="button" size="normal" @click="submit">{{$t("account.submit")}}</van-button>
        </van-cell>
    </div>
</template>

<script>
import { getTradeList, tradeTypeSet } from "api/api";
import { ImagePreview } from "vant";
// 2097152

export default {
    data() {
        return {
            payType: "",
            accountInfo:
                this.$t("account.name")+"\n"+this.$t("account.bank")+"\n"+this.$t("account.bankBranch")+"\n"+this.$t("account.bankNumber"),
            uploadFile: "",
            isOrderShow: false,
            fileTmp: "",
            isApp: false,
            MAX_SIZE : 2097152
        };
    },
    computed: {},
    created() {
        this.isApp = localStorage.getItem("isApp") || ""
        console.log(this.isApp)
        this.payType = this.$route.params.payType;
        // console.log(this.payType)
        this._getTradeList();
    },
    destroyed() {},
    methods: {
        onClickLeft() {
            this.$router.push("/account/tradeConfig");
        },
        _getTradeList() {
            if (!this.payType) {
                this.$toast.fail(this.$t("account.getTradeWayFail"));
                this.$router.push("/account/tradeConfig");
                return;
            }
            getTradeList({
                payType: this.payType
            }).then(res => {
                if (res.code == 0) {
                    let data = res.data;
                    this.uploadFile = data.uploadfile;
                    this.isOrderShow = data.isOrderShow;
                    if (data.accountInfo) {
                        this.accountInfo = data.accountInfo;
                    }
                }
            });
        },
        submit() {
            // console.log(this.payType)
            let formData = new FormData();
            if (this.fileTmp) {
                if (this.isApp) {
                    formData.append("uploadfile", this.fileTmp);
                } else {
                    formData.append("uploadfile", this.fileTmp.file);
                }
            }
            // console.log(this.isApp,this.fileTmp)
            if (this.accountInfo) {
                formData.append("accountInfo", this.accountInfo);
            }
            formData.append("isOrderShow", this.isOrderShow);
            formData.append("payType", this.payType);

            let config = {
                "Content-Type": "multipart/form-data"
            };
            tradeTypeSet(formData, config).then(res => {
                if (res.code == 0) {
                    this.$toast.success(this.$t("account.SetUpSuccess"));
                    this.$router.push("/account/tradeConfig");
                }
            });
        },
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
        upload() {
            var that = this;
            var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
            var options = this.setOptions(srcType);
            // console.log('getMYPIC')
            navigator.camera.getPicture(function(imageBase64){
                // console.log('suc')
                var base64 = "data:image/jpeg;base64," + imageBase64;
                var tmpBlob = convertBase64UrlToBlob(base64);
                let isLt2M = tmpBlob.size / 1024 / 1024 < 2;
                if(isLt2M){
                    that.uploadFile = base64
                    // console.log(this.fileTmp)
                }else{
                    that.$toast.fail(this.$t("account.lessThan2M"))
                    return
                }
                that.fileTmp = tmpBlob
            }, function() {
                console.log('fail')
                that.$toast.fail(this.$t("account.getPictureFail"))
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
        onRead(file) {
            var that = this;
            // console.log('web');
            // console.log(file)
            // console.log('web ---over')
            if(file){
                this.fileTmp = file;
                var reader = new FileReader();
                reader.readAsDataURL(file.file);
                reader.onload = function(e) {
                    that.uploadFile = e.target.result;
                };
            }
        },
        overSize(){
            this.$toast.fail(this.$t("account.lessThan2M"))
        },
        preview() {
            ImagePreview([this.uploadFile]);
        }
    }
};
</script>

<style lang="scss" scoped>
.register {
    .photo-box {
        .uploader {
            margin-right: 10px;
        }
        .photo {
            // font-size: 16px;
            width: 60px;
        }
    }
    .img-box {
        width: 200px;
        height: 200px;
        margin: 5px auto;
        border: 1px solid #ccc;
        overflow: hidden;
        img {
            width: 100%;
        }
    }
    .button {
        width: 100%;
    }
}
</style>
