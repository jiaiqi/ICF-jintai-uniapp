<template>
	<view class="conent">
		<!-- 
		<view class="tabbar">
			<text @click="listcolor(index)" :class="idx==index?'listbordercolor':''" v-for="(item,index) in barlist" :key="index">{{item.title}}</text>
		</view> -->
		<view class="" style="margin: 20px;">
			<view class="" style="font-weight: 600;  padding:0 10px; border-left: 2px solid red;">
				综合服务
			</view>
		</view>
		<view class="contents">
			<view class="boxone" v-for="(item,index) in list" :key="index" @click="linkurl(item.fw_url)">
				<image class="icon" :src="item.img_path" mode=""></image>
				<view class="" style="text-align: center; font-size: 15px; padding: 5px;">{{item.fw_name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				barlist:[
					{'title':'社保服务'},
					{'title':'综合服务'}
				],
				idx:0,
				list:[
					
				],
			
			}
		},
		methods:{
			listcolor(index){
				this.idx=index
			},
			linkurl(url){
				plus.runtime.openWeb(url, function(res) {
					console.log(res);  
				});  
				// uni.navigateTo({
				// 	url: './dsftwo?url='+url,
				// 	success: res => {},
				// 	fail: () => {},
				// 	complete: () => {}
				// });
			},
			getdata(){
				let url = this.$api.select + '/sqfw/select/srvzhsq_bmfw_thirdservice_select';
				let req = {};
				req.serviceName = "srvzhsq_bmfw_thirdservice_select";
				req.colNames = ['*'];
				req.condition = [];
				req.order = [];
			
				this.$http.post(url, req).then(res => {
					console.log(res)
					this.list=res.data.data
				})
			}
		},
		onLoad(){
			this.getdata()
		}
	}
</script>

<style>
	.conent{
		width: 100%;
		background: #FFFFFF;
	}
	.tabbar{
		display: flex;
		padding: 10upx 130upx;
		justify-content: space-between;
		text-align: center;
	}
	.tabbar text{
		font-weight: 600;
	} 
	.listbordercolor{
		padding-bottom: 10upx;
		border-bottom: 2px solid #EC5F4B;
	}
	.icon{
		margin: 0 auto;
		display: block;
		height: 110upx;
		width: 110upx;
		border-radius: 8px;
	}
	.contents{
		display: flex;
		padding: 30upx;
		flex-wrap: wrap;
		padding-bottom: 0;
	}
	.boxone{
		margin-bottom: 40upx;
		width: 33%;
	}
</style>
