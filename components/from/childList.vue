<template>
  <div class="childlistView">
    <group>
      <group-title slot="title">{{this.childService.service_view_name}}
        <div style="float:right;">
        <x-button  v-if="this.childService._foreignKey.child_table_readonly === '否'" @click.native="toChildList" mini plain type="primary"> 编辑 </x-button>
        <x-button style="" 
        v-for="(item,index) in gridBtns" 
        :key="index"  
        @click.native="toChildList" mini plain type="primary"> {{item.button_name}} </x-button>
        </div>
        <span style="color:#03A9F4;border:1px solid #03A9F4;padding:0 2px;" v-if="isTree">tree</span>
        </group-title>
      <div class="bx-list-panl">
        <!-- <div class="bx-list-view" style="padding:6px;" v-for="(item,index) in listData.list" :key="index" @click.native="pageType === 'procDetail' ?  toNewDetail(item.key,item.title.value) : toDetail(item.key,item.title.value)">  -->
        <div class="bx-list-view" style="padding:6px;" v-for="(item,index) in listData.list" :key="index" @click.stop="pageType === 'procDetailtoDetail' ? toNewDetail(item.key,item.title.value) :toDetail(item.key,item.title.value)"> 
          <!-- {{item.id}} -->
          <flexbox :gutter="2"  class="bx-item-flex-view">
            <flexbox-item v-if="item.src !== '' && item.src !== undefined" class="bx-item-flex-img" style="max-width:65px;"> <img width="60px" :src="item.src" alt="" class="weui-media-box__thumb"></flexbox-item>
            <flexbox-item >
              <flexbox :gutter="2" wrap="wrap" class="bx-item-flex-header">
                <flexbox-item :span="7/10">
                  <span class="">{{item.title.value}}</span>
                </flexbox-item>
                <flexbox-item style="text-align:right;" v-if="item.title.label !== ''">
                  <badge v-if="item.title.label" :text="item.title.label" style=""></badge>
                </flexbox-item>
              </flexbox>
              <flexbox :gutter="2" wrap="wrap"  class="bx-item-flex-content" v-for="(item,index) in item.content" :key="index">
                <flexbox-item v-for="(item,index) in item" :key="index">
                  <span :class="item.color" v-if="item.label !== ''" class="item-center-label">{{item.label}}:</span><span>{{item.value}}</span>
                </flexbox-item>
              </flexbox>
              <flexbox :gutter="2" wrap="wrap" class="bx-item-flex-content">
                <flexbox-item :span="7/10" style="text-align:left">
                  <span v-if="item.footer.columns.label !== ''" class="item-center-label">{{item.footer.columns.label}}:</span>
                  <span>{{item.footer.columns.value}}</span>
                </flexbox-item>
              </flexbox>
              <flexbox :gutter="2" wrap="wrap" class="bx-item-flex-footer">
                <flexbox-item class="bx-cell-btns">
                    <span  v-for="(data,index) in item.footerBtns" 
                    :key="index" 
                    v-if="getDispExp(data, item.data)" 
                    :class="data.button_type === 'delete' ? 'color-danger' : 'color-primary'"  
                    v-on:click.stop="onFooterBtn({buttonType:data,data:item})">{{data.button_name}}</span>
                  <span class="color-primary">{{item.footer.linkText}}</span>
                </flexbox-item>
              </flexbox>
            </flexbox-item>
          </flexbox>
        </div> 
        <load-more v-show="listData.list.length === 0" :show-loading="false" :tip="'暂无数据'" background-color="#fbf9fe"></load-more>
        <div v-if="listData.list.length > 0" slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
            <span v-show="status.pullupStatus === 'default'"></span>
            <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
            <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
        </div>
        
        <div v-transfer-dom>
          <popup v-model="showSearchView" class="checker-popup" position="right" :hide-on-blur=true width="80%" height="-120">
            <div style="padding:10px;min-height:100vh">
              <!-- <p style="padding: 5px 5px 5px 2px;color:#888;">请选择查询条件</p> -->
                <searchViewa v-if="query.length>0" :pathQuery="query" ref="searchView"></searchViewa>
              <div style="padding-top: 15px;">
                <flexbox>
                  <flexbox-item>
                    <x-button @click.native="hideSearchView" type="default"> 取消 </x-button>
                  </flexbox-item>
                  <flexbox-item>
                    <x-button @click.native="onReset" type="warn"> 重置 </x-button>
                  </flexbox-item>
                  <flexbox-item>
                    <x-button @click.native="onSearch" type="primary"> 确定 </x-button>
                  </flexbox-item>
                </flexbox>
              </div>
            </div>
          </popup>
          <!-- <popup v-model="showChildAddPage" class="checker-popup" position="right" :hide-on-blur=true width="80%" height="-120">
            <div style="padding:10px;min-height:100vh">
                <searchViewa v-if="query.length>0" :pathQuery="query" ref="searchView"></searchViewa>
              <div style="padding-top: 15px;">
                <flexbox>
                  <flexbox-item>
                    <x-button @click.native="hideSearchView" type="default"> 取消 </x-button>
                  </flexbox-item>
                  <flexbox-item>
                    <x-button @click.native="onReset" type="warn"> 重置 </x-button>
                  </flexbox-item>
                  <flexbox-item>
                    <x-button @click.native="onSearch" type="primary"> 确定 </x-button>
                  </flexbox-item>
                </flexbox>
              </div>
            </div>
          </popup> -->
        </div>
      </div>
    <!-- </scroller> -->
    </group>
    
  </div>
