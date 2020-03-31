<template>
    <view class="container">
		
		<view class="toolbar">
		
			<!-- <button type="primary" @tap="insertText()" size="mini">插入内容</button> -->
			
			<!-- <button type="primary" @tap="getCtx()" size="mini">获取内容</button> -->
			
			<button type="primary" @tap="clearCtx()" size="mini">清空内容</button>
			
			<!-- <button type="primary" @tap="insertImg('')" size="mini">插入图片</button> -->
			
			<button type="primary" @tap="chooseImage()" size="mini">选择图片</button>
			
			<!-- <button type="warn" @tap="undo" size="mini">撤销</button> -->
			
			<!-- <button type="primary" @tap="redo" size="mini">恢复</button> -->
			
			<button type="primary" @tap="formatCtx('header','H1')" size="mini">H1</button>
			<button type="primary" @tap="formatCtx('header','H2')" size="mini">H2</button>
			<button type="primary" @tap="formatCtx('header','H3')" size="mini">H3</button>
			<button type="primary" @tap="formatCtx('header','H4')" size="mini">H4</button>
			<button type="primary" @tap="formatCtx('header','H5')" size="mini">H5</button>
			<button type="primary" @tap="formatCtx('header','H6')" size="mini">H6</button>
		
		</view>
		
		<editor id="editor"
		class="ql-container editorss" 
		:placeholder="placeholder"
		 show-img-toolbar='true'
		 ></editor>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                placeholder: '开始输入...'
            }
        },
		props:{
			content:{
				type:String,
				default() {
				  return '';
				}
			}
		},
        methods: {
    //         onEditorReady() {
				// let that = this
				// this.$nextTick(()=>{
				// 	uni.createSelectorQuery().select('#editor').context((res11) => {
				// 		debugger
				// 	    that.editorCtx = res11.context
				// 		that.editorCtx.setContents({
				// 			html: that.content
				// 		})
				// 	}).exec()
				// })
                
    //         },
			//撤销
            undo() {
                this.editorCtx.undo()
            },
			// 恢复
			redo(){
				this.editorCtx.redo()
			},
			// 插入图片
			insertImg(url){
				
				if(url==''){
					url = '/static/img/1.jpg'
				}
				
				this.editorCtx.insertImage({
					src: url,
					alt:'图片1',
					data:''
				})
			},
			// 插入文本
			insertText(){
				console.log(this)
				this.editorCtx.insertText({
					text: '测试插入的内容',
					success(data){
					}
				})
			},
			// 获取内容
			getCtx(){				
				var that = this
				debugger
				that.editorCtx.getContents({
					success:function(data){
						uni.setStorageSync('edit',data.html)
						uni.navigateBack({
							delta:1
						})
					}
				})
             },
			 //清空编辑器
			 clearCtx(){
			 	var that = this
			 	that.editorCtx.clear({
			 		success() {
			 			
			 		}
			 	})
			  },
			  // 设置样式
			  formatCtx(name,value){
				this.editorCtx.format(name,value)  
			  },
			  
			  // 打开相册选择图片
			  chooseImage(){
				  var that = this
				  uni.chooseImage({
				    // sourceType: sourceType[this.sourceTypeIndex],
				    // sizeType: sizeType[this.sizeTypeIndex],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					    sourceType: ['album'], //从相册选择
				    count: 1,
				    success: res => {
				      let temp = res.tempFilePaths;
				      //图片上传至服务器
				      let bxAuthTicket = uni.getStorageSync('bxAuthTicket');
				      var uploadTask = uni.uploadFile({
				        url: that.$api.select + '/file/upload', //仅为示例，非真实的接口地址,需要替换成自己的接口地址
				        filePath: temp[0],
				        header: { bx_auth_ticket: bxAuthTicket },
				        name: 'file',
				        formData: {
				          serviceName: 'srv_bxfile_service',
				          interfaceName: 'add',
				          app_no: 'sqfw'
				        },
				        success: e => {
				          var data = JSON.parse(e.data);
						  // for (let i = 0; i < res.tempFilePaths.length; i++) {
						  // 	that.insertImg(res.tempFilePaths[i])
						  //   }
						  let photoUrl = that.$api.select + '/file/download?filePath=' + data.fileurl
						  that.insertImg(photoUrl)
				          // this.imgPathList = this.imgPathList.concat(data.fileurl);
				          // this.imageList = this.imageList.concat(that.$api.select + '/file/download?filePath=' + data.fileurl);
				          console.log('------',data);
				        },
				        complete: e => {
				          // uni.hideLoading()
				        }
				      });
				    },
				    fail: err => {
				      uni.getSetting({
				        success: res => {
				          let authStatus = false;
				          switch (this.sourceTypeIndex) {
				            case 0:
				              authStatus = res.authSetting['scope.camera'];
				              break;
				            case 1:
				              authStatus = res.authSetting['scope.album'];
				              break;
				            case 2:
				              authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
				              break;
				            default:
				              break;
				          }
				          if (!authStatus) {
				            uni.showModal({
				              title: '授权失败',
				              content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
				              success: res => {
				                if (res.confirm) {
				                  uni.openSetting();
				                }
				              }
				            });
				          }
				        }
				      });
				    }
				  });
				  // uni.chooseImage(
				  //   {
				  //     count: 6, //默认9
				  //     sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				  //     sourceType: ['album'], //从相册选择
				  //     success: function (res) {
				  //         console.log(JSON.stringify(res.tempFilePaths));
						  
						//   for (var i = 0; i < res.tempFilePaths.length; i++) {
						// 	that.insertImg(res.tempFilePaths[i])
						//   }
						  
				  //     }
      //               }
				  // )
			  }			  
		},
		mounted() {
			let self = this
			this.$nextTick(()=>{
				const query = uni.createSelectorQuery().in(this)
				query.select('#editor').context((res) => {
					debugger
				    self.editorCtx = res.context
					self.editorCtx.setContents({
						html: self.content
					})
				}).exec()
			})
			// this.$nextTick(()=>{
			// 	// this.editorCtx.insertText({
			// 	// 	text: this.content,				
			// 	// })
			// 	this.insertText()
			// })
			
			// console.log('contentcontent',this)
		}
    }
</script>

<style lang="scss">
    .container {
        padding: 10px;
    }

    .editorss {
        width: 100%;
        height: 300px;
        background-color: #CCCCCC;
		
    }
	.editorss /deep/ p{
			word-break: break-all;
		}
    button {
        margin-top: 10px;
    }
</style>