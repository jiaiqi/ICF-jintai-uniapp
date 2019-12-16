<template>
  <view class="content">
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" >*</text>账号：</text>
        <input type="text" focus clearable v-model="regInfo.user_no" placeholder="请输入账号"></input>
      </view>
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" >*</text>密码：</text>
        <input type="password" focus clearable v-model="regInfo.pwd" placeholder="请输入密码"></input>
      </view>
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" >*</text>重复密码：</text>
        <input type="password" focus clearable v-model="regInfo.rePwd" placeholder="请再次输入密码"></input>
      </view>
      
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" > </text>姓名：</text>
        <input type="text" focus clearable v-model="regInfo.real_name" placeholder="请输入姓名"></input>
      </view>
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" > </text>年龄：</text>
        <input type="number" focus clearable v-model="regInfo.age" placeholder="请输入年龄"></input>
      </view>
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" > </text>性别：</text>
        <input type="password" displayable v-model="regInfo.gender" placeholder="请输入性别"></input>
      </view>
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" >*</text>手机号：</text>
        <input type="number" displayable v-model="regInfo.mobile" placeholder="请输入手机号"></input>
      </view>
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" > </text>邮箱：</text>
        <input type="email" displayable v-model="regInfo.email" placeholder="请输入邮箱"></input>
      </view>
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" > </text>昵称：</text>
        <input type="text" displayable v-model="regInfo.nick_name" placeholder="昵称"></input>
      </view>
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" > </text>头像：</text>
        <input type="text" displayable v-model="regInfo.photo_url" placeholder="请输入密码"></input>
      </view>
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" > </text>地址：</text>
        <input type="text" displayable v-model="regInfo.address" placeholder="请输入地址"></input>
      </view>
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" > </text>详细地址：</text>
        <input type="text" displayable v-model="regInfo.detail_address" placeholder="请输入详细地址"></input>
      </view>
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" > </text>签名：</text>
        <input type="text" displayable v-model="regInfo.signature" placeholder="请输入签名"></input>
      </view>
      <view class="cu-form-group margin-top">
         <text class="title"><text class="required" >*</text>图形验证码：</text>
         <input type="text" displayable v-model="regInfo.image_code" placeholder="输入验证码"></input>
         <image :src="imgCode" @click="changeImgCode" style="width: 100px;height: 40px;"></image>
       </view>
      <view class="cu-form-group margin-top">
        <text class="title"><text class="required" >*</text>手机验证码：</text>
        <input type="text" displayable v-model="regInfo.text_code" placeholder="输入验证码"></input>
     <button class='cu-btn bg-green shadow' @click="getPhoneCode">发送</button>
      </view>
    <view class="btn-row"><button type="primary" class="primary" @tap="register">注册</button></view>
  </view>
</template>

<script>
import service from '../../service.js';
// import mInput from '../../components/input.vue';

export default {
  components: {
    
  },
  data() {
    return {
      regInfo: {
        user_no: '',
        pwd: '',
        rePwd:'',
        image_code:'',
        real_name: '',
        age: '',
        gender: '',
        mobile: '',
        email: '',
        nick_name: '',
        photo_url: '',
        address: '',
        detail_address: '',
        signature: '',
        text_code: ''
      },
      imgCode:this.$api.select + '/sqfw/imageCode/getImageCode',
      
    };
  },
  onLoad() {
  },
  methods: {
    changeImgCode(){
      setTimeout(()=>{
        this.imgCode = this.$api.select + '/sqfw/imageCode/getImageCode?xx='+Math.random()
      },100)
    },
	getPhoneCode(){
		let url = this.$api.select + '/sqfw/operate/srvsqfw_mobile_send'
		let req = {
			"image_code":this.regInfo.image_code,
			"mobile":this.regInfo.mobile, 
			serviceName:'srvsqfw_mobile_send'
		}
		this.$http.post(url,req).then(res=>{
			console.log(res)
		})
	},
    register() {
      /**
       * 客户端对账号信息进行一些必要的校验。
       * 实际开发中，根据业务需要进行处理，这里仅做示例。
       */
      
      // if (this.account.length < 5) {
      //   uni.showToast({
      //     icon: 'none',
      //     title: '账号最短为 5 个字符'
      //   });
      //   return;
      // }
      // if (this.password.length < 6) {
      //   uni.showToast({
      //     icon: 'none',
      //     title: '密码最短为 6 个字符'
      //   });
      //   return;
      // }
      // if (this.email.length < 3 || !~this.email.indexOf('@')) {
      //   uni.showToast({
      //     icon: 'none',
      //     title: '邮箱地址不合法'
      //   });
      //   return;
      // }
      // service.addUser(data);
      let data= this.regInfo
      if(data.user_no.length<5){
      uni.showToast({
         icon: 'none',
         title: '账号最短为5个字符'
       });
       return;
      }
      if(data.pwd.length<6){
      uni.showToast({
         icon: 'none',
         title: '密码最短为6个字符'
       });
       return;
      }
      if(data.pwd!==data.rePwd){
      uni.showToast({
         icon: 'none',
         title: '两次输入的密码不一致'
       });
       return;
      }
      // let url = this.$api.select + '/sso/operate/srvsso_user_add'
      let url = this.$api.select + '/sqfw/operate/srvsqfw_register'
	  let req = this.regInfo
	  req.serviceName = 'srvsqfw_register'
      // let req =[{"serviceName":"srvsso_user_add","condition":[],"data":[{"user_no":data.user_no,"pwd":data.pwd,"user_state":"正常"}]}]
      this.$http.post(url,req).then(res=>{
        console.log(res)
        
      })
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
.required{
  padding: 0 10upx;
  color: red;
}
.cu-form-group{
  .title{
    min-width: 25%;
  }
  input{
    // flex:5
  }
}
</style>
