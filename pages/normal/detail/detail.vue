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
        <view class="content" v-html="detail.sxmxx_js" v-if="detail.sxmxx_js"></view>
      </view>
    </view>
    <view v-if="detail.title">
      <!-- 便民服务 -->
      <view class="title">{{ detail.title }}</view>
      <view class="subtitle">发布时间：{{ detail.create_time }}</view>
      <view class="content" v-html="detail.content" v-if="detail.content"></view>
    </view>
    <view v-if="detail.title && detail.ssp_no">
      <!-- 数字城管 -->
      <view class="title">{{ detail.title }}</view>
      <view class="subtitle">发布时间：{{ detail.create_time }}</view>
      <view class="content" v-html="detail.content" v-if="detail.content"></view>
      <view class="content" v-html="detail.nr" v-if="detail.nr"></view>
    </view>
    <view v-if="detail.pxbt">
      <!-- 党建培训 -->
      <view class="title">{{ detail.pxbt }}</view>
      <view class="subtitle">发布时间：{{ detail.create_time }}</view>
      <view class="content" v-html="detail.pxjj" v-if="detail.pxjj"></view>
      <view class="content" v-html="detail.nr" v-if="detail.nr"></view>
    </view>
    <view v-if="detail.note_title">
      <!-- 论贴帖子详情 -->
      <view class="title">{{ detail.note_title }}</view>
      <view class="subtitle">发贴时间：{{ detail.create_time }}</view>
      <view class="content" v-html="detail.content" v-if="detail.content"></view>
    </view>
    <view v-if="detail.opinion_title">
      <!-- 论贴帖子详情 -->
      <view class="title">{{ detail.opinion_title }}</view>
      <view class="subtitle">发贴时间：{{ detail.create_time }}</view>
      <view class="content" v-html="detail.content" v-if="detail.content"></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detail: {}
    };
  },
  methods: {},
  onLoad(options) {
    let query = JSON.parse(options.query);
    console.log(query);
    this.detail = query;
    if (this.detail.nr) {
      uni.setNavigationBarTitle({
        title: '学习心得详情'
      });
    } else if (this.detail.pxjj) {
      uni.setNavigationBarTitle({
        title: '培训安排详情'
      });
    } else {
      uni.setNavigationBarTitle({
        title: '详情'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.detail_wrap {
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
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
