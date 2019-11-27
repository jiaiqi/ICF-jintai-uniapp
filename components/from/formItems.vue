<template>
  <view>
    <view style="overflow: hidden;" :class="formValids.valid ? 'form-item-editer' : 'form-item-editer form-item-editer-err'">
      <label class="label" style="float: left;font-size: 14px;color:#101010;padding: 0 10px;">
        {{ Fileddatas.label }}
        <span v-if="Fileddatas._formItemValidators.required" style="color:red;height:16px;line-height:1.4">*</span>
      </label>
      <view class="form-item-inputs">
        <input
          class="input"
          @input="handleInput(Fileddatas.columns, Fileddatas.column, Fileddatas._formItemValidators)"
          @blur="handleBlur"
          v-if="Fileddatas.col_type === 'String'"
          v-model="Fileddatas.column"
          :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null ? Fileddatas.placeholder : '请输入内容'"
        />
        <radio-group
          class="radio_group"
          style="display: flex;"
          @change="radioChange"
          v-if="(Fileddatas.bx_col_type === 'enum' || Fileddatas.col_type === 'Enum') && Fileddatas.columns !== 'nation'"
        >
          <label style="display: flex;" class="uni-list-cell uni-list-cell-pd label" v-for="(item, index) in Fileddatas.option_list_v2" :key="index">
            <radio class="Choice" :value="item.value" :checked="item.value === Fileddatas.column" />
            <view>{{ item.key }}</view>
          </label>
        </radio-group>
        <view v-else-if="Fileddatas.columns === 'nation'">
          <div class="mpvue-picer">
            <QSPickerCustom ref="nationPicker" name="formName" variableName="custom" title="选择民族:" v-model="Fileddatas.column" @change="changePicker" />
          </div>
        </view>
		<view v-else-if="Fileddatas.bx_col_type === 'fk' && Fileddatas.col_type ==='bxzhsq_zyz_zuzhi'">
		  <div class="mpvue-picer">
		    <QSPickerCustom ref="nationPickerZ" name="formName" variableName="custom" title="选择组织:" v-model="Fileddatas.column" @change="changePicker" />
		  </div>
		</view>
        <textarea
          v-if="Fileddatas.col_type === 'MultilineText'"
          placeholder="请输入内容"
          class="text-box textarea"
          scroll-y="true"
          ref="mult"
          @input="handleInput(Fileddatas.columns, Fileddatas.column, Fileddatas._formItemValidators)"
          @blur="handleBlur"
          v-model="Fileddatas.column"
          @focus="formValidators(Fileddatas.column, Fileddatas._formItemValidators)"
        ></textarea>
        <edit ref="note" v-on:listenChild="show" class="note" v-if="Fileddatas.col_type === 'Note'"></edit>
        <input
          v-if="Fileddatas.col_type === 'int'"
          class="uni-form-item uni-column input"
          :maxlength="Fileddatas._formItemValidators.max"
          @input="handleInput(Fileddatas.columns, Fileddatas.column, Fileddatas._formItemValidators)"
          type="number"
          v-model="Fileddatas.column"
          :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null ? Fileddatas.placeholder : '请输入序号'"
        />
        <input
          v-if="Fileddatas.col_type === 'bxzhsq_activity_arrange' || Fileddatas.bx_col_type === 'fk'"
          class="uni-form-item uni-column input"
          :maxlength="Fileddatas._formItemValidators.max"
          @input="handleInput(Fileddatas.columns, Fileddatas.column, Fileddatas._formItemValidators)"
          v-model="Fileddatas.column"
          :placeholder="Fileddatas.placeholder !== '' && Fileddatas.placeholder !== null ? Fileddatas.placeholder : '请输入活动名称'"
        />
       <!-- <picker
          v-if="Fileddatas.col_type === 'Date'"
          class="uni-list-cell-db"
          mode="date"
          :value="Fileddatas.column"
          :start="startDate"
          :end="endDate"
          @change="bindDateChange"
          ref="dateSelect"
        >
          <view class="uni-input">{{ Fileddatas.column ? Fileddatas.column : '请选择' }}</view>
        </picker> -->
        <hTimePicker sTime="0" cTime="24" interval="1" @changeTime="changeTime"  v-if="Fileddatas.col_type === 'Date'">
          <view slot="pCon" class="changeTime">
            {{Fileddatas.column?Fileddatas.column:"点击选择时间"}}
          </view>
        </hTimePicker>
        <input
          class="input"
          readonly
          v-if="Fileddatas.col_type === 'User'"
          @change="bindDateChange"
          @tap="setUserPoup"
          :value="userList.userSelected.user_disp"
          placeholder="选择发布人"
        />

        <input class="input" readonly ref="deptSelect" v-if="Fileddatas.col_type === 'Dept'" @tap="setDeptPoup" :value="DeptList.DeptSelected.label" placeholder="选择部门" />
      </view>
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
      <uni-popup v-if="Fileddatas.col_type === 'Dept'" ref="Dpopup" type="bottom">
        <view class="popup-view">
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
        </view>
      </uni-popup>
    </view>
  </view>
