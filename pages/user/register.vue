<template>
  <view>
    <!-- <cmd-nav-bar back title="用户注册"></cmd-nav-bar> -->
    <cmd-page-body type="top">
      <view class="register">
        <!-- 上部分 start -->
        <!-- <view class="register-title">{{ status ? '手机快捷注册': '账号密码注册'}}</view> -->
        <view class="register-title">账号密码注册</view>
        <!-- <view class="register-explain">{{ status ? '用户可通过手机验证码直接注册': '使用账号密码注册后请绑定手机号'}}</view> -->
        <view class="register-explain">用户名长度不得小于4位，密码长度不得小于6位</view>
        <!-- 上部分 end -->
        <!-- 账号表单注册 start -->
        <!-- #ifdef H5 -->
        <cmd-transition name="fade-up">
          <view>
            <view class="register-username"><cmd-input v-model="account.username" type="text" focus maxlength="26" placeholder="请输入账号"></cmd-input></view>
            <view class="register-password"><cmd-input v-model="account.password" type="password" displayable maxlength="26" placeholder="请输入密码"></cmd-input></view>
            <button class="btn-register" :class="registerAccount ? 'btn-register-active' : ''" :disabled="!registerAccount" hover-class="btn-register-hover" @tap="fnRegister">
              注册
            </button>
          </view>
        </cmd-transition>
        <!-- #endif -->
        <!-- 账号表单注册 end -->
      </view>
    </cmd-page-body>
  </view>
</template>

<script>
import cmdNavBar from '@/components/cmd-nav-bar/cmd-nav-bar.vue';
import cmdPageBody from '@/components/cmd-page-body/cmd-page-body.vue';
import cmdTransition from '@/components/cmd-transition/cmd-transition.vue';
import cmdInput from '@/components/cmd-input/cmd-input.vue';

export default {
  components: {
    cmdNavBar,
    cmdPageBody,
    cmdTransition,
    cmdInput
  },

  data() {
    return {
      account: {
        username: '',
        password: ''
      },
      usernameReg: /^[A-Za-z0-9]+$/,
      passwordReg: /^\w+$/,
      registerAccount: false,
      mobile: {
        phone: '',
        code: ''
      },
      phoneReg: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
      registerMobile: false,
      safety: {
        time: 60,
        state: false,
        interval: ''
      }
    };
  },

  watch: {
    /**
     * 监听账号注册数值
     */
    account: {
      handler(newValue) {
        if (this.usernameReg.test(newValue.username) && newValue.username.length >= 4 && (this.passwordReg.test(newValue.password) && newValue.password.length >= 6)) {
          this.registerAccount = true;
        } else {
          this.registerAccount = false;
        }
      },
      deep: true
    }
  },

  methods: {
    /**
     * 注册按钮点击执行
     */
    fnRegister() {
      console.log(JSON.stringify(this.account));
      let account = this.account;
      if (this.usernameReg.test(account.username) === false || account.username.length < 4) {
        uni.showToast({
          title: '警告!用户名长度必须大于4位'
        });
        return;
      }
      if (this.passwordReg.test(account.password) === false || account.password.length < 6) {
        uni.showToast({
          title: '警告!密码长度必须大于6位'
        });
        return;
      }
      let url = this.$api.select + '/sso/operate/srvsso_user_add';
      let req = [{ serviceName: 'srvsso_user_add', condition: [], data: [{ user_no: account.username, pwd: account.password, user_state: '正常' }] }];
      this.$http.post(url, req).then(res => {
        if (res.data.resultCode === 'SUCCESS') {
          uni.showModal({
            title: '提示',
            content: "注册成功，即将跳转到登录页面",
            showCancel:false,
            success: (res) => {
              if(res.confirm){
                uni.reLaunch({
                  url: '../login/login?username='+account.username+"&password="+account.password
                });
              }
            }
          });
        } else {
          uni.showModal({
            title: '提示',
            content: res.data.resultMessage
          });
        }
      });
    },
    /**
     * 获取验证码
     */
    fnGetPhoneCode() {
      if (this.phoneReg.test(this.mobile.phone)) {
        uni.showToast({
          title: '正在发送验证码',
          icon: 'loading',
          success: () => {
            // 成功后显示倒计时60s后可在点击
            this.safety.state = true;
            // 倒计时
            this.safety.interval = setInterval(() => {
              if (this.safety.time-- <= 0) {
                this.safety.time = 60;
                this.safety.state = false;
                clearInterval(this.safety.interval);
              }
            }, 1000);
            uni.showToast({
              title: '发送成功',
              icon: 'success'
            });
          }
        });
      } else {
        uni.showToast({
          title: '手机号不正确',
          icon: 'none'
        });
      }
    },
    /**
     * 改变注册方式状态
     */
    fnChangeStatus() {
      this.mobile = {
        phone: '',
        code: ''
      };
      this.registerAccount = false;
      this.account = {
        username: '',
        password: ''
      };
      this.registerMobile = false;
      // 验证码时间状态还原
      clearInterval(this.safety.interval);
      this.safety.time = 60;
      this.safety.state = false;
      // 可以延迟3后切换
      this.status = !this.status;
    }
  },

  beforeDestroy() {
    /**
     * 关闭页面清除轮询器
     */
    clearInterval(this.safety.interval);
  }
};
</script>

<style>
.register {
  margin-top: 56upx;
  margin-right: 72upx;
  margin-left: 72upx;
}

.register-title {
  font-size: 56upx;
  font-weight: 500;
}

.register-explain {
  font-size: 28upx;
  color: #9e9e9e;
}

.register-phone {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2upx #dedede solid;
  margin-top: 56upx;
  margin-bottom: 40upx;
}

.register-phone-getcode {
  color: #3f51b5;
  text-align: center;
  min-width: 140upx;
}

.register-code {
  border-bottom: 2upx #dedede solid;
}

.register-username {
  margin-top: 56upx;
  margin-bottom: 40upx;
  border-bottom: 2upx #dedede solid;
}

.register-password {
  border-bottom: 2upx #dedede solid;
}

.btn-register {
  margin-top: 100upx;
  border-radius: 50upx;
  font-size: 16px;
  color: #fff;
  background: rgb(229, 28, 35);
  /* background: linear-gradient(to right, #88a1f9, #9ac6ff); */
}

.btn-register-active {
  background: rgb(229, 28, 35);
  /* background: linear-gradient(to right, #365fff, #36bbff); */
}

.btn-register-hover {
  background: rgb(229, 28, 35);
  /* background: linear-gradient(to right, #365fdd, #36bbfa); */
}

button[disabled] {
  color: #fff;
  background-color:rgba(229, 28, 35,.5) ;
}

.register-mode {
  text-align: center;
  margin-top: 32upx;
}
</style>
