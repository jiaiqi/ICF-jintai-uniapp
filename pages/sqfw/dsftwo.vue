<template>
	<view class="content">
		<iframe class="frame" :src="url"></iframe>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				url:""
			}
		},
		methods:{
			 open(types) {  
			                plus.runtime.openWeb(this.url, function(res) {  
			                    console.log(res);  
			                });  
			        }  
		},
		onLoad(options){
			this.url=options.url
			this.open()
		}
	}
</script>

<style>
	.content{
		width: 100%;
		overflow-x: hidden;
	}
	.frame{
		width: calc(100% + 20px);;
		height: 100%;
		border: none;
		position: absolute; right: -20px; top: 0; bottom: 0;
		
		overflow-x: hidden; overflow-y: scroll;
	}
	
</style>
