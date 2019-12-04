<template>
	<view class="wrap">
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
export default {
	components: { uniGrid, uniGridItem },
	data() {
		return {
			userInfo: {},
			menuData: [],
			showBorder: true
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
	}
};
</script>

<style lang="scss">
.wrap {
	width: 100%;
	.text{
    line-height: 60upx;
  }
}
</style>
