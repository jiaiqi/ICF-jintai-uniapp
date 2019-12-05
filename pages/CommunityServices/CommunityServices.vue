<template>
	<view class="wrap">
		<view class="">
			        <bw-swiper :swiperList="swiperList" style="width:100%;"></bw-swiper>
		</view>
		<uni-grid :column="3" :showBorder="showBorder">
			<uni-grid-item v-for="(item, index) in menuData" :key="index" :url="item.app_temp_col_map ? item.app_temp_col_map : ''" :treeData="item">
				<text class="text">{{ item.label }}</text>
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script>
import uniGrid from '@/components/uni-grid/uni-grid.vue';
import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
import bwSwiper from '@/components/kp-swper/bw-swiper.vue'
export default {
	components: { uniGrid, uniGridItem,bwSwiper },
	data() {
		return {
			userInfo: {},
			menuData: [],
			showBorder: true,
			 swiperList:	[] 	
		};
	},
	methods: {
		getMenusList(app = 'sqfw') {
			let url = this.$api.select + '/' + app + '/select/srvsys_user_menu_select';
			let req = {
				serviceName: 'srvsys_user_menu_select',
				colNames: ['*'],
				order: [{ colName: 'seq', orderType: 'asc' }],
				condition: [{ colName: 'client_type', ruleType: 'like', value: 'APP' }]
			};
			this.$http.post(url, req).then(res => {
				if (res.data.data) {
					let menuData = res.data.data;
					let children = [];
					let parents = [];
					menuData.forEach((menu, i) => {
						menu.children = [];
						menu.label = menu.menu_name;
						menu.value = menu.menu_no;
						if(menu.client_type.includes('APP')){
              if (menu.parent_no) {
              	children.push(menu);
              } else {
              	parents.push(menu);
              }
              this.getImagePath(menu.app_icon).then(path => {
              	menu.menu_icon_path = path;
              });
            }
						
					});
					children.forEach(item1 => {
						children.forEach(item2 => {
							if (item1.parent_no === item2.menu_no) {
								item2['children'].push(item1);
							}
						});
					});
					parents.forEach(parent => {
						children.forEach(child => {
							if (child.parent_no === parent.menu_no) {
								parent['children'].push(child);
							}
						});
					});
					this.menuData = parents;
					console.log(parents);
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
		async getImagePath(imgId) {
			if (imgId) {
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
				let res = await this.$http.post(url, req);
				if (res.data.data && res.data.data.length > 0) {
					let path = this.$api.select + '/file/download?filePath=' + res.data.data[0].fileurl;
					return path;
				}
			} else {
				return '';
			}
		}
	},
	onLoad(option) {
		this.userInfo = uni.getStorageSync('userInfo');
		this.getMenusList(option.app);
		this.getBannerList()
	}
};
</script>

<style lang="scss">
.wrap {
	width: 100%;
  background-color: #fff;
	.text{
    line-height: 60upx;
  }
}
</style>
