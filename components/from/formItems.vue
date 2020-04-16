<template>
  <view>
    <view class="cu-form-group margin-top" v-if="Fileddatas.col_type !== 'Image' && Fileddatas.col_type !== 'FileList'">
      <view class="title">
        <text class="required" v-if="Fileddatas.validators.includes('required')">*</text>
        {{ Fileddatas.label }}
      </view>
      <input
        class="input"
        @input="handleInput(Fileddatas.columns, Fileddatas.column, Fileddatas._formItemValidators)"
        @blur="handleBlur"
        v-if="Fileddatas.col_type === 'String'"
        v-model="Fileddatas.column"
        :disabled="Fileddatas.updatable === 0 ? true : false"
        :key="keys"
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null ? Fileddatas.placeholder : '请输入内容'"
      />
      <input
        class="input"
        @input="handleInput(Fileddatas.columns, Fileddatas.column, Fileddatas._formItemValidators)"
        @blur="handleBlur"
        disabled
        :key="keys"
        v-if="(Fileddatas.bx_col_type === 'enum' || Fileddatas.col_type === 'Enum') && Fileddatas.table_column === 'hdlb'"
        value="党建活动"
      />
      <picker
        @change="PickerChange"
        :value="index"
        :range="picker"
        :key="keys"
        v-if="(Fileddatas.bx_col_type === 'enum' || Fileddatas.col_type === 'Enum') && Fileddatas.columns !== 'sflb' && Fileddatas.table_column !== 'hdlb'"
      >
        <view class="picker">{{ index > -1 ? picker[index] : '请选择' + Fileddatas.label }}</view>
      </picker>
      <picker @change="PickerChange" :value="index" :range="picker" v-if="Fileddatas.columns === 'sflb'" :key="keys">
        <view class="picker">{{ index > -1 ? picker[index] : '否' }}</view>
      </picker>
      <view class="cu-bar bg-white margin-top"></view>
      <textarea
        :key="keys"
        v-if="Fileddatas.col_type === 'MultilineText' || Fileddatas.col_type === 'Note'"
        placeholder="请输入内容"
        class="text-box textarea"
        scroll-y="true"
        ref="mult"
        @input="handleInput(Fileddatas.columns, Fileddatas.column, Fileddatas._formItemValidators)"
        @blur="handleBlur"
        v-model="Fileddatas.column"
        @focus="formValidators(Fileddatas.column, Fileddatas._formItemValidators)"
      ></textarea>
      <input
        :key="keys"
        v-if="Fileddatas.col_type === 'int'"
        class="uni-form-item uni-column input"
        :maxlength="Fileddatas._formItemValidators.max"
        @input="handleInput(Fileddatas.columns, Fileddatas.column, Fileddatas._formItemValidators)"
        type="number"
        v-model="Fileddatas.column"
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null ? Fileddatas.placeholder : '请输入序号'"
      />
      <input
        :key="keys"
        v-if="Fileddatas.col_type === 'TelNo'"
        class="uni-form-item uni-column input"
        :maxlength="Fileddatas._formItemValidators.max"
        @input="handleInput(Fileddatas.columns, Fileddatas.column, Fileddatas._formItemValidators)"
        type="number"
        v-model="Fileddatas.column"
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null ? Fileddatas.placeholder : '请输入手机号'"
      />
      <input
        :key="keys"
        v-if="Fileddatas.col_type === 'IdNo'"
        class="uni-form-item uni-column input"
        :maxlength="Fileddatas._formItemValidators.max"
        @input="handleInput(Fileddatas.columns, Fileddatas.column, Fileddatas._formItemValidators)"
        type="number"
        v-model="Fileddatas.column"
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null ? Fileddatas.placeholder : '请输入身份证号'"
      />
      <input
        :key="keys"
        v-if="Fileddatas.col_type === 'Email'"
        class="uni-form-item uni-column input"
        :maxlength="Fileddatas._formItemValidators.max ? Fileddatas._formItemValidators.max : 50"
        @input="handleInput(Fileddatas.columns, Fileddatas.column, Fileddatas._formItemValidators)"
        v-model="Fileddatas.column"
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null ? Fileddatas.placeholder : '请输入邮箱'"
      />
      <input
        :key="keys"
        v-if="Fileddatas.col_type === 'bxzhsq_activity_arrange' && Fileddatas.bx_col_type === 'fk'"
        class="input"
        :maxlength="Fileddatas._formItemValidators.max"
        @input="handleInput(Fileddatas.columns, Fileddatas.column, Fileddatas._formItemValidators)"
        v-model="Fileddatas.column"
        :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null ? Fileddatas.placeholder : '请输入活动名称'"
      />
      <picker
        :key="keys"
        @change="PickerChange"
        :value="index"
        :range="picker"
        v-if="
          ((Fileddatas.bx_col_type === 'fk' || Fileddatas.col_type === 'fk') &&
            (Fileddatas.col_type === 'bxzhsq_zyz_zuzhi' ||
              Fileddatas.col_type === 'bxzhsq_social_organizie' ||
              Fileddatas.col_type === 'bxzhsq_tenement_gzfxx' ||
              Fileddatas.col_type === 'bxzhsq_tenement_lzfxx')) ||
            Fileddatas.col_type === 'Dept' ||
            Fileddatas.col_type === 'fk'
        "
      >
        <view class="picker">{{ index > -1 ? picker[index] : '请选择' + Fileddatas.label }}</view>
      </picker>
      <picker :key="keys" @change="PickerChange" :value="index" :range="picker" v-if="Fileddatas.bx_col_type === 'dict'">
        <view class="picker">{{ index > -1 ? picker[index] : '请选择' + Fileddatas.label }}</view>
      </picker>
      <picker
        :key="keys"
        mode="date"
        :value="date"
        start="2015-09-01"
        end="2050-09-01"
        @change="DateChange"
        v-if="Fileddatas.col_type === 'Date' || Fileddatas.col_type === 'DateTime'"
      >
        <view class="picker">{{ date }}</view>
      </picker>
      <picker :key="keys" mode="time" :value="time" start="2015-09-01" end="2050-09-01" @change="TimeChange" v-if="Fileddatas.col_type === 'DateTime'">
        <view class="picker">{{ time }}</view>
      </picker>
      <input
        :key="keys"
        class="input"
        readonly
        v-if="Fileddatas.col_type === 'User' && Fileddatas.label !== '作者' && Fileddatas.columns !== 'release_user'"
        @change="bindDateChange"
        @tap="setUserPoup"
        :value="userList.userSelected.user_disp"
        placeholder="选择发布人"
      />
      <input class="input" disabled v-if="Fileddatas.col_type === 'User' && (Fileddatas.label === '作者' || Fileddatas.columns === 'release_user')" :value="userInfo.user_no" />
      <!-- <input class="input" readonly ref="deptSelect" v-if="Fileddatas.col_type === 'Dept'" @tap="setDeptPoup" :value="DeptList.DeptSelected.label" placeholder="选择部门" /> -->

      <uni-popup v-if="Fileddatas.col_type === 'User'" ref="Upopup" type="bottom">
        <view class="popup-view">
          <view class="header">
            <view class="search">
              <input class="uni-input search_input" v-model="userList.search" type="text" adjust-position focus confirm-type="search" placeholder="自动获得焦点" />
              <button class="search_button" @tap="userSearch" type="submit"></button>
            </view>
          </view>
          <view class="popup-body">
            <ul>
              <li class="demo5-item" :class="{ 'demo4-item-selected': index == ins }" @tap="choose(item, index)" v-for="(item, index) in userList.Fileddatas" :key="index">
                {{ item && item.user_disp }}
              </li>
            </ul>
          </view>
        </view>
      </uni-popup>
      <!-- <uni-popup v-if="Fileddatas.col_type === 'Dept'" ref="Dpopup" type="bottom"> -->
      <!-- <zy-search :is-focus="false" :theme="themeClass" :show-want="true" :speechEngine="speechEngine"
        :hot-list="hotList" @getSearchText="getSearchText"></zy-search> -->
      <!-- <view class="popup-view">
          <view class="header">
            <view class="search">
              <input class="uni-input search_input" v-model="DeptList.search" type="text" adjust-position focus confirm-type="search" placeholder="自动获得焦点" />
              <button class="search_button" @tap="DeptSearch" type="submit"></button>
            </view>
          </view>
          <view class="popup-body">
            <ul>
              <li class="demo5-item" :class="{ 'demo4-item-selected': index == DeptAct }" @tap="DeptChoose(item, index)" v-for="(item, index) in DeptList.Fileddatas" :key="index">
                {{ item && item.dept_name }}
              </li>
            </ul>
          </view>
        </view> -->
      <!-- </uni-popup> -->
    </view>
    <view class="cu-bar bg-white margin-top" v-if="Fileddatas.col_type === 'Image'" :key="keys">
      <view class="action">
        <text class="required" v-if="Fileddatas.validators.includes('required')">*</text>
        {{ Fileddatas.label }}
      </view>
      <view class="action">{{ imgList.length }}/1</view>
    </view>
    <view class="cu-form-group" v-if="Fileddatas.col_type === 'Image'" :key="keys">
      <view class="grid col-4 grid-square flex-sub">
        <view class="bg-img" v-for="(item, index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
          <image :src="imgList[index]" mode="aspectFill"></image>
          <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index"><text class="cuIcon-close"></text></view>
        </view>
        <!-- 		<view class="solids" @click="chooseImagesp" style="text-align: center;line-height: 150upx;">
			拍照
		</view> -->
        <view class="solids" @tap="ChooseImage" v-if="imgList.length < 1"><text class="cuIcon-cameraadd"></text></view>
      </view>
    </view>
  </view>
