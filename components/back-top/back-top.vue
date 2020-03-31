<template>
	<view v-if="scrollTop>400" class="backTop" :class="{'mescroll-fade-in':isShowToTop}" @click="toTopClick">
		<image :src="src" mode="widthFix" />
	</view>
</template>

<script>
	export default {
		name: "backTop",
		props: {
			src: {
				type: String,
				default: ''
			},
			id: {
				type: String,
				default: ''
			},
			scrollTop: {
				type: Number,
				default: 0
			},
			tab: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isShowToTop: true
			}
		},
		methods: {
			toTopClick() {
				this.isShowToTop = false; // 回到顶部按钮需要先隐藏,再执行回到顶部,避免闪动
				if (this.tab) {
					this.$emit('setScrollTop');
				} else {
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					});
				}
			}
		},

	}
</script>

<style>
	
	.mescroll-lazy-in,.mescroll-fade-in {
		-webkit-animation: mescrollFadeIn .3s linear forwards;
		animation: mescrollFadeIn .3s linear forwards;
	}
	.backTop {
		z-index: 999;
		position: fixed;
		right: 20upx;
		bottom: 120upx;
		/* #ifdef H5 */
		bottom: 220upx;
		/* #endif */
		width: 72upx;
		height: 72upx;
		border-radius: 50%;
		transform: translateZ(0);
		-webkit-transform: translateZ(0);
	}
	.backTop image {
		width: 100%;
		height: 100%;
	}
</style>
