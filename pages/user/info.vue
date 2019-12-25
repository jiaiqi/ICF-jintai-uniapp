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
          <cmd-cel-item title="邮箱" :addon="userInfo&&userInfo.email?userInfo.email:' - '" arrow></cmd-cel-item>
          <cmd-cel-item title="姓名" :addon="userInfo&&userInfo.real_name?userInfo.real_name:' - '" arrow></cmd-cel-item>
          <cmd-cel-item title="联系方式" :addon="userInfo&&userInfo.mobile?userInfo.mobile:' - '" arrow></cmd-cel-item>
          <cmd-cel-item title="证件号码" :addon="userInfo&&userInfo.id_card?userInfo.id_card:' '" arrow></cmd-cel-item>
          <cmd-cel-item title="我的地址" addon="---" arrow></cmd-cel-item>
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
        userInfo:{}
      };
    },

    mounted() {
      this.userInfo = uni.getStorageSync('userInfo')
      uni.setNavigationBarTitle({
        title:"个人信息"
      })
    },
    onShow(){
      this.userInfo = uni.getStorageSync('userInfo')
    },
    // updated() {
    //   this.userInfo = uni.getStorageSync('userInfo')
    // },
    methods:{
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
