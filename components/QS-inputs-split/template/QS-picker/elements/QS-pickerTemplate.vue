<template>
	<view :style="{'z-index': zIndex}" @touchmove.stop="voidFc()" @tap.prevent.stop="voidFc()">
		<view class="mask" :class="[(showPicker?'show':'hide')]" :style="{'z-index': (Number(zIndex) + 1)}" @touchmove.prevent.stop="voidFc()"
		 @tap.prevent.stop="hide()"></view>
		<view class="flex_column" :class="[(mode||'middle'), (showPicker?'show':'hide')]" :style="{'z-index': (Number(zIndex) + 2)}"
		 @touchmove.prevent.stop="voidFc()" @tap.prevent.stop="voidFc()">
			<view class="flex_column" :class="(mode||'middle') + '_view'" :style="{'height': heightSize}">
				<view v-if="mode==='bottom'" class="flex_row_between_c width100 padding20rpx" :style="{'font-size': titleSize, 'background-color': bgColor_title||'#f8f8f8'}">
					<view class="flex_row_none_c width250rpx " :style="{'color': buttonSet.cancleColor||'#ADADAD'}" @tap="hide()">
						{{buttonSet.cancleName||'取消'}}
					</view>
					<view class="flex_row_c_c width250rpx" :style="{'color': titleColor||'#999'}">
						{{title||''}}
					</view>
					<view class="flex_row_e_c width250rpx" :style="{'color': buttonSet.confirmColor||'#3399FF'}" @tap="confirm()">
						{{buttonSet.confirmName||'确定'}}
					</view>
				</view>
				<view v-if="mode==='middle' && title" class="flex_row_c_c width100 padding20rpx" :style="{'font-size': titleSize, 'background-color': bgColor_title||'#f8f8f8', 'color': titleColor||'#999'}">
					{{title||''}}
				</view>
				
				<slot></slot>
				
				<view v-if="mode==='top'" class="flex_row_between_c width100 padding20rpx" :style="{'font-size': titleSize, 'background-color': bgColor_title||'#f8f8f8'}">
					<view class="flex_row_none_c width250rpx " :style="{'color': buttonSet.cancleColor||'#ADADAD'}" @tap="hide()">
						{{buttonSet.cancleName||'取消'}}
					</view>
					<view class="flex_row_c_c width250rpx" :style="{'color': titleColor||'#999'}">
						{{title||''}}
					</view>
					<view class="flex_row_e_c width250rpx" :style="{'color': buttonSet.confirmColor||'#3399FF'}" @tap="confirm()">
						{{buttonSet.confirmName||'确定'}}
					</view>
				</view>
			</view>
			<view class="flex_row" style="margin-top: 20px;" v-if="mode==='middle'">
				<view class="flex_row_c_c width50">
					<button :type="buttonSet.cancelType||'default'" @tap="hide()" :style="classObj.btnSize + (buttonSet.cancelStyle||'')">{{buttonSet.cancelName||'取消'}}</button>
				</view>
				<view class="flex_row_c_c width50">
					<button :type="buttonSet.confirmType||'primary'" @tap="confirm()" :style="classObj.btnSize + (buttonSet.confirmStyle||'')">{{buttonSet.confirmName||'确定'}}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import _app from '../../../js/app.js';

	const wH = _app.Sys.windowHeight;
	const wW = _app.Sys.windowWidth;
	export default {
		name: 'QS-pickerTemplate',
		props: {
			height: { //picker高度
				type: Number,
				default: 0
			},
			fontScale: { //picker内文字大小
				type: Number,
				default: .034
			},
			buttonSet: { //按钮设置
				type: Object,
				default () {
					return {};
				}
			},
			title: { //title标题
				type: String,
				default: ''
			},
			mode: {
				type: String,
				default: 'bottom'
			},
			zIndex: {
				type: [Number, String],
				default: 9999
			},
			bgColor_title: {
				type: String,
				default: '#F8F8F8'
			},
			titleColor: {
				type: String,
				default: '#999'
			}
		},
		data() {
			const defaultSize = this.mode === 'middle'?.3:.45;
			// console.log('defaultSize:' + defaultSize);
			const height = this.height || defaultSize;
			// console.log('height:' + height);
			const countHeight = wH * (Number(height));
			// console.log('countHeight:' + countHeight);
			const heightSize = countHeight + 'px';
			// console.log('heightSize:' + heightSize);
			
			const defaultFontScale = this.fontScale || .034;
			// console.log('defaultFontScale:' + defaultFontScale);
			const titleSizeScale = Number(defaultFontScale) + .003;
			// console.log('titleSizeScale:' + titleSizeScale);
			const countTitleSize = wW * titleSizeScale;
			// console.log('countTitleSize:' + countTitleSize);
			const titleSize = countTitleSize + 'px';
			// console.log('titleSize:' + titleSize);
			
			const countContentSize = wW * Number(defaultFontScale);
			// console.log('countContentSize:' + countContentSize);
			const contentSize = countContentSize + 'px';
			// console.log('contentSize:' + contentSize);
			return {
				showPicker: false,
				classObj: {
					btnSize: 'font-size: ' + (wW * (this.fontScale + .005)) + 'px;',
				},
				heightSize,
				titleSize,
				contentSize
			};
		},
		watch: {
			height() {
				this.countPickerHeight();
			}
		},
		methods: {
			countPickerHeight() {
				const defaultSize = this.mode === 'middle'?.3:.45;
				const height = this.height || defaultSize;
				this.$set(this, 'heightSize', (wH * height + 'px'));
			},
			confirm() {
				this.$emit('confirm');
			},
			show() {
				this.showPicker = true;
			},
			hide() {
				this.showPicker = false;
			},
			voidFc() {}
		}
	}
</script>

<style scoped>
	@import url("../css/QS-picker.css");
</style>
