<template>
	<view class="conbox">
		<view class="">
			<img :src="imgurl" class="banner" mode=""></img>
		</view>
		<view class="contentjs" >
			<view v-if="datalist[0]" style="font-size: 17px; font-weight: 600;margin-bottom: 6px;">{{datalist[0].sqname}}</view>
			<view class="" style="font-size: 16px;line-height: 25px;" v-if="datalist[0]">
				<view >总人口数：{{datalist[0].sqpopulation}}</view>
				<view >家庭数：{{datalist[0].sqfamily}}</view>
				<view >车位数：{{datalist[0].sqspace}}</view>
				<view >社区电话：{{datalist[0].sqphone}}</view>
				<view >社区地址：{{datalist[0].sqaddress}}</view>
			</view>
			
		</view>
		<view class="boxcontent">
			<view class="" style="font-weight: 600; margin-bottom:14px ; font-size: 18px;">
				社区简介：
			</view >
				<view v-if="datalist[0]" class="conts" style="font-size: 16px;line-height: 25px;" v-html="parse">
				</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				datalist:[],
				imgurl:'../../static/img/111.jpg',
				parse:''
			}
		},
		methods:{
			getdata(index){
				let url = this.$api.select+'/sqfw/select/srvzhsq_information_select'
				let req = {};
				req.serviceName = 'srvzhsq_information_select';
				req.colNames = ["id", "sqno","sqname", "sqfamily",
				 "show_banner","banner_img", "sqspace", "sqprincipal", "sqphone", "sqtrapeze",
				  "latitude","sqimg","sqaddress","sqbrief",
				  "create_time","create_user","create_user_disp","modify_user","modify_user_disp","sqpopulation"];
				req.condition = [{colName: "id", value: index, ruleType: "eq"}];
				hisVer: true
				this.$http.post(url, req).then(res => {
					console.log(res)
					this.datalist=res.data.data
					this.parse = JSON.parse(JSON.stringify(res.data.data[0].sqbrief.replace(/\<img/gi, '<img width=100% height=100% style="width:100%"')));
				})
			},
		},
		onLoad(id){
			console.log(id,id.img)
			this.getdata(id.id)
			this.imgurl =JSON.parse(decodeURIComponent(id.img))
		}
	}
</script>

<style>
	.conbox{
		width: 100%;
		background: #F0F0F0;
		position: relative;
	}
	.banner{
		display: block;
		height:400upx;
		width: 100%;
		background: #000000;;
	}
	.contentjs{
		display: block;
		background: #fff;
		height: 400upx;
		box-sizing: border-box;
		margin: 0 35upx;
		position: absolute;
		top: 340upx;
		width: calc(100% - 70upx);
		border-radius:20upx ;
		overflow: hidden;
		padding: 28upx;
	}
	.boxcontent{
		display: block;
		background: #fff;
		box-sizing: border-box;
		margin: 380upx  35upx 50upx 35upx;
		width: calc(100% - 70upx);
		border-radius:20upx ;
		overflow: hidden;
		padding: 28upx;
	}
	.conts img{
		display: block !important;
		background: #fff;
		height: 350upx !important;
		box-sizing: border-box;
		width: calc(100% - 70upx) !important;
		border-radius:20upx ;
		padding: 28upx;
	}
</style>
