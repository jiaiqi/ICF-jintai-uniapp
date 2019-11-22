import log from '../config/js/log';
import { getSendData, getAsyncDataFc } from '../config/js/picker';
import interfaces from '../config/js/interfaces';
import { inputCustomTapFc, inputCustomTapCatchFc, filterTypeObj, verifyTypeObj } from '../config/js/input';
import { UpLoadFile, pics_splice } from '../config/js/pics';
import sendSMS from '../config/js/sms';
import { errObj } from './Msg.js';
const Sys = uni.getSystemInfoSync();
const getPickerAsyncData = async function(obj) { // picker-custom与picker-custom2的逐级获取数据函数
	let _this = this;
	_this.waiting = true; // 在获取数据时不许用户点确定
	obj.linkageNum = Number(obj.linkageNum);
	const {
		value, // picker的value值
		index, // picker改变的列的下标
		launch, // 是否是初始化
		datas, // 所有picker数据
		oldValue, // 旧的picker的value值
		customId, // 自定义标识
		linkageNum // 联动级数
	} = obj; // picker的value值， 需改变数据的变量名， 是否初始化时使用该函数，页面当前数据: {data_0: 第一列数据, data_1: 第二列数据, data_2: 第三列数据}, 旧的picker的value值, 逐级获取数据时决定携带数据的变量名
	const {
		data_0, // 第一列数据
		data_1 // 第二列数据
	} = datas; // 页面当前数据: {data_0: 第一列数据, data_1: 第二列数据, data_2: 第三列数据}

	// 使用sendData访问接口获取数据, 最终需要给async_1、async_2赋值
	let sendData = {};
	try {
		switch (linkageNum) {
			case 2: // 二级联动
				if (!!_this.memoryData_1[value[0]]) { // 查询记忆数据
					_this.async_1 = [..._this.memoryData_1[value[0]]]; // 直接赋值记忆数据
				} else {
					sendData = getSendData(obj); // 访问接口携带参数
					const newData_1 = await getAsyncDataFc(sendData); // 从接口获取第二列的数据
					_this.async_1 = [...newData_1]; // 赋值
					_this.memoryData_1[value[0]] = [...newData_1]; // 记忆数据
				}
				if (launch) { // 首次初始化 value为传进来的defaultValue
					_this.value[1] = value[1]; // 初始化可以赋值初始化的值
				} else {
					_this.value[1] = 0; // 第二列value重置为0
				}
				break;
			case 3: // 三级联动
				if (launch) { // 首次初始化 value为传进来的defaultValue
					// 获取第二列数据
					sendData = getSendData({ ...obj,
						column: 0
					}); // 访问接口携带参数
					const newData_1 = await getAsyncDataFc(sendData); // 从接口获取第二列的数据
					_this.async_1 = [...newData_1]; // 给第二列赋值
					_this.memoryData_1[value[0]] = [...newData_1]; // 记忆数据
					_this.value[1] = value[1]; // 初始化可以赋值初始化的值
					// 获取第三列数据
					sendData = getSendData({ ...obj,
						datas: { ...datas,
							data_1: [...newData_1]
						},
						column: 1
					}); // 访问接口携带参数
					const newData_2 = await getAsyncDataFc(sendData);
					_this.async_2 = [...newData_2]; // 给第三列赋值
					if (!_this.memoryData_2[value[0]])
						_this.memoryData_2[value[0]] = [];
					_this.memoryData_2[value[0]][value[1]] = [...newData_2]; // 记忆数据
					_this.value[2] = value[2]; // 初始化可以赋值初始化的值
				} else { // picker滑动
					let newData_1;
					let newData_2;
					switch (index) {
						case 0: // 第一列更改
							// 获取第二列数据
							if (!!_this.memoryData_1[value[0]]) { // 查询记忆数据
								newData_1 = [..._this.memoryData_1[value[0]]]; // 直接赋值记忆数据
							} else {
								sendData = getSendData({ ...obj,
									column: 0
								}); // 访问接口携带参数
								newData_1 = await getAsyncDataFc(sendData);
								_this.memoryData_1[value[0]] = [...newData_1]; // 记忆数据
							}
							_this.async_1 = [...newData_1]; // 给第二列赋值
							_this.value[1] = 0; // 初始化可以赋值初始化的值

							// 获取第三列数据
							if (!_this.memoryData_2[value[0]])
								_this.memoryData_2[value[0]] = [];
							if (!!_this.memoryData_2[value[0]][value[1]]) { // 查询记忆数据
								newData_2 = [..._this.memoryData_2[value[0]][value[1]]]; // 直接赋值记忆数据
							} else {
								sendData = getSendData({ ...obj,
									datas: { ...datas,
										data_1: [...newData_1]
									},
									column: 1
								}); // 访问接口携带参数
								newData_2 = await getAsyncDataFc(sendData);
								_this.memoryData_2[value[0]][value[1]] = [...newData_2]; // 记忆数据
							}
							_this.async_2 = [...newData_2] // 给第三列赋值
							_this.value[2] = 0; // 初始化可以赋值初始化的值
							break;
						case 1: // 第二列更改
							log('第二列更改')
							if (!_this.memoryData_2[value[0]])
								_this.memoryData_2[value[0]] = [];
							if (!!_this.memoryData_2[value[0]][value[1]]) { // 查询记忆数据
								log('有记忆数据');
								newData_2 = [..._this.memoryData_2[value[0]][value[1]]]; // 直接赋值记忆数据
							} else {
								log('没有记忆数据');
								sendData = getSendData(obj); // 访问接口携带参数
								newData_2 = await getAsyncDataFc(sendData);
								_this.memoryData_2[value[0]][value[1]] = [...newData_2]; // 记忆数据
							}
							_this.async_2 = [...newData_2]; // 给第三列赋值
							_this.value[2] = 0; // 初始化可以赋值初始化的值
							break;
						default:
							break;
					}
				}
				break;
		}
		_this.oldValue = [...this.value];
		_this.waiting = false;
	} catch (e) {
		//TODO handle the exception
		log(`picker async 异常: ${JSON.stringify(e)}`);
		_this.oldValue = [...this.value];
		_this.waiting = false;

	}
}

