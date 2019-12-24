<template>
	<view class="Choicecontent">
		
		<view class="uniconicons" v-show="contnet">
			<view :class="!showone?'onelistsexlat':'onelistsexslat' "  v-for="(item,index) in datalisttwo" :key='index'   >
				<image class="photo-zuhi" :src="item.tp" mode=""></image> 
				<view class="contentdzzs">
					<view class="dabletext">
						<text class="title"  @click="morrebar(10000)">{{item.zjmc}}</text><text class="twoorder" @click="topcikck(item.id)" >组织详情</text>
					</view>
					<view class="listcss"  @click="morrebar(10000)">
						<view class="dressin" >地址：{{item.zjdz}}</view>
						<view class=""  >电话：{{item.zjdh}}</view>
					</view>
					
				</view>
			</view>
		</view>
		
		
		
		<view class="uniconicons" v-show="datashows">
			<view :class="!showone?'onelistsexlat':'onelistsexslat' "  v-for="(item,index) in datalist" :key='index'   >
				<image class="photo-zuhi" :src="item.tp" mode=""></image> 
				<view class="contentdzzs">
					<view class="dabletext">
						<text class="title"  @click="listda(item.no)">{{item.zjmc}}</text><text class="twoorder" @click="topcikck(item.id)" >组织详情</text>
					</view>
					<view class="listcss"  @click="listda(item.no)">
						<view class="dressin" >地址：{{item.zjdz}}</view>
						<view class=""  >电话：{{item.zjdh}}</view>
					</view>
					
				</view>
				
			</view>
			<view class="btn" @click="twoinorder">
				返回上一级
			</view>
		</view>
	
		<view class="dabletextstr" v-if="threes">
			<view class="onelistsexlat"  v-for="(item,index) in datalist" :key='index'  >
				<image class="photo-zuhi" :src="item.tp" mode=""></image> 
				<view class="contentdzzs">
					<view class="dabletext">
						<text class="title">{{item.zjmc}}</text> <text class="twoorder" @click="topcikck(item.id)" >组织详情</text>
					</view>
					<view class="listcss" >
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
				threes:false,
				datalisttwo:[],
				imageURL:'../../static/img/jtu.png'
			}
		},
		methods:{
			async getphoto(item){
				let path = this.$api.select + '/file/download?filePath=';
				let listr= []
				for(let i in  item){
					listr.push(item[i].tp)
					let url = this.$api.select + '/file/select/srvfile_attachment_select';
					let req = {
						colNames: ['*'],
						condition: [
							{
								colName: 'file_no',
								ruleType: 'eq',
								value: listr[i]// 图编号
							}
						],
						order: null,
						page: null,
						serviceName: 'srvfile_attachment_select'
					};
					let phoarr = []
					
					
				let resppo=	await this.$http.post(url, req)
				// console.log("EEEEEEEEEEEEEEEEEEEE",resppo)
					  if (resppo.data&&resppo.data.data&&resppo.data.data.length>0) {
						if (item[i].tp == null ) {
						  item[i].tp = this.imageURL;
						}else{
							this.$set(item[i], 'tp', path + resppo.data.data[0].fileurl);
						}
					  }
				}
				return item
			},
			getdata(index){
				let url = this.$api.select+'/zhdj/select/srvzhsq_dzzjg_select?srvzhsq_dzzjg_select'
				let req = {};
				req.serviceName = 'srvzhsq_dzzjg_select';
				req.colNames = ['*'];
				req.condition = [{colName: "parent_no", value: index, ruleType: "eq"}];
				req.order = [];
				// req['page'] = null;
				this.$http.post(url, req).then(res => {
						console.log(res)
					this.getphoto(res.data.data).then(phop=>{
						console.error(phop)
						this.datalist=phop
					})
					// console.log(res)
				})
			},
			getdatas(){
				let url = this.$api.select+'/zhdj/select/srvzhsq_dzzjg_select?srvzhsq_dzzjg_select'
				let req = {};
				req.serviceName = 'srvzhsq_dzzjg_select';
				req.colNames = ['*'];
				req.condition = [{colName: "parent_no", ruleType: "isnull"}];
				req.order = [];
				// req['page'] = {pageNo: 1, rownumber: 10};
				this.$http.post(url, req).then(res => {
					console.log(res)
					this.getphoto(res.data.data).then(phop=>{
						console.error(phop)
						this.datalisttwo=phop
					})
				})
			},
		
			morrebar(value){
				this.contnet=false
				this.getdata(value)
				this.datashows=true
			},
			listda(value){
				this.getdata(value)
				this.contnet=false
				this.datashows=false
				this.threes=true
			},
			inorder(){
				this.getdata(10000)
				this.contnet=false
				this.datashows=true
				this.threes=false
			},
			twoinorder(){
				this.datashows=false,
				this.showone=false,
				this.contnet=true,
				this.threes=false
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
	.kapian{
		box-shadow: 0 0 26px 0 rgba(0,0,0,0.12);
		margin: 8px 8px;
		padding: 8px;
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
		top:162upx;
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
		box-shadow:0px 0px 26px 0 rgba(0,0,0,.12);
		line-height: 50upx;
		   animation: rightEaseInAnimate 1s ease 1; 
		    animation-fill-mode: forwards;
			margin: 15px;
			border-radius: 10px;
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
		display: block;
		margin: 20upx 0;
		width:440upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: normal;
	}
</style>
