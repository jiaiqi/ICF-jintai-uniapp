<template>
	<view class="content">
		<view class="" style="padding: 10px;">
			<text style="font-size: 17px;font-weight: 600; border-left: 2px solid red;padding: 5px;">社区列表</text>
		</view>
		
		
			
	<view class="" v-if="loadingView">
		<view class=""  >
			<!-- @click="navxq(item.sqname,index,item.sqphone,item.sqaddress)" -->
			<view class="content-box">
				<view class="imageHotel" style="background-color: rgba(150, 150, 150, 0.1);" mode="">
					<!-- <text class="topone">Top{{index+1}}</text> -->
				</view>
				<view class="listtext">
					<view class="testline" style="display: flex;">
						<text id="listones" style="display: block;background-color: rgba(150, 150, 150, 0.1); "></text> 
						 <view class="listcenter" style="display: flex">
							<image style="background:  rgba(150, 150, 150, 0.1);border-radius: 50%;" mode="" class="calls"  ></image>
						 </view>
					</view>
					<view class="testline" style="position: relative;">
							<text id="tesdr" style=" vertical-align:middle;background:rgba(150, 150, 150, 0.1) ;height: 20px; " class="textline"></text>
					</view>
					<view class="" style="display: flex;font-size: 13px;margin-top: 4px;">
						<view class="textFlex textFlexborder">
						  <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						</view>
					</view>
				</view>
			</view>
		</view><view class=""  >
			<!-- @click="navxq(item.sqname,index,item.sqphone,item.sqaddress)" -->
			<view class="content-box">
				<view class="imageHotel" style="background-color: rgba(150, 150, 150, 0.1);" mode="">
					<!-- <text class="topone">Top{{index+1}}</text> -->
				</view>
				<view class="listtext">
					<view class="testline" style="display: flex;">
						<text id="listones" style="display: block;background-color: rgba(150, 150, 150, 0.1); "></text> 
						 <view class="listcenter" style="display: flex">
							<image style="background:  rgba(150, 150, 150, 0.1);border-radius: 50%;" mode="" class="calls"  ></image>
						 </view>
					</view>
					<view class="testline" style="position: relative;">
							<text id="tesdr" style=" vertical-align:middle;background:rgba(150, 150, 150, 0.1) ;height: 20px; " class="textline"></text>
					</view>
					<view class="" style="display: flex;font-size: 13px;margin-top: 4px;">
						<view class="textFlex textFlexborder">
						  <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						</view>
					</view>
				</view>
			</view>
		</view><view class=""  >
			<!-- @click="navxq(item.sqname,index,item.sqphone,item.sqaddress)" -->
			<view class="content-box">
				<view class="imageHotel" style="background-color: rgba(150, 150, 150, 0.1);" mode="">
					<!-- <text class="topone">Top{{index+1}}</text> -->
				</view>
				<view class="listtext">
					<view class="testline" style="display: flex;">
						<text id="listones" style="display: block;background-color: rgba(150, 150, 150, 0.1); "></text> 
						 <view class="listcenter" style="display: flex">
							<image style="background:  rgba(150, 150, 150, 0.1);border-radius: 50%;" mode="" class="calls"  ></image>
						 </view>
					</view>
					<view class="testline" style="position: relative;">
							<text id="tesdr" style=" vertical-align:middle;background:rgba(150, 150, 150, 0.1) ;height: 20px; " class="textline"></text>
					</view>
					<view class="" style="display: flex;font-size: 13px;margin-top: 4px;">
						<view class="textFlex textFlexborder">
						  <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						</view>
					</view>
				</view>
			</view>
		</view><view class=""  >
			<!-- @click="navxq(item.sqname,index,item.sqphone,item.sqaddress)" -->
			<view class="content-box">
				<view class="imageHotel" style="background-color: rgba(150, 150, 150, 0.1);" mode="">
					<!-- <text class="topone">Top{{index+1}}</text> -->
				</view>
				<view class="listtext">
					<view class="testline" style="display: flex;">
						<text id="listones" style="display: block;background-color: rgba(150, 150, 150, 0.1); "></text> 
						 <view class="listcenter" style="display: flex">
							<image style="background:  rgba(150, 150, 150, 0.1);border-radius: 50%;" mode="" class="calls"  ></image>
						 </view>
					</view>
					<view class="testline" style="position: relative;">
							<text id="tesdr" style=" vertical-align:middle;background:rgba(150, 150, 150, 0.1) ;height: 20px; " class="textline"></text>
					</view>
					<view class="" style="display: flex;font-size: 13px;margin-top: 4px;">
						<view class="textFlex textFlexborder">
						  <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						</view>
					</view>
				</view>
			</view>
		</view><view class=""  >
			<!-- @click="navxq(item.sqname,index,item.sqphone,item.sqaddress)" -->
			<view class="content-box">
				<view class="imageHotel" style="background-color: rgba(150, 150, 150, 0.1);" mode="">
					<!-- <text class="topone">Top{{index+1}}</text> -->
				</view>
				<view class="listtext">
					<view class="testline" style="display: flex;">
						<text id="listones" style="display: block;background-color: rgba(150, 150, 150, 0.1); "></text> 
						 <view class="listcenter" style="display: flex">
							<image style="background:  rgba(150, 150, 150, 0.1);border-radius: 50%;" mode="" class="calls"  ></image>
						 </view>
					</view>
					<view class="testline" style="position: relative;">
							<text id="tesdr" style=" vertical-align:middle;background:rgba(150, 150, 150, 0.1) ;height: 20px; " class="textline"></text>
					</view>
					<view class="" style="display: flex;font-size: 13px;margin-top: 4px;">
						<view class="textFlex textFlexborder">
						  <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						</view>
					</view>
				</view>
			</view>
		</view><view class=""  >
			<!-- @click="navxq(item.sqname,index,item.sqphone,item.sqaddress)" -->
			<view class="content-box">
				<view class="imageHotel" style="background-color: rgba(150, 150, 150, 0.1);" mode="">
					<!-- <text class="topone">Top{{index+1}}</text> -->
				</view>
				<view class="listtext">
					<view class="testline" style="display: flex;">
						<text id="listones" style="display: block;background-color: rgba(150, 150, 150, 0.1); "></text> 
						 <view class="listcenter" style="display: flex">
							<image style="background:  rgba(150, 150, 150, 0.1);border-radius: 50%;" mode="" class="calls"  ></image>
						 </view>
					</view>
					<view class="testline" style="position: relative;">
							<text id="tesdr" style=" vertical-align:middle;background:rgba(150, 150, 150, 0.1) ;height: 20px; " class="textline"></text>
					</view>
					<view class="" style="display: flex;font-size: 13px;margin-top: 4px;">
						<view class="textFlex textFlexborder">
						  <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						</view>
					</view>
				</view>
			</view>
		</view><view class=""  >
			<!-- @click="navxq(item.sqname,index,item.sqphone,item.sqaddress)" -->
			<view class="content-box">
				<view class="imageHotel" style="background-color: rgba(150, 150, 150, 0.1);" mode="">
					<!-- <text class="topone">Top{{index+1}}</text> -->
				</view>
				<view class="listtext">
					<view class="testline" style="display: flex;">
						<text id="listones" style="display: block;background-color: rgba(150, 150, 150, 0.1); "></text> 
						 <view class="listcenter" style="display: flex">
							<image style="background:  rgba(150, 150, 150, 0.1);border-radius: 50%;" mode="" class="calls"  ></image>
						 </view>
					</view>
					<view class="testline" style="position: relative;">
							<text id="tesdr" style=" vertical-align:middle;background:rgba(150, 150, 150, 0.1) ;height: 20px; " class="textline"></text>
					</view>
					<view class="" style="display: flex;font-size: 13px;margin-top: 4px;">
						<view class="textFlex textFlexborder">
						  <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						 <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;" ></text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
		
		
		
		<view v-else class="" v-for="(item,index) in listhome" :key="index"  >
			<!-- @click="navxq(item.sqname,index,item.sqphone,item.sqaddress)" -->
			<view class="content-box">
				<image class="imageHotel" src="../../static/img/hotels.png" mode="">
					<text class="topone">Top{{index+1}}</text>
				</image>
				<view class="listtext">
					<view class="testline" style="display: flex;">
						<text style="display: block;font-weight: 600;font-size: 16px;" @click="navxq(item.id)">{{item.sqname}}</text> 
						 <view class="listcenter" style="display: flex">
							<image src="../../static/img/ditu.png" mode="" class="calls"  @click="open(item.latitude,item.sqtrapeze,item.sqname)"></image>
						 </view>
					</view>
					<view class="testline" style="display: flex;font-size: 15px;color: #666;" @click="navxq(item.id)">
							<image class="mapwz" src="../../static/img/wz.png" mode="" ></image>
							<text style="vertical-align:middle;" class="textline">{{item.sqaddress}}</text>
					</view>
					<view class="" style="display: flex;font-size: 13px;margin-top: 4px;"  @click="navxq(item.id)">
						<view class="textFlex textFlexborder">
						  <text v-if="item.sqfamily>800&&item.sqspace>1200" class="backcolor">优质小区</text>
						  <text v-if="item.sqfamily>800" class="mapborder">面积大</text>
						  <text v-if="item.sqspace>1200" class="mapborder">车位多</text>
						  <text class="blueborder">环境优美</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view @click="orders()">
					<uni-loading :status="status"  :content-text="contentText" color="#007aff"  />
		</view>
	</view>
