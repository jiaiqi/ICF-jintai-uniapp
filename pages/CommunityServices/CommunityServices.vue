<template>
  <view class="wrap">
    <!-- loading -->
    <Loading v-if="successNum"></Loading>
    <view class="" v-else>
      <view class="bannerlun"><bw-swiper :swiperList="swperboole ? swiperList : swiperLists" style="width:100%;"></bw-swiper></view>
      <uni-grid :column="4" :showBorder="false">
        <uni-grid-item v-for="(item, index) in menuData" :key="index" :url="item.app_temp_col_map ? item.app_temp_col_map : ''" :treeData="JSON.parse(JSON.stringify(item))">
          <text class="text">{{ item.label }}</text>
        </uni-grid-item>
      </uni-grid>
      <!-- 插图 -->
      <view class="banner" :style="{ backgroundImage: 'url(' + imageURL + ')' }"></view>
      <!-- 活动 -->
      <view class="" v-if="xqpage.length > 0">
        <text class="titleall">热门活动</text>
        <view class="contenthot">
          <view class="hot" v-for="(item, index) in xqpage" v-if="item.proc_status=='完成'" :key="index">
            <view class="phopos" @tap="detaile(item)" :style="{ backgroundImage: 'url(' + item.activity_img + ')' }"></view>
            <view class="textline">{{ item.activity_title }}</view>
          </view>
        </view>
      </view>
    </view>
    <uni-loading color="#888" />
  </view>
</template>

