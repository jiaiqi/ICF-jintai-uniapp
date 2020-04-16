<template>
  <view class="add_pages ">
    <view class="forumTitleBox cu-form-group margin-top">
      <view class="title">标题</view>
      <input type="text" placeholder="标题" v-model="pageTitle" />
    </view>
    <view class="forumClassBox cu-form-group margin-top">
      <view class="title">栏目</view>
      <picker @change="ColumnChange" :value="index2" :range="columnsList">
        <view class="picker">{{ index2 > -1 ? columnsList[index2] : '请选择分类' }}</view>
      </picker>
    </view>
    <view class="forumClassBox cu-form-group margin-top">
      <view class="title">分类</view>
      <picker @change="PickerChange" :value="index1" :range="classify">
        <view class="picker">{{ index1 > -1 ? classify[index1] : '请选择分类' }}</view>
      </picker>
    </view>
    <view class="forumContentBox cu-form-group margin-top">
      <!-- <image src="../../static/img/words.png" mode="" class="icon"></image> -->
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
              <!--   <view class="uni-uploader-head">
                <view class="uni-uploader-title">最多可选择9张图片</view>
                <view class="uni-uploader-info">{{ imageList.length }}/9</view>
              </view> -->
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom"><button type="warn" @click="submitData">提交</button></view>
  </view>
</template>

