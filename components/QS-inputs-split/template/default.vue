<template>
	<QStemplate :title="title" :titleHide="titleHide" :fontSize="fontSize" :width="width" :titleFlex="titleFlex"
	 :contentFlex="contentFlex" :titleStyle="titleStyle" :contentStyle="contentStyle" :required="required" :requiredSign="requiredSign"
	 :layout="layout" :titleLayout="titleLayout" :itemDisabled="itemDisabled">
		<view class="flex_row_none_c width100 padding_10rpx_15rpx">
			
			
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
			
		},
		methods: {
			
		},
		mixins: [QSInputsMixin({
			QSInputsType: _app.typeObj.radio
		})]
	};
</script>

<style scoped>
	@import url("../../css/inputs.css");
</style>
