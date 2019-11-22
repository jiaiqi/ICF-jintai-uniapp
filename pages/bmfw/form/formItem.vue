<template>
	<view>
		<div class="form_label">
		  {{ formItemData.label }}
		  <text v-if="formItemData.required == '是'" class="required">*</text>
		</div>
		<div class="form_content">
		  <radio-group name="" v-if="formItemData.columns === 'gender'" class="radio_group" @change="changeSex">
		   <!-- <label v-for="(item2, index) in genderItems" :key="item2.value">
		      <text><radio :value="item2.value" :checked="index === current" /></text>
		      <text>{{ item2.name }}</text>
		    </label> -->
		  </radio-group>
		  <view v-else-if="formItemData.columns === 'nation'">
		    <div class="mpvue-picer"><QSPickerCustom ref="nationPicker" :name="formName" :variableName="formName" title="选择民族:"  @pickerChange	="changeNation"/></div>
		  </view>
		  <view v-else-if="formItemData.col_type === 'Date'">
		    <view class="tab" @tap="toggleTab(dateInfo)"  :key="index">{{ dateInfo.name }} {{resultValue}}</view>
		    <w-picker mode="date" startYear="2016" endYear="2030" :defaultVal="dateDefaultVal" :current="true" @confirm="dateConfirm" ref="date" themeColor="#f00"></w-picker>
		  </view>
		  <input type="idcard" v-model="formItemData.value" class="input" v-else @blur="changeData(item.value)"/>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formItemData:{},
        dateInfo:{
          mode: 'date',
          name: '日期选择'
        },
        resultValue:null,
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
