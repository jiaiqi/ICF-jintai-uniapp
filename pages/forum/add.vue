<template>
  <view class="add_pages">
    <view class="forumTitleBox">
      <image src="../../static/img/title.png" mode="" class="icon"></image>
      <input type="text" placeholder="标题" v-model="pageTitle"/>
    </view>
    <view class="forumClassBox">
      <div class="class_box_title">
        <image src="../../static/img/class.png" mode="" class="icon"></image>
        <input type="text" placeholder="分类/标签" v-model="pageTag"/>
      </div>
    </view>
    <view class="forumContentBox">
      <image src="../../static/img/words.png" mode="" class="icon"></image>
      <edit class="text_editor" :paddingBottom="paddingBottom" ref="edit" placeText="写点什么吧..."></edit>
      
    </view>
    <view class="bottom">
      <button type="warn" @click="submitData">提交</button>
    </view>
  </view>
</template>

<script>
import edit from '@/components/wjx-edit/wjx-edit.vue';
export default {
  name: 'addArticle',
  components: { edit },
  data() {
    return {
      paddingBottom:20,
      pageTitle:'',
      pageTag:'',
    };
  },
  methods: {
    onKeyInput: function(event) {
                this.pageTitle = event.target.value
            },
    submitData(){
      let contentText = this.$refs.edit.editItems
      let contnet = {
        title:this.pageTitle,
        tag:this.pageTag,
        text:contentText
      }
      console.log(contnet)
    }
  },
  onLoad(option) {
    if(option){
      
    }
  }
};
</script>

<style lang="scss">
.add_pages {
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 0 auto;
  position: relative;
  .icon {
    width: 32upx;
    height: 32upx;
    margin-right: 20upx;
  }
  input{
    width: 85%;
  }
  .forumTitleBox {
    display: flex;
    align-items: center;
    height: 100upx;
    text-indent: 20upx;
  }
  .forumClassBox{
    display: flex;
    flex-direction: column;
    .class_box_title{
      display: flex;
      font-size: 32upx;
      align-items: center;
      text-indent: 20upx;
    }
  }
  .forumContentBox {
    display: flex;
    min-height: 300upx;
    width: 100%;
    background-color: #fff;
    .icon {
      padding: 30upx 0;
    }
    .text_editor{
      width: 100%;
    }
  }
  .bottom{
    width:80%;
    display: flex;
    height: 200upx;
    // position: fixed;
    bottom: 0;
    left: 10%;
    button{
      height: 100upx;
      width: 50%;
    }
  }
}
</style>
