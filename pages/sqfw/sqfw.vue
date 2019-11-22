<template>
	<view class="contents">
		<image class="image-banner" src="../../static/img/sqbanners.png" mode=""></image>
		<view class="onelists" v-for="(item,index) in lists" :key="index" @click="navurl(item.url)">
			<image class="onesq" :src="item.img" ></image>
			<view class="text-bxos">
				<text class="name-bowe">{{item.name}}</text>
				<text class="smalltext">{{item.english}}</text>
			</view>
			<view class="leftclick">
				<image class="rights" src="../../static/img/rights.png" mode=""></image>
			</view>
		</view>
		<view class="middle"></view>
	</view>
</template>

<script>
export default {
	data(){
		return{
				lists:[
					{"img":"../../static/img/js.png","name":"社区介绍","english":'Community introduce',"url":"./sqjs"},
					{"img":"../../static/img/hd.png","name":"社区活动","english":'community activity ',"url":"./sqjs"},
					{"img":"../../static/img/lt.png","name":"社区论坛","english":'community forum',"url":"./sqjs"},
					{"img":"../../static/img/fws.png","name":"第三方服务","english":'OTT services',"url":"./dsf"},
				]
		}
	},
	methods:{
		navurl(e){
			console.log(e)
			uni.navigateTo({
				url: e,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		}
	},
}

</script>

<style>
	.contents{
		width: 100%;
		background: #FFFFFF !important;
		height: 100%;
		overflow-y: hidden;
		}

	.image-banner{
		width: 100%;
		height: 43vh;
	}
	.onelists{
		display: flex;
		background: #FFFFFF !important;
		/* margin: 10upx 0; */
		padding: 15upx 0;
	}
	.onesq{
		padding: 0 40upx;
		height: 120upx;
		width: 140upx;
		margin-top: 6px;
	}
	.text-bxos {
		padding: 23upx 0;
	}
	.text-bxos text{
		display: block;
	}
	.name-bowe{
		font-weight: 600;
		letter-spacing: 2.5px;
		font-size: 17px;
	}
	.smalltext{
		font-size: 14px;
		color: #BEBEBE;
	}
	.rights{
		display: block;
		height: 50upx;
		width: 48upx;
		margin-top: 55upx;
	}
	.leftclick{
		padding-right: 23upx;
		position: absolute;
		right: 0;
	}
		.leftclick image{
			display: block;
		}
	.middle{
		height: 30upx ;
		background: #FFFFFF;
	}
	.conent-gray{
		background: #FFFFFF !important;
	}
	
</style>