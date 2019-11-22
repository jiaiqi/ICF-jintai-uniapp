// 常量
if(!globalThis)var globalThis = {}
globalThis.PATH="/geomantic/"

/**
 *  @name 请求
 */
async function apiPost(url,params){
	if(!params)console.warn("没有传入参数params");
	return await new Promise((resolve,reject)=>{
		uni.request({
			url:PATH+url,
			method :"POST",
			header:{
				"content-type":"application/x-www-form-urlencoded"
			},
			data:params,
			success(res) {
				resolve(res.data)
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

async function showLoading(){
	uni.showLoading({
		title:"请等待",
		mask:true,
	})
}

/**
 * @name 显示toast
 * @param res {status:"0",(msg||data):""}
 */
async function showToast(res){
	uni.showToast({
		title: (res.msg||res.data).toString().slice(0,7),
		mask: true,
		icon: res.status==0?"success":"",
		duration: 1500
	});
}

export default {
	apiPost,
}