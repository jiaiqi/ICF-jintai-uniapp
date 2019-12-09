<template>
  <view class="content_wrap">
    <view class="px_list">
      <view class="list_title">
        <view class="title_left">{{ title }}</view>
        <view class="title_right" @tap="toAdd" v-if="showAddButton"><button class="title_btn">添加</button></view>
        <view class="title_right" @tap="toAdd" v-if="showApplyButton"><button class="title_btn">申请</button></view>
      </view>
      <view class="loadAnimation" v-if="listData.length < 1 && !nodata">
        <view class="loadAnimItem" v-for="i in 14" :key="i"><view class="loadAnimContent"></view></view>
      </view>
      <view class="loadAnimation" v-if="listData.length < 1 && nodata">暂无数据</view>
      <transition name="slide-fade">
        <view class="list_content" v-if="listData.length > 0 && (title == '党建培训' || title == '学习心得' || title === '培训安排')">
          <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="toDetail(item)">
            <view class="item_title" v-if="item.pxbt">{{ item.pxbt }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>
        <view class="list_content" v-if="listData.length > 0 && (title == '便民信息' || title == '数字城管')">
          <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="toDetail(item)">
            <view class="item_title" v-if="item.title">{{ item.title }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>
        <view class="list_content" v-if="listData.length > 0 && title == '创投项目'">
          <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="toDetail(item)">
            <view class="item_title" v-if="item.xmxx_name">{{ item.xmxx_name }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>
        <scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-left="120">
          <view class="cu-list menu-avatar">
            <view
              class="cu-item"
              :class="modalName == 'move-box-' + index ? 'move-cur' : ''"
              v-for="(item, index) in listData"
              :key="index"
              @touchstart="ListTouchStart"
              @touchmove="ListTouchMove"
              @touchend="ListTouchEnd"
              :data-target="'move-box-' + index"
            >
              <view class="list_item" @tap="toForumDetail(item)">
                <view class="item_title" v-if="item.note_title">{{ item.note_title }}</view>
              </view>
              <view class="data_time">
                <view class="text-grey text-xs">{{ item.create_time.slice(0, 10) }}</view>
                <view class="text-grey text-xs">{{ item.create_time.slice(10) }}</view>
              </view>
              <view class="move" v-if="showDeleteButton">
                <!-- <view class="bg-grey" >置顶</view> -->
                <view class="bg-red" @tap="deleteItem(item)" >删除</view>
              </view>
            </view>
          </view>
          <!--  <view class="list_content" v-if="listData.length > 0 && title == '社区论坛'">
            <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="toForumDetail(item)">
              <view class="item_title" v-if="item.note_title">{{ item.note_title }}</view>
              <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
            </view>
          </view> -->
        </scroll-view>

        <view class="list_content" v-if="listData.length > 0 && title == '我为社区献策'">
          <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="toDetail(item)">
            <view class="item_title" v-if="item.opinion_title">{{ item.opinion_title }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>

        <view class="list_content" v-if="listData.length > 0 && title == '公告公示'">
          <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="detaile(item)">
            <view class="item_title" v-if="item.bt">{{ item.bt }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>

        <view class="list_content" v-if="listData.length > 0 && title == '党建活动记录'">
          <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="detaile(item)">
            <view class="item_title" v-if="item.hdbt">{{ item.hdbt }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>

        <view class="list_content" v-if="listData.length > 0 && title == '党建论坛'">
          <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="detaile(item)">
            <view class="item_title" v-if="item.bt">{{ item.bt }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>

        <view class="list_content" v-if="listData.length > 0 && (title === '社区活动' || title === '社会组织活动')">
          <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="detaile(item)">
            <view class="item_title" v-if="item.activity_title">{{ item.activity_title }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>

        <view class="list_content" v-if="listData.length > 0 && title == '活动安排'">
          <view class="list_item" v-for="(item, index) in listData" :key="index" @tap="detaile(item)">
            <view class="item_title" v-if="item.activity_title">{{ item.activity_title }}</view>
            <view class="item_date">{{ item.create_time.slice(0, 10) }}</view>
          </view>
        </view>

        <view class="list_content" v-if="listData.length > 0 && title == '社会组织'">
          <view
            class="list_item"
            v-for="(item, index) in listData"
            :key="index"
            @click="details(item.proc_status, item.zuzhi_name || item.organize_name, item.zuzhi_address || item.address, item.zuzhi_jj || item.remark)"
          >
            <view class="item_title" v-if="item.organize_name">{{ item.organize_name }}</view>
            <view :class="item.proc_status == '完成' ? 'colortext' : 'colortext-red'">{{ item.proc_status == '完成' ? '已审批' : '未审批' }}</view>
          </view>
        </view>
        <view class="list_content" v-if="listData.length > 0 && title == '志愿者组织'">
          <view
            class="list_item"
            v-for="(item, index) in listData"
            :key="index"
            @click="details(item.proc_status, item.zuzhi_name || item.organize_name, item.zuzhi_address || item.address, item.zuzhi_jj || item.remark)"
          >
            <view class="item_title" v-if="item.zuzhi_name">{{ item.zuzhi_name }}</view>
            <view :class="item.proc_status == '完成' ? 'colortext' : 'colortext-red'">{{ item.proc_status == '完成' ? '已审批' : '未审批' }}</view>
          </view>
        </view>
      </transition>
      <view>{{ loadText }}</view>
      <view class="list_bottom" v-if="listData && listData.length >= 14">
        <button class="btn" @click="previousPage()" :disabled="currentPage <= 1">上一页</button>
        <button class="btn" @click="nextPage()">下一页</button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      currentPage: 1,
      title: '',
      loadText: '',
      columnData: {},
      showAddButton: false,
      showDeleteButton: false,
      showApplyButton: false,
      modalName: null,
      listTouchStart: 0,
      selectList: [
        {
          serviceName: 'srvzhsq_pxap_select', // 党建培训查询
          title: '党建培训',
          appType: 'zhdj',
          pageType: 'add',
          resDatas: []
        },
        {
          serviceName: 'srvzhsq_xxxd_select', // 学习心得查询
          title: '学习心得',
          appType: 'zhdj',
          pageType: 'add',
          resDatas: []
        },
        {
          serviceName: 'srvzhsq_bmfw_infomation_select', // 便民信息查询
          title: '便民信息',
          appType: 'sqfw',
          pageType: 'select',
          resDatas: []
        }
      ],
      listData: [],
      nodata: false,
      query: {}, //url携带的参数
      appName: ''
    };
  },
  methods: {
    // ListTouch触摸开始
    ListTouchStart(e) {
      this.listTouchStart = e.touches[0].pageX;
    },

    // ListTouch计算方向
    ListTouchMove(e) {
      this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left';
    },

    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.listTouchDirection == 'left') {
        this.modalName = e.currentTarget.dataset.target;
      } else {
        this.modalName = null;
      }
      this.listTouchDirection = null;
    },
    toAdd(e) {
      let serviceName = '';
      if (this.query.service_name && this.query.service_name.includes('select')) {
        let query = this.query;
        serviceName = this.query.service_name.replace('select', 'add');
        query.service_name = serviceName;
        console.log('--------------------\n', query);
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
    },
    details(statenum, names, dress, session) {
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
    getPxList() {
      let self = this;
      let url = this.$api.select + '/' + this.selectList[0].appType + '/select/' + this.selectList[0].serviceName;
      let req = {};
      req.serviceName = this.selectList[0].serviceName;
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req['page'] = {
        pageNo: this.currentPage,
        rownumber: 14
      };
      this.$http.post(url, req).then(res => {
        if (res.data.data.length > 0) {
          self.selectList[0].resDatas = res.data.data;
          self.listData = res.data.data;
        } else if (res.data.data < req.page.rownumber) {
          this.loadText = '所有数据加载完毕';
        }
      });
    },
    getXdList(no) {
      let self = this;
      let url = this.$api.select + '/' + this.selectList[1].appType + '/select/' + this.selectList[1].serviceName;
      let req = {};
      req.serviceName = this.selectList[1].serviceName;
      req.colNames = ['*'];
      req.condition = [];
      req.order = [];
      req['page'] = {
        pageNo: this.currentPage,
        rownumber: 10
      };
      this.$http.post(url, req).then(res => {
        if (res.data.data.length > 0) {
          self.selectList[1].resDatas = res.data.data;
          self.listData = res.data.data;
        } else {
          return;
        }
      });
    },
    getBmList(serviceName, column_no, parent_no) {
      // 获取便民信息列表
      let url = this.$api.select + '/' + 'sqfw' + '/select/' + serviceName;
      let req = { serviceName: serviceName, colNames: ['*'], condition: [], page: { pageNo: this.currentPage, rownumber: 10 }, order: [] };
      if (serviceName === 'srvzhsq_bmfw_ssp_select' || serviceName === 'srvzhsq_forum_opinion_select') {
        req.proc_data_type = 'myall';
      }
      if (column_no) {
        req.condition = [
          // {colName: "parent_no", ruleType: "eq", value: parent_no},
          { colName: 'note_column', ruleType: 'eq', value: column_no }
        ];
      }
      this.$http.post(url, req).then(res => {
        if (res.data.data && res.data.data.length > 0) {
          // self.selectList[2].resDatas = res.data.data;
          this.listData = res.data.data;
          console.log(this.listData);
        } else {
          setTimeout(() => {
            this.nodata = true;
          }, 2000);
          return;
        }
      });
    },
    toDetail(item) {
      uni.navigateTo({
        url: '../detail/detail?query=' + encodeURIComponent(JSON.stringify(item))
      });
    },
    toForumDetail(item) {
      console.log(JSON.stringify(item));
      uni.navigateTo({
        url: '../../forum/detail?no=' + item.note_no
      });
    },
    deleteItem(item) {
      uni.showModal({
        title: '提示',
        content: '确定删除此条帖子?',
        success: res => {
          console.log(item, this.query);
          if (res.confirm) {
            this.toDeleteItem(item).then(res=>{
              console.log(res)
              if(res.resultCode==="SUCCESS"){
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                this.getListData(this.query)
              }else{
                uni.showToast({
                  title:res.resultMessage,
                  duration:2000
                })
                }
            })
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
      let url = this.$api.select + '/'+query.app_name+'/operate/'+ serviceName
      let req = [{ serviceName: serviceName, condition: [{ colName: 'id', ruleType: 'in', value: e.id }] }];
      let res = await this.$http.post(url, req)
      
      if(res.data){
        return res.data
      }
    },
    detaile(item) {
      uni.navigateTo({
        url: '../../sqfw/sqxq?query=' + encodeURIComponent(JSON.stringify(item).replace(/%/g, '%25'))
      });
    },
    nextPage() {
      this.currentPage++;
      if (this.title === '学习心得') {
        this.getXdList();
      } else if (this.title === '培训安排') {
        this.getPxList();
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        if (this.title === '学习心得') {
          this.getXdList();
        } else if (this.title === '培训安排') {
          this.getPxList();
        } else if (this.title === '便民信息') {
          this.getBmList('srvzhsq_bmfw_infomation_select');
        }
      }
    },
    getHmLists(serviceName) {
      let url = this.$api.select + '/' + 'zhdj' + '/select/' + serviceName;
      let req = { serviceName: serviceName, colNames: ['*'], condition: [], page: { pageNo: this.currentPage, rownumber: 14 }, order: [] };
      this.$http.post(url, req).then(res => {
        if (res.data.data.length > 0) {
          this.listData = res.data.data;
        } else {
          return;
        }
      });
    },
    getDmLists(serviceName) {
      let url = this.$api.select + '/' + 'zhdj' + '/select/' + serviceName;
      let req = { serviceName: serviceName, colNames: ['*'], condition: [], page: { pageNo: this.currentPage, rownumber: 14 }, order: [] };
      this.$http.post(url, req).then(res => {
        if (res.data.data.length > 0) {
          this.listData = res.data.data;
        } else {
          return;
        }
      });
    },
    getWmLists(serviceName) {
      let url = this.$api.select + '/' + 'sqfw' + '/select/' + serviceName;
      let req = { serviceName: serviceName, colNames: ['*'], condition: [], page: { pageNo: this.currentPage, rownumber: 14 }, order: [] };
      this.$http.post(url, req).then(res => {
        if (res.data.data.length > 0) {
          this.listData = res.data.data;
          console.error(this.listData);
        } else {
          return;
        }
      });
    },
    getDmListsdata(serviceName) {
      let url = this.$api.select + '/' + 'sqfw' + '/select/' + serviceName;
      let req = { serviceName: serviceName, colNames: ['*'], condition: [], page: { pageNo: this.currentPage, rownumber: 14 }, order: [] };
      this.$http.post(url, req).then(res => {
        if (res.data.data.length > 0) {
          this.listData = res.data.data;
          console.error(this.listData);
        } else {
          return;
        }
      });
    },
    getDmListsdatalisr(serviceName) {
      let url = this.$api.select + '/' + 'sqfw' + '/select/' + serviceName;
      let req = { serviceName: serviceName, colNames: ['*'], condition: [], page: { pageNo: this.currentPage, rownumber: 14 }, order: [] };
      this.$http.post(url, req).then(res => {
        if (res.data.data.length > 0) {
          this.listData = res.data.data;
          console.error(this.listData);
        } else {
          return;
        }
      });
    },
    getListData(query) {
      // 获取列表数据
      if (query) {
        console.log('query:', query);
        this.query = query;
        let url = this.$api.select + '/' + query.app_name + '/select/' + query.service_name;
        let req = { serviceName: query.service_name, colNames: ['*'], condition: [], page: { pageNo: this.currentPage, rownumber: 14 }, order: [] };
        if (query.menu_url.includes('proc')) {
          req.proc_data_type = 'myall';
        }
        this.$http.post(url, req).then(res => {
          if (res.data.data && res.data.data.length > 0) {
            this.listData = res.data.data;
          } else {
            this.nodata = true;
          }
        });
      }
    },
    async getColumnsData(app = 'sqfw', service_name, use_type = 'add') {
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
    }
  },
  onLoad(options) {
    let query = {};
    if (options.query || options.data) {
      query = JSON.parse(options.query ? options.query : options.data ? options.data : []);
      console.log('query,qieur.label', query, query.label);
      const app = query.menu_url.match(/menuapp=(\S*)/)[1].split('&')[0];
      query.app_name = app;
      console.log('app', app, query.menu_url);
      this.query = query;
      this.app = app;
      this.title = query.label;
      this.getListData(query);
      this.getColumnsData(app, query.service_name, query.menu_url.includes('proc') ? 'proclist' : 'list')
        .then(cols => {
          console.log('cols', cols);
          this.columnData = cols;
          if (cols.gridButton) {
            cols.gridButton.map(btn => {
              if (btn.permission == true && btn.button_type === 'add') {
                this.showAddButton = true;
              }
              if (btn.permission == true && btn.button_type === "batch_delete") {
                this.showDeleteButton = true;
              }
              if (btn.permission == true && btn.button_type === 'apply') {
                this.showApplyButton = true;
              }
            });
          }
        })
        .then(() => {
          uni.setNavigationBarTitle({
            title: this.title ? this.title : '列表'
          });
        });
    } else if (options.to == 'xxxd') {
      this.getXdList();
      this.title = '学习心得';
    } else if (options.to === 'pxap') {
      this.getPxList();
      this.title = '培训安排';
    } else if (options.to === 'bmxx') {
      this.getBmList('srvzhsq_bmfw_infomation_select');
      this.title = '便民信息';
    } else if (options.to === 'ctxm') {
      // 创投项目
      this.getBmList('srvzhsq_bmfw_xmxx_select');
      this.title = '创投项目';
    } else if (options.to === 'szcg') {
      // 数字城管
      this.getBmList('srvzhsq_bmfw_ssp_select');
      this.title = '数字城管';
    } else if (options.to === 'sqlt') {
      // 社区论坛
      if (options.column_no && options.parent_no) {
        this.getBmList('srvzhsq_forum_note_select', options.column_no, options.parent_no);
      } else {
        this.getBmList('srvzhsq_forum_note_select');
      }
      this.title = '社区论坛';
    } else if (options.to === 'sqxc') {
      // 社区献策
      this.getBmList('srvzhsq_forum_opinion_select');
      this.title = '社区献策';
    } else if (options.to === 'gggg') {
      //公告公示
      this.getHmLists('srvzhsq_gsgg_select');
      this.title = '公告公示';
    } else if (options.to === 'djjl') {
      //党建活动记录D
      this.getDmLists('srvzhsq_djhdjl_djhd_select');
      this.title = '党建活动记录';
    } else if (options.to === 'sqhd') {
      //社区活动D
      this.getWmLists('srvzhsq_activity_record_select');
      this.title = '社区活动';
    } else if (options.to === 'djlt') {
      //党建论坛D
      this.getDmLists('srvzhsq_djlt_ftxx_select');
      hdap;
      this.title = '党建论坛';
    } else if (options.to === 'hdap') {
      //党建论坛D
      this.getDmListsdata('srvzhsq_activity_arrange_select');
      this.title = '活动安排';
    } else if (options.to === 'shzzlist') {
      //社会组织
      this.getDmListsdatalisr('srvzhsq_social_organizie_select');
      this.title = '社会组织';
    } else if (options.to === 'zyzzz') {
      //社会组织
      this.getDmListsdatalisr('srvzhsq_zyz_zuzhi_select');
      this.title = '志愿者组织';
    }
    // uni.setNavigationBarTitle({
    //   title: this.title
    // });
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
  .content_wrap{
    width: 100%;
    background-color: #fff;
  }
.px_list {
  // background-color: #fff;
  box-sizing: border-box;
  padding-top: 30upx;
  display: flex;
  flex-direction: column;
  font-size: 30upx;
  border-radius: 10upx;
  overflow: scroll;
  .list_title {
    width: 100%;
    padding: 0 30upx 50upx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    .title_left {
      text-indent: 0.5rem;
      border-left: 5upx solid #e51c23;
      font-size: 30upx;
      font-weight: 600;
      margin: 20upx 0;
    }
    .title_right {
      display: flex;
      align-items: center;
      .title_btn {
        width: 120upx;
        height: 50upx;
        line-height: 50upx;
        margin: 0;
        background-color: #e54d42;
        color: #ffffff;
        font-size: 30upx;
      }
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

.loadAnimation {
  width: 90%;
  margin: 0 auto;
  padding-top: 20upx;
  overflow: hidden;
  min-height: 140upx;
  // max-height: 280upx;
  .loadAnimItem {
    width: 100%;
    display: flex;
    padding-top: 8upx;
    border-bottom: 1px #f5f5f5 solid;
    align-items: center;
    height: 60upx;
    .loadAnimContent {
      box-sizing: border-box;
      margin: 10upx 0;
      width: 100%;
      height: 40upx;
      background-color: rgba(150, 150, 150, 0.1);
      height: 40upx;
    }
  }
  .loadAnimItem:nth-child(n) .loadAnimContent {
    animation: loading 4s linear 0s infinite;
  }
  .loadAnimItem:nth-child(2n) .loadAnimContent {
    animation: loading 3s linear 0s infinite;
  }
}
@keyframes loading {
  0% {
    width: 0%;
  }
  50% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transition: all 2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(100px);
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
</style>