</template>

<script>
	import uniLoading from '@/components/sqfwl-loading-more/loading.vue'
	export default {
		data(){
			return{
				loadingView:true,
				listhome:[],
				url: 'https://m.amap.com',
				status: 'more',
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
					contentdown: '上拉/点击查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				numberlist:7,
				pageno:1
			}
		},
		components:{
			uniLoading
		},
		methods:{
			getdata(index){
				
				let url = this.$api.select + "/sqfw/select/srvzhsq_information_select?srvzhsq_information_select"
				let req = {};
				req.serviceName = 'srvzhsq_information_select';
				req.colNames = ['*'];
				req.condition = [];
				req.order = [];
				req['page'] = {
					pageNo: this.pageno,
					rownumber: this.numberlist
				};
				this.$http.post(url, req).then(res => {
					console.log(	res) 
					if(index==0){
						this.listhome =    res.data.data
					}else{
						if(res.data.data.length==0){
							this.status="noMore"
						}
						this.listhome =   this.listhome.concat(res.data.data)
					}
					this.loadingView=false
				})
			},
				onPullDownRefresh() {
						this.numberlist= this.listhome.length
						let _self =this
						_self.pageno=1
						setTimeout(function() {
							uni.stopPullDownRefresh();
							_self.getdata(0)
						}, 1000);
					},
					
						onReachBottom() {
								let _self = this
								_self.status = 'loading'
								_self.pageno++
								uni.showNavigationBarLoading()
								
								console.log('reach');
								setTimeout(function() {
									_self.getdata(1)
									_self.status = 'more'
									uni.hideNavigationBarLoading()
								}, 1000);
							},
							
							orders(){
								let _self = this
								_self.pageno++
								_self.status = 'loading'
								uni.showNavigationBarLoading()
								
								console.log('reach');
								setTimeout(function() {
									_self.getdata(1)
									console.error(_self.pageno)
									_self.status = 'more'
									uni.hideNavigationBarLoading()
								}, 1000);
							},
			
			open(j,w,n) {
				let url = 'https://m.amap.com/share/index/lnglat=' +w+','+j+'&name='+n+'&callnative=0'
				
				// location.href='https://m.amap.com/share/index/lnglat=108.840104,34.326915&name=西部社区&callnative=0'
			  plus.runtime.openWeb(url, function(res) {
			    console.log(res);
			  });
			},
			navxq(id){
				uni.navigateTo({
					url: './sqxqjs?id='+id,
				});
			}
		},
		onLoad(){
			this.getdata(0)
			
			 // setTimeout(function () {
			 //            console.log('start pulldown');
			 //        }, 1000);
			 //        uni.startPullDownRefresh();
			 
		}
	}
