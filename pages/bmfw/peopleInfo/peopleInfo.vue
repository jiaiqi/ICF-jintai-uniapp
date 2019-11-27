<template>
  <view class="selectView">
    <view class="info_item" v-for="item in formDataArr" :key="item.id">
      <text class="label">{{ item.label }}:</text>
      <text class="value">{{ item.value }}</text>
    </view>
    <view class="back_btn">
      <button type="primary" @click="toHome">返回主页面</button>
    </view>
  </view>
</template>

<script>
// import Emitter from '@/static/js/mixins/emitter.js';
import fromView from '../form/form.vue';
export default {
  components: { fromView },
  name: 'selectPeopleInfo',
  data() {
    return {
      formData: Object,
      query: Object,
      formDataArr: [],
      colData: [],
      pageBtns: [],
      foreignKey: []
    };
  },
  // mixins: [Emitter],
  onLoad: function(option) {
    let query = JSON.parse(option.query);
    this.query = query;
    this.getColumns(query);
    let data = JSON.parse(option.data);
    this.formData = data[0];
    console.log('query&data:', query, data[0]);
    if(query.serviceName==="srvzhsq_bmfw_temppermit_select"){
      uni.setNavigationBarTitle({
        title:"暂住证信息查询"
      })
    }else if(query.serviceName==="srvzhsq_bmfw_permit_select"){
      uni.setNavigationBarTitle({
        title:"居住证信息查询"
      })
    }
  },
  methods: {
    async getCols(query) {
      this.query.cols = await this.getColData(query.serviceName, query.pageType, 'list', this.$api.select + '/' + query.appType + '/select/srvsys_service_columnex_v2_select');
      this.query.serviceName = query.serviceName;
      console.log(this.query.cols);
      // this.showChild = true;
    },
    getColumns(query) {
      let url = this.$api.select + '/sqfw/select/srvsys_service_columnex_v2_select ';
      let req = {
        serviceName: 'srvsys_service_columnex_v2_select',
        colNames: ['*'],
        condition: [{ colName: 'service_name', value: query.serviceName, ruleType: 'eq' }, { colName: 'use_type', value: 'detail', ruleType: 'eq' }],
        order: [{ colName: 'seq', orderType: 'asc' }]
      };
      this.$http.post(url, req).then(res => {
        if (res.data.data) {
          let cols = res.data.data.srv_cols;
          let colArr = [];
          cols.map(item => {
            if (item.in_detail == '1') {
              colArr.push(item);
            }
          });
          console.log(colArr);
          this.getColumnsData(colArr);
        }
      });
    },
    getColumnsData(colArr) {
      let formData = this.formData;
      // console.log(Object.keys(formData))
      let arr = Object.keys(formData);
      arr.map(arrItem => {
        colArr.map(colArrItem => {
          if (colArrItem.columns === arrItem) {
            colArrItem['value'] = formData[arrItem];
          }
        });
      });
      this.formDataArr = colArr;
      console.log(colArr);
    },
    toHome(){
      uni.switchTab({
        url:'../../home/home'
      })
    }
  }
};
</script>

<style lang="scss">
.selectView {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  .info_item {
    display: flex;
    padding: 0 30upx;
    line-height: 80upx;
    border-bottom: 1px solid #E2E3DC;
    justify-content: space-between;
    .label{
      width: 30%;
      font-size: 30upx;
      font-weight: 600;
    }
    .value{
      width: 69%;
      
    }
  }
  .back_btn{
    height: 200upx;
    margin: auto;
    display: flex;
    align-items: center;
  }
}
</style>
