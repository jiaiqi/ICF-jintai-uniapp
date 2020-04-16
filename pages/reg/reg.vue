<template>
  <view class="content">
    <view class="cu-form-group margin-top">
      <text class="title">
        <text class="required">*</text>
        账号：
      </text>
      <input type="text" focus clearable v-model="regInfo.user_no" placeholder="请输入账号" />
    </view>
    <view class="cu-form-group margin-top">
      <text class="title">
        <text class="required">*</text>
        密码：
      </text>
      <input type="password" focus clearable v-model="regInfo.pwd" placeholder="请输入密码" />
    </view>
    <view class="cu-form-group margin-top">
      <text class="title">
        <text class="required">*</text>
        重复密码：
      </text>
      <input type="password" focus clearable v-model="regInfo.rePwd" placeholder="请再次输入密码" />
    </view>

    <view class="cu-form-group margin-top">
      <text class="title">
        <text class="required">*</text>
        姓名：
      </text>
      <input type="text" focus clearable v-model="regInfo.real_name" placeholder="请输入姓名" />
    </view>
	<view class="cu-form-group margin-top">
	  <text class="title">
	    <text class="required">*</text>
	    身份证号：
	  </text>
	  <input type="text" focus clearable v-model="regInfo.id_card" placeholder="请输入姓名" />
	</view>
    <view class="cu-form-group margin-top">
      <text class="title">
        <text class="required"></text>
        年龄：
      </text>
      <input type="number" focus clearable v-model="regInfo.age" placeholder="请输入年龄" />
    </view>
    <view class="cu-form-group margin-top">
      <view class="title">性别</view>
      <picker @change="sexChange" :value="sexindex" :range="sexpicker">
        <view class="picker" style="width:50%;text-align: left;">{{ regInfo.gender ? regInfo.gender : '点击选择性别' }}</view>
      </picker>
    </view>
    <!--   <view class="cu-form-group margin-top">
      <text class="title">
        <text class="required"></text>
        性别：
      </text>
      <input type="text" displayable v-model="regInfo.gender" placeholder="请输入性别" />
    </view> -->
    <view class="cu-form-group margin-top">
      <text class="title">
        <text class="required">*</text>
        手机号：
      </text>
      <input type="number" displayable v-model="regInfo.mobile" placeholder="请输入手机号" />
    </view>
    <view class="cu-form-group margin-top">
      <text class="title">
        <text class="required">*</text>
        邮箱：
      </text>
      <input type="email" displayable v-model="regInfo.email" placeholder="请输入邮箱" />
    </view>
    <view class="cu-form-group margin-top">
      <text class="title">
        <text class="required"></text>
        昵称：
      </text>
      <input type="text" displayable v-model="regInfo.nick_name" placeholder="昵称" />
    </view>
    <view class="cu-form-group margin-top">
      <text class="title">
        <text class="required"></text>
        所在社区：
      </text>
      <picker @change="sqChange" :value="sqindex" :range="sqpicker">
        <view class="picker">{{ sqindex > -1 ? sqpicker[sqindex] : '请选择社区' }}</view>
      </picker>
  <!--    <text class="title">
        <text class="required"></text>
        所在社区：
      </text>
      <input type="text" displayable v-model="regInfo.address" placeholder="请选择" /> -->
    </view>
    <view class="cu-form-group margin-top">
      <text class="title">
        <text class="required"></text>
        详细地址：
      </text>
      <input type="text" displayable v-model="regInfo.detail_address" placeholder="请输入详细地址" />
    </view>
    <!--   <view class="cu-form-group margin-top">
        <text class="title"><text class="required" > </text>签名：</text>
        <input type="text" displayable v-model="regInfo.signature" placeholder="请输入签名" />
      </view> -->
    <view class="cu-form-group margin-top">
      <text class="title">
        <text class="required">*</text>
        图形验证码：
      </text>
      <input type="text" displayable v-model="regInfo.image_code" placeholder="输入验证码" />
      <image :src="imgCode" @click="changeImgCode" style="width: 100px;height: 40px;"></image>
    </view>
    <view class="cu-form-group margin-top">
      <text class="title">
        <text class="required">*</text>
        手机验证码：
      </text>
      <input type="text" displayable v-model="regInfo.text_code" placeholder="输入验证码" />
      <button class="cu-btn bg-green shadow" @click="getPhoneCode">发送</button>
    </view>
    <view class="btn-row"><button type="primary" class="primary" @tap="register">注册</button></view>
  </view>
</template>

<script>
import service from '../../service.js';

