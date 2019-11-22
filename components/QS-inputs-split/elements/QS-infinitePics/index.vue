<template>
	<QStemplate :title="title" :titleHide="titleHide" :fontSize="fontSize" :width="width" :titleFlex="titleFlex"
	 :contentFlex="contentFlex" :titleStyle="titleStyle" :contentStyle="contentStyle" :required="required" :requiredSign="requiredSign"
	 :layout="layout" :titleLayout="titleLayout" :itemDisabled="itemDisabled" :titleColor="titleColor">
		<view class="width100 padding_10rpx_15rpx wrap" :class="itemLayout_computed">

			<view 
			class="flex_column_c_c border_radius_4px transition_border_point6s padding_10rpx" 
			v-for="(picsItem, picsIndex) in itemArray"
			:key="picsIndex">
				<view 
				class="flex_row_c_c border1pxf2f2f2 position_relative border_radius_4px backgrounColor_f8f8f8 picsBox">
					<image 
					:src="picsItem.path" 
					class="border_radius_4px box_shadow_2px_2px_5px_ADADAD picsBox" 
					mode="aspectFill" 
					@tap.stop.prevent="showImg" 
					:data-picsindex="picsIndex">
					</image>
					<view 
					class="picsClear" 
					@tap.prevent.stop="clearPic" 
					:data-picsindex="picsIndex">
						<uni-icon type="clear" :color="picsItem.clearColor||clearColor||'#f5105c'" :size="34"/>
					</view>
					<view 
					class="sortSelection flex_row_c_c" 
					:style="{
						'background-color': sortSelectionArray[picsIndex]?(selectedColor||'#0099FF'):(unSelectedColor||'rgba(0,0,0,.7)'),
						'border': (selectBorderColor||'1px solid rgba(255,255,255,.7)'),
						'color': selectColor||'#fff'
					}"
					 v-if="sortSelection" @tap.stop.prevent="sortSelectionFc" :data-picsindex="picsIndex">
						{{
							sortSelectionArray[picsIndex] || ''
						}}
					</view>
				</view>
			</view>
			<view 
			class="flex_column_c_c border_radius_4px transition_border_point6s padding_10rpx" 
			v-if="max?(itemArray.length>=max?false:true):true">
				<view 
				class="flex_row_c_c border1pxf2f2f2 position_relative border_radius_4px backgrounColor_f8f8f8 box_shadow_2px_2px_5px_ADADAD picsBox"
				@tap="chooseImg">
					<uni-icon type="image" :size="45" color="#999" />
				</view>
			</view>

		</view>
	</QStemplate>
</template>

<script>
	import _app from '../../js/app.js';
	import QStemplate from '../../template/template.vue';
	import QSInputsMixin from '../../js/QSInputsMixin.js';
	import uniIcon from '../../uniIcons/uni-icons.vue';

	export default {
		components: {
			QStemplate,
			uniIcon
		},
		props: {
			max: {	//最多选择图片数量
				type: [String, Number],
				default: ''
			},
			sortSelection: {	//排序选择模式
				type: Boolean,
				default: false
			},
			defaultSelectAll: {	//在排序选择模式下，用户未选择任何图片时是否默认选择全部
				type: Boolean,
				default: true
			},
			clearColor: {
				type: String,
				default: '#f5105c'
			},
			selectedColor: {
				type: String,
				default: '#0099FF'
			},
			unSelectedColor: {
				type: String,
				default: 'rgba(0,0,0,.7)'
			},
			selectBorderColor: {
				type: String,
				default: '1px solid rgba(255,255,255,.7)'
			},
			selectColor: {
				type: String,
				default: '#fff'
			}
		},
		data() {
			let itemArray;
			if(this.value && this.value instanceof Array && this.value.length > 0) {
				itemArray = this.value;
			}else{
				itemArray = [];
			}
			return {
				itemArray,
				sortSelectionArray: [],
				sortSelectionCheckArray: []
			}
		},
		methods: {
			chooseImg() {
				uni.chooseImage({
					success: res => {
						const tempFilePaths = res.tempFilePaths;
						tempFilePaths.forEach(item=>{
							this.itemArray.push({path: item});
						})
						this.setValue(this.getItemArray());
					}
				})
			},
			clearPic(
				{currentTarget: { dataset: { picsindex } } } = {}
			) {
				const oldPath = this.itemArray[picsindex].path;
				this.itemArray.splice(picsindex, 1);
				if(this.sortSelection) {
					const selectionIndex = this.sortSelectionCheckArray.findIndex(item=>item.path === oldPath);
					if(selectionIndex >= 0) {
						this.sortSelectionCheckArray.splice(selectionIndex, 1);
					}
					this.checkPicsCheckObj();
				}
				this.setValue(this.getItemArray());
			},
			showImg(
				{currentTarget: { dataset: { picsindex } } } = {}
			) {
				_app.previewImage(this.itemArray.map(item=>item.path), picsindex);
			},
			sortSelectionFc(
				{ currentTarget: { dataset: { picsindex } } } = {},
			) {
				const hasIndex = this.sortSelectionCheckArray.findIndex(item=>item.path === this.itemArray[picsindex].path);
				if(hasIndex >= 0) {
					this.sortSelectionCheckArray.splice(hasIndex, 1);
				}else{
					this.sortSelectionCheckArray.push(this.itemArray[picsindex]);
				}
				this.setValue(this.getItemArray());
				this.checkPicsCheckObj();
			},
			checkPicsCheckObj(vbName) {
				const newArray = [];
				const itemArray = this.itemArray;
				const sortSelectionCheckArray = this.sortSelectionCheckArray;
				for(let i = 0; i < itemArray.length; i++) {
					const index = sortSelectionCheckArray.findIndex(ite=>ite.path === itemArray[i].path);
					if(index >= 0) {
						newArray.push(index+1);
					}else{
						newArray.push('');
					}
				}
				this.sortSelectionArray = newArray
			},
			setData(newArr) {
				this.itemArray = newArr;
				if(this.sortSelection) {
					this.sortSelectionCheckArray = [];
				}
				this.setValue(this.getItemArray());
				this.checkPicsCheckObj();
			},
			setUpLoadData(obj) {
				this.upLoadData = obj;
				if(this.sortSelection) {
					this.sortSelectionCheckArray = [];
				}
				this.setValue(this.getItemArray());
				this.checkPicsCheckObj();
			},
			getUpLoadPromiseArray() {
				return _app.getUpLoadPromiseArray({
					itemArray: [...this.getItemArray()], 
					customId: this.customId, 
					upLoadData: this.upLoadData,
					required: this.required
				});
			},
			getItemArray() {
				if(this.sortSelection) {
					if(this.sortSelectionCheckArray.length > 0) {
						return this.sortSelectionCheckArray;
					}else{
						if(this.defaultSelectAll) {
							return this.itemArray;
						}else{
							return [];
						}
					}
				}else{
					return this.itemArray;
				}
			}
		},
		mixins: [QSInputsMixin({
			QSInputsType: _app.typeObj.infinitePics
		})]
	};
</script>

<style scoped>
	@import url("../../css/inputs.css");
	@import url("../../config/css/picsAndInfinitePics.css");
</style>
