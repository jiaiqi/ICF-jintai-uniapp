<template>
	<view class="content">
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">申请人：</text>
			</view>
			<input type="text" value="" />
		</view>
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">用户编号：</text>
			</view>
			<input type="text" value="admin" disabled="disabled" style="background: #EEEEEE;"/>
		</view>
		
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">性别：</text>
			</view>
			   <radio-group @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" >
						<view>
							<radio style="transform:scale(0.7);" value="男" checked="true" /><text style="margin-right: 40px;">男</text>
							<radio style="transform:scale(0.7)" value="女" checked="" /><text >女</text>
						</view>
						<!-- <view>{{item.name}}</view> -->
					</label>
				</radio-group>
		</view>
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">民族：</text>
			</view>
			<view class="mpvue-picer">
			  <QSPickerCustom ref="nationPicker" name="formName" variableName="custom" title="" v-model="Fileddatas.column" @change="changePicker" />
			</view>
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
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">公租房名称：</text>
			</view>
			<view class="mpvue-picer">
			  <QSPickerCustom ref="nationPicker" name="formName" variableName="custom" title="" v-model="Fileddatas.column" @change="changePicker" />
			</view>
		</view>
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="opacity: 0;">*</text><text class="texts">材料清单：</text>
			</view>
			<textarea value="" class="serse" placeholder="材料清单" />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">附件：</text>
			</view>
			<input type="text" value="" />
		</view>
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;">*</text><text class="texts">图片：</text>
			</view>
			<input type="text" value="" />
		</view>
		<view class="btn">
			提交申请
		</view>
	</view>
</template>

<script>
	import QSPickerCustom from '@/components/QS-inputs-split/elements/QS-picker-custom/index.vue';
	export default{
		data(){
			return{
				 Fileddatas: {}
			}
		},
		components: {
		  QSPickerCustom,
		},
		methods:{
			changePicker() {
			  this.Fileddatas.column = this.Fileddatas.column.data[0];
			   this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);
			  console.log('选择了：', this.Fileddatas.column);
			}
		},
		
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
