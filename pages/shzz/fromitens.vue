<template>
	<view class="content">
		<view class="doubleyext">
			<text class="label">姓名：</text><input type="text"  value="" placeholder="请输入内容"/>
		</view>
		
		<view class="doubleyext">
			<text class="label">性别：</text><input  name="Fruit" type="radio" value="男" />
		</view>
	</view>
</template>
<script>
</script>

<style scoped>
	.content{
		width: 100%;
		padding: 30upx;
	}
	input{
		border: 1px solid #c5464a;
		border-radius: 5px ;
		width: 60%;
	}
	.doubleyext{
		display: flex;
	}
	.label{
		width: 25%;
		
	}
</style>
