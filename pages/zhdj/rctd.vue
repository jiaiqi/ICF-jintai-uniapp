<template>
  <view class="content">
    <view class="" v-if="dataList.length > 0">
      <view class="page" :style="{ height: `${sysHeight}px`, width: `${sysWidth}px` }">
        <!-- #ifndef APP-PLUS -->
        <movable-area class="move-area" :style="{ height: `${3 * sysHeight}px`, width: `${3 * sysWidth}px`, top: `${-sysHeight}px`, left: `${-sysWidth}px` }">
          <movable-view
            id="move"
            class="move-view"
            v-for="(item, index) in dataList"
            :key="item._id"     55
            :style="{ zIndex: `${99999 - item._id}` }"   5 55 5  5 5555555
            direction="all"
            :x="item.moveX"
            :y="item.moveY"
            out-of-bounds
            v-if="index <= number"
            :disabled="index != 0"
            :animation="item.animation"
            @tap="tapCard(item)"
            @touchend="touchend"
            @touchmove="touchMove"
            @touchstart="touchStart"
          >
            <view
              class="cardBox"
              :animation="animationData[index]"
              :style="{
                transform:
                  index < number
                    ? `rotate(${rotate * index}deg) scale(${1 - (1 - scale.x) * index},${1 - (1 - scale.y) * index}) skew(${skew.x * index}deg, ${skew.y *
                        index}deg) translate(${translate.x * index}px, ${translate.y * index}px)`
                    : `rotate(${rotate * (number - 1)}deg) scale(${1 - (1 - scale.x) * (number - 1)},${1 - (1 - scale.y) * (number - 1)}) skew(${skew.x *
                        (number - 1)}deg, ${skew.y * (number - 1)}deg) translate(${translate.x * (number - 1)}px, ${translate.y * (number - 1)}px)`,
                opacity: index < number ? `${1 - (1 - opacity) * index}` : `${1 - (1 - opacity) * (number - 1)}`
              }"
            >
              <card-box
              :datas="item"
                :src="item.src"
                :number="item.number"
                :name="item.name"
                :sex="item.sex"
                :constellation="item.constellation"
                :address="item.address"
                :old="item.old"
                ref="cardBox"
              ></card-box>
            </view>
          </movable-view>
        </movable-area>
        <!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <view
          v-if="index <= number"
          class="move-view"
          :key="item._id"
          @touchend="touchend"
          @tap="tapCard(item)"
          v-for="(item, index) in dataList"
          @touchmove="touchMove"
          @touchstart="touchStart"
          :animation="animationData[index]"
          :style="{
            transform:
              index < number
                ? `rotate(${rotate * index}deg) scale(${1 - (1 - scale.x) * index},${1 - (1 - scale.y) * index}) skew(${skew.x * index}deg, ${skew.y *
                    index}deg) translate(${translate.x * index}px, ${translate.y * index}px)`
                : `rotate(${rotate * (number - 1)}deg) scale(${1 - (1 - scale.x) * (number - 1)},${1 - (1 - scale.y) * (number - 1)}) skew(${skew.x * (number - 1)}deg, ${skew.y *
                    (number - 1)}deg) translate(${translate.x * (number - 1)}px, ${translate.y * (number - 1)}px)`,
            zIndex: `${99999 - item._id}`,
            opacity: index < number ? `${1 - (1 - opacity) * index}` : `${1 - (1 - opacity) * (number - 1)}`
          }"
        ></view>
        <view class="cardBox">
          <card-box
            :datas="item"
            :src="item.src"
            :number="item.number"
            :name="item.name"
            :sex="item.sex"
            :constellation="item.constellation"
            :address="item.address"
            :old="item.old"
            ref="cardBox"
          ></card-box>
        </view>
        <!-- #endif -->
      </view>
    </view>

    <view class="kapian" v-else>
      <view class="" style="color: #BEBEBE;text-align: center;">
        <image style="height: 25px;width: 25px;" src="../../static/img/loading.gif" mode=""></image>
        <view class="">数据加载中</view>
      </view>
    </view>
  </view>
</template>

<script>
import clCardDel from '@/components/cl-cardDel/cl-cardDel';
import cardBox from './card-box';
export default {
  mixins: [clCardDel],
  components: { cardBox },
  data() {
    return {
      list: [],
      dataList: []
    };
  },
  methods: {
    //设置初始参数
    async getphoto(item) {
      let path = this.$api.select + '/file/download?filePath=';
      let listr = [];
      for (let i in item) {
        listr.push(item[i].gzz);
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
        if (resppo.data && resppo.data.data && resppo.data.data.length > 0) {
          this.$set(item[i], 'gzz', path + resppo.data.data[0].fileurl);
        }
      }
      return item;
    },
    init() {
      this.number = 3; //card 3
      this.translate = { x: 0, y: 8 }; //y下移10px
      this.scale = { x: 0.95, y: 1 }; //x 缩小0.9
      this.type = true;
      this.moveRotate = {
        //设置位移图片旋转角度距离  card中心点 - 指向坐标
        x: 0,
        y: uni.getSystemInfoSync().screenHeight
      };
    },

    //获取数据
    getData() {
      let url = this.$api.select + '/zhdj/select/srvzhsq_rcxx_select';
      let req = {};
      req.serviceName = 'srvzhsq_rcxx_select';
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req['page'] = { pageNo: 1, rownumber: 10 };
      this.$http.post(url, req).then(res => {
        this.getphoto(res.data.data).then(photo => {
          console.log(photo);
          this.list = photo;
          setTimeout(() => {
            let dataGroup = [];
            for (var i = 1; i < this.list.length; i++) {
              dataGroup.push({
                constellation: this.formatidcard(this.list[i].sfzh),
                number: 10,
                old: this.list[i].xm,
                src: this.list[i].gzz
              });
            }
            this.dataList = [...this.dataList, ...dataGroup];
            console.error(JSON.stringify(this.dataList));
          }, 1000);
        });
      });
    },
    formatidcard(idcard) {
      return idcard.replace(/(\d{5})\d{6}(\d{6})/, '$1******$2');
    },
    //触摸中判断
    moveJudge(x, y, ratio) {
      let el = this.$refs.cardBox[0];

      if (x > 20) {
        el.moveRight(ratio);
      } else if (x < -20) {
        el.moveLeft(ratio);
      } else {
        el.moveCenter();
      }
    },
    //触摸结束判断
    endJudge(x, y) {
      let el = this.$refs.cardBox[0];
      if (Math.abs(x) < 40) {
        this._back();
        el._back();
      } else {
        this._del();
        el.clearAnimation();
      }
    },
    //删除card时
    delCard(x, y) {
      if (x > 0) {
        // console.log(this.dataList[0],'喜欢')
      } else {
        // console.log(this.dataList[0],'不喜欢')
      }
    },
    tapCard(item) {
      console.log(item, '点击');
    }
  },
  onLoad() {}
};
</script>

<style>
.content {
  width: 100%;
}
.page {
  width: 100%;
  position: absolute;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.move-area {
  position: absolute;
}
.move-view {
  width: 600rpx;
  position: absolute;
  height: 900rpx;
  left: 50%;
  top: 50%;
  margin-left: -300rpx;
  margin-top: -500rpx;
}
.kapian {
  box-shadow: 0 0 26px 0 rgba(0, 0, 0, 0.12);
  margin: 8px 8px;
  padding: 8px;
}
.cardBox {
  position: relative;
  width: 600rpx;
  height: 900rpx;
}
</style>
