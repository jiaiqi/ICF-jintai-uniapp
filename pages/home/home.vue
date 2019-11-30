<template>
	<view class="content page-home">
		<uni-swiper-dot :info="picUrlList" :current="current" field="content" mode="long" :dotsStyles="dotsStyles">
			<swiper class="swiper-box" @change="change" :autoplay="true" style="height: 470upx;">
				<swiper-item v-for="(item, index) in picUrlList" :key="index">
					<view class="swiper-item">
						<image :src="item" mode="aspectFill" style="width: 100%;height: 470upx;"></image>
						<text>{{ item.title }}</text>
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<uni-grid :options="shortcutMenu" column-num="3" :show-border="true" :square="true" @click="goPages"></uni-grid>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { uniSwiperDot } from '@dcloudio/uni-ui';
import uniGrid from '@/components/uni-grid/uni-grid.vue';
export default {
	components: { uniSwiperDot, uniGrid },
	// uniGrid
	data() {
		return {
			swiperList: [
				{
					url: 'javascript:',
					img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
					title: '…'
				},
				{
					url: 'javascript:',
					img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
					title: '…'
				},
				{
					url: 'javascript:',
					img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg', // 404
					title: '…'
				}
			],
			current: 0,
			dotsStyles: {
				border: 'rgba(255,255,255,.7)',
				selectedBorder: 'rgba(255,255,255,.5)',
				backgroundColor: 'rgba(255,255,255,.5)',
				selectedBackgroundColor: 'rgba(255,255,255,.8)'
			},
			picUrlList: [],
			shortcutMenu: [
				{ image: '../../static/img/zhdj.png', text: '智慧党建', url: '../zhdj/zhdj' },
				{ image: '../../static/img/sqfw.png', text: '社区服务', url: '../sqfw/sqfw' },
				{ image: '../../static/img/ggfw.png', text: '公共服务', url: '../ggfw/ggfw' },
				{ image: '../../static/img/bmfw.png', text: '便民服务', url: '../bmfw/bmfw' },
				{ image: '../../static/img/shzz.png', text: '社会组织', url: '../shzz/zzhome' },
				{ image: '../../static/img/zyfw.png', text: '志愿服务', url: null },
				{ image: '../../static/img/sqlt.png', text: '社区论坛', url: '../forum/forum' }
        // { image: '../../static/img/appicon/zh.png', text: '智慧党建', url: '../zhdj/zhdj' },
        // { image: '../../static/img/appicon/sq.png', text: '社区服务', url: '../sqfw/sqfw' },
        // { image: '../../static/img/appicon/gg.png', text: '公共服务', url: null },
        // { image: '../../static/img/appicon/bm.png', text: '便民服务', url: '../bmfw/bmfw' },
        // { image: '../../static/img/appicon/sh.png', text: '社会组织', url: '../shzz/zzhome' },
        // { image: '../../static/img/appicon/zy.png', text: '志愿服务', url: null },
        // { image: '../../static/img/appicon/lt.png', text: '社区论坛', url: '../forum/forum' }
			],
			modals: [],
			menus: []
		};
	},
	computed: mapState(['forcedLogin', 'hasLogin', 'userName', 'userInfo']),
	async onLoad() {
		uni.setNavigationBarTitle({
		    title: '金台智慧社区'
		});
		this.getBannerList()
	},
	updated(){
	},
	methods: {
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
							console.log(res.data.data)
							this.picUrlList.push(path + res.data.data[0].fileurl);
						});
					});
				}
				console.log('picUrlList:', this.picUrlList);
			});
		},
		goPages(e) {
			console.log(e);
			let url = e.data.url;
			if (url) {
				uni.navigateTo({
					url: url
				});
			}
		},
		change(e) {
			this.current = e.detail.current;
		}
	}
};
</script>

<style lang="scss" scoped>
.uni-swiper__dots-box {
	background-color: #fff;
}
.content{
	background-color: #fff;
}
swiper-item {
	.swiper-item {
		position: relative;
		height: 100%;
		image {
			width: 100%;
			height: 470upx;
		}
		text {
			position: absolute;
			background: rgba(0, 0, 0, 0.6);
			color: #fff;
			bottom: 0;
			z-index: 99;
			left: 0;
			height: 1.2rem;
			line-height: 1.2rem;
		}
	}
}
</style>
