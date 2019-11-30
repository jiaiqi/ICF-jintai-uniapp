<template>
    <view class="content">
        <view class="input-group">
            <view class="input-row border">
                <text class="title">账号：</text>
                <m-input class="m-input" type="text" clearable focus v-model="account.name" placeholder="请输入账号"></m-input>
            </view>
            <view class="input-row">
                <text class="title">密码：</text>
                <m-input type="password" displayable v-model="account.password" placeholder="请输入密码" @keyup.enter="accoutLogin"></m-input>
            </view>
        </view>
        <view class="btn-row">
            <!-- <button type="primary" class="primary" @tap="bindLogin">登录公众号</button> -->
            <button type="primary" class="primary" style="background-color: #E51C23;" @tap="accoutLogin">登录</button>
        </view>
        <view class="action-row">
            <navigator url="../user/register">注册账号</navigator>
            <!-- <navigator url="../reg/reg">注册账号</navigator> -->
            <text>|</text>
            <!-- <navigator url="../pwd/pwd">忘记密码</navigator> -->
            <navigator url="../user/forgot">忘记密码</navigator>
        </view>
        <view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
            <view class="oauth-image" v-for="provider in providerList" :key="provider.value">
                <image :src="provider.image" @tap="oauth(provider.value)"></image>
            </view>
        </view>
    </view>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import mInput from '../../components/m-input.vue'

    export default {
        components: {
            mInput
        },
        data() {
            return {
                providerList: [],
                hasProvider: false,
                account:{
					name:"",
					password:""
				},
                positionTop: 0
            }
        },
        computed: mapState(['forcedLogin']),
		onLoad() {
			//#ifdef MP-WEIXIN
				this.miniLogin()
			//#endif
			//#ifdef APP-PLUS || H5
				this.appLogin()
			//#endif
		},
        methods: {
            ...mapMutations(['login']),
            initPosition() {
                /**
                 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
                 * 反向使用 top 进行定位，可以避免此问题。
                 */
                this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
            },
           
            oauth(value) {
                uni.login({
                    provider: value,
                    success: (res) => {
                        uni.getUserInfo({
                            provider: value,
                            success: (infoRes) => {
                                /**
                                 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
                                 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
                                 */
                                this.toMain(infoRes.userInfo.nickName);
                            }
                        });
                    },
                    fail: (err) => {
                        console.error('授权登录失败：' + JSON.stringify(err));
                    }
                });
            },
            toMain(userName) {
                this.login(userName);
                /**
                 * 强制登录时使用reLaunch方式跳转过来
                 * 返回首页也使用reLaunch方式
                 */
                if (this.forcedLogin) {
                    uni.reLaunch({
                        url: '../home/home',
                    });
                } else {
                    uni.navigateBack();
                }

            },
			appLogin: async function() {
				
			},
			miniLogin:async function(){
				let self = this // 重定向 this
				uni.showLoading({
					title: '小程序登录中'
				});
				
				//#ifdef MP-WEIXIN
				// 微信小程序获取登录状态
				let AuthorState = this.$store.getters.getAuthorState
				let code = null
				uni.setStorageSync("loginInfoSrvCk","")// 置空后台票据，准备重新获取
				// self.$store.commit("setWxLoginInfoSrvCk","")  // 置空后台票据，准备重新获取
				wx.login({
				  success(res) {
					uni.hideLoading()
				    if (res.code) {// 发起网络请求 
					  let ress = {
						  url: self.$api.getLoginTicket,
						  data: {
						    code: res.code,
							app_no:'000003'
						  }
					  }
					  // 发送code 到sso，获取会话信息 ssosessionid
					   self.$http.post(ress.url,ress.data).then((res)=>{
						   console.log("res====?",res)
						if(res.data.resultCode === "select_user_type"){
							// 待绑定用户, 未绑定 百想帐号
							if(res.data.ssosessionid && res.data.ssosessionid !== null && res.data.ssosessionid !== "" && res.data.ssosessionid !== undefined){
								
								try {
									uni.setStorageSync('loginInfoSsos', res.data.ssosessionid);  // 保存 sso 会话信息
									uni.setStorageSync('loginInfoSsoCk', ""); //重置sso 票据，通过重新登录获取
								} catch (e) {
									// error
								}
									uni.hideLoading()
									// self.showPopupMiddlea = true
								// Vue.prototype.goWxLink("pages/login/login","navigateTo")
							}
						}else if(res.data.resultCode === "SUCCESS"){
							// 登录成功 | 免登录用户 || 已绑定 百想帐号
							let userNo = res.data.user_no
							if("ssosessionid" in res.data && "bxssocookieid" in res.data && res.data.ssosessionid !== null && res.data.ssosessionid !== "" && res.data.ssosessionid !== undefined){
								try {
									uni.setStorageSync('loginInfoSsos', res.data.ssosessionid);  // 保存 sso 会话信息
									uni.setStorageSync('loginInfoSsoCk', res.data.bxssocookieid); //保存 sso 票据信息
								} catch (e) {
									// error
								}
								// let ssoCk = self.$store.getters.getWxLoginInfoSsoCk
								let ssoCk = uni.getStorageSync('loginInfoSsoCk')
								let logineds = self.$store.getters.getlogined
								// 通过sso凭证，获取后台会话
								let promise = new Promise((resolve, reject) => {
									let s =  self.getSeesionId(ssoCk)
									resolve(s)
								})
								promise.then((e) => {
									if(e){
										// 获取后台会话成功，设置本地登录状态，并返回用户页面
										//console.log("2",e)
										let users = {
											logined:true,
											user_info: {
											  user_no: res.data.user_no,
											  dept_no: '',
											  email: '',
											  mobile: '',
											  user_disp: '',
											  real_name: ''
											}
										}
										self.$store.commit('setLogined',users.logined)  
										self.$store.commit('setUserNo',users.user_info) 
										// uni.navigateBack({ delta: 1})
										self.goWxLink("../home/home","reLaunch")
									}else{
										let users = {
											logined:false
										}
										
										self.$store.commit('setLogined',users.logined)  
										//console.log("3:",e)
									}
									//console.log("获取seesionid 成功：",e,logineds,srvCk)
								})
							}
						}else{
							//console.log("登录3！ssos",ssos,ssoCk,srvCk,srvCkCode)
							return ssoCk
						}
					  }).catch(err =>{
					  	//console.log('登录失败4！' + res.errMsg)
					  })
				    } else {
				      //console.log('登录失败5！' + res.errMsg)
					 
				    }
				  }
				})
				//#endif
			},
			accoutLogin(){
				let self = this
				let ssos = uni.getStorageSync('loginInfoSsos')
				// self.$store.getters.getWxLoginInfoSsos // 判断本地sso 会话信息是否可用
				// uni.showLoading({
				// 	title:"绑定中"
				// })
				console.log('ssos',ssos)
				switch(uni.getSystemInfoSync().platform){    
					case 'android':
					    console.log('运行Android上')       
						break;    
					case 'ios': 
						console.log('运行iOS上')       
						break;    
					default:      
					 	console.log('运行在开发者工具上')       
						break;
				}

				console.log('ssos',ssos,uni.getSystemInfoSync())
				let reqS = {
					// /programlogin;SSOSESSIONID=
				  "url": self.$api.programlogin + ";SSOSESSIONID=" + ssos,
				  "data":[{"serviceName":"srvuser_login","data":[{"user_no":self.account.name,"pwd":self.account.password}]}]
				 //  "data": {
					// "user_no": self.account.name,
					// "pwd": self.account.password
				 //  }
				}
				if(ssos === ""){
					// #ifdef  MP-WEIXIN
					reqS.url = self.$api.programlogin
					// #endif
					// #ifdef  APP-PLUS || H5
					reqS.url = self.$api.toLogin
					// #endif
					// 发起登录请求
				}else{
					// #ifdef  MP-WEIXIN
					reqS.url = self.$api.programlogin + ";SSOSESSIONID=" + ssos
					// #endif
					// #ifdef  APP-PLUS || H5
					reqS.url = self.$api.toLogin + ";SSOSESSIONID=" + ssos
					// #endif
					// 发起登录请求
				}
				
				
				self.$http.post(reqS.url,reqS.data).then((res)=>{
					this.login.loading = false;
					console.log(res.status,res.data,res.header)
					// 根据登录状态进行处理
					// if(res.data.bxssocookieid && res.data.bxssocookieid !== null && res.data.bxssocookieid !== "" && res.data.bxssocookieid !== undefined){
					// 	try {
					// 		
					// 		uni.setStorageSync('loginInfoSsoCk', res.data.bxssocookieid); //保存 sso 票据信息
					// 	} catch (e) {
					// 		// error
					// 	}
					// 	// self.$store.commit('setWxLoginInfoSsoCk', res.data.bxssocookieid) // 登录成功 保存sso登录票据
					// }
					switch (res.data.resultCode){
						case "FAILURE":
							uni.showToast({
							    icon: 'none',
							    title: res.data.resultMessage,
							});
							break;
						case "bind_login_success":
							// 绑定登录成功，设置登录状态 
							//console.log("bind_login_success",res.data.resultMessage)
							let users = {
								logined:true,
								user_info: {
								  user_no: res.data.user_no,
								  dept_no: '',
								  email: '',
								  mobile: '',
								  user_disp: '',
								  real_name: ''
								}
							}
							
							self.$store.commit('setLogined',users.logined)  
							self.$store.commit('setUserNo',users.user_info)  
							// 返回用户界面
							
							let promise = new Promise((resolve, reject) => {
								let s =  self.getSeesionId(res.data.bxssocookieid)
								resolve(s)
							})
							promise.then((e) => {
								if(e){
									// 获取后台会话成功，设置本地登录状态，并返回用户页面
									//console.log("2",e)
									let users = {
										logined:true,
										user_info: {
										  user_no: res.data.user_no,
										  dept_no: '',
										  email: '',
										  mobile: '',
										  user_disp: '',
										  real_name: ''
										}
									}
									self.$store.commit('setLogined',users.logined)  
									self.$store.commit('setUserNo',users.user_info) 
									uni.setStorageSync('loginInfoSrvCk', e); //保存 后端服务 票据信息
									// uni.navigateBack({ delta: 1})
									self.goWxLink("../home/home","reLaunch")
								}else{
									let users = {
										logined:false
									}
									
									self.$store.commit('setLogined',users.logined)  
									//console.log("3:",e)
								}
								//console.log("获取seesionid 成功2：",e)
							})
							uni.navigateBack({ delta: 1})
							break;
						case "bind_login_failure":
							uni.showToast({
							    icon: 'none',
							    title: res.data.resultMessage,
							});
							break;
						case "unbind_login_success":
							uni.showToast({
							    icon: 'none',
							    title: res.data.resultMessage,
							});
							break;
						case "SUCCESS":
							// 绑定登录成功，设置登录状态 
							//console.log("userINfo",res.data.user_no)
							let bx_auth_ticket = res.data.response[0].response.bx_auth_ticket
							let userInfo = res.data.response[0].response.login_user_info
							let loginTime = new Date().getTime() + ( res.data.response[0].response.expire_time * 1000 )
							let expire_time = res.data.response[0].response.expire_time
							uni.setStorageSync('bxAuthTicket', bx_auth_ticket); //保存凭证
							uni.setStorageSync('userInfo', userInfo); //保存用户信息
							uni.setStorageSync('expireTime', res.data.response[0].response.expire_time); //保存时效
							uni.setStorageSync('outTime',loginTime); //保存时效
							let use = {
								logined:true,
								user_info: {
								  user_no: userInfo.user_no,
								  dept_no: '',
								  email: '',
								  mobile: '',
								  user_disp: '',
								  real_name: ''
								}
							}
							self.$store.commit('setLogined',use.logined)  
							
							let menureq = {"serviceName":"srvauth_user_app_menu_select","colNames":["*"]}
							let appMenu = self.$http.post(self.$api.getUserAppMenu,menureq).then((res)=>{
								return res
							})
							console.log("menureq",menureq)
							self.goWxLink("../home/home","reLaunch")
							break;
						default:
							break;
					}
				}).catch(err =>{
					this.login.loading = false;
					console.error(err.status,err.message)
				})
			}
        },
        onReady() {
            this.initPosition();
            // this.initProvider();
        }
    }
</script>

<style>
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .action-row navigator {
        color: #007aff;
        padding: 0 20upx;
    }

    .oauth-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .oauth-image {
        width: 100upx;
        height: 100upx;
        border: 1upx solid #dddddd;
        border-radius: 100upx;
        margin: 0 40upx;
        background-color: #ffffff;
    }

    .oauth-image image {
        width: 60upx;
        height: 60upx;
        margin: 20upx;
    }
</style>
