<template>
	<view class="content">
		<view class="Choice" v-for="(item,index) in datalist"  :key="index"  @click="navto(item)">
			<view class="box-content" style="">
				<!-- <image class="img" src="../../static/img/lz.png" mode=""></image> -->
        <text class="texsr">{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				datalist:[]
			}
		},
		methods:{
			getData(options){
				let url = this.$api.select+'/sqfw/select/srvzhsq_tenement_'+options+'_select';
				let req = {};
				req.serviceName = 'srvzhsq_tenement_'+options+'_select';
				req.colNames = ['*'];
				req.condition = [];
				req.order = [];
				req['page'] = {
					pageNo: 1,
					rownumber: 10
				};
				req.proc_data_type='myall'
				this.$http.post(url, req).then(res => {
					this.datalist=res.data.data
				})
			},
			navto(item){
				uni.navigateTo({
					url:'./fwxq?query=' + encodeURIComponent(JSON.stringify(item))
				})
			}
		},
		onLoad(options){
			this.getData(options.query)
		}
	}
</script>

<style>
	.content{
		width: 100%;
		background: #FFFFFF;
	}
	.img{
		height: 150upx;
		width: 150upx;
		border-radius: 20upx;
		margin-right: 50upx;
	}
	.texsr{
		font-size: 17px;
		font-weight: 600;
		line-height: 150upx;
		}
		.box-content{
			display: flex;
			padding: 10upx;
			    box-shadow: 0 0 26px 0 rgba(0,0,0,.15);
				margin: 30upx  30upx  15upx  30upx;
				border-radius: 25upx;
		}
</style>
