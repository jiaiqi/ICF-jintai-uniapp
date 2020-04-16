<template>
  <view class="content_wrap">
    <view class="px_list">
      <!--  <view class="buttons">
        <view class="title_right title_btn" @tap="toAdd" v-if="showAddButton || showApplyButton"><text class="lg  cuIcon-add "></text></view>
      </view> -->
      <transition name="slide-fade">
        <uni-swipe-action v-if="listData.length > 0 && (title == '社区论坛' || title == '数字城管' || title == '党建论坛'||
                title == '我为社区献一策')" class="cu-list">
          <uni-swipe-action-item :options="options" @click="swipeOptionClick($event, item)" @change="swipeChange" v-for="(item, index) in listData" :key="index">
            <view class="cont">
              <view class="list_item" @tap="toForumDetail(item)">
                <view class="item_title" v-if="item.note_title">{{ item.note_title }}</view>
                <view class="item_title" v-if="item.bt">{{ item.bt }}</view>
                <view class="item_title" v-if="item.pxbt">{{ item.pxbt }}</view>
                <view class="item_title" v-if="item.title">{{ item.title }}</view>
                <view class="item_title" v-if="item.opinion_title">{{ item.opinion_title }}</view>
              </view>
              <view class="data_time">
                <view class="text-grey text-xs">{{ item.create_time.slice(0, 10) }}</view>
                <view class="text-grey text-xs">{{ item.create_time.slice(10) }}</view>
              </view>
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>

        <uni-swipe-action
          v-if="
            listData.length > 0 &&
              (title == '党建培训' ||
                title == '学习心得' ||
                title === '培训安排'  ||
                title == '创投项目' ||
                title == '便民信息' ||
                title == '公租房列表' ||
                title === '廉租房列表' ||
                title == '我的学习心得')
          "
          class="cu-list"
        >
          <uni-swipe-action-item :options="options" @click="swipeOptionClick($event, item)" @change="swipeChange" v-for="(item, index) in listData" :key="index">
            <view class="cont">
              <view class="list_item" @tap="toDetail(item)">
                <view class="item_title" v-if="item.opinion_title">{{ item.opinion_title }}</view>
                <view class="item_title" v-if="item.pxbt">{{ item.pxbt }}</view>
                <view class="item_title" v-if="item.title">{{ item.title }}</view>
                <view class="item_title" v-if="item.xmxx_name">{{ item.xmxx_name }}</view>
                <view class="item_title" v-if="item.opinion_title">{{ item.opinion_title }}</view>
              </view>
              <view class="data_time">
                <view class="text-grey text-xs">{{ item.create_time.slice(0, 10) }}</view>
                <view class="text-grey text-xs">{{ item.create_time.slice(10) }}</view>
              </view>
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>

        <uni-swipe-action
          v-if="
            listData.length > 0 &&
              (title === '社区活动' ||
                title === '社会组织活动' ||
                title === '活动记录' ||
                title == '党建活动' ||
                title == '公示公告' ||
                title == '活动安排' ||
                title == '党建活动记录' ||
                title == '党建活动安排' ||
                title == '公告公示')
          "
          class="cu-list"
        >
          <uni-swipe-action-item :options="options" @click="swipeOptionClick($event, item)" @change="swipeChange" v-for="(item, index) in listData" :key="index">
            <view class="cont">
              <view class="list_item" @tap="detaile(item)">
                <view class="item_title" v-if="item.activity_title">{{ item.activity_title }}</view>
                <view class="item_title" v-if="item.hdbt">{{ item.hdbt }}</view>
                <view class="item_title" v-if="item.bt">{{ item.bt }}</view>
              </view>
              <view class="data_time">
                <view class="text-grey text-xs">{{ item.create_time.slice(0, 10) }}</view>
                <view class="text-grey text-xs">{{ item.create_time.slice(10) }}</view>
              </view>
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>

        <uni-swipe-action v-if="listData.length > 0 && (title == '社会组织' || title == '志愿者组织')" class="cu-list">
          <uni-swipe-action-item
            v-if="item.proc_status == '完成'"
            :options="options"
            @click="swipeOptionClick($event, item)"
            @change="swipeChange"
            v-for="(item, index) in listData"
            :key="index"
          >
            <view class="cont">
              <view class="list_item" @tap="details(item.proc_status, item.zuzhi_name || item.organize_name, item.zuzhi_address || item.address, item.zuzhi_jj || item.remark)">
                <view class="item_title" v-if="item.organize_name">{{ item.organize_name }}</view>
                <view class="item_title" v-if="item.zuzhi_name">{{ item.zuzhi_name }}</view>
              </view>
              <view class="data_time">
                <view :class="item.proc_status == '完成' ? 'colortext' : 'colortext-red'">{{ item.proc_status == '完成' ? '已审批' : '未审批' }}</view>
              </view>
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </transition>
      <mix-load-more :status="loadMoreStatus" class="mix-load-more" @click.native="loadData('refresh')"></mix-load-more>
    </view>
    <view class="kapian" v-if="nodata"><view class="" style="color: #BEBEBE;text-align: center;line-height: 60px;">暂无数据</view></view>
    <view class="xxx"></view>
    <!-- <view
      class="shenhe activity"
      @click="topagexq(serviceNames)"
      v-if="(title === '社区论坛' || title === '党建论坛' || title === '我为社区一献策' || title === '学习心得') && menuAudio > 0"
    >
      待我审核
    </view> -->
    <!-- <uni-fab
      v-if="showFab"
      ref="fab"
      :pattern="fabPattern"
      :content="fabContent"
      :horizontal="fabHorizontal"
      :vertical="fabVertical"
      :direction="fabDdirection"
      @trigger="trigger"
    /> -->
    <!-- <movable-area style="position:absolute;bottom:0; 700upx;height:200upx;margin-right: 50upx;">
      <movable-view :x="x" :y="y" direction="all" @change="onChange" style="width: 100upx;height: 100upx;"> -->
    <uni-fab
      v-if="showFab"
      ref="fab"
      :pattern="fabPattern"
      :content="fabContent"
      :horizontal="fabHorizontal"
      :vertical="fabVertical"
      :direction="fabDdirection"
      @trigger="trigger"
    />
    <!--   </movable-view>
    </movable-area> -->
  </view>
