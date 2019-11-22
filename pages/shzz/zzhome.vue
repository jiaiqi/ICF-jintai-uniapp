<template>
	<view class="content">
<!-- 		<view class="topbar">
			<text class="fontstext">志愿者与社会组织</text>
			<button type="default" size="mini" class="btn">新增</button>
		</view> -->
		<view class="">
			<image src="../../static/img/sszz.png" class="banner" mode=""></image>
		</view>

		<view class="conent-gray">
			<view class="gray-tab">
				<view class="textbar">
					<text class="leftborder">志愿者组织</text>
					<text class="btnmenu" @tap="join(selectList[0])" >申请加入</text>
				</view>
			</view>
			<view class="" v-if="shows">
				<view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view>
				<view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view><view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view>
			</view>
			
			<view v-else class="contentla" v-for="(item,index) in listhome" :key="index">
				<view class="yangPeople"  @click="detail(item.proc_status,item.zuzhi_name,item.zuzhi_address,item.zuzhi_jj)">
					<text>{{item.zuzhi_name}}</text>
					<text :class="item.proc_status=='完成'?'colortext': 'colortext-red' ">{{item.proc_status=='完成'?'已审批':'未审批'}}</text>
				</view>
				<!-- 名称  地址  简介-->
			</view>
			<view class="more" @click="more(bordermore)">
				<text>{{bordermore?'更多>>':'收起<<'}}</text>
			</view>
		</view>
		<view class="conent-gray">
			<view class="gray-tab">
				<view class="textbar">
					<text class="leftborder">社会组织</text>
					<text class="btnmenu" @tap="join(selectList[1])" >申请加入</text>
					
				</view>
			</view>
			<view class="" v-if="shows">
				<view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view>
				<view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view><view class="" style="margin: 20px 15px;">
					<view class="loadAnimItem yangPeople"><view class="loadAnimContent"></view></view>
				</view>
			</view>
			<view v-else class="contentla" v-for="(item,index) in listhomeall" :key="index">
				<view class="yangPeople"  @click="detail(item.proc_status,item.organize_name,item.address,item.remark)">
					<text>{{item.organize_name}}</text>
					<text :class="item.proc_status=='完成'?'colortext': 'colortext-red' ">{{item.proc_status=='完成'?'已审批':'未审批'}}</text>
				</view> 
				<!-- 名称  地址  简介-->
			</view>
			<view class="more" @click="mores(bordermores)">
				<text>{{bordermores?'更多>>':'收起<<'}}</text>
			</view>
		</view>
	<!-- 	<view class="conent-gray">
			<view class="gray-tab">
				<view class="textbar">
					<text>志愿者组织</text>
					<text style="color: red;text-decoration: underline;"  @tap="join(selectList[1])" >申请加入</text>
				</view>
			</view>
			<view class="yangPeople">
				<text>金台青年志愿者组织</text>
				<text @click="detail">已审批</text>
			</view>
			<view class="groups">
				<text>关爱行动志愿者小组</text>
				<text>待审批</text>
			</view>
			
			<view class="more" @click="more">
				<text>{{bordermore?'更多>>':'收起<<'}}</text>
			</view>
		</view> -->
		<button class="btnBottm" type="primary"  @tap="join(selectList[2])"  size="default">新增</button>
	</view>
	
	
</template>