</template>
<script>
// import searchViewa from '../components/search.vue'
	import Emitter from '../../static/js/mixins/emitter.js'
// import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem, FormPreview, CellBox, Popup, Group, LoadMore, Scroller, Spinner, Panel, Badge, Flexbox, FlexboxItem, TransferDom, GroupTitle } from 'vux'
// import { mapGetters } from 'vuex'
export default {
  name: 'childList',
  mixins: [Emitter],
  computed: {
    // count () {
    //   let self = this
    //   return self.$store.getters.getShowSearch
    // },
    // pageCount () {
    //   let self = this
    //   return Math.ceil(self.total / self.rownumber)
    // }
  },
  components: {
    Tab,
    TabItem,
    Sticky,
    Divider,
    XButton,
    Swiper,
    SwiperItem,
    FormPreview,
    CellBox,
    Popup,
    Group,
    LoadMore,
    Scroller,
    Spinner,
    Panel,
    Badge,
    Flexbox,
    FlexboxItem,
    searchViewa,
    GroupTitle
  },
  directives: {
    TransferDom
  },
  props: ['childService', 'pageType', 'keyDatas'],
  responseData: [],
  data () {
    return {
      // acted: this.itemData.tabs[0].value,
      // tabs: this.itemData.tabs,
      // serviceName: this.itemData.serviceName,
      showSearchView: this.$store.getters.getShowSearch,
      index: 0,
      link: '/bxoa_issue_detail',
      getBarWidth: function (index) {
        return (index + 1) * 22 + 'px'
      },
      isTree: false,
      // listData: this.itemData,
      // list: this.itemData.list,
      // list: list(),
      rownumber: 10,
      pageNo: 1,
      total: 0,
      pullupEnabled: true,
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      formPageType: '',
      listCfgs: {
        // menu返回的list配置json Data示例
        serviceName: 'srvoa_news_columns_info_select',
        type: '1',  // 模版编号 list list-proc
        pageType: '',
        content: {
          p_key: 'id',
          Comp_img: 'list_img',  // 前端定义的 >>>  标识名称：‘columnName’
          Comp_title: 'banner_title',
          Comp_title_label: 'banner_type',
          Comp_subtitle: 'remark',
          Comp_content_row_left: 'create_user_disp',
          Comp_content_row_right: 'banner_columns',
          Comp_footer: 'create_time'
        }
      },
      listData: {
        // 表格数据接口格式
        serviceName: this.childService.service_name,
        type: '1',
        list: [
          {
            src: '-',
            // src: '',
            title: {
              label: '-',
              value: '-'
            },
            content: [
              [
                {
                  label: '-',
                  value: '-',
                  color: 'color-danger'
                }
              ], [
                {
                  label: '-',
                  value: '-'
                },
                {
                  label: '-',
                  value: '-'
                }
              ]
            ],
            footer: {
              linkText: '详情222',
              btns: {
                show: false,
                config: []
              },
              columns: {
                label: '创建时间',
                value: '2018/11/10 14:262018/11/10 14:26'
              }
            },
            url: '/component/cell'
          }
        ]
      },
      colV2Data: {},
      // condList:
      showPopup1: false,
      query: '',
      conds: [],
      footerBtns: [],
      gridBtns: Array,
      foreignKeyData: this.childService,
      showChildAddPage: false
    }
  },
  created () {
    this.gridBtns = this.childService.gridButton
    this.gridBtns = this.gridBtns.filter((item) => {
      if (item.permission === true && item.button_type === 'addss') {
        item.toLink = this.toChildAdd()

        return item
      } else if (item.permission === true && item.button_type === 'refresh') {

      }
    })
    this.formPageType = this.pageType
  },
  mounted () {
    if (this.pageType === 'procDetail') {
      this.getColV2('procDetail')// 请求 V2
    } else {
      this.getColV2()// 请求 V2
    }
    this.loadData()
    // this.getColV2()
  },
  beforeDestroy () {
    this.$store.dispatch({
      type: 'setHeadrBar',
      data: {
        buttons: [],
        menus: [],
        showMenus: false
      }
    })
  },
  updated () {
    let self = this
    console.log('data:', self.listData.list)
    self.dispatch('XDetail', 'get-data-ok', 'ok')
  },
  methods: {
    getDispExp (items, data) {
      let self = this
      let a = items
      let sysCfg = self.getDispExps(a, data)
      return sysCfg
    },
    loadData () {
      if (this.childService._foreignKey.fkValue === '_new') {
        this.conds = [{
          colName: this.childService._foreignKey.pk,
          ruleType: 'eq',
          value: this.childService._foreignKey.fkValue
        }]
        this.loadListData(this.childService.service_name, this.conds)
      } else {
        this.conds = [{
          colName: this.childService._foreignKey.pk,
          ruleType: 'eq',
          value: this.childService._foreignKey.fkValue
        }]
        this.loadListData(this.childService.service_name, this.conds)
      }
    },
    async getColV2 (e) {
      // this.colV2Data = colvw
      let self = this
      let childV2 = []
      if (e !== undefined) {
        childV2 = await self.getColData(self.foreignKeyData.service_name, 'select', 'addchildlist')
      } else {
        childV2 = await self.getColData(self.foreignKeyData.service_name, 'select', 'list')
      }
      self.colV2Data = childV2
      self.isTree = self.colV2Data.is_tree
      // let self = this
      if (self.colV2Data.card_cfg !== null) {
        let templateCfg = self.colV2Data.card_cfg[0].property_relation
    // console.log('模版配置' + templateCfg)
        if (templateCfg === '' || templateCfg === null || templateCfg === undefined) {
          self.$vux.alert.show({
            title: '提示',
            content: '页面配置信息为空?',
            onShow () {
              console.log('登录失败：请重新登陆')
            },
            onHide () {
              self.$router.go(-1)
            }
          })
        } else {
      // 模版配置转json
          templateCfg = templateCfg.replace(/\s+/g, '')
          self.listCfgs.serviceName = self.childService.service_name
          self.listCfgs.content = JSON.parse(templateCfg)
          self.listCfgs.pageType = 'childList'
          // this.query = this.childService._foreignKey
      // console.log(this.listCfgs)
        }
      }
    },
    loadListData: function (serviceName, cond) {
      // 请求数据
      // console.log('getData:===' + t)
      let self = this
      let CallbackGo = async function (response) {
        if (response.data.data !== '') {
          let rData = JSON.parse(JSON.stringify(response.data.data))
          // self.total = response.data.page.total
          // let resNum = response.data.data.length
          self.total = response.data.page.total
          console.log('子表数据rep>>>' + rData)
          let reqData = []
          reqData = await self.toListDataCtr(rData, self.listCfgs, 'addchildlist') // data构造方法参数一,原始data；参数二配置data
          self.listData.list = reqData.map((item) => {
            let btn = self.colV2Data._footerBtns
            item.footerBtns = btn
            return item
          })
          // self.dispatch('xChildDetail', 'refresh', true)
          // console.log(self.listData)
        }
        self.dispatch('xChildDetail', 'refresh', true)
      }
      let req = this.selectRequestObjs()
      req.serviceName = serviceName
      req.colNames = ['*']
      if (cond) {
        req.condition = cond
      } else {
        req.condition = []
      }
      req.order[0].colName = 'id'
      req.order[0].orderType = 'desc'
      req['page'] = {
        pageNo: self.pageNo,
        rownumber: self.rownumber
      }
      this.crosAjaxData(this.$api.select, 'post', req, CallbackGo)
    },
    toDetail (id, title) {
      let self = this
      // this.$router.push({path: '/detailplus:childs/childDetail', query: {serviceName: this.listData.serviceName, key: this.listCfgs.content.p_key, val: id, title: title}})
      // this.$router.go(0)
      let querys = {
        serviceName: self.listData.serviceName,
        key: self.listCfgs.content.p_key,
        val: id,
        pageType: 'childDetail',
        title: title
      }
      console.log('===', querys)
      if (self.isTree) {
        console.log('===', self.isTree, querys)
        self.dispatch('XDetail', 'update-child-detail', querys)
        self.$router.replace({
          path: self.$route.path + '/childDetail/' + id,
          query: {
            serviceName: this.listData.serviceName,
            key: self.listCfgs.content.p_key,
            val: id,
            pageType: 'childDetail',
            title: title
          }
        })
      } else {
        console.log('===', self.isTree, querys)
        self.dispatch('XDetail', 'to-child-detail', querys)
        self.dispatch('XProcDetail', 'to-child-detail', querys)
      }

      // this.$router.push({
      //   path: '/refresh',
      //   query: {serviceName: this.listData.serviceName, key: this.listCfgs.content.p_key, val: id, title: title}
      // })
    },
    toChildList () {
      let cond = [{
        colName: this.childService._foreignKey.pk,
        ruleType: 'eq',
        value: this.childService._foreignKey.fkValue
      }]
      this.$router.push({
        path: '/listView',
        query: {pageType: 'addchildlist',
          serviceName: this.listCfgs.serviceName,
          templateCfg: JSON.stringify(this.listCfgs.content),
          title: this.childService.service_view_name,
          cond: JSON.stringify(cond)
        }
      })
    },
    toChildAdd (key) {
      this.showChildAddPage = true
    },
    toNewDetail (id, title) {
      console.log('tonew', id, title)
    },
    refresh () {
      setTimeout(() => {
        this.list = []
        this.rownumber = 10
        this.pageNo = 1
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.scroller.donePulldown(
              this.loadListData(this.listData.serviceName, this.conds)
            )
            // this.pullupEnabled && this.$refs.scroller.enablePullup()
          }, 10)
        })
      }, 2000)
    },
    hideSearchView () {
      this.$store.dispatch({
        type: 'setShowSearch',
        amount: false
      })
    },
    onReset () {
      this.$refs.searchView.onReset()
    },
    onSearch () {
      let a = this.$refs.searchView.getModels()
      let b = a.filter((item) => {
        if ('column' in item && (('stateData' in item && 'endData' in item) || (typeof (item.column) === 'object' && item.column[0] !== '' && item.column[0] !== '') || item.column !== '')) {
          return item
        }
      })
      let conds = b.map(item => {
        let a = {}
        if (item.bx_col_type === 'enum') {
          a.colName = item.columns
          a.ruleType = 'eq'
          a.value = item.column
          return a
        } else if (typeof (item.column) === 'object' && (item.bx_col_type === 'date' || item.bx_col_type === 'datetime')) {
          if (item.stateDate && item.endDate && item.stateDate !== '' && item.endDate !== '') {
            a.colName = item.columns
            a.ruleType = 'between'
            a.value = []
            a.value.push(item.stateDate)
            a.value.push(item.endDate)
            // a.value[1] =
            return a
          }
        } else {
          a.colName = item.columns
          a.ruleType = '[like]'
          a.value = item.column
            // a.value[1] =
          return a
        }
      })
      this.conds = conds
      this.loadListData(this.listData.serviceName, conds)
      this.$store.dispatch({
        type: 'setShowSearch',
        amount: false
      })
      console.log('查询条件是：', conds)
    },
    async onFooterBtn (e) {
      let self = this
      let obj = e.buttonType
      let datas = e
      let srvN = self.listCfgs.serviceName
      if (obj.button_type === 'delete') {
        let len = srvN.lastIndexOf('_')
        let srv = srvN.slice(0, len) + '_delete'
        let conds = []
        let cond = {
          'colName': 'id',
          'ruleType': 'in',
          'value': obj.id
        }
        conds.push(cond)
        self.$vux.confirm.show({
          title: '确认操作',
          content: '是否确认删除' + datas.data.key,
          onShow () {
            console.log('plugin show')
          },
          onHide () {
            console.log('plugin hide')
          },
          onCancel () {
            console.log('plugin cancel')
          },
          async onConfirm () {
            let msg = await self.deleteRow(srv, conds)
            // [{"serviceName":"srvplm_qrcode_html_delete","condition":[{"colName":"id","ruleType":"in","value":"23"}]}]
            if (msg[0].response) {
              let len = msg[0].response.effect_rows
              self.$vux.toast.show({
                type: 'text',
                text: '删除成功' + len + '条'
              })
              self.refresh()
            }
            console.log('plugin confirm', msg[0])
          }
        })
        console.log('我点击了删除', datas.data.key)
      } else if (obj.button_type === 'edit') {
        let len = self.listCfgs.serviceName
        let srv = len.replace('select', 'update')
        // let conds = []
        // let cond = {
        //   'colName': self.listCfgs.content.p_key,
        //   'releType': 'eq',
        //   'value': obj.key
        // }
        self.$router.push({path: '/update', query: {serviceName: srv, key: self.listCfgs.content.p_key, value: datas.data.key, pageType: 'update'}})
      } else if (obj.button_type === 'startproc') {
        console.log(e)
        // let parentno = obj.data.data.parent_proc_instance_no
        let parentno = self.$route.params.proc_instance_no

        let procreq = self.selectRequestObjs()
        procreq.serviceName = 'srvprocess_basic_cfg_select'
        procreq.colNames = ['*']
        procreq.condition = [{
          'colName': 'proc_instance_no',
          'ruleType': 'eq',
          'value': self.$route.query.proc_instance_no
        }]
        // let procBasic = await self.$http.post(self.$api.select, procreq)

        // console.log('procBasic', procBasic)
        self.$vux.confirm.show({
          title: '确认操作',
          content: '是否确认开启',
          onCancel () {
            console.log('plugin cancel')
          },
          async onConfirm () {
            let req = [{
              'parent_proc_instance_no': parentno,
              'proc_no': '00002',
              'condition': [{
                'colName': 'id',
                'value': e.data.data.id,
                'ruleType': 'eq'
              }]
            }]
            let msg = await self.$http.post(self.$api.startDataProc, req)
            if (msg.body.resultCode === 'SUCCESS') {
              self.loadData()
              self.dispatch('xChildDetail', 'refresh', true)
              self.dispatch('XProcDetail', 'refreshProc', true)
            } else {
              self.$vux.toast.show({
                type: 'text',
                text: msg.body.resultMessage
              })
            }
            console.log('plugin confirm', msg[0])
          }
        })
      } else if (obj.button_type === 'customize') {
        console.log('oncustomize', obj, datas)
        if (obj.button_name === '流程详情') {
          self.$router.push({
            path: self.$route.path + '/childProcDetail/' + datas.data.key
          })
        }
      }
    }
  },
  watch: {
    // 'list': {
    //   handler: function (val) {
    //     // let self = this
    //     this.tabs.map((value, index, arr) => {
    //       val.map((item, key, obj) => {
    //         if (value.value === key) {
    //           // this.tabs[index]['len'] = item.length.toString()
    //         }
    //       })
    //     })
    //   }
    // },
    'count': {
      handler: function (val) {
        let self = this
        self.showSearchView = val
      },
      deep: true   // 是否深度监听
    },
    'listData': {
      handler: function (val) {
        let self = this
        if (self.listData.list.length > 0) {
        }
      },
      deep: true   // 是否深度监听
    }
  }
}
</script>

