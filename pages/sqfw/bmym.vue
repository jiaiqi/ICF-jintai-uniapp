<template>
	<view class="content">
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">用户编号：</text>
			</view>
			<input type="text" :value="valueadmin" disabled="disabled" style="background: #E2E4EA;" />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts letter">姓名：</text>
			</view>
			<input type="text" v-model="baominvalue"/>
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">手机号码：</text>
			</view>
			<input type="text" v-model="phone"/>
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">选择时间：</text>
			</view>
			<view class="input" >
				<QSPickerDate  name="formName" variableName="date" title="" v-model="dateValue"  @change="changePickers(dateValue)"   placherhold="请选择" />
			</view>
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">选择活动：</text>
			</view>
			<view class="input">
				<QSPickerCustom  ref="nationPickerZ"  name="formName" variableName="custom" title=""  v-model="pinck" @change="changePicker(pinck)"  />
			</view>
		</view>
		<view class="btn" @click="addvalue()">
			提交申请
		</view>
	</view>
</template>

<script>
	import QSPickerCustom from '@/components/QS-inputs-split/elements/QS-picker-custom/index.vue';
	import QSPickerDate from '@/components/QS-inputs-split/elements/QS-picker-date/index.vue';
	import QSApp from '@/components/QS-inputs-split/js/app.js';
	export default{
		data(){
			return{
				dateValue:"2019-11-30", //日期
				datatwolist:[],
				valueadmin:'admin', //用户编号
				baominvalue:"", //用户报名
				pinck:''  ,//活动编号,
				phone:'',//手机号,
				active_no:''
			}
		},
		components:{
			QSPickerCustom,
			QSPickerDate
		},
		methods:{
			getdata(){
				
				let url =this.$api.select + "/sqfw/select/srvzhsq_activity_arrange_select"
				let req = {};
				req.serviceName ="srvzhsq_activity_arrange_select";
				req.colNames = ['*'];
				req.condition = [];
				req.queryMethod= "select"
				req.distinct= false
				
				this.$http.post(url, req).then(res => {
			
					let list = (res.data.data)
					let datast=[]
					for(let i in list){
						datast.push(list[i].activity_title+"/"+list[i].activity_no)
					}
					let a = '['+ JSON.stringify(datast) +']'
					let b = JSON.parse(a)
					this.setPickerDataFc('nationPickerZ',b );
				})
			},
			setPickerDataFc(name, data) {
				this.$refs[name].setData(data);
			},
			addvalue(){
				if(this.dateValue==''||this.valueadmin==''||this.baominvalue==''||this.pinck==''||this.phone==''){
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
					let url =this.$api.select + "/sqfw/apply/srvzhsq_activity_registe_add?srvzhsq_activity_registe_add"
					let req = [{"serviceName":"srvzhsq_activity_registe_add",
					"data":[{"activity_no": this.active_no,
					"user_no": this.valueadmin,
					"registe":this.baominvalue,
					"phone":this.phone,
					"registe_date":"2019-12-02 15:12:34", //ateValue
					"child_data_list":[]
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
								
				}
			},
			changePickers(val){
				console.log(val.data)
			},
			changePicker(val){
				console.log(val)
				this.active_no= (val.data[0].slice(val.data[0].indexOf('/'),val.data[0].length))
			}
		},
		onLoad(){
			this.getdata()
			let that =this
			uni.getStorage({
				key:"userInfo",
				success(e){
					that.valueadmin=(e.data.user_no)
				}
			})
		}
	}
</script>

<style>
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
		overflow: hidden;
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
	.padding_5rpx_7_5rpx {
		padding: 0 !important;
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
	.letter{
		display: inline-block;
		text-align: right;
	}
	.serse{
		width: 60%;
		/* padding: 0 !important; */
		/* padding-right: 12px; */
		border: 1px solid #c5464a;
	}
	.btn{
		margin: 40upx 20upx;
		height:70upx;
		background: red;
		font-size: 17px;
		color: #FFFFFF;
		font-weight: 600;
		text-align: center;
		line-height: 70upx;
		border-radius: 20upx;
	}
</style>
