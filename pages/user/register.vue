<template>
  <view>
    <!-- <cmd-nav-bar back title="用户注册"></cmd-nav-bar> -->
    <cmd-page-body type="top">
      <view class="register">
        <!-- 上部分 start -->
        <view class="register-title">{{ status ? '手机快捷注册': '账号密码注册'}}</view>
        <view class="register-explain">{{ status ? '用户可通过手机验证码直接注册': '使用账号密码注册后请绑定手机号'}}</view>
        <!-- 上部分 end -->
        <!-- 手机表单注册 start -->
        <!-- #ifdef H5 -->
        <cmd-transition name="fade-up">
          <view v-if="status">
            <view class="register-phone">
              <cmd-input v-model="mobile.phone" type="number" focus maxlength="11" placeholder="请输入手机号"></cmd-input>
              <view class="register-phone-getcode" @tap="!safety.state ? fnGetPhoneCode() : ''">{{!safety.state&&'获取验证码'||(safety.time+' s')}}</view>
            </view>
            <view class="register-code">
              <cmd-input v-model="mobile.code" type="number" maxlength="6" placeholder="请输入短信验证码"></cmd-input>
            </view>
            <button class="btn-register" :class="registerMobile ? 'btn-register-active':''" :disabled="!registerMobile"
              hover-class="btn-register-hover" @tap="fnRegister">注册</button>
          </view>
        </cmd-transition>
        <!-- #endif -->
        <!-- #ifndef H5 -->
        <cmd-transition name="fade-up" v-if="status">
          <view class="register-phone">
            <cmd-input v-model="mobile.phone" type="number" focus maxlength="11" placeholder="请输入手机号"></cmd-input>
            <view class="register-phone-getcode" @tap="!safety.state ? fnGetPhoneCode() : ''">{{!safety.state&&'获取验证码'||(safety.time+' s')}}</view>
          </view>
          <view class="register-code">
            <cmd-input v-model="mobile.code" type="number" maxlength="6" placeholder="请输入短信验证码"></cmd-input>
          </view>
          <button class="btn-register" :class="registerMobile ? 'btn-register-active':''" :disabled="!registerMobile"
            hover-class="btn-register-hover" @tap="fnRegister">注册</button>
        </cmd-transition>
        <!-- #endif -->
        <!-- 手机表单注册 end -->
        <!-- 账号表单注册 start -->
        <!-- #ifdef H5 -->
        <cmd-transition name="fade-up">
          <view v-if="!status">
            <view class="register-username">
              <cmd-input v-model="account.username" type="text" focus maxlength="26" placeholder="请输入账号"></cmd-input>
            </view>
            <view class="register-password">
              <cmd-input v-model="account.password" type="password" displayable maxlength="26" placeholder="请输入密码"></cmd-input>
            </view>
            <button class="btn-register" :class="registerAccount ? 'btn-register-active':''" :disabled="!registerAccount"
              hover-class="btn-register-hover" @tap="fnRegister">注册</button>
          </view>
        </cmd-transition>
        <!-- #endif -->
        <!-- #ifndef H5 -->
        <cmd-transition name="fade-up" v-if="!status">
          <view class="register-username">
            <cmd-input v-model="account.username" type="text" focus maxlength="26" placeholder="请输入账号"></cmd-input>
          </view>
          <view class="register-password">
            <cmd-input v-model="account.password" type="password" displayable maxlength="26" placeholder="请输入密码"></cmd-input>
          </view>
          <button class="btn-register" :class="registerAccount ? 'btn-register-active':''" :disabled="!registerAccount"
            hover-class="btn-register-hover" @tap="fnRegister">注册</button>
        </cmd-transition>
        <!-- #endif -->
        <!-- 账号表单注册 end -->
        <!-- 切换注册方式 -->
        <view class="register-mode" @tap="fnChangeStatus">{{status ?	'账号密码注册' : '手机快捷注册'}}</view>
      </view>
    </cmd-page-body>
  </view>

</template>

<script>
  import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue"
  import cmdPageBody from "@/components/cmd-page-body/cmd-page-body.vue"
  import cmdTransition from "@/components/cmd-transition/cmd-transition.vue"
  import cmdInput from "@/components/cmd-input/cmd-input.vue"

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
        },
        status: true // true手机注册,false账号注册
      };
    },

    watch: {
      /**
       * 监听手机注册数值
       */
      mobile: {
        handler(newValue) {
          if (this.phoneReg.test(newValue.phone) && newValue.code.length === 6) {
            this.registerMobile = true;
          } else {
            this.registerMobile = false;
          }
        },
        deep: true
      },
      /**
       * 监听账号注册数值
       */
      account: {
        handler(newValue) {
          if ((this.usernameReg.test(newValue.username) && newValue.username.length >= 8) && (this.passwordReg.test(
              newValue
              .password) && newValue.password.length >= 8)) {
            this.registerAccount = true;
          } else {
            this.registerAccount = false
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
        if (this.status) {
          console.log(JSON.stringify(this.mobile));
        } else {
          console.log(JSON.stringify(this.account));
        }
      },
      /**
       * 获取验证码
       */
      fnGetPhoneCode() {
        if (this.phoneReg.test(this.mobile.phone)) {
          uni.showToast({
            title: "正在发送验证码",
            icon: "loading",
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
                title: "发送成功",
                icon: "success"
              })
            }
          })
        } else {
          uni.showToast({
            title: "手机号不正确",
            icon: "none"
          })
        }
      },
      /**
       * 改变注册方式状态
       */
      fnChangeStatus() {
        this.mobile = {
          phone: '',
          code: ''
        }
        this.registerAccount = false
        this.account = {
          username: '',
          password: ''
        }
        this.registerMobile = false
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
  }
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
    color: #9E9E9E;
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
    color: #3F51B5;
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
    background: linear-gradient(to right, #88a1f9, #9ac6ff);
  }

  .btn-register-active {
    background: linear-gradient(to right, #365fff, #36bbff);
  }

  .btn-register-hover {
    background: linear-gradient(to right, #365fdd, #36bbfa);
  }

  button[disabled] {
    color: #fff;
  }

  .register-mode {
    text-align: center;
    margin-top: 32upx;
  }
</style>
