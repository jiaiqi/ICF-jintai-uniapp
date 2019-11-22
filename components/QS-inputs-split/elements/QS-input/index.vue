<template>
	<QStemplate :title="title" :titleHide="titleHide" :fontSize="fontSize" :width="width" :titleFlex="titleFlex"
	 :contentFlex="contentFlex" :titleStyle="titleStyle" :contentStyle="contentStyle" :required="required" :requiredSign="requiredSign"
	 :layout="layout" :titleLayout="titleLayout" :itemDisabled="itemDisabled" :titleColor="titleColor">
		<view class="flex_row_none_c transition_point6s width100 padding_10rpx_15rpx" :style="
			'border-bottom: 1px solid ' + 
			(focusBl?
			(focusBorderColor||'#999'):
			(blurBorderColor||'#f2f2f2')) + ';'">
			<view class="flex_row_none_c Flex5">
				<view class="Flex1" v-if="leftIcon">
					<view class="flex_row_c_c width100">
						<uni-icon :type="leftIcon" :size="iconSize" :color="leftIconColor||'#999'"></uni-icon>
					</view>
				</view>
				<view class="Flex5 position_relative">
					<input 
					:type="inputType||'text'" 
					:value="value" 
					@input="inputs_change($event)" 
					:placeholder="placeholder||('请输入' + title)"
					 :password="passwordBl" 
					 :placeholder-style="inputSet.placeholder_style" 
					 :placeholder-class="inputSet.placeholder_class"
					 :maxlength="inputSet.maxlength||140" 
					 :cursor-spacing="inputSet.cursor_spacing"
					 :confirm-type="inputSet.confirm_type"
					 :confirm-hold="inputSet.confirm_hold" 
					 :selection-start="inputSet.selection_start" 
					 :selection-end="inputSet.selection_end"
					 :cursor="inputSet.cursor" 
					 :adjust-position="inputSet.adjust_position" 
					 :disabled="disabled" 
					 :style="{'font-size': fontSize + 'rpx', 'opacity': itemDisabled?0:1}"
					 :focus="focusBl" 
					 class="fontColor666666 width100"
					  @focus="focusChange()" 
					  @blur="blurChange()">
					 </input>
					 <view class="fontColor666666 inputItemDis flex_row_none_c" :style="{'font-size': fontSize + 'rpx'}" v-if="itemDisabled">
						{{value || placeholder || ('请输入' + title)}}
					 </view>
				</view>
			</view>
			<view class="Flex1_5" v-if="tapClear">
				<view class="flex_row_c_c width100" v-if="value" @tap.prevent.stop="inputTap('clear')">
					<uni-icon type="clear" :size="iconSize" color="#999999"></uni-icon>
				</view>
			</view>
			<view class="Flex1_5" v-if="password">
				<view class="flex_row_c_c width100" @tap.prevent.stop="inputTap('password')">
					<uni-icon type="eye" :size="iconSize" :color="passwordBl?'#999999':passwordIconColor||'#33cc33'"></uni-icon>
				</view>
			</view>
			<view class="Flex1_5" v-if="customTapIcon">
				<view class="flex_row_c_c width100" @tap.prevent.stop="inputTap('custom')">
					<uni-icon :type="customTapIcon" :size="iconSize" :color="customTapIconColor||'#999'"></uni-icon>
				</view>
			</view>
			<view class="Flex2 flex_row_c_c" v-if="rightButtonTex">
				<button type="primary" size="mini" class="width100 text_nowrap margin_10rpx" :style="'font-size:' + btnSize + 'rpx;' + rightButtonStyle"
				 @tap="inputTap('button')">
					{{rightButtonTex}}
				</button>
			</view>
			<view class="Flex2 flex_row_c_c" v-if="ifCode">
				<button type="primary" size="mini" class="width100 text_nowrap margin_10rpx" :disabled="startCodeBl" :style="'font-size:' + btnSize + 'rpx;' + codeButtonStyle"
				 @tap="getCode()">
					{{startCodeBl?codeCount + 's':'获取验证码'}}
				</button>
			</view>
		</view>
	</QStemplate>
