<template>
	<view class="content">
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">公租房</text>
			</view>
			<text class="lineh" style="">{{titlename}}</text>
		</view>
		
		<view class="content-box"> 
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">申请人</text>
			</view>
			<input type="text" v-model="people" value="" placeholder="请输入内容" />
		</view>
		
		<view class="content-box" v-if="false">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">用户编号</text>
			</view>
			<input type="text" v-model="peadmin" disabled="disabled" style="background: #EEEEEE;"/>
		</view>
		
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">性别</text>
			</view>
			   <radio-group @change="change">
					<label class="uni-list-cell uni-list-cell-pd" style="margin-top: 6px;" >
						<view>
							<radio style="transform:scale(0.7);"  value="男"  /><text style="margin-right: 40px;">男</text>
							<radio style="transform:scale(0.7)" value="女"  /><text >女</text>
						</view>
						<!-- <view>{{item.name}}</view> -->
					</label>
				</radio-group>
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">籍贯</text>
			</view>
			<input type="text" v-model="place" value="" placeholder="请输入内容" />
		</view>
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">身份证号</text>
			</view>
			<input type="text" v-model="idcart" value="" placeholder="请输入内容" />
		</view>
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">联系电话</text>
			</view>
			<input type="text" v-model="phone" value="" placeholder="请输入内容" />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">现居地</text>
			</view>
			<input type="text" v-model="dresss" value="" placeholder="请输入内容" />
		</view>
		
		
		<!-- <view class="content-box">
			<view class="content-width">
				<text class="texts" style="opacity: 0;">*</text><text class="texts">材料清单</text>
			</view>
			<textarea value="" class="serse" placeholder="材料清单" />
		</view>
	
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">图片：</text>
			</view>
			<QSPick name='pics'>55</QSPick>
		</view> -->
		<view class="btn" @click="toadd">
			提交申请
		</view>
	</view>
</template>
<script>
	import QSPick from '@/components/QS-inputs-split/elements/QS-pics/index.vue';
	import QSPickerCustom from '@/components/QS-inputs-split/elements/QS-picker-custom/index.vue';
	import QSApp from '@/components/QS-inputs-split/js/app.js';
	export default{
		data(){
			return{
				 Fileddatas: {},
				 titlename:'' ,//房屋名称
				 pinck:'',
				 people:'' ,//申请人信息
				 peadmin:'admin', //用户编号,
				 place:"",//籍贯
				 idcart:'',//身份证号码
				 phone:'',//电话号码
				 dresss:'',//现居地
				 sex:"" ,//性别
				 homeServe:''  , //服务
			}
		},
		components: {
		  QSPickerCustom,
		  QSPick
		},
		methods:{
			changePicker(val) {
			  console.log(val)
			},
			change(e){
				this.sex=e.target.value
			},
			toadd(){
				if(this.people==''||this.place==''||this.idcart==''||this.phone==''||this.dresss==''){
					uni.showToast({
					    title: '请填写完整再提交',
					    duration: 2000,
						icon:"none"
					});
				}else if(!(/^1[3456789]\d{9}$/.test(this.phone))){
					  uni.showToast({
					      title: '手机号码填写有误',
					      duration: 2000,
						icon:"none"
					  }); 
				}else{
					
				
				uni.showLoading({
					title:"提交中..." ,
					icon:"loading"
				});
			// srvzhsq_tenement_gzfsq_add
					let url =this.$api.select + "/sqfw/apply/"+this.homeServe
					let req =[
						{"serviceName":this.homeServe,
						"data":[{
							"sq_name":this.people,  //申请人
							"user_no":this.peadmin, //用户
							"garden":this.sex,
							"nation":"汉族",
							"native":this.place, //籍贯
							"card_id":this.idcart,
							"phone":this.phone,
							"address":this.dresss,
							"title":this.titlename,
							"child_data_list":[],
							}]}]
				
					
					this.$http.post(url, req).then(res => {
						console.log(res)
						if(res.status==200){
							uni.hideLoading();
							if(res.data.resultCode!=="SUCCESS"){
								uni.showToast({
								    title:res.data.resultMessage ,
								    duration: 2000,
									icon:"none"
								});
							}else{
								uni.showLoading({
								    title:"提交成功,跳转中...",
								    duration: 2000,
									icon:"success"
								});
								setTimeout(() => {
									uni.hideLoading()
								  uni.navigateBack({
								    delta: 2
								  });
								}, 4000);
							}
						}
					})
								
				}
				
				
				
				
			}
		},
		onLoad(option){
			this.titlename=(JSON.parse(decodeURIComponent(option.query)))
			
			
			let that =this
			uni.getStorage({
				key:"homeMessage",
				success(e){
					
					if(e.data.homename.indexOf("公租房")!==-1){
						that.homeServe="srvzhsq_tenement_gzfsq_add"
					}else{
						that.homeServe="srvzhsq_tenement_lzfsq_add"
					}
				}
			})
			uni.getStorage({
				key:"userInfo",
				success(e){
					that.peadmin=(e.data.user_no)
				}
			})
		}
		
	}
</script>

<style scoped>
	.content{
		width: 100%;
		background: #F1F1F1;
		color: #333;
	}
	input,.input{
		/* border: 1px solid #c5464a; */
		/* border-radius: 5px 5px 5px 5px; */
		height: 30px;
		width: 60% !important;
		font-size: 15px;
		padding: 2px 5px;
		margin-top: calc(60upx - 15px);
	}
	.lineh{
		line-height: 120upx;
	}
	.content-box{
		display: flex;
		background: #FFFFFF;
		padding: 0 35upx;
		height: 120upx;
		margin-top: 30upx;
	}
	.texts{
		line-height: 120upx;
			font-size: 15px;
	}
	.content-width{
		width: 28%;
	}
	.uni-list-cell::after{
		background-color:#FFFFFF !important;
		}
	.mpvue-picer{
		margin-top: 12upx;
		/* border: 1px solid #c5464a; */
		padding: 0 !important;
	/* 	height: 28px;
		border-radius: 5px 5px 5px 5px;
		width: 63% !important; */
		
	}
	.serse{
		width: 60%;
		/* padding: 0 !important; */
		/* padding-right: 12px; */
		border: 1px solid #c5464a;
	}
	.btn{
		margin: 40upx 20upx;
		height:80upx;
		background: red;
		font-size: 18px;
		color: #FFFFFF;
		font-weight: 600;
		text-align: center;
		line-height: 80upx;
		border-radius: 20upx;
	}
</style>
