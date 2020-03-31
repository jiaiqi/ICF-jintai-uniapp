<template>
  <view class="modify-wrap">
    <view class="cu-form-group margin-top">
      <view class="title">昵称</view>
      <input placeholder="请输入昵称" name="input" v-model="formData.nick_name" />
    </view>
    <view class="cu-form-group margin-top">
      <view class="title">姓名</view>
      <input placeholder="请输入姓名" name="input" v-model="formData.real_name" />
    </view>
    <view class="cu-form-group margin-top">
      <view class="title">年龄</view>
      <input placeholder="请输入年龄" name="input" type="number" v-model="formData.age" />
    </view>
    <view class="cu-form-group">
      <view class="title">电话</view>
      <input placeholder="请输入手机号码" name="input" type="number" v-model="formData.mobile" />
      <view class="cu-capsule radius">
        <view class="cu-tag bg-blue ">+86</view>
        <view class="cu-tag line-blue">中国大陆</view>
      </view>
    </view>
    <view class="cu-form-group margin-top">
      <view class="title">邮箱</view>
      <input placeholder="请输入邮箱" name="input" v-model="formData.email" />
    </view>
    <view class="cu-form-group margin-top">
      <view class="title">地址</view>
      <input placeholder="请输入地址" name="input" v-model="formData.detail_address" />
      <text class="cuIcon-locationfill text-orange"></text>
    </view>
    <view class="cu-form-group margin-top">
      <view class="title">社区</view>
      <picker @change="PickerChange" :value="sqindex" :range="picker">
        <view class="picker">{{ sqindex > -1 ? picker[sqindex] : '请选择所在社区' }}</view>
      </picker>
    </view>
    <view class="padding flex flex-direction"><button class="cu-btn bg-red margin-tb-sm lg" @click="submitFormData()">提交</button></view>
  </view>
</template>

<script>
export default {
  name: 'ModifyInfo',
  data() {
    return {
      sqindex: -1, //社区下标
      picker: [],
      formData: {},
      sqData: [],
      user_no:'',
      queryData:{}
    };
  },
  methods: {
    PickerChange(e) {
      let i = e.detail.value;
      this.sqindex = i;
      let sqname = this.picker[i];
      this.sqData.map(item => {
        if (item.sqname === sqname) {
          this.formData.address = item.sqno;
        }
      });
      // this.regInfo.address = this.sqList[i].sqno;
    },
    getSqList() {
      //查找社区列表
      let url = this.$api.select + '/sqfw/select/srvzhsq_information_select';
      let req = {
        serviceName: 'srvzhsq_information_select',
        colNames: ['*']
      };
      this.$http.post(url, req).then(res => {
        if (res.data.data) {
          console.log(res.data.data);
          this.sqData = res.data.data;
          this.picker = res.data.data.map((item,i) => {
            if(this.formData.address===item.sqno){
              this.sqindex = i
            }
            return item.sqname;
          });
        }
      });
    },
    submitFormData() {
      // 提交表单
      let callback = (content, icon) => {
        uni.showToast({
          title: content,
          icon: icon || 'none'
        });
      };
      let data = this.formData;
      let regPhone = /^1[3456789]\d{9}$/;
      if (!regPhone.test(data.mobile)) {
        callback('请输入正确格式的手机号码');
        return;
      }
      if (!data.mobile) {
        callback('手机号不能为空');
        return;
      }
      let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (data.email && !regEmail.test(data.email)) {
        callback('请输入正确格式的邮箱号码');
        return;
      }
      let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
      let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
      let regAddr = /([^\x00-\xff]|[A-Za-z0-9_])+/;
      if (data.nick_name && !regAddr.test(data.nick_name)) {
        callback('呢称不能包含特殊符号');
        return;
      }
      if (!data.address) {
        callback('请选择所在社区');
        return;
      }
      if (data.detail_address && !regAddr.test(data.detail_address)) {
        callback('地址不能包含特殊符号');
        return;
      }
      let url = this.$api.select + '/sqfw/operate/srvsqfw_person_info_update';
      let req = [
        {
          serviceName: 'srvsqfw_person_info_update',
          data: [data]
        }
      ];
      this.$http.post(url, req).then(res => {
        console.log(res.data.resultCode);
        if (res.data.resultCode === 'SUCCESS') {
          uni.showToast({
            title: '修改成功',
            icon: 'success'
          });
          uni.switchTab({
            url: './info'
          })
        }else{
          uni.showToast({
            title: res.data.resultMessage
          });
        }
      });
    }
  },
  onLoad(option) {
    if (option.data) {
      this.formData = JSON.parse(decodeURIComponent(option.data));
      for(let i in this.formData){
        if(!this.formData[i]){
          this.formData[i] = ''
        }
      }
    }
  },
  created() {
    this.getSqList();
  }
};
</script>

<style lang="scss">
.modify-wrap {
  width: 100%;
}
</style>
