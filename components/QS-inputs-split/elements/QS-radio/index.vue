<template>
	<QStemplate :title="title" :titleHide="titleHide" :fontSize="fontSize" :width="width" :titleFlex="titleFlex"
	 :contentFlex="contentFlex" :titleStyle="titleStyle" :contentStyle="contentStyle" :required="required" :requiredSign="requiredSign"
	 :layout="layout" :titleLayout="titleLayout" :itemDisabled="itemDisabled" :titleColor="titleColor">
		<view class="flex_row_none_c width100 padding_10rpx_15rpx">
			<radio-group @change="radioChange" class="width100 wrap" :class="itemLayout_computed">
				<label class="fontColor666666 flex_row_none_c marginRight_15rpx padding_10rpx" v-for="(radioItem, radioIndex) in itemArray||[]"
				 :key="radioIndex">
					<radio :value="radioItem.value" :checked="value==String(radioItem.value)" :disabled="disabled" :color="radioItem.color||color"
					 :style="'transform: scale(' + (scale||'.8') + ');'" />
					<view class="flex_row_none_c">{{radioItem.name}}</view>
				</label>
			</radio-group>
		</view>
	</QStemplate>
</template>

<script>
	import _app from '../../js/app.js';
	import QStemplate from '../../template/template.vue';
	import QSInputsMixin from '../../js/QSInputsMixin.js';

	export default {
		components: {
			QStemplate
		},
		props: {
			itemArray: {
				type: Array,
				default () {
					return []
				}
			},
			color: {
				type: String,
				default: '#33cc33'
			},
			scale: {
				type: String,
				default: '.8'
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			radioChange({
				detail: {
					value
				}
			}) {
				this.setValue(value);
			}
		},
		mixins: [QSInputsMixin({
			QSInputsType: _app.typeObj.radio
		})]
	};
</script>

<style scoped>
	@import url("../../css/inputs.css");
</style>