<script>
import uniGrid from '@/components/uni-grid/uni-grid.vue';
import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
import bwSwiper from '@/components/kp-swper/bw-swiper.vue';
import uniLoading from '@/components/sqfwl-loading-more/loading.vue';
export default {
  components: { uniGrid, uniGridItem, bwSwiper, uniLoading },
  data() {
    return {
      userInfo: {},
      menuData: [],
      showBorder: true,
      swiperList: [{ img: '../../static/img/dj.png' }, { img: '../../static/img/dj.png' }, { img: '../../static/img/dj.png' }],
      swperboole: true,
      swiperLists: [],
      phoarr: [],
      xqpage: [],
      imageURL: '../../static/img/bannerthree.jpg',
      successNum: true, //请求成功次数
      status: 0
    };
  },
  methods: {
    getMenusList(app = 'auth') {
      let url = this.$api.select + '/' + app + '/select/srvauth_app_menu_select';
      let req = {
        serviceName: 'srvauth_app_menu_select',
        colNames: ['*'],
        // order: [{ colName: 'seq', orderType: 'asc' }],
        // group: [
        //   {
        //     colName: 'service_name',
        //     type: 'by'
        //   },
        //   {
        //     colName: 'menu_url',
        //     type: 'by'
        //   },
        //   // {
        //   //   colName: 'icon',
        //   //   type: 'by'
        //   // },
        //   {
        //     colName: 'is_leaf',
        //     type: 'by'
        //   },
        //   {
        //     colName: 'app_icon',
        //     type: 'by'
        //   },
        //   {
        //     colName: 'app_dest_page',
        //     type: 'by'
        //   },
        //   {
        //     colName: 'client_type',
        //     type: 'by'
        //   },
        //   {
        //     colName: 'seq',
        //     type: 'by'
        //   }
        //   ,
        //   {
        //     colName: 'parent_no',
        //     type: 'by'
        //   },
        //   {
        //     colName: 'app_temp_col_map',
        //     type: 'by'
        //   },
        //   {
        //     colName: 'menu_name',
        //     type: 'by'
        //   },
        //   {
        //     colName: 'menu_no',
        //     type: 'by'
        //   }
        // ],
        condition: [{ colName: 'apps', ruleType: 'in', value: 'zhdj,sqfw' }]
      };
      this.$http
        .post(url, req)
        .then(res => {
          if (res.data.data) {
            let menuData = res.data.data;
            let children = [];
            let parents = [];
            menuData.forEach((menu, i) => {
              menu.children = [];
              menu.label = menu.menu_name;
              menu.value = menu.menu_no;
              if(menu.menu_no==="my_new_info"){
                menu.menu_url = '/vpages/index.html#/list/srvzhsq_xxtz_select?menuapp=sqfw'
              }
              if (menu.client_type && menu.client_type.includes('APP')) {
                if (menu.parent_no) {
                  children.push(menu);
                } else {
                  parents.push(menu);
                }
                this.getImagePath(menu.app_icon).then(path => {
                  menu.menu_icon_path = path;
                });
              }
            });
            children.forEach(item1 => {
              children.forEach(item2 => {
                if (item1.parent_no === item2.menu_no) {
                  item2['children'].push(item1);
                }
              });
            });
            parents.forEach(parent => {
              children.forEach(child => {
                if (child.parent_no === parent.menu_no) {
                  parent['children'].push(child);
                }
              });
            });
            this.menuData = parents;
            console.log(parents);
            this.successNum = false;
          }
        })
        .catch(err => {
          console.log('err', err);
          if (err.status == 0) {
            setTimeout(this.getMenusList(), 5000);
          }
        });
    },
    onPullDownRefresh() {
      // this.numberlist= this.listhome.length
      let _self = this;
      setTimeout(function() {
        uni.stopPullDownRefresh();
        _self.userInfo = uni.getStorageSync('userInfo');
        _self.getMenusList(_self.appserve);
        _self.getBannerList();
        _self.hotlist('srvzhsq_activity_record_select');
      }, 1000);
    },
    detaile(item, val) {
      uni.navigateTo({
        url: '../sqfw/sqxq?query=' + encodeURIComponent(JSON.stringify(item).replace(/%/g, '%25')) + '&num=1'
      });
    },
    // 获取轮播图路径
    getBannerList() {
      // 获取轮播图编号
      let url = this.$api.select + '/sqfw/select/srvzhsq_activity_record_select';
      let req = {};
      req.serviceName = 'srvzhsq_activity_record_select';
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req['page'] = {
        pageNo: 1,
        rownumber: 5
      };
      this.$http
        .post(url, req)
        .then(res => {
          let picUrlCode = [];
          if (res.data.data && res.data.data instanceof Array) {
            res.data.data.map(item => {
              if (item.activity_img) {
                picUrlCode.push(item.activity_img); // 将获取到的轮播图编号放入picUrlCode中
              }
            });
          }
          if (picUrlCode && picUrlCode instanceof Array) {
            // 通过轮播图编号获取轮播图文件路径
            picUrlCode.map(item => {
              let path = this.$api.select + '/file/download?filePath=';
              let url = this.$api.select + '/file/select/srvfile_attachment_select';
              let req = {
                colNames: ['*'],
                condition: [
                  {
                    colName: 'file_no',
                    ruleType: 'eq',
                    value: item // 轮播图编号
                  }
                ],
                order: null,
                page: null,
                serviceName: 'srvfile_attachment_select'
              };
              this.$http.post(url, req).then(res => {
                console.log(res.data.data);
                let picUrlList = [];
                this.swiperLists.push({ img: path + res.data.data[0].fileurl });
                this.swperboole = false;
                console.log('picUrlList:', picUrlList);
              });
            });
          }
        })
        .catch(err => {
          console.log('err', err);
        });
    },
    //活动列表
    hotlist(serve) {
      let url = this.$api.select + '/sqfw' + '/select/' + serve;
      let req = {};
      req.serviceName = serve;
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      // req.proc_data_type="processed"
      req['page'] = {
        pageNo: 1,
        rownumber: 10
      };
      this.$http
        .post(url, req)
        .then(res => {
          this.xqpage = res.data.data;
          console.log('..................', res.data.data);
          let path = this.$api.select + '/file/download?filePath=';
          let listr = [];
          for (let i in res.data.data) {
            listr.push(res.data.data[i].activity_img);

            let url = this.$api.select + '/file/select/srvfile_attachment_select';
            let req = {
              colNames: ['*'],
              condition: [
                {
                  colName: 'file_no',
                  ruleType: 'eq',
                  value: listr[i] // 图编号
                }
              ],
              order: null,
              page: null,
              serviceName: 'srvfile_attachment_select'
            };
            let phoarr = [];
            this.$http.post(url, req).then(resppo => {
              if (resppo.data && resppo.data.data && resppo.data.data.length > 0) {
                try {
                  this.$set(res.data.data[i], 'activity_img', path + resppo.data.data[0].fileurl);
                } catch (e) {
                  //TODO handle the exception
                  console.log('err', e);
                }
              }
            });
            if (res.data.data[i].activity_img == null) {
              res.data.data[i].activity_img = this.imageURL;
            }
            this.xqpage = res.data.data;
          }
        })
        .catch(err => {
          console.log('err', err);
          if (err.message === '') {
          }
        });
    },
    async getImagePath(imgId) {
      if (imgId) {
        let url = this.$api.select + '/file/select/srvfile_attachment_select';
        let req = {
          colNames: ['*'],
          condition: [
            {
              colName: 'file_no',
              ruleType: 'eq',
              value: imgId // 图片编号
            }
          ],
          serviceName: 'srvfile_attachment_select'
        };
        let res = await this.$http.post(url, req);
        if (res.data.data && res.data.data.length > 0 && res.data.data[0].fileurl) {
          try {
            let path = this.$api.select + '/file/download?filePath=' + res.data.data[0].fileurl;
            return path;
          } catch (e) {
            //TODO handle the exception
            console.log('err:', e);
          }
        }
      } else {
        return '';
      }
    }
  },
  onLoad(option) {
    this.userInfo = uni.getStorageSync('userInfo');
    this.appserve = option.app;
    this.getMenusList(option.app);
    this.getBannerList();
    this.hotlist('srvzhsq_activity_record_select');
  },
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo');
    this.getMenusList(this.appserve);
    this.getBannerList();
    this.hotlist('srvzhsq_activity_record_select');
  }
};
</script>

<style lang="scss">
.wrap {
  width: 100%;
  background: #ffffff;
  .text {
    line-height: 60upx;
  }
}
.banner {
  height: 10vh;
  width: calc(100% - 60upx);
  background-size: cover;
  margin: 0 30upx 10px 30upx;
  border-radius: 5px;
}
.titleall {
  font-size: 15px;
  font-weight: 600;
  border-left: 2px solid red;
  padding-left: 8px;
  margin-left: 30upx;
}
.phopos {
  height: 160upx;
  width: 210upx;
  background-size: cover;
  border-radius: 8px;
}
.hot {
  width: 210upx;
  margin-right: 20upx;
}
.contenthot {
  margin-top: 15upx;
  display: flex;
  margin-left: 30upx;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
}
.textline {
  margin-top: 5px;
  line-height: 18px;
  font-size: 13px;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bannerlun {
  height: 25vh !important;
  overflow: hidden;
}
</style>
