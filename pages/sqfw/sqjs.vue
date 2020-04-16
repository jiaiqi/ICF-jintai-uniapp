<template>
  <view class="content">
    <view class="" style="padding: 10px;"><text style="font-size: 17px;font-weight: 600; border-left: 2px solid red;padding: 5px;">社区列表</text></view>
    <!-- <uni-top></uni-top> -->

    <view class="" v-if="loadingView && !listhome">
      <view class="" v-for="i in 7">
        <!-- @click="navxq(item.sqname,index,item.sqphone,item.sqaddress)" -->
        <view class="content-box">
          <view class="imageHotel" style="background-color: rgba(150, 150, 150, 0.1);" mode=""><!-- <text class="topone">Top{{index+1}}</text> --></view>
          <view class="listtext">
            <view class="testline" style="display: flex;">
              <text id="listones" style="display: block;background-color: rgba(150, 150, 150, 0.1); "></text>
              <view class="listcenter" style="display: flex"><image style="background:  rgba(150, 150, 150, 0.1);border-radius: 50%;" mode="" class="calls"></image></view>
            </view>
            <view class="testline" style="position: relative;">
              <text id="tesdr" style=" vertical-align:middle;background:rgba(150, 150, 150, 0.1) ;height: 20px; " class="textline"></text>
            </view>
            <view class="" style="display: flex;font-size: 13px;margin-top: 4px;">
              <view class="textFlex textFlexborder">
                <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;"></text>
                <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;"></text>
                <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;"></text>
                <text style="width: 43px; height: 20px; background:rgba(150, 150, 150, 0.1) ;"></text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="" v-for="(item, index) in listhome" :key="index">
      <!-- @click="navxq(item.sqname,index,item.sqphone,item.sqaddress)" -->
      <view class="content-box">
        <image class="imageHotel" :src="item.sqimg" mode="">
          <text class="topone">Top{{ index + 1 }}</text>
        </image>
        <view class="listtext">
          <view class="testline" style="display: flex;">
            <text style="display: block;font-weight: 600;font-size: 16px;" @click="navxq(item.id, item.sqimg)">{{ item.sqname }}</text>
            <view class="listcenter" style="display: flex">
              <image src="../../static/img/ditu.png" mode="" class="calls" @click="open(item.longitude, item.latitude, item.sqname)"></image>
            </view>
          </view>
          <view class="testline" style="display: flex;font-size: 15px;color: #666;" @click="navxq(item.id, item.sqimg)">
            <image class="mapwz" src="../../static/img/wz.png" mode=""></image>
            <text style="vertical-align:middle;" class="textline">{{ item.sqaddress }}</text>
          </view>
          <view class="" style="display: flex;font-size: 13px;margin-top: 4px;" @click="navxq(item.id, item.sqimg)">
            <view class="textFlex textFlexborder">
              <text v-if="item.sqfamily > 800 && item.sqspace > 1200" class="backcolor">优质小区</text>
              <text v-if="item.sqfamily > 800" class="mapborder">面积大</text>
              <text v-if="item.sqspace > 1200" class="mapborder">车位多</text>
              <text class="blueborder">环境优美</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view @click="orders()"><uni-loading :status="status" color="#888" /></view>
  </view>
</template>

