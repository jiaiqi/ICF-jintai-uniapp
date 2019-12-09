<template>
	<view class="content">
		<view class="box" v-for="(item,index) in listhome" :key="index">
			<view class="">
				<view class="nametitle" style="">
				{{item.zuzhi_name||item.organize_name||item.activity_title||item.note_title}}</view>
				<text>状态:{{item.proc_status}}</text>
			</view>
			<view class="but"  v-if="booe(item.proc_status)"  @click="audio(item)">
				审批
			</view>
			<view class="buts" v-else >
				审批
			</view>
		</view>
		<view class="kapian" v-if="contentBoole">
			<view class="" style="color: #BEBEBE;text-align: center;line-height: 60px;">暂无待审核内容</view> 
			
		</view>
		<!-- //加载中 -->
		<view class="kapian" v-if="menubtn">
			<view class="" style="color: #BEBEBE;text-align: center;">
				<image style="height: 25px;width: 25px;" src="../../static/img/loading.gif" mode=""></image>
				<view class="">	数据加载中</view>
					
			</view> 
		</view>
			<uni-loading :status="status"  color="#888"  />
	</view>
</template>

<script>
	import uniLoading from '@/components/mix-load-more/mix-load-more'
	export default{
		data(){
			return{
				listhome:[],
				contentBoole:false,
				menubtn:true,
				servenameat:'',
				statusTypes: [{
					value: 'more',
					text: '加载前'
				}, {
					value: 'loading',
					text: '加载中'
				}, {
					value: 'noMore',
					text: '没有更多'
				}],
				contentText: {
					contentdown: '上拉/点击加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				numberlist:8,
				pageno:1,
				status: 0,
			}
		},
		components:{uniLoading},
		methods:{
			getlist(val,num){
				let url = this.$api.select +"/sqfw/select/" +val
				let req = {};
				req.serviceName = val;
				req.colNames = ['*'];
				req.condition = [];
				req.order = [];
				req.proc_data_type="wait"
				req['page'] = {
					pageNo: this.pageno,
					rownumber: this.numberlist
				};
				this.$http.post(url, req).then(res => {
					console.log("ddddddddddd",res)
					this.menubtn=false
					for(let i in res.data.data){
						this.$set(res.data.data[i],["servename"],val)
					}
					if(num==0){
						this.listhome =res.data.data
						if(res.data.data.length==0){
							this.contentBoole=true
						}
					}else{
						if(res.data.data.length==0){
							this.status=2
						}
						this.listhome =   this.listhome.concat(res.data.data)
					}
					
					
					console.log(res.data.data)
				})
			},
			onPullDownRefresh() {
					// this.numberlist= this.listhome.length
					let _self =this
					_self.pageno=1
					setTimeout(function() {
						uni.stopPullDownRefresh();
						_self.getlist(_self.servenameat,0)
					}, 1000);
				},
			onReachBottom() {
					let _self = this
					_self.status = 1
					_self.pageno++
					uni.showNavigationBarLoading()
					setTimeout(function() {
						_self.getlist(_self.servenameat,1)
						_self.status = 0
						uni.hideNavigationBarLoading()
					}, 1000);
				},
			booe(val){
				return (val).indexOf("提交")==-1
			},
			audio(val){
				uni.navigateTo({
					url: './audit?query='+encodeURIComponent(JSON.stringify(val).replace(/%/g, '%25'))
				});
			}
		},
		onLoad(option){
			this.servenameat=option.serve
			this.getlist(option.serve,0)
		}
	}
</script>

<style>
	.content{
		width: 100%;
		background: #FFFFFF;
		padding: 40upx;
	}
	.box{
		height: 150upx;
		width: 100%;
		border-radius: 8px;
		box-shadow: 0 0 26px 0 rgba(0,0,0,.15);
		margin-bottom: 15px;
		padding: 12px 25px 12px 12px;
		display: flex;
		justify-content: space-between;
	}
	.but{
		width: 100upx;
		height: 100upx;
		background: #E54D42;
		border-radius: 50%;
		color: #FFFFFF;
		line-height: 100upx;
		text-align: center;
	}
	.buts{
		width: 100upx;
		height: 100upx;
		background: #9E9E9E;
		border-radius: 50%;
		color: #FFFFFF;
		line-height: 100upx;
		text-align: center;
	}
	.kapian{
		box-shadow: 0 0 26px 0 rgba(0,0,0,0.12);
		margin: 8px 0;
		padding: 8px;
	}
	.nametitle{
		font-weight: 600;
		width: 200px;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
</style>
