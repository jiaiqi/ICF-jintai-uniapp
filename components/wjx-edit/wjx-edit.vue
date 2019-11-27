<!-- 富文本编辑器组件 -->
<template>
  <view class="content" :style="{ height: pageHeight + 'px' }">
    <!-- 编辑区域 -->
    <view class="edit">
      <block v-for="(item, index) in editItems" :key="index">
        <!-- 工具栏 -->
<!--        <view class="edit-tools" v-if="showInsert">
          <view class="single" @tap="insertImg">
            <image src="../../static/img/tupian.png" mode="widthFix" />
            <text>插入图片</text>
          </view>
        </view> -->
        <textarea
          :placeholder="editItems.length == 1 ? placeText : ''"
          auto-height="true"
          :data-index="index"
          @input="inputIng"
          @linechange="linechage"
          v-if="item.type == 'textarea'"
          :focus="index + 1 == editItems.length && index != 0 ? true : false"
          :value="item.value"
        ></textarea>
        <view class="uni-list list-pd">
        	<view class="uni-list-cell cell-pd">
        		<view class="uni-uploader">
        			<view class="uni-uploader-head">
        				<view class="uni-uploader-title">点击可预览选好的图片</view>
        				<view class="uni-uploader-info">{{imageList.length}}/9</view>
        			</view>
        			<view class="uni-uploader-body">
        				<view class="uni-uploader__files">
        					<block v-for="(image,index) in imageList" :key="index">
        						<view class="uni-uploader__file">
        							<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
        						</view>
        					</block>
        					<view class="uni-uploader__input-box">
        						<view class="uni-uploader__input" @tap="chooseImage"></view>
        					</view>
        				</view>
        			</view>
        		</view>
        	</view>
        </view>
       <!-- <view class="img" v-if="item.type == 'img'">
          <image :src="item.value" mode="widthFix" />
          <view class="mask" :style="{ opacity: item.progress != 100 ? '1' : '0.5' }"></view>
          <image src="../../static/img/shanchu.png" class="del" :data-index="index" mode="widthFix" @click="delImg" />
          <progress :percent="item.progress" active stroke-width="3" />
        </view> -->
      </block>
    </view>

  
  </view>
</template>

<script>
  var sourceType = [
  	['camera'],
  	['album'],
  	['camera', 'album']
  ]
  var sizeType = [
  	['compressed'],
  	['original'],
  	['compressed', 'original']
  ]
