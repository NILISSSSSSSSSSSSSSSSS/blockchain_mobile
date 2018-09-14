import { axiosget, axiospost, axiosput, axiosdelete } from 'api/axios'
import { ServerUrl } from 'api/config'
//找回密码
export function findPw(obj){
    return axiospost('/users/reset_password',obj)
}
//找回密码时的获取验证码
export function findPwGetCode(obj){
    return axiospost('/users/forget_password',obj)
}

//解绑二次验证时获取验证码
export function unbindingGetCode(obj){
    return axiospost('/validation/unbind_send',obj)
}
//解绑二次验证请求
export function unbindingSend(obj){
    return axiospost('/validation/unbind_twophase',obj)
}

//站内转账
//获取转账基本信息
export function getTranInfo(obj){
    return axiosget('/transfer/option_list',obj)
}

export function addrRelation(obj){
    return axiospost('/transfer/relevance_new',obj)
}
//获取手机验证码
export function addrGetCode(obj){
    return axiospost('/transfer/phone_authcode',obj)
}

export function transfer(obj){
    return axiospost("/transfer/submit_new",obj)
}

//交易设置
//获取交易方式
export function getTradeList(obj){
    return axiosget('/users/qrcode',obj)
}
//交易方式的设置
export function tradeTypeSet(obj,config){
    return axiospost('/users/qrcode',obj,config)
}

//全局的配置
export function getConfigParam(obj){
    return axiosget('/index/common',obj)
}
//查询有没有新的订单信息
export function getNewOrderInfo(obj){
   
    return axiospost('/order/query',obj)
}
//快速交易的接口
//获取USDT广告列表
export function getUsdtAdlist(obj){
    return axiosget('/shop/usdtlist',obj)
}
//快速交易时获取验证码
export function getCodeInfast(obj){
    return axiospost("/order/sendmsg",obj)
}
//快速交易的提交
export function commitTradeInfast(obj){
    return axiospost("/order/usdt_create",obj)
}
//app更新
    


export function updateApp(obj){
    var url=$vm.getUrl();
    var baseUrl="https://apk-1256300176.cos.ap-hongkong.myqcloud.com/";

     var cloudeObj=[
         {"ip":"www.otcex.io","file":"updateOTCEX.json"},
         {"ip":"otcos.com","file":"updateOTCOS.json"},
         {"ip":"vietexc.com","file":"updateVIETEXC.json"},
         {"ip":"otcah.com","file":"updateOTCAH.json"},
         {"ip":"jicx.com","file":"updateJICX.json"},
         {"ip":"bibiex.io","file":"updateBIBIEX.json"},
         {"ip":"aaaex.vip","file":"updateAAAEX.json"},
         {"ip":"woq.io","file":"updateWOQ.json"},
         {"ip":"139ex.com","file":"update139ex.json"},
     ]
     for(let i=0;i<cloudeObj.length;i++){
        if(url.includes(cloudeObj[i].ip)){
            return axiosget(`${baseUrl}${cloudeObj[i].file}`,obj)//otcex
         }
     }


}
