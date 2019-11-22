<template>
	<QStemplate :title="title" :titleHide="titleHide" :fontSize="fontSize" :width="width" :titleFlex="titleFlex"
	 :contentFlex="contentFlex" :titleStyle="titleStyle" :contentStyle="contentStyle" :required="required" :requiredSign="requiredSign"
	 :layout="layout" :titleLayout="titleLayout" :itemDisabled="itemDisabled" :titleColor="titleColor">
		<view class="flex_row_none_c width100 padding_10rpx_15rpx" :class="itemLayout_computed">
			<switch :style="{'transform': 'scale(' + scale + ')'}" :checked="value" @change="change" :color="color" :disabled="disabled" />
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
			color: {
				type: String,
				default: ''
			},
			scale: {
				type: [String, Number],
				default: '.8'
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			change({
				detail: {
					value
				}
			}) {
				this.setValue(value);
			}
		},
		mixins: [QSInputsMixin({
			QSInputsType: _app.typeObj.switch
		})]
	};
</script>

<style scoped>
	@import url("../../css/inputs.css");
</style>
