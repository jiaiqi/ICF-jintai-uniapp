<template>
  <view class="selectView">
    <view class="search">
      <!-- <text class="label">身份证号：</text> -->
       <icon type="search" size="26" class="search_icon"/>
      <input type="idcard" v-model="idCard" placeholder="请输入身份证号" class="text"/>
    </view>
    <view class="bottom">
      <button type="primary" @click.native="searchInfo">搜索</button>
      <!-- <button type="warn" @click.native="resetForm">重置</button> -->
    </view>
  </view>
</template>

<script>
export default {
  name: 'selectPeopleInfo',
  data() {
    return {
      query: Object,
      idCard: '',
    };
  },
  onLoad: function(option) {
    let query = JSON.parse(option.query);
    this.query = query;
    uni.setNavigationBarTitle({
      title:query.title
    })
    console.log('query', query);
  },
  methods: {
   validateIdNo( value) {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if(value==''||value==undefined||value==null){
        callback();
      }else {
        if ((!reg.test(value)) && value != '') {
          callback(new Error('请输入正确的身份证号码'));
        } else {
          callback();
        }
      }
    },
    searchInfo() {
      let self = this;
      const value = this.idCard
      if (value==''||value==undefined||value==null) {
        uni.showToast({
          icon: 'none',
          title: '请输入身份证'
        });
      } else {
        // this.validateIdNo(this.idCard)
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
          if ((!reg.test(value)) && value != '') {
            uni.showToast({
              icon: 'none',
              title: '请输入正确格式的身份证号码',
              // duration: 2000
            });
          } else {
            uni.showToast({
              icon: 'loading',
              title: '查找成功，正在跳转到详情页...',
              duration: 1000
            });
            self.selectInfo(self.idCard);
          }
        // uni.showModal({
        //   title: '确认操作',
        //   content: '是否确认查找',
        //   success: function(res) {
        //     if (res.confirm) {
        //     } else if (res.cancel) {
        //       console.log('您点击了取消');
        //     }
        //   }
        // });
      }
    },
    selectInfo(id) {
      let serviceName = this.query.serviceName;
      let url = this.$api.select + '/' + this.query.appType + '/select/' + serviceName;
      let req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [
          {
            colName: 'card_id',
            ruleType: 'eq',
            value: id
          }
        ]
      };
      this.$http.post(url, req).then(res => {
        console.log(res);
        if (res.data.data) {
          let data = res.data.data;
          if (data && data.length > 0) {
            this.toDetail(data);
          } else {
            uni.showToast({
              icon: 'none',
              title: '没有查到此身份证号对应的信息',
              duration: 3000
            });
          }
        }
      });
    },
    toDetail(backData) {
      // 查看详情
     setTimeout(()=>{
       uni.redirectTo({
         url: '../peopleInfo/peopleInfo?query=' + encodeURIComponent(JSON.stringify(this.query)) + '&data=' + encodeURIComponent(JSON.stringify(backData))
       });
     },2000)
    },
    resetForm() {
      this.idCard = '';
    }
  }
};
</script>

<style lang="scss">
.selectView {
  width: 90%;
  height: 60vh;
  font-size: 32upx;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .search {
    display: flex;
    height: 80upx;
    align-items: center;
    // flex-direction: column;
    border-radius: 10upx;
    border: 2px solid #F1505C;  
    text-align: left;
    .label {
      width: calc(100% - 20px);
      text-indent: 1rem;
      font-weight: 600;
    }
    .search_icon{
      padding: 0 20upx ;}
    .text{
      width: 90%;
      margin: 0 auto;
      height: 80upx;
      // text-indent: 1rem;
    }
  }
}

.bottom {
  width: 95%;
  margin: 0 auto;
  height: 200upx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  button {
    width: 30%;
    height: 80upx;  font-size: 30upx;
    line-height: 80upx;
    float: left;
  }
}
</style>