export default {
  name: 'uni-edit',
  props: {
    	
    appNo: {
      // 上传图片所需app_no
      type: String,
      default: 'sqfw'
    },
    paddingBottom: {
      //当键盘弹起的时候，输入框距离工具栏的距离
      type: Number,
      default: 0
    },
    placeText: {
      //文本框默认的文字
      type: String,
      default: '写点什么吧...'
    },
    currentDate: {
      type: String,
      default: '1900-01-01'
    },
    //默认的文本类型
    contentData: {
      type: Object
    }
  },
  data() {
    return {
      pageHeight: '',
      imageList: [],
      sourceTypeIndex: 2,
      sourceType: ['拍照', '相册', '拍照或相册'],
      sizeTypeIndex: 2,
      sizeType: ['压缩', '原图', '压缩或原图'],
      editItems: [
        {
          type: 'textarea',
          value: ''
        }
      ],
      showInsert:true,
      content: []
    };
  },
  onLoad() {},
  methods: {
    submit: function() {
      return this;
    },
    previewImage: function(e) {
    	var current = e.target.dataset.src
    	uni.previewImage({
    		current: current,
    		urls: this.imageList
    	})
    },
    isFullImg: function() {
    	return new Promise((res) => {
    		uni.showModal({
    			content: "已经有9张图片了,是否清空现有图片？",
    			success: (e) => {
    				if (e.confirm) {
    					this.imageList = [];
    					res(true);
    				} else {
    					res(false)
    				}
    			},
    			fail: () => {
    				res(false)
    			}
    		})
    	})
    },
    chooseImage: async function() {
    	// #ifdef APP-PLUS
    	// TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
    	// if (this.sourceTypeIndex !== 2) {
    	// 	let status = await this.checkPermission();
    	// 	if (status !== 1) {
    	// 		return;
    	// 	}
    	// }
    	// #endif
      let that = this
    	if (this.imageList.length === 9) {
    		let isContinue = await this.isFullImg();
    		console.log("是否继续?", isContinue);
    		if (!isContinue) {
    			return;
    		}
    	}
    	uni.chooseImage({
    		sourceType: sourceType[this.sourceTypeIndex],
    		sizeType: sizeType[this.sizeTypeIndex],
    		count:1,
    		// count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
    		success: (res) => {
          let temp = res.tempFilePaths
    			this.imageList = this.imageList.concat(res.tempFilePaths);
          // var result = that.editItems.push({
          //   type: 'img',
          //   value: temp[0],
          //   progress: 0
          // });
          
          //图片上传至服务器
          let bxAuthTicket = uni.getStorageSync('bxAuthTicket');
          let appNo = that.appNo;
          var uploadTask = uni.uploadFile({
            url: 'http://39.98.203.134:8081/file/upload', //仅为示例，非真实的接口地址,需要替换成自己的接口地址
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
              console.log(data)
              that.$set(that.editItems[that.editItems.length], 'value', 'http://39.98.203.134:8081/file/download?filePath='+data.fileurl);
            },
            complete: e => {
              // uni.hideLoading()
            }
          });
    		},
    		fail: (err) => {
    			// #ifdef APP-PLUS
    			// if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
    			// 	this.checkPermission(err.code);
    			// }
    			// #endif
    			// #ifdef MP
    			uni.getSetting({
    				success: (res) => {
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
    							success: (res) => {
    								if (res.confirm) {
    									uni.openSetting()
    								}
    							}
    						})
    					}
    				}
    			})
    			// #endif
    		}
    	})
    },
    /**
     * 键盘输入时触发事件
     */
    inputIng: function(e) {
      var that = this;
      var value = e.detail.value;
      var index = e.currentTarget.dataset.index;
      that.$set(that.editItems[index], 'value', value);
    },
    /**
     * 输入框行数变化
     * 当输入框行数变化时，动态赋值给整个content的一个高度，避免输入框跑到工具栏下边去
     */
    linechage: function(e) {
      //console.log(JSON.stringify(e));
      var that = this;
      var height = e.detail.height;
      var lineHeight = e.detail.lineHeight;
      var pageHeight = height + lineHeight * 2 + uni.upx2px(98) + parseFloat(that.paddingBottom);
      this.pageHeight = pageHeight;
      uni.pageScrollTo({
        scrollTop: 10000000,
        duration: 0
      });
    },
    insertImg: function() {
      var that = this;
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: function(res) {
          // that.showInsert = false
          var temp = res.tempFilePaths;
          var result = that.editItems.push({
            type: 'img',
            value: temp[0],
            progress: 0
          });

          //图片上传至服务器
          let bxAuthTicket = uni.getStorageSync('bxAuthTicket');
          let appNo = that.appNo;
          var uploadTask = uni.uploadFile({
            url: 'http://39.98.203.134:8081/file/upload', //仅为示例，非真实的接口地址,需要替换成自己的接口地址
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
              console.log(data)
              that.$set(that.editItems[result-1], 'value', 'http://39.98.203.134:8081/file/download?filePath='+data.fileurl);
            },
            complete: e => {
              // uni.hideLoading()
            }
          });

          // uploadTask.onProgressUpdate(res => {
          //   console.log('上传进度' + res.progress);
          //   that.$set(that.editItems[result - 1], 'progress', res.progress);
          //   // 测试条件，取消上传任务。
          //   // 							if (res.progress > 50) {
          //   // 								uploadTask.abort();
          //   // 							}
          // });

          that.editItems.push({
            type: 'textarea',
            value: ''
          });

          plus.key.showSoftKeybord(); //显示软键盘

          uni.pageScrollTo({
            scrollTop: 10000000,
            duration: 0
          });
        }
      });
    },
    delImg: function(e) {
      var index = e.currentTarget.dataset.index;
      var that = this;
      uni.showModal({
        title: '',
        content: ' 确定要删除该图片吗？',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            that.editItems.splice(index, 2);
            that.showInsert = true
          }
        }
      });
      console.log(index);
    },
    chooseLocation: function() {
      uni.chooseLocation({
        success: function(res) {
          console.log('位置名称：' + res.name);
          console.log('详细地址：' + res.address);
          console.log('纬度：' + res.latitude);
          console.log('经度：' + res.longitude);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
page {
  background: #fff;
}
.content {
  background: #fff;
}
.edit {
  width: 100%;
  padding: 0 30upx;
  box-sizing: border-box;
  padding-top: 10upx;
  background: #fff;

  & textarea {
    padding: 20upx 0;
    width: 100%;
    font-size: 32upx;
    background: #fff;
    line-height: 1.24;
    // font-family: Arial,"宋体";
  }
.cell-pd {
		padding: 0upx 30upx;
	}

	.list-pd {
		margin-top: 20upx;
	}
  & image {
    width: 100%;
    display: block;
  }

  & .img {
    position: relative;
    margin-top: 10upx;
    margin-bottom: 10upx;
    
    .mask {
      background: rgba(0, 0, 0, 0.5);
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: calc(100% - 6upx);
    }

    .del {
      width: 80upx;
      height: 80upx;
      position: absolute;
      bottom: 30upx;
      right: 20upx;
    }

    & progress {
    }
  }
}
.uni-textarea-textarea{
  padding: 0 !important;
  }
.uni-list::before{
    height: 0px;
  }
  .uni-list::after{
    height: 0px;
  }
.edit-tools-flex {
  // width: 100%;
  // height: 98upx;
}
.edit-tools {
  // position:fixed;
  z-index: 1000;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  border-top: 0.5px solid #ccc;
  height: 98upx;
  align-items: center;
  display: flex;
  box-sizing: border-box;

  & .date {
    display: flex;
    align-items: center;

    & image {
      width: 35upx;
      height: 35upx;
      margin-left: 30upx;
    }

    & .date-value {
      font-size: 24upx;
      color: #666666;
      margin-left: 24upx;
      padding-right: 26upx;
      border-right: 0.5px solid #ccc;
    }
  }

  & .single {
    display: flex;
    align-items: center;
    margin-left: 39upx;

    & image {
      width: 35upx;
      height: 35upx;
    }

    & text {
      font-size: 30upx;
      color: #999;
      margin-left: 20upx;
    }
  }

  & .location {
    display: flex;
    position: absolute;
    right: 30upx;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 20upx;
    height: 51upx;
    justify-content: center;
    align-items: center;
    background: #f0f0f0;
    border-radius: 50upx;

    & image {
      width: 27upx;
      height: 33upx;
    }

    & .city {
      color: #666666;
      font-size: 24upx;
      margin-left: 10upx;
    }
  }
}
</style>
