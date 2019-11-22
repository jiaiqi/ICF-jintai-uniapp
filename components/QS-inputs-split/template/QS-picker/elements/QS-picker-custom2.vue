<template>
	<QSPickerTemplate ref="QSPickerTem" :height="height" :fontScale="fontScale"
	  :buttonSet="buttonSet" :title="title" :mode="mode" :zIndex="zIndex" :bgColor_title="bgColor_title"
	 :autoHide="autoHide" :titleColor="titleColor" @confirm="confirm">
		<block v-if="linkage">
			<block v-if="linkageNum==2">
				<picker-view 
				@touchmove.prevent.stop="voidFc()" 
				indicator-style="height: 60px;"
				:value="value" @change="bindChange($event)">
					<picker-view-column>
						<view 
						class="flex_row_c_c pickerDefault" 
						:class="((value[0] || 0) === index?'selectColor':'defaultColor')" 
						v-for="(item,index) in (itemObject.step_1 || [])" 
						:key="index">
							{{steps.step_1_value?item[steps.step_1_value]:item}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view 
						class="flex_row_c_c pickerDefault" 
						:class="((value[1] || 0) === index?'selectColor':'defaultColor')" 
						v-for="(item,index) in getItem2" 
						:key="index">
							{{steps.step_2_value?item[steps.step_2_value]:item}}
						</view>
					</picker-view-column>
				</picker-view>
			</block>

			<block v-else-if="linkageNum==3">
				<picker-view 
				@touchmove.prevent.stop="voidFc()"
				indicator-style="height: 60px;"
				:value="value" 
				@change="bindChange($event)">
					<picker-view-column>
						<view 
						class="flex_row_c_c pickerDefault" 
						:class="((value[0] || 0) === index?'selectColor':'defaultColor')"  
						v-for="(item,index) in (itemObject.step_1 || [])" 
						:key="index">
							{{steps.step_1_value?item[steps.step_1_value]:item}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view 
						class="flex_row_c_c pickerDefault" 
						:class="((value[1] || 0) === index?'selectColor':'defaultColor')"  
						v-for="(item,index) in getItem2" 
						:key="index">
							{{steps.step_2_value?item[steps.step_2_value]:item}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view 
						class="flex_row_c_c pickerDefault" 
						:class="((value[2] || 0) === index?'selectColor':'defaultColor')"  
						v-for="(item,index) in getItem3" 
						:key="index">
							{{steps.step_3_value?item[steps.step_3_value]:item}}
						</view>
					</picker-view-column>
				</picker-view>

			</block>
		</block>
		<block v-else>
			<picker-view 
			@touchmove.prevent.stop="voidFc()"
			indicator-style="height: 60px;"
			:value="value" 
			@change="bindChange($event)">
				<picker-view-column v-for="(items, indexs) in itemArray" :key="indexs">
					<view 
					class="flex_row_c_c pickerDefault" 
					:class="((value[indexs] || 0) === index?'selectColor':'defaultColor')" 
					v-for="(item, index) in items" 
					:key="index">
						{{steps.step_1_value?item[steps.step_1_value]:item}}
					</view>
				</picker-view-column>
			</picker-view>
		</block>
	</QSPickerTemplate>
</template>

<script>
	import _app from '../../../js/app.js';
	import QSPickerTemplate from './QS-pickerTemplate.vue';
	import QSPickerMixin from '../js/QS-picker-mixin.js';

	export default {
		name: 'QS-picker-custom2',
		mixins: [QSPickerMixin()],
		components: {
			QSPickerTemplate
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
			},
			customId: {
				type: [String, Object],
				deault: ''
			}
		},
		data() {
			return {
				itemArray: [],
				itemObject: {},
				async_1: [],
				async_2: [],
				oldValue: [],
				memoryData_1: [],
				memoryData_2: [],
				waiting: false,
			};
		},
		computed: {
			getItem2() {
				if(this.async) {
					return this.async_1 || [];
				}else{
					return (this.itemObject.step_2?this.itemObject.step_2[this.value[0]||0]:[]) || [];
				}
			},
			getItem3() {
				if(this.async) {
					return this.async_2 || [];
				}else{
					return (this.itemObject.step_3?this.itemObject.step_3[this.value[0]||0]?this.itemObject.step_3[this.value[0]||0][this.value[1]||0]:[]:[]) || [];
				}
			}
		},
		methods: {
			init() {
				if (this.dataSet.defaultValue instanceof Array && this.dataSet.defaultValue)
					this.value = this.dataSet.defaultValue;
				this.checkAsync();
			},
			checkAsync() {
				if (this.async && this.itemObject.step_1 && this.itemObject.step_1.length > 0) {
					if(this.linkageNum == 2) {
						if(this.async_1.length !== 0) 
							return;
					}else if(this.linkageNum == 3) {
						if(this.async_2 !== 0)
							return;
					}
					this.getAsyncData({
						value: this.value,
						launch: true
					});
				}
			},
			bindChange({
				detail: {
					value
				}
			}) { //解构 赋值
				this.value = value;
				const oldValue = [...this.oldValue];
				if (this.async && this.linkage) {
					switch (Number(this.linkageNum)) {
						case 2:
							if (oldValue[0] !== value[0]) {
								this.getAsyncData({
									value,
									index: 0
								});
							}
							break;
						case 3:
							if (oldValue[0] !== value[0]) {
								this.getAsyncData({
									value,
									index: 0
								});
							} else if (oldValue[1] !== value[1]) {
								this.getAsyncData({
									value,
									index: 1
								});
							}
							break;
						default:
							break;
					}
				}
				this.$emit('pickerChange', {value});
			},
			getAsyncData(obj) {	// 逐级获取
				let oldValue = [];
				if (this.oldValue.length&&this.oldValue.length > 0) oldValue = [...this.oldValue];
				if (obj.value.length === 0) {
					switch (Number(this.linkageNum)) {
						case 2:
							obj.value = [0, 0];
							break;
						case 3:
							obj.value = [0, 0, 0];
							break;
						default:
							break;
					}
					this.value = [...obj.value];
				}
				obj = {
					...obj,
					datas: {
						data_0: [...this.itemObject.step_1],
						data_1: this.async_1.length&&this.async_1.length>0?[...this.async_1]: []
					},
					linkageNum: this.linkageNum,
					customId: this.customId,
					type: 'picker-custom2',
					oldValue
				};
				_app.getPickerAsyncData.call(this, obj);
			},
			confirm() {
				let _this = this;
				if(_this.waiting) {
					_app.showToast('正在获取数据, 请稍候');
					return;
				}
				const async = _this.async;
				const datas = _this.linkage ? _this.itemObject : _this.itemArray;
				const v = _this.value;
				let data;
				if (_this.linkage) {
					data = {}
					for(let i = 0; i < _this.linkageNum; i++) {
						if(!v[i]) v[i] = 0;
					}
					if(_this.linkageNum == 2) {		//二级联动
						data.steps1 = datas.step_1[v[0]];
						data.steps2 = async?this.async_1[v[1]]:datas.step_2[v[0]][v[1]];
					}else if(_this.linkageNum == 3) {		//三级联动
						data.steps1 = datas.step_1[v[0]];
						if(!data.steps1)
							_app.showToast('第一列中不存在第'+v[0]+'项');
						data.steps2 = async?this.async_1[v[1]]:datas.step_2[v[0]][v[1]];
						if(!data.steps2)
							_app.showToast('第二列中不存在第'+v[1]+'项');
						data.steps3 = async?this.async_2[v[2]]:datas.step_3[v[0]][v[1]][v[2]];
						if(!data.steps3)
							_app.showToast('第三列中不存在第'+v[2]+'项');
					}else{
						_app.showToast('不在指定范围中');
					}
				} else { //无联动
					data = [];
					for (let i = 0; i < datas.length; i++) {
						let d = datas[i];
						data.push(d[(v[i]||0)]);
					}
				}
				const obj = {
					data,
					value: v
				}
				_this.$emit('confirm', obj);
				if (this.autoHide) this.hide();
			},
			setData(data) {
				if(this.linkage) {
					this.itemObject = data;
				}else{
					this.itemArray= data;
				}
			}
		}
	}
</script>

<style scoped>
	@import url("../css/QS-picker.css");
	@import url("../../../config/css/picker.css");
</style>
