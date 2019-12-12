<template>
  <view class="category-wrap">
    <view class="category-item" v-for="(item, i) in listData" :key="i">
      <view class="category-title" @click="changeState(item,i)">
        <text class="main-title-text">{{ item.column_title }}</text>
        <uni-icons :type="item.arrowDirection" size="30" color="red" v-if="item.children&&item.children.length>0" ></uni-icons>
      </view>
        <view class="category-children" v-if="item.arrowDirection!=='arrowup'">
         <uni-grid class="uni-grid" :options="item.children" column-num="3" :show-border="false" :square="true" @click="toCategory"></uni-grid>
          <view class="category-children-item" v-for="child in item.children" :key="child.id">
            <view class="category-children-title" @click="toCategory(child)">{{ child.column_title }}</view>
            <!-- <uni-badge text="1" type="primary" style="text-align: center;"></uni-badge> -->
          </view>
        </view>
    </view>
  </view>
</template>

<script>
  // import uniGrid from ""
  import uniIcons from "@/components/uni-icon/uni-icon.vue"
  import uniBadge from "@/components/uni-badge/uni-badge.vue"
  import uniGrid from "@/components/uni-grid/uni-grid.vue"
  import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
export default {
  name: 'ForumCategory',
  components: {uniIcons,uniBadge,uniGrid,uniGridItem},
  data() {
    return {
      arrowDirection:'arrowdown',
    };
  },
  methods:{
    changeState(item,i){
      if(item.arrowDirection==='arrowdown'){
        item.arrowDirection = 'arrowup'
      }else{
        item.arrowDirection = 'arrowdown'
      }
      this.$set(this.listData,i,item)
    },
    goPages(e) {
    	console.log(e);
    	let url = e.data.url;
    	if (url) {
    		uni.navigateTo({
    			url: url
    		});
    	}
    },
    toCategory(e){
      console.log('toCategory',e)
      let url = e.data.url;
      if (url) {
      	uni.navigateTo({
      		url:url
      	});
      }
      // uni.navigateTo({
      //   url:'../../pages/forum/list?column_no='+item.column_no+'&parent_no='+item.parent_no
      // })
    }
  },
  props: {
    listData: Array,
    query:Object
  },
  onLoad(option) {
    console.log(option.query)
    if(option.query){
      console.log(option.query)
      this.query = JSON.parse(option.query)
    }
  },
  mounted() {
  }
};
</script>

<style lang="scss">
.category-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // background: #efefef;
  .category-item {
    // border-bottom: 1px solid #efefef;
    background-color: #fff;
    width: 100%;
    width: 95%;
    margin: 0 auto;
    &:first-child {
      border-top: 1px solid #efefef;
    }
    .category-title {
      min-height: 100upx;
      line-height: 100upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .main-title-text{
        display: block;
        padding-left: 20upx;
        line-height: 50upx;
        border-left: 3px solid #E51C23;
      }
    }
    .category-children {
      display: flex;
      width: 95%;
      margin: 0 auto;
      flex-direction: column;
      .category-children-item{
        text-indent: 30upx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .category-children-title{
          flex: 1;
        }
        .uni-badge{
          display: flex;
          margin-right: 50upx;
          flex:0.1;
          text-indent: 0;
          justify-content: center;
          text-align: center;
        }
        .category-children-title{
          line-height: 80upx;
        }
      }
    }
  }
}
.uni-grid{
  border: 1px solid #efefef;
}
</style>
