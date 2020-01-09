<template>
	 <view class="contentboxs">
			<view class="content-newsdata"  v-if="showBoole">
				<view class="doubletext">
					<text class="titleler">组织名称：</text><text class="contenttite" v-if="datalist[0]">{{datalist[0].zjmc==null?'未录入':datalist[0].zjmc}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler">组织介绍：</text>
							<rich-text  :nodes="datalist[0].zjjs"  class="contenttite">
						</rich-text >
				</view>
				<view class="doubletext">
					<text class="titleler textfont">书&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;记：</text><text class="contenttite" v-if="datalist[0]">{{datalist[0].zjsj==null?'未录入':datalist[0].zjsj}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler textfont">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话：</text><text class="contenttite" v-if="datalist[0]">{{datalist[0].zjdh==null?'未录入':datalist[0].zjdh}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler textfont">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：</text><text class="contenttite" v-if="datalist[0]">{{datalist[0].zjdz==null?'未录入':datalist[0].zjdz}}</text>
				</view>
			</view>
			
			<view class="content-newsdata" v-else>
				<view class="" style="		margin: 8px 0;">
					<text style="" class="texttitlr">党员信息详情</text>
				</view>
				<view class="doubletext">
					<text class="titleler">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</text><text class="contenttite" >{{datalisttwo.xm}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler">籍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贯：</text><text class="contenttite" >{{datalisttwo.jg==null?'未录入':datalisttwo.jg}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler">名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;族：</text><text class="contenttite" >{{datalisttwo.mz==null?'未录入':datalisttwo.mz}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</text><text class="contenttite" >{{datalisttwo.xb==null?'未录入':datalisttwo.xb}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler">出生日期：</text><text  class="contenttite">{{datalisttwo.csrq==null?'未录入':datalisttwo.csrq}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler">党员编号：</text><text  class="contenttite">{{datalisttwo.dybh==null?'未录入':datalisttwo.dybh}}</text>
				</view>
				
<!-- 				<view class="doubletext">
					<text class="titleler">身份证号：</text><text  class="contenttite">{{datalisttwo.sfzh}}</text>
				</view> -->
<!-- 				<view class="doubletext">
					<text class="titleler">党 证 号：</text><text  class="contenttite">{{datalisttwo.dzh}}</text>
				</view> -->
				<view class="doubletext">
					<text class="titleler">入党单位：</text><text  class="contenttite">{{datalisttwo.rddw==null?'未录入':datalisttwo.rddw}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler">入党时间：</text><text  class="contenttite">{{datalisttwo.rdsj==null?'未录入':datalisttwo.rdsj}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler">转正时间：</text><text  class="contenttite">{{datalisttwo.zzsj==null?'未录入':datalisttwo.zzsj}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler">文化程度：</text><text  class="contenttite">{{datalisttwo.whcd==null?'未录入':datalisttwo.whcd}}</text>
				</view>
				<view class="doubletext">
					<text class="titleler">联系电话：</text><text  class="contenttite">{{datalisttwo.lxdh==null?'未录入':datalisttwo.lxdh}}</text>
				</view>
			
				<view class="doubletext">
					<text class="titleler textfont">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：</text><text class="contenttite">{{datalisttwo.dz==null?'未录入':datalisttwo.dz}}</text>
				</view>
				<view class="" style="		margin: 20px 0;">
					<text style="" class="texttitlr">信息变动记录</text>
				</view>
				<view class="">
					<view class="kapian" v-for="(item,index) in datalists" :key="index"  >
						<view class="">变动日期：{{item.bdrq==null?'未录入':item.bdrq}}</view> 
						<view class="">变动类型：{{item.bdlx==null?'未录入':item.bdlx}}</view>  
						<view class="">变动说明：{{item.qtdbsm==null?'未录入':item.qtdbsm}}</view> 
					</view>
					<view class="kapian" v-if="num==0">
						<view class="" style="color: #BEBEBE;text-align: center;line-height: 60px;">暂无变更记录</view> 
						
					</view>
				</view>
				
			</view>
	 </view>
</template>
<script>
	export default{
		data(){
			return{
				datalist:[{}],
				showBoole:Boolean,
				datalisttwo:[],
				datalists:[],
				num:0
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
					this.$nextTick(()=>{
						this.datalist=res.data.data
					})
				})
			},
			getdatas(index){
				console.log(typeof index)
				let url =this.$api.select +  "/zhdj/select/srvzhsq_dyxx_bdjl_select"
				let req = {};
				req.serviceName = 'srvzhsq_dyxx_bdjl_select';
				req.colNames =  ['*'];
				req.condition =   [{colName: "dybh", ruleType: "eq", value: index}]
				req.order = [];
			
				this.$http.post(url, req).then(res => {
					console.error(res)
					this.datalists=res.data.data
					this.num = (this.datalists.length)
				})
			},
		},
		onLoad(id){
			
			if(id.id){
				this.showBoole=true
				uni.setNavigationBarTitle({
				  title: "党组织机构详情"
				});
			}else{
				uni.setNavigationBarTitle({
				  title: "党员信息"
				});
				this.datalisttwo =(JSON.parse(decodeURIComponent(id.query)))
				
				this.getdatas(this.datalisttwo.dybh)
				console.log(this.datalisttwo)
				this.showBoole=false
				
			}
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
	.kapian{
		box-shadow: 0 0 26px 0 rgba(0,0,0,0.12);
		margin: 8px 0;
		padding: 8px;
	}
	.texttitlr{
		border-left: 2px solid red;
		padding-left:8px;
		font-size: 16px;
		font-weight: 600;
	}
</style>
