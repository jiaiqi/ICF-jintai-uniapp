<template>
	<view class="mine_wrap">
		<transition name="slide-fade">
		<uni-swipe-action v-if="listData.length > 0" class="cu-list">
		  <uni-swipe-action-item :options="options" @click="swipeOptionClick($event, item)" @change="swipeChange" v-for="(item, index) in listData" :key="index">
		    <view class="cont">
		      <view class="list_item" @tap="toForumDetail(item)">
		        <view class="item_title" v-if="item.note_title">{{ item.note_title }}</view>
		        <view class="item_title" v-if="item.bt">{{ item.bt }}</view>
		        <view class="item_title" v-if="item.pxbt">{{ item.pxbt }}</view>
		        <view class="item_title" v-if="item.title">{{ item.title }}</view>
		      </view>
		      <view class="data_time">
		        <view class="text-grey text-xs">{{ item.create_time.slice(0, 10) }}</view>
		        <view class="text-grey text-xs">{{ item.create_time.slice(10) }}</view>
		      </view>
		    </view>
		  </uni-swipe-action-item>
		</uni-swipe-action>
		</transition>
		<mix-load-more :status="loadMoreStatus" class="mix-load-more" @click.native="loadData('refresh')"></mix-load-more>
		<view class="kapian" v-if="nodata"><view class="" style="color: #BEBEBE;text-align: center;line-height: 60px;">暂无数据</view></view>
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';
	import uniIcons from '@/components/uni-icons/uni-icons.vue';
	export default {
		components: {
		  uniSwipeAction,
		  uniSwipeActionItem,
		  uniIcons
		},
		data(){
			return {
				listData:[],
				serviceName:'',
				currentPage: 1, //当前页
				rownumber: 10, //每页条数
				totalListItem: 0, //总条数
				query:{},
				nodata: false,
				loadMoreStatus: 1,
				options: [
				  //左滑选项
				  
				  {
				    text: '删除',
				    style: {
				      backgroundColor: '#dd524d'
				    }
				  },
				  {
				    text: '编辑',
				    style: {
				      backgroundColor: '#007aff'
				    }
				  },
				],
			}
		},
		onLoad(option) {
			this.serviceName = decodeURIComponent(option.serve)
			this.query = option
			
			this.loadData('refresh')
		},
		onShow(){
			this.loadData('refresh');
		},
		methods:{
			loadData(type) {
			  if (type === 'add') {
			    if (this.loadMoreStatus === 2) {
			      return;
			    }
			    this.loadMoreStatus = 1;
			  }
			  let dataList = this.listData;
			  setTimeout(() => {
			    if (type === 'add') {
			      this.currentPage += 1;
			      this.getMine(this.query).then(data => {
			        console.log(data);
			        if (data && data.length < 10) {
			          this.loadMoreStatus = 2;
			        } else if (!data) {
			          this.loadMoreStatus = 2;
			        } else {
			          this.loadMoreStatus = 0;
			        }
			        if (data && data.length > 0) {
			          // this.loadMoreStatus = 0;
			          this.listData = this.listData.concat(data);
			        }
			      });
			    } else if (type === 'refresh') {
			      this.loadMoreStatus = 1;
			      this.listData = [];
			      this.currentPage = 1;
			      this.getMine(this.query).then(data => {
			        if (data && data.length < 10) {
			          this.loadMoreStatus = 2;
			        } else if (!data) {
			          this.loadMoreStatus = 2;
			        } else {
			          this.loadMoreStatus = 0;
			        }
			        if (data && data.length > 0) {
			          this.listData = this.listData.concat(data);
			        }
			      });
			      uni.stopPullDownRefresh();
			    }
			  }, 1000);
			},
			//下拉刷新
			onPullDownRefresh() {
			  this.loadData('refresh');
			},
			onReachBottom() {
			  //上滑加载
			  this.loadData('add');
			},
			swipeChange(open) {
			},
			async getMine(option){
				// let query = this.query
				console.log(option)
				let user_no = uni.getStorageSync('userInfo').user_no
				let url = this.$api.select + '/' + option.app + '/select/' + option.serve
				let req = {
					serviceName: option.serve,
					colNames: ['*'],
					condition: [{colName:'create_user',ruleType:'eq',value:user_no}],
					page: { pageNo: this.currentPage, rownumber: this.rownumber },
					order: [{ colName: 'create_time', orderType: 'desc' }]
				}
				let res = await this.$http.post(url, req);
				if (res.data.data && res.data.data.length > 0) {
				  if (res.data.page) {
				    let page = res.data.page;
				    this.totalListItem = page.total;
				  }
				  return res.data.data;
				} else if (res.data.data.length == 0 && this.listData.length == 0) {
				  this.nodata = true;
				}
				this.listData = res.data.data
				console.log('点击我的查询数据',res.data.data)
			},
			toForumDetail(item) {
			  // console.log(item.ftno);
			  let no = '';
			  if (item.note_no) {
			    no = item.note_no;
			  } else if (item.ftno) {
			    no = item.ftno;
			  } else if (item.ssp_no) {
			    no = item.ssp_no;
			  }
			  uni.navigateTo({
			    url: '/pages/forum/detail?no=' + no
			  });
			},
			swipeOptionClick(e, item) {
			  //点击左滑选项
			  console.log('当前点击的是第' + e.index + '个按钮，点击内容是' + e.content.text);
			  if (e.content.text === '删除') {
			    this.deleteItem(item);
			  }else if(e.content.text ==='编辑'){
				  this.toUpdate(item)
			  }
			},
			/** 点击编辑跳转*/
			toUpdate(row){
				let query = this.query
				let serviceName = null
				console.log('-------',query)
				if(query.app == 'sqfw'){
					serviceName = 'srvzhsq_forum_note_my_select'
				}
				// let initServe = this.serviceName
				// let initServeArr = initServe.split('_')
				// initServeArr[initServeArr.length - 1] = 'update'
				// let serviceName = initServeArr.join('_')
				console.log('serviceName====>',serviceName)
				let params = {
				  "type": "update",
				  "condition": [{
				    "colName": "id",
				    "ruleType": "in",
				    "value": row.id
				  }],
				  "serviceName": serviceName,
				  "defaultVal": null,
				  "app":query.app
				}
				console.log("点击了【有效】的公共编辑按钮", row)
				uni.navigateTo({
				  url: "../normal/update/update?params=" + JSON.stringify(params)
				})
			},
			deleteItem(item) {
			  uni.showModal({
			    title: '提示',
			    content: '确定删除?',
			    success: res => {
			      console.log(item, this.query);
			      if (res.confirm) {
			        this.toDeleteItem(item).then(res => {
			          console.log(res);
			          if (res.resultCode === 'SUCCESS') {
			            uni.showToast({
			              title: '删除成功',
			              icon: 'success',
			              duration: 2000
			            });
			            this.loadData('refresh');
			          } else {
			            uni.showToast({
			              title: res.resultMessage,
			              duration: 2000
			            });
			          }
			        });
			      } else if (res.cancel) {
			        uni.showToast({
			          title: '您点击了取消',
			          icon: 'none'
			        });
			      }
			    }
			  });
			},
			async toDeleteItem(e) {
			  let query = this.query;
			  let serviceName = '';
			  if (query.serve.includes('select')) {
			    serviceName = query.serve.replace('select', 'delete');
			  } else if (query.serve.includes('add')) {
			    serviceName = query.serve.replace('add', 'delete');
			  } else if (query.serve.includes('update')) {
			    serviceName = query.serve.replace('update', 'delete');
			  }
			  let url = this.$api.select + '/' + query.app + '/operate/' + serviceName;
			  let req = [{ serviceName: serviceName, condition: [{ colName: 'id', ruleType: 'in', value: e.id }] }];
			  let res = await this.$http.post(url, req);
			  if (res.data) {
			    return res.data;
			  } else {
			    uni.showToast({
			      title: '操作失败！',
			      duration: 1000
			    });
			  }
			}
		}
	}
</script>

<style lang="scss">
	
	.mine_wrap{
		width: 100%;
		  height: 100%;
		  padding-top: 20upx;
		  position: relative;
		  display: flex;
		  flex-direction: column;
	}
	.cont {
	  width: 100%;
	  display: flex;
	  height: 120upx;
	  align-items: center;
	  border-bottom: 1px solid #efefef;
	}
	.list_item {
	  flex: 1;
	  max-width: 75%;
	  display: flex;
	  .item_title {
	    text-indent: 1rem;
	    font-weight: 600;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    line-height: 60upx;
	  }
	}
	.uni-swipe {
	  overflow: hidden;
	  border-radius: 10upx;
	  margin: 0 20upx 20upx;
	}
	.slide-fade-enter-active {
	  transition: all 2s ease;
	}
	.slide-fade-leave-active {
	  transition: all 2s cubic-bezier(1, 0.5, 0.8, 1);
	}
	.slide-fade-enter
	/* .slide-fade-leave-active for below version 2.1.8 */ {
	  // transform: translateY(-1000px);
	  opacity: 0;
	}
	.slide-fade-leave-to {
	  transform: translateX(1000px);
	  opacity: 0;
	}
</style>
