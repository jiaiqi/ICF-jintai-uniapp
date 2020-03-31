<template>
	<view class="bx-tree-selector bg-white">
		<scroll-view scroll-x class="bg-white padding response cu-steps steps-bottom" scroll-with-animation>
		<view class="padding-sm flex flex-wrap" @click="onShowModal">
			
			<view class="flex flex-wrap">
				
				 
				<view v-if="!isTree && selected.length > 0" class="" v-for="(item,index) in selected" :key="index">
					<view class="cu-tag text-lg round cf line-green  padding-sm"  :class="shape === 'round' ? 'round' :''">
						{{item[options.key_disp_col]}}
						<text class="fr lg text-green cuIcon-check"></text>
					</view>
				</view>
				
				<view v-if="isTree  && selectedPathNodeDatas.length > 0" class="" v-for="(item,index) in selectedPathNodeDatas" :key="index">
					<view class="cu-tag text-lg round cf   padding-sm" :class="index === selectedPathNodeDatas.length - 1 ? 'line-green' : 'line-blue'">{{item[options.key_disp_col]}}
					<text v-if="index === selectedPathNodeDatas.length - 1" class="fr lg text-green cuIcon-check"></text>
					</view>
					<text class="lg text-gray cuIcon-right"></text>
				</view>
				<view class="" v-if="isTree  && selected.length === 0">
					<!-- <text class="cu-tag line-gray  padding-sm">更多</text> -->
				</view>
				<view class=""  v-if="isTree && selectedPathNodeDatas.length === 0">
					<text class="cu-tag text-lg round line-gray  padding-sm">全部</text>
				</view>
				<view class=""  v-if="!isTree && selected.length === 0">
					<text class="cu-tag text-lg line-gray  padding-sm">未选择</text>
				</view>
				
			</view>
			
			
		</view>
		
		</scroll-view>
		<view class="cu-modal bottom-modal" :class="showModal?'show':''">
			<view class="cu-dialog">
				
				<view class="cu-bar bg-white">
					<view class="action text-blue" @tap="hideModal">取消</view>
					
					<view class="action text-green" @click="submit">确定</view>
				</view>
				<view class=" padding-sm">
					<view  v-if="!isTree">
						<scroll-view scroll-x class="bg-white padding response cu-steps steps-bottom" scroll-with-animation>
						<view class="padding-sm flex flex-wrap" v-if="treeDatas.length > 0">
							<view class=" padding-sm" v-for="(item,index) in treeDatas" :key="index" @click="onSelected(item)">
								<view class="cu-tag text-lg round" :class="isInSelected(item) ? 'line-green' : 'line-blue'">
								{{item[options.key_disp_col]}}
								<text v-if="isInSelected(item)" class="fr lg text-green cuIcon-check"></text>
								</view>
							</view>
						</view>
						</scroll-view>
					</view>
					<view v-if="isTree">
						<scroll-view scroll-x class="bg-white padding response cu-steps steps-bottom" scroll-with-animation>
						<view class="padding-sm flex flex-wrap" :class="layoutClass">
							<view  class="cf" v-for="(item,index) in selectedPathNodeDatas" @click.stop="onSelectedPath(item,index)" :key="index">
								<view class="cu-tag text-lg round cf  padding-sm margin-xs" 
								:class="index === selectedPathNodeDatas.length - 1 ? 'line-green' : 'line-blue'"
								>
								{{item[options.key_disp_col]}}
									<text v-if="index === selectedPathNodeDatas.length - 1" class="fr lg text-green cuIcon-check"></text>
								</view>
								<text v-if="index !== selectedPathNodeDatas.length - 1 && layoutClass === 'horizontal-ui'" class="lg text-gray cuIcon-right"></text>
								<text v-if="index !== selectedPathNodeDatas.length - 1 && layoutClass === 'vertical-ui'" class="lg text-gray cuIcon-down"></text>
								
							</view>
							<view class=""  v-if="selectedPathNodeDatas.length === 0">
								<text class="cu-tag text-lg round line-gray  padding-sm">请选择</text>
							</view>
						</view>
						
						</scroll-view>
						<view class="padding-sm flex flex-wrap solid bg-white">
							<view class=" padding-sm" v-for="(item,index) in treeActiveNodes" :key="index" @click="onSelected(item,index)">
								<view class="cf cu-tag text-lg round" :class="isInSelected(item) ? 'line-green' : 'line-gray'">
									{{item[options.key_disp_col]}}
									<text v-if="index === isInSelected(item)" class="fr lg text-green cuIcon-check"></text>
								</view>
							</view>
						</view>
					</view>
					
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import bxTreeGrid from "@/components/bx-tree-grid/bx-tree-grid.vue"
	export default {
		components:{bxTreeGrid},
		props:{
			isMultiple:{
				type:Boolean,
				default:false
			},
			options:{
				type:Object,
				default(){
					return {}
				}
			},
			shape:{
				type:String,
				default(){
					return ""  // round
				}
			},
			displayColumn:{
				type:String,
				default(){
					return ""
				}
			},
			defaultValue:{
				type:String,
				default(){
					return ""
				}
			},
			fieldsModel:{
				type:Object,
				default(){
					return {}
				}
			},
			treeChildNodeCol:{
				type:String,
				default(){
					return "_childNode"
				}
			},
			readOnly:{
				type:Boolean,
				default:false
			},
			treeForeignKey:{
				type:Object,
				default(){
					return {
						parentNoColName:"parent_no",
						colKeyName:"no"
					}
				}
			},
			dataLoadType:{
				type:String,
				default(){
					return "options"  // options || nodes
				}
			},
			layout:{
				type:String,
				default(){
					return "vertical"  // vertical || horizontal
				}
			},
			nodeDatas:{
				type:Array,
				default(){
					return []
				}
			}
		},
		data() {
			return {
				selected:[],
				selectedPathNodeNo:[],
				selectedPathNodeDatas:[],
				selectedNodeIndex:[],
				selectedDisplay:"",
				showModal:false,
				treeDatas:[],
				bxtreeDatas:[],
				isTree:false,
				treeActiveNodesLevel:null,
				activeContext:{},
				activePathIndex:null,
				activePathNode:{},
				activePathNodeIndex:[],
				childNode:[],
				isAgainSelected:false,
				onViewType:"path",// path 点击区域，path　路径区；Nodes :selected Nodes
			};
		},
		computed:{
			activePathIndexPlus: {
				  get: function () {
					return this.activePathIndex
				  },
				  set: function (v) {
					this.activePathIndex = v
				  }
			},
			treeActiveNodes:{
				get: function () {
					return this.activeContext
				},
				set: function (v) {
					this.activeContext = v
				}
			},
			layoutClass:function(){
				if(this.layout === "vertical"){
					return "vertical-ui"
				}else{
					return "horizontal-ui"
				}
			}
		},
		created() {
			if(this.isMultiple){
				this.selected = []
			}else{
				this.selected = []
			}
			this.isTree = this.options.hasOwnProperty("is_tree") ? this.options.is_tree : false
			console.log("bx-tree-selector 加载了 ---------- ！")
			this.loadTreeData()
		},
		onLoad() {
		},
		onShow() {
			
		},
		methods:{
			submit(){
				let value = this.selectedPathNodeDatas[this.selectedPathNodeDatas.length - 1][this.treeForeignKey.colKeyName]
				this.$emit("on-tree-change",value) 
				this.hideModal()
			},
			hideModal(){
				this.showModal = false
			},
			onShowSelector(){
				this.loadTreeData()
			},
			getOnPathChildShowNodes(e){
				let arr = this.bxtreeDatas
				let onNodes = this.decodeTreePath(e)
				let indexs = this.getInTreeIndex(arr,onNodes.nodeNo,[])
				console.log("indexs",indexs)
				this.getTreeNode(indexs,this.bxtreeDatas)
				console.log("onNodes",onNodes)
			},
			async onSelectedPath(e,index){
				// 点击树状路径区域
				let self = this
				self.onViewType = "path"
				this.getOnPathChildShowNodes(e)
				self.activePathNode = {}
				 self.activePathNode=Object.assign(e)
				this.activePathIndex = index
				self.activePathIndexPlus = index
				let res = await self.decodeTreePath(e)
				let nodeNo = res.nodeNo
				let nodePathDatas = res.pathNodeDatas
				let pathIndexs = await self.getInTreeIndex(self.bxtreeDatas,nodeNo,[])
				self.activePathNodeIndex =   pathIndexs.map((item)=>{
					console.log(item)
					return item
				})
				this.$forceUpdate()
				// console.log("pathIndexs",pathIndexs)
			},
			getTreeNode(onNodesIndexs,datas){
				// 查询点击节点的 上下级
				let self = this
				// console.log("开始==========",onNodesIndexs,datas)
				let node = datas
				let parentNoses = []
				if(onNodesIndexs.length > 0){
					for(let i =0;i<onNodesIndexs.length;i++){
						parentNoses = this.deepClone(node)
						node = node[onNodesIndexs[i]][this.treeChildNodeCol] 
					}
				}
				self.activeContext = {}
				self.activeContext=Object.assign({node,parentNoses})
				if(self.onViewType === "path"){
					self.treeActiveNodes = parentNoses
				}else if(self.onViewType === "nodes"){
					if(node.length === 0){
						self.treeActiveNodes = parentNoses
					}else{
						self.treeActiveNodes = node
					}
					
				}
				console.log("上下级",{node,parentNoses})
				return {node,parentNoses}
			},
			
			 getInTreeIndex(datas,noItems,indexs){
				// 根据 所选路径 path no ，解析 path index 下标。
				// console.log("getInTreeIndex：",datas,noItems,indexs)
				let inList=indexs
				let onChildListItem = []
				if(noItems.length > 0 && datas.length > 0){
					for(let i =0;i<datas.length;i++){
						if(datas[i][this.options.refed_col] === noItems[indexs.length]){
							inList.push(i)
							if(datas[i].hasOwnProperty(this.treeChildNodeCol)){
								onChildListItem = datas[i][this.treeChildNodeCol]
							}
						}
					}
					if(inList.length < noItems.length){
						 return  this.getInTreeIndex(onChildListItem,noItems,inList)
					}else{
						return inList
					}
				}else{
					console.error("getInTreeIndex传入值错误")
				}
				
			},
			isInSelected(e){
				if(this.isTree){
					if(this.selectedPathNodeDatas.length > 0){
						if(e[this.options.refed_col] === this.selectedPathNodeDatas[this.selectedPathNodeDatas.length - 1][this.options.refed_col]){
							return true
						}else{
							return false
						}
					}else{
						return false
					}
					
				}else{
					if(e[this.options.refed_col] === this.selected[this.selected.length - 1][this.options.refed_col]){
						return true
					}else{
						return false
					}
				}
				
				
			},
			decodeTreePath(e){
				// 初始化解析树形数据，根据所选 node data，遍历，上级path node 并存入 selectedPathNodeDatas
				let path = e.path
				let nodeNo = path.split("/")
				nodeNo = nodeNo.filter((item)=> item !== "")
				let treeData = this.treeDatas
				let pathNodeDatas = []
				for(let key of nodeNo){
					this.treeDatas.map((item,index) => {
						if(key === item[this.treeForeignKey.colKeyName]){
							pathNodeDatas.push(item)
						}
					})
				}
				return {nodeNo,pathNodeDatas}
				
				// console.log(nodeNo)
			},
			onInitialSelected(e){
				// 从原始data  遍历出 初始化 row,存入 selected
				let self = this
				// console.log(self.treeDatas)
				self.selected = self.treeDatas.filter((item)=>{
					// console.log("初始化selected",item[self.options.refed_col],e,item[self.options.refed_col] === e,self.options.refed_col)
					if(item[this.options.refed_col] === e){
						return item
					}
					
				})
				if(this.selected.length > 0 && this.isTree){
					let res = this.decodeTreePath(this.selected[0]) // 如果是 tree 调用 解析方法
					this.selectedPathNodeNo = res.nodeNo
					this.selectedPathNodeDatas = res.pathNodeDatas
					this.selectedNodeIndex = this.getInTreeIndex(this.bxtreeDatas,this.selectedPathNodeNo,[]) // 获取get index of node path
					this.activePathNodeIndex = this.selectedNodeIndex
					this.activePathIndex = res.pathNodeDatas.length - 1
					this.activePathNode = res.pathNodeDatas[res.pathNodeDatas.length - 1]
					this.getOnPathChildShowNodes(this.selectedPathNodeDatas[this.selectedPathNodeDatas.length - 1])
				}else if(this.selected.length === 0 && this.isTree ){
					this.treeActiveNodes = this.bxtreeDatas
				}
				
				// console.log("初始化",e,this.treeDatas,this.selected)
			},
			onSelected(e,index){
				this.onViewType = "nodes"
				if(this.isTree){
					this.getOnPathChildShowNodes(e)
					if(this.selectedPathNodeDatas.length > 0 && this.activePathIndex !== null){
						// 是否有已选择项目
						// console.log("点击",e,index,this.activePathIndex)
						if(e[this.options.refed_col] !== this.selectedPathNodeDatas[this.activePathIndex][this.options.refed_col]){
							// 如果用户没有重新选择
							console.log("点击了不同项：",this.selectedPathNodeDatas[this.activePathIndex],e)
							this.treeUpdatePath(e,index)
						}else{
							
							console.log("点击了相同项：",this.selectedPathNodeDatas[this.activePathIndex],e)
						}
					}else{
						this.treeUpdatePath(e,index)
					}
					
				}else{
					// if(this.isInSelected(e)){
					// 	this.selected = this.selected.filter((item)=> item[this.options.refed_col] !== e[this.options.refed_col])
					// 	this.treeDatas = this.treeDatas
					// }else{
					// 	if(this.isMultiple){
					// 		this.selected.push(e)
					// 	}else{
					// 		this.selected[0] = e
					// 	}
					// 	this.treeDatas = this.treeDatas
					// 	this.$emit("on-tree-change",e[this.options.refed_col])
					// 	console.log(e)
					// }
				}
				
				
			},
			treeUpdatePath(e,index){
				if(!this.isAgainSelected){
					let res = this.decodeTreePath(e) //当前选择的节点信息 nodeNo: 路径 no 数组，pathNodeDatas，路径datas 数组
					let nodeNo = res.nodeNo
					let nodePathDatas = res.pathNodeDatas
					let pathIndexs = this.getInTreeIndex(this.bxtreeDatas,nodeNo,[])   // 
					this.selectedPathNodeNo = nodeNo
					this.selectedPathNodeDatas = nodePathDatas
					this.selectedNodeIndex = pathIndexs
					
				}else{
					
				}
				
			},
			onShowModal(){
				if(!this.readOnly){
					this.isAgainSelected = false
					this.showModal = !this.showModal	
				}
				
			},
			loadTreeData(e){
				// 从服务器请求数据 ， 存入 原始 data =>treeDatas， 如果是tree，封装后 存入 bxtreeDatas
				// if(this.dataLoadType === "nodes"){
				// 	// 静态数据
				// 	this.treeDatas = this.nodeDatas
				// 	// this.bxtreeDatas = this.treeReform(this.treeDatas,this.treeForeignKey.parentNoColName,this.treeForeignKey.colKeyName)
				// 	// this.onInitialSelected(this.defaultValue) // 初始化值显示
				// }else{
				// 	// 动态数据
				// 	// let req = this.selectRequestObjs(this.options.serviceName,this.options.conditions)
				// 	let app = uni.getStorageSync("activeApp")
				// 	req.serviceName = this.options.serviceName
				// 	req.condition = this.options.conditions
				// 	if(this.options.conditions.length >0 && this.options.conditions[0].value.indexOf("'") > -1){
				// 		this.options.conditions[0].value =  this.options.conditions[0].value.replace(/[']/g,"")
				// 		// this.options.conditions[0].value =  this.strReplace(this.options.conditions[0].value,"'", " ")
				// 	}else{
				// 		// if(this.options.conditions[0].value.indexOf("data") > -1){
				// 			// let col = this.options.conditions[0].value.slice(this.options.conditions[0].value.indexOf(".") + 1,this.options.conditions[0].value.length)
				// 			// this.options.conditions[0].value = this.fieldsModel[col]
				// 		// }
				// 	}
				// 	if(this.options.hasOwnProperty("app")){
				// 		app = this.options.app
				// 	}
				// 	let option = this.options
				// 	console.log(this.options)
				// 	let url = this.$api.select + '/sqfw'  + '/select/' + option.serve
				// 	req.serviceName = option.serviceName
				// 	req.condition = []
				// 	let res = this.$http.post(url, req).then(res=>{
				// 		this.treeDatas = res.data.data
				// 		if(this.isTree){
				// 			// this.bxtreeDatas = this.treeReform(this.treeDatas,this.treeForeignKey.parentNoColName,this.treeForeignKey.colKeyName)
				// 			// 封装并保存 tree 数据
				// 		}
				// 		// this.onInitialSelected(this.defaultValue) // 初始化值显示
				// 	})
					
				// 	// this.onRequest("select", this.options.serviceName, req, app).then((res)=>{
				// 	// 	this.treeDatas = res.data.data
				// 	// 	if(this.isTree){
				// 	// 		this.bxtreeDatas = this.treeReform(this.treeDatas,this.treeForeignKey.parentNoColName,this.treeForeignKey.colKeyName)
				// 	// 		// 封装并保存 tree 数据
				// 	// 	}
				// 	// 	this.onInitialSelected(this.defaultValue) // 初始化值显示
				// 	// })
				// }
			},
		},
		onLoad() {
			
		},
		watch:{
			"showModal":{
				handler:function(nVal,oVal){
					if(nVal){
						this.onViewType = "nodes"
						this.loadTreeData()
					}
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.bx-tree-selector{
		
	}
	.cu-tag{
		height: 56upx;
		line-height: 56upx;
	}
.cu-modal{
	z-index: 9999;
}
.vertical-ui{
	display: flex;
	flex-direction: column;
	// justify-content: row;
}
</style>
