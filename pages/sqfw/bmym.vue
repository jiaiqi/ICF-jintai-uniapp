<template>
  <view class="content">
    <view class="content-box" v-if="false">
      <view class="content-width">
        <text class="texts" style="color: red;">*</text>
        <text class="texts">用户编号：</text>
      </view>
      <input type="text" :value="valueadmin" disabled="disabled" style="background: #E2E4EA;" />
    </view>

    <view class="content-box">
      <view class="content-width">
        <text class="texts" style="color: red;">*</text>
        <text class="texts letter">姓名：</text>
      </view>
      <input type="text" :disabled="opxq" placeholder="请输入姓名" v-model="baominvalue" />
    </view>
    <view class="content-box">
      <view class="content-width">
        <text class="texts" style="color: red;">*</text>
        <text class="texts">手机号码：</text>
      </view>
      <input type="text" placeholder="请输入手机号码" v-model="phone" :disabled="opxq"/>
    </view>
	
	<view class="" v-if="!opxq">
		<view class="content-box cu-form-group margin-top">
		  <view class=" title">
		    <text class="texts" style="color: red;">*</text>
		    选择活动
		  </view>
		  <picker @change="changePicker" :value="pinckindex" :range="activityArray">
		    <view class="picker">{{ pinckindex != -1 ? activityNameArr[pinckindex] : '请选择' }}</view>
		  </picker>
		</view>
		<view class="content-box">
		  <view class="content-width">
		    <text class="texts" style="color: red;">*</text>
		    <text class="texts">报名时间：</text>
		  </view>
		  <input type="text" v-model="nowTime" disabled/>
		</view>
	</view>
  
	<view class="" v-else>
		<view class="content-box">
		  <view class="content-width">
		    <text class="texts" style="color: red;">*</text>
		    <text class="texts letter">报名活动：</text>
		  </view>
		  <input type="text" :disabled="opxq" v-model="activetitle" />
		</view>
		<view class="content-box">
		  <view class="content-width">
		    <text class="texts" style="color: red;">*</text>
		    <text class="texts">报名时间：</text>
		  </view>
		  <input type="text" :disabled="opxq" v-model="modify_time" />
		</view>
	</view>
  
  

    <view class="btn" @click="addvalue()"  v-if="!opxq">提交申请</view>
	<view class="shenhe" v-if="menuAudio>0" @click="audist">
		待我审核
	</view>
  </view>
</template>

