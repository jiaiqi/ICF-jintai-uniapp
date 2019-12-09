<template>
  <view class="contentdat">
    <view class="">
      <view class="titlea">
        <text v-if="datalist.lb" space="nbsp" style="color: red;font-size: 18px;">[{{ datalist.lb }}]</text>

        <text v-if="datalist.activity_title" style="font-size: 18px;">{{ datalist.activity_title }}</text>
        <text v-else style="font-size: 18px;">{{ datalist.bt || datalist.hdbt }}</text>
        <view class="" style="color:#BEBEBE; font-size: 12px;font-weight: 100;">
          <text v-if="datalist.ly">
            {{ datalist.ly }} &nbsp;|
            <text style="opacity: 0;">4</text>
          </text>
          <text>{{ datalist.create_time.slice(0, 11) }}</text>
        </view>
      </view>

      <view class="" style="width: 100%;height: 1px; background: #BEBEBE;"></view>

      <!-- 	<view class="">
				<view>【活动时间】：</view>
				<view>【活动地点】：</view>
			</view> -->

      <view class="contents-box" v-if="datalist.hdnr" v-html="datalist.hdnr"><!-- .replace(/\<img/gi,'<img width=100% height=230px ' ) --></view>

      <view class="contents-box" v-else-if="datalist.nr" v-html="datalist.nr">
        <!-- JSON.parse((JSON.stringify(datalist.nr).replace(/\<img/gi,'<img width=100% height=230px ' ))) -->
      </view>

      <view class="contents-box" v-else-if="datalist.activity_content" v-html="datalist.activity_content">
        <!-- JSON.parse((JSON.stringify(datalist.activity_content).replace(/\width:650px;/gi,'width:100%;height:230px' ).replace(/\<img/gi,'<img width=100% height=230px ' ))) -->
      </view>

      <view class="contents-box" v-else-if="datalist.content" v-html="datalist.content">
        <!-- JSON.parse((JSON.stringify(datalist.activity_content).replace(/\width:650px;/gi,'width:100%;height:230px' ).replace(/\<img/gi,'<img width=100% height=230px ' ))) -->
      </view>

      <!-- <view class="btn"  @click="baoming()">我要报名</view> -->
    </view>
  </view>
</template>

<script>
import uniBadge from '@/components/uni-badge/uni-badge.vue';
export default {
  data() {
    return {
      datalist: [],
      rich: null,
      richs: null
    };
  },
  components: { uniBadge },
  methods: {
    baoming() {
      uni.navigateTo({
        url: './bmym'
      });
    }
  },
  onLoad(options) {
    uni.setNavigationBarTitle({
      title: '详情'
    });
    this.datalist = JSON.parse(decodeURIComponent(options.query));
    if (this.datalist.hdnr) {
      try {
        this.datalist.hdnr = JSON.parse(JSON.stringify(this.datalist.hdnr.replace(/\<img/gi, '<img width=100% height=100% style="width:100%"')));
      } catch (e) {
        //TODO handle the exception
        console.log('error:', e);
      }
    }
    if (this.datalist.nr) {
      try {
        this.datalist.nr = JSON.parse(JSON.stringify(this.datalist.nr.replace(/\<img/gi, '<img width=100% height=100% style="width:100%"')));
      } catch (e) {
        //TODO handle the exception
        console.log('error:', e);
      }
    }
    if (this.datalist.activity_content) {
      try {
        this.datalist.activity_content = JSON.parse(JSON.stringify(this.datalist.activity_content.replace(/\<img/gi, '<img width=100% height=100% style="width:100%"')));
      } catch (e) {
        //TODO handle the exception
        console.log('error:', e);
      }
    }
    if (this.datalist.content) {
      try {
        this.datalist.content = JSON.parse(JSON.stringify(this.datalist.content.replace(/\<img/gi, '<img width=100% height=100% style="width:100%"')));
      } catch (e) {
        //TODO handle the exception
        console.log('error:', e);
      }
    }
    console.log('datalist:', this.datalist);
    // this.rich =  JSON.parse((JSON.stringify(this.datalist.hdnr).replace(/\<img/gi,'<img width=100% height=230px ' )))
    //  this.richs =  JSON.parse((JSON.stringify(this.datalist.nr).replace(/\<img/gi,'<img width=100% height=230px ' )))
  }
};
</script>

<style lang="scss">
.contentdat {
  background-color: #fff;
  width: 100%;
}
.titlea {
  padding: 25upx 30upx 10upx 30upx;
  text-align: center;
  font-weight: 600;
}
.contents-box {
  padding: 30upx;
  font-size: 16px;
}
.rich-img {
  width: 100% !important;
  height: 50% !important;
}
.doubletexst {
  font-size: 12px;
  font-weight: 600;
}
.boxs {
  width: 100%;
  background-color: #fff;
  margin-bottom: 75px;
  min-height: 100px;
  box-shadow: 0 2px 26px 0 rgba(0, 0, 0, 0.12);
}
.tool_bar {
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  position: fixed;
  background-color: #fff;
  bottom: 0;
  width: calc(100% - 40upx);
  height: 80upx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20upx;
  .huifu {
    border-radius: 30upx;
    height: 40upx;
    line-height: 40upx;
    width: 60%;
    text-indent: 1rem;
    font-size: 26upx;
    border: 1px solid #e0e0e0;
  }
  .huifu_btn {
    line-height: 50upx;
    height: 50upx;
    font-size: 26upx;
    margin: 0;
  }
  .agree {
    display: flex;
    justify-content: center;
    align-items: center;
    uni-image {
      padding-right: 5upx;
    }
    .text {
      font-size: 24upx;
      font-weight: 600;
      padding: 0 20upx;
    }
  }
}
.btn {
  margin: 40upx 20upx;
  height: 80upx;
  background: red;
  font-size: 34rpx;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  line-height: 80upx;
  border-radius: 20upx;
}
</style>
