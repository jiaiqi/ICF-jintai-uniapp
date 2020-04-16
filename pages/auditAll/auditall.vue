<template>
  <view class="content">
    <view class="allbox">
      <text class="title">名称：</text>
      <text v-if="datalist" style="font-weight: 600;font-size: 15px;">
       {{datalist.proc_name}}
      </text>
    </view>
    <view class="allbox">
      <text class="title">状态：</text>
      <text v-if="datalist" style="font-weight: 600;font-size: 15px;">{{datalist.step_name}}</text>
    </view>
    <view class="" style="display: flex;">
      <text class="title">意见：</text>
      <radio-group @change="change">
        <label class="allbox">
          <view class="">
            <radio style="transform:scale(0.7)" value="pass" class="" />
            <text>通过</text>
            <text style="opacity: 0;">*****</text>
            <radio style="transform:scale(0.7)" value="return" />
            <text>不通过</text>
          </view>
        </label>
      </radio-group>
    </view>
    <view class="allbox">
      <text v-if="start" style="color: red;">*</text>
      <text class="title">回复：</text>
      <textarea v-model="explain" class="select" placeholder="请输入" />
    </view>
    <view class="btn" @click="submit">提 交</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
		
      dataStatus: [],
      statusBtn: [],
      datalist: [],
      passadit: '', //意见
      explain: '', //说明
      start: false,
      tiBoolle: false,
      timer: null,
	  returnStepNo:null,
	  detailValue:""
    };
  },
  methods: {
    change(e) {
		this.detailValue = e.detail.value
      if (e.detail.value == 'return') {
        this.start = true;
		this.getStepNum()
      } else {
        this.start = false;
      }
      this.passadit = e.detail.value;
    },
	async getStepNum(){				
		let req = {
		  serviceName:"srvprocess_basic_cfg_select",
		  condition:[{
			  colName:"proc_instance_no",
			  ruleType:"eq",
			  value:this.datalist.proc_instance_no
		  }],
		  }
		  let url = this.$api.select + '/' + this.datalist.appno + '/select/' + req.serviceName;
		  let res = await this.$http.post(url,req)
		  debugger
		  this.returnStepNo = res.data.proHanleData.return_options[0].value
		 // this.$http.post(url, req).then(res => {
			//   this.returnStepNo = res.data.proHanleData.return_options[0].value
		 // })
	  
	},
    submit() {
		let datalist = this.datalist
      let authority = '';
      let num = 0;
      let appsdat = datalist.appno;
	  let req = [{
		  serviceName:"approval",
		  proc_instance_no:datalist.proc_instance_no,
		  step_no:datalist.step_no,
		  data:[
				{
					key: this.detailValue,
					proc_result: this.detailValue,
					remark:this.explain
					// step_no:""
				},
			]
	  }]
	  if(this.start){
		  req[0].data[0]["step_no"] = this.returnStepNo
	  }
      let url = this.$api.select + '/' +appsdat + '/process/'+req[0].serviceName;
	  
      console.log(req);
      let that = this;
      uni.showModal({
        title: '提示',
        content: '确定提交？',
        success: function(res) {
          if (res.confirm) {
            if (that.passadit == '') {
              uni.showToast({
                title: '请选择意见',
                duration: 2000,
                icon: 'none'
              });
            } else if (that.passadit == 'return' && that.explain == '') {
              uni.showToast({
                title: '请填写驳回原因',
                duration: 2000,
                icon: 'none'
              });
            } else {
              uni.showLoading({
                title: '提交中'
              });
              let i = 0;
              that.timer = setInterval(() => {
                i++;
                if (i == 15) {
                  clearInterval(that.timer);
                  if (that.tiBoolle == false) {
                    uni.hideLoading();
                    uni.showToast({
                      title: '提交失败,请重新尝试',
                      duration: 3000,
                      image: '../../static/img/gantanhao.png'
                    });
                  }
                }
              }, 1000);
              that.$http.post(url, req).then(res => {
                console.log('0000000', res);
                that.tiBoolle = true;
                uni.hideLoading();
                uni.showToast({
                  title: res.data.resultMessage,
                  duration: 2000,
                  icon: 'success'
                });
                if (res.data.resultMessage == '审批成功') {
                  uni.showLoading({
                    title: '审批成功，正在回到列表页面~'
                  });
                  setTimeout(() => {
                    uni.hideLoading();
                    uni.navigateBack({
                      delta: 1
                    });
                    // uni.redirectTo({
                    //     url: './auditList?serve='+that.datalist.servename
                    // });
                  }, 4000);
                }
              });
            }
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    }
  },
  onLoad(options) {
    this.datalist = JSON.parse(decodeURIComponent(options.query));
    console.error(this.datalist);
    // this.submit()
  },
  onUnload() {
    clearInterval(this.timer);
    this.timer = null;
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style>
.content {
  width: 100%;
  background: #ffffff;
  padding: 40upx;
}
.btn {
  margin: 10upx 20upx;
  height: 80upx;
  background: red;
  font-size: 18px;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  line-height: 80upx;
  border-radius: 20upx;
}
.title {
  display: block;
  width: 60px;
  text-align: left;
}
.select {
  border: 1upx solid #e0e0e0;
}
.allbox {
  display: flex;
  margin-bottom: 15px;
}
.menus {
  margin-right: 15px;
}
</style>
