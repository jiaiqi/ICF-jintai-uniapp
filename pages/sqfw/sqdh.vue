<template>
  <view class="content">
    <view class="map"><map style="width: 100%; height: 100%;" :latitude="latitude" :longitude="longitude"></map></view>
    <view class="mapSession">
      <view class="textFlex" style="margin-bottom: 10px;">
        <text style="font-weight: 600;">{{ titles }}</text>
      </view>
      <view class="textFlex smalltext" style="margin-bottom: 10px;" @click="open()">
        <image class="mapwz" src="../../static/img/wz.png" mode=""></image>
        <text>{{ dress }}</text>
      </view>
      <view class="textFlex textFlexborder">
        <text class="backcolor">优质小区</text>
        <text class="mapborder">面积大</text>
        <text class="mapborder">车位多</text>
        <text class="blueborder">环境优美</text>
      </view>
      <!-- <cover-image class="crip" src="../../static/img/mapBTn.png" mode="" @click="open(0)" ></cover-image> -->
      <!-- <cover-view class="crip" @click="open(0)"> -->
        <!-- <cover-image class="bascol" src="../../static/img/gongjiaoche.png" mode=""></cover-image> -->
        <!-- <view style="color: #FFFFFF;font-weight: 600;font-size: 14px;text-align: center;">到这去</view> -->
      <!-- </cover-view> -->
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: 'https://m.amap.com/share/index/lnglat=108.764936,34.43811&name=park&callnative=0',
      titles: '',
      dress: '',
      title: 'map',
      latitude: 39.909,
      longitude: 116.39742,
      markers: [
        {
          width: 40,
          height: 40,
          latitude: 39.909,
          longitude: 116.39742,
          iconPath: '../../../static/p.png'
        }
      ]
    };
  },
  methods: {
    open(types) {
		
      plus.runtime.openWeb(url, function(res) {
        console.log(res);
      });
    }
  },
  onLoad() {
    let that = this;
    uni.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.markers.latitude = res.longitude;

        that.markers.longitude = res.latitude;
      }
    });
    uni.getStorage({
      key: 'name',
      success: function(res) {
        console.log(res.data);
        that.titles = res.data.sqname;
        that.dress = res.data.dress;
        uni.setNavigationBarTitle({
          title: res.data.sqname
        });
      }
    });
  }
};
</script>

<style lang="scss">
.content {
  width: 100%;
  background: #ffffff !important;
}
.map {
  height: 72vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.mapSession {
  padding: 25upx 50upx;
  background: #ffffff;
  position: relative;
}
.textFlex {
  display: flex;
}
.backcolor {
  background: rgb(255, 88, 88);
  color: #ffffff;
  border-radius: 10upx;
  font-size: 13px;
  padding: 1px;
}
.mapborder {
  border: 1px solid rgb(255, 88, 88);
  color: rgb(255, 88, 88);
  font-size: 13px;
  padding: 1px;
}
.blueborder {
  border: 1px solid rgb(58, 174, 255);
  color: rgb(58, 174, 255);
  font-size: 13px;
  padding: 1px;
}
.mapwz {
  display: block;
  width: 40upx;
  height: 45upx;
  margin-right: 6px;
}
.textFlexborder text {
  margin: 10upx 10upx 10upx 0;
}
.crip {
  height: 150upx;
  width: 150upx;
  border-radius: 50%;
  background: #4f67ea;
  position: absolute;
  top: -75upx;
  right: 50upx;
}
.bascol {
  display: block;
  text-align: center;
  height: 50upx;
  width: 50upx;
  /* position: absolute; */
  /* right: 0;
		top: 0; */
  margin-left: 50upx;
  margin-top: 30upx;
  &:after {
    content: '到这去';
  }
}
.smalltext {
  font-size: 16px;
}
</style>
