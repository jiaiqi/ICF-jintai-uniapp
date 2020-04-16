<template>
  <view class="content">
    <view class="input-group send-group">
      <view class="input-row pass">
        <text class="title">手机号：</text>
        <input @blur='liveMobiel' type="text"  v-model="fromData.phone" placeholder="请输入手机号"></input>
      </view>
	  <view class="input-row">
	    <text class="title">图形验证码：</text>
	    <input type="text" @blur="livePhoto" v-model="fromData.yzm" placeholder="请输入图形验证码"></input>
		<image @tap='refreshYzm' :src="fromData.url" mode=""></image>
	  </view>
	  <view class="input-row">
	    <text class="title">验证码：</text>
	    <input type="text" v-model="fromData.mesyzm" placeholder="请输入短信验证码"></input>
		<uni-button v-if="isSend" @tap='sendMesage' class="cu-btn bg-green shadow">发送</uni-button>
		<view v-else="isSend" class="send">
			({{time}})s后重新发送
		</view>
	  </view>
	  <view class="input-row pass">
	    <text class="title">新密码：</text>
	    <input @blur="verPass('fir')" type="password" v-model="fromData.newpass" placeholder="6-16位的数字、字母、下划线及横线"></input>
	  </view>
	  <view class="input-row pass">
	    <text class="title">重复输入：</text>
	    <input @blur="verPass('sec')" type="password" v-model="fromData.aginpass" placeholder="6-16位的数字、字母、下划线及横线"></input>
	  </view>
    </view>

    <view class="btn-row"><button type="primary" class="primary" @tap="resetPass">提交</button></view>
  </view>
</template>

<script>
import service from '../../service.js';
import mInput from '../../components/m-input.vue';

