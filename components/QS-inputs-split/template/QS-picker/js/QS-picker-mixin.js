const Sys = uni.getSystemInfoSync();
const wH = Sys.windowHeight;
const wW = Sys.windowWidth;
export default ({
	QSPickerType
} = {}) => {
	return {
		props: {
			height: { //picker高度
				type: Number,
				default: 0
			},
			lineHeight: {
				type: Number,
				default: .08
			},
			indicator_style: { //picker单行样式
				type: String,
				default: ''
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
			title: { //title标题
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
			titleColor: {
				type: String,
				default: '#999'
			},
			contentColor: {
				type: String,
				default: 'black'
			}
		},
		data() {
			const defaultFontScale = this.fontScale || .034;
			const countContentSize = wW * Number(defaultFontScale);
			const contentSize = countContentSize + 'px';
			return {
				setObj: {},
				value: [],
				defaultValue: [],
				pickerViewStyle: `font-size: ${contentSize};color: {this.contentColor||'black'};`,
				columnHeight: `height: ${wH*(this.lineHeight || .08)}px;`,
				columnStyle: `font-size: 16px;`,
				wH,
				wW,
				contentSize,
				onceShow: false
			};
		},
		watch: {
			dataSet() {
				this.init();
				deep: true
			}
		},
		methods: {
			show() {
				this.$refs.QSPickerTem.show();
				if (this.showReset) {
					const defaultValue = this.defaultValue;
					const data = QSPicker.countDays(this.years[defaultValue[0]], defaultValue);
					this.days = data.days;
					this.value = data.val;
				}
				if(!this.onceShow) {
					this.onceShow = true;
					this.init();
				}
				if(this.$refs.QSPickerTem.checkAsync && typeof this.$refs.QSPickerTem.checkAsync === 'function')
					this.$refs.QSPickerTem.checkAsync();
				this.$emit('showQSPicker');
			},
			hide() {
				this.$refs.QSPickerTem.hide();
				this.$emit('hideQSPicker');
			},
			voidFc() {}
		}
	}
}