<template>
	<QStemplate :title="title" :titleHide="titleHide" :fontSize="fontSize" :width="width" :titleFlex="titleFlex"
	 :contentFlex="contentFlex" :titleStyle="titleStyle" :contentStyle="contentStyle" :required="required" :requiredSign="requiredSign"
	 :layout="layout" :titleLayout="titleLayout" :itemDisabled="itemDisabled" :titleColor="titleColor">
		<view class="flex_row_none_c width100 padding_10rpx_15rpx">
			<checkbox-group @change="checkboxChange" class="width100 wrap" :class="itemLayout_computed">
				<label class="fontColor666666 flex_row_none_c marginRight_15rpx padding_10rpx" v-for="(checkboxItem, checkboxIndex) in itemArray||[]"
				 :key="checkboxIndex">
					<checkbox :value="checkboxItem.value" :checked="getStatus[checkboxIndex]" :disabled="disabled" :color="checkboxItem.color||color"
					 :style="'transform: scale(' + (scale||'.8') + ');'" />
					<view class="flex_row_none_c">{{checkboxItem.name}}</view>
				</label>
			</checkbox-group>
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
		computed:{
			getStatus() {
				const status = [];
				const value = this.value;
				const itemArray = this.itemArray;
				if(value instanceof Array && value.length > 0) {
					for(let i = 0; i < itemArray.length; i++) {
						const j = value.findIndex(item=>item === itemArray[i].value)
						if(j >= 0) {
							status.push(true);
						}else{
							status.push(false);
						}
					}
				}else{
					itemArray.forEach(()=>{
						status.push(false);
					})
				}
				return status;
			}
		},
		methods: {
			checkboxChange({
				detail: {
					value
				}
			}) {
				this.setValue(value);
			}
		},
		mixins: [QSInputsMixin({
			QSInputsType: _app.typeObj.checkbox
		})]
	};
</script>

<style scoped>
	@import url("../../css/inputs.css");
</style>
