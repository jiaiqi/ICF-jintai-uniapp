<template>
	<view class="content">
		<view class="allbox" >
			<text class="title">名称：</text><text v-if="datalist" style="font-weight: 600;font-size: 15px;">
			{{datalist.zuzhi_name||datalist.organize_name||datalist.activity_title||datalist.note_title||datalist.opinion_title}}</text>
		</view>
		<view class="allbox" >
			<text class="title">状态：</text><text v-if="datalist" style="font-weight: 600;font-size: 15px;">{{datalist.proc_status}}</text>
		</view>
		<view class="" style="display: flex;">
			<text class="title">意见：</text>
		<radio-group @change="change">
			<label class="allbox" >
				<view class="">
					<radio style="transform:scale(0.7)" value="pass" class="" /><text >通过</text>
					<text style="opacity: 0;">*****</text>
					<radio style="transform:scale(0.7)" value="return"  /><text >不通过</text>
				</view>
			</label>
		</radio-group>
		</view>
		<view class="allbox" >
			<text v-if="start" style="color: red;">*</text><text class="title">说明：</text><textarea value="" v-model="explain" class="select" placeholder="" />
		</view>
		<view class="btn" @click="submit(datalist.servename)" >
			提 交
		</view>
	</view>
</template>


<script>
	export default{
		data(){
			return{
				dataStatus:[],
				statusBtn:[],
				datalist:[],
				passadit:'' ,//意见
				explain:'',//说明
				start:false,
				tiBoolle:false,
				timer:null
			}
		},
		methods:{
			// getmenu(){
			// 	let url = 'http://39.98.203.134:8081/sqfw/select/srvprocess_basic_cfg_select';
			// 	let req = {};
			// 	req.serviceName = 'srvprocess_basic_cfg_select';
			// 	req.colNames = ['*'];
			// 	req.condition = [{"colName":"proc_instance_no","ruleType":"eq","value":"20191207104508096100"}];
				
			// 	this.$http.post(url, req).then(res => {
			// 		console.log(res)
			// 		// this.dataStatus=res.data
			// 		// this.statusBtn=res.data.proCharData[1].approval_options
			// 	})
			// },
			change(e){
				if(e.detail.value=="return"){
					this.start=true
				}else{
					this.start=false
				}
				this.passadit =(e.detail.value)
			},
			submit(val){
				let authority = ""
				let num = 0
				if(val=="srvzhsq_zyz_zuzhi_select"){  //志愿者
					authority="volunteer_org_ process_"
				}else if(val=="srvzhsq_social_organizie_select"){ //社会组hi
						authority="T_ORGANIZE_"
				}else if(val=="srvzhsq_activity_arrange_select"){ //活动安排
					authority="community_services0"
					num=1
				}else if(val=="srvzhsq_forum_note_list_num_select"){  //社区论坛
					authority="T_FORUM_NOTE_"
				}else if(val=="srvzhsq_djlt_ftxx_select"){  
					authority="zhsq_ltft_0"
					num=1
				}else if(val=="srvzhsq_forum_opinion_select"){  //社区献策
					authority="T_FORUM_OPINION_"
					num=1
				}
				let url = 'http://39.98.203.134:8081/sqfw/process/approval';
				let req = [
					{"proc_instance_no":this.datalist.proc_instance_no,
					"step_no":authority+(num+1),
					"data":[
							{"remark":this.explain,
							"proc_result":this.passadit,
							"key":this.passadit,
							"file_no":"",
							"child_data_list":[],
							step_no:authority+ num
							},
						  ],
					},
				 ]
				 console.log(req)
				 let that = this
				uni.showModal({
				    title: '提示',
				    content: '确定提交？',
				    success: function (res) {
				        if (res.confirm) {
							if(that.passadit==""){
									uni.showToast({
									    title: '请选择意见',
									    duration: 2000,
										icon:"none"
									});
							}else if(that.passadit=="return"&&that.explain==""){
								uni.showToast({
								    title: '请填写驳回原因',
								    duration: 2000,
									icon:"none"
								});
							}else{
								uni.showLoading({
								    title: '提交中'
								});
								let i =0
								that.timer = setInterval(() => {
								   i++
								  if(i==8){
									     clearInterval(that.timer);   
									if(that.tiBoolle==false){
										 uni.hideLoading();
										 uni.showToast({
											 title: "提交失败",
											 duration: 3000,
											image: '../../static/img/gantanhao.png'  
										 })
									}
								  }
								}, 1000)
								that.$http.post(url, req).then(res => {
									console.log("0000000",res)
									that.tiBoolle=true
									 uni.hideLoading();
									uni.showToast({
									    title: res.data.resultMessage,
									    duration: 2000,
										icon:"success"
									})
										if(res.data.resultMessage=="审批成功"){
											uni.showLoading({
											    title: '审批成功，正在回到审批列表，请稍等~'
											});
											setTimeout(()=>{
												 uni.hideLoading();
												uni.redirectTo({
												    url: './auditList?serve='+that.datalist.servename
												});
											},4000)
										}
								})
							}
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			
				
			}
		},
		onLoad(options){
			 this.datalist = JSON.parse(decodeURIComponent(options.query));
			 console.error( this.datalist)
			// this.submit()
		},
		onUnload(){
			  clearInterval(this.timer);        
			    this.timer = null;
		},
		 beforeDestroy() {
		      clearInterval(this.timer)
		  },
	}
</script>

<style>
	.content{
		width: 100%;
		background: #FFFFFF;
		padding: 40upx;
	}
	.btn{
		margin: 10upx 20upx;
		height:80upx;
		background: red;
		font-size: 18px;
		color: #FFFFFF;
		font-weight: 600;
		text-align: center;
		line-height: 80upx;
		border-radius: 20upx;
	}
	.title{
		display: block;
		width: 60px;
		text-align: left;
	}
	.select{
		border: 1upx solid #E0E0E0;
	}
	.allbox{
		display: flex;margin-bottom: 15px;
	}
	.menus{
		margin-right: 15px;
	}
</style>
