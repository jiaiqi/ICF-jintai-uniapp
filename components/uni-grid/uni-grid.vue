<template>
		<view class="uni-grid" :class="{'uni-grid-no-border':!showBorder,'uni-grid-no-out-border':showBorder && !showOutBorder}">
			<view class="uni-grid__flex" v-for="(items,i) in gridGroup" :key="i">
				<view class="uni-grid-item" hover-class="uni-grid-item-hover" :hover-start-time="20" :hover-stay-time="70" v-for="(item,index) in items"
				 :key="index" :class="[index == columnNum ? 'uni-grid-item-last' : '','uni-grid-item-' + type]" @click="onClick(i,index,item)" :style="{visibility:item.seize ? 'hidden' : 'inherit'}">
					<view :class="item.image === null ? 'uni-grid-item__content text-icon-none' : item.text ==='全部'?   'uni-grid-item__content all-nav':'uni-grid-item__content image-icon-item'" v-if="!item.seize">
						<image v-show="item.image !== null" class="uni-grid-item-image" mode="aspectFit" :src="item.image"></image>
						<text class="uni-grid-item-text">{{item.text}}</text>
					</view>
					<!-- <text class="menu_font">{{item.data.menu_name ? '--' : item.data.menu_name}}</text> -->
				</view>
			</view>
		</view>
</template>

<script>
	export default {
		name: "uni-grid",
		props: {
			options: Array,
			type: { //布局格式，长方形oblong，正方形square
				type: String,
				default: 'square'
			},
			columnNum: { //每一行有多少个
				type: [Number, String],
				default: 3
			},
			showOutBorder: { //显示外边框
				type: [Boolean, String],
				default: true
			},
			showBorder: { //是否显示border，如果为false，showOutBorder无效
				type: [Boolean, String],
				default: true
			}
		},
		data() {
			return {}
		},
		created() {
        this.columnNumber = this.gridGroup[0].length
      
			console.log(this.options)
		},
		computed: {
			gridGroup() {
				let group = []
				let groupItem = []
				this.options && this.options.forEach((item, index) => {
					groupItem.push(item)
					if (index % this.columnNum === this.columnNum - 1) {
						group.push(groupItem)
						groupItem = []
					}
				})
				if (groupItem.length > 0) {
					if (this.columnNum > groupItem.length) {
						for (let i = 0,length = groupItem.length; i < this.columnNum - length; i++) {
							groupItem.push({seize:true})
						}
					}
					group.push(groupItem)
				}
				// console.log("222222222",group[0][0].data.menu_name)
				groupItem = null
				return group
			}
		},
		methods: {
			// onClickMenuAll(){
			// 	uni.navigateTo({
			// 		url: '../../pages/navs/navs',
			// 	})
			// },
			onClick(index, num,item) {
				this.$emit('click', {
					index: index * this.columnNumber + num,
					data:item
				})
			}
		},
		mounted(){
			console.log(this.gridGroup)
		}
	}
</script>

