<template>
  <view class="wrap">
	  <!-- loading -->
	  <Loading v-if="successNum" @tap="newtab" ></Loading>
	  <!-- //菜单 -->
	  <view class="" v-else>
	  	<view class="bannerlun" >
	  	  	        <bw-swiper :swiperList="swperboole?swiperList:swiperLists" style="width:100%;"></bw-swiper>
	  	  </view>
	  	  <!-- 轮播 -->
	  	  <view class="" >
	  	  	<uni-grid :column="4" :showBorder="showBorder">
	  	  	    <uni-grid-item v-for="(item,index) in menuData" :key="index" :url="item.app_temp_col_map?item.app_temp_col_map:''" :treeData="item">
	  	  	        <text class="text">{{item.label}}</text>
	  	  	        
	  	  	    </uni-grid-item>
	  	  	</uni-grid>
	  	  </view>
	  	
	  	<!-- 插图 -->
	  	<view class="banner"   :style="{backgroundImage: 'url('+imageURL+')'}">
	  		
	  	</view>
	  	<!-- 活动 -->
	  	<view class=""  >
	  		<text class="titleall">热门活动</text>
	  		<view class="contenthot">
	  			<view class="hot" v-for="(item,index) in xqpage" :key="index">
	  				<view class="phopos" @tap="detaile(item)" :style="{backgroundImage: 'url('+item.slt+')'}"></view>
	  				<view class="textline">{{item.hdbt}}</view>	
	  			</view>
	  		</view>
	  		
	  	</view>
	  </view>
	  <uni-loading  color="#888"  />
  </view>
</template>

<script>
  import uniGrid from "@/components/uni-grid/uni-grid.vue"
  import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
  import bwSwiper from '@/components/kp-swper/bw-swiper.vue'
  	import uniLoading from '@/components/sqfwl-loading-more/loading.vue'
