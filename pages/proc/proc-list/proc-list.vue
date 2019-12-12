<template>
	<view class="proc-list">
		<!-- 菜单 -->
		<view class="top-warp">
			<view class="nav">
				<view :class="{active:tabType==='myall'}" @click="changeTab('myall')">我的全部</view>
				<view :class="{active:tabType==='mine'}" @click="changeTab('mine')">我的申请</view>
				<view :class="{active:tabType==='wait'}" @click="changeTab('wait')">待我处理</view>
				<view :class="{active:tabType==='processed'}" @click="changeTab('processed')">我已处理</view>
			</view>
		</view>
		<!-- top是指mescroll的padding-top的数值,单位upx. 目的是使下拉布局往下偏移,不然会被悬浮菜单遮住 -->
		<mescroll-uni top="120" :up="upOption" @up="loadData" @down="downCallback" @init="mescrollInit" @emptyclick="emptyClick">
			<!-- 数据列表 -->
			<view v-if="listData.list.length > 0" v-for="(item,index) in listData.list" :key="index" :info="item" class='my-unit'>
				<view v-if="item.src !== undefined" class="unit-content-left">
					<image :src="item.src" mode=""></image>
				</view>
				<view class="unit-content-right">
					<view class="unit-head">
						<text>{{item.title.value}}</text><text class="fr color-999">{{item.title.label === null || item.title.label === "" ? "-" : item.title.label}}</text>
					</view>
					<view class="unit-body">
						<view class="" v-for="(itemRow,itemRowIndex) in item.content" :key="itemRowIndex">
							<text v-if="rowCol.value !== undefined" v-for="(rowCol,rowColIndex) in itemRow" :key="rowColIndex" >{{rowCol.label}}：{{rowCol.value === null || rowCol.value === "" ? "-" : rowCol.value}}</text>
						</view>
					</view>
					<view class="unit-foot">
						<text  v-if="item.footer.columns.value !== undefined" class="color-999">{{item.footer.columns.label}} : {{item.footer.columns.value === null || item.footer.columns.value === "" ? "-":item.footer.columns.value}}</text>
						<button class="fr btn" size="mini" plain type="warn" @click="doDel">删除</button>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	// import mockData from "@/common/pdlist.js"; // 模拟数据
	
	export default {
		components: {
			MescrollUni
		},
		data() {
			return {
				mescroll: null, //mescroll实例对象
				upOption:{
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty:{
						tip: '~ 暂无相关数据 ~', // 提示
						btnText: '去看看'
					}
				},
				pdList: [], //列表数据
				tabType: 'myall', // 菜单
				serviceName:'srvsys_third_account_select',
				listCfgs: {
					// menu返回的list配置json Data示例
					serviceName: 'srvoa_news_columns_info_select',
					type: '1',  // 模版编号 list list-proc
					pageType: '',
					content: {
					  p_key: 'id',
					  Comp_img: 'list_img',  // 前端定义的 >>>  标识名称：‘columnName’
					  Comp_title: 'banner_title',
					  Comp_title_label: 'banner_type',
					  Comp_subtitle: 'remark',
					  Comp_content_row_left: 'create_user_disp',
					  Comp_content_row_right: 'banner_columns',
					  Comp_footer: 'create_time'
					}
				},
				listData: {
					"serviceName": "",  // router params
					"type": '1',
					"list": []
				},
				colV2Data:Object,  // V2
				footerBtns:Array,  // 行内按钮
				conds:Array,       // 条件
				query:Object    // 参数
			}
		},
		//注册滚动到底部的事件,用于上拉加载
		onReachBottom() {
			this.mescroll && this.mescroll.onReachBottom();
		},
		//注册列表滚动事件,用于下拉刷新
		onPageScroll(e) {
			this.mescroll && this.mescroll.onPageScroll(e);
		},
		onLoad(options){
			this.query = JSON.parse(decodeURIComponent(options.query));
			this.serviceName = this.query.service_name
			// this.listData['serviceName'] = this.query.service_name
			wx.setNavigationBarTitle({
			  title: this.query.menu_name
			})
			if(this.query.app_temp_col_map === null || this.query.app_temp_col_map === "" || this.query.app_temp_col_map === undefined){
				uni.showModal({
					title: '提示',
					content: '页面配置信息为空',
					showCancel: false,
					cancelText: '',
					confirmText: '',
					success: res => {
						
					},
					fail: () => {},
					complete: () => {}
				});
			}else{
				// 模版配置转json
				  this.query.app_temp_col_map = this.query.app_temp_col_map.replace(/\s+/g, '')
				  this.listCfgs.serviceName = this.query.service_name
				  this.listCfgs.content = JSON.parse(this.query.app_temp_col_map)
				  this.listCfgs.pageType = this.query.app_dest_page
				  // this.query = this.$route.query.serviceName
				  if ('cond' in this.query) {
					if (this.$route.query.cond.length > 0) {
					  this.conds = JSON.parse(this.$route.query.cond)
					} else {
					  this.conds = []
					}
				  } else {
					this.conds = []
				  }
			}
			this.getColV2(this.listCfgs.serviceName, 'select', 'list')
			// this.refresh();
			// this.loadData()
		},
		methods: {
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			async getColV2 (srv,srvType,pageList) {
				let self = this
				let colvw = await this.getColData(srv,srvType,pageList)
				  // this.colV2Data = colvw
				console.log('colvw=========', colvw)
				if (colvw.is_tree) {
					let prtNo = colvw.parent_no_col
					// let no = colvw.no
					this.conds = [{
					  'colName': prtNo,
					  'ruleType': 'isnull'
					}]
					self.isTree = colvw.is_tree
					self.colV2Data = JSON.parse(JSON.stringify(colvw))
					self.getGridButton(self.colV2Data.gridButton, self.colV2Data.service_name, self.conds)
					self.footerBtns = self.getFooterBtns(self.colV2Data.rowButton)
					// self.loadData(self.listCfgs.serviceName, self.conds)
				} else {
					self.isTree = colvw.is_tree
					// console.log("普通列表",self.listCfgs.serviceName)
					self.colV2Data = JSON.parse(JSON.stringify(colvw))
					self.getGridButton(self.colV2Data.gridButton, self.colV2Data.service_name, self.conds)
					self.footerBtns = self.getFooterBtns(self.colV2Data.rowButton)
					// self.loadData(self.listCfgs.serviceName, self.conds)
				}
			},
			// loadData:async function (serviceName, cond,mescroll) {
			loadData:async function (mescroll) {
			  // 请求数据
			  // console.log('mescroll:===',mescroll)
			  // console.log("srv",serviceName, cond)
			  let self = this
			  let req = self.selectRequestObjs()
			  req.serviceName = self.listCfgs.serviceName
			  req.colNames = ['*']
			  req.condition = self.conds
			  req['proc_data_type'] = self.tabType
			  req.order[0].colName = 'id'
			  req.order[0].orderType = 'desc'
			  req['page'] = {
				"pageNo": mescroll.num,
				"rownumber": mescroll.size
			  }
			  self.$http.post(this.$api.select,req).then((res)=>{
				  if (res.data.data !== '') {
				    let rData = JSON.parse(JSON.stringify(res.data.data))
					console.log("rData",rData)
					if (Array.isArray(rData)) {
						rData = rData.filter((item) => {
							if (item.src !== null && item.src !== '' && item.src !== undefined) {
							  item.src = self.getImageUrl(item.src)
							  return item
							} else { return item }
						})
					}
				    self.total = res.data.page.total
				    console.log('rep>>>' + rData)
				    let reqData = []
					let promise = new Promise((resolve,reject) => {
						let s = self.toListDataCtr(rData, self.listCfgs) // data构造方法参数一,原始data；参数二配置data
						resolve(s)
					})
					promise.then((resData)=>{
						console.log("data",resData)
						reqData = resData
						console.log('reqData>>>' + reqData)
						for (let i = 0; i < reqData.length; i++) {
							if (reqData[i].src !== null && reqData[i].src !== '' && reqData[i].src !== undefined) {
							  let src = self.getImageUrl(reqData[i].src)
							  if (src.length > 0) { reqData[i].src = src[0]._url } else { reqData[i].src = '' }
							}
						}
						let curPageData = reqData; 
						//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
						mescroll.endBySize(curPageData.length, self.total); 
						// 成功隐藏下拉加载状态
						//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
						//设置列表数据
						if(mescroll.num === 1){
							self.listData.list = [] //如果是第一页需手动制空列表
						}
						self.listData.list = self.listData.list.concat(curPageData); //追加新数据
					})
				  }
			  }).catch(err =>{
				// 失败隐藏下拉加载状态
				mescroll.endErr()
			  })
			},
			// 下拉刷新的回调
			downCallback(mescroll){
				mescroll.resetUpScroll() // 重置列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			},
			
			//点击空布局按钮的回调
			emptyClick(){
				// uni.showToast({
				// 	title:'点击了按钮,具体逻辑自行实现'
				// })
			},
			// 切换菜单
			changeTab (type) {
				if (this.tabType !== type) {
					this.tabType = type
					this.pdList = []// 在这里手动置空列表,可显示加载中的请求进度
					this.mescroll.resetUpScroll()// 刷新列表数据
				}
			},
		}
	}
</script>

<style>
	mescroll-uni,.proc-list{
		width: 100%;
	}
	.top-warp{
		z-index: 9990;
		position: fixed;
		top: --window-top; /* css变量 */
		left: 0;
		width: 100%;
		height: 120upx;
		background-color: white;
	}
	.top-warp .tip{
		font-size: 28upx;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
	}
	.top-warp .nav{
		text-align: center;
		height: 80upx;
		border-bottom: 1upx solid #ddd;
	}
	.top-warp .nav view{
		display: inline-block;
		width: 22%;
		line-height: 80upx;
		font-size: 36upx;
	}
	.top-warp .nav .active{
		border-bottom: 2upx solid #FF6990;
		color: #FF6990;
	}
	
	/*展示上拉加载的数据列表*/
	.data-li{
		position: relative;
		height: 160upx;
		/* padding: 20upx 16upx 20upx 240upx; */
		padding: 20upx;
		border-bottom: 1upx solid #eee;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
	}
	.data-li .pd-img{
		position: absolute;
		left: 36upx;
		top: 20upx;
		width: 160upx;
		height: 160upx;
	}
	.data-li .pd-name{
		font-size: 26upx;
		line-height: 40upx;
		height: 80upx;
		margin-bottom: 20upx;
		overflow: hidden;
	}
	.data-li .pd-price{
		font-size: 26upx;
		color: red;
	}
	.data-li .pd-sold{
		font-size: 24upx;
		margin-left: 16upx;
		color: gray;
	}
</style>
<style lang='scss'>
	mescroll-uni{
		width: 100%;
	}
	.my-unit{
		margin: 20upx 0;
		background-color: #ffffff;
		font-size: 28upx;
		transform: all 1s;
		display: flex;
		flex-direction: row;
		.unit-content-left{
			padding: 20upx;
			image{
				height: 160upx;
				width: 160upx;
			}
		}
		.unit-content-right{
			width: 100%;
			.unit-head{
				padding: 20upx;
				height: 80upx;
				box-sizing: border-box;
				border-bottom: 2upx solid #f5f5f5;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				text{
					font-size: 34upx;
					font-weight: bold;
					
				}
			}
			.unit-body{
				padding: 20upx;
				display: flex;
				flex-wrap: wrap;
				flex-direction: row;
				justify-content: space-between;
				view{
					display: flex;
					width: 100%;
					flex-direction: row;
					justify-content: space-between;
					text{
						/* width: 50%; */
						font-size: 28upx;
						color: #525252;
						line-height: 55upx;
					}
				}
			}
			.unit-foot{
				height: 88upx;
				padding: 0 20upx;
				border-top: 2upx solid #f5f5f5;
				border-bottom: none;
				line-height: 88upx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				
				.btn{
					height: 60upx;
					font-size: 28upx;
					line-height: 60upx;
					margin: 14upx 0;
				}
			}
		}
		
	}
</style>