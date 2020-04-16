<!-- <template>
	<view class="content">
			<view class="box" v-if="boxBooler">
				<image class="img" :src="img" mode=""></image>
				<view class="loading" style="">{{title}}</view>
			</view>
	</view>
</template>

<script>
	export default{
		props:{
			boxBooler:{
				type:Boolean,
				default:true,
				timer:null,
			}
		},
		data(){
			return{
				img:"../../static/img/loadings.gif",
				title:'加载中...',
				 numberi:0
			}
		},
		
		// rgba(0, 255, 198, 0.21) 虚症 rgba(0, 255, 198, 0.66)
		// rgba(0, 253, 255, 0.21) 实证 rgba(0, 253, 255, 0.61)
		methods:{
			time(){
					this.timer = setInterval(() => {
						this.numberi++
						if(this.numberi==14){
							this.numberi=0
							clearInterval(this.timer)
							this.img="../../static/img/failed.png"
							this.title="加载失败，请尝试下拉刷新"
						}
				},1000)
			}
		},
		mounted(){
				this.time()
		}
	}
</script>

<style>
	.content{
		width: 100vw;
		height: 100%;
		position: relative;
		background: #FFFFFF;
	}
	.box{
		display: block;
		position: absolute;
		  top: 50%;
		  left: 50%;
		  transform: translate(-50%,-50%);
	}
	.loading{
		font-size: 14px;
		color: #888;
		line-height: 25px;
		text-align: center;
	}
	.img{
		display: block;
		height: 150upx;
		width: 150upx;
		margin: auto;
	}
</style>
 -->