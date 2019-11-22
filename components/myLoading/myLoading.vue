<template>
	<view class="loading_box" v-show="is_loading" @click="switch_loading">
		<view class="loading">
			<view class="loader loader-17">
			  <view v-for="(item,index) in 9" :key="index" :class="'css-square '+`square`+(index+1)"></view>
			</view>
			 <!-- <view class="loader loader-4"></view> -->
		</view>
	</view>
</template>
 
<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			switch_loading(){
				this.$store.commit("switch_loading")
			}
		},
		computed:{
			is_loading(){
				return this.$store.state.loading
			}
		}
	}
</script>

<style>
@import "./loading.css";
.loading_box{
	width: 100%;
	height: 100%;
	/* background-color: rgba(0,0,0,0.4); */
	position: absolute;
	left: 0;
	top: 0;
	z-index: 10000;
}
.loading{
	width: 250upx;
	height: 200upx;
	background-color: rgba(0,0,0,0.5);
	color: #fff;
	position: relative;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	border-radius: 20upx;
}
.loader{
	display:inline-block;
	width:100%;
	height:200upx;
	overflow:hidden;
	/* background-color:#ccc; */
	position:relative;
}
</style>
