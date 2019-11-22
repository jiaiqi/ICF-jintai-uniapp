<template>
		<mescroll-uni :down="downOption" :up="upOption"  @down="scrolltoupper"  @up="loadData" @init="mescrollInit">
        <!-- <view> @down, @up, @init 必须配置 </view> -->
        <!-- <view> :down, :up, 可省略 </view> -->
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
        				<text v-for="(rowCol,rowColIndex) in itemRow" :key="rowColIndex" >{{rowCol.label}}：{{rowCol.value === null || rowCol.value === "" ? "-" : rowCol.value}}</text>
        			</view>
        		</view>
        		<view class="unit-foot">
        			<text class="color-999">{{item.footer.columns.label}} : {{item.footer.columns.value === null || item.footer.columns.value === "" ? "-":item.footer.columns.value}}</text>
        			<button class="fr btn" size="mini" plain type="warn" @click="doDel">删除</button>
        		</view>
        	</view>
        </view>
    </mescroll-uni>
	
</template>
<script>
	// import myPull from '@/static/js/myPull.js'
	// import myLoading from '@/components/myLoading/myLoading.vue'
	 // 引入mescroll-uni组件 
    import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
	export default {
		components:{MescrollUni},
		data() {
			return {
				mescroll: null, //mescroll实例对象
				// 下拉刷新的配置
				downOption: { 
					use: true, // 是否启用下拉刷新; 默认true
					auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
				},
				// 上拉加载的配置
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
					auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					isLock: false, // 是否锁定上拉加载 (可用于不触发upCallback,只保留回到顶部按钮的场景)
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 3, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
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
				query:Object,    // 参数
				isTree:false
			}
		},
		// 必须注册滚动到底部的事件,使上拉加载生效
		onReachBottom() {
			this.mescroll && this.mescroll.onReachBottom();
		},
		// 必须注册列表滚动事件,使下拉刷新生效
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
			 //  if (cond) {
				// req.condition = cond
			 //  } else {
				// req.condition = []
			 //  }
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
				    // let resNum = response.data.data.length
				    // self.total = res.data.page.total
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
			
			/**
			 * @name 触底加载
			 */
			scrolltolower(mescroll){
				let self = this
				self.mescroll = mescroll
				this.loadData(self.mescroll)
			},
			/**
			 * @name 触ding加载
			 */
			scrolltoupper(mescroll){
				mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			
		},
		// mixins:[myPull({})],
		
	}
</script>
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
