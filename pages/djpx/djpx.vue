<template>
	<view class="content">
		<uni-swiper-dot :info="selectList[0].resDatas" :current="current" field="content" mode="long" :dotsStyles="dotsStyles">
			<swiper class="swiper-box" @change="change" :autoplay="true" style="height: 470upx;">
				<swiper-item v-for="(item, index) in selectList[0].resDatas" :key="index">
					<view class="swiper-item"><image :src="item" mode="aspectFill" style="width: 100%;height: 470upx;"></image></view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<view class="px_list">
			<view class="list_title">
				<view class="title_left">培训安排</view>
				<view class="title_right" @tap="toAdd(selectList[1])"><button class="title_btn">安排</button></view>
			</view>
			<view class="loadAnimation" v-if="selectList[1].resDatas.length <= 1">
				<view class="loadAnimItem"><view class="loadAnimContent"></view></view>
				<view class="loadAnimItem"><view class="loadAnimContent"></view></view>
				<view class="loadAnimItem"><view class="loadAnimContent"></view></view>
				<view class="loadAnimItem"><view class="loadAnimContent"></view></view>
			</view>
			<transition name="slide-fade">
				<view class="list_content" v-if="selectList[1].resDatas.length > 0">
					<view class="list_item" v-for="item in selectList[1].resDatas" :key="item.pxno" @tap="toDetail(item)">
						<view class="item_title">{{ item.pxbt }}</view>
						<view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
					</view>
				</view>
			</transition>
			<view class="list_bottom" v-if="selectList[1].resDatas.length >= 4">
				<image src="../../static/img/moreList.png" style="width: 40upx;height: 40upx;"></image>
				<view class="bottom_right" @tap="toMore('pxap')">更多</view>
			</view>
		</view>
		<view class="px_list">
			<view class="list_title"> 
				<view class="title_left">学习心得</view>
				<!-- <view class="title_right"><button class="title_btn">发表</button></view> -->
			</view>
			<view class="loadAnimation" v-if="selectList[2].resDatas.length < 1">
				<view class="loadAnimItem"><view class="loadAnimContent"></view></view>
				<view class="loadAnimItem"><view class="loadAnimContent"></view></view>
				<view class="loadAnimItem"><view class="loadAnimContent"></view></view>
				<view class="loadAnimItem"><view class="loadAnimContent"></view></view>
			</view>
			<transition name="slide-fade">
				<view class="" v-if="selectList[2].resDatas.length >= 1">
					<view class="list_content">
						<!-- <transition-group name="list"> -->
						<view class="list_item" v-for="(item, index) in selectList[2].resDatas" :key="index" @tap="toDetail(item)">
							<text class="item_text">{{ item.pxbt }}</text>
							<text class="item_date">{{ item.create_time.slice(0, 10) }}</text>
						</view>
						<!-- </transition-group> -->
					</view>
					<view class="list_bottom" v-if="selectList[2].resDatas.length > 4">
						<image src="../../static/img/moreList.png" style="width: 40upx;height: 40upx;"></image>
						<view class="bottom_right" @tap="toMore('xxxd')">更多</view>
					</view>
				</view>
			</transition>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { uniSwiperDot } from '@dcloudio/uni-ui';
export default {
	components: { uniSwiperDot },
	data() {
		return {
			picUrlList: [],
			mode: 'long',
			dotsStyles: {
				border: 'rgba(255,255,255,.7)',
				selectedBorder: 'rgba(255,255,255,.5)',
				backgroundColor: 'rgba(255,255,255,.5)',
				selectedBackgroundColor: 'rgba(255,255,255,.8)'
			},
			current:0,
			selectList: [
				{
					serviceName: 'srvzhsq_djhdjl_djhd_select', // 党建活动查询
					title: '',
					appType: 'zhdj',
					pageType: 'add',
					resDatas: []
				},
				{
					serviceName: 'srvzhsq_pxap_select', // 党建培训查询
					title: '',
					appType: 'zhdj',
					pageType: 'add',
					resDatas: []
				},
				{
					serviceName: 'srvzhsq_xxxd_select', // 学习心得查询
					title: '',
					appType: 'zhdj',
					pageType: 'add',
					resDatas: []
				}
			]
		};
	},
	methods: {
		toAdd(e) {
			uni.navigateTo({
				url: '../normal/add/add?query=' + encodeURIComponent(JSON.stringify(e))
			});
		},
		change(e) {
			// console.log(e)
      this.current = e.detail.current;
		},
		toDetail(item) {
			uni.navigateTo({
				url: '../normal/detail/detail?query=' + encodeURIComponent(JSON.stringify(item))
			});
		},
		toMore(to) {
			uni.navigateTo({
				url: '../normal/list/list?to=' + to
			});
		},
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
				console.log(res);
				let picUrlList = [];
				res.data.data.map(item => {
					picUrlList.push(item.lbt);
				});
				console.log('picUrlList:', picUrlList);
				// picUrlList.map(item => {
				let path = this.$api.select + '/file/download?filePath=';
				let url = this.$api.select + '/file/select/srvfile_attachment_select';
				let req = {
					colNames: ['*'],
					condition: [
						{
							colName: 'file_no',
							ruleType: 'eq',
							value: picUrlList[0]
						}
					],
					order: null,
					page: null,
					serviceName: 'srvfile_attachment_select'
				};
				this.$http.post(url, req).then(res => {
					res.data.data.map(item => {
						// this.picUrlList.push(path + item.fileurl);
						this.selectList[0].resDatas.push(path + item.fileurl);
					});
          
				});
				console.log('this.picUrlList::', this.picUrlList);
				// });
			});
		},
		// 查询培训安排列表
		getPxList() {
			let url = this.$api.select + '/' + this.selectList[1].appType + '/select/' + this.selectList[1].serviceName;
			let req = {};
			req.serviceName = this.selectList[1].serviceName;
			req.colNames = ['*'];
			req.condition = [];
			req.order = [];
			req['page'] = {
				pageNo: 1,
				rownumber: 4
			};
			this.$http.post(url, req).then(res => {
				this.selectList[1].resDatas = res.data.data;
        console.log(this.selectList[1].resDatas)
			});
		},
		getXdList() {
			let url = this.$api.select + '/' + this.selectList[2].appType + '/select/' + this.selectList[2].serviceName;
			let req = {};
			req.serviceName =  this.selectList[2].serviceName;
			req.colNames = ['*'];
			req.condition = [];
			req.order = [];
			req['page'] = {
				pageNo: 1,
				rownumber: 4
			};
			this.$http.post(url, req).then(res => {
				this.selectList[2].resDatas = res.data.data;
			});
		},
    
	},
	onLoad() {
		this.getBannerList();
		this.getPxList();
		this.getXdList();
	}
};
</script>