</template>
<script>
import Emitter from '../../static/js/mixins/emitter.js';
import QSPickerCustom from '@/components/QS-inputs-split/elements/QS-picker-custom/index.vue';
import hTimePicker from "@/components/h-timePicker/h-timePicker.vue";
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import edit from '@/components/qiyue-richtext/uni-richtext.vue';
export default {
  name: 'iFormItem',
  components: {
    uniPopup,
    edit,
    QSPickerCustom,
    hTimePicker 
  },
  computed: {
    startDate() {
      return this.getDate('start');
    },
    endDate() {
      return this.getDate('end');
    },
    // formValidators: function (reg, val) {
    //   console.log('校验信息', reg, val)
    // }
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
    let currentDate = '请选择';
    return {
      date: currentDate,
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
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.weui-uploader__file')[index];
          // get window scroll Y
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect();
          // w = width
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      },
      imagePreviewer: [],
      ins: null,
      DeptAct: null
      // srvCols: this.$store.getters.getSrvCol,
      // type: this.pathQuery.colType
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
    if (this.Fileddatas.columns === 'nation') {
      let arr = this.Fileddatas.option_list_v2;
      let nationArr = [];
      arr.map(items => {
        nationArr.push(items.value);
      });
      setTimeout(() => {
        this.setPickerData(nationArr);
      }, 500);
    }
  },
  onShow() {
    /// 如果没有传入 prop，则无需校验，也就无需缓存
    if (this.prop) {
      this.dispatch('iForm', 'on-form-item-add', this);
    }
    // this.formValidators(this.fromColData.column, this.fromColData._formItemValidators)
  },
  beforeDestroy() {
    // this.dispatch('iForm', 'on-form-item-remove', this)
  },
  methods: {
    changePicker() {
      this.Fileddatas.column = this.Fileddatas.column.data[0];
       this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);
      console.log('选择了：', this.Fileddatas.column);
    },
    changeTime(e){
      console.log(e)
      this.Fileddatas.column = e
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
    setDeptPoup() {
      this.$refs.Dpopup.open();
      this.getDept();
    },
    setPickerData(nationArr) {
      const data1 = [nationArr];
      this.setPickerDataFc('nationPicker', data1);
    },
    setPickerDataFc(name, data) {
      console.log('准备 调用setData', this.$refs);
      this.$refs['nationPicker'].setData(data);
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
        rownumber: 10
      };
      this.$http.post(url, req).then(resp => {
        this.save = resp.data.data;
        this.userList.Fileddatas = resp.data.data;
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
    // getPopupList (pin) {
    //   let self = this
    //   let options = this.fromColData.option_list_v2
    //   let CallbackGo = function (response) {
    //     if (response.data !== '') {
    //       let sData = response.data.data
    //       // self.fkPopupModel.Fileddatas = sData
    //       self.fkPopupModel.data = sData.map((item) => {
    //         let a = {}
    //         a.label = item[options.key_disp_col]
    //         a.key = item[options.refed_col]
    //         return a
    //       })
    //     }
    //   }
    //   let req = {}
    //   if (this.fromColData.bx_col_type === 'fk') {
    //     req.serviceName = options.serviceName
    //     req.colNames = [options.refed_col, options.key_disp_col]
    //     req.condition = [{
    //       'colName': options.key_disp_col,
    //       'ruleType': 'like',
    //       'value': self.fkPopupModel.search
    //     }]
    //   }
    //   req.page = {
    //     pageNo: 1,
    //     rownumber: 20
    //   }
    //   this.crosAjaxData(this.$api.select, 'post', req, CallbackGo)
    // },

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
      // console.log(this)
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
      // this.Fileddatas = JSON.parse(JSON.stringify(this.oldColData))
      if (!('column' in self.Fileddatas)) {
        self.Fileddatas.column = '';
      }
      let isType = self.oldColData._formItemValidators;
      // let isType = self.isType()
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
        self.Fileddatas.option_list_v2 = self.Fileddatas.option_list_v2.map(item => {
          let a = {};
          a.key = item.value;
          a.value = item.label;
          return a;
        });
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
        return obj;
      }
    },
    setRules() {
      this.$on('on-form-blur', this.onFieldBlur);
      this.$on('on-form-change', this.onFieldChange);
    },
    showMessage(text) {
      // console.log(text)
      // window.alert(text)
    },
    onSubmit() {
      this.formValidators(this.Fileddatas.column, this.Fileddatas._formItemValidators);
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
        this.$refs.note.reset();
      }
      // this.fkPopupModel.selected = {
      //   label: '',
      //   key: ''
      // }
    },
    show(data) {
      console.log('data', data);
      this.Fileddatas.column = data;
      this.handleInput(this.Fileddatas.columns, this.Fileddatas.column, this.Fileddatas._formItemValidators);
    },
    formValidators(vals, regs) {
      // console.log('reg', vals, regs)
      let regVal = this.isType(vals, regs.reg, regs.msg);
      console.log(regVal, vals);
      let reg = regs;
      let msgs = regs.msg === '' ? this.Fileddatas.columns + '信息有误' : regs.msg;
      let val = vals === undefined ? '' : vals;
      this.formValids.valid = regVal;
      this.formValids.msg = msgs;
      let a = {
        columns: this.Fileddatas.columns,
        currentValue: this.Fileddatas.column,
        formValids: this.formValids
      };
      this.dispatch('iForm', 'on-form-item-valid', a);
      if (regs.required && regVal.valid && val.length > 0) {
        this.formValids = { valid: true };
        return this.formValids;
      } else if (regs.required === false && regVal.valid) {
        this.formValids = regVal;
        console.log('this.formValids', regVal);
        return this.formValids;
      } else {
        this.formValids = { valid: false, msg: msgs };
        return this.formValids;
      }
    },
    addImageMethod() {
      console.log('添加图片');
    },
    uploadImage(res) {
      // let fData = new FormData(res)
      // let formdatas = {
      //   filePath: res.get('photo'),
      //   name: 'file',
      //   formData: {
      //     'serviceName': 'srv_bxfile_service',
      //     'interfaceName': 'add',
      //     'file': res
      //   }
      // }
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
  watch: {
    formValids: {
      handler: function(val, oldval) {
        // console.log('formValids更新1', val)
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
        // let self = this
        this.dispatch('iForm', 'currentValue-update', val);
        // console.log(val)
        if (val._images && val._images.length === 0) {
          this.imagePreviewer = [];
        }
      },
      deep: true // 是否深度监听
    },

    fromColData: {
      handler: function(newV, oldV) {
        let self = this;
        // console.log('formitem更新2', newV)
        // self.Fileddatas.column = newV.column
        // self.Fileddatas = JSON.parse(JSON.stringify(self.oldColData))
        // if ('column' in newV) {
        //   console.log('formitem更新', oldV, newV)
        //   self.Fileddatas.column = newV.column
        // } else {
        //   self.Fileddatas.column = newV.column
        // }
        // if (this.Fileddatas.bx_col_type === 'date') {
        //   this.$refs.dateSelect.valueSync = '请选择';
        //   this.Fileddatas.column = '请选择';
        //   console.log('日期子组件', this.$refs.dateSelect.valueSync, this);
        // }
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
        // self.Fileddatas.column = newV.column
        // self.Fileddatas = JSON.parse(JSON.stringify(self.oldColData))
        // if ('column' in newV) {
        //   console.log('formitem更新', oldV, newV)
        //   self.Fileddatas.column = newV.column
        // } else {
        //   self.Fileddatas.column = newV.column
        // }
        self.toCols();
        // this.dispatch('iForm', 'on-form-item-valid', b)
      },
      deep: true // 是否深度监听
    }
  }
};
</script>
<style lang="scss" scoped>
.form-item-editer {
  display: flex;
  align-items: center;
  
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
.changeTime{
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
