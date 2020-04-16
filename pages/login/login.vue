<template>
  <view class="content"
>
    <view class="titlehuany">
      欢迎来到智慧社区，
      <text @tap="visitorAccess">游客访问</text>
    </view>
    <view class="inputs">
      <view class="input-row "><m-input class="m-input" type="text" clearable v-model="account.name" placeholder="请输入账号"></m-input></view>
      <view class="input-row"><m-input type="password" displayable v-model="account.password" placeholder="请输入密码"></m-input></view>
    </view>
    <navigator url="../pwd/pwd" style="color: #9E9E9E;text-align: right;margin-right: 40px;margin-top: 5px;">忘记密码?</navigator>
    <view class="btn-row">
      <!-- <button type="primary" class="primary" @tap="bindLogin">登录公众号</button> -->
      <button type="primary" class="primary" style="background-color: #E51C23;" @tap="accoutLogin">登录</button>
      <view class="barbottom" style="">
        <text style="color: #9E9E9E;">还没有账号？</text>
        <navigator url="../reg/reg">注册账号</navigator>
      </view>
      <!-- <button type="primary" class="primary" style="background-color: #E51C23;" >游客访问</button> -->
    </view>
    <view class="btn-row"></view>

    <view class="oauth-row" v-if="hasProvider" v-bind:style="{ top: positionTop + 'px' }">
      <view class="oauth-image" v-for="provider in providerList" :key="provider.value"><image :src="provider.image" @tap="oauth(provider.value)"></image></view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import mInput from '../../components/m-input.vue';
