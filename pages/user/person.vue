<template>
  <view class="person-wrap">
    <view class="person-head" @click="fnInfoWin" v-if="userInfo&&userInfo.user_no !== 'niming'">
      <!-- <cmd-avatar src="https://avatar.bbs.miui.com/images/noavatar_small.gif"  size="lg" :make="{ 'background-color': '#fff' }"></cmd-avatar> -->
      <cmd-avatar :src="userInfo.head_img_path?userInfo.head_img_path:''"></cmd-avatar>
      <view class="person-head-box">
        <view class="person-head-nickname">{{ userInfo.real_name?userInfo.real_name:' - ' }}</view>
        <view class="person-head-username">ID：{{ userInfo.user_no?userInfo.user_no:' - ' }}</view>
      </view>
    </view>
    <view class="person-list" v-if="userInfo&&userInfo.user_no !== 'niming'">
      <cmd-cell-item title="我的帖子" slot-left arrow @click="myPost"><cmd-icon type="bullet-list" size="24" color="#e52d27"></cmd-icon></cmd-cell-item>
<!--      <cmd-cell-item title="消息通知" slot-left arrow @click="messageNotification"><cmd-icon type="message" size="24" color="#e52d27"></cmd-icon></cmd-cell-item>
      <cmd-cell-item title="后台管理" slot-left arrow @click="systemSetting"><cmd-icon type="settings" size="24" color="#e52d27"></cmd-icon></cmd-cell-item>
      <cmd-cell-item title="检查版本" addon="v1.0" slot-left arrow @click="checkVersion"><cmd-icon type="alert-circle" size="24" color="#e52d27"></cmd-icon></cmd-cell-item> -->
    </view>
    <view class="tologin" v-else><button style="background: #E51C23;color: #fff;" @click="toLogin">点击跳转到登录</button></view>
  </view>
</template>

<script>
import cmdAvatar from '@/components/cmd-avatar/cmd-avatar.vue';
import cmdIcon from '@/components/cmd-icon/cmd-icon.vue';
import cmdCellItem from '@/components/cmd-cell-item/cmd-cell-item.vue';

export default {
  components: {
    cmdAvatar,
    cmdCellItem,
    cmdIcon
  },
  data() {
    return {
      userInfo: {} // 用户信息
    };
  },
  methods: {
    /**
     * 打开用户信息页
     */
    fnInfoWin() {
      uni.navigateTo({
        url: '/pages/user/info'
      });
    },
    /**
     * 我的帖子
     */
    myPost() {
      uni.navigateTo({
        url: '../forum/myPost'
      });
    },
    /**
     * 消息通知
     */
    messageNotification() {
      uni.showModal({
        title: '提示',
        content: '你点击了 消息通知 ',
        success(res) {
          if (res.confirm) {
            uni.showToast({
              title: '你点击了确定',
              icon: 'none'
            });
          } else if (res.cancel) {
            uni.showToast({
              title: '你点击了取消',
              icon: 'none'
            });
          }
        }
      });
    },
    /**
     * 系统设置
     */
    systemSetting() {
      uni.showModal({
        title: '提示',
        content: '你点击了 后台管理 ',
        success(res) {
          if (res.confirm) {
            uni.showToast({
              title: '你点击了确定',
              icon: 'none'
            });
          } else if (res.cancel) {
            uni.showToast({
              title: '你点击了取消',
              icon: 'none'
            });
          }
        }
      });
    },
    /**
     * 检查版本
     */
    checkVersion() {
      uni.showModal({
        title: '提示',
        content: '你点击了 检查版本 ',
        success(res) {
          if (res.confirm) {
            uni.showToast({
              title: '你点击了确定',
              icon: 'none'
            });
          } else if (res.cancel) {
            uni.showToast({
              title: '你点击了取消',
              icon: 'none'
            });
          }
        }
      });
    },
    toLogin() {
      console.log("跳转到登录")
      uni.navigateTo({
        url: '../login/login',
        success: res => {
          uni.clearStorageSync();
        }
      });
    }
  },
  onLoad() {
    let userInfo = uni.getStorageSync('userInfo');
    console.log(userInfo);
    this.userInfo = userInfo;
  }
};
</script>

<style>
.person-wrap {
  width: 100%;
  background-color: #fff;
}
.person-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 150px;
  padding-left: 20px;
  background-color: #e52d27;
  /* background: linear-gradient(to right, #365fff, #36bbff); */
}

.person-head-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 10px;
}
.tologin {
  display: flex;
  height: 500upx;
  align-items: center;
}
.person-head-nickname {
  font-size: 18px;
  font-weight: 500;
  color: #fff;
}

.person-head-username {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}

.person-list {
  line-height: 0;
}
</style>