export default {
  components:{uniGrid,uniGridItem,bwSwiper,uniLoading},
  data() {
    return {
      userInfo: {},
      menuData:[],
      showBorder:false,
	  swiperList:[
		  {'img':'../../static/img/dj.png'},
		  {'img':'../../static/img/dj.png'},
		  {'img':'../../static/img/dj.png'},
	  ] ,
	  swperboole:true,
	  swiperLists:[],
	  phoarr:[],
	  xqpage:Object,
	  imageURL:'../../static/img/bannertwo.png',
	  successNum:true,
	  status:0
    };
  },
  methods: {
    getMenusList() {
      let url = this.$api.select + '/zhdj/select/srvsys_user_menu_select';
      let req = { serviceName: 'srvsys_user_menu_select', colNames: ['*'], order: [{colName: "seq", orderType: "asc"}], 
      condition: [{colName:"client_type",ruleType:'like',value:"APP"}] };
      this.$http.post(url, req).then(res => {
		 
        if (res.data.data) {
          console.log(res.data.data);
          let menuData = res.data.data
          let children = []
          let parents = []
          menuData.map(menu=>{
            menu.children = []
            menu.label = menu.menu_name
            menu.value = menu.menu_no
			if(menu.client_type&&menu.client_type.includes("APP")){
				this.getImagePath(menu.app_icon).then(res=>{
					menu.menu_icon_path = res
				})
				if(menu.parent_no){
				  children.push(menu)
				}else{
				  parents.push(menu)
				}
			}
          })
          // console.log(children,'\n',parents,'a')
          children.map(item1=>{
            children.map(item2=>{
              if(item1.parent_no === item2.menu_no){
                item2["children"].push(item1)
              }
            })
          })
          parents.map(parent=>{
            children.map(child=>{
              if(child.parent_no === parent.menu_no){
                parent["children"].push(child)
              }
            })
          })
          // console.log('data',parents)
          this.menuData = parents
		  this.successNum=false
        }
		 console.log(this.successNum,"_________菜单___________")
      }).catch(error=>{
        console.log('error:',error)
      if(error.status==0){
        this.getMenusList()
      }
    })
    },
	newtab(){
		uni.switchTab({
			url: './smartcity'  
		})
	},
	onPullDownRefresh() {
			// this.numberlist= this.listhome.length
			let _self =this
			// _self.rebuileComponents()
			setTimeout(function() {
				uni.stopPullDownRefresh();
				 _self.userInfo = uni.getStorageSync('userInfo');
				_self.getMenusList();
				_self.getBannerList()
				_self.hotlist("srvzhsq_djhdjl_djhd_select")
			}, 1000);
		},
		// rebuileComponents() {
		//       // 销毁子标签
		//       this.successNum = 3;
		//       // 重新创建子标签
		//       this.$nextTick(() => {
		//         this.successNum = 0;
		//       });
		//     },
	
	detaile(item,val){
		uni.navigateTo({
			url:'../sqfw/sqxq?query='+ encodeURIComponent((JSON.stringify(item)).replace(/%/g, '%25'))+'&num=1'
		})
	},
	// 获取轮播图路径
	getBannerList() {
		// 获取轮播图编号
		let url = 'http://39.98.203.134:8081/zhdj/select/srvzhsq_djhdjl_djhd_select';
		let req = {};
		req.serviceName = 'srvzhsq_djhdjl_djhd_select';
		req.colNames = ['*'];
		req.condition = [];
		req.order = [];
		req['page'] = {
			pageNo: 1,
			rownumber: 10
		};
		this.$http.post(url, req).then(res => {
			// console.log(res);
			let picUrlCode = [];
			if (res.data.data && res.data.data instanceof Array) {
				res.data.data.map(item => {
					if (item.lbt) {
						picUrlCode.push(item.lbt); // 将获取到的轮播图编号放入picUrlCode中
					}
				});
			}
			// console.log('picUrlCode:', picUrlCode);
			if(picUrlCode && picUrlCode instanceof Array){
				// 通过轮播图编号获取轮播图文件路径
				picUrlCode.map(item => {
					let path = 'http://39.98.203.134:8081/file/download?filePath=';
					let url = 'http://39.98.203.134:8081/file/select/srvfile_attachment_select';
					console.log("ggggggggggggggg",item)
					let req = {
						colNames: ['*'],
						condition: [
							{
								colName: 'file_no',
								ruleType: 'eq',
								value: item // 轮播图编号
							}
						],
						order: null,
						page: null,
						serviceName: 'srvfile_attachment_select'
					};
					this.$http.post(url, req).then(res => {
						let picUrlList = []
						this.swiperLists.push({'img':path + res.data.data[0].fileurl});
						this.swperboole=false
					});
				});
			}
		});
	},
	//活动列表
	hotlist(serve){
		let url =this.$api.select +"/zhdj"+ "/select/"+serve
		let req = {};
		req.serviceName =serve;
		req.colNames = ['*'];
		req.condition = [];
		req.order = [];
		req.proc_data_type="processed"
		req['page'] = { 
			pageNo: 1,
			rownumber: 7
		};
		this.$http.post(url, req).then(res => {
		this.xqpage = res.data.data;
			console.log("..................",res.data.data)
			// this.xqpage=res.data.data
			let path = 'http://39.98.203.134:8081/file/download?filePath=';
			let listr= []
			for(let i in  res.data.data){
				listr.push(res.data.data[i].slt)
				
				let url = 'http://39.98.203.134:8081/file/select/srvfile_attachment_select';
				let req = {
					colNames: ['*'],
					condition: [
						{
							colName: 'file_no',
							ruleType: 'eq',
							value: listr[i] // 图编号
						}
					],
					order: null,
					page: null,
					serviceName: 'srvfile_attachment_select'
				};
				let phoarr = []
				this.$http.post(url, req).then(resppo => {
					console.error(resppo)
				  if (resppo.data&&resppo.data.data&&resppo.data.data.length>0) {
				    try{
				      this.$set(res.data.data[i], 'slt', path + resppo.data.data[0].fileurl);
				    }catch(e){
				      //TODO handle the exception
				      console.log('err',e)
				    }
				  }
				});
				if (res.data.data[i].slt == null) {
				  res.data.data[i].slt = this.imageURL;
				}
				this.xqpage = res.data.data;
			}
			// console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiii",this.phoarr)
		})
	},
    async getImagePath(imgId){
      if(imgId){
        let url = this.$api.select + '/file/select/srvfile_attachment_select';
        let req = {
        	colNames: ['*'],
        	condition: [
        		{
        			colName: 'file_no',
        			ruleType: 'eq',
        			value: imgId // 图片编号
        		}
        	],
        	serviceName: 'srvfile_attachment_select'
        };
        let res = await this.$http.post(url, req)
        if (res.data.data && res.data.data.length > 0) {
        	console.log(res.data.data);
        	let path  = this.$api.select + '/file/download?filePath=' + res.data.data[0].fileurl;
        	return path
        }
      }else{
        return ''
      }
      // this.$http.post(url, req).then(res => {
      // 	if (res.data.data && res.data.data.length > 0) {
      // 		console.log(res.data.data);
      // 		this.note_user_info['head_img'] = this.$api.select + '/file/download?filePath=' + res.data.data[0].fileurl;
      // 		this.userImage = this.$api.select + '/file/download?filePath=' + res.data.data[0].fileurl;
      // 	}
      // });
    }
  },
  onLoad() {
    this.userInfo = uni.getStorageSync('userInfo');
    this.getMenusList();
	this.getBannerList()
	this.hotlist("srvzhsq_djhdjl_djhd_select")
  }
};
</script>

<style lang="scss">
  .wrap{
    width: 100%;
	background: #FFFFFF;
	.text{
	  line-height: 60upx;
	}
  }
  .banner{
	  height: 10vh;
	 width: calc(100% - 60upx);
	  // background: url();
	  background-size: cover;
	  margin: 0 30upx 10px 30upx;
	  border-radius: 5px;
  }
  .titleall{
	  font-size: 15px;
	  font-weight: 600;
	  border-left: 2px solid red;
	  padding-left: 8px;
	  margin-left:30upx ;
  }
  .phopos{
	  height: 160upx;
	  width: 210upx;
	  // background: #00B26A;
	  background-size: cover;
	  border-radius:8px ;
  }
  .hot{
	  width: 210upx;
	  margin-right: 20upx;
  }
  .contenthot{
	  margin-top: 15upx;
	  display: flex;
	  margin-left: 30upx;
	  overflow-x: scroll;
	   -webkit-overflow-scrolling: touch;
  }
  .textline{
	  margin-top: 5px;
	  line-height: 18px;
	  font-size: 13px;
	  -webkit-line-clamp:2; 
	  display: -webkit-box;
	  -webkit-box-orient:vertical;
	  overflow:hidden;
	  text-overflow: ellipsis;
  }
  .bannerlun{
	  height: 25vh !important;
	  overflow: hidden;
  }
</style>
