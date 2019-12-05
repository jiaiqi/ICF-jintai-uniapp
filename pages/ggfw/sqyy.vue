<template>
	<view class="content">
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">公租房名称：</text>
			</view>
			<text class="lineh" style="">{{titlename}}</text>
		</view>
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">申请人：</text>
			</view>
			<input type="text" v-model="people" value="" />
		</view>
		
		<view class="content-box" v-if="false">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">用户编号：</text>
			</view>
			<input type="text" v-model="peadmin" disabled="disabled" style="background: #EEEEEE;"/>
		</view>
		
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">性别：</text>
			</view>
			   <radio-group @change="change">
					<label class="uni-list-cell uni-list-cell-pd" >
						<view>
							<radio style="transform:scale(0.7);"  value="男" checked="" /><text style="margin-right: 40px;">男</text>
							<radio style="transform:scale(0.7)" value="女" checked="" /><text >女</text>
						</view>
						<!-- <view>{{item.name}}</view> -->
					</label>
				</radio-group>
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">籍贯：</text>
			</view>
			<input type="text" value="" />
		</view>
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">身份证号：</text>
			</view>
			<input type="text" value="" />
		</view>
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">联系电话：</text>
			</view>
			<input type="text" value="" />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">现居地：</text>
			</view>
			<input type="text" value="" />
		</view>
		
		
		<!-- <view class="content-box">
			<view class="content-width">
				<text class="texts" style="opacity: 0;">*</text><text class="texts">材料清单：</text>
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
				 peadmin:'admin', //用户编号
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
				console.log(e)
			},
			toadd(){
				// if(this.dateValue==''||this.valueadmin==''||this.baominvalue==''||this.pinck==''||this.phone==''){
				// 	uni.showToast({
				// 	    title: '请填写完整再提交',
				// 	    duration: 2000,
				// 		icon:"none"
				// 	});
				// }else if(!(/^1[3456789]\d{9}$/.test(this.phone))){
				// 	  uni.showToast({
				// 	      title: '手机号码填写有误',
				// 	      duration: 2000,
				// 		icon:"none"
				// 	  }); 
				// }else
				
				// if{
					let url =this.$api.select + "/sqfw/apply/srvzhsq_tenement_lzfsq_add?srvzhsq_tenement_lzfsq_add"
					let req =[
						{"serviceName":"srvzhsq_tenement_lzfsq_add",
						"data":[{
							"sq_name":"申请人",
							"user_no":"admin",
							"garden":"男",
							"nation":"汉族",
							"native":null,
							"card_id":"610326199610041632",
							"phone":"110",
							"address":"现居地",
							"title":"廉租房测试数据",
							"materials":"材料",
							"files":null,
							"pohoto":null,
							"child_data_list":[],
							}]}]
					uni.showToast({
						title:"提交中..." ,
						icon:"loading"
					});
					
					this.$http.post(url, req).then(res => {
						console.log(res)
						if(res.status==200){
							uni.hideToast();
							if(res.data.resultCode!=="SUCCESS"){
								uni.showToast({
								    title:res.data.resultMessage ,
								    duration: 2000,
									icon:"none"
								});
							}else{
								uni.showToast({
								    title:"提交成功",
								    duration: 2000,
									icon:"success"
								});
								
							}
						}
					})
								
				// }
				
				
				
				
			}
		},
		onLoad(option){
			this.titlename=(JSON.parse(decodeURIComponent(option.query)))
			this.change()
		}
		
	}
</script>

<style scoped>
	.content{
		width: 100%;
		background: #FFFFFF;
		padding: 35upx;
	}
	input,.input{
		border: 1px solid #c5464a;
		border-radius: 5px 5px 5px 5px;
		height: 22px;
		width: 60% !important;
		font-size: 14px;
		padding: 2px 5px;
		margin: 10px 0;
	}
	.lineh{
		line-height: 96upx;
	}
	.content-box{
		display: flex;
	}
	.texts{
		line-height: 48px;
		
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
