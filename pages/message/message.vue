<template>
	<view class="wrap">
		<view class="topslerr">
			<liuyuno-tabs :tabData="tabs" :defaultIndex="defaultIndex" @tabClick='tabClick' />
		</view>
		<view class="underhei"></view>
		<view class="content-box" style="" v-if="list.length>0">
			<view @click="pagexq(item.info_id,item.id)" class="wrap-headlist" v-for="(item,index) in list" :key="index">
				<view class="ontcontent" style="position: relative;padding-left: 3px;">
					<image class="head-img"  :src="item.info_status=='已读'?'../../static/img/yidu.png':'../../static/img/weidu.png'  " mode=""></image>
				</view>
				<view class="twocontent">
					<view class="">
						<view class="" style="display: flex;position: relative;">
							<view class="title">{{item.send_user_no}}</view>
							<view class="datae">{{ transTime(item.send_time)}}</view>
						</view>
						<view class="textover">{{item.info_desc}}</view>
					</view>
					<view class="line"></view>
				</view>
			</view>
		</view>
		<view class="undf">
			<uni-loading v-if="" :status="status" color="#888" />
		</view>
	</view>
</template>

<script>
	import liuyunoTabs from "@/components/liuyuno-tabs/liuyuno-tabs.vue";
	import uniLoading from '@/components/mix-load-more/mix-load-more';
	import messageyimg from '../../static/img/yidu.png';
	import messagewimg from '../../static/img/weidu.png';
	export default {
		components: {
			liuyunoTabs,
			uniLoading,
			messageyimg,
			messagewimg
		},
		data() {
			return {
				tabs: ['未读消息', '已读消息', '全部消息'],
				defaultIndex: 0,
				TabCur: 0,
				emialalllist: [],
				wlist: [],
				ylist: [],
				list: [],
				status: 0,
				pageNo: 1,
				rownumber: 10,
				indexs: -1,
				status_page:"未提示",
				valno:true,
				messageyimg:require('@/static/img/yidu.png'),
				messagewimg:require('@/static/img/weidu.png')
				
			}
		},
		methods: {
			tabClick(index) {
				this.indexs = index
				this.list=[]
				this.pageNo =1;
				this.status = 1
				let statusPage =['未提示','已读','null']
				this.status_page=statusPage[index]
				this.getMenu(true).then(()=>{
					this.loadingStatus(this.list.length)
				})
			},
			pagexq(val, id) {
				uni.navigateTo({
					url: './listxq?id=' + val + '&statusid=' + id
				});
			},
			loadingStatus(value) {
				switch (value) {
					case 0:
						if(this.valno){
							this.status = 3
						}else{
							this.status = 2
						}
						break;
					case 10:
						this.status = 0
						break;
					default:
						this.status = 2;
						break;
				}
			},
		async getMenu(val) {
				let url = this.$api.select + "/sso/select/" + 'srvsso_info_user_select'
				let req = {};
				req.serviceName = 'srvsso_info_user_select';
				req.colNames = ['*'];
				let statyue  = {
						"colName": "info_status",
						"ruleType": "eq",
						"value": this.status_page
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
				if(this.indexs!==2){
					req.condition.push(statyue)
				}
				req.order = [];
				// req.group= [ { "colName": "count_hour", "type": "" } ]
				req['page'] = {
					pageNo: this.pageNo,
					rownumber: this.rownumber
				};
				let res = await this.$http.post(url, req)
				if(val){
					this.valno=true
					this.list = res.data.data
					this.loadingStatus(this.list.length)
				}else{
					this.valno=false
					this.list = this.list.concat(res.data.data)
					this.loadingStatus(res.data.data.length)
				}
					// let listboole = Boolean
					// if (list.length == 10) {
					// 	listboole = true
					// } else {
					// 	listboole = false
					// }
					// let ylist = [];
					// let wlist = []
					// for (var i in list) {
					// 	if (list[i].info_status !== "未提示") {
					// 		ylist.push(list[i])
					// 	} else {
					// 		wlist.push(list[i])
					// 	}
					// }

					// switch (val) {
					// 	case true:
					// 		console.log(".....", wlist.length)
					// 		this.emialalllist = list
					// 		this.ylist = ylist
					// 		this.wlist = wlist
					// 		if (listboole) {
					// 			this.status = 0
					// 		} else {
					// 			switch (this.indexs) {
					// 				case -1:
					// 					this.loadingStatus(wlist.length);
					// 					break;
					// 				case 0:
					// 					this.loadingStatus(wlist.length);
					// 					break;
					// 				case 1:
					// 					this.loadingStatus(ylist.length);
					// 					break;
					// 				case 2:
					// 					this.loadingStatus(list.length);
					// 					break;
					// 			}
					// 		}
					// 		if (this.indexs == -1 || 0) {
					// 			this.list = wlist
					// 		} else if (this.indexs == 1) {
					// 			this.list = ylist
					// 		} else {
					// 			this.list = list
					// 		}
					// 		break;
					// 	case false:
					// 		this.emialalllist = this.emialalllist.concat(list)
					// 		this.ylist = this.ylist.concat(ylist)
					// 		this.wlist = this.wlist.concat(wlist)
					// 		if (listboole) {
					// 			this.status = 0
					// 		} else {
					// 			switch (this.indexs) {
					// 				case -1:
					// 					this.loadingStatus(wlist.length);
					// 					break;
					// 				case 0:
					// 					this.loadingStatus(wlist.length);
					// 					break;
					// 				case 1:
					// 					this.loadingStatus(ylist.length);
					// 					break;
					// 				case 2:
					// 					this.loadingStatus(list.length);
					// 					break;
					// 			}
					// 		}
					// 		if (this.indexs == -1 || 0) {
					// 			console.log("ppp")
					// 			this.list = this.wlist.concat(wlist)
					// 		} else if (this.indexs == 1) {
					// 			this.list = this.ylist.concat(ylist)
					// 		} else {
					// 			this.list = this.emialalllist.concat(list)
					// 		}
					// 		break;
					// }

				
			},
			transTime (time) {
			  let toDay = (new Date()).getDate() // 今天是哪号
			  let timeDay = (new Date(time)).getDate() // 时间缀转为具体的哪一号
						 
			  var toYear = (new Date()).getFullYear() // 获取年
			  var timeYear = (new Date(time)).getFullYear() // 获取年
						 
			  var toMonth = (new Date()).getMonth() + 1 // 获取月
			  var timeMonth = (new Date(time)).getMonth() + 1 // 获取月
			  let myMonth = toMonth - timeMonth
			  let toHours = (new Date()).getHours() // 获取小时
			  let timeHours = (new Date(time)).getHours() // 获取小时
			  let Minutes = (new Date()).getMinutes() // 获取分钟
			  let timeMinutes = (new Date(time)).getMinutes() // 获取分钟
			  if (timeHours < 10) {
			    timeHours = '0' + timeHours
			  }
			  if (Minutes < 10) {
			    Minutes = '0' + Minutes
			  }
			  // console.log(toYear, timeYear)
			  if (toYear - timeYear > 0) {
			    let tm = timeMonth
			    if (tm < 10) {
			      tm = ('0' + tm)
			    }
			    let td = timeDay
			    if (td < 10) {
			      td = ('0' + td)
			    }
			    // console.log('一年前')
			    // console.log(timeYear + '-' + timeMonth + '-' + timeDay)
			    return (timeYear + '-' + tm + '-' + td + ' ' + timeHours + ':' + Minutes)
			  }
			  // 大于一周
			  // console.log(toDay, timeDay)
			  if ((myMonth === 0) && ((toYear - timeYear) === 0)) {
			    // 本月
			    // 一周内的
			    if ((toDay - timeDay) === 0) {
			      // 日期是今天的
			      // 一个小时内3分钟前的
			      // 15分内3分前的
			      if ((toHours - timeHours) === 0) {
			        // 一个小时内
			        let xz = ((new Date()) - time) / 60000
			        let fz = Math.floor(xz)
			        if (fz > 3) {
			          return Math.floor(xz) + '分钟前'
			        }
			      } else {
			        // 大于一个小时
			        if (timeMinutes < 10) {
			          timeMinutes = '0' + timeMinutes
			        }
			        return (timeHours + ':' + timeMinutes)
			      }
			    } else if (((toDay - timeDay) >= 1) && (toDay - timeDay <= 7)) {
			      // 1周内的
			      let weekTime = (new Date(time)).getDay()
			      let weekD
			      if (weekTime === 0) weekD = '星期日'
			      if (weekTime === 1) weekD = '星期一'
			      if (weekTime === 2) weekD = '星期二'
			      if (weekTime === 3) weekD = '星期三'
			      if (weekTime === 4) weekD = '星期四'
			      if (weekTime === 5) weekD = '星期五'
			      if (weekTime === 6) weekD = '星期六'
			      // console.log(weekD)
			      return (weekD + ' ' + timeHours + ':' + timeMinutes)
			      // console.log('昨天')
			    } else {
			      // 大于一周显示日期（如：3月25日
			      let tm = timeMonth
			      if (tm < 10) {
			        tm = ('0' + tm)
			      }
			      let td = timeDay
			      if (td < 10) {
			        td = ('0' + td)
			      }
			      return (timeYear + '-' + tm + '-' + td + ' ' + timeHours + ':' + Minutes)
			    }
			  }
			  if ((myMonth > 0) && ((toYear - timeYear) === 0)) {
			    // 大于1个月，同一年的
			    let tm = timeMonth
			    if (tm < 10) {
			      tm = ('0' + tm)
			    }
			    let td = timeDay
			    if (td < 10) {
			      td = ('0' + td)
			    }
			    return (timeYear + '-' + tm + '-' + td + ' ' + timeHours + ':' + Minutes)
							  
			  }
			},

		},
		onLoad() {
			this.status = 1
			// let time ='2020-01-11 12:02:37'
			
			// console.log(this.transTime(time))

		},
		onPullDownRefresh() {
			this.pageNo = 1
			setTimeout(() => {
				uni.stopPullDownRefresh();
				this.getMenu(true)
			}, 2000);
		},
		onReachBottom() {
			this.status = 1
			this.pageNo++
			uni.showNavigationBarLoading()
			setTimeout(() => {
				this.getMenu(false).then(()=>{
					if(this.indexs==0||-1){
						this.getmessages()
					}
				})
				uni.hideNavigationBarLoading()
			}, 1500);
		},
		onShow(){
			this.getMenu(true)
			this.getmessages()
		}
	}
</script>

<style>
	.wrap {
		width: 100%;
		background: #FFFFFF;
	}

	.head-img {
		display: block;
		height: 100upx;
		width: 100upx;
		/* vertical-align: middle; */
		margin: auto;
		/* padding: 8px; */
		
		position: absolute;
		top: 50%;
		/* height: 100px; */
		margin-top: -50upx;
	}

	.wrap-headlist {
		display: flex;
		padding: 0 12px;
		margin-bottom: 15px;
		/* border:1px solid red; */
		
	}

	.line {
		height: 1px;
		background: #E3E3E3;
		width: 100%;
		margin-top: 12px;
	}

	.textover {
		overflow: hidden;
		width: 100%;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #9E9E9E;
	}

	.ontcontent {
		width: 20%;
	}

	.twocontent {
		width: 80%;
		line-height: 25px;
		padding-top: 4px;
	}

	.title {
		font-size: 32upx;
		font-weight: bold;
	}

	.datae {
		color: #9E9E9E;
		position: absolute;
		right: 0;
		font-size: 12px;
		line-height: 28px;
	}

	.topslerr {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 1024;
	}

	.content-box {
		overflow: hidden;
	}

	.undf {}

	.underhei {
		height: 110upx;
	}
</style>
