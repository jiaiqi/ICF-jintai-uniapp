<template>
  <view>
    <cmd-nav-bar back title="信息设置"></cmd-nav-bar>
    <cmd-page-body type="top">
      <cmd-transition name="fade-up">
        <view>
          <cmd-cel-item title="头像" slot-right arrow>
            <!-- <cmd-avatar src="https://avatar.bbs.miui.com/images/noavatar_small.gif"></cmd-avatar> -->
            <cmd-avatar :src="userInfo.head_img_path"></cmd-avatar>
          </cmd-cel-item>
          <cmd-cel-item title="ID" :addon="userInfo.user_no" arrow></cmd-cel-item>
          <cmd-cel-item title="邮箱" :addon="userInfo.email" arrow></cmd-cel-item>
          <cmd-cel-item title="姓名" :addon="userInfo.real_name" arrow></cmd-cel-item>
          <cmd-cel-item title="联系方式" addon="12345678912" arrow></cmd-cel-item>
          <cmd-cel-item title="证件号码" :addon="userInfo.id_card" arrow></cmd-cel-item>
          <cmd-cel-item title="我的地址" addon="xxxxxxxxx" arrow></cmd-cel-item>
          <cmd-cel-item title="修改密码" @click="fnClick('modify')" arrow></cmd-cel-item>
          <button class="btn-logout" @click="logout">退出登录</button>
        </view>
      </cmd-transition>
    </cmd-page-body>
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
        userInfo:uni.getStorageSync('userInfo')
      };
    },

    mounted() {
      uni.setNavigationBarTitle({
        title:"个人信息"
      })
    },
    
    methods:{
      /**
       * 点击触发
       * @param {Object} type 跳转页面名或者类型方式
       */
      fnClick(type){
        if(type == 'modify'){
          uni.navigateTo({
            url:'/pages/user/modify'
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
        uni.setStorageSync("userInfo",null)
        uni.setStorageSync("bxAuthTicket","")
        uni.navigateTo({
          url:'/pages/login/login'
        })
      }
    }
  }
</script>

<style>
  .btn-logout {
    margin-top: 100upx;
    width: 80%;
    border-radius: 50upx;
    font-size: 16px;
    color: #fff;
	background-color: #E51C23;
    /* background: linear-gradient(to right, #365fff, #36bbff); */
  }

  .btn-logout-hover {
    background: linear-gradient(to right, #365fdd, #36bbfa);
  }
</style>
