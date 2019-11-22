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
					class="flex_row_c_c border1pxf2f2f2 position_relative border_radius_4px backgrounColor_f8f8f8 picsBox"
					@tap="chooseImg" 
					:data-picsindex="picsIndex"
					:data-customtapid="picsItem.customTapId">
						<image :src="itemArray[picsIndex].path"
						 class="border_radius_4px box_shadow_2px_2px_5px_ADADAD picsBox" mode="aspectFill" v-if="itemArray[picsIndex].path"
						 @tap.stop.prevent="showImg" :data-picsindex="picsIndex">
						</image>
						<view v-else>
							<uni-icon type="image" :size="45" color="#999999" />
						</view>
						<view class="picsClear" v-if="itemArray[picsIndex].path"
						 @tap.stop.prevent="clearPic" :data-picsindex="picsIndex">
							<uni-icon type="clear" :color="picsItem.clearColor||clearColor||'#f5105c'" :size="34" />
						</view>
					</view>
					<view class="flex_row_c_c fontColorADADAD picsItemTitle" v-if="picsItem.title">
						<view class="requiredSign" v-if="picsItem.required">{{requiredSign}}</view>{{picsItem.title}}
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
			clearColor: {
				type: String,
				default: '#f5105c'
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
				upLoadData: null
			}
		},
		methods: {
			chooseImg(
				{currentTarget: { dataset: { picsindex, infinite, customtapid } } } = {}
			) {
				if(this.itemArray[picsindex].path) return;
				if(customtapid) {
					this.$emit('picsTap', {
						title: this.title,
						variableName: this.variableName,
						picsIndex: picsindex,
						customTapId: customtapid
					});
				}else{
					uni.chooseImage({
						success: res => {
							this.$set(this.itemArray[picsindex], 'path', res.tempFilePaths[0]);
							this.setValue(this.itemArray);
						}
					})
				}
			},
			clearPic(
				{currentTarget: { dataset: { picsindex } } } = {}
			) {
				if(this.itemArray[picsindex].path) {
					this.itemArray[picsindex].path = '';
					this.setValue(this.itemArray);
				}
			},
			showImg(
				{currentTarget: { dataset: { picsindex } } } = {}
			) {
				_app.previewImage(this.itemArray.map(item=>item.path), picsindex);
			},
			setData(newArr) {
				this.itemArray = newArr;
				this.setValue(this.itemArray);
			},
			setUpLoadData(obj) {
				this.upLoadData = obj;
			},
			getUpLoadPromiseArray() {
				return _app.getUpLoadPromiseArray({
					itemArray: [...this.itemArray], 
					customId: this.customId, 
					upLoadData: this.upLoadData
				});
			}
		},
		mixins: [QSInputsMixin({
			QSInputsType: _app.typeObj.pics
		})]
	};
</script>

<style scoped>
	@import url("../../css/inputs.css");
	@import url("../../config/css/picsAndInfinitePics.css");
</style>
