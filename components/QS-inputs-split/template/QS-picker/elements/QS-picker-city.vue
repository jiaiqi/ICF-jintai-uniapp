<template>
	<QSPickerTemplate ref="QSPickerTem" :height="height" :lineHeight="lineHeight" :fontScale="fontScale"
	  :buttonSet="buttonSet" :title="title" :mode="mode" :zIndex="zIndex" :bgColor_title="bgColor_title"
	 :autoHide="autoHide" :titleColor="titleColor" @confirm="confirm">
		<picker-view 
		@touchmove.prevent.stop="voidFc()" 
		indicator-style="height: 60px;"
		:value="value" 
		@change="bindChange($event)">
			<picker-view-column>
				<view class="flex_row_c_c pickerDefault" :class="((value[0] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in provinceDataList" :key="picker_index">{{picker_item.label}}</view>
			</picker-view-column>
			<picker-view-column>
				<view class="flex_row_c_c pickerDefault" :class="((value[1] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in cityDataList" :key="picker_index">{{picker_item.label}}</view>
			</picker-view-column>
			<picker-view-column>
				<view class="flex_row_c_c pickerDefault" :class="((value[2] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in areaDataList" :key="picker_index">{{picker_item.label}}</view>
			</picker-view-column>
		</picker-view>
	</QSPickerTemplate>
</template>

<script>
	import QSPickerTemplate from './QS-pickerTemplate.vue';
	import QSPickerMixin from '../js/QS-picker-mixin.js';

	var provinceData = {};
	var cityData = {};
	var areaData = {};
	export default {
		name: 'QS-picker-city',
		mixins: [QSPickerMixin()],
		components: {
			QSPickerTemplate
		},
		data() {
			return {
				provinceDataList: [],
				cityDataList: [],
				areaDataList: [],
			};
		},
		methods: {
			init() {
				let value = [];
				value = this.dataSet.defaultValue || [0, 0, 0];
				provinceData = require('../city-data/province.js').default;
				cityData = require('../city-data/city.js').default;
				areaData = require('../city-data/area.js').default;
				//city、provincialStreet
				this.provinceDataList = provinceData;
				this.cityDataList = cityData[value[0]];
				this.areaDataList = areaData[value[0]][value[1]];

				this.value = value;
				this.defaultValue = [...value];
			},
			bindChange({
				detail: {
					value
				}
			}) {
				if (this.value[0] !== value[0]) {
					// 第一级发生滚动
					this.cityDataList = cityData[value[0]];
					this.areaDataList = areaData[value[0]][0];
					value[1] = 0;
					value[2] = 0;
				} else if (this.value[1] !== value[1]) {
					// 第二级滚动
					this.areaDataList = areaData[value[0]][value[1]];
					value[2] = 0;
				}
				this.value = value;
				this.$emit('pickerChange', {value});
			},
			confirm() {
				const obj = {
					data: this._getLabel(),
					value: this.value,
					cityCode: this._getCityCode()
				};
				this.$emit('confirm', obj);
				if (this.autoHide) this.hide();
			},
			_getLabel() {
				let pcikerLabel =
					this.provinceDataList[this.value[0]].label +
					'-' +
					this.cityDataList[this.value[1]].label +
					'-' +
					this.areaDataList[this.value[2]].label;
				return pcikerLabel;
			},
			_getCityCode() {
				return this.areaDataList[this.value[2]].value;
			}
		}
	}
</script>

<style scoped>
	@import url("../css/QS-picker.css");
	@import url("../../../config/css/picker.css");
</style>
