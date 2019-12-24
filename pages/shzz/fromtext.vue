<template>
	<view class="content">
		<view class="tiemname">
			<text>组织名称：</text> <text  class="searchs">{{titlename}}</text>
		</view>
		<view class="tiemname">
			<text>组织状态：</text> <text :class="states.state=='1'?'colortext-red': 'colortext' ">{{states.state==1?'未审批':'已审批'}}</text>
		</view>
		<view class="tiemname">
			<text>组织简介：</text> <view class="searchs" v-html="session"></view>
		</view>
		<!-- <view class="tiemname">
			<text>组织成员：</text> <text  class="searchs"></text>
		</view>
		<view class="tiemname">
			<text>主要职责：</text> <text class="searchs"></text>
		</view> -->
		<view class="tiemname">
			<text>服务地点：</text> <text  class="searchs">{{dress}}</text>
		</view>
		<!-- <button v-if="states.state==1?false:true" class="btnBottm" type="primary"  size="default"  @tap="join(selectList[0])">我要加入</button> -->
	</view>
</template>
                                  
<script>
	export default {
		data(){
			return{
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
					
				],
				states:'',
				titlename:"",
				dress:'',
				session:''
			}
		},
		methods:{
			join(e){
				uni.navigateTo({
					url: '../normal/add/add?query=' + encodeURIComponent(JSON.stringify(e))
				});
			},
		},
		onLoad(options) {
			this.states=options
			let that =this
			uni.getStorage({
			    key: 'zuzhi',
			    success: function (res) {
					
					that.titlename=(res.data.names)
					if(res.data.dress==undefined || res.data.dress==null){
						that.dress="未录入"
					}else{
						that.dress=(res.data.dress)
					}
					if(res.data.session==undefined || res.data.session==null){
						that.session="未录入"
					}else{
						that.session= res.data.session
					}
			    }
			});
		}
	}
	
</script>

<style>
	.content{
		width: 100%;
		padding: 40upx;
		font-size: 16px;
		background: #FFFFFF;
	}
	.tiemname{
		display: flex;
		padding: 20upx 0;
		border-bottom: 0.5px solid #EEEEEE;
	}
	.searchs{
		width: 75%;
	}
	.btnBottm{
		width: 100% ;
		background:#E51C23 ;
		margin: 40upx auto;
	}
	.colortext{
		color: green;
	}
	.colortext-red{
		color: red;
	}
</style>
