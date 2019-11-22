<template>
	<view>
		<scroll-view style="height:200upx;" class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-left="120">
			<view id="demo1" v-for="(item,index) in listData" :key="index" class="scroll-view-item_H uni-bg-red">A</view>
			<!-- <view id="demo2" class="scroll-view-item_H uni-bg-green">B</view>
			<view id="demo3" class="scroll-view-item_H uni-bg-blue">C</view> -->
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			listData:Array
		}
	}
</script>

<style>
	.scroll-view_H{
		
	}
	
</style>
