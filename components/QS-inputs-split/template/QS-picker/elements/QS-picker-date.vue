<template>
	<QSPickerTemplate ref="QSPickerTem" :height="height" :lineHeight="lineHeight" :fontScale="fontScale"
	  :buttonSet="buttonSet" :title="title" :mode="mode" :zIndex="zIndex" :bgColor_title="bgColor_title"
	 :autoHide="autoHide" :titleColor="titleColor" @confirm="confirm">
		<!-- #ifndef MP-ALIPAY -->
		<picker-view @touchmove.prevent.stop="voidFc()" indicator-style="height: 60px;" :value="value" @change="bindChange($event)">
			<picker-view-column v-if="setObj.dateMode>=1">
				<view class="flex_row_c_c pickerDefault" :class="((value[0] || 0) === picker_index?'selectColor':'defaultColor')"
				 v-for="(picker_item,picker_index) in years" :key="picker_index">{{picker_item}}年</view>
			</picker-view-column>
			<picker-view-column v-if="setObj.dateMode>=2">
				<view class="flex_row_c_c pickerDefault" :class="((value[1] || 0) === picker_index?'selectColor':'defaultColor')"
				 v-for="(picker_item,picker_index) in months" :key="picker_index">{{picker_item}}月</view>
			</picker-view-column>
			<picker-view-column v-if="setObj.dateMode>=3">
				<view class="flex_row_c_c pickerDefault" :class="((value[2] || 0) === picker_index?'selectColor':'defaultColor')"
				 v-for="(picker_item,picker_index) in days" :key="picker_index">{{picker_item}}日</view>
			</picker-view-column>
			<picker-view-column v-if="setObj.dateMode>=4">
				<view class="flex_row_c_c pickerDefault" :class="((value[3] || 0) === picker_index?'selectColor':'defaultColor')"
				 v-for="(picker_item,picker_index) in hours" :key="picker_index">{{picker_item}}时</view>
			</picker-view-column>
			<picker-view-column v-if="setObj.dateMode>=5">
				<view class="flex_row_c_c pickerDefault" :class="((value[4] || 0) === picker_index?'selectColor':'defaultColor')"
				 v-for="(picker_item,picker_index) in ms" :key="picker_index">{{picker_item}}分</view>
			</picker-view-column>
			<picker-view-column v-if="setObj.dateMode>=6">
				<view class="flex_row_c_c pickerDefault" :class="((value[5] || 0) === picker_index?'selectColor':'defaultColor')"
				 v-for="(picker_item,picker_index) in ms" :key="picker_index">{{picker_item}}秒</view>
			</picker-view-column>
		</picker-view>
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY -->
		<!-- 支付宝奇葩一点的，别的平台都可以 但是他不行，， 郁闷 -->
		<block v-if="setObj.dateMode==1"><picker-view @touchmove.prevent.stop="voidFc()" indicator-style="height: 60px;" :value="value" @change="bindChange($event)"><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[0] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in years" :key="picker_index">{{picker_item}}年</view></picker-view-column></picker-view></block>
		<block v-if="setObj.dateMode==2"><picker-view @touchmove.prevent.stop="voidFc()" indicator-style="height: 60px;" :value="value" @change="bindChange($event)"><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[0] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in years" :key="picker_index">{{picker_item}}年</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[1] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in months" :key="picker_index">{{picker_item}}月</view></picker-view-column></picker-view></block>
		<block v-if="setObj.dateMode==3"><picker-view @touchmove.prevent.stop="voidFc()" indicator-style="height: 60px;" :value="value" @change="bindChange($event)"><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[0] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in years" :key="picker_index">{{picker_item}}年</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[1] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in months" :key="picker_index">{{picker_item}}月</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[2] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in days" :key="picker_index">{{picker_item}}日</view></picker-view-column></picker-view></block>
		<block v-if="setObj.dateMode==4"><picker-view @touchmove.prevent.stop="voidFc()" indicator-style="height: 60px;" :value="value" @change="bindChange($event)"><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[0] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in years" :key="picker_index">{{picker_item}}年</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[1] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in months" :key="picker_index">{{picker_item}}月</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[2] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in days" :key="picker_index">{{picker_item}}日</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[3] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in hours" :key="picker_index">{{picker_item}}时</view></picker-view-column></picker-view></block>
		<block v-if="setObj.dateMode==5"><picker-view @touchmove.prevent.stop="voidFc()" indicator-style="height: 60px;" :value="value" @change="bindChange($event)"><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[0] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in years" :key="picker_index">{{picker_item}}年</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[1] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in months" :key="picker_index">{{picker_item}}月</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[2] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in days" :key="picker_index">{{picker_item}}日</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[3] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in hours" :key="picker_index">{{picker_item}}时</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[4] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in ms" :key="picker_index">{{picker_item}}分</view></picker-view-column></picker-view></block>
		<block v-if="setObj.dateMode==6"><picker-view @touchmove.prevent.stop="voidFc()" indicator-style="height: 60px;" :value="value" @change="bindChange($event)"><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[0] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in years" :key="picker_index">{{picker_item}}年</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[1] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in months" :key="picker_index">{{picker_item}}月</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[2] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in days" :key="picker_index">{{picker_item}}日</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[3] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in hours" :key="picker_index">{{picker_item}}时</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[4] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in ms" :key="picker_index">{{picker_item}}分</view></picker-view-column><picker-view-column><view class="flex_row_c_c pickerDefault" :class="((value[5] || 0) === picker_index?'selectColor':'defaultColor')" v-for="(picker_item,picker_index) in ms" :key="picker_index">{{picker_item}}秒</view></picker-view-column></picker-view></block>
		<!-- #endif -->
	</QSPickerTemplate>