<script>
import uniLoading from '@/components/mix-load-more/mix-load-more';
export default {
  data() {
    return {
      loadingView: true,
      listhome: [],
      url: 'https://m.amap.com',
      status: 0,
      numberlist: 6,
      pageno: 1,
      imageURL: '../../static/img/hotels.png',
      jlon: null, //起点精度
      wlen: null, //起点维度
      adress: ''
    };
  },
  components: {
    uniLoading
  },
  methods: {
    async getdata(index) {
      let url = this.$api.select + '/sqfw/select/srvzhsq_information_select?srvzhsq_information_select';
      let req = {};
      req.serviceName = 'srvzhsq_information_select';
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req['page'] = {
        pageNo: this.pageno,
        rownumber: this.numberlist
      };
      let res = await this.$http.post(url, req);
      // console.log(	res)
      if (index == 0) {
        this.getphoto(res.data.data).then(ress => {
          console.log(ress);
          this.listhome = ress;
        });
      } else {
        if (res.data.data.length == 0) {
          this.status = 2;
        }

        this.getphoto(res.data.data).then(resdata => {
          this.listhome = this.listhome.concat(resdata);
        });
        // this.getphoto(res.data.data)
      }
      this.loadingView = false;
    },
    async getphoto(item) {
      let path = this.$api.select + '/file/download?filePath=';
      let listr = [];
      for (let i in item) {
        listr.push(item[i].sqimg);
        let url = this.$api.select + '/file/select/srvfile_attachment_select';
        let req = {
          colNames: ['*'],
          condition: [
            {
              colName: 'file_no',
              ruleType: 'eq',
              value: listr[i] // 图编号
            }
          ],
          order: null,
          page: null,
          serviceName: 'srvfile_attachment_select'
        };
        let phoarr = [];

        let resppo = await this.$http.post(url, req);
        // console.log("EEEEEEEEEEEEEEEEEEEE",resppo)
        if (resppo.data && resppo.data.data && resppo.data.data.length > 0) {
          this.$set(item[i], 'sqimg', path + resppo.data.data[0].fileurl);
          if (item[i].sqimg == null) {
            item[i].sqimg = this.imageURL;
          }
        }
      }
      return item;
    },
    onPullDownRefresh() {
      this.numberlist = this.listhome.length;
      let _self = this;
      _self.pageno = 1;
      setTimeout(function() {
        uni.stopPullDownRefresh();
        _self.getdata(0);
      }, 1000);
    },

    onReachBottom() {
      let _self = this;
      _self.status = 1;
      _self.pageno++;
      uni.showNavigationBarLoading();

      console.log('reach');
      setTimeout(function() {
        _self.getdata(1);
        _self.status = 0;
        uni.hideNavigationBarLoading();
      }, 1000);
    },

    orders() {
      let _self = this;
      _self.pageno++;
      _self.status = 'loading';
      uni.showNavigationBarLoading();

      console.log('reach');
      setTimeout(function() {
        _self.getdata(1);
        console.error(_self.pageno);
        _self.status = 'more';
        uni.hideNavigationBarLoading();
      }, 1000);
    },

    open(j, w, n) {
      let url = `https://uri.amap.com/navigation?from=${this.jlon},${this.wlen},
				${this.adress}&to=${j},${w},${n}`;
      // #ifdef APP-PLUS
      plus.runtime.openWeb(url, function(res) {
        console.log(res);
      });
      // #endif

      // #ifndef APP-PLUS
      uni.showToast({
        title:"非APP端不支持导航",
        icon:"none"
      })
      // window.location.href = url;
      // #endif
    },
    navxq(id, img) {
      console.log('imgPaths', img);
      uni.navigateTo({
        url: './sqxqjs?id=' + id + '&img=' + encodeURIComponent(JSON.stringify(img).replace(/%/g, '%25'))
      });
    }
  },
  onLoad() {
    this.getdata(0);
    this.status = 1;
    let that = this;
    uni.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.jlon = res.longitude;
        console.log('精度', res.longitude);
        alert(res.longitude);
        that.wlen = res.latitude;
        console.log('维度', res.latitude);
      }
    });
    // #ifdef APP-PLUS
    plus.geolocation.getCurrentPosition(
      function(position) {
        that.adress = position.addresses;
      },
      function(e) {
        console.log(e.message);
      },
      { geocode: true }
    );
    // #endif
  }
};
</script>

<style>
.content {
  width: 100%;
  background: #ffffff !important;
}
.imageHotel {
  display: block;
  height: 200upx;
  width: 200upx !important;
  border-radius: 18upx;
  margin-right: 25upx;
  background: rgba(150, 150, 150, 0.1);
}
.content-box {
  display: flex;
  padding: 20upx;
  border-bottom: 0.5px solid #e2e3dc;
  position: relative;
}
.listtext text {
  margin-top: 5upx;
}
.testline text {
  line-height: 60upx;
}
.topone {
  position: absolute;
  left: 150upx;
  height: 40upx;
  line-height: 40upx;
  text-align: center;
  width: 70upx;
  background: #fb6a6a;
  font-size: 12px;
  box-sizing: border-box;
  border-top-right-radius: 18upx;
  border-bottom-left-radius: 18upx;
  color: #ffffff;
}
.mapwz {
  display: inline-block;
  width: 27upx;
  height: 35upx;
  margin-top: 18upx;
  margin-right: 5upx;
  /* position: absolute;
	  top: ; */
  vertical-align: middle;
}
.calls {
  height: 50upx;

  width: 50upx;
  padding: 0 1px;
  background: rgba(150, 150, 150, 0.1);
  border-radius: 50%;
}
.textline {
  display: block;
  width: 420upx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#tesdr {
  width: 447upx;
  margin: 16upx 0 14upx 0;
}
.callnumber {
  display: inline-block;
  width: 50upx;
  text-align: center;
  font-size: 13px;
  color: #ff6436;
}
.listcenter view {
  line-height: 40upx;
  text-align: center;
}
.listcenter {
  position: absolute;
  right: 25upx !important;
  top: 28upx !important;
}
.textFlex {
  display: flex;
}
.textFlexborder text {
  margin: 10upx 10upx 10upx 0;
}
.backcolor {
  background: rgb(255, 88, 88);
  color: #ffffff;
  border-radius: 10upx;
  font-size: 12px;
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
#listones {
  margin-top: 18upx;
  width: 250upx;
  height: 50upx;
}
</style>
