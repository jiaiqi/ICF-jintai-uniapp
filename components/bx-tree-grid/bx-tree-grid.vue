<template>
	<view class="">
		<view class="grid col-6 padding-sm">
			<view class="margin-tb-sm text-center text-cut" v-for="(item,index) in treeData" :key="index" @click="onclick(item,index)">
				<button :class="item[nodeKey] === activeNode[nodeKey] ? 'bg-blue  text-white':'lines-gray'" 
				class="cu-btn round ">
				{{item[disColName]}}
				<text class="lg text-green cuIcon-right" v-if="item._childNode.length > 0 && item[nodeKey] !== activeNode[nodeKey]"></text>
				<text class="lg text-white cuIcon-down" v-if="item._childNode.length > 0 && item[nodeKey] === activeNode[nodeKey]"></text>
				</button>
			</view>
		</view>
		<childGrid v-if="childNode.length > 0" class="solid" :name="activeNode[nodeKey]" :treeData="childNode" :childNodeCol="childNodeCol" :disColName="disColName" @on-tree-lastcode="onTree" :nodeKey="nodeKey"></childGrid>
	</view>
</template>

<script>
	export default {
		name:"tree-grid",
		components: {
		    childGrid: (e) => import('@/components/bx-tree-grid/bx-tree-grid.vue')
		  },
		props:{
			treeData:{
				type:Array,
				default() {
					return [];
				}
			},
			childNodeCol:{
				type:String,
				default() {
					return "";
				}
			},
			nodeKey:{
				type:String,
				default(){
					return ""
				}
			},
			disColName:{
				type:String,
				default(){
					return ""
				}
			},
			selectedTreeData:{
				type:Array,
				default(){
					return []
				}
			}
		},
		data(){
			return {
				activeNode:{},
				childNode:[],
			};
		},
		created() {
		},
		onLoad(option) {
			 
		},
		methods:{
			onTree(e){
				if(e.item._childNode.length === 0){
					this.$emit("on-tree-lastcode",e)
				}
				
			},
			
			onclick(item,index){
				
				if(item._childNode.length === 0){
					console.log("onclick",item,index)
					this.$emit("on-tree-lastcode",{item,index})
					
				}else{
					if(this.activeNode[this.nodeKey] === item[this.nodeKey]){
						this.activeNode = {}
						this.childNode = []
					}else{
						this.activeNode = item
						this.childNode = item[this.childNodeCol]
					}
				}
				this.$emit("on-tree-grid-change",{item,index})
			}
		},
		watch:{
			"treeData":{
				handler:function(nVal,oVal){
					console.log("------new  VAL",nVal)
					this.childNode = []
					this.activeNode = {}
				},
				deep:true
			},
			
		}
	}
</script>

<style scoped>
.cu-btn{
	/* padding:0;
	width: 4rem; */
}
</style>