</template>

<script>
	import QSPickerTemplate from './QS-pickerTemplate.vue';
	import QSPicker from '../js/QS-picker.js';
	import QSPickerMixin from '../js/QS-picker-mixin.js';

	export default {
		name: 'QS-picker-date',
		mixins: [QSPickerMixin()],
		components: {
			QSPickerTemplate
		},
		data() {
			return {
				years: [],
				days: [],
				months: QSPicker.num2Array(12),
				hours: QSPicker.num2Array(24),
				ms: QSPicker.num2Array(60),
			};
		},
		methods: {
			init() {
				let value = [];
				let setObj = QSPicker.creatDateObj(this.dataSet);
				//date
				let years = [];
				let days = [];
				let defaultDate = setObj.defaultValue;
				years = QSPicker.countYears(setObj.startYear || (new Date().getFullYear() - 5), setObj.endYear || (new Date().getFullYear() +
					5));
				let endYear = years[years.length - 1];
				let defaultYear = defaultDate.getFullYear(),
					defaultMonth = defaultDate.getMonth(),
					defaultDay = defaultDate.getDate(),
					defaultHour = defaultDate.getHours(),
					defaultMinute = defaultDate.getMinutes(),
					defaultSecond = defaultDate.getSeconds();
				let compareY = defaultYear > endYear;
				let year = compareY ? endYear : defaultYear;
				let month = compareY ? 11 : defaultMonth;
				defaultDate[1] = month;
				days = QSPicker.countDays(year, defaultDate).days;
				let dm = setObj.dateMode;
				if (dm >= 1) {
					if (compareY)
						value.push(years.length - 1);
					else
						for (let i = 0; i < years.length; i++) {
							if (year == years[i]) {
								value.push(i);
							}
						}
				}
				if (dm >= 2) value.push(compareY ? 11 : month);
				if (dm >= 3) value.push(compareY ? days : defaultDay - 1);
				if (dm >= 4) value.push(defaultHour);
				if (dm >= 5) value.push(defaultMinute);
				if (dm >= 6) value.push(defaultSecond);
				//date
				this.years = years;
				this.days = days;
				this.setObj = setObj;

				let defaultValue = [...value];
				this.value = value;
				this.defaultValue = defaultValue;
			},
			bindChange({
				detail: {
					value
				}
			}) {
				let data = QSPicker.countDays(this.years[value[0]], value);
				this.days = data.days;
				this.value = data.val;
				this.$emit('pickerChange', {value});
			},
			confirm() {
				const value = this.value;
				const obj = {
					value
				}
				let setObj = this.setObj;
				let data = '';
				let dateFormatArray = setObj.dateFormatArray;
				for (let i = 1; i <= this.setObj.dateMode; i++) {
					if (i <= 6) {
						let j = i - 1;
						let f = i - 2;
						switch (i) {
							case 1:
								data += this.years[value[j]];
								break;
							case 2:
								data += dateFormatArray[f] + (value[j] + 1);
								break;
							case 3:
								data += dateFormatArray[f] + (value[j] + 1);
								break;
							default:
								data += dateFormatArray[f] + value[j];
								break;
						}
					}
				}

				obj.data = data;
				this.$emit('confirm', obj);
				if (this.autoHide) this.hide();
			}
		}
	}
</script>

<style scoped>
	@import url("../css/QS-picker.css");
	@import url("../../../config/css/picker.css");
</style>