<script>
var sourceType = [['camera'], ['album'], ['camera', 'album']];
var sizeType = [['compressed'], ['original'], ['compressed', 'original']];
import { dateUtils } from '../../common/util.js';
export default {
  name: 'addArticle',
  data() {
    return {
      appNo: 'sqfw',
      appName: '',
      index1: -1, //分类下标
      index2: -1, //栏目下标
      multiIndex: [0, 0], //栏目下标
      multiArray: [[' - '], [' - ']],
      query: '', //url参数
      // classify: {}, // 类型
      classify: ['学术', '政治', '军事'],
      columnsList: [], //栏目分类
      parentsList: [], //父栏目
      paddingBottom: 20,
      pageTitle: '',
      a: [11213, 12],
      selectList: [], //类型下拉选项
      categoryList: [], //栏目数据
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
    PickerChange(e) {
      this.index1 = e.detail.value;
      console.log('选择了：', this.classify[this.index1]);
    },
    ColumnChange(e) {
      this.index2 = e.detail.value;
      console.log('选择了：', this.columnsList[this.index2]);
    },
    MultiChange(e) {
      this.multiIndex = e.detail.value;
      console.log(this.multiArray[0][this.multiIndex[0]], this.multiArray[1][this.multiIndex[1]]);
    },
    MultiColumnChange(e) {
      let data = {
        multiArray: this.multiArray,
        multiIndex: this.multiIndex
      };
      let columnList = this.categoryList; //栏目数据
      data.multiIndex[e.detail.column] = e.detail.value;
      data.multiArray[1] = this.categoryList[data.multiIndex[0]].children;
      data.multiIndex[1] = 0;
      this.multiArray = data.multiArray;
      this.multiIndex = data.multiIndex;
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
              this.imgPathList = this.imgPathList.concat(data.fileurl);
              this.imageList = this.imageList.concat(that.$api.select + '/file/download?filePath=' + data.fileurl);
              console.log(data, this.imageList);
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
    },
    getCategory() {
      // 查找论坛栏目列表
      let serviceName = 'srvzhsq_forum_column_select';
      if (this.appName != 'sqfw') {
        serviceName = 'srvzhsq_djlt_ltlm_select';
      }
      let url = this.$api.select + '/' + this.appName + '/select/' + serviceName;
      let req = {
        serviceName: serviceName,
        colNames: ['*'],
        // condition: [{ colName: 'parent_no', ruleType: 'isnull' }],
        page: { pageNo: 1, rownumber: 10 },
        order: []
      };
      let columnsList = [];
      let parentsList = [];
      let childrenList = [];
      this.$http
        .post(url, req)
        .then(res => {
          if (res.data.data) {
            return res.data.data;
          }
        })
        .then(datas => {
          if (datas) {
            console.log(datas);
            this.columnsList = datas.map(col => {
              if (col.column_title) {
                return col.column_title;
              }
              if (col.mc) {
                return col.mc;
              }
            });
            this.categoryList = columnsList;
            this.multiArray = [parentsList, columnsList];
          }
        });
    },
    getColumns() {
      let url = this.$api.select + '/' + this.appName + '/select/srvsys_service_columnex_v2_select ';
      let serviceName = '';
      if (this.appName === 'sqfw') {
        serviceName = 'srvzhsq_forum_note_select';
      } else if (this.appName === 'zhdj') {
        serviceName = 'srvzhsq_djlt_ftxx_select';
      }
      let req = {
        serviceName: 'srvsys_service_columnex_v2_select',
        colNames: ['*'],
        condition: [
          { colName: 'service_name', value: serviceName, ruleType: 'eq' },
          { colName: 'use_type', value: 'detail', ruleType: 'eq' },
          { colName: 'in_add', value: 1, ruleType: 'eq' }
        ],
        order: [{ colName: 'seq', orderType: 'asc' }]
      };
      this.$http.post(url, req).then(res => {
        if (res.data.data) {
          let cols = res.data.data.srv_cols;
          let colArr = []; // 类型
          let selectList = [];
          cols.map(item => {
            if (item.label === '类型') {
              colArr = colArr.concat(item.option_list_v2);
            }
          });
          colArr.map(item => {
            selectList.push(item.label);
          });
          this.selectList = colArr;
          setTimeout(() => {
            this.setPickerData(selectList);
          }, 500);
        }
      });
    },
    submitData() {
      let selectList = this.selectList;
      let classify = this.classify[this.index1] ? this.classify[this.index1] : '默认';
      let column = this.multiArray[1][this.multiIndex[1]] ? this.multiArray[1][this.multiIndex[1]] : this.columnsList[this.index2] ? this.columnsList[this.index2] : ''; //根据column_title查找column_no
      let type = '';
      selectList.map(item => {
        if (item.label === classify) {
          type = item.value;
        }
      });
      let img = this.imgPathList[0];
      if (img) {
        img = img.split('/');
        img = img[img.length - 2];
      }
      let textareaVal = this.textareaVal;
      this.imgPathList.map(imgs => {
        textareaVal += `</br><img src="${this.$api.select}/file/download?filePath=${imgs}"></img>`;
      });
      let content = {
        note_title: this.pageTitle,
        note_type: type,
        note_column: column,
        content: textareaVal,
        images: img
      };
      console.log(content);
      let serviceName = '';
      if (this.appName === 'sqfw') {
        serviceName = 'srvzhsq_forum_note_add';
        content = {
          note_title: this.pageTitle,
          note_type: type,
          note_column: column,
          // release_time:new Date().toISOString().slice(0,10)+' '+new Date().toISOString().slice(11,19),//减了8小时
          release_time: new Date().toLocaleDateString().replace(/\//g, '-') + ' ' + new Date().toTimeString().slice(0, 8), //当前时间
          release_user: uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo').user_no : '',
          content: textareaVal,
          images: img
        };
        debugger;
      } else if (this.appName === 'zhdj') {
        serviceName = 'srvzhsq_djlt_ftxx_add';
        content = {
          bt: this.pageTitle,
          lx: type,
          lm: column,
          nr: textareaVal
        };
      }
      let url = this.$api.add + '/' + this.appName + '/apply/' + serviceName;
      let req = [
        {
          serviceName: serviceName,
          data: [content]
        }
      ];
      this.$http
        .post(url, req)
        .then(res => {
          console.log(res);
          if (res.data.resultCode === 'SUCCESS' && res.data.response) {
            uni.showModal({
              title: '提示',
              content: '提交成功，审核通过后将会展示在论坛，点击确认返回帖子列表页',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  uni.navigateBack();
                }
              }
            });
          }
        })
        .catch(error => {
          console.log('error:', error);
        });
    },
    changePicker(e) {
      console.log(e);
    },
    setPickerData(classArr) {
      this.classify = classArr;
    }
  },
  onLoad(option) {
    if (option.query) {
      let query = JSON.parse(decodeURIComponent(option.query));
      console.log(query);
      if (query) {
        this.query = query;
        this.appName = query.appType;
        // if (query.menu_no === 'bxsqlt_sqlt') {
        //   this.appName = 'sqfw';
        // } else if (query.menu_no === 'bxzhsq_djlt') {
        //   this.appName = 'zhdj';
        // }
      }
    }
    this.getColumns();
    this.getCategory();
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
    // text-indent: 20upx;
  }
  .forumClassBox {
    display: flex;
  }
  .forumContentBox {
    display: flex;
    width: 100%;
    height: auto;
    overflow: scroll;
    background-color: #fff;
    .icon {
      padding: 30upx 0;
    }
    .editbox {
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
