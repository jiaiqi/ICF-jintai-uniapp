export default () => {
	return {
		props: {
			placherhold: {
				type: String,
				default: '请选择'
			},
			height: { //picker高度
				type: Number,
				default: 0
			},
			fontScale: { //picker内文字大小
				type: Number,
				default: .034
			},
			buttonSet: { //按钮设置
				type: Object,
				default () {
					return {};
				}
			},
			dataSet: { //各类型携带的数据
				type: Object,
				default () {
					return {};
				}
			},
			showReset: { //每次显示是否重置value
				type: Boolean,
				default: false
			},
			pickerTitle: { //title标题
				type: String,
				default: ''
			},
			mode: {
				type: String,
				default: 'bottom'
			},
			zIndex: {
				type: [Number, String],
				default: 9999
			},
			bgColor_title: {
				type: String,
				default: '#F8F8F8'
			},
			autoHide: {
				type: Boolean,
				default: true
			},
			pickerTitleColor: {
				type: String,
				default: '#999'
			}
		},
		data() {
			return {
				nValue: this.value || {}
			}
		},
		methods: {
			confirm(obj) {
				this.nValue = obj;
				this.setValue(obj);
			},
			show() {
				this.$refs.inputsRef.show();
			},
			hide() {
				this.$refs.inputsRef.hide();
			},
			pickerChange(obj) {
				this.$emit('pickerChange', obj);
			}
		}
	}
}