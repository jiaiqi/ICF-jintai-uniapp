// 创建驱动actions可以使方法启动
export default {
  setSysViewCfg: ({commit}, payload) => {
    commit('sysViewCfg', payload.data)
  },
  showHeader: ({commit}) => {
    commit('showHeader')
  },
  hideHeader: ({commit}) => {
    commit('hideHeader')
  },
  showFooter: ({commit}) => {
    commit('showFooter')
  },
  hideFooter: ({commit}) => {
    commit('hideFooter')
  },
  showLoading: ({commit}) => {
    commit('showLoading')
  },
  hideLoading: ({commit}) => {
    commit('hideLoading')
  },
  showMenus: ({commit}) => {
    commit('showMenus')
  },
  hideMenus: ({commit}) => {
    commit('hideMenus')
  },
  showLeftBack: ({commit}) => {
    commit('showLeftBack')
  },
  hideLeftBack: ({commit}) => {
    commit('hideLeftBack')
  },
  logined: ({commit}, payload) => {
    commit('logined', payload)
  },
  setLogined: ({commit}, payload) => {
    commit('setLogined', payload)
  },
	 setUserNo: ({commit}, payload) => {
	  commit('setUserNo', payload)
	},
  selectByUser: ({commit}, payload) => {
    commit('selectByUser', payload)
  },
  setHeadrBar: ({commit}, payload) => {
    commit('setHeadrBar', payload)
  },
  setLoginMsg: ({commit}, payload) => {
    commit('setLoginMsg', payload)
  },
  setAuthorState: ({commit}, payload) => {
    commit('setAuthorState', payload)
  },
  setIsWeixinCient: ({commit}, payload) => {
    commit('setIsWeixinCient', payload)
  },
  setSrvCol: ({commit}, payload) => {
    commit('setSrvCol', payload)
  },
  setShowSearch: ({commit}, payload) => {
    commit('setShowSearch', payload.amount)
  },
	setWxLoginInfoSsos({commit}, payload){
		commit('setWxLoginInfoSsos', payload.amount)
	},
	setWxLoginInfoSsoCk({commit}, payload){
		commit('setWxLoginInfoSsoCk', payload.amount)
	},
	setWxLoginInfoSrvCk({commit}, payload){
		commit('setWxLoginInfoSrvCk', payload.amount)
	},
	setWxTimeLimit({commit}, payload){
		commit('setWxTimeLimit', payload.amount)
	},
	setLoginTime(state,data){
		commit('setLoginTime', data)
	},
	setLegalize(state,data){
		commit('setLegalize', data)
	}
}
