<template>
	<view class="swiper-tab">
		<view class="swiper-tab-list">
			<view :class="{active : index == num}" v-for="(item,index) in listData.tabs" :key="index" @click="handler(index)">
				<text>{{item.label}}</text>
			</view>
		</view>
		
		<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="loadDatas" @init="mescrollInit">
			<view class="swiper-tab-listItem" >
				<view class="listitems" @click="GoDetail(index)" v-for="(a,index) in listData.tabs[index].list" :key="index" hover-class="tab-item-hover" :hover-start-time="20" :hover-stay-time="70">
					<image class="list-image" :src="a.src"></image>
					<text>{{a.title}}</text>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	//引入mescroll-uni组件
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
	
	export default{
		name:"tab-item-view",
		props:['itemData'],
		components:{
			MescrollUni
		},
		data () {
			return {
				num:0,
				mescroll:null,
				//下拉刷新的配置
				downOption:{
					use:true,
					auto:true,
				},
				//上拉加载的配置
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
					auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					isLock: false, // 是否锁定上拉加载 (可用于不触发upCallback,只保留回到顶部按钮的场景)
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 2 // 每页数据的数量,默认10
					},
					noMoreSize: 3, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					},
					textNoMore: '-- END --',
				},
			  acted: this.itemData.tabs[0].value,
			  // tabs: this.itemData.tabs,
			  serviceName: this.itemData.serviceName,
			  index: 0,
			  link: '/bxoa_issue_detail',
			  getBarWidth: function (index) {
				return (index + 1) * 22 + 'px'
			  },
			  listData: this.itemData,
			  // list: this.itemData.list,
			  // list: list(),
			  rownumber: 10,
			  pageNo: 1,
			  total: 0,
			  pullupEnabled: true,
			  status: {
				pullupStatus: 'default',
				pulldownStatus: 'default'
			  },
			  
			  // listCfgs: {
			  // 	// menu返回的list配置json Data示例
			  // 	serviceName: 'srvoa_news_columns_info_select',
			  // 	type: '1',  // 模版编号 list list-proc
			  // 	pageType: '',
			  // 	content: {
			  // 	  p_key: 'id',
			  // 	  Comp_img: 'list_img',  // 前端定义的 >>>  标识名称：‘columnName’
			  // 	  Comp_title: 'banner_title',
			  // 	  Comp_title_label: 'banner_type',
			  // 	  Comp_subtitle: 'remark',
			  // 	  Comp_content_row_left: 'create_user_disp',
			  // 	  Comp_content_row_right: 'banner_columns',
			  // 	  Comp_footer: 'create_time'
			  // 	}
			  // },
		}
	},
	  mounted() {
		this.loadData()
	  },	  
	  // 必须注册滚动到底部的事件,使上拉加载生效
            onReachBottom() {
                this.mescroll && this.mescroll.onReachBottom();
            },
            // 必须注册列表滚动事件,使下拉刷新生效
            onPageScroll(e) {
                this.mescroll && this.mescroll.onPageScroll(e);
            },
		methods: {
				mescrollInit(mescroll) {
                    this.mescroll = mescroll;
                },
				downCallback(mescroll){
					setTimeout(function(){
						mescroll.endSuccess()
					},1000)
				},
				loadDatas(mescroll){
					console.log("asd",this.getTabsLabel(this.acted))
					// mescroll.endErr()
					
					
					//此时的mescroll带有page参数
					console.log('aaaaa',this.acted)
					let self = this
					let len = self.listData.tabs[self.index]

					let pageNum = mescroll.size*mescroll.num
					
					
					if(len.list.length > pageNum){
						console.log('success')
						console.log(len.list.slice(0,2))
						this.dataList = this.listData
						console.log('aaaaa',this.dataList)
						mescroll.endErr()
					}else{
						mescroll.endErr()
					}
					console.log("ccccccccccc",self.upOption.page.num,self.upOption.page.size)
				},
				GoDetail(i){
					// console.log('test',i)
					// console.log(this.getData())
					let id = i+1
					uni.navigateTo({
						url:"../../pages/newdetail/detailplus?query="+id
					})
				},
					
					
					//调试
			// 		loadDatas:async function (mescroll) {
			// 		  let self = this
			// 		  let req = self.selectRequestObjs()
			// 		  req.serviceName = self.listCfgs.serviceName
			// 		  req.colNames = ['*']
			// 		  req.condition = self.conds
			// 		  req['proc_data_type'] = self.tabType
			// 		  req.order[0].colName = 'id'
			// 		  req.order[0].orderType = 'desc'
			// 		  req['page'] = {
			// 			"pageNo": mescroll.num,
			// 			"rownumber": mescroll.size
			// 		  }
			// 		  self.$http.post(this.$api.select,req).then((response)=>{
			// 				  if (response.data.data !== '') {
			// 					  let rData = response.data.data
			// 					  let item = rData.map(function (item) {
			// 						let a = {}
			// 						a['src'] = self.$api.downloadImg + item.list_img
			// 						a['title'] = item.banner_title
			// 						a['desc'] = item.remark
			// 						a['url'] = '/detailplus/srvoa_news_columns_info_select/' + item.id
			// 						return a
			// 					  })
			// 					  self.listData.tabs[index].list = item
			// 					  let val = self.listData.tabs[self.index]
			// 					  // for()
			// 					  if (pushList === false) {
			// 						val.list = item
			// 						val.len = val.list.length
			// 					  } else {
			// 						val.list = val.list.length
			// 						val.len = val.list.length
			// 					  }
			// 					  console.log('加载到：' + item)
			// 					}
			// 			    self.total = res.data.page.total
			// 			    // let resNum = response.data.data.length
			// 			    // self.total = res.data.page.total
			// 			    console.log('rep>>>' + rData)
			// 			    let reqData = []
			// 				let promise = new Promise((resolve,reject) => {
			// 					let s = self.toListDataCtr(rData, self.listCfgs) // data构造方法参数一,原始data；参数二配置data
			// 					resolve(s)
			// 				})
			// 				promise.then((resData)=>{
			// 					console.log("data",resData)
			// 					reqData = resData
			// 					console.log('reqData>>>' + reqData)
			// 					for (let i = 0; i < reqData.length; i++) {
			// 						if (reqData[i].src !== null && reqData[i].src !== '' && reqData[i].src !== undefined) {
			// 						  let src = self.getImageUrl(reqData[i].src)
			// 						  if (src.length > 0) { reqData[i].src = src[0]._url } else { reqData[i].src = '' }
			// 						}
			// 					}
			// 					let curPageData = reqData; 
			// 					//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
			// 					mescroll.endBySize(curPageData.length, self.total); 
			// 					// 成功隐藏下拉加载状态
			// 					//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
			// 					//设置列表数据
			// 					if(mescroll.num === 1){
			// 						self.listData.list = [] //如果是第一页需手动制空列表
			// 					}
			// 					self.listData.list = self.listData.list.concat(curPageData); //追加新数据
			// 				})
			// 		  }).catch(err =>{
			// 			// 失败隐藏下拉加载状态
			// 			console.log(1111)
			// 			mescroll.endErr()
			// 		  })
	  // //-------------------------
			// 	},
				// scrolltolower(mescroll){
				// 	let self = this
				// 	self.mescroll = mescroll
				// 	this.loadDatas(self.mescroll)
				// },
			getimgPaths (arr, index) {
			  // 查询图片路径
			  let self = this
			  // let path = ''
			  let ilist = self.listData.tabs[index].list
			  // let s = JSON.parse(JSON.stringify(arr))
			  let fileNo = arr.map(function (item) {
				return item.src
			  })
			  let req = this.selectRequestObjs()
			  req.colNames = ['file_no', 'fileurl']
			  req.serviceName = 'srvsys_file_select'
			  req.condition[0].colName = 'file_no'
			  req.condition[0].ruleType = 'in'
			  req.condition[0].value = fileNo.join()
			  req.order[0].colName = 'create_time'
			  req.order[0].orderType = 'asc'
			  this.$http.post(self.$api.select, req).then((response)=>{
				  if (response.data.data !== '') {
					let datas = response.data.data
					for (let j = 0; j < datas.length; j++) {
					  for (let i = 0; i < ilist.length; i++) {
						if (ilist[i].src === datas[j].file_no && 'src' in self.listData.tabs[index].list[i]) {
						  self.listData.tabs[index].list[i].src = self.$api.getFilePath + datas[j].fileurl
						}
					  }
					}
				  }
			  })
		},
			getData (t, index, pushList) {
				// 请求数据
				console.log('getData:===' + t)
				this.acted = t
				let self = this
				let req = this.selectRequestObjs()
				req.serviceName = this.serviceName
				console.log(req.serviceName)
				req.colNames = ['*']
				req.condition = []
				let rulea = {
					colName: 'online',
					ruleType: 'eq',
					value: '已上线'
				}
				let ruleb = {
					colName: 'banner_type',
					ruleType: 'eq',
					value: t
				}
			  req.condition.push(rulea)
			  req.condition.push(ruleb)
			  req.order[0].colName = 'create_time'
			  req.order[0].orderType = 'desc'
			  req['page'] = {
				pageNo: self.pageNo,
				rownumber: self.rownumber
			  }
			  
				this.$http.post(this.$api.select, req).then((response)=>{
					console.log('222',response)
				  if (response.data.data !== '') {
					  let rData = response.data.data
					  let item = rData.map(function (item) {
						let a = {}
						a['src'] = self.$api.downloadImg + item.list_img
						a['title'] = item.banner_title
						a['desc'] = item.remark
						a['url'] = '/detailplus/srvoa_news_columns_info_select/' + item.id
						console.log('de',a)

						return a
					  })
					  self.listData.tabs[index].list = item
					  console.log('sssssss',self.listData)
					  let val = self.listData.tabs[self.index]
					  // for()
					  if (pushList === false) {
						val.list = item
						val.len = val.list.length
					  } else {
						val.list = val.list.length
						val.len = val.list.length
					  }
					  console.log('加载到：' + item)
					}
				})
		},
				getTabsLabel (v, n) {
				  let list = this.listData.tabs
				  let lab = ''
				  if (n === false) {
					for (let i = 0; i < list.length; i++) {
					  if (list[i].lable === v) {
						lab = list[i].value
					  }
					}
				  } else {
					for (let i = 0; i < list.length; i++) {
					  if (list[i].value === v) {
						lab = list[i].label
					  }
					}
				  }
				  return lab
				},
				
				handler(index){
					this.num = index
					let tabsValue = this.listData.tabs
					let value = tabsValue[index].value
						console.log(value)
					this.index = index
					this.acted = value
					this.getData(this.getTabsLabel(this.acted), index, false)
					// console.log(index)
				},
				
			loadData () {
			  // 加载数据
			  let self = this
			  self.acted = this.listData.tabs[0].value
			  let type = this.getTabsLabel(self.acted)
			  self.getData(type, self.index, false)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.swiper-tab{
		background-color: white;
	}
	.swiper-tab-list{
		height: 44px;
		line-height: 44px;
		display: flex;
		justify-content:space-around;
		border-bottom: 2px solid #F5F5F5;
	}
	.active{
		color: #FF9900;
	}
	.list-image{
		width: 60px;
		height: 60px;
		vertical-align: middle;
		margin:.8rem;
	}
	.listitems{
		border-bottom: 1px solid #F5F5F5;
		margin: 0 15px;
	}
	.tab-item-hover{
		background-color: #f1f1f1;
	}
</style>


