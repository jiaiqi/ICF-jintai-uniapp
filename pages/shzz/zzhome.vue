<template>
	<view class="content">
<!-- 		<view class="topbar">
			<text class="fontstext">志愿者与社会组织</text>
			<button type="default" size="mini" class="btn">新增</button> 
		</view> -->
		<view class=""> 
			<image src="../../static/img/sszz.png" class="banner" mode=""></image>
		</view>

		<view class="conent-gray">
			<view class="gray-tab">
				<view class="textbar">
					<text class="leftborder">{{label}}</text>
					<text class="btnmenu" v-if="menuAudio>0" @click="audiobtn(serves)" >待我审批</text>
				</view>
			</view>
			<view class="" v-if="shows">
				
				<view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view><view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view>
				<view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view>
				<view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view><view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view>
			</view>
			
			<view v-else class="contentla" v-for="(item,index) in listhome" :key="index">
				<view class="yangPeople"  @click="detail(item.proc_status,item.zuzhi_name||
				item.organize_name,item.zuzhi_address||item.address,item.zuzhi_jj||item.remark)">
					<text>{{item.organize_name||item.zuzhi_name}}</text>
					<text :class="item.proc_status=='完成'?'colortext': 'colortext-red' ">{{item.proc_status=='完成'?'已审批':'未审批'}}</text>
				</view>
			</view>
			<view class="more" @click="more(listtar)" v-if="!contentBoole">
				<text style="color:red;font-size: 16px;">更多>></text>
			</view>
		</view>
		
		<!-- <view class="conent-gray">
			<view class="gray-tab">
				<view class="textbar">
					<text class="leftborder">社会组织</text>
					<text class="btnmenu" @tap="join(selectList[1])" >申请加入</text>
					
				</view>
			</view>
			<view class="" v-if="shows">
				<view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view>
				<view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view><view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view>
			</view>
			<view v-else class="contentla" v-for="(item,index) in listhomeall" :key="index">
				<view class="yangPeople"  @click="detail(item.proc_status,item.organize_name,item.address,item.remark)">
					<text>{{item.organize_name}}</text>
					<text :class="item.proc_status=='完成'?'colortext': 'colortext-red' ">{{item.proc_status=='完成'?'已审批':'未审批'}}</text>
				</view> 
			</view>
			<view class="more" @click="mores(bordermores)">
				<text>{{bordermores?'更多>>':'收起<<'}}</text>
			</view>
		</view> -->
	<view class="kapian" v-if="contentBoole">
		<view class="" style="color: #BEBEBE;text-align: center;line-height: 60px;">暂无组织信息</view> 
		
	</view>
		<!-- <button class="btnBottm" type="primary"  size="default"  @tap="join(selectList[0])">新增组织</button> -->
	</view>
	
	
</template>

