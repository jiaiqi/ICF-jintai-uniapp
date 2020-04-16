<template>
  <view class="wrap">
    <!-- <cmd-nav-bar back title="个人信息"></cmd-nav-bar> -->
    <cmd-page-body type="top" v-if="userInfo&&userInfo.user_no !== 'niming'">
      <cmd-transition name="fade-up">
        <view>
          <cmd-cel-item title="头像" slot-right arrow>
            <!-- <cmd-avatar src="https://avatar.bbs.miui.com/images/noavatar_small.gif"></cmd-avatar> -->
            <cmd-avatar :src="userInfo.head_img_path?userInfo.head_img_path:''"></cmd-avatar>
          </cmd-cel-item>
          <cmd-cel-item title="ID" :addon="userInfo&&userInfo.user_no?userInfo.user_no:''" arrow></cmd-cel-item>
		 <cmd-cel-item title="积分" :addon="integras=='null'?'0':integras" ></cmd-cel-item>
		 <cmd-cel-item title="我的审核" @click="audit" arrow></cmd-cel-item>
		  <cmd-cel-item title="签到" @click="signIn()" arrow></cmd-cel-item>
          <cmd-cel-item title="姓名" :addon="userInfo&&userInfo.real_name?userInfo.real_name:' - '" arrow></cmd-cel-item>
          <cmd-cel-item title="联系方式" :addon="userInfo&&userInfo.mobile?userInfo.mobile:' - '" arrow></cmd-cel-item>
          <cmd-cel-item title="证件号码" :addon="userInfo&&userInfo.id_card?userInfo.id_card:' '" arrow></cmd-cel-item>
          <!-- <cmd-cel-item title="推送测试" @click="tuis()" arrow></cmd-cel-item> -->
		   <!-- <cmd-cel-item title="定时后台推送" @click="tuis2()" arrow></cmd-cel-item> -->
		    <!-- <cmd-cel-item title="推送" @click="tuis3()" arrow></cmd-cel-item> -->
          <cmd-cel-item title="修改资料" @click="fnClick('modifyInfo')" arrow></cmd-cel-item>
          <cmd-cel-item title="修改密码" @click="fnClick('modify')" arrow></cmd-cel-item>
          <button class="btn-logout" @click="logout">退出登录</button>
        </view>
      </cmd-transition>
    </cmd-page-body>
    <view class="tologin" v-else><button style="background: #E51C23;color: #fff;" @click="toLogin">点击跳转到登录</button></view>
  </view>
</template>

<script>
  import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue"
  import cmdPageBody from "@/components/cmd-page-body/cmd-page-body.vue"
  import cmdTransition from "@/components/cmd-transition/cmd-transition.vue"
  import cmdCelItem from "@/components/cmd-cell-item/cmd-cell-item.vue"
  import cmdAvatar from "@/components/cmd-avatar/cmd-avatar.vue"

  export default {
    components: {
      cmdNavBar,
      cmdPageBody,
      cmdTransition,
      cmdCelItem,
      cmdAvatar
    },

    data() {
      return {
        userInfo:{},
		integras:'0'
      };
    },

    mounted() {
		this.integra()
      this.userInfo = uni.getStorageSync('userInfo')
      uni.setNavigationBarTitle({
        title:"个人信息"
      })
    },
    onShow(){
      if( uni.getStorageSync('userInfo')){
        this.userInfo = uni.getStorageSync('userInfo')
      }
    },
    // updated() {
    //   this.userInfo = uni.getStorageSync('userInfo')
    // },
    methods:{
		tuis(){
			var info = plus.push.getClientInfo();
			console.log( JSON.stringify( info ) );
			 /* 5+  push 消息推送*/  
			plus.push.createMessage("这是方法的消息测试");
			plus.push.addEventListener("click", function(msg) {  
				console.log("click:"+JSON.stringify(msg));  
				console.log(msg.payload);  
				console.log(JSON.stringify(msg));  
			}, false);  
		},
		tuis2(){
			var info = plus.push.getClientInfo();
			console.log( JSON.stringify( info ) );
			 /* 5+  push 消息推送*/  
			 
			 setTimeout(()=>{
				 plus.push.createMessage("这是延时后台消息测试");
			 },6000)
			plus.push.addEventListener("click", function(msg) {  
				console.log("click:"+JSON.stringify(msg));  
				console.log(msg.payload);  
				console.log(JSON.stringify(msg));  
			}, false);  
		},
		tuis3(){
			var info = plus.push.getClientInfo();
			console.log( JSON.stringify( info ) );
			 /* 5+  push 消息推送*/  
			     
			 plus.push.createMessage("测试消息", {cover:false,when:new Date()});
			
		},
		 integra(){
			 let url = this.$api.select+ '/sqfw/select/srvzhsq_reg_score_select';
			 let req = {
			 	colNames: ['*'],
			 	condition: [
					
			 	],
			 	serviceName: 'srvzhsq_reg_score_select'
			 };
			 this.$http.post(url, req).then(res => {
				 console.log(res,"@@@@@@@@@@@@@@@@@@@@@@")
				 this.integras = JSON.stringify(res.data.data[0].score)
			 })
		 },
		 
		signIn(){
			uni.navigateTo({
				url:'../signIn/signIn'
			})
		},
		audit(){
			let val = "srvsso_process_todo_select"
			uni.navigateTo({
			  url: '../auditAll/auditAllList'
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
      },
      /**
       * 点击触发
       * @param {Object} type 跳转页面名或者类型方式
       */
      fnClick(type){
        if(type == 'modify'){
          uni.navigateTo({
            url:'./modify'
          })
        }else if(type==='modifyInfo'){
          uni.navigateTo({
            url:'./modifyInfo?data='+encodeURIComponent(JSON.stringify(this.userInfo))
          })
        }
      },
      getHeadImg(){
        // 获取头像
        // 获取头像路径
        let imgId = this.query.head_img
        let url = this.$api.select+ '/file/select/srvfile_attachment_select';
        let req = {
        	colNames: ['*'],
        	condition: [
        		{
        			colName: 'file_no',
        			ruleType: 'eq',
        			value: imgId // 图片编号
        		}
        	],
        	serviceName: 'srvfile_attachment_select'
        };
        this.$http.post(url, req).then(res => {
        	console.log(res.data.data[0].fileurl)
          if(res.data.data){
            this.note_user_info['head_img'] = this.$api.select+'/file/download?filePath=' + res.data.data[0].fileurl
            this.userImage = this.$api.select+'/file/download?filePath='  + res.data.data[0].fileurl
          }
        });
      },
      logout(){
        uni.clearStorageSync()
        // uni.clearStorageSync('bxAuthTicket')
        // uni.setStorageSync("userInfo",null)
        // uni.setStorageSync("bxAuthTicket","")
        uni.navigateTo({
          url:'/pages/login/login'
        })
      }
    }
  }
</script>

<style>
  .wrap{
    width: 100%;
	overflow-y: scroll;
    }
  .btn-logout {
    margin-top: 100upx;
    width: 80%;
    border-radius: 50upx;
    font-size: 16px;
    color: #fff;
	background-color: #E51C23;
    /* background: linear-gradient(to right, #365fff, #36bbff); */
  }
.tologin {
  display: flex;
  height: 500upx;
  width: 100%;
  align-items: center;
  justify-content: center;
}
  .btn-logout-hover {
    background: linear-gradient(to right, #365fdd, #36bbfa);
  }
</style>
