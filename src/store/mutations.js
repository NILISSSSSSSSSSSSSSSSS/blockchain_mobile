const mutations = {
  setCommon (state, common) {
    state.common = common
  },
  setToken (state, token) {
    localStorage.setItem('token', token)
    state.token = token
  },
  setTwoStep (state, obj) {
    if(obj){
      obj = JSON.stringify(obj)
    }
    localStorage.setItem('setTwoStep',obj)
    state.twoStep = obj
  },
  setInviteCode (state, obj) {
    localStorage.setItem('inviteCode',obj)
    state.inviteCode = obj
  },
  setUserInfo (state, obj) {
    state.userInfo = obj
  },
  setTradeSearch (state, obj) {
    state.tradeSearch = Object.assign({}, state.tradeSearch, obj)
  },
  setOrderSearch (state, obj) {
    state.orderSearch = Object.assign({}, state.orderSearch, obj)
  },
  setFooterActive (state, number) {
    // console.log(number)
    localStorage.setItem('footerActive', number)
    state.footerActive = number
  },
  setShowFooter (state, num) {
    localStorage.setItem('showFooter', num)
    state.showFooter = num
  },
  updateMessages (state, message) {
    state.messages.push(message)
  },
  setSystem (state, val) {
    state.system = val
  },
  setRemark (state, val) {
    state.remark = val
  },
  setUserId (state, val) {
    state.userId = val
  },
  setAppealId (state, val) {
    state.appealId = val
  },
  setFuturesUrl (state, val) {
    state.futuresUrl = val
  },
  set_Id (state, val) {
    state._id = val
    localStorage.setItem('_id', val)
  },
  setNewOrderMsg(state,val){
    state.newOrderMsg = val
  },
  setUnread(state,num){
    state.unread = num
  },
  setShouldAbsolute(state, bool) {
    state.shouldAbsolute = bool
  },
  setSendCoinFlag(state,bool){
    state.sendCoinFlag = bool
  }
}

export default mutations
