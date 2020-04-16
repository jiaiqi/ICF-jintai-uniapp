<template>
	<view class="content">
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">标题</text>
			</view>
			<input type="text"  :disabled="disabled" :value="datalist.title||datalist.pxbt" placeholder="请输入内容" />
		</view>
		<view class="content-box">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">类型</text>
			</view>
			<input type="text" :disabled="disabled"  :value="datalist.type||datalist.pxlx" placeholder="请输入内容" />
		</view>
		<view class="content-box" style="margin-bottom: 30upx;">
			<view class="content-width">
				<text class="texts" style="color: red;"></text><text class="texts">发布时间</text>
			</view>
			<input type="text" :disabled="disabled"  :value="datalist.modify_time" placeholder="请输入内容" />
		</view>
		<view class="" style="padding: 0 20upx;" v-if="disabled">
			<view class="serse">
				<view class="serses">
					<image v-if="contentImg"  :src="contentImg" mode="aspectFill"></image>
				</view>
				<textarea  v-html="datalist.content?datalist.content:'暂无'" class="serse" placeholder="" />
			</view>
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
				listdatas:{},
				contentImg:'',
				disabled:false,
				xmmxxdata:false
			}
		},
		onLoad(options) {
			let dataitem= JSON.parse(decodeURIComponent(options.item))
			console.log(	dataitem  ,options.type)
			let titles = ''
			if(options.type=="xq"){
				titles='随手拍详情'
				this.disabled=true
			}else{
				titles='修改学习心得' 
			}
			uni.setNavigationBarTitle({
				title:titles
			})
			this.getphoto(dataitem.img)
			if(dataitem.nr){
				try {
				  dataitem.nr = JSON.parse(JSON.stringify(dataitem.nr.replace(/\<img/gi, '<img width=100% height=100% style="width:100%"')));
				} catch (e) {
				  //TODO handle the exception
				  console.log('error:', e);
				}
			}else{
				try {
				  dataitem.content = JSON.parse(JSON.stringify(dataitem.content.replace(/\<img/gi, '<img width=100% height=100% style="width:100%"')));
				} catch (e) {
				  //TODO handle the exception
				  console.log('error:', e);
				}
			}
			
			
			this.datalist =dataitem
		},
		methods:{
			editorValueChange(name,e){
			  this.fieldData.value = e.value
			  e.column = e.info.name
			  console.log(e)
			  this.$emit('on-value-change', e);
			},
			async getphoto(item) {
				let path = this.$api.select + '/file/download?filePath=';
			    let url = this.$api.select + '/file/select/srvfile_attachment_select';
			    let req = {
			      colNames: ['*'],
			      condition: [
			        {
			          colName: 'file_no',
			          ruleType: 'eq',
			          value: item // 图编号
			        }
			      ],
			      order: null,
			      page: null,
			      serviceName: 'srvfile_attachment_select'
			    };
			
			    let resppo = await this.$http.post(url, req);
				this.contentImg = (path+resppo.data.data[0].fileurl) 
			},
			
			
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
		height: auto !important;
		padding:20upx;
		background: #fff !important;
		width: 100%;
	}
	.serses{
		text-align: center;
	}
</style>
