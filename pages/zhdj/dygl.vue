<template>
	<view class="content">
		<view class="" v-if="datalist.length>0">
			<view class="flexbox" v-if="!list">
				<view class="conten-box" v-for="(item,index) in datalist" :key="index">
					<image class="photo" @click="allitem(item)" :src="item.zp" mode=""></image>
					<view class="sueecss" style="">{{item.xm}}</view>
				</view>
			</view>
			<view class="flexbox" v-if="list">
				<view class="conten-box" v-for="(item,index) in datalistteo" :key="index">
					<image class="photo" @click="allitem(item)" :src="item.zp" mode=""></image>
					<view class="sueecss" style="">{{item.xm}}</view>
				</view>
			</view>
			<view class="titlesucces"  v-if="people">
				暂时没有该党员信息~
			</view>
		</view>
		
		<view class="kapian" v-else>
			<view class="" style="color: #BEBEBE;text-align: center;">
				<image style="height: 25px;width: 25px;" src="../../static/img/loading.gif" mode=""></image>
				<view class="">	数据加载中</view>
					
			</view> 
		</view>
	</view>
	
</template>

<script>
	export default {
	  
		 data(){
			 return{
				 datalist:[],
				 datalistteo:[],
				 list:false,
				 people:false,
			 }
		 },
		 methods:{
			 async getphoto(item){
			 	let path = this.$api.select + '/file/download?filePath=';
			 	let listr= []
			 	for(let i in  item){
			 		listr.push(item[i].zp)
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
			 		      this.$set(item[i], 'zp', path + resppo.data.data[0].fileurl);
			 			
			 		  }
			 	}
			 	return item
			 },
			 getdata(index){
			 	let url = this.$api.select+'/zhdj/select/srvzhsq_dyxx_select'
			 	let req = {};
			 	req.serviceName = 'srvzhsq_dyxx_select';
			 	req.colNames = ['*'];
			 	req.condition = [];
			 	req.order = [];
			 	req['page'] =  {pageNo: 1, rownumber: 10};
			 	this.$http.post(url, req).then(res => {
					this.getphoto(res.data.data).then(photo=>{
						this.datalist=photo
					})
			 	})
			 },
			 allitem(item){
				 uni.navigateTo({
				 	url:'./ggcontent?query='+encodeURIComponent(JSON.stringify(item).replace(/%/g, '%25'))
				 })
			 },
			 onNavigationBarSearchInputChanged (val) {
			     console.error(val)
				 if(val.text.length>0){
					  this.datalistteo=[]
					 this.list=true
					 for(let i in this.datalist){
						 if(this.datalist[i].xm.indexOf(val.text)!==-1 ) {
							  this.people=false
							  console.log(this.people)
							 this.datalistteo.push(this.datalist[i])
						 }
						 if(this.datalistteo.length>0){
							 this.people=false
						 }else{
							 this.people=true
						 }
					 }
					 
				 }else if (val.text==""||val.text==''){
					  this.list=false
					  this.people=false
				 }
				
			 } 
		 },
		 onLoad(){
			 this.getdata()
		 }
	}
</script>

<style>
	.content{
		width: 100%;
		background: #FFFFFF;
		padding: 10px;
	}
	.photo{
		display: block;
		height: 220upx;
		width: 170upx;
		margin: 0 auto;
		padding: 20upx 0;
	}
	.conten-box{
		box-sizing: border-box;
		/* padding: 6px 4px 6px 8px; */
		box-shadow: 0 0 26px 0 rgba(0,0,0,0.13);
		width: 30%;
		margin: 1.5%;
		
	}
	.kapian{
		box-shadow: 0 0 26px 0 rgba(0,0,0,0.12);
		margin: 8px 0;
		padding: 8px;
	}
	.sueecss{
		font-weight: 600;
		text-align: center;
		/* width:170upx ; */
	}
	.flexbox{
		display: flex;
		flex-wrap: wrap;
	}
	.titlesucces{
		text-align: center;
		font-size: 17px;
		color: #BEBEBE;
		line-height:100px;
	}
</style>