<style  lang="scss" scoped>
	// @charset "UTF-8";
	.uni-grid {
		position: relative;
		display: flex;
		flex-direction: column;
		background-color: white;
	}

	.uni-grid__flex {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	.uni-grid-item {
		display: flex;
		position: relative;
		flex-direction: column;
		flex: 1;
		justify-content: center;
		align-items: center;
		// margin-bottom: 15px;
		text-align: center;
	}

	.uni-grid-item:before {
		display: block;
		content: " ";
		padding-bottom: 100%
	}

	.uni-grid-item:after {
		content: '';
		position: absolute;
		z-index: 1;
		transform-origin: center;
		box-sizing: border-box;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		border-color: #c8c7cc;
		border-style: solid;
		border-width: 1px;
		-webkit-transform: scale(.5);
		transform: scale(.5);
		border-top-width: 0;
		border-left-width: 0
	}

	.uni-grid-item__content {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		align-content: center;
	}
	.all-nav{
		height: calc(100% - 20upx);
		width: calc(100% - 20upx);
		  margin: 10upx;
		background: -webkit-linear-gradient(bottom,  #fa9600 , #fdb839); /* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(top,  #fa9600 , #fdb839); /* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(top,  #fa9600 , #fdb839); /* Firefox 3.6 - 15 */
		background: linear-gradient(to top, #fa9600 , #fdb839); /* 标准的语法（必须放在最后） */
		color:#fff;
		text-align: center;
		border-radius: 50%;
		// line-height: 2.4rem;
		font-size: 1.8rem;
	}
		.text-icon{
		  height: calc(100% - 20upx);
		  width: calc(100% - 20upx);
		  margin: 10upx;
		  background: -webkit-linear-gradient(bottom, #214bbd , #3e91ff); 
		  background: -o-linear-gradient(top, #214bbd , #3e91ff); 
		  background: -moz-linear-gradient(top, #214bbd , #3e91ff); 
		  background: linear-gradient(to top, #214bbd , #3e91ff);
		  color:#fff;
		  text-align: center;
		  border-radius: 20upx;
		  line-height: 2.4rem;
		  font-size: 1.8rem;
		}
		.text-icon-none{
		  height: calc(100% - 120upx);
		  width:calc(100% - 80upx);
		  // height: 60upx;
		  // width: 60upx;
		  margin: 50upx;
		  background: -webkit-linear-gradient(bottom, #7484b1 , #8ebfff);
		  background: -o-linear-gradient(top, #7484b1 , #8ebfff); 
		  background: -moz-linear-gradient(top, #7484b1 , #8ebfff); 
		  background: linear-gradient(to top, #7484b1 , #8ebfff); 
		  color:#fff;
		  text-align: center;
		  border-radius: 20upx;
		  line-height: 2.4rem;
		  font-size: 1.8rem;
		}
		.menu_font{
			font-size: 26upx;
		}
		.text-icon-none  .uni-grid-item-text{
			font-size: 50upx;
		}
		
	.uni-grid-item-text {
		font-size: 32upx;
		color: #fff;
		margin-top: 12upx;
		// width:60px;
		// height:60px;
	}
	.image-icon-item .uni-grid-item-text{
		color: #525252;
	}
	.uni-grid-item-hover {
		background-color: #f1f1f1
	}

	.uni-grid-item-image {
		width: 80upx;
		height: 80upx
	}

	.uni-grid .uni-grid__flex:first-child .uni-grid-item:after {
		border-top-width: 0px
	}

	.uni-grid .uni-grid__flex .uni-grid-item:first-child:after {
		border-left-width: 0px
	}

	.uni-grid.uni-grid-no-out-border .uni-grid__flex:first-child .uni-grid-item:after {
		border-top-width: 0
	}

	.uni-grid.uni-grid-no-out-border .uni-grid__flex:last-child .uni-grid-item:after {
		border-bottom-width: 0
	}

	.uni-grid.uni-grid-no-out-border .uni-grid__flex .uni-grid-item:first-child:after {
		border-left-width: 0
	}

	.uni-grid.uni-grid-no-out-border .uni-grid__flex .uni-grid-item:last-child:after {
		border-right-width: 0
	}

	.uni-grid.uni-grid-no-border .uni-grid-item:after {
		border-width: 0
	}

	.uni-grid.uni-grid-no-border .uni-grid__flex:first-child .uni-grid-item:after {
		border-top-width: 0
	}

	.uni-grid.uni-grid-no-border .uni-grid__flex .uni-grid-item:first-child:after {
		border-left-width: 0
	}

	.uni-grid-item-oblong.uni-grid-item:before {
		padding-bottom: 60%
	}

	.uni-grid-item-oblong .uni-grid-item__content {
		flex-direction: row
	}

	.uni-grid-item-oblong .uni-grid-item-image {
		width: 52upx;
		height: 52upx
	}

	.uni-grid-item-oblong .uni-grid-item-text {
		margin-top: 0;
		margin-left: 12upx
	}
</style>
