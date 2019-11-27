<template>
	<view class="Choicecontent">
		<view class="uniconicons" v-show="contnet">
			<view class="onelistsex">
				<image class="photo-zuhi" src="../../static/img/jtu.png" mode=""></image> 
				<view class="contentdzzs">
					<view class="dabletext">
						<text class="title" v-if="datalisttwo[0]">{{datalisttwo[0].zjmc}}</text><text class="twoorder"  @click="showBoole()">下级党组织</text>
					</view>
					<view class="listcss" @click="topcikck(datalisttwo[0].id)"  v-if="datalisttwo[0]">
						<view class="dressin">地址：{{datalisttwo[0].zjdz}}</view>
						<view class="" >电话：{{datalisttwo[0].zjdh}}</view>
					</view>
				</view>
			</view>
			<view :class="datashows?'onelistsexlat':'onelistsexslat' "  v-for="(item,index) in datalist" :key='index'   >
				<image class="photo-zuhi" src="../../static/img/jtu.png" mode=""></image> 
				<view class="contentdzzs">
					<view class="dabletext">
						<text class="title">{{item.zjmc}}</text><text class="twoorder" @click="morrebar(item.no)">下级党组织</text>
					</view>
					<view class="listcss" @click="topcikck(item.id)">
						<view class="dressin" >地址：{{item.zjdz}}</view>
						<view class=""  >电话：{{item.zjdh}}</view>
					</view>
					
				</view>
			</view>
		</view>
		
		<view class="dabletextstr" v-show="!contnet">
			<view class="onelistsexlat"  v-for="(item,index) in datalist" :key='index'  >
				<image class="photo-zuhi" src="../../static/img/jtu.png" mode=""></image> 
				<view class="contentdzzs">
					<view class="dabletext">
						<text class="title">{{item.zjmc}}</text>
					</view>
					<view class="listcss" @click="topcikck(item.id)">
						<view class="dressin" >地址：{{item.zjdz}}</view>
						<view class=""  >电话：{{item.zjdh}}</view>
					</view>
				</view>
				
			</view>
			<view class="btn" @click="inorder">
				返回上一级
			</view>
		</view>
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				datalist:[],
				datashows:false,
				showone:false,
				contnet:true,
				datalisttwo:[]
			}
		},
		methods:{
			getdata(index){
				let url = this.$api.select+'/zhdj/select/srvzhsq_dzzjg_select?srvzhsq_dzzjg_select'
				let req = {};
				req.serviceName = 'srvzhsq_dzzjg_select';
				req.colNames = ['*'];
				req.condition = [{colName: "parent_no", value: index, ruleType: "eq"}];
				req.order = [];
				req['page'] = null;
				this.$http.post(url, req).then(res => {
					
					this.datalist=res.data.data
				})
			},
			getdatas(){
				let url = this.$api.select+'/zhdj/select/srvzhsq_dzzjg_select?srvzhsq_dzzjg_select'
				let req = {};
				req.serviceName = 'srvzhsq_dzzjg_select';
				req.colNames = ['*'];
				req.condition = [{colName: "parent_no", ruleType: "isnull"}];
				req.order = [];
				req['page'] = {pageNo: 1, rownumber: 10};
				this.$http.post(url, req).then(res => {
					
					this.datalisttwo=res.data.data
				})
			},
			showBoole(){
				this.datashows=!this.datashows
				console.log(this.datashows)
			},
			morrebar(value){
				this.contnet=false
				this.getdata(value)
			},
			inorder(){
				this.contnet=true
				this.getdata("10000")
			},
			topcikck(id){
				uni.navigateTo({
					url:"./ggcontent?id="+id
				})
			}
		},
		onLoad(){
			this.getdata("10000")
			this.getdatas()
		},
		mounted(){
			// let that = this
			// setTimeout(()=>{
			// 	that.showone = true
			// },0)
		}
	}
</script>

<style>
	.Choicecontent{
		width: 100%;
	}
	.photo-zuhi{
		display: block;
		height: 200upx !important ;
		width: 200upx !important;
		border-radius: 20upx;
		margin-right: 20upx;
	}
	.dabletext{
		display: flex;
		position: relative;
	}
	.onelistsex{
		display: flex;
		padding: 20upx;
		line-height: 50upx;
		   animation: rightEaseInAnimate 1s ease 1; 
		    animation-fill-mode: forwards;
	}
	.title{
		font-weight: 600;
		font-size: 18px;
	}
	.contentdzzs{
		width: 70%;
	}
	.twoorder{
		color: #007AFF;
		font-size: 15px;
		position: absolute;
		right: 20upx;
	}
	
	@keyframes rightEaseInAnimate{
	    0%{transform: translateY(500px);opacity: 0;}
	    100%{transform:translateY(0px);opacity: 1; }
	}
	@keyframes rightEaseInAnimates{
		 100%{transform: translateX(500px);opacity: 0;}
		 0%{transform:translateX(0px);opacity: 0; }
	}
.onelistsexlat{
		display: flex;
		padding: 20upx;
		margin: 0 20upx;
		box-shadow:0px 20px 20px #E5E5E5;
		line-height: 50upx;
		   animation: rightEaseInAnimate 1s ease 1; 
		    animation-fill-mode: forwards;
	}
	.onelistsexslat{
		display: flex;
		padding: 20upx;
		line-height: 50upx;
	    animation: rightEaseInAnimates 1s ease 1; 
		animation-fill-mode: forwards;
	}
	.uniconicons,.dabletextstr{
		animation: rightEaseInAnimate 1s ease 1; 
		 animation-fill-mode: forwards;
	}
	.btn{
		margin: 40upx 20upx;
		height:80upx;
		background: red;
		color: #FFFFFF;
		font-weight: 600;
		text-align: center;
		line-height: 80upx;
		border-radius: 20upx;
	}
	.listcss view{
		color: #666666;
		font-size: 16px;
	}
	.dressin{
		margin: 20upx 0;
	}
</style>
