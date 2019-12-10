<template>
  <view class="card-list-item">
    <view class="header" v-if="type!='menu'">
      <view class="title">{{dataItem.title}}</view>
      <view class="subtitle"></view>
    </view>
	
    <view class="contents"  @click="toNewPage" >
      <view class="top"></view>
	  <view class="flexbox">
	  	<view class="phopt" :style="{backgroundImage: 'url('+img[indexs].imgs+')'}"></view>
	  	<view class="textcenter"v-if="type==='menu'">{{dataItem.text}}</view>
	  </view>
      <view class="bottom"></view>
    </view>
	
    <view class="footer" v-if="type!='menu'">
      <div class="foot_item">
        <image src="" class="avator"></image>
        <view class="usernmae">{{ dataItem.create_user }}</view>
      </div>
      <div class="foot_item">
        <div class="timedate">
          {{ dataItem.create_time }}
        </div>
      </div>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CardListItem', //卡片列表项
  data() {
    return {
      dataItem: {
        head_img: '', //头像
        subtitle: '', //小标题
        title: '', //大标题
        text: '', //文字
        create_user: '', // 创建人
        create_time: '', //创建时间
        url:'', //跳转链接
        serviceName:"",// 服务名称
      },
	  img:[
		  {"imgs":"../../static/img/00.png"},
		  {"imgs":"../../static/img/11.png"},
		  {"imgs":"../../static/img/22.png"},
		  {"imgs":"../../static/img/33.png"},
		  {"imgs":"../../static/img/44.png"},
		   {"imgs":"../../static/img/55.png"}
	  ]
    };
  },
  methods:{
    toNewPage(){
      let data = JSON.parse(JSON.stringify(this.itemData))
      
      uni.navigateTo({
        url:this.dataItem.url+'?query='  + encodeURIComponent(JSON.stringify(this.itemData))
      })
    }
  },
  props: {
    itemData: Object,
    type:String, //卡片类型 menu-菜单、news-新闻、post-帖子,
	indexs:Number
  },
  mounted() {
    this.dataItem.create_time = this.itemData.create_time;
    this.dataItem.create_user = this.itemData.create_user_disp;
    if(this.itemData.menu_name){ //卡片类型为菜单
      this.dataItem.text = this.itemData.menu_name
      this.dataItem.url = this.itemData.app_dest_page
      this.dataItem.serviceName = this.itemData.service_name
    }
  }
};
</script>

<style lang="scss" scopeds>
.card-list-item {
	box-shadow: 0 0 26px 0 rgba(0,0,0,.15) !important;
  display: flex;
  flex-direction: column;
  width: 90%;
  min-height: 200upx;
  border-radius: 10upx;
  margin: 20upx auto;
  overflow: hidden;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100upx;
    .title{
      font-weight: 600;
      text-indent: 2rem;
    }
    .subtitle{
      font-size: 28upx;
    }
  }
  // .content {
  //   width: 100%;
  //   height: 200upx;
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   color: #000;
  //   background-color:#FFFFFF ;
  //   .center{
	
  //     width: 100%;
  //     font-weight: 400;
  //     font-family: '楷体';
  //     font-size: 60upx;
  //     text-align: center;
  //   }
  // }
  .footer {
    border-top: 1px solid #F76260;
    display: flex;
    height: 100upx;
    .foot_item {
      display: flex;
      flex: 1;
      height: 100upx;
      align-items: center;
      align-items: flex-end;
      padding-bottom: 20upx;
      .avator {
        border-radius: 50%;
        width: 80upx;
        height: 80upx;
        margin: 0 20upx;
        border: 1px solid #c8c7cc;
      }
      .usernmae{
        display: flex;
        font-weight: 600;
        font-size: 24upx;
      }
      .timedate{
        display: flex;
        width: 100%;
        justify-content: flex-end;
        padding-right: 1rem;
        align-items: center;
        font-size: 24upx;
        color: #d1d1d1;
      }
    }
  }
}
  .contents{
		  background: #FFFFFF;
		
		 height: 200upx;
		 width: 95vw !important;
	  }
	  .phopt{
		  height: 150upx;
		  width: 150upx;
		  background-size:cover ;
		  margin-top: 25upx;
		  margin-left: 30upx;
	  }
	  .flexbox{
		  display: flex;
	  }
	  .textcenter{
		  font-size: 17px;
		  font-weight: 600;
		  text-align: center;
		  line-height:200upx ;
		   margin-left: 100upx;
	  }
</style>
