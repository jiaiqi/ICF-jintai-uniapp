export const errObj = {
	"102": {
		errMsg: '上传图片错误',
		code: 102
	},
	"101": {
		errMsg: '未找到该name对应的数据',
		code: 101
	},
	"ok": {
		errMsg: 'ok',
		code: 1
	}
}

function filterStatus(s) {
	let t = '未知';
	switch (s){
		case 1:
			t = 'success';
			break;
		case 2:
			t = 'warn';
		case 3:
			t = 'error';
		default:
			break;
	}
	return t;
}

export default function Msg(obj) {
	const { s, c, v } = obj;
	const returnObj = {
		status: filterStatus(s)
	};
	if(c) {
		returnObj.result = {...errObj[c], data: null};
	}else{
		returnObj.result = {...errObj.ok, data: v};
	}
	return returnObj;
}

