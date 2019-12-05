<template>
  <view class="wrap">
	  <view class="">
	  	        <bw-swiper :swiperList="swiperList" style="width:100%;"></bw-swiper>
	  </view>
    <uni-grid :column="4" :showBorder="showBorder">
        <uni-grid-item v-for="(item,index) in menuData" :key="index" :url="item.app_temp_col_map?item.app_temp_col_map:''" :treeData="item">
            <text class="text">{{item.label}}</text>
            
        </uni-grid-item>
    </uni-grid>
	<view class="banner" >
		
	</view>
  </view>
</template>

<script>
  import uniGrid from "@/components/uni-grid/uni-grid.vue"
  import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
  import bwSwiper from '@/components/kp-swper/bw-swiper.vue'
export default {
  components:{uniGrid,uniGridItem,bwSwiper},
  data() {
    return {
      userInfo: {},
      menuData:[],
      showBorder:false,
	  swiperList:	[] 	
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
        }
      });
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
						console.error(res.data.data)
						let picUrlList = []
						this.swiperList.push({'img':path + res.data.data[0].fileurl});
						console.log('picUrlList:', picUrlList);
					});
				});
			}
		});
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
  }
};
</script>

<style lang="scss">
  .wrap{
    width: 100%;
    background: #fff;
  }
  .banner{
	  height: 10vh;
	 width: calc(100% - 80upx);
	  background: url(../../static/img/bannertwo.png);
	  background-size: cover;
	  margin: 0 40upx;
	  border-radius: 5px;
  }
</style>
