import Vue from 'vue'


Vue.filter('payTypeFilter', function (value) {
  if (value === 'alipay') {
    return $vm.$t("common.zhiFuBao")
  } else if (value === 'paypal') {
    return 'paypal'
  } else if (value === 'wechat') {
    return $vm.$t("zhiFu.weiXinZhiFu")
  } else if (value === 'unionpay') {
    return $vm.$t("zhiFu.yinLianZhiFu")
  }
  return value
})

Vue.filter('statusFilter', function (val) {
  if (val === 'online') {
    return  $vm.$t("advertisement.shangJiaZhong")
  }
  if (val === 'offline') {
    return $vm.$t("advertisement.yiXiaJia")
  }
  if (val === 'delete') {
    return $vm.$t("advertisement.yishanChu")
  }
  return val
})

Vue.filter('transactionsFilter', function(val) {
  if (val === 'advertiseFee') {
    return $vm.$t("trade.guangGaoFabuFei")
  }
  if (val === 'buy') {
    return $vm.$t("trade.jiaoYiMaiRu")
  }
  if (val === 'candy') {
    return $vm.$t("trade.tangGuoFaFang")
  }
  if (val === 'deposits') {
    return $vm.$t("trade.zhangHuChongZhi")
  }
  if (val === 'sell') {
    return $vm.$t("trade.jiaoYiMaiChu")
  }
  if (val === 'tradeFee') {
    return $vm.$t("trade.jiaoYiShouXuFei")
  }
  if (val === 'transfer') {
    return $vm.$t("trade.zhanNeiZhuanZhang")
  }
  if (val === 'transfer_in') {
    return $vm.$t("trade.zhuanRu")
  }
  if (val === 'transfer_out') {
    return $vm.$t("trade.zhuanChu")
  }
  if (val === 'withdraws') {
    return  $vm.$t("trade.zhangHuTiBi")
  }
  return val
})
