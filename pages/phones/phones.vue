<template>
	<view class="conent">
	
		<phone-directory  v-if="!listBoole"   :phones="phones" @paramClick="paramClick"></phone-directory>
		
		<view class="loadinga" v-else>
			<input disabled="false" class="phone-main-input" type="text" placeholder="请输入要搜索的社区"/>
			<view class="titles"></view>
				<view class="" style="color: #BEBEBE;text-align: center;margin-top:8px">
					<image style="height: 25px;width: 25px;" src="../../static/img/loading.gif" mode=""></image>
					<view class="">	数据加载中</view>
				</view> 
		</view>
	</view>
</template>

<script>
	import phoneDirectory from '@/components/phone-directory/phone-directory.vue'
	export default {
		name:"phones",
		components:{
			phoneDirectory
		},
		data() {
			return {
				phones:{
					"社区通讯录": []
				},
				listBoole:true
			
			}
		},
		methods : {
			paramClick (e) {
				uni.showModal({
				    title: '提示',
				    content: '拨打电话给'+e.name+"？",
				    success: function (res) {
				        if (res.confirm) {
				            	uni.makePhoneCall({
				            	    phoneNumber: e.phonenumber
				            	});
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				console.log(e)
			},
			getdata(){
				let url = this.$api.select+'/sqfw/select/srvzhsq_information_select?srvzhsq_information_select'
					let req = {};
					req.serviceName = "srvzhsq_information_select";
					req.colNames = ["*"];
					req.condition = [];
					req.order=[]
					// req.page={pageNo: 1, rownumber: 60}
					this.$http.post(url, req).then(res => {
						this.listBoole=false
						let listserve = (res.data.data)
						var arrList=[]
						for( var i=0; i<listserve.length ; i++){
							arrList.push({"id":listserve[i].id,"spell":listserve[i].create_user,"name":listserve[i].sqname,"phoneNumber":listserve[i].sqphone})
						}
						
						this.phones.社区通讯录= this.sortByKey(arrList,"id")
					})
				},
				sortByKey(array,key){
				    return array.sort(function(a,b){
				        var x = a[key];
				        var y = b[key];
				        return((x<y)?-1:((x>y)?1:0));
				    })
				}
			},
			onLoad(){
				this.getdata()
			},
      onShow(){
        this.getdata()
      }
		}
</script>

<style>
	.conent{
		background: #FFFFFF;
	}
.loadinga{
	height: 110upx;
	width: 100vw;
	background: #FFFFFF;
}
.phone-main-input{
	height: 60upx;
	font-size:28upx;
	border: 1px solid #e5e5e5;
	border-radius: 3px;
	padding: 10upx 20upx 10upx 20upx;
	margin: 5px 8px ;
}
.titles{
	width: 100%;
	    height: 46px;
	    line-height: 46px;
	    font-size: 16px;
	    font-weight: bold;
	    padding: 0 10px;
	    border-bottom: 1px solid #e5e5e5;
		background-color: #eee;
}
</style>