export default {
  data() {
    return {
      sexpicker: ['男', '女'],
      sexindex: -1,
      sqindex:-1,
      sqpicker:[],
      sqList:'',
      regInfo: {
        user_no: '',
        pwd: '',
        rePwd: '',
        image_code: '',
        real_name: '',
        age: '',
        gender: '',
        mobile: '',
        email: '',
		id_card:'',
		user_type: "外部员工",
        // nick_name: '',
        // photo_url: '',
        // address: '',
        // detail_address: '',
        // signature: '',
        text_code: ''
      },
      imgCode: ''
    };
  },
  onLoad() {
    let a = uni.getStorageSync('bxAuthTicket');
    console.log('StorageSync("bxAuthTicket")', a);
    this.getImgCode();
    this.getSqList()
  },
  methods: {
    sexChange(e) {
      let i = e.detail.value;
      this.sexindex =i
      this.regInfo.gender = this.sexpicker[i];
    },
    sqChange(e){
      // 选择社区
      let i = e.detail.value;
      this.sqindex = i
      this.regInfo.address = this.sqList[i].sqno;
      console.log(`你选择了${this.sqList[i].sqno}`)
    },
    getImgCode() {
      let url = this.$api.select + '/sqfw/operate/srvsqfw_get_image';
      let res = this.$http
        .post(url, [
          {
            serviceName: 'srvsqfw_get_image'
          }
        ])
        .then(res => {
          if (res.headers.bx_auth_ticket && res.headers.bx_auth_ticket[0]) {
            uni.setStorageSync('bxAuthTicket', res.headers.bx_auth_ticket[0]);
          }
          console.log(res);
          this.imgCode = res.data.response['0'].response.base64String;
        });
    },
    changeImgCode() {
      setTimeout(() => {
        this.getImgCode();
      }, 100);
    },
    getSqList() {
      // 查找社区列表
      let url = this.$api.select + '/sqfw/select/srvzhsq_information_select';
      let req = { serviceName: 'srvzhsq_information_select', queryMethod: 'select', distinct: false, colNames: ['*'], condition: [], page: { pageNo: 1, rownumber: 50 } };
      let res = this.$http.post(url, req).then(res => {
        if(res.data.data){
          let data = res.data.data
          let sqArr = []
          let sqpicker = []
          data.map(item=>{
            sqArr.push({
              sqname:item.sqname,
              sqno:item.sqno
            })
            sqpicker.push(item.sqname)
          })
          this.sqList = sqArr
          this.sqpicker = sqpicker
        }
      });
    },
    getPhoneCode() {
      let url = this.$api.select + '/sqfw/operate/srvsqfw_mobile_send';
      let req = [
        {
          data: [
            {
              image_code: this.regInfo.image_code,
              mobile: this.regInfo.mobile
            }
          ],
          serviceName: 'srvsqfw_mobile_send'
        }
      ];
      this.$http.post(url, req).then(res => {
        console.log(res);
        if (res.data.resultCode === 'SUCCESS') {
          uni.showToast({
            title: '短信验证码发送成功，请注意查收',
            icon: 'none'
          });
        } else {
          uni.showToast({
            title: res.data.resultMessage,
            icon: 'none'
          });
        }
      });
    },
    register() {
      let data = this.regInfo;
      let regExp = {
        //正则
        mobile: /^1[3456789]\d{9}$/, //手机号
        email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, // 邮箱
        pwd: /^[\w_-]{6,16}$/, //密码
        user_no: /^[0-9a-zA-Z_]{1,}$/, //账号
        id_card:  /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ //身份证号
      };
      if (data.user_no.length < 5) {
        uni.showToast({
          icon: 'none',
          title: '账号最短为5个字符'
        });
        return;
      }
      if (data.pwd.length < 6) {
        uni.showToast({
          icon: 'none',
          title: '密码最短为6个字符'
        });
        return;
      }
      if (data.pwd !== data.rePwd) {
        uni.showToast({
          icon: 'none',
          title: '两次输入的密码不一致'
        });
        return;
      }
	  if(!regExp.id_card.test(data.id_card)){
		  uni.showToast({
		    icon: 'none',
		    title: '身份证格式有误'
		  });
		  return;
	  }
      if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(data.email) != true) {
        uni.showToast({
          icon: 'none',
          title: '邮箱格式有误'
        });
        return;
      }
      if (/^1[3456789]\d{9}$/.test(data.mobile) != true) {
        uni.showToast({
          icon: 'none',
          title: '手机号格式有误'
        });
        return;
      }
      // let url = this.$api.select + '/sso/operate/srvsso_user_add'
      let url = this.$api.select + '/sqfw/operate/srvsqfw_register';
      let req = [
        {
          data: [this.regInfo],
          serviceName: 'srvsqfw_register'
        }
      ];
      // let req =[{"serviceName":"srvsso_user_add","condition":[],"data":[{"user_no":data.user_no,"pwd":data.pwd,"user_state":"正常"}]}]
      this.$http.post(url, req).then(res => {
        console.log(res);
        if (res.data.resultCode === 'FAILURE') {
          uni.showToast({
            title: res.data.resultMessage,
            icon: 'none'
          });
        } else if (res.data.resultCode === 'SUCCESS') {
          uni.showModal({
            title: '提示',
            content: '注册成功，即将跳转到登录页面',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                uni.reLaunch({
                  url: '../login/login'
                });
              }
            }
          });
        }
      });
      // uni.navigateBack({
      //   delta: 1
      // });
    }
  }
};
</script>

<style lang="scss">
.input-group {
  .input-row {
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      height: auto;
    }
  }
}
.required {
  padding: 0 10upx;
  color: red;
}
.cu-form-group {
  .title {
    min-width: 25%;
  }
  input {
    // flex:5
  }
}
</style>
