<template>
  <view class="wrap">
   <!-- <uni-grid :column="3" :showBorder="showBorder" v-if="treeData.children">
      <uni-grid-item v-for="(item, index) in treeData.children" :key="index" :url="item.app_temp_col_map ? item.app_temp_col_map : ''" :treeData="item">
        <text class="text">{{ item.label }}</text>
      </uni-grid-item>
    </uni-grid> -->
    
    <view class="card_box" v-if="treeData.children">
		<ListItem :itemData="item" v-for="(item, index) in treeData.children" :key="index" type="menu"></ListItem>
    </view>
  </view>
</template>

<script>
import uniGrid from '@/components/uni-grid/uni-grid.vue';
import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
  import ListItem from '@/components/bx-CardList/card-list-item.vue'
export default {
  components: { uniGrid, uniGridItem ,ListItem},
  data() {
    return {
      userInfo: {},
      showBorder: false,
      treeData:{}
    };
  },
  onLoad(option) {
    // 从URL获取菜单数据
    let data = []
	if(option.data){
		data=JSON.parse(decodeURIComponent(option.data));
	}else if (option.query){
		data=JSON.parse(decodeURIComponent(option.query));
	}
    this.treeData = data
    uni.setNavigationBarTitle({
      title:data.label
    })
  }
};
</script>

<style lang="scss">
.wrap {
  width: 100%;
  height: 100%;
  .card_box{
    width: 100%;
    height: 100%;
    margin-top: 20upx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
