<template>
	<view class="detail_wrap">
		<view v-if="detail.title">
		  <view class="title">{{ detail.title }}</view>
		  <view class="subtitle">发布时间：{{ detail.create_time }}</view>
		  <view class="content" v-html="detail.content" v-if="detail.content"></view>
		  <view class="content" v-html="detail.nr" v-if="detail.nr"></view>
		</view>
    <view v-else>
      <view class="title">{{ detail.pxbt }}</view>
      <view class="subtitle">发布时间：{{ detail.create_time }}</view>
      <view class="content" v-html="detail.pxjj" v-if="detail.pxjj"></view>
      <view class="content" v-html="detail.nr" v-if="detail.nr"></view>
    </view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			detail: {}
		};
	},
	methods: {},
	onLoad(options) {
		let query = JSON.parse(options.query);
		console.log(query);
		this.detail = query;
		if (this.detail.nr) {
			uni.setNavigationBarTitle({
				title: '学习心得详情'
			});
		} else if (this.detail.pxjj) {
			uni.setNavigationBarTitle({
				title: '培训安排详情'
			});
		} else {
			uni.setNavigationBarTitle({
				title: '详情'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.detail_wrap{
		width: 100%;
		box-sizing: border-box;
		padding: 0 10px;
	}
	.title{
		width: 100%;
		// height: 60upx;
		font-size: 16px;
		font-weight: 600;
		line-height: 60upx;
		text-align: center;
	}
	.subtitle{
		font-size: 12px;
		text-align:center;
		color:#999;
	}
	.content{
		font-size: 14px;
	}
</style>