<script>
export default {
	data(){
		return{
			bordermore:true,
			shows:true,
			menuAudio:0,
			bordermores:true,
			numberlist:5,
			listtar:'',
			contentBoole:false,
			label:'',
			selectList: [
				{
					serviceName: 'srvzhsq_zyz_member_select', //志愿者
					title: '',
					appType: 'sqfw',
					pageType: 'add',
					resDatas: []
				},
				{
					serviceName: 'srvzhsq_organizie_member_select', //社会
					title: '',
					appType: 'sqfw',
					pageType: 'add',
					resDatas: []
				},
				{
					serviceName: 'srvzhsq_zyz_member_select', //志愿者
					title: '',
					appType: 'sqfw',
					pageType: 'add',
					resDatas: []
				},
				
			],
      query:{},
			listhome:[],
			listhomeall:[],
			columns:[]
		}
	},
	methods:{
		async getColumnsData(app = 'sqfw', service_name, use_type = 'proclist') {
		  //获取字段信息
		  let url = this.$api.select + '/' + app + '/select/srvsys_service_columnex_v2_select ';
		  let req = {
		    serviceName: 'srvsys_service_columnex_v2_select',
		    colNames: ['*'],
		    condition: [{ colName: 'service_name', value: service_name, ruleType: 'eq' }, { colName: 'use_type', value: use_type, ruleType: 'eq' }],
		    order: [{ colName: 'seq', orderType: 'asc' }]
		  };
		  let res = await this.$http.post(url, req);
		  if (res.data.data) {
			  
		    let cols = res.data.data;
		    return cols;
		  }
		},
		getMenu(serve){
			console.error(serve)
			let url =this.$api.select + "/sqfw/select/"+serve
			let req = {};
			req.serviceName =serve;
			req.colNames = ['*'];
			req.condition = [];
			req.order = [];
			req.proc_data_type="wait"
			req['page'] = {
				pageNo: 1,
				rownumber: 10
			};
			this.$http.post(url, req).then(res => {
				console.log(res)
					this.menuAudio=res.data.data.length
			})
		},
		more(val){
			uni.navigateTo({
				url: '../normal/list/list?query='+encodeURIComponent(JSON.stringify(this.query))
			});
			
		},
		audiobtn(val){
			uni.navigateTo({
				url: '../audit/auditList?serve='+val
			});
		},
		join(e){
			uni.navigateTo({
				url: '../normal/add/add?query=' + encodeURIComponent(JSON.stringify(this.query))
			});
	},
	detail(statenum,names,dress,session){
		uni.setStorage({
			key:'zuzhi',
		   data:{
			   'names':names,
			   'dress':dress,
			   'session':session 
		   },
		    success: function () {
		        console.log('success');
		    }
		});
		// <!-- 名称  地址  简介-->
		if(statenum!=="完成"){
			statenum=1
		}else{
			statenum=0
			}
		uni.navigateTo({
			url: './fromtext?state='+statenum
		});
	},
	getdata(service){
		let url = this.$api.select +"/sqfw/select/" +service
		let req = {};
		req.serviceName = service;
		req.colNames = ['*'];
		req.condition = [];
		req.order = [];
		req.proc_data_type="myall"
		req['page'] = {
			pageNo: 1,
			
			rownumber: this.numberlist
		};
		this.$http.post(url, req).then(res => {
			if(res.data.data.length==0){
				this.contentBoole=true
			}
			let newarr =[]
			for(let i  in res.data.data ){
				if(res.data.data[i].proc_status.indexOf("完成")==-1){
					delete  res.data.data[i]
				}
			}
			for(let i  in res.data.data ){
				if(res.data.data[i].proc_status!==''){
					newarr.push(res.data.data[i])
				}
			}
			this.listhome =newarr
			this.shows=false
		})
	},
	
 },
	mounted(){
		// this.getdataall()
	},
	onLoad(option){
			let listdatas  = (JSON.parse(decodeURIComponent(option.data||option.query)))
      this.query = listdatas
	  console.log("社会组织=====",listdatas)
	  this.getColumnsData('sqfw',listdatas.service_name).then(data=>{
		  console.log(data)
		  if(data){
			  this.columns = data
		  }
	  })
			console.log(listdatas)
			this.label = (listdatas.label)
			if(listdatas.label=="社会组织"){
				this.listtar='shzzlist'
			}else if(listdatas.label=="志愿者组织"){
				this.listtar='zyzzz'
			}
			this.serves=(listdatas.service_name)
			this.getdata(listdatas.service_name)
			uni.setNavigationBarTitle({
				title: listdatas.label
			});
			
			this.getMenu(listdatas.service_name)
		}
	}

</script>

<style>
	.content{
		width: 100%;
		background: #FFFFFF !important;
	}
	.topbar{
		height:75upx ;
		width: 100%;
		padding:8px 3px ;
		background: pink;
		position: relative;
	}
	.kapian{
		box-shadow: 0 0 26px 0 rgba(0,0,0,0.12);
		margin: 8px 0;
		padding: 8px;
		margin: 0 15px;
	}
	.fontstext{
		display: block;
		font-size: 15px;
		line-height: 75upx;
		text-align: center;
		color: #FFFFFF;
	}
	.btn{
		width: 50px;
		height: 20px;
		font-size: 13rpx;
		position: absolute;
		top: 30upx;
		right: 55upx;
	}
	.banner{
		display: block;
		height:400upx;
		width: 100%;
		background: #000000;;
	}
	.conent-gray{
		/* height: 380upx; */
		margin-bottom: 20upx;
		padding-bottom: 35upx;
		font-size: 16px;
	}
	.gray-tab{
	
	}
	.textbar{
	display: flex;
	justify-content: space-between;
	padding: 25upx 60upx 15upx 35upx;
	}
	.yangPeople,.groups{
		display: flex;
		justify-content: space-between;
		padding: 15upx 60upx 15upx 35upx;
	}
	.more {
		padding-right:60upx;
	}
	.more text{
		float: right;
		font-size: 15px;
		margin-top: 20upx;
	}
	.btnBottm{
		width: 92% ;
		background:#E51C23 ;
		margin: 0  auto  60upx;
	}
	.colortext{
		color: green;
	}
	.colortext-red{
		color: red;
	}
	.leftborder{
		border-left: 2px solid red;
		padding-left: 10upx;
		font-weight: 600;
		font-size: 16px
	}
	.contentla{
		font-size: 15px;
		margin-top: 15upx;
		border-bottom: 0.5px solid #EEEEEE;
		padding-bottom: 10upx;
	}
	.btnmenu{
		width: 80uxp;
		height: 40upx;
		line-height: 40upx;
		background: #E51C23;
		color: #FFFFFF;
		/* font-weight: 600; */
		font-size: 15px;
		letter-spacing: 2upx;
		padding: 3px;
		border-radius: 10upx;
	}
	.loadAnimItem {
	  box-sizing: border-box;
	  margin: 10upx 0;
	  width: 100%;
	  height: 40upx;
	  background-color: rgba(150, 150, 150, 0.1);
	  height: 40upx;
	  animation: loading 4s linear 0s infinite;
	}
/* 	@keyframes loading {
	  0% {
	    width: 0%;
	  }
	  50% {
	    width: 100%;
	  }
	  100% {
	    width: 0%;
	  }
	} */
</style>
