<template>
  <view class="form_box">
    <div class="form_item" v-for="(item, i) in colData" :key="i">
      <div class="form_label">
        {{ item.label }}
        <text v-if="item.required == '是'" class="required">*</text>
      </div>
      <div class="form_content">
        <radio-group name="" v-if="item.columns === 'gender'" class="radio_group" @change="changeSex">
          <label v-for="(item2, index) in genderItems" :key="item2.value">
            <text><radio :value="item2.value" :checked="index === current" /></text>
            <text>{{ item2.name }}</text>
          </label>
        </radio-group>
        <view v-else-if="item.columns === 'nation'">
          <div class="mpvue-picer"><QSPickerCustom ref="nationPicker" :name="formName" :variableName="formName" title="选择民族:"  @pickerChange	="changeNation"/></div>
        </view>
        <view v-else-if="item.col_type === 'Date'">
          <view class="tab" :class="{ active: index == dateTabIndex }" @tap="toggleTab(item, index)" v-for="(item, index) in tabList" :key="index">{{ item.name }} {{dateResult[i]}}</view>
          <w-picker mode="date" startYear="2016" endYear="2030" :defaultVal="dateDefaultVal" :current="true" @confirm="dateConfirm" ref="date" themeColor="#f00"></w-picker>
        </view>
        <input type="idcard" v-model="item.value" class="input" v-else @blur="changeData(item.value)"/>
      </div>
    </div>
  </view>
</template>

<script>
import QSPickerCustom from '@/components/QS-inputs-split/elements/QS-picker-custom/index.vue';
import wPicker from '@/components/w-picker/w-picker.vue';
export default {
  components: { QSPickerCustom, wPicker },
  data() {
    return {
      mode: 'selector',
      colData: [
        // {
        //   label: '姓名',
        //   colName: 'name',
        //   inputType: 'text',
        //   required: true
        // }
      ],
      genderItems: [
        {
          name: '男',
          value: '男'
        },
        {
          name: '女',
          value: '女'
        }
      ],
      formName: 'picker_custom',
      nationArray: [],
      nationValueDefault: [1],
      pickerText: '',
      deepLength: 1,
      current: 0,
      dateDefaultVal: ['2018', '02', '05', '下午'],
      tabList: [
        {
          mode: 'date',
          name: '日期选择'
        }
      ],
      dateResult: [],
      dateMode: '',
      dateTabIndex: 0,
      idcard: '',
      requestInfo: {
        serviceName: 'srvzhsq_bmfw_permit_select',
        pageType: 'select',
        appType: 'sqfw'
      }
    };
  },
  onLoad(query) {
    console.log('query', query);
    if (query.type) {
      if (query.type == 0) {
        uni.setNavigationBarTitle({
          title: '常住人口登记'
        });
      } else if (query.type == 1) {
        uni.setNavigationBarTitle({
          title: '暂住人口登记'
        });
      }
      this.getCols();
      // if(this.colData){
      //   setTimeout(()=>{
      //     this.setPickerData();
      //   },500)
      // }
    }
  },
  methods: {
    changeData(value){
      console.log('val:',value)
    },
    changeSex(e){ //性别选择
       console.log('val:',e.detail.value)
    },
    changeNation(e){ // 民族选择
      console.log('val:',this.nationArray[e.value[0]])
    },
    toggleTab(item, index) {
      this.tabIndex = index;
      this.dateMode = item.mode;
      this.dateDefaultVal = item.value;
      console.log(this.$refs)
      if(this.$refs){
        this.$refs['date'][index].show();
      }
    },
    getCols() {
      let query = this.requestInfo;
      let url = this.$api.select + '/sqfw/select/srvsys_service_columnex_v2_select?colsel_v2=srvzhsq_bmfw_permit_select';
      let req = {
        serviceName: 'srvsys_service_columnex_v2_select',
        colNames: ['*'],
        condition: [{ colName: 'service_name', value: 'srvzhsq_bmfw_permit_select', ruleType: 'eq' }, { colName: 'use_type', value: 'list', ruleType: 'eq' }],
        order: [{ colName: 'seq', orderType: 'asc' }]
      };
      this.$http.post(url, req).then(res => {
        console.log('ColRes:', res.data.data);
        let colData = [];
        if (res.data.data) {
          let data = res.data.data;
          data.srv_cols.map(dataItem => {
            if (dataItem.in_list == '1') {
              colData.push(dataItem);
            }
          });
          console.log('colData', colData);
          this.colData = colData;
          colData.map(item => {
            if (item.columns == 'nation') {
              let arr = item.option_list_v2;
              let nationArr = [];
              arr.map(items => {
                nationArr.push(items.value);
              });
              setTimeout(() => {
                this.nationArray = nationArr
                this.setPickerData(nationArr);
              }, 500);
            }
          });
        }
      });
    },
    setPickerData(nationArr) {
      const data1 = [nationArr];
      this.setPickerDataFc('nationPicker', data1);
    },
    setPickerDataFc(name, data) {
      console.log('准备 调用setData', this.$refs);
      this.$refs['nationPicker'][0].setData(data);
    },
    dateConfirm(val,index) {
      console.log(val);
      //如果页面需要调用多个mode类型，可以根据mode处理结果渲染到哪里;
      // switch(this.mode){
      // 	case "date":
      // 		break;
      // }
      this.dateResult[index] = val;
    },
    getData() {
      QSApp.getForm(this.formName)
        .then(res => {
          console.log('获取FORM数据成功: ' + JSON.stringify(res));
          uni.showToast({ title: '获取数据成功' });
        })
        .catch(err => {
          console.log('获取FORM数据失败: ' + JSON.stringify(err));
          uni.showToast({ title: '获取数据异常' });
        });
    },
    radioChange() {
      for (let i = 0; i < this.genderItems.length; i++) {
        if (this.genderItems[i].value === evt.target.value) {
          this.current = i;
          break;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.form_box {
  width: 100%;
  margin: 0 auto;
  .required {
    color: #ff3333;
  }
  .content {
    text-align: center;
    height: 400upx;
  }
  .tab {
    padding: 20upx 0;
    font-size: 32upx;
  }
  .tab.active {
    color: #f00;
  }
  .result {
    margin-top: 100upx;
    font-size: 32upx;
  }
  .form_item {
    display: flex;
    height: 80upx;
    align-items: center;
    font-size: 30upx;
    .form_label {
      min-width: 20%;
      max-width: 30%;
      text-align: left;
      padding: 0 20upx;
    }
    .form_content {
      width: 70%;
      .input {
        border: 1px solid #c5464a;
      }
      .radio_group {
        display: flex;
        width: 50%;
        justify-content: space-around;
      }
      .uni-list-cell {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .uni-list-cell-left {
          font-size: 16px;
          padding: 0 17px;
        }
        .uni-list-cell-db,
        .uni-list-cell-right {
          flex: 1;
        }
        .uni-picker-container {
          display: none;
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          box-sizing: border-box;
          z-index: 999;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
