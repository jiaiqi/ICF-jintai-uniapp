<template>
  <view class="add_pages">
    <view class="forumTitleBox"><input type="text" placeholder="标题(必填)" v-model="pageTitle" /></view>
    <view class="forumClassBox">
      <div class="class_box_title">
        <div class="mpvue-picer"><QSPickerCustom ref="nationPicker" name="formName" title="分类" variableName="custom" v-model="classify" @change="changePicker" /></div>
      </div>
    </view>

    <view class="forumContentBox">
      <view class="editbox">
        <textarea v-model="textareaVal" placeholder="写点什么吧..." class="textarea" />
        <view class="uni-list list-pd">
          <view class="uni-list-cell cell-pd">
            <view class="uni-uploader">
              <view class="uni-uploader-body">
                <view class="uni-uploader__files">
                  <block v-for="(image, index) in imageList" :key="index">
                    <view class="uni-uploader__file imgBox">
                      <image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
                      <image src="../../static/img/shanchu.png" class="del" @click="delImg(index)" />
                    </view>
                  </block>
                  <view class="uni-uploader__input-box"><view class="uni-uploader__input" @tap="chooseImage"></view></view>
                </view>
              </view>
              <view class="uni-uploader-head">
                <view class="uni-uploader-title">最多可选择9张图片</view>
                <view class="uni-uploader-info">{{ imageList.length }}/9</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom"><button type="warn" @click="submitData">提交</button></view>
  </view>
</template>

<script>
import QSPickerCustom from '@/components/QS-inputs-split/elements/QS-picker-custom/index.vue';

var sourceType = [['camera'], ['album'], ['camera', 'album']];
var sizeType = [['compressed'], ['original'], ['compressed', 'original']];
export default {
  name: 'addArticle',
  components: { QSPickerCustom },
  data() {
    return {
      appNo: 'sqfw',
      classify: {}, // 类型
      noteColumn: {}, // 栏目
      paddingBottom: 20,
      pageTitle: '',
      a: [11213, 12],
      selectList: [], //类型下拉选项
      noteColumns: [], //栏目下拉选项

      imageList: [],
      imgPathList: [],
      textareaVal: '',
      sourceTypeIndex: 2,
      sourceType: ['拍照', '相册', '拍照或相册'],
      sizeTypeIndex: 2,
      sizeType: ['压缩', '原图', '压缩或原图']
    };
  },
  methods: {
    onKeyInput: function(event) {
      this.pageTitle = event.target.value;
    },
    previewImage: function(e) {
      var current = e.target.dataset.src;
      uni.previewImage({
        current: current,
        urls: this.imageList
      });
    },
    isFullImg: function() {
      return new Promise(res => {
        uni.showModal({
          content: '已经有9张图片了,是否清空现有图片？',
          success: e => {
            if (e.confirm) {
              this.imageList = [];
              res(true);
            } else {
              res(false);
            }
          },
          fail: () => {
            res(false);
          }
        });
      });
    },
    delImg(i) {
      this.imageList.splice(i, 1);
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
      let that = this;
      if (this.imageList.length === 9) {
        let isContinue = await this.isFullImg();
        console.log('是否继续?', isContinue);
        if (!isContinue) {
          return;
        }
      }
      uni.chooseImage({
        sourceType: sourceType[this.sourceTypeIndex],
        sizeType: sizeType[this.sizeTypeIndex],
        count: 1,
        // count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
        success: res => {
          let temp = res.tempFilePaths;
          //图片上传至服务器
          let bxAuthTicket = uni.getStorageSync('bxAuthTicket');
          // let appNo = that.appNo;
          var uploadTask = uni.uploadFile({
            url: this.$api.select + '/file/upload', //仅为示例，非真实的接口地址,需要替换成自己的接口地址
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
              this.imgPathList = this.imgPathList.concat(data.fileurl);
              this.imageList = this.imageList.concat(this.$api.select + '/file/download?filePath=' + data.fileurl);
              console.log(data, this.imageList);
              // that.$set(that.editItems[that.editItems.length], 'value', 'http://39.98.203.134:8081/file/download?filePath='+data.fileurl);
            },
            complete: e => {
              // uni.hideLoading()
            }
          });
        },
        fail: err => {
          // #ifdef APP-PLUS
          // if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
          // 	this.checkPermission(err.code);
          // }
          // #endif
          // #ifdef MP
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
          // #endif
        }
      });
    },
    getColumns() {
      let url = this.$api.select + '/sqfw/select/srvsys_service_columnex_v2_select ';
      let req = {
        serviceName: 'srvsys_service_columnex_v2_select',
        colNames: ['*'],
        condition: [{ colName: 'service_name', value: 'srvzhsq_forum_note_select', ruleType: 'eq' }, { colName: 'use_type', value: 'detail', ruleType: 'eq' }],
        order: [{ colName: 'seq', orderType: 'asc' }]
      };
      this.$http.post(url, req).then(res => {
        if (res.data.data) {
          let cols = res.data.data.srv_cols;
          let colArr = []; // 类型
          let columnArr = []; // 栏目
          /* TODO 查找论坛栏目列表 */

          let selectList = [];
          cols.map(item => {
            if (item.label === '类型') {
              console.log(item);
              colArr = colArr.concat(item.option_list_v2);
            }
          });
          colArr.map(item => {
            selectList.push(item.label);
          });
          this.selectList = colArr;
          // let nationArr = ["学术","政治","军事"];
          setTimeout(() => {
            this.setPickerData(selectList);
          }, 500);
        }
      });
    },

    submitData() {
      let selectList = this.selectList;
      let classify = this.classify['data'] ? this.classify['data'][0] : '默认';
      let type = '';
      if (selectList) {
        selectList.map(item => {
          if (item.label === classify) {
            type = item.value;
          }
        });
      }
      let textareaVal = this.textareaVal;
      if (this.imgPathList) {
        this.imgPathList.map(imgs => {
          textareaVal += `</br><img src="${this.$api.select}/file/download?filePath=${imgs}"></img>`;
        });
      }
      let content = {
        bt: this.pageTitle,
        lx: type,
        nr: textareaVal
      };

      let url = this.$api.add + '/zhdj/operate/srvzhsq_djlt_ftxx_add'; // 社区论坛发帖
      let req = [
        {
          serviceName: 'srvzhsq_djlt_ftxx_add',
          data: [content]
        }
      ];
      this.$http.post(url, req).then(res => {
        console.log(res);
        if (res.data.resultCode === 'SUCCESS' && res.data.response) {
          let id = res.data.response[0].response.ids[0];
          console.log(id);
          let url2 = this.$api.select + '/zhdj/select/srvzhsq_djlt_ftxx_select';
          let req2 = {
            serviceName: 'srvzhsq_djlt_ftxx_select',
            colNames: ['*'],
            condition: [{ colName: 'id', ruleType: 'eq', value: id }],
            order: []
          };
          this.$http.post(url2, req2).then(res2 => {
            if (res2.data.data) {
              uni.showModal({
                title: '提示',
                content: '提交成功，即将跳转到详情',
                success: res => {
                  if (res.confirm) {
                    uni.navigateTo({
                      url: './detail?no=' + res2.data.data[0].ftno
                    });
                  }
                }
              });
            }
          });
        }
      });
    },
    changePicker(e) {
      console.log(e);
    },
    setPickerData(nationArr) {
      const data1 = [nationArr];
      console.log('准备 调用setData', data1);
      this.setPickerDataFc(data1);
    },
    setPickerDataFc(data1) {
      console.log('准备 调用setData', this.$refs);
      this.$refs['nationPicker'].setData(data1);
      // this.$refs['columnPicker'].setData(data2);
    }
  },
  onLoad(option) {
    this.getColumns();
  }
};
</script>

