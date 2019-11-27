<template>
	 <view class="contentboxs">
			<view class="content-newsdata" >
				<view class="doubletext">
					<text class="titleler">组织名称：</text><text class="contenttite" v-if="datalist[0]">{{datalist[0].zjmc}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler">组织介绍：</text><text v-if="datalist[0]" v-html="datalist[0].zjjs" class="contenttite"></text>
				</view>
				<view class="doubletext">
					<text class="titleler textfont">书&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;记：</text><text class="contenttite" v-if="datalist[0]">{{datalist[0].zjsj}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler textfont">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话：</text><text class="contenttite" v-if="datalist[0]">{{datalist[0].zjdh}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler textfont">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：</text><text class="contenttite" v-if="datalist[0]">{{datalist[0].zjdz}}</text>
				</view>
			</view>
	 </view>
</template>
http://39.98.203.134:8081/zhdj/select/srvzhsq_dzzjg_select
<script>
	export default{
		data(){
			return{
				datalist:[{}]
			}
		},
		methods:{
			getdata(index){
				
				let url =this.$api.select +  "/zhdj/select/srvzhsq_dzzjg_select"
				let req = {};
				req.serviceName = 'srvzhsq_dzzjg_select';
				req.colNames =  ["id", "zjmc", "no", "zjlx",
				 "zjjs", "tp", "zjsj", "zjdh", "zjdz", "zjbz",
				  "parent_no","_parent_no_disp","is_leaf","path",
				  "create_user_disp","create_time","modify_user_disp","modify_time"];
				req.condition =  [{colName: "id", ruleType: "eq", value: index}];
				req.order = [];
				req['page'] = {
					pageNo: 1,
					rownumber: 8
				};
				this.$http.post(url, req).then(res => {
					console.error(res)
					this.datalist=res.data.data
				})
			},
		},
		onLoad(id){
			this.getdata(id.id)
		}
	}
</script>

<style>
	.contentboxs{
		width: 100%;
	}
	.content-newsdata{
		padding: 40upx;
	}
	.doubletext{
		display: flex;
		padding: 20upx 0;
		border-bottom: 0.5px solid #EEEEEE;
	}
	.titleler{
		width: 30%;
	}
	.contenttite{
		width: 70%;
	}
	.textfont{
		/* letter-spacing:12px; */
	}
</style>
