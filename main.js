import Vue from 'vue'
import App from './App'
import '@/common/uni.css'
import api from '@/common/api.js' // 导入api清单
import common from '@/common/common.js' // 公共方法
import flyio from '@/common/wx.js' // 引入flyio 微信小程序使用
import flyioh from 'flyio' // 引入flyio 其他h5 使用
import store from '@/store/index.js' // 引入vuex 管理数据状态
// import config from '@/common/config' // flyio 请求公共配置
// import store from './store'
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
let fly = new flyio
// let flyh = new flyioh

Vue.config.productionTip = false

Vue.prototype.$api = api    // api挂载到vue的proto对象上原型属性
Vue.prototype.$store = store
Vue.prototype.$http = fly    // 小程序请求
Vue.prototype.$httph = flyioh  // 公众号请求

Vue.component('page-head', uniNavBar)

Vue.use(common)

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()

fly.interceptors.request.use((request)=>{
    //给所有请求添加自定义header
	uni.getSystemInfo({
		success: function (res) {
			if(res.version === undefined){
				request.headers.crossDomain = true,
				request.headers.xhrFields = {
					withCredentials: true
				}
			}
		},
	})
  
	request.timeout = 20000;
	let bxAuthTicket = uni.getStorageSync("bxAuthTicket")
	let outTime = uni.getStorageSync("outTime")
	let date = new Date().getTime()
	let isExpired = outTime < date
	console.log("isExpired",isExpired,outTime,date,outTime - date)
	let urlstr = request.url
	// request.url = request.url + ";BXSERVERCOOKIEID=" + srvCk
	let len = urlstr.lastIndexOf('cn/') + 3
	//console.log(len)
	let lens = urlstr.indexOf(';')
	//console.log(lens)
	let ls = urlstr.lastIndexOf('?')
	let apiPath = null
	if(lens > 0){
		apiPath = urlstr.slice(len, lens + 1)
	}else if(ls > 0){
		apiPath = urlstr.slice(len, ls)
	}else {
		apiPath = urlstr.slice(len,urlstr.length)
	}
	
	if(!isExpired){
		if(bxAuthTicket){
			request.headers.bx_auth_ticket = bxAuthTicket
		}
		return request
	}else{
		uni.reLaunch({
		    url: '../login/login'
		});
	}
})

// 添加响应拦截器
fly.interceptors.response.use((res) => {
    // 对响应数据做些事
    
    return res
}, (error) => {
    return Promise.reject(error)
})