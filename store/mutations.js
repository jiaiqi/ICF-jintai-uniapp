// import { HEAD_SHOW_SUCCESS, HEAD_SHOW_FAIL, HIDE_LOADING, SHOW_LOADING, FOOTER_HIDE, FOOTER_SHOW, ON_LOGIN } from './type'
// 创建基本状态
import getters from './getters'

const state = {
	/**
	 * 是否需要强制登录
	 */
	forcedLogin: false,
	hasLogin: false,
	userName: "",
	openid:null, // 用户openid
  headShow: true,   // 是否显示头部
  loading: false,   // 是否显示loading
  footerShow: true,   // 是否显示底部导航
  showMenus: false,    // 是否显示菜单
  showLeftBack: false,  // 是否显示返回
  AuthorState: false,  // 授权状态
  isWeixinCient: false, // 是否在微信
	legalize:false, //是否认证用户
  userInfo: {
    logined: false,   // 授权登陆状态 true | false 
    user_info: {
      user_no: '',
      dept_no: '',
      email: '',
      mobile: '',
      user_disp: '',
      real_name: ''
    }
  },
  sysViewCfg: Object, // 系统基本配置信息 logo | 名称
  srvCol: [], // 组件共享的srv_col
  templateCfg: {}, //
  loginMsg: {      // 授权登陆服务器信息
    bxssocookieid: '',
    listdomain: []
  },
  parentMenu: [],  // 模块数据
  openMenu: [],
  headrBar: {
    buttons: [],
    menus: [],
    showMenus: false
  }, // 表头按钮
  showSearch: false,
	ssosessionid:"", //SSO会话信息
	bxssocookieid:"", //SSO登录成功票据信息
	BXSERVERCOOKIEID:"", // 后台会话信息
	timeLimit:Number,
	loginTime:Number
}

const mutations = {
	login(state, userName) {
	    state.userName = userName || '新用户';
	    state.hasLogin = true;
	},
	logout(state) {
	    state.userName = "";
	    state.hasLogin = false;
	},
  sysViewCfg (state, data) {
    state.sysViewCfg = data
  },
  showHeader (state) {
    state.headShow = true
  },
  hideHeader (state) {
    state.headShow = false
  },
  showFooter (state) {
    state.footerShow = true
  },
  hideFooter (state) {
    state.footerShow = false
  },
  showLoading (state) {
    state.loading = true
  },
  hideLoading (state) {
    state.loading = false
  },
  showMenus (state) {
    state.showMenus = true
  },
  hideMenus (state) {
    state.showMenus = false
  },
  showLeftBack (state) {
    state.showLeftBack = true
  },
  hideLeftBack (state) {
    state.showLeftBack = false
  },
	setUserNo(state,userNo){
		state.userInfo.user_info=userNo
	},
  setLogined (state, logined) {
    state.userInfo.logined = logined
  },
  setLoginMsg (state, loginMsg) {
    if (loginMsg.amount.bxssocookieid) {
      state.loginMsg.bxssocookieid = loginMsg.amount.bxssocookieid
      state.loginMsg.listdomain = loginMsg.amount.listdomain
    } else {
      state.loginMsg.bxssocookieid = ''
      state.loginMsg.listdomain = []
    }
  },
  selectByUser (state, datas) {
    state.parentMenu = datas.amount
  },
  setHeadrBar (state, list) {
    state.headrBar = list.data
  },
  setAuthorState (state, data) {
    state.AuthorState = data
  },
  setIsWeixinCient (state, data) {
    console.log('当前微信状态' + data)
    state.isWeixinCient = data
  },
  setSrvCol (state, data) {
    state.srvCol.push(data)
  },
  delSrvCol (state, data) {
    let fils = state.srvCol.filter(item => item.service_name !== data)
    state.srvCol = fils
  },
  setShowSearch (state, data) {
    state.showSearch = data
  },
	setWxLoginInfoSsos(state,data){
		state.ssosessionid = data
	},
	setWxLoginInfoSsoCk(state,data){
		state.bxssocookieid = data
	},
	setWxLoginInfoSrvCk(state,data){
		state.BXSERVERCOOKIEID = data
	},
	setWxTimeLimit(state,data){
		state.timeLimit = data
	},
	setLoginTime(state,data){
		state.loginTime = data
	},
	setLegalize(state,data){
		state.legalize = data
	}
}

export default {
  state,
  mutations,
  getters
}
