<template>
	<view>
		<view class="tag-line">
			<view class="bx-tagline">
				<!-- <view @click="lineClick()" class="bx-item bx-text-blue">
					<view class="content tag-item">{{ topVal ? topVal : '中国' }}</view>
				</view> -->
				<view
					@click="lineClick(item, index)"
					class="bx-item bx-text-blue"
					v-for="(item, index) in lineDataDefault"
					:key="index"
					:class="{
						'line-end': lineDataDefault.length - 1 === index && !showSelect
					}"
				>
					<view class="content tag-item">{{ item.name }}</view>
				</view>
				<view class="bx-item bx-text-yellow line-end" v-if="showSelect || (lineData.length === 0 && areaList.length > 0)">请选择</view>
			</view>
			<view class="bx-tagbox" v-if="showSelect">
				<view class="bx-item  bx-text-white bx-bg-blue radius" @click="selectArea(item)" v-for="(item, index) in areaList" :key="index">
					<view class="content">{{ item.name }}</view>
				</view>
				<view class="bx-item  bx-text-white bx-bg-yellow radius" @click="showMore" v-if="isShowMore"><view class="content">更多</view></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'cascader', //层叠选择器内层，ui渲染
	data() {
		return {
			lineData: [],
			area: {},
			breadCrumbs: ''
		};
	},
	methods: {
		showMore() {
			this.$emit('show-more');
		},
		selectArea(item) {
			console.log(item);
			this.$emit('tag-click', item);
			this.lineData.push(item);
		},
		lineClick(item, index) {
			// if (index < this.lineData.length - 1) {
			// 	this.lineData = this.lineData.slice(0, index + 1);
			// }
			// if (!item) {
			// 	this.lineData = [];
			// }
			this.$emit('line-click', item, index);
		}
	},
	created() {},
	watch: {
		lineDataDefault: {
			deep: true,
			handler: function(newV, oldV) {
				console.log('lineDataDefaultwatch中：', newV);
				this.lineData = newV;
			}
		},
		areaList: {
			deep: true,
			handler: function(newV, oldV) {
				this.areaList = newV;
				this.lineData = this.lineDataDefault;
				// console.log('areaListwatch中：', newV, thi.lineData);
			}
		}
	},
	mounted() {
		// console.log('lineDataDefault', this.lineDataDefault);
		// if (this.lineDataDefault && lineDataDefault.length > 0) {
		this.lineData = this.lineDataDefault;
		// }
	},
	props: {
		// 是否显示‘请选择’提示
		showSelect: {
			type: Boolean,
			default: true
		},
		// 最顶层的line的文字
		topVal: {
			type: String,
			default: '中国'
		},
		areaList: {
			//区域数据
			type: Array,
			default: () => {
				[];
			}
		},
		// line数据的默认值
		lineDataDefault: {
			type: Array,
			default: () => {
				[];
			}
		},
		isShowMore: {
			type: Boolean,
			default: false
		},
		lineColor: {
			type: String,
			default: 'yellow'
		},
		tagColor: {
			type: String,
			default: 'yellow'
		},
		tagBackground: {
			type: String,
			default: 'yellow'
		}
	}
};
</script>

<style lang="scss">
.tag-line {
	.bx-tagline {
		padding-top: 20upx;
		.bx-item {
			padding-left: 100upx;
			height: 80upx;
			position: relative;
			display: flex;
			&::before {
				content: 'O';
				display: block;
				position: absolute;
				font-size: 20upx;
				top: 0px;
				z-index: 9;
				background-color: #ffffff;
				width: 25px;
				height: 25px;
				text-align: center;
				border: none;
				line-height: 25px;
				left: 18px;
			}
			&::after {
				content: '';
				display: block;
				position: absolute;
				width: 0.5px;
				background-color: #ddd;
				left: 30px;
				height: 80upx;
				top: 0;
				z-index: 8;
			}
			.content {
				min-width: 30%;
				height: 50rpx;
				line-height: 50rpx;
				top: 36rpx;
				font-size: 36rpx;

			}
			.delete-button {
				font-size: 40upx;
			}
		}
		.placeholder {
			width: 100%;
		}
		.line-end {
			&::after {
				content: '';
				display: block;
				position: absolute;
				width: 0.5px;
				background-color: #ddd;
				left: 30px;
				height: 0upx;
				top: 0;
				z-index: 8;
			}
		}
	}
	.bx-tagbox {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		min-height: 200upx;
		width: 90%;
		margin: 0 auto;
		.bx-item {
			min-width: 100upx;
			// height: 40upx;
			display: inline-block;
			margin-right: 10upx;
			margin-bottom: 10upx;
			.content {
				padding: 8upx 16upx;
			}
		}
		.radius {
			border-radius: 10upx;
		}
	}

	/**文字颜色*/
	.bx-text-white {
		color: #fff; //明黄
	}
	.bx-text-yellow {
		color: #fbbd08; //明黄
	}
	.bx-text-red {
		color: #e54d42; //嫣红
	}
	.bx-text-orange {
		color: #f37b1d; //桔橙
	}
	.bx-text-green {
		color: #39b54a; //森绿
	}
	.bx-text-cyan {
		color: #1cbbb4; //天青
	}
	.bx-text-blue {
		color: #0081ff; //海蓝
	}
	.bx-text-black {
		color: #333333; //墨黑
	}
	/**背景色*/
	.bx-bg-yellow {
		background-color: #fbbd08; //明黄
	}
	.bx-bg-red {
		background-color: #e54d42; //嫣红
	}
	.bx-bg-orange {
		background-color: #f37b1d; //桔橙
	}
	.bx-bg-green {
		background-color: #39b54a; //森绿
	}
	.bx-bg-cyan {
		background-color: #1cbbb4; //天青
	}
	.bx-bg-blue {
		background-color: #0081ff; //海蓝
	}
	.bx-bg-black {
		background-color: #333333; //墨黑
	}
	/**边框色*/
	.bx-border-yellow {
		border: 1px solid #fbbd08; //明黄
	}
	.bx-border-red {
		border: 1px solid #e54d42; //嫣红
	}
	.bx-border-orange {
		border: 1px solid #f37b1d; //桔橙
	}
	.bx-border-green {
		border: 1px solid #39b54a; //森绿
	}
	.bx-border-cyan {
		border: 1px solid #1cbbb4; //天青
	}
	.bx-border-blue {
		border: 1px solid #0081ff; //海蓝
	}
	.bx-border-black {
		border: 1px solid #333333; //墨黑
	}
}
</style>
