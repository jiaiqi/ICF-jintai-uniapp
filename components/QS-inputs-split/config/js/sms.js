/**
 * 发送验证码方法
 * @param {any} customId
 * @param {String} phone
 */
// 目前 点击获取验证码按钮后会emit一个getCode事件至父级，所以自己在外面发送验证码，并且验证也是自己做校验
export default function sendSMS(phone) { // 发送验证码方法, 需返回生成的验证码
	let code = '123456'; // 生成验证码
	//发送验证码
	uni.showToast({title: `发送验证码给${phone}成功,请注意查收`, icon: 'none'});
	return code; // 必须return生成的验证码
}