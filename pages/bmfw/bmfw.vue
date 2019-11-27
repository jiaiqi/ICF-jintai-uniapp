<template>
  <view class="pages_bmfw">
    <div class="news_list">
      <div class="news_title">便民信息</div>
      <div class="list_item" v-for="(item, index) in newsList" :key="index" @click="toDetail(item)">
        <text class="item_title">{{ item.title }}</text>
        <text class="item_date">{{ item.create_time.slice(0, 10) }}</text>
      </div>
      <div class="to_more">
        <image src="../../static/img/moreList.png" style="width: 40upx;height: 40upx;"></image>
        <text class="text" @click="toMore('bmxx')" v-if="newsList.length>=5">更多</text></div>
    </div>
    <div class="news_list">
      <div class="news_title">人口管理</div>
      <div class="model_box">
        <div class="function_model" @click="toSelectPage(0)">常住信息查询</div>
        <div class="function_model" @click="toSelectPage(1)">暂住信息查询</div>
        <!-- <div class="function_model" @click="toAdd(selectList[0],0)">常住人口登记</div> -->
        <!-- <div class="function_model" @click="toAdd(selectList[1],1)">暂住人口登记</div> -->
      </div>
    </div>
    <div class="news_list">
      <div class="news_title">便民服务</div>
      <div class="model_box">
        <div class="function_model" @click="toNewPage('szcg')">数字城管</div>
        <div class="function_model" @click="toNewPage('ctxm')">创投项目</div>
      </div>
    </div>
  </view>
</template>

<script>
export default {
  // components:{uniList,uniListItem},
  data() {
    return {
      newsList: [] ,//便民信息
      selectList: [
      	{
      		serviceName: 'srvzhsq_bmfw_permit_select', // 常驻人口登记
      		title: '',
      		appType: 'sqfw',
      		pageType: 'add',
      		resDatas: []
      	},
      	{
      		serviceName: 'srvzhsq_bmfw_temppermit_select', // 暂住人口登记
      		title: '',
      		appType: 'sqfw',
      		pageType: 'add',
      		resDatas: []
      	},
        {
        	serviceName: 'srvzhsq_bmfw_permit_select', // 常驻信息查询
        	title: '常驻信息查询',
        	appType: 'sqfw',
        	pageType: 'list',
        	resDatas: []
        },{
      		serviceName: 'srvzhsq_bmfw_temppermit_select', // 暂住信息查询
      		title: '暂住信息查询',
      		appType: 'sqfw',
      		pageType: 'list',
      		resDatas: []
      	},
      ]
    };
  },
  methods: {
    getNewsList() {
      let url = this.$api.select + '/sqfw/select/srvzhsq_bmfw_infomation_select';
      let req = { serviceName: 'srvzhsq_bmfw_infomation_select', colNames: ['*'], condition: [], page: { pageNo: 1, rownumber: 5 }, order: [] };
      this.$http.post(url, req).then(res => {
        console.log('newsList', res.data.data);
        if (res.data.data) {
          this.newsList = res.data.data;
        }
      });
    },
    toDetail(item) {
      uni.navigateTo({
        url: '../normal/detail/detail?query=' + encodeURIComponent(JSON.stringify(item))
      });
    },
    toAdd(e,type) {
    	uni.navigateTo({
    		url: '../normal/add/add?query=' + encodeURIComponent(JSON.stringify(e))
    	});
    },
    toMore(to) {
    	uni.navigateTo({
    		url: '../normal/list/list?to=' + to
    	});
    },
    toSelectPage(target) {
      let url = ''
      if(target==0){
        url = './selectInfo/selectInfo?query='+ encodeURIComponent(JSON.stringify(this.selectList[2]))
      }else if(target==1){
        url = './selectInfo/selectInfo?query='+ encodeURIComponent(JSON.stringify(this.selectList[3]))
      }
      uni.navigateTo({
        url: url
      });
    },
    toNewPage(to){
      uni.navigateTo({
      	url: '../normal/list/list?to=' + to
      });
      // if(target==='szcg'){
      
      //   uni.navigateTo({
      //     url:'./ctxm/ctxm?title=数字城管&to=szcg'
      //   });
      // }else if(target === 'ctxm'){
      //   url:'./ctxm/ctxm?title=创投项目&to=ctxm'
      // }
    }
  },
  mounted() {
    this.getNewsList();
  }
};
</script>

<style lang="scss" scoped>
.pages_bmfw {
  display: flex;
  width: 100%;
  flex-direction: column;
  .news_list {
    width: 90%;
    margin: 0 auto;
    padding-top: 20upx;
    overflow: hidden;
    min-height: 300upx;
    &:first-child {
      min-height: 500upx;
    }
    // max-height: 350upx;
    .news_title {
      text-indent: 0.5rem;
      border-left: 5upx solid #e51c23;
      font-size: 30upx;
      font-weight: 600;
      margin: 20upx 0;
    }
    .list_item {
      width: 100%;
      text-indent: 0.5rem;
      border-bottom: 1px #f5f5f5 solid;
      padding-top: 8upx;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      &:hover,
      &:active {
        background-color: #f5f7fa;
      }
      .item_title {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 30upx;
        line-height: 50upx;
      }
      .item_date {
        font-size: 24upx;
        color: #999;
        line-height: 60upx;
      }
    }
    .to_more {
      display: flex;
      justify-content: flex-end;
      .text {
        font-size: 26upx;
        line-height: 40upx;
        font-weight: 600;
         color: #e51c23;
      }
    }
    .model_box {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      // flex-direction: column;
      margin-top: 10upx;
      .function_model {
        width: 48%;
        border-radius: 10upx;
        line-height: 150upx;
        font-size: 30upx;
        color: #fff;
        text-align: center;
        margin-top: 10upx;
        border-bottom: 1px solid #ebeef5;
        &:first-child {
          background-color: rgba($color: #e74c3c, $alpha: 1);
        }
        &:nth-child(2) {
          background-color: rgba($color: #3498db, $alpha: 1);
        }
        &:nth-child(3) {
          background-color: rgba($color: #1abc9c, $alpha: 1);
        }
        &:nth-child(4) {
          background-color: rgba($color: #F1C40F, $alpha: 1);
        }
      }
    }
  }
}
</style>
