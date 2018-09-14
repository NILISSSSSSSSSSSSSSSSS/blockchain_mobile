export const getCommon = (state) => state.common
export const getToken = (state) => state.token
export const getTwoStep = (state) => {
    if(state.twoStep){
        return JSON.parse(state.twoStep)
    }
}
export const getInviteCode = (state) => state.inviteCode
export const getUserInfo = (state) => state.userInfo
export const getTradeSearch = (state) => state.tradeSearch
export const getOrderSearch = (state) => state.orderSearch
export const getFooterActive = (state) => state.footerActive
export const getShowFooter = (state) => Boolean(+state.showFooter)
export const getMessages = (state) => state.messages
export const getSystem = (state) => state.system
export const getRemark = (state) => state.remark
export const getUserId = (state) => state.userId
export const getAppealId = (state) => state.appealId
export const getFuturesUrl = (state) => state.futuresUrl
export const get_Id = (state) => state._id
export const getNewOrderMsg = (state) => state.newOrderMsg
export const getUnread = (state) => state.unread
export const getShouldAbsolute = (state) => state.shouldAbsolute
export const getSendCoinFlag = (state) => state.sendCoinFlag

