<template>
	<view class="content-gggs">
		<image :src="src" mode="" class="banners"></image>
		<view class="titleone" >{{titletop}}</view>
		<view class="" v-if="listshow"> 
			<view class="" style="display: flex;padding: 8px 10px;justify-content: space-between;">
				<view class="" style="width:200px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
				<view class="" style="width:83px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
			</view>
			<view class="" style="display: flex;padding: 8px 10px;justify-content: space-between;">
				<view class="" style="width:200px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
				<view class="" style="width:83px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
			</view>
			<view class="" style="display: flex;padding: 8px 10px;justify-content: space-between;">
				<view class="" style="width:200px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
				<view class="" style="width:83px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
			</view>
			<view class="" style="display: flex;padding: 8px 10px;justify-content: space-between;">
				<view class="" style="width:200px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
				<view class="" style="width:83px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
			</view>
			<view class="" style="display: flex;padding: 8px 10px;justify-content: space-between;">
				<view class="" style="width:200px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
				<view class="" style="width:83px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
			</view>
			<view class="" style="display: flex;padding: 8px 10px;justify-content: space-between;">
				<view class="" style="width:200px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
				<view class="" style="width:83px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
			</view>
			<view class="" style="display: flex;padding: 8px 10px;justify-content: space-between;">
				<view class="" style="width:200px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
				<view class="" style="width:83px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
			</view>
			<view class="" style="display: flex;padding: 8px 10px;justify-content: space-between;">
				<view class="" style="width:200px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
				<view class="" style="width:83px ; height: 25px; background: rgba(150, 150, 150, 0.1);"></view>
			</view>
		
		</view>

		<view class="contentBox" @tap="detaile(item)"   v-for="(item,index) in datalist" :key="index">

			<text class="crips"></text>
			
			<text class="content-news" v-if="item.activity_title">{{item.activity_title}}</text>
			<text class="content-news" v-else>{{item.bt||item.hdbt}}</text>
			
			<text class="yeardata">{{  (item.create_time).substring(0,11)}}</text>
		</view>
	
	
		<view class="morea" @click="toMore()">更多>></view>
			
<!-- 		<view class="" v-if="titlebar=='sqhd'">
			<view class="" >
				<view class="titleone" >{{titletwo}}</view>  
			</view>
			
				
			<view class="contentBox" @tap="detaile(item,"1")"   v-for="(item,index) in datalisttwost" :key="index">
				<text class="crips"></text>
				<text class="content-news" v-if="item.activity_title">{{item.activity_title}} <span class="baing">报名中</span> </text>  
				<text class="yeardata">{{  (item.create_time).substring(0,11)}}</text>
			</view>
			<view class="morea" @click="toMoretwo()">更多>></view>
		</view> -->
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				datalist:[],
				listshow:true,
				classes:'/zhdj',
				src:'../../static/img/dj.png',
				titletwo:'',
				numberpage:7,
				datalisttwost:[],
				titlebar:'',
				titletop:'',
        query:'',
			}
		},
		methods:{
			detaile(item,val){
				uni.navigateTo({
					url:'../sqfw/sqxq?query='+ encodeURIComponent((JSON.stringify(item)).replace(/%/g, '%25'))+'&num=1'
				})
			},
			getdata(serve){
				
				let url =this.$api.select +  this.classes+ "/select/"+serve
				let req = {};
				req.serviceName =serve;
				req.colNames = ['*'];
				req.condition = [];
				req.order = [];
				
				req['page'] = {
					pageNo: 1,
					rownumber: this.numberpage
				};
				this.$http.post(url, req).then(res => {
				
					this.datalist=res.data.data
					console.log(res.data.data)
					this.listshow=false
				})
			},
			toMore() {
				uni.navigateTo({
					url: '../normal/list/list?query='+ encodeURIComponent(JSON.stringify(this.query))
				});
			},
			toMoretwo() {
				uni.navigateTo({
					url: '../normal/list/list?query='+ encodeURIComponent(JSON.stringify(this.query))
				});
			}
		},
		onLoad(option){
			 
			 let listdatas  = (JSON.parse(decodeURIComponent(option.data||option.query)))
			 let liststr=''
			console.log(listdatas)
      this.query = listdatas
			 if(listdatas.label=="党建活动"){
				  liststr = (listdatas.children[2].service_name)
			 }else if(listdatas.label=="公示公告"){
				 liststr = (listdatas.children[0].service_name)
			 }else if(listdatas.label=="活动记录"||listdatas.label=="活动安排"){
				  liststr = (listdatas.service_name)
			 }
				 console.log(liststr)
			
			 // let service_name = liststr.slice((liststr.lastIndexOf('/'))+1,liststr.indexOf('?'))
			 
			if(liststr=="srvzhsq_djhdjl_djhd_select"){
				this.titlebar="djjl"
				this.titletop = "党建活动记录"
				this.src="../../static/img/dj.png"
				uni.setNavigationBarTitle({
				  title: "党建活动记录"
				});
			}else if(liststr=="srvzhsq_gsgg_select"){
				this.titlebar="gggg"
				this.titletop = "公告公示"
				this.src="../../static/img/gs.png"
				uni.setNavigationBarTitle({
				  title: "公告公示"
				});
			}else if(liststr=="srvzhsq_activity_record_select" ){
				this.titlebar="sqhd"
				this.classes = "/sqfw"
						this.src="../../static/img/hdsss.png"
				this.titletop = "活动记录"
				uni.setNavigationBarTitle({
				  title: "活动记录"
				});
			}else if(liststr=="srvzhsq_activity_arrange_select"){
				this.titlebar="hdap"
				this.classes = "/sqfw"
				this.titletop = "活动安排"
				uni.setNavigationBarTitle({
				  title: "活动安排"
				});
			}
			this.getdata(liststr)
			// this.getdatalist()
		}
	}
</script>

<style>
	.content-gggs{
		width: 100%;
	}
	.baobtn{
		position: relative;
		top: 20upx;
		line-height: 45upx;
		height: 45upx;
		margin-right: 22upx;
			width: 80uxp;
			background: #E51C23;
			color: #FFFFFF;
			font-size: 15px;
			letter-spacing: 2upx;
			padding: 3px;
			border-radius: 10upx;
	}
	.banners{
		height: 400upx;
		display: block;
		width: 100%;
	}
	.titleone{
		margin: 20upx;
		padding: 0 10upx;
		border-left: 2px solid red;
		font-weight: 600;
	}
	.contentBox text {
		display: table-cell;
	}
	.yeardata{
		color: #666666;
		font-size: 15px;
		position: absolute;
		top: 20upx;
		right: 20upx;
	}
	.contentBox {
		padding: 20upx;
		display: flex;
		position: relative;
	}
	.crips{
		border-radius: 50%;
		height: 15upx;
		width: 15upx;
		background: red;
		position: absolute;
		top:35upx;
	}
	.content-news{
		width: 400upx;
		margin-left: 30upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 15px;
	}
	.morea{
		position: relative;
		right: -620upx;
		font-size: 15px;
		color: red;
		margin-bottom: 50upx;
	}
	.baing{
		border: 0.5px solid red;
		line-height: 10px !important;
		font-size: 13px;
		padding: 1px;
		border-radius: 5px;
		margin-left: 7px !important;
		color: red;
	}
</style>
