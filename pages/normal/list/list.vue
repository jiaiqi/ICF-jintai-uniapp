<template>
  <view class="content">
    <view class="px_list">
      <view class="list_title">
        <view class="title_left">{{ title }}</view>
        <!-- <view class="title_right" @tap="toAdd"><button class="title_btn">添加</button></view> -->
      </view>
      <view class="loadAnimation" v-if="listData.length < 1">
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
        <view class="loadAnimItem"><view class="loadAnimContent"></view></view>
      </view>
      <transition name="slide-fade">
        <view class="list_content" v-if="listData.length > 0 &&(title=='党建培训'||title=='学习心得')">
          <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="toDetail(item)">
            <view class="item_title" v-if="item.pxbt">{{ item.pxbt }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>
        <view class="list_content" v-if="listData.length > 0&&(title=='便民信息'||title=='数字城管')" >
          <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="toDetail(item)">
            <view class="item_title" v-if="item.title">{{ item.title }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>
        <view class="list_content" v-if="listData.length > 0&&title=='创投项目'" >
          <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="toDetail(item)">
            <view class="item_title" v-if="item.xmxx_name">{{ item.xmxx_name }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>
        <view class="list_content" v-if="listData.length > 0&&title=='社区论坛'" >
          <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="toDetail(item)">
            <view class="item_title" v-if="item.note_title">{{ item.note_title }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>
      </transition>
      <view>{{ loadText }}</view>
      <view class="list_bottom">
        <button class="btn" @click="previousPage()" :disabled="currentPage <= 1">上一页</button>
        <button class="btn" @click="nextPage()">下一页</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      currentPage: 1,
      title: '',
      loadText: '',
      selectList: [
        {
          serviceName: 'srvzhsq_pxap_select', // 党建培训查询
          title: '党建培训',
          appType: 'zhdj',
          pageType: 'add',
          resDatas: []
        },
        {
          serviceName: 'srvzhsq_xxxd_select', // 学习心得查询
          title: '学习心得',
          appType: 'zhdj',
          pageType: 'add',
          resDatas: []
        },
        {
          serviceName: 'srvzhsq_bmfw_infomation_select', // 便民信息查询
          title: '便民信息',
          appType: 'sqfw',
          pageType: 'select',
          resDatas: []
        }
      ],
      listData: []
    };
  },
  methods: {
    toAdd(e) {
      uni.navigateTo({
        url: '../add/add?serviceName=srvzhsq_pxap_select&pageType=add&api=zhdj'
      });
    },
    getPxList() {
      let self = this;
      let url = this.$api.select + '/' + this.selectList[0].appType + '/select/' + this.selectList[0].serviceName;
      let req = {};
      req.serviceName = this.selectList[0].serviceName;
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req['page'] = {
        pageNo: this.currentPage,
        rownumber: 14
      };
      this.$http.post(url, req).then(res => {
        if (res.data.data.length > 0) {
          self.selectList[0].resDatas = res.data.data;
          self.listData = res.data.data;
        } else if (res.data.data < req.page.rownumber) {
          this.loadText = '所有数据加载完毕';
        }
      });
    },
    getXdList(no) {
      let self = this;
      let url = this.$api.select + '/' + this.selectList[1].appType + '/select/' + this.selectList[1].serviceName;
      let req = {};
      req.serviceName = this.selectList[1].serviceName;
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req['page'] = {
        pageNo: this.currentPage,
        rownumber: 10
      };
      this.$http.post(url, req).then(res => {
        if (res.data.data.length > 0) {
          self.selectList[1].resDatas = res.data.data;
          self.listData = res.data.data;
        } else {
          return;
        }
      });
    },
    getBmList(serviceName) {
      // 获取便民信息列表
      let url = this.$api.select + '/' + 'sqfw' + '/select/' + serviceName;
      let req = { serviceName:serviceName, colNames: ['*'], condition: [], page: { pageNo: this.currentPage, rownumber: 10 }, order: [] };
      if(serviceName === 'srvzhsq_bmfw_ssp_select'){
        req.proc_data_type = 'myall';
      }
      this.$http.post(url, req).then(res => {
        if (res.data.data.length > 0) {
          // self.selectList[2].resDatas = res.data.data;
          this.listData = res.data.data;
          console.log( this.listData)
        } else {
          return;
        }
      });
    },
    toDetail(item) {
      uni.navigateTo({
        url: '../detail/detail?query=' + encodeURIComponent(JSON.stringify(item))
      });
    },
    nextPage() {
      this.currentPage++;
      if (this.title === '学习心得') {
        this.getXdList();
      } else if (this.title === '培训安排') {
        this.getPxList();
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        if (this.title === '学习心得') {
          this.getXdList();
        } else if (this.title === '培训安排') {
          this.getPxList();
        }else if(this.title === '便民信息'){
          this.getBmList('srvzhsq_bmfw_infomation_select')
        }
      }
    }
  },
  onLoad(options) {
    console.log(options);
    if (options.to == 'xxxd') {
      this.getXdList();
      this.title = '学习心得';
    } else if (options.to === 'pxap') {
      this.getPxList();
      this.title = '培训安排';
    }else if (options.to === 'bmxx') {
      this.getBmList('srvzhsq_bmfw_infomation_select');
      this.title = '便民信息';
    }else if (options.to === 'ctxm') { // 创投项目
      this.getBmList('srvzhsq_bmfw_xmxx_select');
      this.title = '创投项目';
    }else if (options.to === 'szcg') { // 数字城管
      this.getBmList('srvzhsq_bmfw_ssp_select');
      this.title = '数字城管';
    }else if (options.to === 'sqlt') { // 社区论坛
      this.getBmList('srvzhsq_forum_note_select');
      this.title = '社区论坛';
    }
    uni.setNavigationBarTitle({
    	title: this.title
    });
    
  }
};
</script>

<style lang="scss" scoped>
.px_list {
  // flex: 1;
  background-color: #fff;
  box-sizing: border-box;
  padding-top: 30upx;
  display: flex;
  flex-direction: column;
  font-size: 30upx;
  border-radius: 10upx;
  width: 98%;
  margin: auto;
  height: 1200upx;
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
    flex: 1;
    width: 90%;
    margin: 0 auto;
    padding-top: 20upx;
    overflow: hidden;
    min-height: 140upx;
    // max-height: 300upx;
    .list_item {
      width: 100%;
      border-bottom: 1px #f5f5f5 solid;
      padding-top: 8upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item_title {
        max-width: 70%;
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
    height: 100upx;
    align-items: center;
    margin: 0 auto;
    .btn {
      color: #e51c23;
      font-size: 14px;
      line-height: 60upx;
      height: 60upx;
    }
  }
}

.loadAnimation {
  width: 90%;
  margin: 0 auto;
  padding-top: 20upx;
  overflow: hidden;
  min-height: 140upx;
  // max-height: 280upx;
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
  .loadAnimItem:nth-child(n) .loadAnimContent {
    animation: loading 4s linear 0s infinite;
  }
  .loadAnimItem:nth-child(2n) .loadAnimContent {
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
