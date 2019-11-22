<template>
	<view class="content">
		<view class="" style="padding: 10px;">
			<text style="font-size: 17px;font-weight: 600; border-left: 2px solid red;padding: 5px;">社区排行榜</text>
		</view>
		<view class="" v-for="(item,index) in listhome" :key="index" @click="navxq(item.sqname,index,item.sqphone,item.sqaddress)">
			<view class="content-box">
				<image class="imageHotel" src="../../static/img/hotels.png" mode="">
					<text class="topone">Top{{index+1}}</text>
				</image>
				<view class="listtext">
					<view class="" style="display: flex;position: relative;">
						<text style="display: block;font-weight: 600;font-size: 16px;">{{item.sqname}}</text> 
						 <view class="" style="display: flex">
						 	<view class="calls">车位数 : <view class="callnumber">{{item.sqspace}}</view></view>
						 </view>
					</view>
					<view class="" style="display: flex;font-size: 15px;">
					<text>小区地址：</text><text class="textline">{{item.sqaddress}}</text>
					</view>
					<view class="" style="display: flex;font-size: 15px;">
						<text>小区电话：</text><text>{{item.sqphone}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				listhome:[]
			}
		},
		methods:{
			getdata(){
				let url = "http://39.98.203.134:8081/sqfw/select/srvzhsq_information_select?srvzhsq_information_select"
				let req = {};
				req.serviceName = 'srvzhsq_information_select';
				req.colNames = ['*'];
				req.condition = [];
				req.order = [];
				req['page'] = {
					pageNo: 1,
					rownumber: 10
				};
				this.$http.post(url, req).then(res => {
					console.log(	res)
					this.listhome =res.data.data
				})
			},
			navxq(e,index,phone,dress){
				console.log(e,index)
				uni.setStorage({
					key:'name',
				   data:{
					   'sqname':e,
					   'num':index,
					   'phone':phone,
					   'dress':dress
				   },
				    success: function () {
				        console.log('success');
				    }
				});
				uni.navigateTo({
					url: './sqxq',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		onLoad(){
			this.getdata()
		}
	}
</script>

<style>
	.content{
		width: 100%;
		background: #FFFFFF !important;
	}
	.imageHotel{
		display: block;
		height: 200upx;
		width:200upx;
		border-radius: 18upx;
		margin-right: 25upx;
	}
	.content-box{
		display: flex;
		padding: 20upx;
		border-bottom:  0.5px solid #E2E3DC;
	}
	.listtext text{
		line-height: 60upx;
		margin-top: 5upx;
	}
	.topone{
		position: absolute;
		left: 152upx;
		height: 40upx;
		width: 70upx;
		background: #FB6A6A;
		font-size: 12px;
		padding: 1px;
		box-sizing: border-box;
		border-top-right-radius: 18upx;
		border-bottom-left-radius: 18upx;
		color: #FFFFFF;
	}
	.calls{
		font-size: 13px;
		border: 1px solid #ff6436;
		height: 40upx;
		vertical-align: middle;
		color: #ff6436;
		position: absolute;
		right: -15upx;
		top: 15upx;
		width: 160upx;
		padding: 0 1px;
	}
	.textline{
		display: block;
		width: 300upx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.callnumber{
		display: inline-block;
		width: 50upx;
		text-align: center;
		font-size: 13px;
		color: #ff6436;
	}
</style>
