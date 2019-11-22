<template>
	<view class="conent">
		<!-- 
		<view class="tabbar">
			<text @click="listcolor(index)" :class="idx==index?'listbordercolor':''" v-for="(item,index) in barlist" :key="index">{{item.title}}</text>
		</view> -->
		<view class="" style="margin: 20px;">
			<view class="" style="font-weight: 600;  padding:0 10px; border-left: 2px solid red;">
				综合服务
			</view>
		</view>
		
		<view class="contents">
			<view class="boxone" v-for="(item,index) in list" :key="index" @click="linkurl(item.url)">
				<image class="icon" :src="item.image" mode=""></image>
				<view class="" style="text-align: center; font-size: 16px; padding: 5px;">{{item.name}}</view>
			</view>
		
		</view>
		
		<view class="" style="margin: 20px;">
			<view class="" style="font-weight: 600;  padding:0 10px; border-left: 2px solid red;">
				通讯服务
			</view>
		</view>
		
		<view class="contents">
			<view class="boxone" v-for="(item,index) in listssion" :key="index" @click="linkurl(item.url)">
				<image class="icon" :src="item.image" mode=""></image>
				<view class="" style="text-align: center; font-size: 16px; padding: 5px;">{{item.name}}</view>
			</view>
		
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				barlist:[
					{'title':'社保服务'},
					{'title':'综合服务'}
				],
				idx:0,
				list:[
					{'name':'高考成绩查询','image':'../../static/img/fwimg/gk.png','url':'http://m.gaokao.com/'},
					{'name':'医疗','image':'../../static/img/fwimg/yy.png','url':'https://m.chashebao.com/yiliao/'},
					{'name':'爱心救助','image':'../../static/img/fwimg/hy.png','url':'http://www.4000011520.com/'},
					{'name':'失业','image':'../../static/img/fwimg/sy.png','url':'http://jyjc.mohrss.gov.cn/'},
					{'name':'天气预报','image':'../../static/img/fwimg/tt.png','url':'https://m.tianqi.com/'},
					{'name':'意外','image':'../../static/img/fwimg/yw.png','url':'http://m.sbcxw.cc/gongshang/'},
				{'name':'出入境查询','image':'../../static/img/fwimg/zj.png','url':'https://s.nia.gov.cn'},
				],
				listssion:[
					{'name':'移动','image':'../../static/img/fwimg/yd.png','url':'http://touch.10086.cn/'},
					{'name':'电信','image':'../../static/img/fwimg/dy.png','url':'http://www.189.cn/fj_np/'},
					{'name':'联通','image':'../../static/img/fwimg/lt.png','url':'https://m.10010.com'},
				]
			}
		},
		methods:{
			listcolor(index){
				this.idx=index
			},
			linkurl(url){
        plus.runtime.openWeb(url, function(res) {
            console.log(res);  
        });  
				// uni.navigateTo({
				// 	url: './dsftwo?url='+url,
				// 	success: res => {},
				// 	fail: () => {},
				// 	complete: () => {}
				// });
			}
		},
		onLoad(){
			
		}
	}
</script>

<style>
	.conent{
		width: 100%;
	}
	.tabbar{
		display: flex;
		padding: 10upx 130upx;
		justify-content: space-between;
		text-align: center;
	}
	.tabbar text{
		font-weight: 600;
	} 
	.listbordercolor{
		padding-bottom: 10upx;
		border-bottom: 2px solid #EC5F4B;
	}
	.icon{
		margin: 0 auto;
		display: block;
		height: 110upx;
		width: 110upx;
		border-radius: 8px;
	}
	.contents{
		display: flex;
		padding: 30upx;
		flex-wrap: wrap;
		padding-bottom: 0;
	}
	.boxone{
		margin-bottom: 40upx;
		width: 33%;
	}
</style>
