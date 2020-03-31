<template>
	<view class="wrap">
		<view class="" v-if="datalist.length>0">
			<view class="title">{{datalist[0].bt}}</view>
			<view class="" style="display: flex;color: #9E9E9E;justify-content: space-between;padding: 0  20px;">
				<view class="">
					发件人：{{datalist[0].fjr}}
				</view>
				<view class="">
					时间：{{datalist[0].modify_time}}
				</view>
			</view>
			<view class="contenst" v-html="datalist[0].cont">
			</view>
		</view>
		<uni-loading v-if="!datalist[0]" :status="status" color="#888" />
	</view>
</template>

<script>
	import uniLoading from '@/components/mix-load-more/mix-load-more';
	export default{
		components: {
			uniLoading
		},
		data(){
			return{
				datalist:[],
				id:'',
				statusid:'',
				status:1
			}
		},
		methods:{
			getdatas(index){
				console.log(this.id)
				let url =this.$api.select +  "/sqfw/select/srvzhsq_xxtz_select"
				let req = {};
				req.serviceName = 'srvzhsq_xxtz_select';
				req.colNames =  ['*'];
				req.condition = [{colName: "id", ruleType: "eq", value: this.id}]
				req.order = [];
			
				this.$http.post(url, req).then(res => {
					this.datalist=(res.data.data)
				})
			},
			infolist(){
				let url =this.$api.select + "/sso/operate/"+'srvsso_info_state_update'
				let req = 	[
					{"serviceName":"srvsso_info_state_update",
					"condition":[
						{"colName":"id","ruleType":"eq","value":this.statusid},
					],"srvApp":"sso"},
				]
				this.$http.post(url, req).then(res => {
					console.error(res)
				})
			},
			
		},
		onLoad(option){
		this.id=(option.id)
		this.statusid=option.statusid
			this.getdatas()
			 uni.setNavigationBarTitle({
			   title:'消息详情'
			 });
			 this.infolist()
			 this.getmessages()
		},
		
	}
</script>

<style>
	.wrap{
		background: #FFFFFF;
		width: 100%;
	}
	.title{
		line-height: 27px;
		font-weight: bold;
		font-size: 17px;
		margin: 15px 0;
		text-align: center;
	}
	.contenst{
		padding: 10px;
	}
</style>
