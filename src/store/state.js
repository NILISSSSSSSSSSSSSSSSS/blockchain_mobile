const state = {
  // 缓存common的数据
  common: null,
  // 用户token
  token: localStorage.getItem('token') || '',
  // 两步验证信息
  twoStep: localStorage.getItem('setTwoStep' || ""),
  //邀请码
  inviteCode: localStorage.getItem('inviteCode' || ""),
  // 缓存用户信息
  userInfo: null,
  // 交易列表查询参数
  tradeSearch: {},
  // 订单列表参数
  orderSearch: {},
  // 底部当前活动项
  footerActive: localStorage.getItem('footerActive') || 'mine',
  // 是否显示底部
  showFooter: localStorage.getItem('showFooter') || 1,
  // 聊天信息
  messages: [],
  // socket 系统消息
  system: '',
  // 留言信息
  remark: '',
  userId: '',
  appealId: '',
  // 期货url
  futuresUrl: '',
  // 用户id
  _id: localStorage.getItem('_id') || '',
  //订单信息
  newOrderMsg: false,
  unread: 0,
  shouldAbsolute: false,
  //发币的初始弹框
  sendCoinFlag: false
}

export default state
