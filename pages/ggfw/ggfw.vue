<template>
	<view class="content">
		<view class="Choice" v-for="(item,index) in array"  :key="index" @click="navto(item.url)">
			<view class="box-content" style="">
				<image class="img" :src="item.img" mode=""></image><text class="texsr">{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				array:[
					{'img':'../../static/img/lz.png','title':'廉租房申请流程','url':'./fwlc?query=lzfxx'},
					{'img':'../../static/img/gz.png','title':'公租房申请流程','url':'./fwlc?query=gzfxx'},
					]
			}
		},
		methods: {
			navto(url){
				 uni.navigateTo({
				 	url:url
				 })
			}
		}
	}
</script>

<style>
	.content{
		width: 100%;
		background: #fff !important;
	}
	.img{
		height: 150upx;
		width: 150upx;
		border-radius: 20upx;
		margin-right: 50upx;
	}
	.texsr{
		font-size: 17px;
		font-weight: 600;
		line-height: 150upx;
		}
		.box-content{
			display: flex;
			padding: 25upx;
			    box-shadow: 0 0 26px 0 rgba(0,0,0,.15);
				margin: 30upx  30upx  15upx  30upx;
				border-radius: 25upx;
		}
</style>
