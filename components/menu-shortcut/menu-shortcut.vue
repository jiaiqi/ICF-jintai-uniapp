<template>
	<view class="uni-menuAll">
		<text class="uni-menuAll-title">快捷入口</text>
		<text class="uni-menuAll-con" @tap="bindAll">全部 ></text>
	</view>
</template>

<script>
	export default{
		name:"menu-shortcut",
		data(){
			return {}
		},
		methods:{
			bindAll() {
			    uni.navigateTo({
			        url: '../../pages/navs/navs'
			    });
			},
		}
	}
</script>

<style lang="scss" scoped>
	.uni-menuAll{
		overflow: hidden;
		background-color: white;
		padding:25upx;
		border-bottom: 2px solid #F5F5F5;
		display: flex;
		justify-content: space-between;
	}
	.uni-menuAll-title{
		font-weight: 700;
	}
	.uni-menuAll-con{
		padding-right: 5px;
		color: #C8C8CD;
	}
</style>
