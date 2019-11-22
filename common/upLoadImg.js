var _app = {
	interface: {
		upLoadImg:	'', // 服务器地址
	},
	showToast(msg) {
		uni.showToast({
			title: msg,
			icon: 'none'
		})
	},
	showLoading(msg, ifmask) {
		uni.showLoading({
			title: msg,
			mask: ifmask||false
		})
	},
	hideLoading() {
		uni.hideLoading();
	},
	UpLoadFile(url, data, name, filePath, scb, fcb) {		// 服务器地址， 携带数据， name， 文件路径， 成功回调函数， 失败回调函数
		let _this = this;
		_this.showLoading('上传文件中');
		uni.uploadFile({
			url,
			formData: data,
			name: name,
			filePath,
			success(res) {
				_this.hideLoading();
				if (scb && typeof(scb) == 'function') scb(res);
			},
			fail(err) {
				_this.hideLoading();
				if (fcb && typeof(fcb) == 'function') fcb(err);
			}
		})
	}
}
export default _app;