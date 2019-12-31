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

        <view class="content" v-html="richText" v-if="richText"></view>
        <!-- <view class="content" v-html="detail.sxmxx_js" v-if="detail.sxmxx_js"></view> -->
      </view>
    </view>
    <view  class="content-wrap">
      <!-- 数字城管 -->
      <view class="title" v-if="detail.title">{{ detail.title }}</view>
      <view class="title" v-if="detail.opinion_title">{{ detail.opinion_title }}</view>
      <view class="title" v-if="detail.note_title">{{ detail.note_title }}</view>
      <view class="subtitle">发布时间：{{ detail.create_time }}</view>
      <view class="content" ref="richText" id="richText" v-html="richText"></view>
    <view class="showParise" v-if="showParise">
      <image :src="isparise" v-if="hasParise" class="parise-img"></image>
      <image :src="notParise" v-if="!hasParise" class="parise-img"></image>
    </view>
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
      showParise:false,//是否展示点赞图标
      hasParise:false,//是否已点赞
      isparise:require('../../../static/img/agreea.png'),
      notParise:require('../../../static/img/agreeb.png'),
      richText: ''
    };
  },
  methods: {
    getRichText() {},
    getContent(detail) {
      if (detail.content) {
        if(detail.content.indexOf('<img')!=-1){
          this.richText = JSON.parse(JSON.stringify(detail.content).replace(/\<img/gi, '<img width=100% height=100% '))
          // if(detail.content.indexOf('<p>')!=-1){
          //   this.richText = JSON.parse(JSON.stringify(detail.content).replace(/\<img/gi, '<img width=100% height=100% ').replace(/<p>/gi,' '))
          // }
          // if(detail.content.indexOf('</p>')){
          //   this.richText = JSON.parse(JSON.stringify(detail.content).replace(/\<img/gi, '<img width=100% height=100% ').replace(/<\/p\>/gi,' '))
          // }
        }else{
          this.richText = detail.content
        }
      }
      if (detail.pxjj) {
        // 党建培训
        if(detail.pxjj.indexOf('<img')!=-1){
          this.richText = JSON.parse(JSON.stringify(detail.pxjj).replace(/\<img/gi, '<img width=100% height=100% '));
        }else{
          this.richText = detail.pxjj
        }
      }
      if (detail.nr) {
        if(detail.nr.indexOf('<img')!=-1){
          this.richText = JSON.parse(JSON.stringify(detail.nr).replace(/\<img/gi, '<img width=100% height=100% '));
        }else{
          this.richText = detail.nr
        }
      }
      if(detail.sxmxx_js){
        if(detail.sxmxx_js.indexOf('<img')!=-1){
            this.richText = JSON.parse(JSON.stringify(detail.sxmxx_js).replace(/\<img/gi, '<img width=100% height=100% '));
        }else{
          this.richText = detail.sxmxx_js
        }
      }
      console.log(this.richText);
    },
    getSSPPraise() {
          // 查找随手拍点赞信息
          let serviceName = "srvzhsq_bmfw_ssppraise_select";
          let url = this.getServiceUrl("select", serviceName, "sqfw");
          let ssp_no = this.detail.ssp_no;
          let req = {
            colNames: ["*"],
            serviceName: "srvzhsq_bmfw_ssppraise_select",
            condition: [{ colName: "ssp_no", ruleType: "like", value: ssp_no }],
            group: [
              {
                colName: "ssp_no",
                type: "count"
              },
              {
                colName: "praise_user",
                type: "by"
              }
            ]
          };
          this.$http.post(url, req).then(res => {
            if (res.data.data) {
              // console.log(res.data.data);
              let data = res.data.data;
              let praiseUserList = data.map(item => item.praise_user);
              // console.log(praiseUserList);
              let user_no = this.userInfo.user_no;
              if (praiseUserList.includes(user_no)) {
                this.hasParise = true;
                // this.praiseStyle = "border: 1px solid rgb(230,30,0)";
              } else {
                this.hasParise = false
                // this.praiseStyle = "border: 1px solid #333";
              }
            }
          });
        },
  },
  onLoad(options) {
    let query = JSON.parse(options.query);
    console.log(query);
    this.detail = query;
    if(options.showParise){
      this.showParise = options.showParise
    }
  },
  mounted() {
    this.getContent(this.detail);
  }
};
</script>

<style lang="scss" scoped>
.detail_wrap {
  width: 100%;
  position: relative;
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
.content-wrap{
  position: relative;
  padding-bottom: 50upx;;
  .showParise{
    position: absolute;
    bottom:-20upx;
    right: 20upx;
    width: 80upx;
    height: 80upx;
    // border: 1px solid #333;
    margin: 50upx auto 0;
    border-radius: 50%;;
    display: flex;
    justify-content: center;
    align-items: center;
    .parise-img{
      width: 50upx;
      height: 50upx;;
    }
  }
}


</style>