const isArray = function (data) {
	return data instanceof Array;
}

const isArrayAndHasLength = function (data) {
	return data instanceof Array && data.length > 0;
}

const typeObj = {
	input: 'input',
	radio: 'radio',
	checkbox: 'checkbox',
	textarea: 'textarea',
	picker_date: 'picker_date',
	picker_city: 'picker_city',
	picker_custom: 'picker_custom',
	picker_custom2: 'picker_custom2',
	pics: 'pics',
	infinitePics: 'infinitePics',
	['switch']: 'switch'
}
import QSFormObj from './QSForm.js'; // 勿动
const _app = {
	log, //打印管理
	typeObj,
	UpLoadFile,
	pics_splice,
	sendSMS,
	verifyTypeObj, // 内置正则验证
	filterTypeObj, // 内置过滤函数
	inputCustomTapFc,
	inputCustomTapCatchFc,
	Sys,
	getPickerAsyncData, // picker-custom与picker-custom2的逐级获取数据函数
	isArray,
	isArrayAndHasLength,
	showToast(msg, type) {
		uni.showToast({
			title: msg,
			icon: type || 'none'
		})
	},
	regTest(name, val) {
		return verifyTypeObj[name].reg.test(val);
	},
	isNumber(param) {
		return typeof(param) === 'number';
	},
	countDays(Y, M, val, mode) {
		let days = [];
		if (mode >= 6) {
			days = new Date(Y, M + 1, 0).getDate();
			if (val) {
				val[2] = val[2] < days - 1 ? val[2] : days - 1;
			}
		}
		return {
			days,
			val
		};
	},
	countYears(sy, ey) {
		let _this = this;
		let y = [];
		let c = ey - sy;
		for (let i = 0; i <= c; i++) {
			y.push(sy + i);
		}
		return y;
	},
	hideLoading() {
		uni.hideLoading();
	},
	showLoading(msg, ifmask) {
		uni.showLoading({
			title: msg,
			mask: ifmask || false
		})
	},
	previewImage(imgPath, currentIndex) {
		if (!(imgPath instanceof Array))
			imgPath = [imgPath];
		uni.previewImage({
			urls: imgPath,
			current: currentIndex || 0
		})
	},
	filterParams(params, type, checkOneVariableName) {
		if (params.length === 0)
			return {};
		const arr = getParamsArray(type);
		if (params.length > 1) {
			const o = {};
			Object.keys(params).forEach((item, index) => {
				o[arr[index]] = params[index];
			})
			return o;
		} else {
			if(params[0] instanceof Object){
				
				if(checkOneVariableName) {
					const ps = Object.keys(params[0]);
					for(let i = 0; i < ps.length; i++) {
						if(arr.includes(ps[i])) {
							return params[0];
						}
					}
					return { [arr[0]]: params[0] };
				}else{
					return params[0];
				}
			}else{
				return { [arr[0]]: params[0] };
			}
		}
	},
	formatNum(num) {
		return num<10?('0' + num):num;
	},
	getUpLoadPromiseArray({itemArray, customId, upLoadData, required}) {
		if(itemArray.length === 0 && required) {
			return Promise.reject({...errObj['102'], errMsg: '上传图片长度为零'});
		}else{
			const promiseArr = [];
			for(let i = 0; i < itemArray.length; i++) {
				const item = itemArray[i];
				if(item.path) {
					promiseArr.push(UpLoadFile(customId, item.path, upLoadData));
				}else{
					if(item.required) {
						const errMsg = `${item.title||`第${i}张图片`}不能为空`;
						uni.showToast({title: errMsg, icon: 'none'});
						return Promise.reject({...errObj['102'], errMsg});
					}else{
						promiseArr.push(Promise.resolve(''));
					}
				}
			}
			return new Promise((resolve, reject)=>{
				const newArr = [...itemArray];
				uni.showLoading({
					title: '上传文件中'
				})
				Promise.all(promiseArr).then(res=>{
					uni.hideLoading();
					for(let i = 0; i < newArr.length; i++) {
						newArr[i].upLoadResult = res[i];
					}
					resolve(newArr);
				}).catch(err=>{
					uni.hideLoading();
					reject(err);
				})
			});
		}
	},
	delForm(obj) {
		QSFormObj.del(obj);
	},
	setForm(obj) {
		QSFormObj.set(obj);
	},
	getForm(name) {
		const {
			status,
			result
		} = QSFormObj.get({
			name
		});
		if (status === 'success') {
			// log('getForm数据成功:' + JSON.stringify(res));
			return new Promise(async (resolve, reject) => {
				try{
					const {
						data
					} = result;
					const returnObj ={ 
						name,
						...(await getValue(data))
					};
					resolve(returnObj);
				}catch(e){
					//TODO handle the exception
					reject(e);
				}
			});
		} else {
		console.log(3)
			// log('getForm数据失败:' + JSON.stringify(res));
			return Promise.reject(result);
		}
	}
}
export default _app;

