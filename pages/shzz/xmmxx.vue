<template>
	<view class="content">
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">项目名称</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.xmxx_name?datalist.xmxx_name:'暂无'"  />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">项目类型</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.type?datalist.type:'暂无'"  />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">年度</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.sxmxx_year?datalist.sxmxx_year:'暂无'"  />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">所属行业</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.sxmxx_industry?datalist.sxmxx_industry:'暂无'"  />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">项目级别</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.sxmxx_grade?datalist.sxmxx_grade:'暂无'"  />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">总投资</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.sxmxx_total?datalist.sxmxx_total:'暂无'"  />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">项目领域</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.sxmxx_field?datalist.sxmxx_field:'暂无'"  />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">项目概况</text>
			</view>
			<!-- <input type="text"  :disabled="disabled" :value="datalist.title||datalist.pxbt"  /> -->
		</view>
		<view class="withhtml">
			<textarea  v-html="datalist.sxmxx_js?datalist.sxmxx_js:'暂无'" class="serse" placeholder="" />
		</view>
		
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">项目地点</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.sxmxx_place?datalist.sxmxx_place:'暂无'"  />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">项目创造性</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.sxmxx_creativity?datalist.sxmxx_creativity:'暂无'"  />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">项目负责人</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.sxmxx_person?datalist.sxmxx_person:'暂无'"  />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">负责人电话</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.sxmxx_phone?datalist.sxmxx_phone:'暂无'"  />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">计划开工时间</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.plan_starttime?datalist.plan_starttime:'暂无'"  />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">计划竣工时间</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.plan_endtime?datalist.plan_endtime:'暂无'"  />
		</view>
	 </view>
</template>

<script>
	// import bxEditor from '@/components/ueditor/ueditor.vue'
	export default{
		components:{
			// bxEditor
		},
		data(){
			return{
				datalist:{},
				disabled:true,
				xmmxxdata:false
			}
		},
		onLoad(options) {
			let dataitem= JSON.parse(decodeURIComponent(options.item))
			console.log(	dataitem )
			this.datalist=(	dataitem )
			uni.setNavigationBarTitle({
				title:'项目详情'
			})
		},
		methods:{
			// editorValueChange(name,e){
			//   this.fieldData.value = e.value
			//   e.column = e.info.name
			//   console.log(e)
			//   this.$emit('on-value-change', e);
			// },
			// async getphoto(item) {
			// 	let path = this.$api.select + '/file/download?filePath=';
			//     let url = this.$api.select + '/file/select/srvfile_attachment_select';
			//     let req = {
			//       colNames: ['*'],
			//       condition: [
			//         {
			//           colName: 'file_no',
			//           ruleType: 'eq',
			//           value: item // 图编号
			//         }
			//       ],
			//       order: null,
			//       page: null,
			//       serviceName: 'srvfile_attachment_select'
			//     };
			
			//     let resppo = await this.$http.post(url, req);
			// 	this.contentImg = (path+resppo.data.data[0].fileurl) 
			// },
			
			
		}
	}
</script>

<style>
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
		margin-top: calc(50upx - 15px);
	}
	.lineh{
		line-height: 120upx;
	}
	.content-box{
		display: flex;
		background: #FFFFFF;
		padding: 0 35upx;
		height: 100upx;
		margin: 0  20upx;
		margin-top: 30upx;
	}
	.texts{
		line-height: 100upx;
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
	.cail{
		height: 200upx;
	}
	.serse{
		display: inline-block;
		height: auto !important;
		padding: 0 35upx;
		background: #fff !important;
		width: 100%;
	}
	.withhtml{
		margin: 0 20upx; 
	}
	.serses{
		text-align: center;
	}
</style>