<style lang="less">
@basic-color-primary: #409EFF;
// $--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default; /* 53a8ff */
@basic-color-primary-gray:#5c7a98;
@basic-color-success: #67c23a;
@basic-color-warning: #e6a23c;
@basic-color-danger: #f56c6c;
@basic-color-info: #909399;
@basic-color-black: #333333;
.color-primary{
  color: @basic-color-primary
}
.color-primary-gray{
  color: @basic-color-primary-gray
}
.color-success{
  color: @basic-color-success
}
.color-danger{
  color: @basic-color-danger
}
.color-info{
  color: @basic-color-info
}
.color-black{
  color: @basic-color-black;
}
.childlistView{
  .weui-cells__title {
    border-left: 4px solid #03A9F4;
    color: #333;
    line-height: 2rem;
    margin-bottom: 0em;
    font-weight: bold;
    padding: 6px;

    .weui-btn{
      margin-right: 2px;
      &:last-child{
        // margin-right: 0;
      }
    }
  }
  .bx-list-panl{
    .bx-list-view{
      border-bottom: 1px solid #eee;
      &:last-child{
        border-width: 0;
      }
      .bx-item-flex-view{
        align-items: flex-start;
        line-height: 1.5;
        // .bx-item-flex-img{
        // }
        .bx-item-flex-header{
          .vux-flexbox-item{
            font-size: 1rem;
            color: #333333;
            line-height: 1.6;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
            span.vux-badge{
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  max-width:90%;
                  overflow: hidden;
            }
          }
        }
        .bx-item-flex-content{
          .vux-flexbox-item{
            text-align: left;
            font-size: 0.8rem;
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span{
              font-size: 0.8rem;
              // line-height: 0.8rem;
              color: #999999;
              padding-right: 0.4rem;
              &:last-child{
                padding-right: 0;
              }
            }
            .item-center-label{
              color:#333;
            }
            &:first-child{
              text-align: left!important;
            }
            &:last-child{
              text-align:right
            }
          }
        }
        .bx-item-flex-footer{
          text-align: right;
          >.vux-flexbox-item{
            text-align: right;
            font-size: 0.8rem;
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:last-child{
              padding-right: 20px;
            }
          }
          .bx-cell-btns {
            line-height: initial;
            span{
              padding: 4px;
              margin: 0 5px;
            }
          }
          &::after{
            content: " ";
            display: inline-block;
            height: 6px;
            width: 6px;
            border-width: 2px 2px 0 0;
            border-color: #C8C8CD;
            border-style: solid;
            -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            position: relative;
            /* top: -2px; */
            position: absolute;
            /* top: 50%; */
            right: 16px;
          }
        }
      }
    }
  }

}


.vux-no-group-title{
  margin-top:0em;
}
.weui-cells{
  margin-top:0em!important;
}

</style>


