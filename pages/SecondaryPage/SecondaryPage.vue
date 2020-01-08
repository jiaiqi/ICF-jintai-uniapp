<template>
  <view class="wrap">
    <view class="card_box" v-if="treeData.children">
      <ListItem :itemData="item" v-for="(item, index) in treeData.children" :key="index" :indexs="index" type="menu"></ListItem>
    </view>
  </view>
</template>

<script>
import ListItem from '@/components/bx-CardList/card-list-item.vue';
export default {
  components: { ListItem },
  data() {
    return {
      treeData: {}
    };
  },
  onLoad(option) {
    // 从URL获取菜单数据
    let data = [];
    if (option.data) {
      data = JSON.parse(decodeURIComponent(option.data));
      console.log(option.data)
    } else if (option.query) {
      data = JSON.parse(decodeURIComponent(option.query));
    }else{
      console.log( JSON.stringify(option))
    }
    this.treeData = data;
    console.log( data.label)
    uni.setNavigationBarTitle({
      title: data.label
    });
  }
};
</script>

<style lang="scss">
.wrap {
  width: 100%;
  height: 100%;
  .card_box {
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