function renderUrlData(u, d) {
	let c = '';
	let n = 0;
	if (d) {
		for (let i in d) {
			let itemd = d[i];
			if(itemd instanceof Object || itemd instanceof Array) {
				itemd = JSON.stringify(itemd);
			}
			if (n > 0)
				c += '&' + i + '=' + itemd;
			else
				c += '?' + i + '=' + itemd;
			++n;
		}
	}
	return u + c;
}

const errTypeObj = {
	required: 'required',
	verifyFc: 'verifyFc',
	verifyType: 'verifyType'
}

function getValue(obj) {
	const returnObj = {
		data: {},
		verifyErr: []
	};
	return new Promise(async (resolve, reject) => {
		try{
			for (const o in obj) {
				const {
					title,
					name,
					variableName,
					value,
					type,
					required,
					verifyFc,
					verifyType,
					customId,
					upLoadData
				} = obj[o];
				const verifyItem = {result: true, checkErrType: [], title, name, variableName, type, errItemArray:[] };
				returnObj.data[o] = value;
				switch (type){
					case typeObj.input:	//input
						if(required && isEmpty(value)) {
							verifyItem.result = false;
							verifyItem.checkErrType.push(errTypeObj.required);
						}
						
						if(verifyFc&&!verifyFc(value)) {
							if(verifyItem.result) verifyItem.result = false;
							verifyItem.checkErrType.push(errTypeObj.verifyFc);
						}
						
						if(verifyType&&verifyTypeObj[verifyType]!==undefined&&verifyTypeObj[verifyType].reg&&!verifyTypeObj[verifyType].reg.test(value)) {
							if(verifyItem.result) verifyItem.result = false;
							verifyItem.checkErrType.push(errTypeObj.verifyType);
						}
						break;
					case typeObj.textarea:	//textarea
						if(required && isEmpty(value)) {
							verifyItem.result = false;
							verifyItem.checkErrType.push(errTypeObj.required);
						}
						
						if(verifyFc&&!verifyFc(value)) {
							if(verifyItem.result) verifyItem.result = false;
							verifyItem.checkErrType.push(errTypeObj.verifyFc);
						}
						
						if(verifyType&&verifyTypeObj[verifyType]!==undefined&&verifyTypeObj[verifyType].reg&&!verifyTypeObj[verifyType].reg.test(value)) {
							if(verifyItem.result) verifyItem.result = false;
							verifyItem.checkErrType.push(errTypeObj.verifyType);
						}
						break;
					case typeObj.pics:	//pics
						if(isArrayAndHasLength(value)) {
							const notPathArr = value.filter(item=>!item.path && item.required);
							if(notPathArr.length > 0) {
								if(verifyItem.result) verifyItem.result = false;
								verifyItem.checkErrType.push(errTypeObj.required);
								verifyItem.errItemArray = notPathArr;
							}else{
								returnObj.data[o] = await (await _app.getUpLoadPromiseArray({itemArray: value, customId, upLoadData}));
							}
						}else{
							returnObj.data[o] = [];
						}
						break;
					case typeObj.infinitePics:	//infinitePics
						if(isArrayAndHasLength(value)) {
							returnObj.data[o] = await (await _app.getUpLoadPromiseArray({itemArray: value, customId, upLoadData}));
						}else{
							if(required) {
								if(verifyItem.result) verifyItem.result = false;
							}else{
								returnObj.data[o] = [];
							}
						}
						break;
					default:	//default
						if(required && isEmpty(value)) {
							verifyItem.result = false;
							verifyItem.checkErrType.push(errTypeObj.required);
						}
						break;
				}
				if(!verifyItem.result) returnObj.verifyErr.push(verifyItem);
			}
			resolve(returnObj);
		}catch(e){
			//TODO handle the exception
			reject(e);
		}
	})
}

function isEmpty(val) {
	let bl;
	switch (typeof val){
		case 'object':
			if(val instanceof Array) {
				bl = val.length === 0;
			}
			break;
		default:
			bl = val === '';
			break;
	}
	
	return val === undefined || val === null || bl;
}
