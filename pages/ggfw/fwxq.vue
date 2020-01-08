<template>
	<view class="content" v-if="datalist">
		<view>
			<text class="titlename">房 屋 名 称：</text>
			<text>{{ datalist.title }}</text>
		</view>
		<view>
			<text class="titlename">房 屋 地 址：</text>
			<text>{{ datalist.address?datalist.address:'未填写' }}</text>
		</view>
		<view class="titlename">办 理 对 象：</view>
		<view class="cont-box">{{ datalist.bldx?datalist.bldx:'未填写' }}</view>
		<view class="titlename">办 理 条 件：</view>
		<view class="cont-box">{{ datalist.bltj?datalist.bltj:'未填写' }}</view>

		<view class="titlename">办 理 流 程：</view>
		<view class="cont-box" v-html="datalist.content?datalist.content:'未填写' "></view>

		<view class="titlename">材 料 清 单：</view>
		<view class="cont-box">{{ datalist.materials?datalist.materials:'未填写' }}</view>
		<view class="titlename">办 理 时 限：</view>
		<view class="cont-box">{{ datalist.blsx?datalist.blsx:'未填写' }}</view>
		<view class="titlename">收 费 标 准：</view>
		<view class="cont-box">{{ datalist.sfbz?datalist.sfbz:'未填写' }}</view>
		<view class="titlename">接 待 时 间：</view>
		<view class="cont-box">{{ datalist.reception_date?datalist.reception_date:'未填写' }}</view>

		<view>
			<text class="titlename">接 待 人 员：</text>
			<text>{{ datalist.reception_oper?datalist.reception_oper:'未填写' }}</text>
		</view>
		<view>
			<text class="titlename">联 系 电 话：</text>
			<text>{{ datalist.reception_phone?datalist.reception_phone:'未填写' }}</text>
		</view>

		<view class="titlename">接 待 地 点：</view>
		<view class="cont-box">{{ datalist.reception_address?datalist.reception_address:'未填写' }}</view>
		<view v-if="datalist.files">
			<text class="titlename">附 件 下 载：</text>
			<text style="color:blue;" @click="downFile(datalist.files)">点击下载附件</text>
		</view>
		<view v-else>
			<text class="titlename">附 件 下 载：</text>
			<text>暂无附件</text>
		</view>

		<view class="btn" v-if="btnbox" @click="navto(datalist.title)">申请预约</view>
		<view class="btns" v-else>申请预约</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				datalist: [],
				query: {},
				btnbox:true
			};
		},
		methods: {
			navto(val) {
				// uni.navigateTo({
				//   url: '../normal/add/add?query=' + encodeURIComponent(JSON.stringify(this.query)) + '&info='+encodeURIComponent(JSON.stringify(val))
				// });
				uni.navigateTo({
					url: './sqyy?query=' + encodeURIComponent((JSON.stringify(val)))
				})
			},
			downFile(file) {
				uni.showLoading({
					title: '下载中，请稍后'
				})
				let path = this.$api.select + '/file/download?filePath=';
				let url = this.$api.select + '/file/select/srvfile_attachment_select';
				let req = {
					colNames: ['*'],
					condition: [{
						colName: 'file_no',
						ruleType: 'eq',
						value: file // 编号
					}],
					order: null,
					page: null,
					serviceName: 'srvfile_attachment_select'
				};
				this.$http.post(url, req).then(res => {
					console.log(path + res.data.data[0].fileurl)
					uni.downloadFile({
						url: path + res.data.data[0].fileurl,
						success: function(res) {
							console.log(res)
							if (res.statusCode === 200) {
								setTimeout(() => {
									uni.hideLoading();
									console.log('下载成功');
									uni.showModal({
										title: '下载成功',
										showCancel: false,
										content: "存储路径——内部存储/Android/data/io.dcloud.HBuilder/apps/HBuilder/doc/uniapp_save",
										success: function(res) {

										}
									});
								}, 2000)

							}
						}
					});
				})



			},

		},

		onLoad(options) {
			this.datalist = JSON.parse(decodeURIComponent(options.info));
			console.log(this.datalist);
			if (options.query) {
				this.query = JSON.parse(decodeURIComponent(options.query));
			}
			
			let userInfo = uni.getStorageSync('userInfo');
			if(userInfo.user_no=="niming"){
				this.btnbox=false
			}
		}
	};
</script>

<style>
	.content {
		width: 100%;
		background: #ffffff;
		padding: 30upx;
	}

	.titlename {
		font-weight: 600;
		line-height: 60px;
		font-size: 16px;
	}

	.cont-box {
		padding: 0 30upx;
	}

	.btn {
		margin: 40upx 20upx;
		height: 80upx;
		background: red;
		color: #ffffff;
		font-weight: 600;
		text-align: center;
		line-height: 80upx;
		border-radius: 20upx;
	}
	.btns{
		margin: 40upx 20upx;
		height: 80upx;
		background: #999;
		color: #ffffff;
		font-weight: 600;
		text-align: center;
		line-height: 80upx;
		border-radius: 20upx;
	}
</style>
