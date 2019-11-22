<template>
	<view class="width100 borderBottom1pxf2f2f2"  @tap.stop="show">
		<QStemplate :title="title" :titleHide="titleHide" :fontSize="fontSize" :width="width" :titleFlex="titleFlex"
		 :contentFlex="contentFlex" :titleStyle="titleStyle" :contentStyle="contentStyle" :required="required" :requiredSign="requiredSign"
		 :layout="layout" :titleLayout="titleLayout" :itemDisabled="itemDisabled" :titleColor="titleColor">
			<view class="flex_row width100">
				<view class="flex_row_e_c padding_10rpx_15rpx Flex5" :class="nValue.data?'':'fontColorADADAD'">
					{{nValue.data||placherhold}}
				</view>
				<view class="Flex1_5 flex_row_c_c">
					<uniIcon type="forward" :size="fontSize" color="#666"></uniIcon>
				</view>
			</view>
		</QStemplate>
		<pickerCity
		ref="inputsRef" 
		:height="height" 
		:fontScale="fontScale"
		:buttonSet="buttonSet"
		:dataSet="dataSet"
		:showReset="showReset"
		:title="pickerTitle"
		:mode="mode"
		:zIndex="zIndex"
		:bgColor_title="bgColor_title"
		:titleColor="pickerTitleColor"
		:autoHide="autoHide"
		@confirm="confirm"
		@pickerChange="pickerChange"></pickerCity>
	</view>
</template>

<script>
	import _app from '../../js/app.js';
	import QStemplate from '../../template/template.vue';
	import QSInputsMixin from '../../js/QSInputsMixin.js';
	import QSInputsPickerMixin from '../../js/QSInputsPickerMixin.js';
	import pickerCity from '../../template/QS-picker/elements/QS-picker-city.vue';
	import uniIcon from '../../uniIcons/uni-icons.vue';

	export default {
		components: {
			QStemplate,
			pickerCity,
			uniIcon
		},
		mixins: [QSInputsMixin({
			QSInputsType: _app.typeObj.picker_city
		}), QSInputsPickerMixin()]
	};
</script>

<style scoped>
	@import url("../../css/inputs.css");
</style>