<script>
import QSApp from '@/components/QS-inputs-split/js/app.js';
export default {
  data() {
    return {
      dateValue: '2019-11-30', //日期
      datatwolist: [],
      valueadmin: 'admin', //用户编号
      baominvalue: '', //用户报名
      pinck: '', //活动编号,
      registe_date:'',//报名时间
      pinckindex: -1, //编号下标
      idArr: [],
      activityNameArr: [],
      activityArray: [], // 多选列表
      phone: '', //手机号,
      active_no: '',
      nowTime:new Date(),
	  //详情
	  detailslist:[],
	  activity_noxq:'', //详情编号
	  opxq:false,
	  activetitle:'',
	  modify_time:'',
	  menuAudio:0
    };
  },
  components: {},
  methods: {
	  audist(val){
		  uni.navigateTo({
		  	url:'../audit/auditList?serve='+"srvzhsq_activity_registe_select"
		  })
	  },
	  getMenu(serve){
	  	console.error(serve)
	  	let url =this.$api.select + "/sqfw/select/"+serve
	  	let req = {};
	  	req.serviceName =serve;
	  	req.colNames = ['*'];
	  	req.condition = [];
	  	req.order = [];
	  	req.proc_data_type="wait"
	  	req['page'] = {
	  		pageNo: 1,
	  		rownumber: 10
	  	};
	  	this.$http.post(url, req).then(res => {
	  		console.log(res)
	  			this.menuAudio=res.data.data.length
	  	})
	  },
    MultiColumnChange(e) {
      console.log(e);
    },
    getdata() {
      let url = this.$api.select + '/sqfw/select/srvzhsq_activity_arrange_select';
      let req = {};
      let date = new Date()
     date = this.formatTime(date,'yyyy-MM-dd HH:mm:ss')
     this.nowTime = date
      req.serviceName = 'srvzhsq_activity_arrange_select';
      req.colNames = ['*'];
      req.condition = [{ colName: 'proc_status', ruleType: 'eq', value: '完成' }, { colName: 'activity_limitdate', ruleType: 'gt', value: date }];
      req.queryMethod = 'select';
      req.distinct = false;

      this.$http.post(url, req).then(res => {
		  
        let list = res.data.data;
		this.detailslist=list
		console.error(list)
		if(this.opxq){
			console.log(this.activity_noxq)
			for(let i in list ){
				if(this.activity_noxq==list[i].activity_no){
					this.activetitle=list[i].activity_title
				}
			}
		}
        let idArr = [];
        let datast = [];
        let activityNameArr = [];
        for (let i in list) {
          idArr.push(list[i].activity_no);
          activityNameArr.push(list[i].activity_title);
          datast.push(list[i].activity_title + '/' + list[i].activity_no);
        }
        let a = '[' + JSON.stringify(datast) + ']';
        let b = JSON.parse(a);
        this.activityArray = b[0];
        this.activityNameArr = activityNameArr;
        this.idArr = idArr;
      });
    },
    setPickerDataFc(name, data) {
      this.$refs[name].setData(data);
    },
    addvalue() {
		console.log(this.active_no)
      if (this.baominvalue == '' || this.phone == '' || this.active_no == '') {
        uni.showToast({
          title: '请填写完整再提交',
          duration: 2000,
          icon: 'none'
        });
      } else if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: '手机号码填写有误',
          duration: 2000,
          icon: 'none'
        });
      } else {
        let url = this.$api.select + '/sqfw/apply/srvzhsq_activity_registe_add?srvzhsq_activity_registe_add';
        let req = [
          {
            serviceName: 'srvzhsq_activity_registe_add',
            data: [
              {
                activity_no: this.active_no,
                user_no: this.valueadmin,
                registe: this.baominvalue,
                phone: this.phone,
                registe_date: '2019-12-02 15:12:34', //ateValue
                child_data_list: []
              }
            ]
          }
        ];
        uni.showLoading({
          title: '提交中...'
        });

        this.$http.post(url, req).then(res => {
          console.log(res);
          if (res.status == 200) {
            if (res.data.resultCode == 'SUCCESS') {
              uni.hideLoading();
              uni.showToast({
                title: '提交成功，跳转中...',
                duration: 2000,
                icon: 'success'
              });
              setTimeout(() => {
                uni.navigateBack({
                  delta: 2
                });
              }, 3000);
            } else {
              uni.hideLoading();
              uni.showToast({
                title: res.data.resultMessage + '请重新尝试',
                duration: 3000,
                image: '../../static/img/gantanhao.png'
              });
            }
          } else {
            uni.hideLoading();
            uni.showToast({
              title: '提交失败，请重新尝试',
              duration: 3000,
              image: '../../static/img/gantanhao.png'
            });
          }
        });
      }
    },
    changePicker(e) {
      console.log(e);
      console.log(e.detail.value, this.activityArray[e.detail.value]);
      this.pinckindex = e.detail.value;
      this.active_no = this.idArr[e.detail.value];
      //    this.active_no = val.data[0].slice(val.data[0].indexOf('/'), val.data[0].length);
      // console.log(this.active_no,this.pinck);
    }
  },
  onLoad(option) {
	  if(option.no){
		  this.opxq =true
			let detailslist = JSON.parse(decodeURIComponent(option.no));
			console.log(detailslist)
			this.baominvalue=detailslist.registe
			this.phone = detailslist.phone
			this.activity_noxq=detailslist.activity_no
			this.modify_time=detailslist.modify_time
	  }
    let userInfo = uni.getStorageSync('userInfo')
    if(userInfo&&userInfo.real_name){
      this.baominvalue=userInfo.real_name
    }
    this.getdata();
    let that = this;
    uni.getStorage({
      key: 'userInfo',
      success(e) {
        that.valueadmin = e.data.user_no;
      }
    });
	this.getMenu('srvzhsq_activity_registe_select')
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  background: #f1f1f1;
  padding: 0 35upx;
}
input,
input,
.input {
  /* border: 1px solid #c5464a; */
  /* border-radius: 5px 5px 5px 5px; */
  height: 30px;
  width: 60% !important;
  font-size: 15px;
  padding: 2px 5px;
  margin-top: calc(60upx - 15px);
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
.content-box {
  display: flex;
  background: #ffffff;
  padding: 0 35upx;
  height: 120upx;
  margin-top: 30upx;
}
.content-box .title {
  height: auto;
  line-height: 1;
}
.content-width {
  width: 28%;
}
.texts {
  line-height: 120upx;
  font-size: 15px;
}
.content-width {
  width: 28%;
}
.padding_5rpx_7_5rpx {
  padding: 0 !important;
}
.uni-list-cell::after {
  background-color: #ffffff !important;
}
.mpvue-picer {
  margin-top: 12upx;
  /* border: 1px solid #c5464a; */
  padding: 0 !important;
  /* 	height: 28px;
		border-radius: 5px 5px 5px 5px;
		width: 63% !important; */
}
.letter {
  display: inline-block;
  text-align: right;
}
.serse {
  width: 60%;
  /* padding: 0 !important; */
  /* padding-right: 12px; */
  border: 1px solid #c5464a;
}
.btn {
  margin: 40upx 20upx;
  height: 70upx;
  background: red;
  font-size: 17px;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  line-height: 70upx;
  border-radius: 20upx;
}
</style>