</template>

<script>
	import _app from '../../js/app.js';
	import QStemplate from '../../template/template.vue';
	import uniIcon from '../../uniIcons/uni-icons.vue';
	import QSInputsMixin from '../../js/QSInputsMixin.js';

	export default {
		components: {
			uniIcon,
			QStemplate
		},
		props: {
			inputSet: {
				type: Object,
				default () {
					return {};
				}
			},
			tapClear: {
				type: Boolean,
				default: true
			},
			inputType: {
				type: String,
				default: 'text'
			},
			focus: {
				type: Boolean,
				default: false
			},
			focusBorderColor: {
				type: String,
				default: '#999'
			},
			blurBorderColor: {
				type: String,
				default: '#f2f2f2'
			},
			password: {
				type: Boolean,
				default: false
			},
			passwordIconColor: {
				type: String,
				default: '#33cc33'
			},
			leftIcon: {
				type: String,
				default: ''
			},
			leftIconColor: {
				type: String,
				default: '#999'
			},
			customTapIcon: {
				type: String,
				default: ''
			},
			customTapIconColor: {
				type: String,
				default: '#999'
			},
			rightButtonTex: {
				type: String,
				default: ''
			},
			rightButtonStyle: {
				type: String,
				default: ''
			},
			ifCode: {
				type: Boolean,
				default: false
			},
			codeCountDown: {
				type: [String, Number],
				default: 60
			},
			codeButtonStyle: {
				type: String,
				default: ''
			},
			phoneNum: {
				type: String,
				default: ''
			},
			checkPhoneNum: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			},
			placeholder: {
				type: String,
				default: ''
			},
			filterFc: {
				type: Function,
				default: null
			},
			filterType: {
				type: String,
				default: ''
			},
			verifyFc: {
				type: Function,
				default: null
			},
			verifyType: {
				type: String,
				default: ''
			},
			inputDebounceSet: {
				type: Object,
				default () {
					return {
						openInputDebounce: true,
						delay: 500
					};
				}
			}
		},
		computed: {
			iconSize() {
				return this.fontSize + 8;
			},
			btnSize() {
				return this.fontSize - 8;
			}
		},
		data() {
			return {
				passwordBl: !!this.password,
				focusBl: this.focus,
				inputDebounce: {},
				userCode: '', //用户输入的验证码
				codeCount: this.codeCountDown || 60, //获取验证码后倒计时时间
				code: '',
				startCodeBl: false //获取验证码状态
			}
		},
		watch: {
			itemDisabled(n, o) {
				if(n && this.focusBl) {
					uni.hideKeyboard();
					this.blurChange();
				}
			}
		},
		methods: {
			inputs_change({
				detail: {
					value
				}
			} = {}) { // 用户输入时，根据index赋值
				//_app.log(e.detail.value);
				// _app.log(index);
				const inputDebounce = this.inputDebounce;
				if (this.inputDebounceSet.openInputDebounce) {
					if (inputDebounce.debounce) clearTimeout(inputDebounce.debounce);
					if (inputDebounce.debounceTime && new Date().getTime() - inputDebounce.debounceTime < (
							this.inputDebounceSet.delay || 500)) {
						_app.log('防抖冲突,立即执行')
						this.inputs_changeFc(value, true);
					} else {
						inputDebounce.debounce = setTimeout(() => {
							_app.log('防抖')
							this.inputs_changeFc(value);
						}, this.inputDebounceSet.delay || 500);
					}
				} else {
					_app.log('无防抖')
					this.inputs_changeFc(value);
				}
			},
			inputs_changeFc(value, clash) {
				const inputDebounce = this.inputDebounce;
				if (this.inputDebounceSet.openInputDebounce) {
					if (clash) inputDebounce.debounceTime = 0;
					else inputDebounce.debounceTime = new Date().getTime();
				}
				if (this.filterFc && typeof(this.filterFc) == 'function') { //有filterFc则过滤
					this.input_filter_change(value, this.filterFc);
				} else if (this.filterType && _app.filterTypeObj[this.filterType] && typeof(_app.filterTypeObj[this.filterType]) ==
					'function') {
					this.input_filter_change(value, _app.filterTypeObj[this.filterType]);
				} else {
					this.setValue(value);
				}
			},
			input_filter_change(value, filterFc) {
				const val = filterFc(value);
				if(val != value) {
					new Promise((reslove,reject)=>{
						this.setValue(' ');
						reslove();
					})
					.then(()=>{
						// setTimeout(()=>{
							this.setValue(val);
						// }, 10)
					})
				}else{
					this.setValue(val);
				}
			},
			focusChange() {
				if(!this.itemDisabled) this.focusBl = true;
			},
			blurChange() {
				this.focusBl = false;
			},
			inputTap(type) { //input点击事件
				switch (type) {
					case 'password': //密码显隐
						this.passwordBl = !this.passwordBl
						break;
					case 'clear': //一键清除
						this.setValue('');
						break;
					case 'custom':
						this.inputCustomTapFc();
						break;
					case 'button':
						this.inputCustomTapFc();
						break;
					default:
						_app.showToast('inputTap类型错误');
						break;
				}
			},
			async inputCustomTapFc() {
				try {
					const data = await _app.inputCustomTapFc(this.customId);
					if (data !== undefined && data !== null) {
						this.setValue(data);
					}
				} catch (e) {
					//TODO handle the exception
					const data = await _app.inputCustomTapCatchFc(this.customId, e);
					if (data !== undefined && data !== null) {
						this.setValue(data);
					}
				}
			},
			getCode() { // 判断是否正确输入手机号后发送验证码并倒计时
				let _this = this;
				if (_this.startCodeBl) return;
				if(this.checkPhoneNum) {
					const phone = this.phoneNum;
					if (_app.regTest('Tel', phone)) { //正则判断
						_this.$emit('getCode');
						// _this.code = _app.sendSMS(this.customId, phone);
					} else {
						_app.showToast('请正确输入11位手机号');
						return;
					}
				}else{
					_this.$emit('getCode');
				}

				/* let setInterValFunc = setInterval(() => { //定时器
					if (_this.codeCount > 0)
						--_this.codeCount;
					else {
						_this.startCodeBl = false;
						clearInterval(setInterValFunc);
						_this.code = '';
						_this.codeCount = this.codeCountDown;
					}
				}, 1000)
				_this.startCodeBl = true; */
			},
			startCode() {
				let _this = this;
				if(_this.startCodeBl) return;
				let setInterValFunc = setInterval(() => { //定时器
					if (_this.codeCount > 0)
						--_this.codeCount;
					else {
						_this.startCodeBl = false;
						clearInterval(setInterValFunc);
						_this.code = '';
						_this.codeCount = this.codeCountDown;
					}
				}, 1000)
				_this.startCodeBl = true;
			},
			/* checkCode(cb) {
				let result = false;
				let msg = '';
				if (this.ifCode) {
					if (!this.code) {
						msg = '请先获取验证码';
					} else if (!this.value) {
						msg = '请填写验证码';
					} else if (this.value !== this.code) {
						msg = '验证码不正确';
						this.code = '';
						this.setValue('');
					} else {
						result = true;
						msg = '验证通过';
					}
				} else {
					result = true;
					msg = '未启用验证码功能';
				}

				const obj = {
					result,
					msg
				};
				if (cb && typeof(cb) === 'function') {
					cb(obj);
				} else {
					return obj;
				}
			} */
		},
		mixins: [QSInputsMixin({
			QSInputsType: _app.typeObj.input
		})]
	};
</script>

<style scoped>
	@import url("../../css/inputs.css");
</style>
