<template>
	<view class="width100 borderBottom1pxf2f2f2"  @tap.stop.prevent="show">
		<QStemplate :title="title" :titleHide="titleHide" :fontSize="fontSize" :width="width" :titleFlex="titleFlex"
		 :contentFlex="contentFlex" :titleStyle="titleStyle" :contentStyle="contentStyle" :required="required" :requiredSign="requiredSign"
		 :layout="layout" :titleLayout="titleLayout" :itemDisabled="itemDisabled" :titleColor="titleColor">
			<view class="flex_row width100">
						<block v-if="linkage">
							<block v-if="linkageNum == 2">
								<view class="flex_row_e_c padding_10rpx_15rpx Flex5" :class="nValue.data && nValue.data.steps1 && nValue.data.steps2?'':'fontColorADADAD'">
									{{
										nValue.data && nValue.data.steps1 && nValue.data.steps2?
										(nValue.data.steps1[steps.step_1_value] + '-' + 
										(steps.step_2_value?nValue.data.steps2[steps.step_2_value]:nValue.data.steps2)):
										placherhold
									}}
								</view>
							</block>
							<block v-if="linkageNum == 3">
								<view class="flex_row_e_c padding_10rpx_15rpx Flex5" :class="nValue.data && nValue.data.steps1 && nValue.data.steps2 && nValue.data.steps3?'':'fontColorADADAD'">
									{{
										nValue.data && nValue.data.steps1 && nValue.data.steps2 && nValue.data.steps3?
										(nValue.data.steps1[steps.step_1_value] + '-' + 
										(steps.step_2_value?nValue.data.steps2[steps.step_2_value]:nValue.data.steps2) + '-' + 
										(steps.step_3_value?nValue.data.steps3[steps.step_3_value]:nValue.data.steps3)):
										placherhold
									}}
								</view>
							</block>
						</block>
						<block v-else>
							<block v-if="nValue.data && nValue.data.length > 0">
								<view class="flex_row_e_c padding_10rpx_15rpx Flex5">
									<view
									v-for="(i, d) in nValue.data" 
									:key="d">
										{{
											d==0?
											(steps?
											steps.step_1_value?
											i[steps.step_1_value]:
											i:
											i):
											'-' + 
											(steps?
											steps.step_1_value?
											i[steps.step_1_value]:
											i:
											i)
										}}
									</view>
								</view>
							</block>
							<block v-else>
								<view class="flex_row_e_c padding_10rpx_15rpx Flex5 fontColorADADAD">
									{{placherhold}}
								</view>
							</block>
						</block>
				<view class="Flex1_5 flex_row_c_c">
					<uniIcon type="forward" :size="fontSize" color="#666"></uniIcon>
				</view>
			</view>
		</QStemplate>
		<pickerCustom 
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
		@pickerChange="pickerChange"
		
		:linkage="linkage"
		:linkageNum="linkageNum"
		:steps="steps"
		:async="async"
		:customId="customId"></pickerCustom>
	</view>
</template>

<script>
	import _app from '../../js/app.js';
	import QStemplate from '../../template/template.vue';
	import QSInputsMixin from '../../js/QSInputsMixin.js';
	import QSInputsPickerMixin from '../../js/QSInputsPickerMixin.js';
	import pickerCustom from '../../template/QS-picker/elements/QS-picker-custom.vue';
	import uniIcon from '../../uniIcons/uni-icons.vue';

	export default {
		components: {
			QStemplate,
			pickerCustom,
			uniIcon
		},
		props: {
			linkage: {
				type: Boolean,
				default: false
			},
			linkageNum: {
				type: [Number, String],
				default: 2
			},
			steps: Object,
			async: {
				type: Boolean,
				default: false
			}
		},
		mixins: [QSInputsMixin({
			QSInputsType: _app.typeObj.picker_custom
		}), QSInputsPickerMixin()]
	};
</script>

<style scoped>
	@import url("../../css/inputs.css");
</style>