</template>
<script>
import Emitter from '@/static/js/mixins/emitter.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
  name: 'iFormItem',
  components: {
    uniPopup
  },
  computed: {
    startDate() {
      return this.getDate('start');
    },
    endDate() {
      return this.getDate('end');
    },
    dateTime() {
      // this.Fileddatas.column = this.date + ' ' + this.time
      let date = this.date !== '选择日期' ? this.date : ' ';
      let time = this.time !== '选择时间' ? this.time : ' ';
      return date + ' ' + time;
    },
    fkSelectList: function(e) {
      let cond = [];
      let a = {
        colName: e.key_disp_col,
        value: '',
        ruleType: 'like'
      };
      cond.push(a);
      let d = this.selectOne(e.serviceName, cond);
      console.log(d);
      return d;
    }
  },
  props: {
    fromColData: {}
  },
  mixins: [Emitter],
  data() {
    return {
      keys: false,
      themeClass: 'block',
      speechEngine: 'baidu', //语音识别引擎
      hotList: ['栏目1', '栏目2', '栏目3', '栏目4'], //搜索组件初始化推荐列表
      userInfo: uni.getStorageSync('userInfo'),
      index: -1,
      picker: ['网络状况较差，请稍后进行选择'],
      originPicker: null,
      imgList: [],
      imgPathList: [],
      query: {}, //url参数
      date: '选择日期',
      time: '选择时间',
      oldColData: {},
      Fileddatas: {},
      currentValue: '',
      formValids: {
        valid: Boolean,
        msg: ''
      },
      _tableValid: this.fromColData._tableValid,
      menuKey: new Date().getTime(),
      showUserList: false,
      save: [],
      DeptData: [],
      userList: {
        search: '',
        Fileddatas: [],
        userSelected: {
          user_disp: '',
          user_no: ''
        }
      },
      DeptList: {
        search: '',
        Fileddatas: [],
        DeptSelected: {
          label: '',
          key: ''
        }
      },
      setList: [],
      fkPopupModel: {
        showPopup: false,
        search: '',
        Fileddatas: [],
        selected: {
          key: '',
          label: ''
        }
      },
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll('.weui-uploader__file')[index];
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      },
      imagePreviewer: [],
      ins: null,
      DeptAct: null
    };
  },
  created() {
    let self = this;
    this.$on('on-submit', this.onSubmit);
    if (this.fromColData.bx_col_type === 'fk') {
      // this.getPopupList()
    }
    this.$on('remove', this.removeImageMethod);
    this.$on('set-table-valid', event => {
      if (event.colName === this.Fileddatas.columns) {
        this.setTableValid(event);
        console.log(event);
      }
    });
    this.toCols();
  },
  mounted() {
    // if (this.Fileddatas.columns === 'nation') {
    if (this.Fileddatas.bx_col_type === 'enum' || this.Fileddatas.col_type === 'Enum') {
      let arr = this.Fileddatas.option_list_v2;
      let nationArr = [];
      arr.map(items => {
        nationArr.push(items.value);
      });
      setTimeout(() => {
        this.setPickerData(nationArr);
      }, 500);
    } else if (
      this.Fileddatas.col_type === 'bxzhsq_zyz_zuzhi' ||
      this.Fileddatas.col_type === 'bxzhsq_social_organizie' ||
      this.Fileddatas.col_type === 'bxzhsq_tenement_gzfxx' ||
      this.Fileddatas.col_type === 'bxzhsq_tenement_lzfxx' ||
      this.Fileddatas.col_type === 'fk'
    ) {
      this.getOptionList();
    } else if (this.Fileddatas.col_type === 'Dept') {
      this.getDept();
    } else if (this.Fileddatas.col_type === 'Dict') {
      this.picker = this.Fileddatas.option_list_v2.map(item => {
        return item.label;
      });
      this.originPicker = this.Fileddatas.option_list_v2;
    }

    if ((this.Fileddatas.bx_col_type === 'enum' || this.Fileddatas.col_type === 'Enum') && this.Fileddatas.table_column === 'hdlb') {
      this.Fileddatas.column = '党建活动';
      this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);
    }
  },
  onShow() {
    /// 如果没有传入 prop，则无需校验，也就无需缓存
    if (this.prop) {
      this.dispatch('iForm', 'on-form-item-add', this);
    }
  },

  methods: {
    getFkOption(option) {
      console.log(option, 'fffffffkkkkkkkkkk', this.Fileddatas);
      let req = {
        serviceName: option.serviceName,
        queryMethod: 'select',
        distinct: false,
        colNames: ['*'],
        condition: option.condition,
        page: { pageNo: 1, rownumber: 20 }
      };
      let url = this.$api.select + '/sqfw/select/' + option.serviceName;
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS') {
        }
      });
    },
    getSearchText(e) {
      uni.showToast({
        title: '回调的搜索信息: ' + e,
        icon: 'none'
      });
    },
    DateChange(e) {
      // console.log(e)
      // this.Fileddatas.column = e.detail.value
      this.date = e.detail.value;
      this.Fileddatas.column = this.dateTime;
      this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);
      console.log('选择了：', this.Fileddatas.column);
    },
    TimeChange(e) {
      this.time = e.detail.value;
      this.Fileddatas.column = this.dateTime;
      this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);
      console.log('选择了：', this.Fileddatas.column);
    },
    PickerChange(e) {
      if (e.detail.value != -1) {
        this.index = e.detail.value;
      } else {
        this.index = 0;
      }
      this.Fileddatas.column = this.picker[this.index];
      if (this.originPicker) {
        this.originPicker.map(or => {
          this.picker.map(picker => {
            if (picker === or.organize_name) {
              this.Fileddatas.column = or.organize_no;
            }
            if (picker === or.zuzhi_name) {
              this.Fileddatas.column = or.zuzhi_no;
            }
            if (picker === or.title) {
              this.Fileddatas.column = or.title;
            }
            if (picker === or.label) {
              this.Fileddatas.column = or.value;
            }
          });
        });
      }
      if (this.Fileddatas.columns === 'sflb') {
        this.Fileddatas.column = this.Fileddatas.column ? this.Fileddatas.column : '否';
      }
      this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);
      console.log('选择了：', this.Fileddatas.column, e);
    },
    chooseImagesp() {
      const ctx = uni.createCameraContext();
      ctx.takePhoto({
        quality: 'high',
        success: res => {
          // this.src = res.tempImagePath
          console.log(res);
        }
      });
    },
    ChooseImage() {
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: res => {
          if (this.imgList.length != 0) {
            this.imgList = this.imgList.concat(res.tempFilePaths);
          } else {
            this.imgList = res.tempFilePaths;
          }
          let temp = res.tempFilePaths;
          //图片上传至服务器
          let bxAuthTicket = uni.getStorageSync('bxAuthTicket');
          // let appNo = that.appNo;
          var uploadTask = uni.uploadFile({
            url: this.$api.select + '/file/upload', //上传文件的接口地址
            filePath: temp[0],
            header: { bx_auth_ticket: bxAuthTicket },
            name: 'file',
            formData: {
              serviceName: 'srv_bxfile_service',
              interfaceName: 'add',
              app_no: this.query.app_no
            },
            success: e => {
              var data = JSON.parse(e.data);
              this.imgPathList = this.imgPathList.concat(data.fileurl);
              this.imgList = [this.$api.select + '/file/download?filePath=' + data.fileurl];
              console.log(data, this.imgList, this.imgPathList);
              this.Fileddatas.column = data.file_no;
              this.handleInput(this.Fileddatas.columns, '党建活动', this.Fileddatas._formItemValidators);
              console.log('file_no：', this.Fileddatas.column);
            },
            complete: e => {
              // uni.hideLoading()
            }
          });
        }
      });
    },
    ViewImage(e) {
      uni.previewImage({
        urls: this.imgList,
        current: e.currentTarget.dataset.url
      });
    },
    DelImg(e) {
      uni.showModal({
        title: '提示',
        content: '确定要删除这段回忆吗？',
        cancelText: '再看看',
        confirmText: '再见',
        success: res => {
          if (res.confirm) {
            this.imgList.splice(e.currentTarget.dataset.index, 1);
          }
        }
      });
    },
    changeTime(e) {
      console.log(e);
      this.Fileddatas.column = e;
      this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);
    },
    choose(item, i) {
      this.ins = i;
      this.userList.userSelected.user_disp = item.user_disp;

      this.Fileddatas.column = item.user_no;
      this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);
      this.$refs.Upopup.close();
    },
    DeptChoose(item, i) {
      this.DeptAct = i;
      this.DeptList.DeptSelected.label = item.dept_name;

      this.Fileddatas.column = item.dept_no;
      this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);

      this.$refs.Dpopup.close();
    },
    userSearch() {
      let url = this.$api.select + '/sso/select/srvsso_user_select';
      let req = {};
      req.serviceName = 'srvsso_user_select';
      req.colNames = ['*'];
      if (this.userList.search) {
        req.condition = [
          {
            colName: 'user_disp',
            ruleType: 'like',
            value: this.userList.search
          }
        ];
      } else {
        req.condition = [];
      }
      req.order = [];
      req['page'] = {
        pageNo: 1,
        rownumber: 10
      };
      this.$http.post(url, req).then(resp => {
        this.userList.Fileddatas = resp.data.data;
        this.choose(this.userList.Fileddatas[0], 0);
      });
    },
    DeptSearch() {
      let url = this.$api.select + '/auth/select/srvauth_dept_select';
      let req = {};
      req.serviceName = 'srvauth_dept_select';
      req.colNames = ['*'];
      if (this.DeptList.search) {
        req.condition = [
          {
            colName: 'dept_name',
            ruleType: 'like',
            value: this.DeptList.search
          },
          {
            colName: 'is_leaf',
            ruleType: 'eq',
            value: '是'
          }
        ];
      } else {
        req.condition = [
          {
            colName: 'is_leaf',
            ruleType: 'eq',
            value: '是'
          }
        ];
      }
      req.order = [];
      req['page'] = {
        pageNo: 1,
        rownumber: 10
      };
      this.$http.post(url, req).then(resp => {
        this.DeptList.Fileddatas = resp.data.data;
      });
    },
    radioChange(e) {
      console.log('radioChange', e.detail.value, e);
      this.Fileddatas.column = e.detail.value;
      this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);
    },
    setUserPoup() {
      this.$refs.Upopup.open();
      this.getUser();
    },
    // setDeptPoup() {
    //   this.$refs.Dpopup.open();
    //   this.getDept();
    // },
    setPickerData(nationArr) {
      // let data1 = [nationArr];
      this.picker = nationArr;
    },
    getUser() {
      let url = this.$api.select + '/sso/select/srvsso_user_select';
      let req = {};
      req.serviceName = 'srvsso_user_select';
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req['page'] = {
        pageNo: 1,
        rownumber: 100
      };
      this.$http.post(url, req).then(resp => {
        this.save = resp.data.data;
        this.userList.Fileddatas = resp.data.data;
        // this.userSearch()
      });
    },
    getDept() {
      let url = this.$api.select + '/auth/select/srvauth_dept_select';
      let req = {};
      req.serviceName = 'srvauth_dept_select';
      req.colNames = ['*'];
      req.condition = [{ colName: 'is_leaf', ruleType: 'eq', value: '是' }];
      req.order = [];
      this.$http.post(url, req).then(resp => {
        this.DeptList.Fileddatas = resp.data.data;
        let data = resp.data.data;
        this.originPicker = data;
        this.picker = data.map(item => {
          return item.dept_name;
        });
      });
    },
    bindTextAreaBlur(e) {
      console.log(e.detail.value);
      this.Fileddatas.column = e.detail.value;
      this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);
    },
    bindDateChange: function(e) {
      this.date = e.target.value;
      this.Fileddatas.column = e.target.value;
      this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);
    },
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === 'start') {
        year = year - 60;
      } else if (type === 'end') {
        year = year + 2;
      }
      month = month > 9 ? month : '0' + month;
      day = day > 9 ? day : '0' + day;
      return `${year}-${month}-${day}`;
    },
    onCancel() {},
    getOptionList() {
      // 查找option_list_v2
      let serviceName = this.Fileddatas.option_list_v2.serviceName;
      if (serviceName) {
        let url = this.$api.select + '/sqfw/select/' + serviceName;
        let req = {
          serviceName: serviceName,
          queryMethod: 'select',
          distinct: false,
          colNames: ['*'],
          condition: [{ colName: 'proc_status', ruleType: 'eq', value: '完成' }]
        };
        this.$http.post(url, req).then(res => {
          if (res.data.data) {
            let data = res.data.data;
            let arr = data.map(item => (item.zuzhi_name ? item.zuzhi_name : item.organize_name ? item.organize_name : item.gzf_no ? item.title : item.lzf_no ? item.title : ''));
            (this.picker = arr), (this.originPicker = data);
          }
        });
      }
    },
    onFocus() {},
    resultClick() {},
    openFile() {},
    success(src, ele) {
      console.log('success load', src);
      const span = ele.parentNode.querySelector('span');
      ele.parentNode.removeChild(span);
    },
    error(src, ele, msg) {
      console.log('error load', msg, src);
      const span = ele.parentNode.querySelector('span');
      span.innerText = 'load error';
    },

    onXifFun(r, xif) {
      /* eslint-disable */

      let row = r;
      // let fun = (new Function(xif))()
      // console.log('xifFun===:::>'+ eval(xif))
      return eval(xif);
    },

    handleInput(columns, val, regs, data) {
      let self = this;
      setTimeout(() => {
        let a = {
          columns: self.Fileddatas.columns,
          currentValue: self.Fileddatas.column
        };
        self.formValidators(self.Fileddatas.column, regs);
        this.dispatch('iForm', 'on-form-blur', a);
        this.dispatch('iForm', 'currentValue-update', a);
      }, 40);
    },
    async toCols() {
      let self = this;
      self.oldColData = self.fromColData;
      console.log('ITEM----self.fromColData', self.fromColData);
      self.Fileddatas = self.deepClone(self.oldColData);

      if (self.Fileddatas.column === undefined || self.Fileddatas.column === null) {
        self.Fileddatas.column = '';
      }

      self.dispatch('iForm', 'iForm-Item-Loaded', true);

      if (!('column' in self.Fileddatas)) {
        self.Fileddatas.column = '';
      }
      let isType = self.oldColData._formItemValidators;

      console.log('isType====', isType);
      self.Fileddatas._formItemValidators = isType;
      if (self.Fileddatas.bx_col_type === 'enum' || self.Fileddatas.col_type === 'Enum') {
        self.Fileddatas.option_list_v2 = self.Fileddatas.option_list_v2.map(item => {
          let a = {};
          a.key = item.value;
          a.value = item.label;
          return a;
        });
      } else if (self.Fileddatas.bx_col_type === 'dict') {
        // self.Fileddatas.option_list_v2 = self.Fileddatas.option_list_v2.map(item => {
        //   let a = {};
        //   a.key = item.value;
        //   a.value = item.label;
        //   return a;
        // });
      } else if (self.Fileddatas.bx_col_type === 'image') {
        if (self.Fileddatas.column !== '' && self.Fileddatas.column !== undefined) {
          let res = await self.getImageUrl(self.Fileddatas.column);
          let imgUrl = {
            url: res[0]._url
          };
          let imgPre = {
            src: res[0]._url
          };
          self.imagePreviewer.push(imgPre);
          self.Fileddatas['_images'] = [];
          self.Fileddatas._images.push(imgUrl);
          self.handleInput(self.Fileddatas.columns, self.Fileddatas.column, self.Fileddatas._formItemValidators);
          self.$refs.uploader.images.push(imgUrl);
        }
      } else if (self.Fileddatas.bx_col_type === 'set') {
        let selected = self.Fileddatas.column;
        selected = selected.split(',');
        self.Fileddatas['_selected'] = selected;
      }
    },
    handleBlur(event) {
      console.log('失去焦点', event);
      this.formValidators(this.Fileddatas.column, this.Fileddatas._formItemValidators);
      this.dispatch('iForm', 'on-form-blur', this.currentValue);
    },
    isType(e, reg, msg) {
      let regFun = new RegExp(reg);
      if (regFun.test(e)) {
        let obj = { valid: regFun.test(e) };
        return obj;
      } else {
        let msgs = msg;
        msgs = msgs === '' ? '信息有误' : msgs;
        let obj = { valid: regFun.test(e), msg: msgs };
        console.log(e, obj);
        return obj;
      }
    },
    setRules() {
      this.$on('on-form-blur', this.onFieldBlur);
      this.$on('on-form-change', this.onFieldChange);
    },
    showMessage(text) {},
    onSubmit() {
      let validator = this.formValidators(this.Fileddatas.column, this.Fileddatas._formItemValidators);
      console.log('validator', validator);
      if (validator !== true && validator.valid === false && this.Fileddatas._formItemValidators && this.Fileddatas._formItemValidators.required === true) {
        uni.showToast({
          title: validator.msg,
          icon: 'none'
        });
      }
    },
    onReset() {
      this.userList = {
        search: '',
        Fileddatas: [],
        userSelected: {
          user_disp: '',
          user_no: ''
        }
      };
      this.DeptList = {
        search: '',
        Fileddatas: [],
        DeptSelected: {
          label: '',
          key: ''
        }
      };
      if (this.Fileddatas.col_type === 'Note') {
        // this.$refs.note.reset();
      }
    },
    show(data) {
      console.log('data', data);
      this.Fileddatas.column = data;
      this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);
    },
    formValidators(vals, regs) {
      let regVal = this.isType(vals, regs.reg, regs.msg);
      console.log(regVal, vals);
      let reg = regs;
      let msgs = regs.msg === '' ? this.Fileddatas.columns + '信息有误' : regs.msg;
      let val = vals === undefined ? '' : vals;
      this.formValids.valid = regVal;
      this.formValids.msg = msgs;
      // this.dispatch('iForm', 'on-form-item-valid', a);
      if (regs.required && regVal.valid && val.length > 0) {
        this.formValids = { valid: true };
      } else if (regs.required === false && regVal.valid) {
        this.formValids = regVal;
        // return this.formValids;
      } else {
        this.formValids = { valid: false, msg: msgs };
        // return this.formValids;
      }
      let a = {
        columns: this.Fileddatas.columns,
        currentValue: this.Fileddatas.column,
        formValids: this.formValids
      };
      this.dispatch('iForm', 'on-form-item-valid', a);
      return this.formValids;
    },
    addImageMethod() {
      console.log('添加图片');
    },
    uploadImage(res) {
      let self = this;
      this.$http.post(self.$api.upload, res).then(res => {
        console.log('', res, res.body);
        let imgUrl = {
          url: self.$api.getFilePath + res.body.fileurl
        };
        let imgPre = {
          src: self.$api.getFilePath + res.body.fileurl
        };
        self.imagePreviewer.push(imgPre);
        self.Fileddatas.column = res.body.file_no;
        self.handleInput(self.Fileddatas.columns, self.Fileddatas.column, self.Fileddatas._formItemValidators);
        // self.$refs.uploader.images.push(imgUrl)
        if ('_images' in self.Fileddatas) {
          self.Fileddatas._images.push(imgUrl);
        } else {
          self.Fileddatas['_images'] = [];
          self.Fileddatas._images.push(imgUrl);
        }
      });
    },
    removeImageMethod(e) {
      let self = this;
      self.imagePreviewer.shift();
      console.log('用户点击了删除');
      self.menuKey = +1;
    },
    previewMethod(e) {
      this.$refs.previewer.show(0);
      console.log('previewMethod', e);
    },
    logIndexChange(arg) {
      console.log(arg);
    },
    setTableValid: function(e) {
      let self = this;
      self._tableValid = e;
      // console.log("setTableValid",self._tableValid,self.Fileddatas._formItemValidators)
      if (!self._tableValid.valid && self._tableValid.valid !== undefined && self._tableValid.valid !== '') {
        // console.log(self._tableValid,self.Fileddatas._formItemValidators)
        self.Fileddatas._formItemValidators.required = true;
      } else {
        self.Fileddatas._formItemValidators.required = false;
      }
    }
  },
  onLoad(option) {
    if (option.query) {
      this.query = JSON.parse(decodeURIComponent(option.query));
    }
  },
  watch: {
    formValids: {
      handler: function(val, oldval) {
        let b = {
          columns: this.fromColData.columns,
          formValids: this.formValids
        };
        this.dispatch('iForm', 'on-form-item-valid', b);
      },
      deep: true // 是否深度监听
    },
    Fileddatas: {
      handler: function(val, oldval) {
        this.dispatch('iForm', 'currentValue-update', val);
        if (val._images && val._images.length === 0) {
          this.imagePreviewer = [];
        }
        if (!val.column) {
          this.$set(this.Fileddatas, 'column', '');
          this.keys = !this.keys;
          this.index = -1;
          console.log(val, 'Fileddatas watcher');
        }
      },
      deep: true // 是否深度监听
    },
    fromColData: {
      handler: function(newV, oldV) {
        let self = this;
        this.Fileddatas['_formItemValidators'] = newV._formItemValidators;
        self._tableValid = self.fromColData._tableValid;
        self.toCols();
        self.onReset();
        // this.dispatch('iForm', 'on-form-item-valid', newV.column)
      },
      deep: true // 是否深度监听
    },
    _tableValid: {
      handler: function(newV, oldV) {
        let self = this;
        if (!newV.valid) {
        }
        self.toCols();
      },
      deep: true // 是否深度监听
    }
  }
};
</script>
<style lang="scss" scoped>
.form-item-inputs {
  // flex: 1;
}
.required {
  color: red;
  padding: 10upx;
}
.form-item-editer {
  display: flex;
  align-items: center;
  background-color: #fff;
  width: 100%;
  .label {
    width: 5rem;
    color: #c5464a;
    line-height: 28px;
    white-space: nowrap;
    font-size: 14px;
  }
  .form-item-inputs {
    width: 100%;
    .input {
      height: 22px;
      width: 70% !important;
      // border:1px solid #c5464a;
      // border-radius:5px 5px 5px 5px;
      font-size: 14px;
      padding: 2px 5px;
      margin: 10px 0;
      background: transparent;
      top: 0;
      line-height: 42px;
      right: 0;
    }
    .uni-input-input:focus {
      border: 1px solid black;
    }

    .textarea {
      margin: 10px 0;
      height: 52px !important;
      border: 1px solid #c5464a;
      width: 70% !important;
      border-radius: 5px 5px 5px 5px;
      padding: 2px 5px;
    }
  }
}
.changeTime {
  font-size: 30upx;
  text-indent: 30upx;
}
.popup-view {
  height: 80vh;
  display: flex;
  flex-direction: column;
  .header {
    .search {
      display: flex;
      flex-direction: row;
      justify-content: center;
      .uni-input-wrapper {
        .uni-input-placeholder {
          width: 100%;
        }
      }

      .search_input {
        height: 42px;
        border: 2px solid #c5464a;
        border-radius: 5px 0 0 5px;
        background: transparent;
        top: 0;
        right: 0;
      }
      .search_button {
        background: #c5464a;
        border-radius: 0 5px 5px 0;
        width: 60px;
        top: 0;
        right: 0;
        margin: 0 !important;
      }
      .search_button:before {
        content: '搜索';
        font-size: 13px;
        color: #f9f0da;
      }
    }
  }
  .popup-body {
    margin-top: 20px;
  }
}
.note {
  width: 70% !important;
}
.demo5-item {
  background-color: #ddd;
  color: #222;
  font-size: 14px;
  padding: 5px 10px;
  margin-bottom: 5px;
  margin-right: 8px;
  line-height: 18px;
  border-radius: 15px;
  width: 37%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 5px;
  float: left;
}
// }
.demo4-item-selected {
  background-color: rgb(9, 194, 33);
  color: #fff;
}

.popups-item {
  background-color: #ddd;
  color: #222;
  font-size: 14px;
  padding: 5px 10px;
  margin-bottom: 5px;
  margin-right: 8px;
  line-height: 18px;
  border-radius: 15px;
  width: 37%;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  margin-top: 5px;
}
.check {
  background-color: #ddd;
}
.user {
  font-size: 14px;
  list-style: none;
  padding: 5px 10px;
}
</style>
