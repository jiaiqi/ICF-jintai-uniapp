<template>
  <view class="bg">
    <view class="steps">
      <view class="steps_item" v-for="(i, index) in infoList" :key="index">
        <view
          v-if="index != 0"
          :class="{ 'bg-gradual-green': index < scroll || i.state === '已处理', 'bg-blue': index === scroll && i.state !== '已处理', 'bg-white': index > scroll }"
        ></view>
        <text :class="{ 'bg-gradual-green': index < scroll || i.state === '已处理', 'bg-blue': index === scroll && i.state !== '已处理', 'bg-white': index > scroll,'text-grey': index > scroll }">
          {{ index + 1 }}
        </text>
      </view>
    </view>
    <view class="info_list">
      <view
        class="info_item shadow-blur"
        v-for="(i, index) in infoList"
        :key="index"
        :class="{ 'bg-gradual-green': index < scroll || i.state === '已处理', 'bg-blue': index === scroll && i.state !== '已处理', 'bg-white': index > scroll }"
        :style="{ animation: 'info ' + (index * 0.2 + 1) + 's' }"
        @tap="topage({ data: i, index: index })"
      >
       <view class="content-box">
         <view class="head">
           <view class="name">{{ i.step_name }}</view>
           <view class="state">状态：{{ i.state }}</view>
         </view>
         <view class="state" v-if="i._approval_user">
           责任人：
           <text>{{ i._approval_user }}</text>
         </view>
         <view class="" v-if="i._record_data">
           <text class="margin-right-xs">处理时间：</text>
           {{ i._record_data.create_time }}
         </view>
       </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'YSteps',
  props: {
    infoList: {
      type: Array,
      default: () => {
        [];
      }
    },
    scroll: {
      type: Number,
      default: -1
    },
    color: {
      type: String,
      default: '#ff3838'
    }
  },
  data() {
    return {};
  },
  onLoad(e) {
    //获取列表
  },
  methods: {
    topage(e) {
      this.$emit('clickSteps', e);
    }
  }
};
</script>

<style lang="scss">
@keyframes info {
  0% {
    transform: translate(100px, 0);
  }
  60% {
    transform: translate(-10px, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}
page {
  background-color: #f2f2f2;
}
.bg {
  margin-top: 20upx;
  background-color: #f2f2f2;
  display: flex;
}
.steps {
  display: flex;
  flex-direction: column;
  width: 60upx;
  margin: 0 30upx;
  margin-top: 100upx;
  .steps_item {
    display: flex;
    flex-direction: column;
    align-items: center;
    view {
      height: 200upx;
      width: 5upx;
    }
    text {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 40upx;
      line-height: 40upx;
      height: 40upx;
      border-radius: 50%;
      font-size: 10px;
    }
  }
}
.info_list {
  display: flex;
  flex-direction: column;
  flex: 1;
  .info_item {
    // background-color: #fff;
    height: 200upx;
    margin: 20upx 0;
    margin-right: 30upx;
    border-radius: 10upx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 30upx;
  }
  .info_item:active {
    opacity: 0.6;
  }
  .content-box{
    .head {
      display: flex;
      flex-direction: row;
    }
    .name {
      flex: 1;
      font-size: 34upx;
      line-height: 60upx;
      font-weight: 700;
    }
    .state {
      flex: 1;
      font-size: 30upx;
      line-height: 60upx;
    }
  }
}
</style>
