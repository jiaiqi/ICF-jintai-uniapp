<template>
	<view class="contentdat">
		<view class=""  >
			<view class="titlea">
				<text v-if="datalist.lb" space="nbsp" style="color: red;font-size: 18px;">[{{datalist.lb}}]</text space="nbsp">
				
					<text v-if="datalist.activity_title" style="font-size: 18px;">{{datalist.activity_title }}	</text>
					<text v-else style="font-size: 18px;">{{datalist.bt || datalist.hdbt }}	</text>
					<view class="" style="color:#BEBEBE; font-size: 12px;font-weight: 100;">
					<text v-if="datalist.ly">{{datalist.ly}}  &nbsp;| <text style="opacity: 0;">4</text> </text>	<text>{{datalist.hdsj  }}</text>
					</view>
			</view>
			<view class="" style="width: 100%;height: 1px; background: #BEBEBE;">
				
			</view>
				
			<view class="contents-box"  v-if="datalist.hdnr"
			v-html=" JSON.parse((JSON.stringify(datalist.hdnr).replace(/\<img/gi,'<img width=100% height=230px ' ))) " >
		
			</view>
			
			<view class="contents-box" v-else-if="datalist.nr"
			v-html=" JSON.parse((JSON.stringify(datalist.nr).replace(/\<img/gi,'<img width=100% height=230px ' ))) " >
					
			</view>
			
			<view class="contents-box"  v-else-if="datalist.activity_content"
				v-html=" JSON.parse((JSON.stringify(datalist.activity_content).replace(/\width:650px;/gi,'width:100%;height:230px' ).replace(/\<img/gi,'<img width=100% height=230px ' ))) " >
					
			</view>
			
			
		</view>
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				datalist:[],
				rich:null,
				richs:null
			}
		},
		methods:{
			
			// callphone(){
			// 	console.log(this.phone)
			// 	uni.makePhoneCall({
			// 	    phoneNumber: this.phone
			// 	});
			// },
		
		},
		onLoad(options){
				uni.setNavigationBarTitle({
						title: '详情'
				}); 
				console.log(options)
					this.datalist =(JSON.parse(decodeURIComponent(options.query)))
				 // this.rich =  JSON.parse((JSON.stringify(this.datalist.hdnr).replace(/\<img/gi,'<img width=100% height=230px ' )))
				 //  this.richs =  JSON.parse((JSON.stringify(this.datalist.nr).replace(/\<img/gi,'<img width=100% height=230px ' )))
		}
		}
</script>

<style>
	.contentdat{
		width: 100%;
	}
	.titlea{
		padding:25upx 30upx 10upx 30upx;
		text-align: center;
		font-weight: 600;
	}
	.contents-box{
		padding: 30upx;
		font-size: 16px;
	}
 .rich-img {

width: 100% !important;

height: 50% !important;

}
</style>
