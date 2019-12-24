<template>
  <view>
    <!-- <cmd-nav-bar back title="修改密码"></cmd-nav-bar> -->
    <cmd-page-body type="top">
      <cmd-transition name="fade-up">
        <view class="modify">
          <view class="modify-phone">
            <cmd-input v-model="mobile.phone" type="number" maxlength="11" placeholder="请输入手机号"></cmd-input>
            <view class="modify-phone-getcode" :style="safety.state ? 'color: #2196F3;':''" @tap="!safety.state ? fnGetPhoneCode() : ''">{{!safety.state&&'获取验证码'||(safety.time+' s')}}</view>
          </view>
          <view class="modify-code">
            <cmd-input v-model="mobile.code" type="number" maxlength="6" placeholder="请输入短信验证码"></cmd-input>
          </view>
          <view class="modify-password">
            <cmd-input v-model="mobile.passwordOne" type="password" displayable maxlength="26" placeholder="请输入新密码"></cmd-input>
          </view>
          <view class="modify-password">
            <cmd-input v-model="mobile.passwordTwo" type="password" maxlength="26" placeholder="请再次确认新密码"></cmd-input>
          </view>
          <button class="btn-modify" :class="modifyMobile ? 'btn-modify-active':''" :disabled="!modifyMobile"
            hover-class="btn-modify-hover" @tap="fnModify">提交</button>
        </view>
      </cmd-transition>
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
        mobile: {
          phone: '',
          code: '',
          passwordOne: '',
          passwordTwo: ''
        },
        passwordReg: /^\w+$/,
        phoneReg: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
        safety: {
          time: 60,
          state: false,
          interval: ''
        },
        modifyMobile: false
      };
    },

    watch: {
      /**
       * 监听表单数值
       */
      mobile: {
        handler(newValue) {
          if (this.phoneReg.test(newValue.phone) && newValue.code.length == 6 && newValue.passwordOne.length >= 8 &&
            newValue.passwordOne == newValue.passwordTwo) {
            this.modifyMobile = true;
          } else {
            this.modifyMobile = false;
          }
        },
        deep: true
      }
    },

    methods: {
      /**
       * 提交按钮点击执行
       */
      fnModify() {
        console.log(JSON.stringify(this.mobile));
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
  .modify {
    margin-top: 118upx;
    margin-right: 72upx;
    margin-left: 72upx;
    background-color: #fff;
  }

  .modify-phone {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2upx #dedede solid;
    margin-top: 118upx;
    margin-bottom: 40upx;
  }

  .modify-phone-getcode {
    color: #3F51B5;
    text-align: center;
    min-width: 140upx;
  }

  .modify-password,
  .modify-code {
    margin-bottom: 40upx;
    border-bottom: 2upx #dedede solid;
  }

  .btn-modify {
    margin-top: 100upx;
    border-radius: 50upx;
    font-size: 16px;
    color: #fff;
    background: linear-gradient(to right, #88a1f9, #9ac6ff);
  }

  .btn-modify-active {
    background: linear-gradient(to right, #365fff, #36bbff);
  }

  .btn-modify-hover {
    background: linear-gradient(to right, #365fdd, #36bbfa);
  }

  button[disabled] {
    color: #fff;
  }
</style>
