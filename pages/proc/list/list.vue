<template>
  <view style="width: 100%;">
    <TabList
      ref="TabList"
      :srvApp="srvApp"
      v-if="srvApp"
      showLabel
      :rowButtons="listConfig.rowButtons"
      :serviceName="serviceName"
      :condition="listConfig.condition"
      :listType="listConfig.listType"
      :viewTemp="listConfig.viewTemp"
      :listConfig="listConfig.listConfig"
      :detailList="listConfig.detailList"
      :rownumber="5"
      :fixed="true"
      :top="100"
      :heightStyle="'calc(100vh-220upx)'"
      :order="listConfig.order"
      @click-list-item="clickItem"
      @list-change="listChange"
      @clickFootBtn="clickFootBtn"
      @loadEnd="loadEnd"
    ></TabList>
    <view class="cu-modal bottom-modal" :class="showModal ? 'show' : ''">
      <view class="cu-dialog" style="max-height: 800upx;">
        <view class="cu-bar bg-white">
          <view class="action text-green">确定</view>
          <view class="action text-blue" @tap="hideModal">取消</view>
        </view>
        <view class="padding-xl" v-if="listConfig.listConfig">
          <bxform ref="bxformApplyProc" :pageType="'add'" :fields="listConfig.listConfig.srv_cols" :BxformType="'add'" @value-blur="valueChange"></bxform>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import TabList from './bx-list/bx-list.vue';
import bxform from '@/components/bx-form/bx-form.vue';
export default {
  name: 'ProcList',
  components: { TabList, bxform },
  data() {
    return {
      publicButton: [],
      applyButton: {},
      applyFormFields: [],
      showModal: false,
      listConfig: {
        serviceName: 'srvzhsq_xxxd_select',
        addService: 'srvzhsq_xxxd_add',
        detailList: false,
        condition: [],
        order: [],
        rowButtons: [],
        listType: 'proc',
        viewTemp: {
          title: 'pxbt',
          tip: 'pxlx',
          img: null,
          price: 'proc_status',
          footer: 'create_time'
        },
        listConfig: null
      },
      srvApp:"",
      serviceName:""
    };
  },
  props: {
    appName:{
      type: String,
      default: ""
    }
  },
  methods: {
    hideModal() {
      this.showModal = false;
    },
    toApply() {
      uni.navigateTo({
        url: '../apply/apply?serviceName=' + this.listConfig.addService
      });
    },
    async applyFlow() {
      //申请流程
      let serviceName = this.applyButton.serviceName;
      let req = [
        {
          serviceName: serviceName,
          data: [{}]
        }
      ];
      let res = await this.onRequest('apply', serviceName, req, this.srvApp);
    },
    clickItem(e) {
      console.log(e);
    },
    listChange(e) {
      console.log(e);
    },
    clickFootBtn(e) {
      console.log(e);
      if (e.button.button_type === 'edit') {
        //跳转到编辑页面
      } else if (e.button.button_type === 'delete' || e.button.button_type === 'deleteproc') {
        //删除页面
        this.deleteItem(e);
      } else if (e.button.button_type === 'procdetail') {
        uni.navigateTo({
          url: '../detail/detail?proc_instance_no=' + e.row.proc_instance_no+"&appName="+this.appName
        });
      }
    },
    deleteItem(e) {
      let proc_instance_no = e.row.proc_instance_no;
      let serviceName = e.button.service_name;
      let req = [{ serviceName: serviceName, condition: [{ colName: 'proc_instance_no', ruleType: 'eq', value: proc_instance_no }] }];
      let url = this.getServiceUrl(this.srvApp, serviceName, 'operate');
      this.$http
        .post(url, req)
        .then(res => {
          if (res.data.state === 'SUCCESS') {
            uni.showToast({
              title: '删除成功'
            });
            this.$refs.TabList.onRefresh();
          } else {
            uni.showToast({
              title: res.data.resultMessage
            });
          }
        })
        .catch(error => {
          console.error(error);
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          });
        });
      // this.onRequest('operate', serviceName, req, 'oa').then(res => {

      // });
    },
    loadEnd(e) {
      console.log(e);
    },
    async getListV2() {
      let app =  this.srvApp;
      let colVs = await this.getServiceV2(this.listConfig.serviceName, 'list', 'proclist', app);
      colVs.srv_cols = colVs.srv_cols.filter(item => item.in_list === 1);
      console.log('colVs', colVs);
      colVs.rowButton = [
        {
          page_type: '流程列表',
          button_name: '流程详情',
          button_type: 'procdetail',
          service_name: 'srvoa_issue_info_select',
          service_view_name: '需求问题管理查询',
          permission: true
        }
      ];
      this.listConfig.listConfig = colVs;
      this.applyFormFields = colVs;
      this.publicButton = colVs.gridButton.filter(item => {
        if (item.permission === true) {
          switch (item.button_type) {
            case 'add':
              this.showAdd = true;
              return item;
              break;
            case 'select':
              this.showSearchBar = true;
              return item;
              break;
            case 'apply':
              this.showAdd = true;
              this.applyButton = item;
              return item;
              break;
          }
        }
      });
      return colVs;
    }
  },
  mounted() {
    if(this.$route.query.query){
      let query = JSON.parse(decodeURIComponent(this.$route.query.query))
      let app = ''
      if (query.menu_url) {
        console.log(query.menu_url);
         app = query.menu_url.match(/menuapp=(\S*)/)[1].split('&')[0];
      }
      if(query.menu_name){
        uni.setNavigationBarTitle({
          title:query.menu_name
        })
      }
      this.srvApp = app;
      if(query.service_name){
         this.serviceName =query.service_name
         this.getListV2();
      }
      console.log("query",query)
    }
    // if(this.$route.query.srvApp){
      
    //   this.srvApp = this.$route.query.srvApp
    //   if(this.$route.query.serviceName){
    //     this.serviceName = this.$route.query.serviceName
    //     this.getListV2();
    //   }
    // }
  }
};
</script>

<style lang="scss"></style>