<style lang="scss">
.uni-list::before {
  height: 0px;
}
.imgBox {
  position: relative;
  margin-top: 10upx;
  margin-bottom: 10upx;
  .del {
    width: 40upx;
    height: 40upx;
    position: absolute;
    bottom: 30upx;
    cursor: pointer;
    right: 20upx;
  }
}
// .uni-list::after{
//   height: 0px;
// }
.add_pages {
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 0 auto;
  position: relative;
  .icon {
    width: 32upx;
    height: 32upx;
    margin-right: 20upx;
  }
  input {
    width: 85%;
  }
  .forumTitleBox {
    display: flex;
    align-items: center;
    height: 100upx;
    text-indent: 20upx;
  }
  .forumClassBox {
    display: flex;
    flex-direction: column;
    .class_box_title {
      display: flex;
      font-size: 32upx;
      align-items: center;
      text-indent: 20upx;
      .mpvue-picer {
        // padding: 0 100px;
        min-width: 60%;
      }
    }
    .tag_box {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      max-height: 340upx;
      // justify-content:space-between;
      .class_title {
        width: 100%;
        font-size: 30upx;
        text-indent: 1rem;
      }
      .inputBox {
        width: 100%;
        display: flex;
        height: 60upx;
        .tag_input {
          width: 70%;
        }
        uni-button {
          width: 120upx;
          line-height: 60upx;
          height: 60upx;
          font-size: 24upx;
          text-indent: 0;
          padding: 0;
        }
      }
      .bx-tag {
        // min-width: 100upx;
        height: 60upx;
        border-radius: 4px;
        margin: 10upx;
        padding: 0 5upx;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        .text {
          padding: 0 10upx;
          text-indent: 0;
        }
        &:first-child {
          background-color: #e54d42;
        }
        &:nth-child(2) {
          background-color: #f37b1d;
        }
        &:nth-child(3) {
          background-color: #fbbd08;
        }
        &:nth-child(4) {
          background-color: #8dc63f;
        }
        &:nth-child(5) {
          background-color: #9c26b0;
        }
        &:nth-child(6) {
          background-color: #1cbbb4;
        }
        &:nth-child(7) {
          background-color: #0081ff;
        }
        &:nth-child(8) {
          background-color: #8dc63f;
        }
        &:nth-child(9) {
          background-color: #8dc63f;
        }
        // &:nth-child(10) {
        //   background-color: #f37b1d;
        // }
      }
      .uni-tag {
        // width: 30%;
        margin: 10upx 20upx;
      }
    }
  }
  .forumContentBox {
    display: flex;
    // min-height: 300upx;
    width: 100%;
    height: auto;
    overflow: scroll;
    background-color: #fff;
    .icon {
      padding: 30upx 0;
    }
    .editbox {
      // width: 80%;
      flex: 1;
      overflow: hidden;
      .textarea {
        border: 1px solid #c8c7cc;
        width: calc(100% - 4upx);
        box-sizing: border-box;
        text-indent: 24upx;
        padding: 15upx;
      }
    }
  }
  .bottom {
    width: 100%;
    display: flex;
    align-items: center;
    height: 200upx;
    bottom: 0;
    left: 10%;
    button {
      height: 80upx;
      line-height: 80upx;
      width: 30%;
    }
  }
}
</style>
