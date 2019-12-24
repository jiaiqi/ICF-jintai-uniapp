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
        <view class="title_left">社区论坛</view>
        <view class="title_right" @tap="toAdd(selectList[1])"><button class="title_btn">发帖</button></view>
      </view>
      <view class="loadAnimation" v-if="selectList[1].resDatas.length <= 1 && showAnimation">
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
      </view>
      <transition name="slide-fade">
        <view class="list_content" v-if="selectList[1].resDatas.length > 0">
          <view class="list_item" v-for="item in selectList[1].resDatas" :key="item.id" @tap="toForumDetail(item)">
            <view class="item_title">{{ item.note_title }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>
      </transition>
      <view class="list_bottom" v-if="selectList[1].resDatas.length >= 3">
        <image src="../../static/img/moreList.png" style="width: 40upx;height: 40upx;"></image>
        <view class="bottom_right" @tap="toMore('sqlt')">更多</view>
      </view>
    </view>
    <view class="px_list">
      <view class="list_title">
        <view class="title_left">社区献策</view>
        <view class="title_right" @tap="toAdd(selectList[2])"><button class="title_btn">献策</button></view>
      </view>
      <view class="loadAnimation" v-if="selectList[2].resDatas.length < 1 && showAnimation">
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
      </view>
      <transition name="slide-fade">
        <view class="" v-if="!showAnimation">
          <view class="list_content" v-if="selectList[2].resDatas.length >= 1">
            <view class="list_item" v-for="(item, index) in selectList[2].resDatas" :key="index" @tap="toDetail(item)">
              <text class="item_text">{{ item.opinion_title }}</text>
              <text class="item_date">{{ item.create_time.slice(0, 10) }}</text>
            </view>
          </view>
          <view class="no-data" v-if="!selectList[2].resDatas">暂无数据...</view>
            <view class="list_bottom" v-if="selectList[2].resDatas.length >= 4">
            <image src="../../static/img/moreList.png" style="width: 40upx;height: 40upx;"></image>
            <view class="bottom_right" @tap="toMore('sqxc')">更多</view>
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
      showAnimation: true,
      dotsStyles: {
        border: 'rgba(255,255,255,.7)',
        selectedBorder: 'rgba(255,255,255,.5)',
        backgroundColor: 'rgba(255,255,255,.5)',
        selectedBackgroundColor: 'rgba(255,255,255,.8)'
      },
      current: 0,
      selectList: [
        {
          serviceName: 'srvzhsq_djhdjl_djhd_select', // 党建活动查询
          title: '党建活动',
          appType: 'zhdj',
          pageType: 'add',
          resDatas: []
        },
        {
          serviceName: 'srvzhsq_forum_note_add', // 社区发帖列表
          selectServiceName:'srvzhsq_forum_note_select',
          title: '社区发帖',
          appType: 'sqfw',
          pageType: 'select',
          resDatas: []
        },
        {
          serviceName: 'srvzhsq_forum_opinion_add', // 社区献策
          selectServiceName:"srvzhsq_forum_opinion_select",
          addServiceName:'srvzhsq_forum_opinion_add',
          title: '社区献策',
          appType: 'sqfw',
          pageType: 'select',
          resDatas: []
        }
      ]
    };
  },
  methods: {
    toAdd(e) {
      if(e.serviceName==='srvzhsq_forum_note_add'){
        uni.navigateTo({
          url: './add?query='+encodeURIComponent(JSON.stringify(e))
        });
      }else if(e.serviceName==='srvzhsq_forum_opinion_add'){
        uni.navigateTo({
          url: '../normal/add/add?query='+encodeURIComponent(JSON.stringify(e))
        });
      }
    
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
    toForumDetail(item){
      console.log(JSON.stringify(item))
      uni.navigateTo({
        // url: 'detail?query=' + encodeURIComponent(JSON.stringify(item))
        url: 'detail?no=' + item.note_no
      });
    },
    toMore(to) {
      uni.navigateTo({
        url: '../normal/list/list?to=' + to
      });
    },
    getBannerList() {
      // 获取轮播图路径
      let url = this.$api.select + '/sqfw/select/srvzhsq_bmfw_infomation_select';
      let req = {};
      req.serviceName = 'srvzhsq_bmfw_infomation_select';
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req['page'] = {
        pageNo: 1,
        rownumber: 5
      };
      this.$http.post(url, req).then(res => {
        console.log(res);
        let picUrlList = [];
        res.data.data.map(item => {
          picUrlList.push(item.img);
        });
        console.log('picUrlList:', picUrlList);
        // picUrlList.map(item => {
        let path = this.$api.select + '/file/download?filePath=';
        let url = this.$api.select + '/file/select/srvfile_attachment_select';
        picUrlList.map((pic, i) => {
          let req = {
            colNames: ['*'],
            condition: [
              {
                colName: 'file_no',
                ruleType: 'eq',
                value: picUrlList[i]
              }
            ],
            order: null,
            page: null,
            serviceName: 'srvfile_attachment_select'
          };
          this.$http.post(url, req).then(res => {
            this.selectList[0].resDatas.push(path + res.data.data[0].fileurl);
            // res.data.data.map(item => {
            //   this.selectList[0].resDatas.push(path + item.fileurl);
            console.log(res.data.data[0].fileurl);
            // });
          });
        });
        // });
      });
    },
    // 查询论坛帖子列表
    getPxList() {
      let url = this.$api.select + '/' + this.selectList[1].appType + '/select/' + this.selectList[1].selectServiceName;
      let req = {};
      req.serviceName = this.selectList[1].selectServiceName;
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      // req.proc_data_type = 'myall';
      req['page'] = {
        pageNo: 1,
        rownumber: 4
      };
      this.$http.post(url, req).then(res => {
        this.selectList[1].resDatas = res.data.data;
        if (res.data.data) {
          this.showAnimation = false;
        }
        console.log(this.selectList[1].resDatas);
      });
    },
    // 查询社区献策列表
    getXdList() {
      let url = this.$api.select + '/' + this.selectList[2].appType + '/select/' + this.selectList[2].selectServiceName;
      let req = {};
      req.serviceName = this.selectList[2].selectServiceName;
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req.proc_data_type = 'myall';
      req['page'] = {
        pageNo: 1,
        rownumber: 4
      };
      this.$http.post(url, req).then(res => {
        if (res.data.data) {
          this.showAnimation = false;
        }
        this.selectList[2].resDatas = res.data.data;
      });
    }
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
.no-data {
  width: 100%;
  height: 100upx;
  display: flex;
  justify-content: center;
  align-items: center;
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
      font-size: 30upx;
      // font-family: '宋体';
      font-weight: 600;
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
        width: 75%;
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