</template>

<script>
import { mapState } from 'vuex';
import uniFab from '@/components/uni-fab/uni-fab.vue';
import mixLoadMore from '@/components/mix-load-more/mix-load-more';
// import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';
export default {
  components: {
    mixLoadMore,
    // uniLoadMore,
    uniIcons,
    uniSwipeAction,
    uniSwipeActionItem,
    uniFab
  },
  data() {
    return {
      x: 0,
      y: 0,
      old: {
        x: 0,
        y: 0
      },
      menuAudio: 0,
      serviceNames: '',
      currentPage: 1, //当前页
      rownumber: 10, //每页条数
      totalListItem: 0, //总条数
      options: [
        //左滑选项
        // {
        //   text: '取消',
        //   style: {
        //     backgroundColor: '#007aff'
        //   }
        // },
        {
          text: '删除',
          style: {
            backgroundColor: '#dd524d'
          }
        }
      ],
      showFab: false, //是否显示悬浮按钮
      fabVertical: 'bottom',
      fabHorizontal: 'right',
      fabDdirection: 'horizontal',
      fabPattern: {
        color: '#e54d42',
        backgroundColor: '#fff',
        selectedColor: '#e54d42',
        buttonColor: '#e54d42'
      },
      fabContent: [
        {
          iconPath: '/static/img/add.png',
          selectedIconPath: '/static/img/add.png',
          text: '发表',
          type: 'add',
          active: false
        },
        {
          iconPath: '/static/img/audit.png',
          selectedIconPath: '/static/img/audit.png',
          text: '审核',
          type: 'audit',
          active: false
        }
      ],
      title: '',
      loadMoreStatus: 1, // 0加载前，1加载中，2没有更多了
      loadText: '',
      columnData: {},
      showAddButton: false,
      showDeleteButton: false,
      showApplyButton: false,
      applyButtonText: '申请',
      deleteButtonText: '删除',
      addButtonText: '新增',
      listData: [],
      nodata: false,
      query: {}, //url携带的参数
      appName: '',
      showParise: false //展示点赞界面
    };
  },
  methods: {
    listDatass() {
      console.log(this.listData);
    },
    onChange: function(e) {
      this.old.x = e.detail.x;
      this.old.y = e.detail.y;
    },
    trigger(e) {
      console.log(e);
      this.fabContent[e.index].active = !e.item.active;
      if (e.item.type === 'add') {
        this.toAdd();
      } else if (e.item.type === 'audit') {
        this.topagexq(this.serviceNames);
      } else if (e.item.type === 'mine') {
        this.toMineArticle();
      }
      // uni.showModal({
      //   title: '提示',
      //   content: `您${this.fabContent[e.index].active ? '选中了' : '取消了'}${e.item.text}`,
      //   success: function(res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定');
      //     } else if (res.cancel) {
      //       console.log('用户点击取消');
      //     }
      //   }
      // });
    },
    switchBtn(hor, ver) {
      if (hor === 0) {
        this.fabdirection = this.direction === 'horizontal' ? 'vertical' : 'horizontal';
        // this.directionStr = this.direction === 'horizontal' ? '垂直' : '水平';
      } else {
        this.fabHorizontal = hor;
        this.fabVertical = ver;
      }
      this.$forceUpdate();
    },
    swipeOptionClick(e, item) {
      //点击左滑选项
      console.log('当前点击的是第' + e.index + '个按钮，点击内容是' + e.content.text);
      if (e.content.text === '删除') {
        this.deleteItem(item);
      } else if (e.content.text === '修改') {
        let initServe = this.serviceNames;
        let initServeArr = initServe.split('_');
        initServeArr[initServeArr.length - 1] = 'update';
        let serviceName = initServeArr.join('_');
        let params = {
          type: 'update',
          condition: [
            {
              colName: 'id',
              ruleType: 'in',
              value: item.id
            }
          ],
          serviceName: serviceName,
          defaultVal: null,
          app: this.query.app_name
        };
        uni.navigateTo({
          url: '../update/update?params=' + JSON.stringify(params)
        });
      }
    },
    swipeChange(open) {
      console.log('是否左滑状态：' + open);
    },
    getMenu(serve, app) {
      let self = this;
      let url = this.$api.select + '/' + app + '/select/' + serve;
      let req = {};
      req.serviceName = serve;
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req.proc_data_type = 'wait';
      console.log('getMenu-------------- ');
      this.$http.post(url, req).then(res => {
        console.log(res);
        this.menuAudio = res.data.data.length;
        // if ((this.title === '社区论坛' || this.title === '党建论坛' || this.title === '我为社区一献策' || this.title === '学习心得') && this.menuAudio > 0) {
        if ((self.title === '社区论坛' || self.title === '党建论坛') && self.menuAudio > 0) {
          self.showFab = true;
          if (self.showAddButton || self.showApplyButton) {
            self.fabContent = [
              {
                iconPath: '/static/img/add.png',
                selectedIconPath: '/static/img/add.png',
                text: '发表',
                type: 'add',
                active: false
              },
              {
                iconPath: '/static/img/audit.png',
                selectedIconPath: '/static/img/audit.png',
                text: '审核',
                type: 'audit',
                active: false
              }
              //  {
              // iconPath: '/static/img/audit.png',
              // selectedIconPath: '/static/img/audit.png',
              // text: '我的',
              // type: 'mine',
              // active: false
              //  }
            ];
          } else {
            self.fabContent = [
              {
                iconPath: '/static/img/audit.png',
                selectedIconPath: '/static/img/audit.png',
                text: '审核',
                type: 'audit',
                active: false
              }
            ];
          }
        } else if (self.title === '我为社区献一策' || self.title === '学习心得' || self.title === '培训安排') {
          self.showFab = true;
          if (self.showAddButton || self.showApplyButton) {
            self.fabContent = [
              {
                iconPath: '/static/img/add.png',
                selectedIconPath: '/static/img/add.png',
                text: '发表',
                type: 'add',
                active: false
              },
              {
                iconPath: '/static/img/audit.png',
                selectedIconPath: '/static/img/audit.png',
                text: '待审核:'+self.menuAudio,
                type: 'audit',
                active: false
              }
            ];
          } else {
            self.fabContent = [
              {
                iconPath: '/static/img/audit.png',
                selectedIconPath: '/static/img/audit.png',
                text: '待审核:'+self.menuAudio,
                type: 'audit',
                active: false
              }
            ];
          }
        } else if (self.title === '数字城管' && self.menuAudio > 0) {
          self.showFab = true;
          self.fabContent = [
            {
              iconPath: '/static/img/add.png',
              selectedIconPath: '/static/img/add.png',
              text: '随手拍',
              type: 'add',
              active: false
            },
            {
              iconPath: '/static/img/audit.png',
              selectedIconPath: '/static/img/audit.png',
              text: '审核',
              type: 'audit',
              active: false
            }
          ];
        } else if (self.title === '创投项目' && self.menuAudio > 0) {
          self.showFab = true;
          self.fabContent = [
            {
              iconPath: '/static/img/add.png',
              selectedIconPath: '/static/img/add.png',
              text: '申请',
              type: 'add',
              active: false
            },
            {
              iconPath: '/static/img/audit.png',
              selectedIconPath: '/static/img/audit.png',
              text: '审核',
              type: 'audit',
              active: false
            }
          ];
        } else if (self.title === '创投项目') {
          self.showFab = true;
          self.fabContent = [
            {
              iconPath: '/static/img/add.png',
              selectedIconPath: '/static/img/add.png',
              text: '申请',
              type: 'add',
              active: false
            }
          ];
        } else if (self.showAddButton || self.showApplyButton) {
          self.showFab = true;
          self.fabContent = [
            {
              iconPath: '/static/img/add.png',
              selectedIconPath: '/static/img/add.png',
              text: '发表',
              type: 'add',
              active: false
            }
          ];
        } else if (self.title === '数字城管') {
          self.showFab = true;
          self.fabContent = [
            {
              iconPath: '/static/img/add.png',
              selectedIconPath: '/static/img/add.png',
              text: '随手拍',
              type: 'add',
              active: false
            }
          ];
        } else if (self.title === '党建活动记录') {
          self.showFab = true;
          self.fabContent = [
            {
              iconPath: '/static/img/add.png',
              selectedIconPath: '/static/img/add.png',
              text: '发表',
              type: 'add',
              active: false
            },
            {
              iconPath: '/static/img/audit.png',
              selectedIconPath: '/static/img/audit.png',
              text: '审核',
              type: 'audit',
              active: false
            }
          ];
        } else {
          self.showFab = false;
        }
      });
    },
    topagexq(val) {
      uni.navigateTo({
        url: '../../audit/auditList?serve=' + val
      });
    },
    toAdd(e) {
      let serviceName = '';
      if (this.query.service_name && this.query.service_name.includes('select')) {
        let query = this.query;
        serviceName = this.query.service_name.replace('select', 'add');
        query.service_name = serviceName;
        if (query.menu_no === 'bxsqlt_sqlt' || query.menu_no === 'bxzhsq_djlt') {
          uni.navigateTo({
            url: '../../forum/add?query=' + encodeURIComponent(JSON.stringify(query))
          });
        } else {
          uni.navigateTo({
            url: '../add/add?query=' + encodeURIComponent(JSON.stringify(query))
          });
        }
      }
      // uni.showModal({
      //   title: '提示',
      //   content: this.title === '社区论坛' ? '点击确定跳转到发帖页面' : this.title === '党建论坛' ? '点击确定跳转到发帖页面' : '点击确定跳转到新增页面',
      //   success: res => {
      //     if (res.confirm) {
      //       let serviceName = '';
      //       if (this.query.service_name && this.query.service_name.includes('select')) {
      //         let query = this.query;
      //         serviceName = this.query.service_name.replace('select', 'add');
      //         query.service_name = serviceName;
      //         if (query.menu_no === 'bxsqlt_sqlt' || query.menu_no === 'bxzhsq_djlt') {
      //           uni.navigateTo({
      //             url: '../../forum/add?query=' + encodeURIComponent(JSON.stringify(query))
      //           });
      //         } else {
      //           uni.navigateTo({
      //             url: '../add/add?query=' + encodeURIComponent(JSON.stringify(query))
      //           });
      //         }
      //       }
      //     } else if (res.cancel) {
      //       return;
      //     }
      //   }
      // });
    },
    /** 查询我发表得帖子*/
    toMineArticle() {
      // let user_no = uni.getStorageSync('userInfo').user_no
      let query = this.query;
      let serviceName = query.service_name;
      let appName = null;
      if (this.title === '社区论坛') {
        appName = 'sqfw';
      } else if (this.title === '党建论坛') {
        appName = 'zhdj';
      }
      uni.navigateTo({
        url: '../../forum/mine?serve=' + encodeURIComponent(serviceName) + '&app=' + encodeURIComponent(appName)
      });
    },
    details(statenum, names, dress, session) {
      console.error('执行存世了');
      uni.setStorage({
        key: 'zuzhi',
        data: {
          names: names,
          dress: dress,
          session: session
        },
        success: function() {
          console.log('success');
        }
      });
      // <!-- 名称  地址  简介-->
      if (statenum !== '完成') {
        statenum = 1;
      } else {
        statenum = 0;
      }
      uni.navigateTo({
        url: '../../shzz/fromtext?state=' + statenum
      });
    },

    toDetail(item) {
      if (this.title === '公租房列表' || this.title === '廉租房列表') {
        uni.navigateTo({
          url: '../../ggfw/fwxq?info=' + encodeURIComponent(JSON.stringify(item)) + '&query=' + encodeURIComponent(JSON.stringify(this.query))
        });
      } else {
        uni.navigateTo({
          url: '../detail/detail?query=' + encodeURIComponent(JSON.stringify(item)) + '&showParise=' + this.showParise
        });
      }
    },
    toForumDetail(item) {
      console.log(item.ftno);
      let no = '';
      if (item.note_no) {
        no = item.note_no;
      } else if (item.ftno) {
        no = item.ftno;
      } else if (item.ssp_no) {
        no = item.ssp_no;
      }else if(item.opinion_no){
        no = item.opinion_no
      }
      uni.navigateTo({
        url: '/pages/forum/detail?no=' + no
      });
    },
    detaile(item) {
      uni.navigateTo({
        url: '../../sqfw/sqxq?query=' + encodeURIComponent(JSON.stringify(item).replace(/%/g, '%25')) + '&showParise=' + this.showParise
      });
    },
    deleteItem(item) {
      uni.showModal({
        title: '提示',
        content: '确定删除?',
        success: res => {
          console.log(item, this.query);
          if (res.confirm) {
            this.toDeleteItem(item).then(res => {
              console.log(res);
              if (res.resultCode === 'SUCCESS') {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                this.loadData('refresh');
              } else {
                uni.showToast({
                  title: res.resultMessage,
                  duration: 2000
                });
              }
            });
          } else if (res.cancel) {
            uni.showToast({
              title: '您点击了取消',
              icon: 'none'
            });
          }
        }
      });
    },
    async toDeleteItem(e) {
      let query = this.query;
      let serviceName = '';
      if (query.service_name.includes('select')) {
        serviceName = query.service_name.replace('select', 'delete');
      } else if (query.service_name.includes('add')) {
        serviceName = query.service_name.replace('add', 'delete');
      } else if (query.service_name.includes('update')) {
        serviceName = query.service_name.replace('update', 'delete');
      }
      let url = this.$api.select + '/' + query.app_name + '/operate/' + serviceName;
      let req = [{ serviceName: serviceName, condition: [{ colName: 'id', ruleType: 'in', value: e.id }] }];
      let res = await this.$http.post(url, req);
      if (res.data) {
        return res.data;
      } else {
        uni.showToast({
          title: '操作失败！',
          duration: 1000
        });
      }
    },
    // 加载数据
    loadData(type) {
      if (type === 'add') {
        if (this.loadMoreStatus === 2) {
          return;
        }
        this.loadMoreStatus = 1;
      }
      let dataList = this.listData;
      setTimeout(() => {
        if (type === 'add') {
          this.currentPage += 1;
          this.getListData(this.query).then(data => {
            console.log(data);
            if (data && data.length < 10) {
              this.loadMoreStatus = 2;
            } else if (!data) {
              this.loadMoreStatus = 2;
            } else {
              this.loadMoreStatus = 0;
            }
            if (data && data.length > 0) {
              // this.loadMoreStatus = 0;
              this.listData = this.listData.concat(data);
            }
          });
        } else if (type === 'refresh') {
          this.loadMoreStatus = 1;
          this.listData = [];
          this.currentPage = 1;
          this.getListData(this.query).then(data => {
            if (data && data.length < 10) {
              this.loadMoreStatus = 2;
            } else if (!data) {
              this.loadMoreStatus = 2;
            } else {
              this.loadMoreStatus = 0;
            }
            if (data && data.length > 0) {
              this.listData = this.listData.concat(data);
            }
          });
          uni.stopPullDownRefresh();
        }
      }, 1000);
    },
    //下拉刷新
    onPullDownRefresh() {
      this.loadData('refresh');
    },
    onReachBottom() {
      //上滑加载
      this.loadData('add');
    },
    async getListData(query) {
      // 获取列表数据
      if (query) {
        this.loadMoreStatus = 1;
        this.query = query;
        let serviceName = query.service_name?query.service_name:query.selectServiceName;
        this.serviceNames = query.service_name?query.service_name:query.selectServiceName;
        if (
          serviceName == 'srvzhsq_djlt_ftxx_select' ||
          serviceName == 'srvzhsq_djhdjl_djhd_select' ||
          serviceName == 'srvzhsq_xxxd_select' ||
          serviceName == 'srvzhsq_pxap_select'
        ) {
          this.getMenu(serviceName, 'zhdj');
        } else if (
          serviceName == 'srvzhsq_forum_note_select' ||
          serviceName === 'srvzhsq_forum_note_list_num_select' ||
          serviceName === 'srvzhsq_bmfw_ssp_select' ||
          serviceName === 'srvzhsq_bmfw_xmxx_select'
        ) {
          this.getMenu(serviceName, 'sqfw');
        }
		console.log(serviceName,'*****************')
        if (serviceName&&serviceName.includes('add')) {
          serviceName = serviceName.replace('add', 'select');
        }
        if (serviceName === 'srvzhsq_bmfw_ssp_select') {
          this.showParise = true;
        }
        let url = this.$api.select + '/' + query.app_name + '/select/' + serviceName;
        let req = {
          serviceName: serviceName,
          colNames: ['*'],
          condition: [],
          page: { pageNo: this.currentPage, rownumber: this.rownumber },
          order: [{ colName: 'create_time', orderType: 'desc' }]
        };
        let mod;
        if (
          this.title === '党建论坛' ||
          this.title === '社区论坛' ||
          this.title === '志愿者组织' ||
          this.title === '社会组织' ||
          this.title === '学习心得' ||
          this.title === '我为社区献一策' ||
          this.title === '党建活动记录' ||
          this.title === '创投项目' ||
          this.title === '加入志愿者' ||
          this.title === '数字城管'||this.serviceNames==='srvzhsq_activity_arrange_select'||this.serviceNames==='srvzhsq_tenement_gzfxx_select'||this.serviceNames==='srvzhsq_tenement_lzfxx_select'
        ) {
          // 如果是流程列表，过滤掉未完成的
          req.condition = [{ colName: 'proc_status', value: '完成', ruleType: 'eq' }];
        }
        if (this.title === '党建活动安排') {
          req['proc_data_type'] = 'processed';
        }
        // if (this.title === '社区论坛') {
        // 	let obj = {}
        //   req['proc_data_type'] = 'processed';
        // }
        let res = await this.$http.post(url, req);
        uni.stopPullDownRefresh();
        if (res.data.data && res.data.data.length > 0) {
          if (res.data.page) {
            let page = res.data.page;
            this.totalListItem = page.total;
          }
          return res.data.data;
        } else if (res.data.data.length == 0 && this.listData.length == 0) {
          this.nodata = true;
        }
      }
    },
    async getColumnsData(app = 'sqfw', service_name, use_type = 'proclist') {
      //获取字段信息
      let url = this.$api.select + '/' + app + '/select/srvsys_service_columnex_v2_select ';
      let req = {
        serviceName: 'srvsys_service_columnex_v2_select',
        colNames: ['*'],
        condition: [{ colName: 'service_name', value: service_name, ruleType: 'eq' }, { colName: 'use_type', value: use_type, ruleType: 'eq' }],
        order: [{ colName: 'seq', orderType: 'asc' }]
      };
      let res = await this.$http.post(url, req);
      if (res.data.data) {
        let cols = res.data.data;
        return cols;
      }
    },
    initPages(options) {
      let self = this;
      let query = {};
      if (options.query || options.data) {
        query = JSON.parse(options.query ? decodeURIComponent(options.query) : options.data ? decodeURIComponent(options.data) : []);
        console.log('query,qieur.label', query, query.label);
        let app = query.app;
        // if (query.menu_url) {
        //   console.log(query.menu_url);
        //   app = query.menu_url.match(/menuapp=(\S*)/)[1].split('&')[0];
        // }
        query.app_name = app;
        console.log('app', app, query.menu_url);
        this.query = query;
        if (query.label == '我的学习心得') {
          // options
          let stys = {
            text: '修改',
            style: {
              backgroundColor: '#007aff'
            }
          };
          this.options.push(stys);
        }
        this.app = app;
        this.title = query.label;
        console.log(query.label, '--------------');
        // this.getListData(query);
        // this.loadData('refresh');
        let type = 'list';
        if (query.menu_url&&(query.menu_url.includes('proc') || query.menu_no === 'bxzhsq_djlt' || query.menu_no === 'bxsqlt_sqlt' || query.label === '学习心得')) {
          type = 'proclist';
        }
        this.loadData('refresh');
        this.getColumnsData(app, query.service_name?query.service_name:query.selectServiceName, type)
          .then(cols => {
            console.log('cols----------', cols);
            self.columnData = cols;
            if (cols&&cols.gridButton) {
              cols.gridButton.map(btn => {
                if (btn.permission == true && btn.button_type === 'add') {
                  self.showAddButton = true;
                  self.addButtonText = btn.button_name;
                }
                if (btn.permission == true && btn.button_type === 'batch_delete') {
                  self.showDeleteButton = true;
                  self.deleteButtonText = btn.button_name;
                }
                if (btn.permission == true && btn.button_type === 'apply') {
                  self.showApplyButton = true;
                  self.applyButtonText = btn.button_name;
                }
              });
            }
          })
          .then(() => {
            uni.setNavigationBarTitle({
              title: this.title ? this.title : '列表'
            });
            console.log('title：', this.title);
            uni.setStorage({
              key: 'homeMessage',
              data: {
                homename: this.title
              }
            });
          });
      }
    },
    onNavigationBarButtonTap(e) {
      // 监测导航栏点击事件
      console.log(e);
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  },
  onLoad(options) {
    this.initPages(options);
  }
};
</script>

<style lang="scss">
.movable-view {
  width: 100%;
  height: 100%;
}
.content_wrap {
  width: 100%;
  height: 100%;
  padding-top: 20upx;
  position: relative;
  display: flex;
  flex-direction: column;
}
.uni-swipe {
  overflow: hidden;
  border-radius: 10upx;
  margin: 0 20upx 20upx;
}
.cont {
  width: 100%;
  display: flex;
  height: 120upx;
  align-items: center;
  border-bottom: 1px solid #efefef;
}
.kapian {
  box-shadow: 0 0 26px 0 rgba(0, 0, 0, 0.12);
  margin: 8px 0;
  padding: 8px;
  margin: 0 40upx;
}
.shenhe {
  z-index: 99;
  position: fixed;
  bottom: 0;
  text-align: center;
  width: 100%;
  line-height: 80upx;
  background-color: #007aff;
  color: #fff;
}
.xxx {
  height: 100upx;
}
.px_list {
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: 30upx;
  border-radius: 10upx;
  overflow: scroll;
  .list_title {
    box-shadow: 0 0 26px 0 rgba(0, 0, 0, 0.15);
    width: 90%;
    margin: 30upx auto;
    text-align: center;
    .title_left {
      text-indent: 0.5rem;
      font-size: 50upx;
      font-weight: 600;
      margin: 20upx 0;
    }
  }
  .buttons {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 150upx;
    // width: 100%;
    left: calc(50% - 50upx);
    z-index: 99;
    .title_btn {
      border-radius: 50%;
      box-shadow: 0 0 26px 0 rgba(255, 0, 0, 0.15);
      width: 100upx;
      height: 100upx;
      line-height: 100upx;
      text-align: center;
      background-color: #e54d42;
      color: #ffffff;
      font-size: 80upx;
    }
  }
  .list_item {
    flex: 1;
    max-width: 75%;
    display: flex;
    .item_title {
      text-indent: 1rem;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 60upx;
    }
  }
  .data_time {
    min-width: 25%;
    text-align: right;
    padding-right: 30upx;
  }
  .list_content {
    flex: 1;
    width: 90%;
    margin: 0 auto;
    padding-top: 20upx;
    overflow: hidden;
    min-height: 140upx;
    // max-height: 300upx;
    .list_item {
      width: 100%;
      border-bottom: 1px #f5f5f5 solid;
      padding-top: 8upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item_title {
        max-width: 70%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 60upx;
      }
      .item_date {
        font-size: 12px;
        color: #999;
        line-height: 60upx;
      }
    }
  }
  .list_bottom {
    display: flex;
    justify-content: flex-end;
    width: 90%;
    height: 100upx;
    align-items: center;
    margin: 0 auto;
    .btn {
      color: #e51c23;
      font-size: 14px;
      line-height: 60upx;
      height: 60upx;
    }
  }
}

// .loadAnimation {
//   width: 90%;
//   margin: 0 auto;
//   padding-top: 20upx;
//   overflow: hidden;
//   min-height: 140upx;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   .loadAnimItem {
//     width: 100%;
//     display: flex;
//     padding-top: 8upx;
//     border-bottom: 1px #f5f5f5 solid;
//     align-items: center;
//     height: 120upx;
//     .loadAnimContent {
//       box-sizing: border-box;
//       margin: 10upx 0;
//       width: 100%;
//       height: 40upx;
//       background-color: rgba(150, 150, 150, 0.1);
//       height: 40upx;
//     }
//   }
//   .loadAnimItem:nth-child(n) .loadAnimContent {
//     animation: loading 4s linear 0s infinite;
//   }
//   .loadAnimItem:nth-child(2n) .loadAnimContent {
//     animation: loading 3s linear 0s infinite;
//   }
// }
// @keyframes loading {
//   0% {
//     width: 0%;
//   }
//   50% {
//     width: 100%;
//   }
//   100% {
//     width: 0%;
//   }
// }

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 2s ease;
}
.slide-fade-leave-active {
  transition: all 2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter
/* .slide-fade-leave-active for below version 2.1.8 */ {
  // transform: translateY(-1000px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(1000px);
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 3s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(100px);
}
.colortext {
  font-size: 12px;
  color: green;
  line-height: 60upx;
}
.colortext-red {
  font-size: 12px;
  color: red;
  line-height: 60upx;
}
.nodata {
  width: 100%;
  min-height: 500upx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
