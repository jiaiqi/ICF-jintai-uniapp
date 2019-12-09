<template>
  <view class="detail_wrap">
    <view v-if="detail.xmxx_name">
      <!-- 创投项目 -->
      <view class="title">{{ detail.xmxx_name }}</view>
      <view class="subtitle">发布时间：{{ detail.create_time }}</view>
      <view class="little_title">
        项目类型：
        <text class="little_title_text">{{ detail.type }}</text>
      </view>
      <view class="little_title">
        项目地点：
        <text class="little_title_text">{{ detail.sxmxx_place }}</text>
      </view>
      <view class="little_title">
        所属行业：
        <text class="little_title_text">{{ detail.sxmxx_industry }}</text>
      </view>
      <view class="little_title">
        项目级别：
        <text class="little_title_text">{{ detail.sxmxx_grade }}</text>
      </view>
      <view class="little_title">
        项目投资：
        <text class="little_title_text">{{ detail.sxmxx_total }}</text>
      </view>
      <view class="little_title">
        项目领域：
        <text class="little_title_text">{{ detail.sxmxx_field }}</text>
      </view>
      <view>
        <view class="little_title">项目概况：</view>

        <view class="content" v-html="JSON.parse(JSON.stringify(detail.sxmxx_js).replace(/\<img/gi, '<img width=100% height=100% '))" v-if="detail.sxmxx_js"></view>
      </view>
    </view>
    <view >
      <!-- 数字城管 -->
      <view class="title" v-if="detail.title">{{ detail.title }}</view>
      <view class="title" v-if="detail.opinion_title">{{ detail.opinion_title }}</view>
      <view class="title" v-if="detail.note_title">{{ detail.note_title }}</view>
      <view class="subtitle">发布时间：{{ detail.create_time }}</view>
      <view class="content" ref="richText" id="richText"></view>
      <!--      <view class="content" v-html="JSON.parse(JSON.stringify(detail.pxjj).replace(/\<img/gi, '<img width=100% height=100% '))" v-if="detail.pxjj"></view>
      <view class="content" v-html="JSON.parse(JSON.stringify(detail.nr).replace(/\<img/gi, '<img width=100% height=100% '))" v-if="detail.nr"></view>
      <view class="content" v-html="JSON.parse(JSON.stringify(detail.content).replace(/\<img/gi, '<img width=100% height=100% '))" v-if="detail.content"></view> -->
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detail: {},
      richText: ''
    };
  },
  methods: {
    getRichText() {},
    getContent(detail) {
      if (detail.content) {
        this.richText = JSON.parse(JSON.stringify(detail.content).replace(/\<img/gi, '<img width=100% height=100% ').replace(/<p>/gi,' ').replace(/<\/p\>/gi,' '))
      }
      if (detail.pxjj) {
        // 党建培训
        this.richText = JSON.parse(JSON.stringify(detail.pxjj).replace(/\<img/gi, '<img width=100% height=100% '));
      }
      if (detail.nr) {
        this.richText = JSON.parse(JSON.stringify(detail.nr).replace(/\<img/gi, '<img width=100% height=100% '));
      }
      if (detail.content) {
        this.richText = JSON.parse(JSON.stringify(detail.content).replace(/\<img/gi, '<img width=100% height=100% '));
      }
      console.log(this.richText);
      document.getElementById('richText').innerHTML =  this.richText;
      // this.$refs.richText.innerHTML = this.richText;
    }
  },
  onLoad(options) {
    let query = JSON.parse(options.query);
    console.log(query);
    this.detail = query;
    // this.getContent(query);
    // if (this.detail.nr) {
    //   uni.setNavigationBarTitle({
    //     title: '学习心得详情'
    //   });
    // } else if (this.detail.pxjj) {
    //   uni.setNavigationBarTitle({
    //     title: '培训安排详情'
    //   });
    // } else {
    //   uni.setNavigationBarTitle({
    //     title: '详情'
    //   });
    // }
  },
  mounted() {
    this.getContent(this.detail);
  }
};
</script>

<style lang="scss" scoped>
.detail_wrap {
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: #fff;
}
.title {
  width: 100%;
  // height: 60upx;
  font-size: 16px;
  font-weight: 600;
  line-height: 60upx;
  text-align: center;
}
.little_title {
  font-size: 28upx;
  font-weight: 600;
  .little_title_text {
    font-weight: normal;
    line-height: 100upx;
  }
}
.subtitle {
  font-size: 12px;
  text-align: center;
  color: #999;
}
.content {
  font-size: 14px;
}
</style>
