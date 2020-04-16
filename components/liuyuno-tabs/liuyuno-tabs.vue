<template>
	<view class="tab-box" id="tab-box" v-if="tabData.length > 0">
		<view class="horizontal">
			<scroll-view scroll-x class="bg-white nav">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="index==TabCur?'text-orange cur':''" v-for="(item,index) in tabData" :key="index" @tap="tabSelect($event,index)" :data-id="index">
						{{item}}
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'liuyuno-tabs',
		props: {
			tabData: {
				type: Array,
				default: () => []
			},
			defaultIndex: {
				type: Number,
				default: 0
			},
			underLinePadding: {
				type: Number,
				default: 10
			},
		},
		data() {
			return {
				tabList: [],
				tabListSlider: [],
				box: {
					left: 0,
					right: 0,
					top: 0,
					width: 0,
					height: 0,
					bottom: 0,
				},
				slider: {
					left: 0,
					width: 0,
					scrollLeft: 0
				},
				TabCur:0,
				activeIndex: 0
			};
		},
		watch: {
			tabData(value) {
				this.tabList = value;
				setTimeout(() => {
					// this.updateTabWidth();
				}, 0);
			},
		},
		mounted() {
			
			
			
		},
		methods: {
			tabSelect(e,i){
				this.TabCur = e.currentTarget.dataset.id;
				this.$emit('tabClick', i)
				
			},
			tabClick(index) {
				this.activeIndex = index;
				this.tabToIndex(index);
				this.$emit('tabClick', index);
			},
			
			tabToIndex(index) {
				uni.showModal({
					title:"导航",
					content:JSON.stringify(this.tabListSlider)
				})
				let _slider = this.tabListSlider[index];
				this.slider = {
					left: _slider.left + this.underLinePadding,
					width: _slider.width - this.underLinePadding * 2,
					scrollLeft: _slider.scrollLeft,
				}
			},
			
			updateTabWidth(index = 0) {
				let data = this.tabList;
				let self = this
				if (data.length == 0) return false;
				
				const query = uni.createSelectorQuery().in(this);
				
				query.select('#tab_' + index).boundingClientRect((res) => {
					let _prev_slider = this.tabListSlider[index - 1];
					// uni.showModal({
					// 	title:"ces12334555",
					// 	content:JSON.stringify(res)
					// })
					// uni.showModal({
					// 	title:"ce",
					// 	content:JSON.stringify(this.box)
					// })
					self.tabListSlider[index] = {
						left: res.left - this.box.left,
						width: res.width,
						scrollLeft: res.left - this.box.left - (_prev_slider ? _prev_slider.width : 0),
					}
					
					if (self.activeIndex == index) {
						self.tabToIndex(self.activeIndex);
					}

					index++;
					if (data.length > index) {
						self.updateTabWidth(index);
					}
				}).exec();
			}
		}
	}
</script>

<style lang="less">
	.tab-box {
		width: 100%;
		color: rgba(0, 0, 0, 0.8);
		display: flex;
		
		height: 90upx;
		background: #fff;
		font-size: 28upx;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
		position: relative;
		z-index: 10;
		overflow: hidden;
		.active {
			color: #e54d42;
		}
		.horizontal {
			width: 100%;
			.item {
				display: inline-block;
				text-align: center;
				padding: 0 30upx;
				height: 86upx;
				line-height: 90upx;
			}
			.underline {
				height: 4upx;
				background-color: #e54d42;
				border-radius: 3px;
				transition: .5s;
			}
		}
	}
</style>
