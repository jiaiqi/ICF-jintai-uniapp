<template>
  <view class="list-item-wrap  bg-white">
    <view class="list-item flex" v-if="viewType === 'normal'">
      <!-- <image :src="goodsData.img" :lazy-load="true" onerror="this.src='@/static/noneImg.png'" mode="" class="main-image " @click="listItemClick" v-if="itemData[viewTemp['img']]"></image> -->
      <imgLazy class="main-image" v-if="itemData[viewTemp['img']]" :item="goodsData" :imgColName="'img'"></imgLazy>
      <view class="content-box flex-twice" v-if="listType === 'proc'">
        <view class="content-header">
          <view class="title" v-if="itemData.pxbt" @click="listItemClick">{{ itemData[viewTemp['title']] }}</view>
          <view class="status" v-if="itemData.proc_status" @click="listItemClick">
            <text class="bg-red text">{{ itemData.proc_status }}</text>
          </view>
        </view>
        <view class="title-tip" v-if="itemData['executor_user']" @click="listItemClick">
          <view class="lable">责任人：</view>
          <view class="value">{{ itemData['executor_user'] }}</view>
        </view>
        <view class="content proc-content" @click="listItemClick">
          <view class="content-item">
            <view class="label">创建时间：</view>
            <view class="value">{{ itemData.create_time.slice(0, 10) }}</view>
          </view>
          <view class="content-item">
            <view class="label">创建人：</view>
            <view class="value">{{ itemData.create_user_disp }}</view>
          </view>
          <view class="content-item">
            <view class="label">修改时间：</view>
            <view class="value">{{ itemData.modify_time.slice(0, 10) }}</view>
          </view>
        </view>
        <view class="footer">
          <view class="">
            
          </view>
          <view class="footer-btn">
            <text
              v-if="deRowButDisplay(itemData, item) && !detailList"
              class="cu-btn round sm text-blue line-blue"
              :class="'cuIcon-' + item.button_type"
              v-for="item in rowButton"
              :key="item.id"
              @click="footBtnClick(item)"
            >
              {{ item.button_name }}
            </text>
          </view>
          <!-- <view class="footer-btn">
            <view class="text-red">关闭流程</view>
            <view>
              详情
              <text class="cuIcon-right margin-xs"></text>
            </view>
          </view> -->
        </view>
      </view>
      <view class="content-box flex-twice" v-else>
        <view class="title" v-if="goodsData.title" @click="listItemClick">{{ goodsData.title }}</view>
        <view class="title-tip" v-if="goodsData.tip" @click="listItemClick">{{ goodsData.tip }}</view>
        <view class="content" v-if="goodsData.price" @click="listItemClick">
          <view class="numbers">
            <text class="unit" v-if="!isNaN(Number(goodsData.price))">￥</text>
            {{ goodsData.price }}
          </view>
          <view class="tags"></view>
        </view>
        <view class="footer">
          <view class="foot-name" v-if="goodsData.footer" @click="listItemClick">{{ goodsData.footer }}</view>
          <view class="foot-button">
            <text
              v-if="deRowButDisplay(itemData, item) && !detailList"
              class="cu-btn round sm text-blue line-blue"
              :class="'cuIcon-' + item.button_type"
              v-for="item in rowButton"
              :key="item.id"
              @click="footBtnClick(item)"
            >
              {{ item.button_name }}
            </text>
            <text v-if="detailList" class="text-gray" :class="'cuIcon-more'"></text>
            <!-- <text class="lg text-blue cuIcon-delete"></text> -->
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import imgLazy from '@/components/bx-lazy-img/bx-lazy-img.vue';
export default {
  name: 'applyListItem',
  data() {
    return {
      picUrl: '',
      goodsData: {
        title: '',
        tip: '',
        img: '',
        price: '',
        footer: ''
      }
    };
  },
  components: { imgLazy },
  methods: {
    listItemClick() {
      this.$emit('click-list-item', this.itemData);
    },
    footBtnClick(btn) {
      this.$emit('click-foot-btn', { button: btn, row: this.itemData });
    },
    async getPicture(file_no) {
      const serviceName = 'srvfile_attachment_select';
      const url = this.getServiceUrl('file', serviceName, 'select');
      const req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [{ colName: 'file_no', value: file_no, ruleType: 'eq' }]
      };
      if (file_no !== null && file_no !== '' && file_no !== undefined) {
        let res = await this.$http.post(url, req);
        if (res.data.state === 'SUCCESS') {
          const data = res.data.data[0];
          if (data) {
            const fileurl = this.$api.srvHost + '/file/download?filePath=' + data.fileurl + '&thumbnailType=' + this.$api.imgThumbnailType;
            return fileurl;
          }
        }
      }
    },
    deRowButDisplay: function(item, button) {
      if (item && button.hasOwnProperty('isShow') && button['isShow'].length > 0) {
        let isShow = [];
        for (let key in button['isShow']) {
          switch (button['isShow'][key].ruleType) {
            case 'eq':
              if (item[button['isShow'][key].colName] === button['isShow'][key].value) {
                isShow.push(true);
              }
              break;
            case 'nq':
              if (item[button['isShow'][key].colName] !== button['isShow'][key].value) {
                isShow.push(true);
              }
              break;
            default:
              break;
          }
        }
        if (isShow.length === button['isShow'].length) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  },
  props: {
    //是否是详情列表
    detailList: {
      type: Boolean,
      default: false
    },
    viewType: {
      type: String,
      default: 'normal'
    },
    viewTemp: {
      type: Object,
      default: () => {}
    },
    imageNum: {
      type: Number,
      default: 1
    },
    gridRowNum: {
      type: Number,
      default: 2
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    serviceName: {
      type: String,
      default: ''
    },
    condition: {
      type: Array,
      default: () => {
        [];
      }
    },
    rownumber: {
      type: Number,
      default: 10
    },
    order: {
      type: Array,
      default: () => {
        [];
      }
    },
    showSearchBar: {
      type: Boolean,
      default: false
    },
    rowButton: {
      type: Array,
      default: () => {
        [];
      }
    },
    srv_cols: {
      type: Array,
      default: () => {
        [];
      }
    },
    itemData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    listType: {
      type: String, //列表类型 list||proc
      default: 'list'
    }
  },
  watch: {
    srv_cols: {
      handler(newVal) {
        let arr = Object.values(this.viewTemp);
        // console.log(this.srv_cols);
        // Object.values
        if (arr.length === 0 && this.srv_cols && this.srv_cols.length > 0) {
          let arr2 = this.srv_cols.map(item => item.columns);
          Object.keys(this.goodsData).forEach((item, index) => {
            this.goodsData[item] = this.itemData[arr2[index]];
          });
          this.goodsData['img'] = '';
        }
      }
    },
    itemData: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue[this.viewTemp.img]) {
          this.getPicture(newValue[this.viewTemp.img]).then(url => {
            this.goodsData.img = url;
          });
        }
        if (newValue[this.viewTemp.title]) {
          this.goodsData.title = newValue[this.viewTemp.title];
        }
        if (newValue[this.viewTemp.tip]) {
          this.goodsData.tip = newValue[this.viewTemp.tip];
        }
        if (newValue[this.viewTemp.price]) {
          this.goodsData.price = newValue[this.viewTemp.price];
        }
        if (newValue[this.viewTemp.footer]) {
          this.goodsData.footer = newValue[this.viewTemp.footer];
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.list-item-wrap {
  width: auto;
  margin: 10rpx 0;
  box-sizing: border-box;
  .list-item {
    // width: calc(100% - 40upx);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10upx;
    // margin: 20upx;
    box-sizing: border-box;
    .main-image {
      width: 220upx;
      height: 220upx;
      border-radius: 5upx;
      margin-right: 20upx;
    }
    .content-box {
      transition: all 1s ease-out;
      box-sizing: border-box;
      max-width: 100%;
      // flex: 1;
      // padding-right: 10px;
      color: #999;
      .content-header {
        display: flex;
        justify-content: space-between;
        .title {
          width: 60%;
          line-height: 40upx;
          color: #333;
          font-weight: bold;
          margin-bottom: 10upx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .status {
          width: 35%;
          text-align: right;
          .text {
            padding: 5upx 10upx;
            border-radius: 5upx;
          }
        }
      }

      .lable {
        font-weight: normal;
        font-size: 28upx;
        color: #333;
      }
      .title-tip {
        font-size: 24upx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        align-items: center;
      }
      .content {
        text-overflow: ellipsis;
        white-space: nowrap;
        .numbers {
          color: #e93b3d;
          line-height: 40upx;
          margin-top: 20upx;
          font-size: 36upx;
        }
        .unit {
          font-size: 30upx;
        }
        &.proc-content {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          background-color: #fff;
          .content-item {
            max-width: 50%;
            min-width: 45%;
            display: flex;
            min-height: 50upx;
            align-items: center;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:last-child {
              // justify-content: flex-end;
            }
            .label {
              font-weight: normal;
              font-size: 28upx;
              color: #333;
            }
            .value {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
      .footer {
        display: flex;
        justify-content: space-between;
        height: 80upx;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .foot-name {
          position: relative;
          display: inline-block;
          padding-right: 28upx;
          line-height: 44upx;
          &::after {
            content: '';
            display: block;
            width: 8px;
            height: 8px;
            border-top: 1px solid #999;
            border-left: 1px solid #999;
            transform-origin: 50%;
            transform: rotate(135deg);
            position: absolute;
            width: 6px;
            height: 6px;
            right: 5px;
            top: 50%;
            margin-top: -3px;
          }
        }
        .footer-btn {
          // min-width: 60%;
          display: flex;
          justify-content: space-around;
          .cu-btn{
            margin-right: 10upx;
          }
        }
        .foot-button {
          // width: 100upx;
          // display: flex;
          // font-size: 40upx;
          // justify-content: space-around;
        }
      }
    }
  }
}
</style>
