<template>
	<view class="content" v-if="datalist">
		<view class="">
			<text class="titlename">公租房名称：</text><text>{{datalist.title}}</text>
		</view>
		<view class="">
			<text class="titlename">公租房地址：</text><text>{{datalist.address}}</text>
		</view>
		<view class="" class="titlename">办 理 对 象：</view>
		<view class="cont-box">
			{{datalist.bldx}}
		</view>	
		<view class="" class="titlename">办 理 条 件：</view>
		<view class="cont-box" v-html="">
			{{datalist.bltj}}
		</view>	
		
		<view class="" class="titlename">办 理 流 程：</view>
		<view class="cont-box" v-html="datalist.content">
			
		</view>	
		
		<view class="" class="titlename">材 料 清 单：</view>
		<view class="cont-box">
		{{datalist.materials}} 
		</view>	
		<view class="" class="titlename">办 理 时 限：</view>
		<view class="cont-box">
			{{datalist.blsx}}
		</view>	
		<view class="" class="titlename">收 费 标 准：</view>
		<view class="cont-box">
			{{datalist.sfbz}}
		</view>	
		<view class="" class="titlename">接 待 时 间：</view>
		<view class="cont-box">
			{{datalist.reception_date}}
		</view>	
		
		<view class="">
			<text class="titlename">接 待 人 员：</text><text>{{datalist.reception_oper}}</text>
		</view>
		<view class="">
			<text class="titlename">联 系 电 话：</text><text>{{datalist.reception_phone}}</text>
		</view>
		
		<view class="" class="titlename">接 待 地 点：</view>
		<view class="cont-box">
			{{datalist.reception_address}}
		</view>	
		<view class="">
			<text class="titlename">附 件 下 载：</text><a href="http://39.98.203.134:8081/file/download?filePath=/20190727/20190727150513912100/20190727150513912101.docx" style="color:blue;">公租房.doc</a>
		</view>
		
		<view class="btn" @click="navto()">
			申请预约
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				datalist:[]
			}
		},
		methods:{
			navto(){
				uni.navigateTo({
					url:'./sqyy'
				})
			},
			down(){
				
			}
		},
		onLoad(options){
			this.datalist = (JSON.parse(decodeURIComponent(options.query)))
			console.log(this.datalist)
		}
	}
</script>

<style>
	.content{
		width: 100%;
		background: #FFFFFF;
		padding: 30upx;
	}
	.titlename{
		font-weight: 600;
		line-height: 60px;
		font-size: 16px;
	}
	.cont-box{
		padding:  0 30upx;
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
</style>
