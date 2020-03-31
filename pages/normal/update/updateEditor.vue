<template>
	<view class="editor-wraps">
		<bx-editor ref='editor' v-if="content != ''" :content='content'></bx-editor>
		<button @tap='complete' class='cu-btn bg-blue com'>完成</button>
	</view>
</template>


<script>
	import bxEditor from '@/components/bx-form/editod.vue';
	
	export default {
		name:'updateEditor',
		components:{
			bxEditor
		},
		data(){
			return {
				content:''
			}
		},
		onLoad(option) {
			this.content = option.val			
		},
		methods:{
			complete(){
				this.$refs.editor.getCtx()				
			}
		}
	}
</script>

<style lang="scss">
	.editor-wraps{
		
		.com{
			width: 95%;
			display: flex;
			justify-content: center;
			margin: 0 auto;
		}
	}
</style>