export default {
  components: {
    mInput
  },
  data() {
    return {
		fromData:{
			phone:"",
			yzm:"",
			mesyzm:"",
			newpass:"",
			aginpass:"",
			url:""
		},
		isSend:true,
		time:0
    };
  },
  onShow(){
	  this.getPhotoUrl()
  },
  methods: {
	  liveMobiel(){
		  let phoneNums = this.fromData.phone;
		  let reg = /^1[3456789]\d{9}$/;
		  if (!phoneNums || !reg.test(phoneNums)) {
			uni.showToast({
			  icon: 'none',
			  title: '手机号码格式不正确'
			});
		  } else {
			this.verifyMobiel(phoneNums);
		  }
	  },
	   /** 校验手机号 */
	  verifyMobiel(phoneNums) {
		// let phoneNum = this.fromData.phone.value
		let req = [
		  {
			serviceName: "srvsso_check_mobile",
			condition: [
			  {
				colName: "mobile",
				ruleType: "eq",
				value: phoneNums
			  }
			]
		  }
		];
		let url = this.$api.select + '/sso/operate/srvsso_check_mobile'
		 this.$http.post(url,req).then(res=>{
			 if (res.data.resultCode !== "SUCCESS") {
				  uni.showToast({
					icon: 'none',
					title: res.data.response[0].resultMessage
				  });
			 }
		 })
	  },
	  /** 校验密码 */
	      verPass(e) {
	        let regPass = /^[\w_-]{6,16}$/;
	        let password = this.fromData.newpass;
	        if (e === "sec") {
	          password = this.fromData.aginpass;
	        }
	        if (!password || !regPass.test(password)) {
				uni.showToast({
					icon: 'none',
					title: "密码格式不正确"
				});
	        } else {
	          if (this.fromData.newpass && this.fromData.aginpass) {
	            if (this.fromData.newpass !== this.fromData.aginpass) {
					uni.showToast({
						icon: 'none',
						title: "俩次密码不一致"
					});
	            }
	          }
	        }
	      },
		  /** 图形验证码失焦时验证 */
		  livePhoto() {
			let yzm = this.fromData.yzm;
			let req = [
			  {
				serviceName: "srvsso_check_image_code",
				condition: [
				  {
					colName: "image_code",
					ruleType: "eq",
					value: yzm
				  }
				]
			  }
			];
			let url = this.$api.select + '/sso/operate/srvsso_check_image_code'
			 this.$http.post(url,req).then(res=>{
				 if (res.data.resultCode !== "SUCCESS") {
					  uni.showToast({
						icon: 'none',
						title: res.data.resultMessage
					  });
				 }
			 })
		  },
		  /** 获取图形验证码 */
		  getPhotoUrl() {
			let req = [
			  {
				serviceName: "srvsso_image_code",
				condition: [],
				srvApp: "sso"
			  }
			];
			let url = this.$api.select + '/sso/operate/srvsso_image_code'
			 this.$http.post(url,req).then(res=>{
				 console.log('-------',res)
				 if (res.data.resultCode !== "SUCCESS") {
					  uni.showToast({
						icon: 'none',
						title: res.data.response[0].resultMessage
					  });
				 }else{
					 if(res.headers.bx_auth_ticket && res.headers.bx_auth_ticket[0]){
						 uni.setStorageSync('bxAuthTicket',res.headers.bx_auth_ticket[0])
					 }
					 this.fromData.url = res.data.response[0].response.image;
				 }
			 })
		  },
		  /** 刷新图片验证码 */
		  refreshYzm() {
			this.getPhotoUrl();
		  },
		  /** 发送短信验证码  */
		  sendMesage() {
			  // this.isSend = false
			  				// 	 // let time = res.data.response[0].response.send_interval
								 // this.time = 120
			  				// 	 // this.time = time
			  				// 	 let myTime = setInterval(()=>{
			  				// 		 this.time--
			  				// 		 if(this.time === 0){
			  				// 			 this.time = 0
			  				// 			 clearInterval(myTime)
			  				// 			 this.isSend = true
			  				// 		 }
			  				// 	 },1000)
			let phoneNum = this.fromData.phone;
			let req = [
			  {
				serviceName: "srvsso_send_node",
				condition: [
				  {
					colName: "mobile", //手机号
					ruleType: "eq",
					value: phoneNum
				  }
				],
				srvApp: "sso"
			  }
			];
			
			let url = this.$api.select + '/sso/operate/srvsso_send_node'
			
			 this.$http.post(url,req).then(res=>{
				 if (res.data.resultCode !== "SUCCESS") {
					  uni.showToast({
						icon: 'none',
						title: res.data.resultMessage
					  });
				 }else{
					 this.isSend = false
					 let time = res.data.response[0].response.send_interval
					 this.time = time
					 let myTime = setInterval(()=>{
						 this.time--
						 if(this.time === 0){
							 this.time = 0
							 clearInterval(myTime)
							 this.isSend = true
						 }
					 },1000)
					 
				 }
			 })
			 
		  },
		 /** 校验手机验证码 */
		 verifyMobielNumber() {
		   let phoneNum = this.fromData.phone;
		   let mesCode = this.fromData.yzm;
		   let req = [
			 {
			   serviceName: "srvsso_check_mobile",
			   condition: [
				 {
				   colName: "mobile", //手机号
				   ruleType: "eq",
				   value: phoneNum
				 },
				 {
				   colName: "mobile_code", //短信验证码
				   ruleType: "eq",
				   value: mesCode
				 }
			   ],
			   srvApp: "sso"
			 }
		   ];
		   let url = this.$api.select + '/sso/operate/srvsso_check_mobile'
		    this.$http.post(url,req).then(res=>{
		   	 if (res.data.resultCode !== "SUCCESS") {
		   		  uni.showToast({
		   			icon: 'none',
		   			title: res.data.response[0].resultMessage
		   		  });
		   	 }else{
		   		 this.updatePassWord();
		   	 }
		    })
		 },
		 /** 修改密码 */
	 updatePassWord() {
	   let newpassNum = this.fromData.newpass;
	   let aginpassNum = this.fromData.aginpass;
	   let req = [
		 {
		   serviceName: "srvsso_reset_pwd",
		   condition: [],
		   data: [
			 {
			   pwd: newpassNum, //密码
			   affirm_pwd: aginpassNum //确认密码
			 }
		   ],
		   srvApp: "sso"
		 }
	   ];
	   let url = this.$api.select + '/sso/operate/srvsso_reset_pwd'
	    this.$http.post(url,req).then(res=>{
	   	 if (res.data.resultCode !== "SUCCESS") {
	   		  uni.showToast({
	   			icon: 'none',
	   			title: res.data.response[0].resultMessage
	   		  });
	   	 }else{
			 uni.showToast({
					icon: 'none',
					title:"修改成功"
			 });
			 uni.navigateTo({
			   url:'/pages/login/login'
			 })
	   	 }
	    })
	 },
    /** 确认修改密码 */
	resetPass() {
	  // console.log(this.fromData);
	  this.verifyMobielNumber();
	}
  }
};
</script>

<style lang="scss">
.input-group {
  .input-row {
	  align-items: center;
	  image{
		  width: 100px;
		      height: 25px;
		      margin-right: 10px;
	  }
    .title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height:auto;
	  width: 25%;
	  
    }
	/deep/ input{
			  font-size: 28upx;
	}
  }
}
.send-group{
	margin: 0;
}
.send{
	min-width: 220upx;
	margin-right: 20upx;
}
.nosend{
	text-align: center;
}
.pass /deep/ input{
	width: 100%!important;
}
</style>
