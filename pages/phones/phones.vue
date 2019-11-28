<template>
	<view>
		<phone-directory :phones="phones" @paramClick="paramClick"></phone-directory>
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
					"党组织通讯录": [{
						"id":1,
						"spell":"a",
						"name":"金台区党委"
					},{
						"id":2,
						"spell":"a",
						"name":"陈仓镇党委"
					},{
						"id":3,
						"spell":"a",
						"name":"东岭村党委"
					},{
						"id":4,
						"spell":"a",
						"name":"团结村党委"
					}]
				}
			
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
				let url = this.$api.select+'/zhdj/select/srvzhsq_dzzjg_select?srvzhsq_dzzjg_select'
					let req = {};
					req.serviceName = "srvzhsq_dzzjg_select";
					req.colNames = ["*"];
					req.condition = [];
					req.order=[]
					req.page={pageNo: 1, rownumber: 60}
					this.$http.post(url, req).then(res => {
						
						let listserve = (res.data.data)
						var arrList=[]
						for( var i=0; i<listserve.length ; i++){
							arrList.push({"id":listserve[i].id,"spell":listserve[i].create_user,"name":listserve[i].zjmc,"phoneNumber":listserve[i].zjdh})
						}
						
						this.phones.党组织通讯录= this.sortByKey(arrList,"id")
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
			}
		}
</script>

<style>

</style>
