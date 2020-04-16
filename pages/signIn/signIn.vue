<template>
	<view class="content">
		<view class="page-body">
			<view class="sign-title">
				<view class="sign-title-l">
					<view class="portrait">
						{{name.substr(-1)}}
					</view>
					<view class="text">
						<view class="name">
							{{name}}
						</view>

					</view>
					<view class="text" style="position: absolute;right: 30upx;">
						<view class="name">
							{{date}}
						</view>
					</view>
				</view>
			</view>
			<view style="text-align: center;padding: 20upx 0;">当前位置: <text @click="">{{address}}</text></view>
			<view class="uni-timeline">
				<view class="uni-timeline-item uni-timeline-first-item">
					<view class="uni-timeline-item-content">
						<view>
							<view class="desc-pad">
								<!-- <view> <uni-icon type="location-filled"/> {{}}</view> -->
							</view>
							<view class="content-show">
								<view>
									<view class="module CBlue" :class="isboole(is).class" @click="clickSign">
										<view class="text">{{isboole(is).title}}</view>
										<view class="time">{{time}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="false">
				<uni-collapse>
					<uni-collapse-item title="全部打卡信息">
						<uni-list>
							<view class="uni-list-cell-left">
								<view v-for="(item,index) in allSign" :key="index" style="border-bottom: 1px dashed #007AFF;">
									<view>{{item.mode}}</view>
									<view>{{item.address}}</view>
									<view>{{item.time}}</view>
								</view>
							</view>
						</uni-list>
					</uni-collapse-item>
				</uni-collapse>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formateDate,
		pointInsideCircle,
		isSameDay
	} from "./util.js"
	export default {
		data() {
			return {
				name: "",
				is: null, //是否正常打卡（
				time: formateDate(new Date(), 'h:min:s'), //当前时分秒
				date: formateDate(new Date(), 'Y-M-D'),
				latitude: "", //当前经度
				longitude: "", //当前维度
				address: "", //
				istoday:null
			}
		},
		// 初始化
		onLoad() {
			uni.showLoading({
				title: "正在获取位置信息",
				mask: true
			});
			this.getsuss().then((res)=>{
				console.log(res,'*********************')
				uni.hideLoading()
				let that = this
				if(res.data.data.length>0){
					that.is=true
					console.log(this.is,'-==========================')
				}else{
					that.getLocation()
				}
			})
			this.getTime();
			this.name = uni.getStorageSync('userInfo').user_no
		},
		methods: {
		 async	getsuss() {
				let url = this.$api.select + '/' + 'sqfw' + '/select/' + 'srvzhsq_hdgl_qdjl_select';
				let req = {
					"serviceName": "srvzhsq_hdgl_qdjl_select",
					"colNames": ["*"],
					"condition": [{
							"colName": "qdyh",
							"value":uni.getStorageSync('userInfo').user_no,
							"ruleType": "eq"
					  },{
							"colName": "qdrq",
							"value":formateDate(new Date(), 'Y-M-D'),
							"ruleType": "eq"
					  }],
					"page": {
						"pageNo": 1,
						"rownumber": 10
					},
					"order": []
				}
				let res =  this.$http.post(url, req)
				return res
			},
			isboole(val) {
				if (val == true) {
					return {
						'class': 'CGreen',
						'title': '已签到'
					}
				} else if (val == false) {
					return {
						'class': 'CBlue',
						'title': '签到'
					}
				} else if (val == null) {
					return {
						'class': 'CAsh',
						'title': '请检查位置'
					}
				}
			},
			// 腾讯位置服务
			getAdd() {
				var that = this;
				var url =
					`https://apis.map.qq.com/ws/geocoder/v1/?location=${that.latitude},${that.longitude}&key=VEEBZ-HJL34-U3LUY-XUBOX-NSUF7-E4BRF`;
				uni.request({
					url,
					success(res) {
						console.log(res, '***-*-*--*--*-*-*--*')
						// var data = res.data;
						// if(data.status != 0){
						// 	uni.showToast({title:data.message,icon:"none"})
						// 	return;
						// }
						// if(that.is === null){
						// 	that.address = "请检查位置信息！";
						// }
						// if(that.is === false){
						// 	let address = res.data.result.address + res.data.result.formatted_addresses.recommend
						// 	that.address = address;
						// 	that.signInfo.address = address;
						// }
					}
				})
			},
			// 实时时间
			getTime() {
				var that = this;
				setInterval(function() {
					that.time = formateDate(new Date(), 'h:min:s')
				}, 1000)
			},
			// 获取当前位置
			getLocation() {
				console.log('******************************************')
				var that = this;
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success(res) {
						
						that.latitude = res.latitude;
						that.longitude = res.longitude;
					
						that.is = false
						
						let item = res.address
						console.log(res)
						if(item){
							that.address =   item.city + item.district + item.district + item.poiName
						}else{
							that.address='未知'
						}
						uni.hideLoading()
						// that.getAdd()
					},
					fail(err) {
						uni.setStorageSync("signIn", true)
						uni.hideLoading()
						that.address = "请检查位置信息！"
						uni.showToast({
							title: "请检查位置信息状态！",
							icon: "none",
							mask: true,
							duration: 3000
						})
					}
				})
				
			},
			// 点击打卡
			clickSign() {
				let that = this
				if (that.is === false) {
					uni.showLoading({
						title: "签到记录中...",
						mask: true
					});
					that.setinfo()
					// this.signInfo.time = formateDate(new Date(),'Y-M-D h:min:s');

				} else if (that.is == null) {
					uni.showToast({
						icon: "none",
						title: "无法获取位置信息，签到失败！"
					})
				} else {
					uni.showToast({
						icon: "none",
						title: "今日已签到！"
					})
				}

			},
			setinfo() {
				
				let userinfo = uni.getStorageSync('userInfo')
				console.log(userinfo)
				let url = this.$api.select + '/' + 'sqfw' + '/operate/' + 'srvzhsq_hdgl_qdjl_add';
				let req = [{
					"serviceName": "srvzhsq_hdgl_qdjl_add",
					"condition": [],
					"data": [{
						"qdyh": userinfo.user_no,
						"qdyhxm": userinfo.real_name,
						// "qdyhbm": userinfo.dept_no,
						"qdrq": this.date,
						"qdsj": formateDate(new Date(), 'h:min:s'),
						"qdwz": this.address,
						"longitude": this.longitude,
						"latitude": this.latitude
					}]
				}]
				this.$http.post(url, req).then(res => {
					console.log(res)
					if(res.data.resultCode=="SUCCESS"){
						console.log(res)
						setTimeout(function() {
							uni.showToast({
								title: "打卡成功！"
							})
						}, 2000)
						this.is = true
					}else{
						uni.showToast({
							icon: "none",
							title: "签到失败！"
						})
					}
					
				})
			},
			// 选择地址
			openLocation() {
				var that = this;
				uni.chooseLocation({
					success: function(res) {
						that.address = res.address;
					}
				});
			},
		},
	}
