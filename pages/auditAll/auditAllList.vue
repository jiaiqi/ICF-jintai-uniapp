<template>
  <view class="content">
    <!-- <view class="tobar">
			<image class="fanhui" @click="inpage()" src="../../static/img/fanhui.png" mode=""></image>
			<text class="textline">待审核</text>
		</view> -->
    <view class="list-box" style="padding: 40upx;">
      <view class="">
        <view class="box" v-for="(item, index) in auditList" :key="index">
          <view class="">
            <view class="nametitle" style="">
             {{item.proc_name}}
            </view>
            <text>状态:{{item.step_name}}</text>
          </view>
          <view class="but" @click="audio(item)">审批</view>

          <!-- <view class="xq" v-if="!item.member_name" @click="xqpages(item)">详情</view> -->
        </view>
        <view class="kapian" v-if="contentBoole"><view class="" style="color: #BEBEBE;text-align: center;line-height: 60px;">暂无待审核内容</view></view>
        <!-- //加载中 -->
        <view class="kapian" v-if="menubtn">
          <view class="" style="color: #BEBEBE;text-align: center;">
            <image style="height: 25px;width: 25px;" src="../../static/img/loading.gif" mode=""></image>
            <view class="">数据加载中</view>
          </view>
        </view>
        <!-- <uni-loading v-if="!contentBoole" :status="status" color="#888" /> -->
      </view>
    </view>

    <!-- 	<view class="" style="height: 50vh;">
		</view> -->
  </view>
</template>

<script>
import uniLoading from '@/components/mix-load-more/mix-load-more';
export default {
  data() {
    return {
      menubtn:true,
	  numberlist: 8,
	  pageno: 1,
	  auditList:[],
	  contentBoole:false
    };
  },
  components: { uniLoading },
  methods: {
    audio(item){
		uni.navigateTo({
		  url: './auditall?query=' + encodeURIComponent(JSON.stringify(item).replace(/%/g, '%25'))
		});
		console.log("点击",item)
	},
	xqpages(item){
		console.log("详情",item)
	},
	getAuditList(){
		let req = {
			serviceName:"srvsso_process_todo_select",
			page:{
				pageNo:this.pageno,
				rownumber:this.numberlist
			},
			condition:[{
				colName:"app",
				ruleType:"in",
				value:"zhdj,sqfw"
			}]
		}
		let url = this.$api.select + '/sso' + '/select/'+req.serviceName;
		this.$http.post(url, req).then(res => {
			this.menubtn = false
			this.auditList = this.auditList.concat(res.data.data)
			console.log(res)
		})
	},
	onPullDownRefresh() {
	  // this.numberlist= this.listhome.length
	  let _self = this;
	  _self.pageno = 1;
	  setTimeout(function() {
	    uni.stopPullDownRefresh();
	    _self.getAuditList();
	  }, 1000);
	},
	onReachBottom() {
	  let _self = this;
	  _self.pageno++;
	  uni.showNavigationBarLoading();
	  setTimeout(function() {
	    _self.getAuditList();
	    uni.hideNavigationBarLoading();
	  }, 1000);
	},
	
  },
  onLoad(option) {
  },
  created() {
  	this.getAuditList()
  },
  onShow() {
    // console.error(this.servenameat)
    // this.getlist(this.servenameat,0)
  }
};
</script>

<style>
.content {
  width: 100%;
  background: #ffffff;
}
.list-box {
  /* margin-top: 100upx; */
}
.box {
  height: 150upx;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 0 26px 0 rgba(0, 0, 0, 0.15);
  margin-bottom: 15px;
  padding: 12px 12px 12px 12px;
  display: flex;
  justify-content: space-between;
}
.but {
  width: 100upx;
  height: 100upx;
  background: #e54d42;
  border-radius: 50%;
  color: #ffffff;
  line-height: 100upx;
  text-align: center;
}
.textline {
  line-height: 88upx;
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
}
.fanhui {
  display: inline-block;
  height: 40upx;
  width: 40upx;
  position: absolute;
  left: 5px;
  top: 20upx;
}
.buts {
  width: 100upx;
  height: 100upx;
  background: #9e9e9e;
  border-radius: 50%;
  color: #ffffff;
  line-height: 100upx;
  text-align: center;
}
.xq {
  width: 100upx;
  height: 100upx;
  background: #96ca50;
  border-radius: 50%;
  color: #ffffff;
  line-height: 100upx;
  text-align: center;
}
.tobar {
  height: 88upx;
  width: 100vw;
  background: red;
  position: fixed;
  top: 0;
  text-align: center;
  /* position: relative; */
}
.kapian {
  box-shadow: 0 0 26px 0 rgba(0, 0, 0, 0.12);
  margin: 8px 0;
  padding: 8px;
}
.nametitle {
  font-weight: 600;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
