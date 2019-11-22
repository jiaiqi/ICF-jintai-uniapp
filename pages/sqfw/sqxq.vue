<template>
	<view class="content">
		<view class="box-bar">
			<view class="sq-text">
				幸福小区位于西安市雁塔区科技路224号，小区住户约200户。小区内部环境典雅圆静，绿化多，通过小区道路的合理组织，休闲设施的精心安排，提供自然、舒适的居住环境。周边配套齐全，设施完备，物业管理完善，保安24小时值班，住户素质高。
			</view>
			<view class="btnbox">
					<button type="primary" size="mini" @click="map">社区导航</button><br><br>
					<button type="primary" @click="callphone" size="mini">联系社区</button>
			</view>
		</view>
		<image style="width: 100%;" src="../../static/img/sqxq.png" mode=""></image>
		<view class="sqs-text">
			幸福小区位于西安市雁塔区科技路224号，小区住户约200户。小区内部环境典雅圆静，绿化多，通过小区道路的合理组织，休闲设施的精心安排，提供自然、舒适的居住环境。周边配套齐全，设施完备，物业管理完善，保安24小时值班，住户素质高。
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				listhome:[],
				phone:"",
				navtitle:""
			}
		},
		methods:{
			getdata(){
				let url = "http://39.98.203.134:8081/sqfw/select/srvzhsq_information_select?srvzhsq_information_select"
				let req = {};
				req.serviceName = 'srvzhsq_information_select';
				req.colNames = ['*'];
				req.condition = [];
				req.order = [];
				req['page'] = {
					pageNo: 1,
					rownumber: 10
				};
				this.$http.post(url, req).then(res => {
					console.log(res.data.data[1].sqbrief)
					this.listhome =res.data.data
				})
			},
			callphone(){
				console.log(this.phone)
				uni.makePhoneCall({
				    phoneNumber: this.phone
				});
			},
			map(){
				uni.navigateTo({
					url: './sqdh',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		onLoad(){
			this.getdata()
			let that = this
			uni.getStorage({
			    key: 'name',
			    success: function (res) {
			        console.log(res.data);
					
					that.phone=JSON.stringify(res.data.phone)
					  console.log(that.phone);
					that.navtitle = res.data.sqname
					uni.setNavigationBarTitle({
						    title: res.data.sqname
					}); 
			    }
			});
		}
	}
</script>

<style>
	.content{
		width: 100%;
		background: #FFFFFF !important;
	}
	.btnbox {
		margin-left: 20upx;
		width: 30%;
	}
	.box-bar{
		display: flex;
		padding: 25upx;
	}
	.sq-text{
		width: 70%;
		font-size: 14px;
		text-indent: 2em;
		line-height: 22px;
	}
	.sqs-text{
		font-size: 14px;
		text-indent: 2em;
		line-height: 22px;
		padding: 25upx;
	}
	.btnbox button{
		margin-left: 12upx;
		margin-top: 20%;
	}
</style>