</script>

<style>
	@import "./uni.css";

	.map {
		width: 100%;
		height: 260px;
	}

	.uni-list-cell-left {
		padding: 0 30upx;
	}

	.text-desc {
		display: flex;
		justify-content: space-between;
		padding: 10upx 20upx
	}

	.colorRed {
		color: red;
	}

	.colorGreen {
		color: #32CD32;
	}

	.colorYellow {
		color: yellow;
	}

	.colorBlue {
		color: #007aff;
	}

	.bgBlue {
		background-color: #007aff;
	}

	.bgGreen {
		background-color: #32CD32;
	}

	.bgAsh {
		background-color: #C8C7CC;
	}

	.uni-timeline-item-content-t {
		font-weight: bold;
	}

	.desc-pad {
		padding: 0 0upx
	}

	.desc-pad .bz {
		color: rgb(0, 122, 255);
	}

	.desc-pad .bz .icon {
		color: rgb(0, 122, 255)
	}

	.uni-timeline-last-item .uni-timeline-item-divider {
		background: #bbb;
	}

	.CBlue {
		background-color: #007aff;
		box-shadow: 0 5px 5px #007aff;
	}

	.CGreen {
		background-color: #32CD32;
		box-shadow: 0 5px 5px #32CD32;
	}

	.CAsh {
		background-color: #C8C7CC;
		box-shadow: 0 5px 5px #C8C7CC;
	}

	.module {
		overflow: hidden;
		margin: 20upx auto;
		width: 220upx;
		height: 220upx;
		border-radius: 50%;
		color: #fff;
		text-align: center;
	}

	.module .text {
		font-size: 20px;
		margin: 50upx auto 10upx;
	}

	.uni-timeline-item .uni-timeline-item-content {
		width: 100%;
		padding-right: 20upx;
	}

	.content-show {
		width: 100%
	}

	.sign-title {
		display: flex;
		justify-content: space-between;
		padding: 30upx 24upx;
		border-bottom: 1upx solid #333;
	}

	.sign-title .portrait {
		width: 100upx;
		height: 100upx;
		line-height: 100upx;
		border-radius: 50%;
		background-color: #007AFF;
		color: #fff;
		font-size: 50upx;
		text-align: center;
	}

	.sign-title .sign-title-l {
		display: flex;
	}

	.sign-title .sign-title-l .text {
		margin-left: 20upx;
	}

	.sign-title .sign-title-l .text .name {
		font-size: 32upx;
		line-height: 100upx;
	}

	.sign-title .sign-title-l .text .gz {
		color: darkblue;
		display: inline-flex;
	}

	.sign-title .sign-title-l .text .gz text {
		display: inline-block;
	}

	.sign-title .sign-title-l .text .gz .t1 {
		overflow: hidden;
		/*超出部分隐藏*/
		text-overflow: ellipsis;
		/* 超出部分显示省略号 */
		white-space: nowrap;
		/*规定段落中的文本不进行换行 */
		width: 166upx;
		/*需要配合宽度来使用*/
	}

	.iswq {
		padding: 0px 12px;
		color: #99CC33;
		border: 1px solid #99CC33;
		width: 26px;
		height: 24px;
		border-radius: 4px;
		margin-left: 20upx;
		display: inline-block;
	}

	.desc-pad .last {
		margin-bottom: 80upx;
	}

	.relocation {
		color: #0000FF;
	}

	.uni-popup .content .text {
		color: #666666;
	}

	.uni-input {
		height: auto !important;
		background: #efeff4;
	}
</style>