<style lang="scss" scoped>
.content {
	// background-color: #fff;
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
.px_list {
	flex: 1;
	background-color: #fff;
	box-sizing: border-box;
	padding-top: 30upx;
	padding-bottom: 50upx;
	display: flex;
	flex-direction: column;
	font-size: 30upx;
	border-radius: 10upx;
	width: 98%;
	margin: 20upx auto 10upx;
	// border: 1px solid #999;
	// min-height: 455upx;
	.list_title {
		width: 90%;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	.title_left {
	 text-indent: 0.5rem;
	 border-left: 5upx solid #e51c23;
	 font-size: 30upx;
	 font-weight: 600;
	 margin: 20upx 0;
	}
	.title_right{
	  margin: 20upx 0;
	}
		.title_btn {
			width: 120upx;
			height: 50upx;
			line-height: 50upx;
			margin: 0;
			background-color: #e54d42;
			color: #ffffff;
			font-size: 30upx;
		}
	}
	.list_content {
		width: 90%;
		margin: 0 auto;
		padding-top: 20upx;
		overflow: hidden;
		min-height: 140upx;
		max-height: 300upx;
		.list_item {
			width: 100%;
			border-bottom: 1px #f5f5f5 solid;
			padding-top: 8upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.item_title {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				line-height: 60upx;
			}
			.item_date {
				font-size: 12px;
				color: #999;
				line-height: 60upx;
			}
		}
	}
	.list_bottom {
		display: flex;
		justify-content: flex-end;
		width: 90%;
		height: 60upx;
		align-items: center;
		margin: 0 auto;
		.bottom_right {
			color: #e51c23;
			font-size: 14px;
			line-height: 40upx;
		}
	}
}

.loadAnimation {
	width: 90%;
	margin: 0 auto;
	padding-top: 20upx;
	overflow: hidden;
	min-height: 140upx;
	max-height: 280upx;
	.loadAnimItem {
		width: 100%;
		display: flex;
		padding-top: 8upx;
		border-bottom: 1px #f5f5f5 solid;
		align-items: center;
		height: 60upx;
		.loadAnimContent {
			box-sizing: border-box;
			margin: 10upx 0;
			width: 100%;
			height: 40upx;
			background-color: rgba(150, 150, 150, 0.1);
			height: 40upx;
		}
	}
	.loadAnimItem:nth-child(1) .loadAnimContent {
		animation: loading 4s linear 0s infinite;
	}
	.loadAnimItem:nth-child(2) .loadAnimContent {
		animation: loading 3s linear 0s infinite;
	}
	.loadAnimItem:nth-child(3) .loadAnimContent {
		animation: loading 4s linear 0s infinite;
	}
	.loadAnimItem:nth-child(4) .loadAnimContent {
		animation: loading 3s linear 0s infinite;
	}
}
@keyframes loading {
	0% {
		width: 0%;
	}
	50% {
		width: 100%;
	}
	100% {
		width: 0%;
	}
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
	transition: all 1s ease;
}
.slide-fade-leave-active {
	transition: all 2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
	transform: translateX(100px);
	opacity: 0;
}

.list-enter-active,
.list-leave-active {
	transition: all 3s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
	opacity: 0;
	transform: translateY(100px);
}
</style>