import loginimg  from '../../static/img/logins.png'
export default { 
  components: {
    mInput
  },
  data() {
    return {
      providerList: [],
      hasProvider: false,
      imageURL: require('../../static/img/logins.png'),
      account: {
        name: '',
        password: ''
      },
      positionTop: 0
    };
  },
  computed: mapState(['forcedLogin']),
  onLoad(option) {
    if (option.username) {
      this.account.name = option.username;
    }
    if (option.password) {
      this.account.password = option.password;
    }
    //#ifdef MP-WEIXIN
    this.miniLogin();
    //#endif
    //#ifdef APP-PLUS || H5

    this.appLogin();
    //#endif
  },
  methods: {
    ...mapMutations(['login']),
    initPosition() {
      /**
       * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
       * 反向使用 top 进行定位，可以避免此问题。
       */
      this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
    },

    oauth(value) {
      uni.login({
        provider: value,
        success: res => {
          uni.getUserInfo({
            provider: value,
            success: infoRes => {
              /**
               * 实际开发中，获取用户信息后，需要将信息上报至服务端。
               * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
               */
              this.toMain(infoRes.userInfo.nickName);
            }
          });
        },
        fail: err => {
          console.error('授权登录失败：' + JSON.stringify(err));
        }
      });
    },
    toMain(userName) {
      this.login(userName);
      /**
       * 强制登录时使用reLaunch方式跳转过来
       * 返回首页也使用reLaunch方式
       */
      if (this.forcedLogin) {
        uni.reLaunch({
          url: '../SmartCity/smartcity'
        });
      } else {
        uni.navigateBack();
      }
    },
    appLogin: async function() {},
    miniLogin: async function() {
      let self = this; // 重定向 this
      uni.showLoading({
        title: '小程序登录中'
      });

      //#ifdef MP-WEIXIN
      // 微信小程序获取登录状态
      let AuthorState = this.$store.getters.getAuthorState;
      let code = null;
      uni.setStorageSync('loginInfoSrvCk', ''); // 置空后台票据，准备重新获取
      // self.$store.commit("setWxLoginInfoSrvCk","")  // 置空后台票据，准备重新获取
      wx.login({
        success(res) {
          uni.hideLoading();
          if (res.code) {
            // 发起网络请求
            let ress = {
              url: self.$api.getLoginTicket,
              data: {
                code: res.code,
                app_no: '000003'
              }
            };
            // 发送code 到sso，获取会话信息 ssosessionid
            self.$http
              .post(ress.url, ress.data)
              .then(res => {
                console.log('res====?', res);
                if (res.data.resultCode === 'select_user_type') {
                  // 待绑定用户, 未绑定 百想帐号
                  if (res.data.ssosessionid && res.data.ssosessionid !== null && res.data.ssosessionid !== '' && res.data.ssosessionid !== undefined) {
                    try {
                      uni.setStorageSync('loginInfoSsos', res.data.ssosessionid); // 保存 sso 会话信息
                      uni.setStorageSync('loginInfoSsoCk', ''); //重置sso 票据，通过重新登录获取
                    } catch (e) {
                      // error
                    }
                    uni.hideLoading();
                    // self.showPopupMiddlea = true
                    // Vue.prototype.goWxLink("pages/login/login","navigateTo")
                  }
                } else if (res.data.resultCode === 'SUCCESS') {
                  // 登录成功 | 免登录用户 || 已绑定 百想帐号
                  let userNo = res.data.user_no;
                  if (
                    'ssosessionid' in res.data &&
                    'bxssocookieid' in res.data &&
                    res.data.ssosessionid !== null &&
                    res.data.ssosessionid !== '' &&
                    res.data.ssosessionid !== undefined
                  ) {
                    try {
                      uni.setStorageSync('loginInfoSsos', res.data.ssosessionid); // 保存 sso 会话信息
                      uni.setStorageSync('loginInfoSsoCk', res.data.bxssocookieid); //保存 sso 票据信息
                    } catch (e) {
                      // error
                    }
                    // let ssoCk = self.$store.getters.getWxLoginInfoSsoCk
                    let ssoCk = uni.getStorageSync('loginInfoSsoCk');
                    let logineds = self.$store.getters.getlogined;
                    // 通过sso凭证，获取后台会话
                    let promise = new Promise((resolve, reject) => {
                      let s = self.getSeesionId(ssoCk);
                      resolve(s);
                    });
                    promise.then(e => {
                      if (e) {
                        // 获取后台会话成功，设置本地登录状态，并返回用户页面
                        //console.log("2",e)
                        let users = {
                          logined: true,
                          user_info: {
                            user_no: res.data.user_no,
                            dept_no: '',
                            email: '',
                            mobile: '',
                            user_disp: '',
                            real_name: ''
                          }
                        };
                        self.$store.commit('setLogined', users.logined);
                        self.$store.commit('setUserNo', users.user_info);
                        // uni.navigateBack({ delta: 1})
                        uni.reLaunch({
                          url: '../SmartCity/smartcity'
                        });
                        // self.goWxLink('../home/home', 'reLaunch');
                      } else {
                        let users = {
                          logined: false
                        };

                        self.$store.commit('setLogined', users.logined);
                        //console.log("3:",e)
                      }
                      //console.log("获取seesionid 成功：",e,logineds,srvCk)
                    });
                  }
                } else {
                  //console.log("登录3！ssos",ssos,ssoCk,srvCk,srvCkCode)
                  return ssoCk;
                }
              })
              .catch(err => {
                //console.log('登录失败4！' + res.errMsg)
              });
          } else {
            //console.log('登录失败5！' + res.errMsg)
          }
        }
      });
      //#endif
    },
    visitorAccess() {
      // 游客访问
      uni.clearStorageSync();
      let url = this.$api.select + '/sso/operate/srvuser_login';
      let req = [{ serviceName: 'srvuser_login', data: [{ user_no: 'niming', pwd: '1' }] }];
      this.$http
        .post(url, req)
        .then(res => {
          if (res.data.resultCode === 'SUCCESS' && res.data.response) {
            let response = res.data.response[0].response;
            console.log('res,', response);
            let bx_auth_ticket = response.bx_auth_ticket;
            let userInfo = response.login_user_info;
            let loginTime = new Date().getTime() + response.expire_time * 1000;
            let expire_time = response.expire_time;
            uni.setStorageSync('bxAuthTicket', bx_auth_ticket); //保存凭证
            uni.setStorageSync('userInfo', userInfo); //保存用户信息
            uni.setStorageSync('expireTime', response.expire_time); //保存时效
            uni.setStorageSync('outTime', loginTime); //保存时效
            this.getUserInfo(userInfo.user_no); //获取用户信息并将用户信息保存到storage
          }
        })
        .then(() => {
          uni.switchTab({
            url: '/pages/SmartCity/smartcity'
          });
        });
    },
    accoutLogin() {
      uni.clearStorageSync();
      // 登录访问
      let self = this;
      let ssos = uni.getStorageSync('loginInfoSsos');
      // self.$store.getters.getWxLoginInfoSsos // 判断本地sso 会话信息是否可用
      // uni.showLoading({
      // 	title:"绑定中"
      // })
      console.log('ssos', ssos);
      switch (uni.getSystemInfoSync().platform) {
        case 'android':
          console.log('运行Android上');
          break;
        case 'ios':
          console.log('运行iOS上');
          break;
        default:
          console.log('运行在开发者工具上');
          break;
      }

      console.log('ssos', ssos, uni.getSystemInfoSync());
      let reqS = {
        url: self.$api.programlogin + ';SSOSESSIONID=' + ssos,
        data: [{ serviceName: 'srvuser_login', data: [{ user_no: self.account.name, pwd: self.account.password }] }]
      };
      if (ssos === '') {
        // #ifdef  MP-WEIXIN
        reqS.url = self.$api.programlogin;
        // #endif
        // #ifdef  APP-PLUS || H5
        reqS.url = self.$api.toLogin;
        // #endif
        // 发起登录请求
      } else {
        // #ifdef  MP-WEIXIN
        reqS.url = self.$api.programlogin + ';SSOSESSIONID=' + ssos;
        // #endif
        // #ifdef  APP-PLUS || H5
        reqS.url = self.$api.toLogin + ';SSOSESSIONID=' + ssos;
        // #endif
        // 发起登录请求
      }

      self.$http
        .post(reqS.url, reqS.data)
        .then(res => {
          this.login.loading = false;
          console.log(res.status, res.data, res.header);

          switch (res.data.resultCode) {
            case 'FAILURE':
              uni.showToast({
                icon: 'none',
                title: res.data.resultMessage
              });
              break;
            case 'bind_login_success':
              // 绑定登录成功，设置登录状态
              let users = {
                logined: true,
                user_info: {
                  user_no: res.data.user_no,
                  dept_no: '',
                  email: '',
                  mobile: '',
                  user_disp: '',
                  real_name: ''
                }
              };

              self.$store.commit('setLogined', users.logined);
              self.$store.commit('setUserNo', users.user_info);
              // 返回用户界面

              let promise = new Promise((resolve, reject) => {
                let s = self.getSeesionId(res.data.bxssocookieid);
                resolve(s);
              });
              promise.then(e => {
                if (e) {
                  // 获取后台会话成功，设置本地登录状态，并返回用户页面
                  //console.log("2",e)
                  let users = {
                    logined: true,
                    user_info: {
                      user_no: res.data.user_no,
                      dept_no: '',
                      email: '',
                      mobile: '',
                      user_disp: '',
                      real_name: ''
                    }
                  };
                  self.$store.commit('setLogined', users.logined);
                  self.$store.commit('setUserNo', users.user_info);
                  uni.setStorageSync('loginInfoSrvCk', e); //保存 后端服务 票据信息
                  // uni.navigateBack({ delta: 1})
                  uni.switchTab({
                    url: '/pages/SmartCity/smartcity'
                  });
                  // self.goWxLink('../home/home', 'reLaunch');
                } else {
                  let users = {
                    logined: false
                  };

                  self.$store.commit('setLogined', users.logined);
                  //console.log("3:",e)
                }
                //console.log("获取seesionid 成功2：",e)
              });
              uni.navigateBack({ delta: 1 });
              break;
            case 'bind_login_failure':
              uni.showToast({
                icon: 'none',
                title: res.data.resultMessage
              });
              break;
            case 'unbind_login_success':
              uni.showToast({
                icon: 'none',
                title: res.data.resultMessage
              });
              break;
            case 'SUCCESS':
              // 绑定登录成功，设置登录状态
              let bx_auth_ticket = res.data.response[0].response.bx_auth_ticket;
              let userInfo = res.data.response[0].response.login_user_info;
              let loginTime = new Date().getTime() + res.data.response[0].response.expire_time * 1000;
              let expire_time = res.data.response[0].response.expire_time;
              uni.setStorageSync('bxAuthTicket', bx_auth_ticket); //保存凭证
              // console.log('userInfo',userInfo)
              uni.setStorageSync('userInfo', userInfo); //保存用户信息
              uni.setStorageSync('expireTime', res.data.response[0].response.expire_time); //保存时效
              uni.setStorageSync('outTime', loginTime); //保存时效
              this.getUserInfo(userInfo.user_no); //获取用户信息并将用户信息保存到storage
              let use = {
                logined: true,
                user_info: {
                  user_no: userInfo.user_no,
                  dept_no: '',
                  email: '',
                  mobile: '',
                  user_disp: '',
                  real_name: ''
                }
              };
              self.$store.commit('setLogined', use.logined);

              let menureq = { serviceName: 'srvauth_user_app_menu_select', colNames: ['*'] };
              let appMenu = self.$http.post(self.$api.getUserAppMenu, menureq).then(res => {
                return res;
              });
              console.log('menureq', menureq);
              // self.goWxLink('../home/home', 'reLaunch');
              uni.switchTab({
                url: '/pages/SmartCity/smartcity'
              });
              break;
            default:
              break;
          }
        })
        .catch(err => {
          this.login.loading = false;
          console.error(err.status, err.message);
        });
    },
    getUserInfo(user_no) {
      // 获取当前登录账号的信息
      if (user_no) {
        const url = this.$api.select + '/sso/select/srvsso_user_select';
        const req = {
          serviceName: 'srvsso_user_select',
          condition: [{ colName: 'user_no', ruleType: 'eq', value: user_no }],
          colNames: ['*'],
          hisVer: true
        };
        let url3 = this.$api.select + '/sqfw/select/srvzhsq_reg_select';
        let req3 = {
          serviceName: 'srvzhsq_reg_select',
          colNames: ['*'],
          condition: [{ colName: 'user_no', ruleType: 'eq', value: user_no }]
        };
        this.$http.post(url3, req3).then(res => {
          if (res.data.data) {
            let userInfo = res.data.data[0];
            // Object.assign(this.userInfo, userInfo);
            console.log('userInfo',userInfo)
            if(userInfo){
              uni.setStorageSync('userInfo',userInfo);
            }
          }
        });
        this.$http.post(url, req).then(res => {
          if (res.data.data && res.data.data[0]) {
            const userInfo = res.data.data[0];
            if (userInfo.photo_url) {
              const url2 = this.$api.select + '/file/select/srvfile_attachment_select';
              const req2 = {
                serviceName: 'srvfile_attachment_select',
                colNames: ['*'],
                condition: [{ colName: 'file_no', value: userInfo.photo_url, ruleType: 'eq' }, { colName: 'is_delete', value: '1', ruleType: 'eq' }]
              };
              this.$http.post(url2, req2).then(res2 => {
                if (res2.data.data && res2.data.data[0]) {
                  let head_img = res2.data.data[0].fileurl;
                  head_img = this.$api.select + '/file/download?filePath=' + head_img;
                  let userInfo = uni.getStorageSync('userInfo');
                  userInfo.head_img_path = head_img;
                  uni.setStorageSync('userInfo', userInfo); //保存用户信息
                }
              });
            }
          }
        });
      }
    }
  },
  onReady() {
    this.initPosition();
    // this.initProvider();
  }
};
</script>

