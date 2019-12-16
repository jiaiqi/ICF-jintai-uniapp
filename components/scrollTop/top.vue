<template>
	<view class="content">
		<view class="scrollTop" ref="element" id="moveDiv" :style="{ backgroundImage: 'url(' + src + ')' }" 
		 @mousedown="down" @touchstart="down"
			      @mousemove="move" @touchmove="move"
			      @mouseup="end" @touchend="end"
		 >
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: "http://www.eleve.cn/houminhua/top.png",
				flags: false,
				position: { x: 0, y: 0 },
				nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
			}
		},
		methods: {
			 down(){
			    this.flags = true;
			    var touch;
			    if(event.touches){
			        touch = event.touches[0];
			    }else {
			        touch = event;
			    }
			    this.position.x = touch.clientX;
			    this.position.y = touch.clientY;
			    this.dx = moveDiv.offsetLeft;
			    this.dy = moveDiv.offsetTop;
			  },
			  move(){
			    if(this.flags){
			      var touch ;
			      if(event.touches){
			          touch = event.touches[0];
			      }else {
			          touch = event;
			      }
			      this.nx = touch.clientX - this.position.x;
			      this.ny = touch.clientY - this.position.y;
			      this.xPum = this.dx+this.nx;
			      this.yPum = this.dy+this.ny;
			      moveDiv.style.left = this.xPum+"px";
			      moveDiv.style.top = this.yPum +"px";
			      //阻止页面的滑动默认事件
			      document.addEventListener("touchmove",function(){ 
			          event.stopPropagation();// 阻止冒泡事件
			      },false);
			    }
			  },
			//鼠标释放时候的函数
			  end(){
			    this.flags = false;
			  },
		
		}
	}
</script>

<style>
	.content {
		width: 100vw;
	}

	.scrollTop {
		height: 8vw;
		width: 8vw;
		background: #000000;
		border-radius: 50%;
		background-size: cover;
		position: fixed;
		z-index: 1024;
		top: 530px;
		left: 330px;
		box-shadow: 0 0 26px 0 rgba(0, 0, 0, 0.25);
	}
</style>
