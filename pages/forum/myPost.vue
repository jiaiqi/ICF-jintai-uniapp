<template>
  <view class="content">
    <!-- 
			* 下拉刷新和加载更多组件使用示例
			* 下拉刷新组件仅支持h5和小程序端，app端受限制目前没想到好的实现。
		-->
    <!--
			* 下拉刷新组件
			* @property {Number} top 距离顶部的距离
			* @event {Function} onPulldownReresh 刷新时调用的方法
			* @event {Function} setEnableScroll 设置组件内scroll-view是否允许滚动
		-->
    <view class="tabs">
      <view class="tab" @click="ckeckTabs(1)" :class="{ 'tab-active': activeTab == 0 }"><text>党建论坛</text></view>
      <view class="tab" @click="ckeckTabs(1)" :class="{ 'tab-active': activeTab == 1 }"><text>社区论坛</text></view>
    </view>
    <mix-pulldown-refresh ref="mixPulldownRefresh" :top="0" @refresh="onPulldownReresh">
      <view class="scroll-wrapper">
        <view class="list_item" v-for="(item, i) in postData" :key="i">
          <view class="item_title" v-if="item.bt" @tap="toDetail(item)">{{ item.bt }}</view>
          <view class="item_title" v-if="item.note_title" @tap="toDetail(item)">{{ item.note_title }}</view>
          <view class="item_date" @tap="toDetail(item)">{{ item.create_time.slice(0, 10) }}</view>
          <view class="delete_item" @click="deleteItem(item)"><uni-icons type="trash" size="30" color="white"></uni-icons></view>
        </view>
        <!-- <view class="list-item" v-for="item in list" :key="item">列表项 {{ item }}</view> -->

        <!--
					* 上滑加载更多组件
					* @property {Number} status = [0|1|2] 0加载前，1加载中，2没有更多了
				-->
        <mix-load-more :status="loadMoreStatus"></mix-load-more>
        <!-- <uni-load-more :status="loadMoreStatus"></uni-load-more> -->
      </view>
    </mix-pulldown-refresh>
    <!--   <view class="toTop" @click="toTop" v-if="postData.length > 8">
      <span>回到</span>
      <span>顶部</span>
    </view> -->
  </view>
</template>

<script>
import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
import mixLoadMore from '@/components/mix-load-more/mix-load-more';
import uniIcons from '@/components/uni-icons/uni-icons.vue';
export default {
  components: {
    mixPulldownRefresh,
    mixLoadMore,
    uniIcons
  },
  data() {
    return {
      list: [],
      postData: [], // 当前Tab页帖子列表
      reqaData: [], //党建论坛帖子列表
      reqbData: [], //社区论坛帖子列表
      loadMoreStatus: 0,
      userInfo: {},
      requestUrl: '',
      activeTab: 0, // 0-党建论坛，1-社区论坛
      pageInfoa: {
        pageNo: 1, //当前页
        rownumber: 10, // 每页条数
        total: 0 // 总条数
      },
      pageInfob: {
        pageNo: 1, //当前页
        rownumber: 10, // 每页条数
        total: 0 // 总条数
      }
    };
  },
  onLoad() {
    uni.setNavigationBarTitle({
      title: '帖子管理'
    });
    this.userInfo = uni.getStorageSync('userInfo');
    this.loadData('refresh');
  },

  onReachBottom() {
    //上滑加载
    this.loadData('add');
  },
  methods: {
    ckeckTabs(num) {
      this.activeTab = num;
      this.loadData('refresh');
    },
    toDetail(item) {
      console.log(item, 'item');
      let url = '';
      if (item.note_no) {
        url = './detail?no=' + item.note_no;
      } else if (item.ftno) {
        url = '../djForum/detail?no=' + item.ftno;
      }
      uni.navigateTo({
        url: url
      });
    },
    deleteItem(item) {
      uni.showModal({
        title: '警告！',
        content: '确认是否删除此条帖子',
        success: res => {
          if (res.confirm) {
            uni.showToast({
              title: '即将删除本条帖子'
            });
            let url = '';
            let req = {};
            if (item.note_no) {
              url = this.$api.select + '/sqfw/operate/srvzhsq_forum_note_delete';
              req = [{ serviceName: 'srvzhsq_forum_note_delete', condition: [{ colName: 'id', ruleType: 'in', value: item.id }] }];
            } else if (item.ftno) {
              url = this.$api.select + '/sqfw/operate/srvzhsq_djlt_ftxx_delete';
              req = [{ serviceName: 'srvzhsq_djlt_ftxx_delete', condition: [{ colName: 'id', ruleType: 'in', value: item.id }] }];
            }
            this.$http.post(url, req).then(res => {
              if (res.data.resultCode === 'SUCCESS') {
                uni.showToast({
                  title: '删除成功',
                  icon: 'none',
                  duration: 1000
                });
                this.loadData('refresh');
              }
            });
          } else if (res.cancel) {
            uni.showToast({
              title: '您点击了取消'
            });
          }
        }
      });
      // console.log(item,'item')
    },
    loadData(type) {
      uni.showToast({
        title: '加载中',
        icon: 'loading'
      });
      if (type === 'add') {
        this.loadMoreStatus = 1;
      }
      let postData = [];
      setTimeout(() => {
        if (type === 'refresh') {
          console.log('refresh');
          this.list = [];
          this.postData = [];
          if (this.activeTab === 0) {
            this.pageInfoa.pageNo = 1;
          } else {
            this.pageInfob.pageNo = 1;
          }
          this.getForumPosts().then(res => {
            postData = res;
            this.postData = this.postData.concat(postData);
          });
        } else if (type === 'add') {
          console.log('add');
          if (this.activeTab === 0) {
            this.pageInfoa.pageNo += 1;
          } else {
            this.pageInfob.pageNo += 1;
          }
          this.getForumPosts().then(res => {
            postData = res;
            this.postData = this.postData.concat(postData);
          });
        }
        if (type === 'add') {
          this.loadMoreStatus = 0;
        }
        if (type === 'refresh') {
          this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
        }
      }, 1000);
    },
    //下拉刷新
    onPulldownReresh() {
      this.loadData('refresh');
    },
    toTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    },
    //获取帖子数据
    async getForumPosts() {
      let userInfo = this.userInfo;
      let pageInfo = {};
      let url = '';
      let serviceName = '';
      if (this.activeTab === 0) {
        url = this.$api.select + '/zhdj/select/srvzhsq_djlt_ftxx_select'; //党建论坛
        serviceName = 'srvzhsq_djlt_ftxx_select';
        pageInfo = this.pageInfoa;
      } else {
        url = this.$api.select + '/sqfw/select/srvzhsq_forum_note_select'; //社区论坛
        serviceName = 'srvzhsq_forum_note_select';
        pageInfo = this.pageInfob;
      }
      let req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [{ colName: 'create_user', ruleType: 'like', value: userInfo.user_no }],
        page: { pageNo: pageInfo.pageNo, rownumber: pageInfo.rownumber },
        order: [{ colName: 'create_time', orderType: 'desc' }]
      };
      let res = await this.$http.post(url, req);
      let postData = [];
      if (res.data.data) {
        postData = res.data.data;
      }
      if (res.data.page) {
        let page = res.data.page;
        console.log(parseInt(page.total / page.rownumber));
        if (parseInt(page.total / page.rownumber) <= page.pageNo) {
          this.loadMoreStatus = 2;
        } else {
          this.loadMoreStatus = 0;
        }
        if (this.activeTab === 0) {
          this.pageInfoa = res.data.page;
          this.reqaData = postData;
        } else {
          this.pageInfob = res.data.page;
          this.reqbData = postData;
        }
      }
      return postData;
      console.log('postData:', postData);
    }
  }
};
</script>

