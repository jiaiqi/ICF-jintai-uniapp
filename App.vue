<script>
	export default {
		onLaunch: function() {
			console.log('App Launch**************************');
			//#ifdef APP-PLUS  
			// var info = plus.push.getClientInfo();
			// console.log(JSON.stringify(info));
			/* 5+  push 消息推送*/
			setInterval(() => {
				this.getMenu()
			}, 20000)
			// plus.push.addEventListener("click", function(msg) {  
			// 	console.log("click-------:"+JSON.stringify(msg));  
			// 	console.log(msg.payload);  
			// 	console.log(JSON.stringify(msg));  
			// }, false);  
			
			// 	// 监听在线消息事件    
			// plus.push.addEventListener("receive", function(msg) {  
			// 	console.log("recevice----:"+JSON.stringify(msg))  
			//  }, false);  
			//#endif  

		},
		onShow: function() {
			console.log('App Show');
			//#ifdef MP-WEIXIN
			if (!this.$store.getters.getLogined) {
				this.mpLogin() // 获取小程序登录状态
			}
			//#endif
			//#ifdef H5
			// console.log("是否微信浏览器",this.isWeixinCient())
			if (!this.$store.getters.getLogined) {
				// this.wxh5Login() // 获取公众号H5
			}
			//#endif
		},
		onHide: function() {
			console.log('App Hide');
		},
		methods: {
			async getMenu(val) {
				let url = this.$api.select + "/sso/select/" + 'srvsso_info_user_select'
				let req = {};
				req.serviceName = 'srvsso_info_user_select';
				req.colNames = ['*'];
				let statyue = {
					"colName": "info_status",
					"ruleType": "eq",
					"value": "未提示"
				}
				req.condition = [{
						"colName": "type",
						"ruleType": "eq",
						"value": "myinfo"
					},

					{
						"colName": "biz_type",
						"ruleType": "eq",
						"value": "消息通知"
					}
				];

				req.order = [];
				// req.group= [ { "colName": "count_hour", "type": "" } ]
				req['page'] = {
					pageNo: 1,
					rownumber: 10
				};
				req.condition.push(statyue)
				let res = await this.$http.post(url, req)

				console.log(res, "------------++++++---------------")
				let item = res.data.data
				// console.error(item.length, uni.getStorageSync('messageNum'))
				
				if (item && item.length > 0) {
					let messNum = uni.getStorageSync('messageNum')
					let idArr = []
					let storArr = []
					for( let i in item ){
						idArr.push(item[i].id)
						if(messNum){
							console.error("*******",idArr,messNum)
							if(messNum.indexOf(idArr[i])==-1){
								storArr.push(idArr[i])
							}
						}
					}
					console.error("+++++++",idArr,storArr)
					let messageNumber = storArr.length
					console.log(messageNumber,"88888")
					if(messageNumber>0){
						console.log("9999")
						let title = `您有${messageNumber}条消息待查看`
						plus.push.createMessage(title, {
									cover: false,
									when: new Date()
						});
					}
					uni.setStorageSync("messageNum", idArr)
				}
			},



			wxh5Login: async function() {
				// 未授权的进入授权
				// self.$route.push('/login')
				let code = this.$route.query.code
				if (this.isWeixinCient()) {
					if (code) {
						// 判断是否是授权重定向

					} else {}
				} else {
					uni.showLoading({
						title: '请在微信中打开'
					});
				}
			},
			mpLogin: async function() {
				let self = this // 重定向 this
				uni.showLoading({
					title: '小程序登录中1'
				});

				//#ifdef MP-WEIXIN
				// 微信小程序获取登录状态
				let AuthorState = this.$store.getters.getAuthorState
				let code = null
				self.$store.commit("setWxLoginInfoSrvCk", "") // 置空后台票据，准备重新获取
				wx.login({
					success(res) {
						uni.hideLoading()
						if (res.code) { // 发起网络请求 
							let ress = {
								url: self.$api.getLoginTicket,
								data: {
									code: res.code,
									app_no: '000003'
								}
							}
							// 发送code 到sso，获取会话信息 ssosessionid
							self.$http.post(ress.url, ress.data).then((res) => {
								if (res.data.resultCode === "select_user_type") {
									// 待绑定用户, 未绑定 百想帐号
									if (res.data.ssosessionid && res.data.ssosessionid !== null && res.data.ssosessionid !== "" && res.data.ssosessionid !==
										undefined) {
										uni.setStorageSync('loginInfoSsos', res.data.ssosessionid); // 保存 sso 会话信息
										uni.setStorageSync('loginInfoSsoCk', res.data.bxssocookieid); //保存 sso 票据信息
										uni.hideLoading()
										// self.showPopupMiddlea = true
										let users = {
											logined: false
										}
										self.$store.commit('setLogined', users.logined)
										// self.goWxLink("pages/login/login","navigateTo")
									}
								} else if (res.data.resultCode === "SUCCESS") {
									// 登录成功 | 免登录用户 || 已绑定 百想帐号
									let userNo = res.data.user_no
									if ("ssosessionid" in res.data && "bxssocookieid" in res.data && res.data.ssosessionid !== null && res.data
										.ssosessionid !== "" && res.data.ssosessionid !== undefined) {
										uni.setStorageSync('loginInfoSsos', res.data.ssosessionid); // 保存 sso 会话信息
										uni.setStorageSync('loginInfoSsoCk', res.data.bxssocookieid); //保存 sso 票据信息
										let ssos = uni.getStorageSync("loginInfoSsos")
										let ssoCk = uni.getStorageSync("loginInfoSsoCk")
										let srvCk = uni.getStorageSync("loginInfoSrvCk")
										let logineds = self.$store.getters.getlogined
										// 通过sso凭证，获取后台会话
										let promise = new Promise((resolve, reject) => {
											let s = self.getSeesionId(ssoCk)
											resolve(s)
										})
										promise.then((e) => {
											if (e) {
												// 获取后台会话成功，设置本地登录状态，并返回用户页面
												//console.log("2",e)
												let users = {
													logined: true,
													user_info: {
														user_no: res.data.user_no,
														dept_no: '',
														email: '',
														mobile: '',
														user_disp: '',
														real_name: ''
													}
												}
												self.$store.commit('setLogined', users.logined)
												self.$store.commit('setUserNo', users.user_info)
												// uni.navigateBack({ delta: 1})
												self.goWxLink("../home/home", "reLaunch")
											} else {
												let users = {
													logined: false
												}

												self.$store.commit('setLogined', users.logined)
												//console.log("3:",e)
											}
											//console.log("获取seesionid 成功：",e,logineds,srvCk)
										})
									}
								} else {
									//console.log("登录3！ssos",ssos,ssoCk,srvCk,srvCkCode)
									return ssoCk
								}
							}).catch(err => {
								//console.log('登录失败4！' + res.errMsg)
							})
						} else {
							//console.log('登录失败5！' + res.errMsg)

						}
					}
				})
				//#endif
			}
		}
	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";

	/*每个页面公共css */
	/* uni-app默认全局使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。如不使用flex布局，请删除或注释掉本行。*/
	body,
	page {
		min-height: 100%;
		display: flex;
	}

	/* #ifdef MP-BAIDU */
	page {
		width: 100%;
		height: 100%;
		display: block;
	}

	swan-template {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* #endif */

	/* 原生组件模式下需要注意组件外部样式 */
	m-input {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: flex-start;
		background-color: #efeff4;
		padding: 0upx;
		overflow: hidden;
	}

	.uni-input-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex !important;
		justify-content: center !important;
		align-items: center;
	}

	.uni-input-placeholder {
		width: 95%;
		left: 5px;
	}

	.input-group {
		background-color: #ffffff;
		margin-top: 40upx;
		position: relative;
	}

	.input-group::before {
		position: absolute;
		right: 0;
		top: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-group::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-row {
		display: flex;
		flex-direction: row;
		position: relative;
	}

	.input-row .title {
		width: 20%;
		height: 50upx;
		min-height: 50upx;
		padding: 15upx 0;
		padding-left: 30upx;
		line-height: 50upx;
	}

	.input-row.border::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 15upx;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.btn-row {
		margin-top: 50upx;
		padding: 20upx;
	}

	.radio_group .uni-radio-input {
		-webkit-appearance: none;
		appearance: none;
		margin-right: 5px;
		outline: 0;
		border: 1px solid #d1d1d1;
		background-color: #fff;
		border-radius: 50%;
		width: 18px;
		height: 18px;
		position: relative !important;
	}

	/* 	 .input{
		border:1px solid #c5464a;
	    border-radius:5px 5px 5px 5px;
		padding: 0 4px;
	} */
	/* .uni-input-input:focus{
		outline: none;
		border-color: #9ecaed;
		box-shadow: 0 0 10px #9ecaed;
	} */

	.search,
	.m-input-input .uni-input-input {
		border: none;
	}

	.search,
	.m-input-input .uni-input-input:focus {
		box-shadow: none;
	}
</style>
