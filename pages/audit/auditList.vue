<template>
  <view class="content">
    <!-- <view class="tobar">
			<image class="fanhui" @click="inpage()" src="../../static/img/fanhui.png" mode=""></image>
			<text class="textline">待审核</text>
		</view> -->
    <view class="list-box" style="padding: 40upx;">
      <view class="">
        <view class="box" v-for="(item, index) in listhome" :key="index">
          <view class="">
            <view class="nametitle" style="">
              {{
                item.zuzhi_name ||
                  item.organize_name ||
                  item.activity_title ||
                  item.note_title ||
                  item.opinion_title ||
                  item.bt ||
                  item.registe ||
                  item.member_name ||
                  item.title ||
                  item.xmxx_name ||
                  item.pxbt
              }}
            </view>
            <text>状态:{{ item.proc_status }}</text>
          </view>
          <view class="but" @click="audio(item)">审批</view>

          <!-- 	<view class="buts" v-else >
						审批
					</view> -->
          <!-- v-if="booe(item.proc_status)" -->

          <view class="xq" v-if="!item.member_name" @click="xqpages(item)">详情</view>
        </view>
        <view class="kapian" v-if="contentBoole"><view class="" style="color: #BEBEBE;text-align: center;line-height: 60px;">暂无待审核内容</view></view>
        <!-- //加载中 -->
        <view class="kapian" v-if="menubtn">
          <view class="" style="color: #BEBEBE;text-align: center;">
            <image style="height: 25px;width: 25px;" src="../../static/img/loading.gif" mode=""></image>
            <view class="">数据加载中</view>
          </view>
        </view>
        <uni-loading v-if="!contentBoole" :status="status" color="#888" />
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
      listhome: [],
      contentBoole: false,
      menubtn: true,
      servenameat: '',
      numberlist: 8,
      pageno: 1,
      status: 0,
      apps: 'sqfw'
    };
  },
  components: { uniLoading },
  methods: {
    getlist(val, num) {
      let url = this.$api.select + '/' + this.apps + '/select/' + val;
      let req = {};
      req.serviceName = val;
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req.proc_data_type = 'wait';
      req['page'] = {
        pageNo: this.pageno,
        rownumber: this.numberlist
      };
      this.$http.post(url, req).then(res => {
        console.log(res.data.data);
        this.menubtn = false;
        let numarr = res.data.data;
        let arrbar = [];
        for (let i in numarr) {
          this.$set(numarr[i], ['servename'], val);
          if (numarr[i].proc_status.indexOf('提交') !== -1) {
            delete numarr[i];
          }
        }
        for (let i in numarr) {
          if (numarr[i].proc_status != '') {
            arrbar.push(numarr[i]);
          }
        }
        if (num == 0) {
          this.listhome = arrbar;
          if (arrbar.length == 0) {
            this.contentBoole = true;
          } else if (arrbar.length < 8) {
            this.status = 2;
          }
        } else {
          if (arrbar.length == 0) {
            this.status = 2;
          }
          this.listhome = this.listhome.concat(arrbar);
        }
      });
    },
    inpage() {
      window.history.go(-2); //后退
    },
    onPullDownRefresh() {
      // this.numberlist= this.listhome.length
      let _self = this;
      _self.pageno = 1;
      setTimeout(function() {
        uni.stopPullDownRefresh();
        _self.getlist(_self.servenameat, 0);
      }, 1000);
    },
    onReachBottom() {
      let _self = this;
      _self.status = 1;
      _self.pageno++;
      uni.showNavigationBarLoading();
      setTimeout(function() {
        _self.getlist(_self.servenameat, 1);
        _self.status = 0;
        uni.hideNavigationBarLoading();
      }, 1000);
    },
    booe(val) {
      return val.indexOf('提交') == -1;
    },
    audio(val) {
      uni.navigateTo({
        url: './audit?query=' + encodeURIComponent(JSON.stringify(val).replace(/%/g, '%25'))
      });
    },
    xqpages(item) {
      console.error(item, this.servenameat);
      // debugger
      if (this.servenameat == 'srvzhsq_social_organizie_select' || this.servenameat == 'srvzhsq_zyz_zuzhi_select') {
        uni.setStorage({
          key: 'zuzhi',
          data: {
            names: item.zuzhi_name || item.organize_name,
            dress: item.zuzhi_address || item.address,
            session: item.zuzhi_jj || item.remark
          },
          success: function() {
            uni.navigateTo({
              url: '../shzz/fromtext?state=1'
            });
          }
        });
      } else if (this.servenameat == 'srvzhsq_activity_arrange_select') {
        uni.navigateTo({
          url: '../sqfw/sqxq?query=' + encodeURIComponent(JSON.stringify(item).replace(/%/g, '%25'))
        });
      } else if (this.servenameat == 'srvzhsq_forum_note_list_num_select' || this.servenameat === 'srvzhsq_forum_note_select') {
        uni.navigateTo({
          url: '../forum/detail?no=' + item.note_no + '&pbox=true'
        });
      } else if (this.servenameat == 'srvzhsq_forum_opinion_select') {
        uni.navigateTo({
          url: '../normal/detail/detail?query=' + encodeURIComponent(JSON.stringify(item).replace(/%/g, '%25'))
        });
      } else if (this.servenameat == 'srvzhsq_djlt_ftxx_select') {
        uni.navigateTo({
          url: '../forum/detail?no=' + item.ftno + '&pbox=true'
        });
      } else if (this.servenameat == 'srvzhsq_activity_registe_select') {
        uni.navigateTo({
          url: '../sqfw/bmym?no=' + encodeURIComponent(JSON.stringify(item).replace(/%/g, '%25'))
        });
      } else if (this.servenameat == 'srvzhsq_bmfw_ssp_select') {
        uni.navigateTo({
          url: '../shzz/zzbg?item=' + encodeURIComponent(JSON.stringify(item).replace(/%/g, '%25')) + '&type=xq'
        });
      } else if (this.servenameat == 'srvzhsq_bmfw_xmxx_select') {
        uni.navigateTo({
          url: '../shzz/xmmxx?item=' + encodeURIComponent(JSON.stringify(item).replace(/%/g, '%25')) + '&type=xmxx'
        });
      } else if(this.servenameat === 'srvzhsq_pxap_select'||this.servenameat==='srvzhsq_xxxd_select'){
        uni.navigateTo({
          url:'/pages/normal/detail/detail?query=' + encodeURIComponent(JSON.stringify(item).replace(/%/g, '%25'))
        })
      }
    }
  },
  onLoad(option) {
    this.servenameat = option.serve;
    if (option.serve == 'srvzhsq_djlt_ftxx_select' || option.serve === 'srvzhsq_xxxd_select' || option.serve === 'srvzhsq_pxap_select') {
      this.apps = 'zhdj';
    }else if(option.serve == 'srvsso_process_todo_select'){
		this.apps = 'sso';
	}
    this.getlist(option.serve, 0);
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
