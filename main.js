import Vue from 'vue'
import App from './App'
import '@/common/uni.css'
import api from '@/common/api.js' // 导入api清单
import common from '@/common/common.js' // 公共方法
import flyio from '@/common/wx.js' // 引入flyio 微信小程序使用
import flyioh from 'flyio' // 引入flyio 其他h5 使用
import store from '@/store/index.js' // 引入vuex 管理数据状态
// import config from '@/common/config' // flyio 请求公共配置
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
let fly = new flyio

Vue.config.productionTip = false

Vue.prototype.$api = api // api挂载到vue的proto对象上原型属性
Vue.prototype.$store = store
Vue.prototype.$http = fly // 小程序请求
Vue.prototype.$httph = flyioh // 公众号请求

Vue.component('page-head', uniNavBar)

Vue.use(common)

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()

fly.interceptors.request.use((request) => {
  //给所有请求添加自定义header
  uni.getSystemInfo({
    success: function(res) {
      if (res.version === undefined) {
        request.headers.crossDomain = true,
          request.headers.xhrFields = {
            withCredentials: true
          }
      }
    },
  })

  request.timeout = 50000;
  let bxAuthTicket = uni.getStorageSync("bxAuthTicket")
  let outTime = uni.getStorageSync("outTime")
  let date = new Date().getTime()
  let isExpired = outTime < date
  console.log("isExpired", isExpired, outTime, date, outTime - date)
  let urlstr = request.url
  let len = urlstr.lastIndexOf('cn/') + 3
  let lens = urlstr.indexOf(';')
  let ls = urlstr.lastIndexOf('?')
  let apiPath = null
  if (lens > 0) {
    apiPath = urlstr.slice(len, lens + 1)
  } else if (ls > 0) {
    apiPath = urlstr.slice(len, ls)
  } else {
    apiPath = urlstr.slice(len, urlstr.length)
  }

  if (!isExpired) {
    if (bxAuthTicket) {
      request.headers.bx_auth_ticket = bxAuthTicket
    }
    return request
  } else {
    uni.reLaunch({
      url: '/pages/login/login'
    });
  }
})

// 添加响应拦截器
fly.interceptors.response.use((res) => {
    // 对响应数据做些事
    if (res.data.resultCode === "0011") {
      // return res
    }
  },
  (error) => {
    // 对响应错误做处理
    let config = error.config;
    // 判断是否配置了重试
    if (!config || !config.retry) return Promise.reject(error);
    if (!config.shouldRetry || typeof config.shouldRetry != "function") {
      return Promise.reject(error);
    }
    //判断是否满足重试条件
    if (!config.shouldRetry(error)) {
      return Promise.reject(error);
    }
    // 设置重置次数，默认为0
    config.__retryCount = config.__retryCount || 0;
    // 判断是否超过了重试次数
    if (config.__retryCount >= config.retry) {
      return Promise.reject(error);
    }
    //重试次数自增
    config.__retryCount += 1;
    //延时处理
    let backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, config.retryDelay || 1);
    });
    //重新发起axios请求
    return backoff.then(function() {
      console.log('请求失败,重新发送请求')
      return fly(config);
    });
    // return Promise.reject(error)
  })
