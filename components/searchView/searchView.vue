<template>
	<view class="form-view">
		<form @submit.stop="formSubmit" @reset.stop="formReset">
			<text>请选择查询条件</text>
			<mescroll-uni :down="downOption" :up="upOption"  @down.stop="downCallback"  @up.stop="loadData" @init.stop="mescrollInit">
			<view class="">
				
			</view>
			</mescroll-uni>
		</form>
	</view>
</template>

<script>
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
	export default {
		components:{MescrollUni},
		data() {
			return {
				showSearchView:false, // 弹出层显示隐藏
				mescroll: null, // mescroll实例对象
				// 下拉刷新的配置
				downOption: { 
					use: true, // 是否启用下拉刷新; 默认true
					auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
				},
				// 上拉加载的配置
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
					auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					isLock: false, // 是否锁定上拉加载 (可用于不触发upCallback,只保留回到顶部按钮的场景)
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 3, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
			};
		},
		onLoad() {
			
		},
		methods: {
			loadData () {
				
			},
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/**
			 * @name 触底加载
			 */
			scrolltolower(mescroll){
				let self = this
				self.mescroll = mescroll
				this.loadData(self.mescroll)
			},
			/**
			 * @name 触ding加载
			 */
			downCallback(mescroll){
				mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
		},
		// 必须注册滚动到底部的事件,使上拉加载生效
		onReachBottom() {
			this.mescroll && this.mescroll.onReachBottom();
		},
		// 必须注册列表滚动事件,使下拉刷新生效
		onPageScroll(e) {
			this.mescroll && this.mescroll.onPageScroll(e);
		},
	}
</script>

<style lang="less">

</style>
