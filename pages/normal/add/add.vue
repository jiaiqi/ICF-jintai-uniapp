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
      queryString: {},
      showButton: false,
      showChild: false,
      pageBtns: [],
      foreignKey: [],
      houseInfo: {},
      appName: 'zhdj'
      // foreignKey: this.$route.query.foreignKey,
    };
  },
  mixins: [Emitter],
  onLoad: function(option) {
    let query = '';
    if (option.query) {
      query = JSON.parse(option.query);
      console.log('query', query);
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
    isFormLoaded(e) {
      console.log(e);
      setTimeout(() => {
        this.showButton = e;
      }, 3000);
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
              self.pageBtns = res.data.data.formButton.filter(item => item.permission === true);
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
        console.log(self.query.cols);
        self.query.serviceName = query.serviceName;
        self.pageBtns = self.query.cols.formButton;
        self.pageBtns = self.pageBtns.filter(item => {
          if (item.permission === true) {
            return item;
          }
        });
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
      let a = this.$refs.iForms.returnFields();
      console.log('a', a);
      if (!a.valid) {
        uni.showToast({
          icon: 'none',
          title: '信息有误'
        });
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
              self.submint(a.data);
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
      console.log(a);
    },
    async submint(nData) {
      this.showChild = false
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
        // eslint-disable-next-line
        let data = [];
        let a = {};
        data = nData.map(item => {
          a[item.columns] = item.column;
        });
        if (this.foreignKey.length > 0) {
          a[this.foreignKey[0].colName] = this.foreignKey[0].value;
          console.log('key', this.foreignKey[0]);
        }
        params[0].data.push(a);
        console.log(params[0].data);
        let operate = 'operate';
        if (this.queryString.label === '党建活动记录') {
          operate = 'apply';
        }
        if(this.queryString.menu_url.indexOf('listproc')!=-1){
          operate = 'apply'
        }
        let url = self.$api.add + '/' + this.appName + '/' + operate + '/srvzhsq_pxap_add';
        let formData = this.$refs.iForms.returnFields();
        if (formData.data) {
          console.log('formdata:', formData);
          formData = formData.data[0];
        }
        if (formData.service_name) {
          params[0].serviceName = formData.service_name;
          url = self.$api.add + '/' + this.appName + '/' + operate + '/' + formData.service_name;
        }
        console.log('params:', params);
        const response = await self.$http.post(url, params); // 新增
        if(response){
          this.showChild = true
        }
        if (response.data.state === 'SUCCESS' && params[0].serviceName == 'srvzhsq_pxap_add') {
          // uni.showToast({
          //   title: response.data.resultMessage
          // });
          uni.showModal({
            title: '提示',
            content: response.data.resultMessage,
            showCancel: false,
            success: res => {
              if (res.confirm) {
                uni.navigateBack({
                  delta: 2,
                  animationType: 'pop-out',
                  animationDuration: 200
                });
              }
            }
          });

          // uni.redirectTo({
          //   url: '../detail/detail?query=' + encodeURIComponent(JSON.stringify(params[0].data[0]))
          // });
        } else {
          uni.showModal({
            title: '提示',
            content: response.data.resultMessage,
            showCancel: false,
            success: res => {
              if (res.confirm) {
                uni.navigateBack({
                  delta: 2,
                  animationType: 'pop-out',
                  animationDuration: 200
                });
              }
            }
          });
        }
      } else if (this.query.type === 'apply') {
        // eslint-disable-next-line
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
        if (response.data.state === 'SUCCESS') {
          uni.showToast({
            title: response.data.resultMessage
          });
          uni.navigateBack({
            delta: 2,
            animationType: 'pop-out',
            animationDuration: 200
          });
        } else {
          uni.showToast({
            title: response.data.resultMessage
          });
          uni.navigateBack({
            delta: 2,
            animationType: 'pop-out',
            animationDuration: 200
          });
          self.$vux.toast.show({
            type: 'text',
            text: response.data.resultMessage
          });
        }
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
</style>
