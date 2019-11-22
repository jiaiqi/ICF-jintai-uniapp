import _app from './app.js';

const publicProps = {
	name: {
		type: String,
		default: ''
	},
	variableName: {
		type: String,
		default: ''
	},
	required: {
		type: Boolean,
		default: false
	},
	value: {
		type: [String, Array, Number, Object, Boolean],
		deault: ''
	},
	titleFlex: {
		type: [Number, String],
		default: 1
	},
	contentFlex: {
		type: [Number, String],
		default: 4
	},
	titleStyle: {
		type: String,
		default: ''
	},
	contentStyle: {
		type: String,
		default: ''
	},
	titleLayout: {
		type: String,
		default: 'default'
	},
	contentLayout: {
		type: String,
		default: 'default'
	},
	boxStyle: {
		type: String,
		default: ''
	},
	title: {
		type: String,
		default: ''
	},
	titleHide: {
		type: Boolean,
		default: false
	},
	fontSize: {
		type: Number,
		default: 30
	},
	width: {
		type: String,
		default: '100%'
	},
	customId: {
		type: [String, Number, Object],
		default: ''
	},
	requiredSign: {
		type: String,
		default: '*'
	},
	layout: {
		type: String,
		default: 'row'
	},
	itemDisabled: {
		type: Boolean,
		default: false
	},
	itemLayout: {
		type: String,
		default: ''
	},
	titleColor: {
		type: String,
		default: '#999'
	}
}

export default ({
	QSInputsType
} = {}) => {
	return {
		name: 'QS_' + QSInputsType,
		props: {
			...publicProps
		},
		model: {
			prop: 'value',
			event: 'input'
		},
		data() {
			return {
				type: QSInputsType
			}
		},
		created() {
			switch (QSInputsType){
				case _app.typeObj.pics:
					this.setForm(this.value || this.itemArray);
					break;
				case _app.typeObj.infinitePics:
					this.setForm(this.value || this.itemArray);
					break;
				default:
					this.setForm(this.value);
					break;
			}
		},
		computed: {
			contentLayout_computed() {
				switch (this.contentLayout){
					case 'center':
						return 'flex_row_c_c';
						break;
					case 'left':
						return 'flex_row_none_c';
						break;
					case 'right':
						return 'flex_row_e_c';
						break;
					default:
						if(this.layout === 'column') {
							return 'flex_row_none_c';
						}else{
							return 'flex_row_e_c';
						}
						break;
				}
			},
			itemLayout_computed() {
				switch (this.itemLayout){
					case 'center':
						return 'flex_row_c_c';
						break;
					case 'left':
						return 'flex_row_none_c';
						break;
					case 'right':
						return 'flex_row_e_c';
						break;
					default:
						if(this.layout === 'column') {
							return 'flex_row_none_c';
						}else{
							return 'flex_row_e_c';
						}
						break;
				}
			}
		},
		beforeDestroy() {
			this.delForm();
		},
		methods: {
			setValue(value) {
				this.$emit('input', value);
				this.$emit('change', value);
				this.setForm(value);
			},
			delForm() {
				if (this.name && this.variableName) {
					_app.delForm({
						name: this.name,
						variableName: this.variableName,
					})
				}
			},
			setForm(value) {
				if (this.name && this.variableName) {
					_app.setForm({
						title: this.title,
						name: this.name,
						variableName: this.variableName,
						value,
						type: this.type,
						required: this.required,
						verifyFc: this.verifyFc,
						verifyType: this.verifyType,
						customId: this.customId,
						upLoadData: this.upLoadData	//图片上传自定义数据
					})
				}
			},
			setData(data) {
				if(this.$refs.inputsRef && this.$refs.inputsRef.setData && typeof this.$refs.inputsRef.setData === 'function') {
					this.$refs.inputsRef.setData(data);
				}else{
					_app.log('not find ref or setData!');
				}
			}
		}
	}
}
