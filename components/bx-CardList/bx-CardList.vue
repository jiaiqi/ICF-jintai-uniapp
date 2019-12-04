<template>
	<view class="card">
		<ListItem :itemData='itemData' v-for="(item,index) in treeData" :key="index"></ListItem>
	</view>
</template>

<script>
  import ListItem from 'card-list-item.vue'
	export default {
    components:{ListItem},
		data() {
			return {
				itemData:{}
			};
		},
    props:{
      treeData:Array
    }
	}
</script>

<style lang="scss">
.card{
  width: 100%;
}
</style>
