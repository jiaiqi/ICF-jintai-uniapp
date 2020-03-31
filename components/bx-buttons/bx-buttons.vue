<template>
	<view class="flex justify-center padding-sm">
		<button class="cu-btn round bg-blue margin-right-xs" v-for="(item,index) in buttons" :key="index" @click="onclick(item)">{{item.button_name}}</button>
	</view>
</template>

<script>
	export default {
		name:"bx-button",
		props:{
			buttons:{
				type:Array,
				default() {
					return [];
				}
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			onclick(e){
				this.$emit("on-button-change",e)
			},
		}
	}
</script>

<style lang="less">

</style>
