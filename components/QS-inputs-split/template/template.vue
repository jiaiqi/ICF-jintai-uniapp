<template>
	<view 
	class="padding_20rpx_30rpx position_relative" 
	:class="[getLayout]" 
	:style="'font-size:' + fontSize + 'rpx;width:' + width + ';'">
		<text 
		class="marginRight5 text_nowrap padding_10rpx_15rpx" 
		:class="[getTitleLayout, getWidthMode]"
		:style="'flex:' + (titleFlex||1) + ';' + 'color:' + (titleColor||'#999') + ';' + (titleStyle||'')"
		v-if="title&&!titleHide">
			<text 
			class="fontColorF1505C" 
			v-if="required">
				{{requiredSign || '*'}}
			</text> 
			{{title}}
		</text>
		<view :class="itemDisabled?'pe_none': 'pe_auto'" :style="'flex:' + (contentFlex||4) + ';' + (contentStyle||'')">
			<slot></slot>
		</view>
		<view 
		class="flex_row_c_c itemDisabled" 
		:class="itemDisabled?'show': ''" />
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			titleHide: {
				type: Boolean,
				default: false
			},
			fontSize: {
				type: Number,
				default: 30
			},
			width: {
				type: String,
				default: '100%'
			},
			titleLayout: {
				type: String,
				default: 'default'
			},
			titleFlex: {
				type: Number,
				default: 1
			},
			contentFlex: {
				type: Number,
				default: 4
			},
			titleStyle: {
				type: String,
				default: ''
			},
			contentStyle: {
				type: String,
				default: ''
			},
			layout: {
				type: String,
				default: 'row'
			},
			required: {
				type: Boolean,
				default: false
			},
			requiredSign: {
				type: String,
				default: '*'
			},
			itemDisabled: {
				type: Boolean,
				default: false
			},
			titleColor: {
				type: String,
				default: '#999'
			}
		},
		computed: {
			getLayout() {
				if(this.layout === 'column') {
					return 'flex_column';
				}else {
					return 'flex_row';
				}
			},
			getTitleLayout() {
				switch (this.titleLayout){
					case 'left':
						return 'flex_row_none_c';
						break;
					case 'center':
						return 'flex_row_c_c';
						break;
					case 'right':
						return 'flex_row_e_c';
						break;
					default:
						if(this.layout === 'column') {
							return 'flex_row_none_c';
						}else{
							return 'flex_row_e_c';
						}
						break;
				}
			},
			getWidthMode() {
				if(this.layout === 'column') {
					return 'width100';
				}else{
					return 'maxWidth40';
				}
			}
		},
		methods: {
			voidFc() {}
		}
	}
</script>

<style scoped>
	@import url("../css/inputs.css");
</style>