</script>

<style>
	.content{
		width: 100%;
		background: #FFFFFF !important;
	}
	.imageHotel{
		display: block;
		height: 200upx;
		width:200upx !important;
		border-radius: 18upx;
		margin-right: 25upx;
		background: rgba(150, 150, 150, 0.1);
	}
	.content-box{
		display: flex;
		padding: 20upx;
		border-bottom:  0.5px solid #E2E3DC;
		position: relative;
	}
	.listtext text{
		margin-top: 5upx;
	}
	.testline text{
		line-height: 60upx;
	}
	.topone{
		position: absolute;
		left: 150upx;
		height: 40upx;
		line-height: 40upx;
		text-align: center;
		width: 70upx;
		background: #FB6A6A;
		font-size: 12px;
		box-sizing: border-box;
		border-top-right-radius: 18upx;
		border-bottom-left-radius: 18upx;
		color: #FFFFFF;
	}
	.mapwz {
	  display: inline-block;
	  width: 27upx;
	  height: 35upx;
	  margin-top: 18upx;
	  margin-right:5upx ;
	  /* position: absolute;
	  top: ; */
	vertical-align:middle;
	}
	.calls{
		height: 50upx;
		
		width: 50upx ;
		padding: 0 1px;
		background: rgba(150, 150, 150, 0.1);
		border-radius: 50%;
	}
	.textline{
		display: block;
		width: 420upx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	#tesdr{
		width: 447upx;
		margin:16upx 0 14upx 0;
	}
	.callnumber{
		display: inline-block;
		width: 50upx;
		text-align: center;
		font-size: 13px;
		color: #ff6436;
	}
	.listcenter view{
		line-height: 40upx;
		text-align: center;
	
	}
	.listcenter{
		position: absolute ;
		right: 25upx !important;
		top: 28upx !important;
	}
	.textFlex {
	  display: flex;
	}
	.textFlexborder text {
	  margin: 10upx 10upx 10upx 0;
	}
	.backcolor {
	  background: rgb(255, 88, 88);
	  color: #ffffff;
	  border-radius: 10upx;
	  font-size: 12px;
	  padding: 1px;
	}
	.mapborder {
	  border: 1px solid rgb(255, 88, 88);
	  color: rgb(255, 88, 88);
	  font-size: 13px;
	  padding: 1px;
	}
	.blueborder {
	  border: 1px solid rgb(58, 174, 255);
	  color: rgb(58, 174, 255);
	  font-size: 13px;
	  padding: 1px;
	}
	#listones{
		margin-top: 18upx;
		width: 250upx;
		height: 50upx;
	}
</style>
