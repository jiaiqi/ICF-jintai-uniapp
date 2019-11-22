import Msg from './Msg.js';

class QSForm {
	constructor() {
		this.formObj = {};
	}
	set(obj) {
		const {
			name,
			variableName,
			value,
			type,
			required,
			verifyFc,
			verifyType
		} = obj;
		if (!name) return;
		if (!this.formObj[name]) this.formObj[name] = {};
		if (!variableName) return;
		this.formObj[name][variableName] = {...obj};
	}
	del(obj) {
		const {
			name,
			variableName
		} = obj;
		if (!name || !variableName) return;
		if (this.formObj[name] !== undefined && this.formObj[name] && this.formObj[name][variableName] !==undefined) 
			delete this.formObj[name][variableName];
		if(this.formObj[name]&&Object.keys(this.formObj[name]).length===0) 
			delete this.formObj[name];
	}
	get(obj) {
		const {
			name
		} = obj;
		if (!name) return Promise.reject({
			s: 3,
			c: 101
		});
		if (this.formObj[name] !== undefined) {
			const dataObj = { ...this.formObj[name]
			};
			return Msg({
				s: 1,
				v: dataObj
			});
		} else {
			return Msg({
				s: 3,
				c: 101
			});
		}

	}
}
if (!QSFormObj) var QSFormObj = new QSForm();
export default QSFormObj;
