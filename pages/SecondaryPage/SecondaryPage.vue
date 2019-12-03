<template>
  <view class="wrap">
    <uni-grid :column="3" :showBorder="showBorder" v-if="treeData.children">
      <uni-grid-item v-for="(item, index) in treeData.children" :key="index" :url="item.app_temp_col_map ? item.app_temp_col_map : ''" :treeData="item">
        <text class="text">{{ item.label }}</text>
      </uni-grid-item>
    </uni-grid>
  </view>
</template>

<script>
import uniGrid from '@/components/uni-grid/uni-grid.vue';
import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
export default {
  components: { uniGrid, uniGridItem },
  data() {
    return {
      userInfo: {},
      menuData: [],
      showBorder: false,
      treeData:{}
    };
  },
  onLoad(option) {
    // 从URL获取菜单数据
    const data = JSON.parse(decodeURIComponent(option.data));
    this.treeData = data
  }
};
</script>

<style lang="scss">
.wrap {
  width: 100%;
}
</style>
