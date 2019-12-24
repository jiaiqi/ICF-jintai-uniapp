<template>
	<view class="content">
		<uni-swiper-dot :info="picUrlList" :current="current" field="content" mode="long" class="aaa" :dotsStyles="dotsStyles">
			<swiper class="swiper-box" @change="change" :autoplay="true" style="height: 470upx;">
				<swiper-item v-for="(item, index) in picUrlList" :key="index">
					<view class="swiper-item"><image :src="item" mode="aspectFill" style="width: 100%;height: 470upx;"></image></view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<uni-grid :options="shortcutMenu" column-num="3" :show-border="false" :highlight="true" @click="onGridItem"></uni-grid>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { uniSwiperDot } from '@dcloudio/uni-ui';
import uniGrid from '@/components/uni-grid/uni-grid.vue';
export default {
	components: { uniSwiperDot, uniGrid },
	data() {
		return {
			picUrlList: [],
			current: 0,
			mode: 'long',
      dotsStyles: {
      	border: 'rgba(255,255,255,.7)',
      	selectedBorder: 'rgba(255,255,255,.5)',
      	backgroundColor: 'rgba(255,255,255,.5)',
      	selectedBackgroundColor: 'rgba(255,255,255,.8)'
      },
			shortcutMenu: [
				{ image: '../../static/img/djhd.png', text: '党建活动' ,'url':'./gggs?serve=srvzhsq_djhdjl_djhd_select'},
				{ image: '../../static/img/gsgg.png', text: '公告公示','url':'./gggs?serve=srvzhsq_gsgg_select' },
				{ image: '../../static/img/jypx.png', text: '党建培训', url: '../djpx/djpx' },
				{ image: '../../static/img/dyfw.png', text: '党员管理','url':'./dygl'},
				{ image: '../../static/img/shzz.png', text: '党组织' ,'url':'./dzz'},
				{ image: '../../static/img/rctd.png', text: '人才天地' ,'url':'./rctd'},
				{ image: '../../static/img/sqlt.png', text: '党建论坛','url':'../djForum/djForum' }
			]
		};
	},
	computed: mapState(['userName', 'userInfo']),
	methods: {
		getBannerList() {
			// 获取轮播图路径
			let url = this.$api.select + '/zhdj/select/srvzhsq_djhdjl_djhd_select';
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
				let picUrlList = [];
				res.data.data.map(item => {
					picUrlList.push(item.lbt);
				});
				console.log('picUrlList:', picUrlList);
				picUrlList.map(item => {
					let path = this.$api.select + '/file/download?filePath=';
					let url = this.$api.select + '/file/select/srvfile_attachment_select';
					let req = {
						colNames: ['*'],
						condition: [
							{
								colName: 'file_no',
								ruleType: 'eq',
								value: item
							}
						],
						order: null,
						page: null,
						serviceName: 'srvfile_attachment_select'
					};
					this.$http.post(url, req).then(res => {
						// console.log('res2:', res);
						// res.data.data.map(item => {
						// 	picUrlList.push(path + item.fileurl)
						// })
						this.picUrlList.push(path + res.data.data[0].fileurl);
					});
					console.log('this.picUrlList::', this.picUrlList);
				});
			});
		},
		onGridItem(e) {
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
	},
	mounted() {
		uni.setNavigationBarTitle({
			title: '智慧党建'
		});
	},
	onLoad() {
		this.getBannerList();
	}
};
</script>

<style lang="scss" scoped>
.content {
	background-color: #fff;
}
.hello {
	display: flex;
	flex: 1;
	flex-direction: column;
}

.title {
	color: #8f8f94;
	margin-top: 50upx;
}

.ul {
	font-size: 30upx;
	color: #8f8f94;
	margin-top: 50upx;
}

.ul > view {
	line-height: 50upx;
}

swiper-item {
	.swiper-item {
		position: relative;
		height: 100%;
		image {
			height: 100%;
			width: 100%;
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