<style lang="scss">
/* 顶部tabbar */
.nav-bar {
  position: relative;
  z-index: 10;
  height: 90upx;
  white-space: nowrap;
  box-shadow: 0 2upx 8upx rgba(0, 0, 0, 0.06);
  background-color: #fff;
  .nav-item {
    display: inline-block;
    width: 150upx;
    height: 90upx;
    text-align: center;
    line-height: 90upx;
    font-size: 30upx;
    color: #303133;
    position: relative;
    &:after {
      content: '';
      width: 0;
      height: 0;
      border-bottom: 4upx solid #007aff;
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      transition: 0.3s;
    }
  }
  .current {
    color: #007aff;
    &:after {
      width: 50%;
    }
  }
}

page,
.content {
  background-color: #f8f8f8;
  position: relative;
  overflow: scroll;
  .toTop {
    position: fixed;
    font-size: 20upx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    bottom: 100upx;
    right: 50upx;
    width: 100upx;
    height: 100upx;
    line-height: 1.2;
    background-color: #fff;
    border-radius: 100%;
    border: #eee 1px solid;
    z-index: 1000;
  }
  .tabs {
    // margin-top: 20upx;
    background-color: #fff;
    // position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    display: flex;
    .tab {
      flex: 1;
      height: 80upx;
      line-height: 80upx;
      font-weight: 600;
      text-align: center;
      border-bottom: 1px solid #eee;
      &:first-child {
        border-right: 1px solid #eee;
      }
    }
    .tab-active {
      box-sizing: border-box;
      // border-bottom: 10upx solid #E51C23;
      background-color: #e51c23;
      color: #fff;
    }
  }

  .scroll-wrapper {
    width: 100%;
    // margin: 0 auto;
    // overflow: scroll;
    min-height: 140upx;
    .list_item {
      // width: calc(100% - 20upx);
      background-color: #fff;
      // padding:0 5%;
      padding-left: 20upx;
      border-bottom: 1px #f5f5f5 solid;
      // padding-top: 8upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item_title {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 100upx;
      }
      .item_date {
        font-size: 12px;
        color: #999;
        line-height: 100upx;
        flex: 0.5;
        text-align: center;
      }
      .delete_item {
        height: 100upx;
        width: 100upx;
        text-align: center;
        background-color: rgba($color: #e51c23, $alpha: 0.8);
      }
    }
  }
}
</style>