<style>
.primary {
  margin: 0upx 80upx 10px 80upx;
  border-radius: 50upx;
  letter-spacing: 1em;
  height: 80upx;
  line-height: 80upx;
}
.content {
  background-image: url(../../static/img/logins.png);
  height: 100vh;
  width: 100%;
  background-size: cover;
  position: relative;
}
.action-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.action-row navigator {
  color: #007aff;
  padding: 0 20upx;
}

.oauth-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.oauth-image {
  width: 100upx;
  height: 100upx;
  border-radius: 100upx;
  margin: 0 40upx;
  background-color: #ffffff;
}

.oauth-image image {
  width: 60upx;
  height: 60upx;
  margin: 20upx;
}
.inputs {
  margin: 0 30upx;
  margin-top: 35vh;
}
.titlehuany {
  /* line-height: 60vh; */
  position: absolute;
  top: 27vh;
  left: 13vw;
  font-size: 17px;
  font-family: Arial;
  font-weight: lighter;
  letter-spacing: 1px;
}
.titlehuany text {
  color: red;
  border-bottom: 0.5px solid red;
}

.input-row {
  width: calc(100% - 100upx);
  height: 50px;
  margin: 20px 50upx;
  box-sizing: border-box;
  border: none;
}
.barbottom {
  display: flex;
  margin-left: 28vw;
}
</style>
