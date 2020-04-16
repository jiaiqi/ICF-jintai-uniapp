<template>
  <view class="addView">
    <view class="cu-load load-modal" v-if="!showChild">
      <view class="cuIcon-emoji text-yellow"></view>
      <view class="gray-text">加载中...</view>
    </view>
    <from-view v-if="showChild" :pathQuery="query" :pageType="query.type" ref="iForms"></from-view>
    <view class="bottom-flex" style="padding:10px" v-if="showButton">
      <view class="bottom" v-if="query.cols.srv_cols && query.cols.srv_cols.length > 0">
        <view v-for="(item, index) in pageBtns" :key="index">
          <button v-if="item.button_type === 'reset'" type="warn" @click.native="onReset">{{ item.button_name }}</button>
          <button v-else-if="item.button_type === 'submit'" type="primary" @click.native="submitForm">{{ item.button_name }}</button>
        </view>
      </view>
    </view>
    <view class="shenhe" v-if="menuAudio > 0 && spServename !== ''" @click="audist(spServename)">待我审核</view>
  </view>
</template>

<script>
import Emitter from '../../../static/js/mixins/emitter.js';
import fromView from '@/components/from/form.vue';
export default {
  components: {
    fromView
  },
  name: 'addPage',
  data() {
    return {
      query: {
        // serviceName: this.$route.query.serviceName,
        serviceName: '',
        type: 'add',
        cols: {
          srv_cols: []
        }
      },
      formList: [],
      queryString: {},
      showButton: false,
      showChild: false,
      pageBtns: [],
      foreignKey: [],
      houseInfo: {},
      appName: 'sqfw',
      // foreignKey: this.$route.query.foreignKey,
      spServename: '',
      menuAudio: 0
    };
  },
  mixins: [Emitter],
  onLoad: function(option) {
    // debugger
    let query = '';
    if (option.query) {
      query = JSON.parse(decodeURIComponent(option.query));
      if (query.label == '加入社会组织') {
        this.spServename = 'srvzhsq_organizie_member_select';
        this.getMenu(this.spServename);
      } else if (query.label == '加入志愿者') {
        this.spServename = 'srvzhsq_zyz_member_select';
        this.getMenu(this.spServename);
      } else if (query.title == '社区献策') {
        this.spServename = 'srvzhsq_forum_opinion_select';
        this.getMenu(this.spServename);
      }
      console.log('query', query);
      // this.query.serviceName = query.cols.serviceName
      this.queryString = query;
      if (query.menu_url) {
        const app = query.menu_url.match(/menuapp=(\S*)/)[1].split('&')[0];
        this.appName = app;
      }
    }
    if (option.data) {
      query = JSON.parse(option.data);
    }
    if (option.info) {
      this.houseInfo = JSON.parse(option.info);
    }
    console.log('query', query.label, query);
    uni.setNavigationBarTitle({
      title: query.label ? query.label : '添加'
    });
    this.getCols(query);
    this.$on('form-loaded', this.isFormLoaded);
  },
  methods: {
    getMenu(serve) {
      let url = this.$api.select + '/sqfw/select/' + serve;
      let req = {};
      req.serviceName = serve;
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req.proc_data_type = 'wait';
      req['page'] = {
        pageNo: 1,
        rownumber: 10
      };
      this.$http.post(url, req).then(res => {
        console.log(res);
        this.menuAudio = res.data.data.length;
      });
    },
    isFormLoaded(e) {
      console.log(e);
      setTimeout(() => {
        this.showButton = e;
      }, 3000);
    },
    audist(val) {
      uni.navigateTo({
        url: '../../audit/auditList?serve=' + val
      });
    },
    async getCols(query) {
      let self = this;
      if (query.serviceName === 'srvzhsq_forum_opinion_add') {
        console.log(query);
        let url = this.$api.select + '/' + this.appName + '/select/srvsys_service_columnex_v2_select ';
        let req = {
          serviceName: 'srvsys_service_columnex_v2_select',
          colNames: ['*'],
          condition: [{ colName: 'service_name', value: 'srvzhsq_forum_opinion_add', ruleType: 'eq' }, { colName: 'use_type', value: 'add', ruleType: 'eq' }],
          order: [{ colName: 'seq', orderType: 'asc' }]
        };
        this.$http
          .post(url, req)
          .then(res => {
            if (res.data.data) {
              let cols = res.data.data.srv_cols;
              self.query.cols = res.data.data;
              console.log(self.query.cols, ',,,,,,,,,,,,,,,,,,,,,,,,,,');
              let colsList = self.query.cols.srv_cols;
              colsList = colsList.filter(item => item.in_add == 1);
              // colsList = colsList.filter(item => item.in_add == 1 && item.updatable != 0);
              // colsList.forEach(col=>{
              //   if(col.columns==='sq_name'&&col.init_expr=="top.user.real_name"){
              //     let userInfo = uni.getStorageSync('userInfo')
              //     if(userInfo.real_name){
              //       col["column"] = userInfo.real_name
              //     }
              //   }
              // })
              this.formList = colsList;
              self.pageBtns = res.data.data.formButton;
              // self.pageBtns = res.data.data.formButton.filter(item => item.permission === true);
              self.query.serviceName = query.serviceName;
              this.showChild = true;
            }
          })
          .then(() => {
            setTimeout(() => {
              // this.showButton=true;
            }, 1000);
          });
      } else {
        if (query.service_name.indexOf('select') != -1) {
          query.service_name = query.service_name.replace('select', 'add');
        }
        const app = query.menu_url.match(/menuapp=(\S*)/)[1].split('&')[0];
        self.query.cols = await self.getColumnsData(app, query.service_name);
        let colsList = self.query.cols.srv_cols;
        colsList = colsList.filter(item => item.in_add == 1);
        console.log(colsList, ',,,,,,,,,,,,,,,,,,,,,,,,,,');
        // colsList.forEach(col=>{
        //   if(col.columns==='sq_name'&&col.init_expr=="top.user.real_name"){
        //     let userInfo = uni.getStorageSync('userInfo')
        //     if(userInfo.real_name){
        //       col["column"] = userInfo.real_name
        //     }
        //   }
        // })
        this.formList = colsList;
        self.query.serviceName = query.serviceName;
        self.pageBtns = self.query.cols.formButton;
        // self.pageBtns = self.pageBtns.filter(item => {
        //   if (item.permission === true) {
        //     return item;
        //   }
        // });
        this.showChild = true;
        setTimeout(() => {
          // this.showButton=true;
        }, 1000);
      }
    },
    async getColumnsData(app = 'sqfw', service_name, use_type = 'add') {
      let url = this.$api.select + '/' + this.appName + '/select/srvsys_service_columnex_v2_select ';
      let req = {
        serviceName: 'srvsys_service_columnex_v2_select',
        colNames: ['*'],
        condition: [{ colName: 'service_name', value: service_name, ruleType: 'eq' }, { colName: 'use_type', value: use_type, ruleType: 'eq' }],
        order: [{ colName: 'seq', orderType: 'asc' }]
      };
      let res = await this.$http.post(url, req);
      if (res.data.data) {
        let cols = res.data.data;
        return cols;
      }
    },
    submitForm() {
      let self = this;
      this.broadcast('iFormItem', 'on-submit');
      let formList = this.formList;
      formList = formList.filter(item => item.validators && item.validators.includes('required'));
      let a = this.$refs.iForms.returnFields();
      console.log('aaaaaaaaaaaaaaaaa', a);
      // try{
      //   formList.forEach(item => {
      //     if (a.data.filter(itemb => item.columns === itemb.columns).length == 0) {
      //       uni.showToast({
      //         icon: 'none',
      //         title: item.label + '不能为空！',
      //         duration: 3000
      //       });
      //       throw new Error(item.label + '不能为空！')
      //     }
      //   });
      // }catch(e){
      //   //TODO handle the exception
      // }
      let required = 0;
      for (let i = 0; i < formList.length; i++) {
        let item = formList[i];
        if (a.data.filter(itemb => item.columns === itemb.columns).length == 0) {
          uni.showToast({
            icon: 'none',
            title: item.label + '不能为空！',
            duration: 3000
          });
          required++;
        }
      }
      if (required) {
        return;
      }
      if (!a.valid) {
        // uni.showToast({
        //   icon: 'none',
        //   title: '信息有误'
        // });
      } else if (a.data.length === 0) {
        uni.showToast({
          icon: 'none',
          title: '没有需要提交的信息'
        });
      } else {
        uni.showModal({
          title: '确认操作',
          content: '是否确认提交',
          success: function(res) {
            if (res.confirm) {
              console.log('------------------点击了提交按钮-------------------');
              self.submitData(a.data);
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
    },
    submitData(nData) {
      let self = this;
      console.log(nData);
      this.showChild = false;
      let userInfo = uni.getStorageSync('userInfo');
      let params = [
        {
          serviceName: 'srvzhsq_pxap_add',
          condition: [],
          data: []
        }
      ];
      if (this.query.type === 'add') {
        let data = [];
        let a = {};
        data = nData.map(item => {
          a[item.columns] = item.column;
        });
        if (this.foreignKey.length > 0) {
          a[this.foreignKey[0].colName] = this.foreignKey[0].value;
        }
        if (this.queryString.label === '志愿者信息变更') {
          a['user_no'] = userInfo.user_no;
        } else if (this.queryString.label === '数字城管') {
          a['action_user'] = userInfo.user_no;
        }
        params[0].data.push(a);
        let operate = 'operate';
        if (
          this.queryString.label === '党建活动记录' ||
          this.queryString.service_name === 'srvzhsq_djhdjl_djhd_add' ||
          this.queryString.service_name === 'srvzhsq_tenement_gzfxx_add' ||
          this.queryString.service_name === 'srvzhsq_tenement_lzfxx_select' ||
          this.queryString.service_name === 'srvzhsq_bmfw_xmxx_add' ||
          this.queryString.service_name === 'srvzhsq_bmfw_ssp_add' ||
          this.queryString.serviceName === 'srvzhsq_forum_opinion_add'
        ) {
          operate = 'apply';
        }
        if (this.queryString.menu_url && this.queryString.menu_url.indexOf('listproc') != -1) {
          operate = 'apply';
        }
        let url = self.$api.add + '/' + this.appName + '/' + operate + '/'
        url += this.queryString.service_name ? this.queryString.service_name : this.queryString.serviceName;
        console.log(url)
        params[0].serviceName = this.queryString.service_name ? this.queryString.service_name : this.queryString.serviceName;
        // let formData = this.$refs.iForms.returnFields();
        // let formData = { data: nData };

        // if (formData.data) {
        //   formData = formData.data[0];
        // }
        // if (formData.service_name) {
        //   params[0].serviceName = formData.service_name;
        //   url = self.$api.add + '/' + self.appName + '/' + operate + '/' + formData.service_name;
        // }
        self.$http.post(url, params).then(response => {
          if (response && response.data.resultCode === 'SUCCESS') {
            this.showChild = true;
            uni.showModal({
              title: '提示',
              content: response.data.resultMessage + ',点击跳转到列表页',
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  uni.navigateBack({
                    delta: 1,
                    animationType: 'pop-out',
                    animationDuration: 200
                  });
                }
              }
            });
          } else {
            this.showChild = true;
            uni.showModal({
              title: '提示',
              content: response.data.resultMessage,
              showCancel: false
            });
          }
        }); // 新增
      } else if (this.query.type === 'apply') {
        let datas = [];
        let a = {};
        datas = nData.map(item => {
          if (item.column === '') {
            item.column = null;
          }
          a[item.columns] = item.column;
        });
        params[0].data.push(a);
        self.$http.post(self.$api.startProc, params).then(response => {
          if (response && response.data.resultCode === 'SUCCESS') {
            this.showChild = true;
            uni.showModal({
              title: '提示',
              content: response.data.resultMessage + ',点击跳转到列表页',
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  uni.navigateBack({
                    delta: 1,
                    animationType: 'pop-out',
                    animationDuration: 200
                  });
                }
              }
            });
          } else {
            this.showChild = true;
            uni.showModal({
              title: '提示',
              content: response.data.resultMessage,
              showCancel: false
            });
          }
        }); // 流程开启
      } else {
        let datas = [];
        let a = {};
        datas = nData.map(item => {
          if (item.column === '') {
            item.column = null;
          }
          a[item.columns] = item.column;
        });
        params[0].data.push(a);
        self.$http.post(self.$api.startProc, params).then(response => {
          if (response && response.data.resultCode === 'SUCCESS') {
            this.showChild = true;
            uni.showModal({
              title: '提示',
              content: response.data.resultMessage + ',点击跳转到列表页',
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  uni.navigateBack({
                    delta: 1,
                    animationType: 'pop-out',
                    animationDuration: 200
                  });
                }
              }
            });
          } else {
            this.showChild = true;
            uni.showModal({
              title: '提示',
              content: response.data.resultMessage,
              showCancel: false
            });
          }
        }); // 流程开启
      }
    },
    async submint(nData) {
      this.showChild = false;
      let userInfo = uni.getStorageSync('userInfo');
      let self = this;
      let params = [
        {
          serviceName: 'srvzhsq_pxap_add',
          condition: [],
          data: []
        }
      ];
      if (this.query.type === 'add') {
        let data = [];
        let a = {};
        data = nData.map(item => {
          a[item.columns] = item.column;
        });
        if (this.foreignKey.length > 0) {
          a[this.foreignKey[0].colName] = this.foreignKey[0].value;
        }
        params[0].data.push(a);
        let operate = 'operate';
        if (this.queryString.label === '党建活动记录') {
          operate = 'apply';
        }
        if (this.queryString.label === '数字城管') {
          operate = 'apply';
        }
        if (this.queryString.menu_url.indexOf('listproc') != -1) {
          operate = 'apply';
        }
        if (this.queryString.service_name === 'srvzhsq_tenement_gzfxx_add' || this.queryString.service_name === 'srvzhsq_tenement_lzfxx_select') {
          operate = 'apply';
        }
        let url = self.$api.add + '/' + this.appName + '/' + operate + '/' + this.queryString.serviceName;
        let formData = self.$refs.iForms.returnFields();
        if (formData.data) {
          formData = formData.data[0];
        }
        if (formData.service_name) {
          params[0].serviceName = formData.service_name;
          url = self.$api.add + '/' + self.appName + '/' + operate + '/' + formData.service_name;
        }
        const response = await self.$http.post(url, params); // 新增
        if (response) {
          this.showChild = true;
        }
        return response;
      } else if (this.query.type === 'apply') {
        let datas = [];
        let a = {};
        datas = nData.map(item => {
          if (item.column === '') {
            item.column = null;
          }
          a[item.columns] = item.column;
        });
        params[0].data.push(a);
        const response = await self.$http.post(self.$api.startProc, params); // 流程开启
        if (response) {
          this.showChild = true;
        }
        return response;
      } else {
        let datas = [];
        let a = {};
        datas = nData.map(item => {
          if (item.column === '') {
            item.column = null;
          }
          a[item.columns] = item.column;
        });
        params[0].data.push(a);
        const response = await self.$http.post(self.$api.startProc, params); // 流程开启
        if (response) {
          this.showChild = true;
        }
        console.log('response.data.state', response.data.state);
        return response;
      }
    },
    onReset() {
      // this.broadcast('iFormItem', 'on-reset')
      this.$refs.iForms.resetForm();
      console.log('重置');
    }
  }
};
</script>

<style lang="scss">
.addView {
  width: 100%;
  position: relative;
  margin-bottom: 50px;
}
.scroll {
  height: 500px;
}
.bottom {
  overflow: hidden;
  width: 100%;

  button {
    width: 48%;
    margin-left: 1%;
    float: left;
  }
}
.shenhe {
  width: 100%;
  z-index: 99;
  position: fixed;
  bottom: 0;
  left: 0;
  text-align: center;
  width: 100%;
  line-height: 80upx;
  background-color: #007aff;
  color: #fff;
}
</style>