<script>
export default {
	data(){
		return{
			bordermore:true,
			shows:true,
			bordermores:true,
			numberlist:3,
			selectList: [
				{
					serviceName: 'srvzhsq_zyz_member_select', //志愿者
					title: '',
					appType: 'sqfw',
					pageType: 'add',
					resDatas: []
				},
				{
					serviceName: 'srvzhsq_organizie_member_select', //社会
					title: '',
					appType: 'sqfw',
					pageType: 'add',
					resDatas: []
				},
				{
					serviceName: 'srvzhsq_zyz_member_select', //志愿者
					title: '',
					appType: 'sqfw',
					pageType: 'add',
					resDatas: []
				},
				
			],
			listhome:[],
			listhomeall:[],
			arr:{
				zhi:[
					{"se":"嘀咕嘀咕郭德纲","s2":"未审批"},
					{"se":"嘀咕嘀咕郭德纲","s2":"已审批"},
					{"se":"嘀咕嘀咕郭德纲","s2":"未审批"},
					{"se":"嘀咕嘀咕郭德纲","s2":"已审批"},
				],
				she:[
					{"1":"嘀咕嘀咕郭德纲","2":"未审批"},
					{"1":"嘀咕嘀咕郭德纲","2":"已审批"},
					{"1":"嘀咕嘀咕郭德纲","2":"未审批"},
					{"1":"嘀咕嘀咕郭德纲","2":"已审批"},
				]
			}
		}
	},
	methods:{
		more(opention){
			this.bordermore=!this.bordermore
			if(opention){
				this.numberlist=this.numberlist+100000
				this.getdata()
			}else{
				this.numberlist=3
				this.getdata()
			}
			
		},
		mores(e){
			this.bordermores=!this.bordermores
			if(e){
				this.numberlist=this.numberlist+100000
				this.getdataall()
			}else{
				this.numberlist=3
				this.getdataall()
			}
			
		},
		join(e){
			uni.navigateTo({
				url: '../normal/add/add?query=' + encodeURIComponent(JSON.stringify(e))
			});
	},
	detail(statenum,names,dress,session){
		uni.setStorage({
			key:'zuzhi',
		   data:{
			   'names':names,
			   'dress':dress,
			   'session':session
		   },
		    success: function () {
		        console.log('success');
		    }
		});
		// <!-- 名称  地址  简介-->
		if(statenum!=="完成"){
			statenum=1
		}else{
			statenum=0
			}
		uni.navigateTo({
			url: './fromtext?state='+statenum
		});
	},
	getdata(){
		let url = "http://39.98.203.134:8081/sqfw/select/srvzhsq_zyz_zuzhi_select?srvzhsq_zyz_zuzhi_select"
		let req = {};
		req.serviceName = 'srvzhsq_zyz_zuzhi_select';
		req.colNames = ['*'];
		req.condition = [];
		req.order = [];
		req['page'] = {
			pageNo: 1,
			
			rownumber: this.numberlist
		};
		this.$http.post(url, req).then(res => {
			this.listhome =res.data.data
			this.shows=false
		})
	},
	getdataall(){
		let url = "http://39.98.203.134:8081/sqfw/select/srvzhsq_social_organizie_select?srvzhsq_social_organizie_select"
		let req = {};
		req.serviceName = 'srvzhsq_social_organizie_select';
		req.colNames = ['*'];
		req.condition = [];
		req.order = [];
		req['page'] = {
			pageNo: 1,
			rownumber: this.numberlist
		};
		
		this.$http.post(url, req).then(res => {
			console.log(	res)
			this.listhomeall =res.data.data
		})
	},
},
mounted(){
	this.getdata()
	this.getdataall()
}
}

</script>

<style>
	.content{
		width: 100%;
		background: #FFFFFF !important;
	}
	.topbar{
		height:75upx ;
		width: 100%;
		padding:8px 3px ;
		background: pink;
		position: relative;
	}
	.fontstext{
		display: block;
		font-size: 15px;
		line-height: 75upx;
		text-align: center;
		color: #FFFFFF;
	}
	.btn{
		width: 50px;
		height: 20px;
		font-size: 13rpx;
		position: absolute;
		top: 30upx;
		right: 55upx;
	}
	.banner{
		display: block;
		height:400upx;
		width: 100%;
		background: #000000;;
	}
	.conent-gray{
		/* height: 380upx; */
		margin-bottom: 20upx;
		padding-bottom: 35upx;
		font-size: 16px;
	}
	.gray-tab{
	
	}
	.textbar{
	display: flex;
	justify-content: space-between;
	padding: 25upx 60upx 15upx 35upx;
	}
	.yangPeople,.groups{
		display: flex;
		justify-content: space-between;
		padding: 15upx 60upx 15upx 35upx;
	}
	.more {
		padding-right:60upx;
	}
	.more text{
		float: right;
		font-size: 15px;
		margin-top: 20upx;
	}
	.btnBottm{
		width: 92% ;
		background:#E51C23 ;
		margin: 20upx auto;
	}
	.colortext{
		color: green;
	}
	.colortext-red{
		color: red;
	}
	.leftborder{
		border-left: 2px solid red;
		padding-left: 10upx;
		font-weight: 600;
		font-size: 16px
	}
	.contentla{
		font-size: 15px;
		margin-top: 15upx;
		border-bottom: 0.5px solid #EEEEEE;
		padding-bottom: 10upx;
	}
	.btnmenu{
		width: 80uxp;
		background: #E51C23;
		color: #FFFFFF;
		/* font-weight: 600; */
		font-size: 15px;
		letter-spacing: 2upx;
		padding: 3px;
		border-radius: 10upx;
	}
	.loadAnimItem {
	  box-sizing: border-box;
	  margin: 10upx 0;
	  width: 100%;
	  height: 40upx;
	  background-color: rgba(150, 150, 150, 0.1);
	  height: 40upx;
	  animation: loading 4s linear 0s infinite;
	}
/* 	@keyframes loading {
	  0% {
	    width: 0%;
	  }
	  50% {
	    width: 100%;
	  }
	  100% {
	    width: 0%;
	  }
	} */
</style>
