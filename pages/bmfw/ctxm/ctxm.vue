<template>
  <view class="content">
    <uni-swiper-dot :info="selectList[0].resDatas" :current="current" field="content" :mode="mode" :dotsStyles="dotsStyles">
      <swiper class="swiper-box" @change="change" :autoplay="true" style="height: 470upx;">
        <swiper-item v-for="(item, index) in selectList[0].resDatas" :key="index">
          <view class="swiper-item"><image :src="item" mode="aspectFill" style="width: 100%;height: 470upx;"></image></view>
        </swiper-item>
      </swiper>
    </uni-swiper-dot>
  </view>
</template>

<script>
import { uniSwiperDot } from '@dcloudio/uni-ui';
export default {
  components: { uniSwiperDot },
  data() {
    return {
      mode: 'long', //轮播图模式
      picUrlList: [],
      dotsStyles: {
        border: 'rgba(255,255,255,.7)',
        selectedBorder: 'rgba(255,255,255,.5)',
        backgroundColor: 'rgba(255,255,255,.5)',
        selectedBackgroundColor: 'rgba(255,255,255,.8)'
      },
      current: 0,
      selectList: [
        {
          serviceName: 'srvzhsq_bmfw_ssp_select', // 便民服务随手拍查询
          title: '',
          appType: 'sqfw',
          pageType: 'proclist',
          resDatas: []
        }
      ]
    };
  },
  methods: {
    getBannerList() {
      // 获取轮播图路径
      let url = this.$api.select + '/sqfw/select/srvzhsq_bmfw_ssp_select';
      let req = {};
      req.serviceName = 'srvzhsq_bmfw_ssp_select';
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req.proc_data_type = 'myall';
      req['page'] = {
        pageNo: 1,
        rownumber: 5
      };
      this.$http.post(url, req).then(res => {
        console.log(res);
        let picUrlList = [];
        res.data.data.map(item => {
          picUrlList.push(item.lbt);
        });
        console.log('picUrlList:', picUrlList);
        // picUrlList.map(item => {
        let path = 'http://39.98.203.134:8081/file/download?filePath=';
        let url = 'http://39.98.203.134:8081/file/select/srvfile_attachment_select';
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
    }
  },
  onLoad(option) {
    console.log(option)
    if(option.title){
      uni.setNavigationBarTitle({
          title:option.title
      });
    }
  }
};
</script>

<style lang="scss"></style>
