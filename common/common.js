export default {
  install(Vue, options) {
    Vue.prototype.formatTime = function(time, format) {
      var t = new Date(time);
      var tf = function(i) {
        return (i < 10 ? '0' : '') + i
      };
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear());
            break;
          case 'MM':
            return tf(t.getMonth() + 1);
            break;
          case 'mm':
            return tf(t.getMinutes());
            break;
          case 'dd':
            return tf(t.getDate());
            break;
          case 'HH':
            return tf(t.getHours());
            break;
          case 'ss':
            return tf(t.getSeconds());
            break;
        }
      })
    }
    Vue.prototype.pageTitle = '加载中…' // 可以自定义变量

    Vue.prototype.goWxLink = function(url, type) { // 微信路由
        // navigateTo | redirectTo | reLaunch | switchTab | navigateBack
        console.log("url", url)
        switch (type) {
          case "navigateTo":
            uni.navigateTo({
              url: url
            })
            break;
          case "redirectTo":
            uni.redirectTo({
              url: url
            })
            break;
          case "reLaunch":
            uni.reLaunch({
              url: url
            })
            break;
          case "switchTab":
            uni.switchTab({
              url: url
            })
            break;
          case "navigateBack":
            uni.navigateBack({
              url: url
            })
            break;
          default:
            return null
            break;
        }
      },
      Vue.prototype.selectRequestObjs = function() { // req构造
        let selectRequestObj = {}
        let condition = {}
        let order = {}
        selectRequestObj['serviceName'] = ''
        selectRequestObj['colNames'] = ['*']
        selectRequestObj['condition'] = []
        condition['colName'] = ''
        condition['ruleType'] = ''
        condition['value'] = ''
        selectRequestObj.condition.push(condition)
        selectRequestObj['order'] = []
        order['colName'] = ''
        order['orderType'] = ''
        selectRequestObj.order.push(order)
        return selectRequestObj
      }
    Vue.prototype.getKeyOrValue = function(obj, ke, val, name, icon) { // 给自定义方法起个名
      let Obj = obj
      let item = Obj.map(function(item) {
        let a = {}
        a['key'] = item[ke]
        a['value'] = item[val]
        a['name'] = item[name]
        // //console.log('====a:' + a)
        if (item[icon] === null) {
          a['icon'] = '../../assets/img/icons/init/menu-icon.png'
        } else {
          a['icon'] = Vue.prototype.$api.downloadImg + item[icon]
        }
        return a
      })
      return item
    }
    Vue.prototype.menuSpliceArr = function(arr, num) { // 根据组件定义菜单分页封装
      let len = arr.length
      let se = 0
      let newArr = []
      let c = Math.ceil(len / num)
      this.spli = function(r, n) {
        let a = r.slice(n * num, n * num + num)
        return a
      }
      this.newA = function(arr, num) {
        if (se < c) {
          let l = this.spli(arr, se)
          newArr.push(l)
          se++
          this.newA(arr, num)
        } else {
          return newArr
        }
      }
      this.newA(arr, num)
      return newArr
    }
    Vue.prototype.isWeixinCient = function() { // 获取sso授权状态
      // 判断是否当前环境是微信
      let ua = navigator.userAgent.toLowerCase()
      let isWeixin = ua.indexOf('micromessenger') !== -1
      if (isWeixin) {
        return true
      } else {
        return false
      }
    }
    Vue.prototype.getQueryString = function(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2]);
      return null
    }
    Vue.prototype.colToLable = async function(serviceName, cols) {
      // 通知columns查询label(中文名)
      // let self = this
      let req = {
        serviceName: 'srvsys_service_columns_select',
        colNames: [
          'columns',
          'label'
        ],
        condition: [{
            'colName': 'service_name',
            'value': serviceName,
            'ruleType': 'eq'
          },
          // {
          //   'colName': 'in_list',
          //   'value': '1',
          //   'ruleType': 'eq'
          // },
          {
            'colName': 'columns',
            'value': cols,
            'ruleType': 'in'
          }
        ],
        order: [{
          'colName': 'create_time',
          'orderType': 'asc'
        }]
      }
      let data = await this.$http.post(this.$api.select, req)
      // //console.log(data.data.data)
      return data.data.data
    }
    Vue.prototype.getProcBasic = async function(proc_instance_no) {
        let self = this
        let req = Vue.prototype.selectRequestObjs()
        req.serviceName = 'srvprocess_basic_cfg_select'
        req.colNames = ['*']
        req.condition = [{
          'colName': 'proc_instance_no',
          'ruleType': 'eq',
          'value': proc_instance_no
        }]
        let data = await self.$http.post(self.$api.select, req)
        return data
      },
      Vue.prototype.getFooterBtns = function(e) {
        // type : "duplicate" | edit | delete | detail
        let btns = e
        let footerBtns = btns.filter((item) => item.permission === true && (item.button_type === 'edit' || item.button_type ===
          'delete' || item.button_type === 'deletedraft' || item.button_type === 'closeproc' || item.button_type ===
          'deleteproc' || item.button_type === 'startproc' || item.button_type === 'customize'))
        return footerBtns
      }
    Vue.prototype.selectOne = async function(srv, cond, reqs) { // 查询
      let self = this
      let req = {}
      req.serviceName = srv
      req.colNames = ['*']
      req.condition = []
      req.condition = cond
      // req.condition[1] = JSON.parse(JSON.stringify(condObj))
      req.order = [{
        'colName': 'id',
        'orderType': 'desc'
      }]
      if (reqs) {
        req = reqs

        const response = await self.$http.post(self.$api.select, req)
        if (response.data.data) {
          return response.data
        } else {
          return '查询失败'
        }
      } else {

        const response = await self.$http.post(self.$api.select, req)
        if (response.data.data) {
          return response.data.data
        } else {
          return '查询失败'
        }
      }
    }
    Vue.prototype.getImageUrl = async function(fileNo) {
      let self = this
      let req = {}
      req.serviceName = 'srvsys_file_select'
      req.colNames = ['*']
      req.condition = []
      req.condition = [{
        'colName': 'file_no',
        'value': fileNo,
        'ruleType': 'eq'
      }]
      req.page = null
      req.order = null
      const response = await this.$http.post(self.$api.select, req)
      if (response.data.data) {
        let fileurl = response.data.data
        fileurl = fileurl.map((item) => {
          item._url = self.$api.getFilePath + item.fileurl
          return item
        })
        return fileurl
      } else {
        return '查询失败'
      }
    }
    Vue.prototype.getDispExps = function(item, data) { // 表达式校验
      let result = true
      try {
        let dispExps = item.disp_exps
        if (dispExps !== undefined && dispExps !== '' && dispExps !== null) {
          // eslint-disable-next-line
          result = eval(dispExps)
        }
      } catch (err) {
        console.error('按钮表达式执行错误')
      }
      return result
    }
    Vue.prototype.selectUserMenu = async function(cond) { // 查询菜单
      let self = this

      let req = {}
      req.serviceName = 'srvsys_user_menu_select'
      req.colNames = ['*']
      req.condition = []
      req.condition = cond
      // req.condition[1] = JSON.parse(JSON.stringify(condObj))
      req.order = [{}]
      req.order[0].colName = 'seq'
      req.order[0].orderType = 'asc'
      const response = await this.$http.post(self.$api.selectByUser, req)
      if (response.data.data) {
        return response.data.data
      } else {
        return '查询失败'
      }
    }
    Vue.prototype.deepClone = function(obj) {
      // 深拷贝
      function isObject(o) {
        return (typeof o === 'object' || typeof o === 'function') && o !== null
      }

      if (!isObject(obj)) {
        throw new Error('非对象')
      }

      let isArray = Array.isArray(obj)
      let newObj = isArray ? [...obj] : { ...obj
      }
      Reflect.ownKeys(newObj).forEach(key => {
        newObj[key] = isObject(obj[key]) ? Vue.prototype.deepClone(obj[key]) : obj[key]
      })

      return newObj
    }
    Vue.prototype.deleteRow = async function(srv, cond) { // 删除数据
      let self = this
      let reqs = []
      let req = {}
      // [{"serviceName":"srvplm_qrcode_html_delete","condition":[{"colName":"id","ruleType":"in","value":"23"}]}]
      req.serviceName = srv
      req.condition = cond
      reqs.push(req)
      const response = await this.$http.post(self.$api.delete, reqs)
      if (response.data.state === 'SUCCESS') {
        return response.data.response
      } else {
        return '删除失败'
      }
    }
    Vue.prototype.getGridButton = function(datas, srv, conds) {
      let self = this
      let d = datas
      let headbut = {
        buttons: [],
        menus: [],
        showMenus: false
      } // but type :  select | refresh | add | batch_delete | import | export | shrink | apply
      let newData = d.filter(item => item.permission === true && (item.button_type === 'select' || item.button_type ===
          'add' || item.button_type === 'apply' || item.button_type === 'import' || item.button_type === 'export') &&
        item.client_type.indexOf('APP') !== -1)
      let butType = newData.map(item => item.button_type)
      // //console.log(headbut, newData, butType)
      // let buts = ['select', 'add']
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].button_type === 'select') {
          let b = {
            type: 'search',
            url: '',
            cfg: {
              serviceName: self.listCfgs.serviceName,
              colType: 'select',
              pageType: 'selectlist'
            }
          }
          headbut.buttons.push(b)
        } else if (newData[i].button_type === 'add') {
          let b = {
            type: 'add',
            url: '',
            cfg: {
              path: '/add',
              query: {
                serviceName: self.listCfgs.serviceName,
                pageType: 'add',
                foreignKey: conds
              }
            }
          }
          headbut.buttons.push(b)
        } else if (newData[i].button_type === 'apply') {
          let b = {
            type: 'add',
            url: '',
            cfg: {
              path: '/add',
              query: {
                serviceName: self.listCfgs.serviceName,
                pageType: 'apply'
              }
            }
            // title:
          }
          headbut.buttons.push(b)
        } else {
          let b = {
            label: newData[i].button_name,
            type: 'warn',
            value: newData[i].button_type,
            url: '',
            cfg: []
          }
          headbut.menus.push(b)
        }
      }
      if (headbut.menus.length > 0) {
        headbut.showMenus = true
        // self.$store.dispatch({
        //   type: 'showMenus'
        // })
      } else {
        headbut.showMenus = false
        // self.$store.dispatch({
        //   type: 'hideMenus'
        // })
      }
      self.$store.dispatch({
        type: 'setHeadrBar',
        data: headbut
      })
      //console.log(headbut, newData, butType)
    }
    Vue.prototype.toListDataCtr = async function(data, type, listType) { // 参数data:原始data; type:配置json
      // 根据表格配置 构造data
      // let self = this
      let typeCfg = type.type // 表格类型
      let resData = data // 原始data
      let cols = []
      let labs = []
      let req = []

      function colNamesArr(e) {
        // cols
        let list = e
        let arr = []
        for (let i in list) {
          if (list[i] !== '') {
            arr.push(list[i]) // 属性
            // arr.push(obj[i]); //值
          }
        }
        return arr.join()
      }
      cols = colNamesArr(type.content)
      // //console.log('cols:')
      // //console.log(cols)
      labs = await this.colToLable(type.serviceName, cols)
      // //console.log(labs)
      if (typeCfg === '1') {
        // let Obj = resData.map(function (item, index) {
        let Obj = resData.map((item, index) => {
          let columnsCfg = type.content

          function colToL(c) {
            // cols
            let L = labs
            let arr = L.filter(item => item.columns === c)
            // //console.log(arr)
            return arr[0] === undefined ? '' : arr[0].label
          }

          let a = {
            src: item[columnsCfg.Comp_img],
            key: item[columnsCfg.p_key],
            id: item.id,
            title: {
              value: item[columnsCfg.Comp_title],
              label: item[columnsCfg.Comp_title_label]
            },
            content: [
              [{
                label: colToL(columnsCfg.Comp_subtitle),
                value: item[columnsCfg.Comp_subtitle]
              }],
              [{
                  label: colToL(columnsCfg.Comp_content_row_left),
                  value: item[columnsCfg.Comp_content_row_left]
                },
                {
                  label: colToL(columnsCfg.Comp_content_row_right),
                  value: item[columnsCfg.Comp_content_row_right]
                }
              ]
            ],
            footer: {
              linkText: '详情',
              columns: {
                label: colToL(columnsCfg.Comp_footer),
                value: item[columnsCfg.Comp_footer]
              }
            },
            data: item
          }
          // if(listType){
          //   if(listType === 'addchildlist'){}
          // }
          return a
        })
        req = Obj
      }
      // //console.log(resData, req)
      return req
    }
    Vue.prototype.isType = async function(e, reg, msg) {
      let regFun = new RegExp(reg)
      if (reg.test(e)) {
        let obj = {
          valid: regFun.test(e)
        }
        return obj
      } else {
        let msgs = msg
        msgs = (msgs === '' ? cols.label + '信息有误' : msgs)
        let obj = {
          valid: regFun.test(e),
          msg: msgs
        }
        return obj
      }
    }
    Vue.prototype.getColValidators = async function(cols) { // 根据columns data 返回字段校验信息
      if (cols) {
        if (cols.validators !== null && cols.validators_message !== null) {
          let str = cols.validators
          let msg = cols.validators_message
          let getStr = function(val, state, end) {
            if (val.length > state.length + end.length) {
              let s = val.indexOf(state)
              if (s === -1) {
                return ''
              } else {
                let nval = val.slice(s + state.length, val.length)
                let e = nval.indexOf(end)
                let str = nval.slice(0, e)
                if (e === -1) {
                  str = nval.slice(0)
                }
                return str
              }
            } else {
              return ''
            }
          }
          let Validators = {}
          let reg = /required/gi
          let msgs = getStr(msg, 'ngPattern=', ';')
          msgs = msgs === '' ? cols.label + '信息有误' : msgs
          Validators['max'] = getStr(str, 'ngMaxlength=', ';').length > 0 ? parseInt(getStr(str, 'ngMaxlength=',
            ';')) : null
          Validators['min'] = getStr(str, 'ngMinlength=', ';').length > 0 ? parseInt(getStr(str, 'ngMinlength=',
            ';')) : null
          Validators['reg'] = getStr(str, 'ngPattern=', ';')
          Validators['col_type'] = cols.bx_col_type
          Validators['required'] = reg.test(str)
          Validators['msg'] = msgs
          Validators['initExpr'] = cols.init_expr
          Validators['placeholder'] = cols.placeholder
          console.log('common-Validators:', Validators)
          return Validators
        } else {
          let Validators = {}
          // let msgs = getStr(msg, 'ngPattern=', ';')
          // msgs = msgs === '' ? cols.label + '信息有误' : msgs
          Validators['max'] = null
          Validators['min'] = null
          Validators['reg'] = ''
          Validators['col_type'] = cols.bx_col_type
          Validators['required'] = false
          Validators['msg'] = ''
          Validators['isType'] = function(e) {
            let reg = new RegExp()
            if (reg.test(e)) {
              let obj = {
                valid: reg.test(e)
              }
              return obj
            } else {
              let msgs = ''
              msgs = ''
              let obj = {
                valid: reg.test(e),
                msg: msgs
              }
              return obj
            }
          }
          Validators['initExpr'] = cols.init_expr
          Validators['placeholder'] = cols.placeholder
          return Validators
        }
      } else {
        return false
      }
    }
    Vue.prototype.getValidators = function(vds, msg) { // 获取校验信息返回组件data
      if (vds !== null && msg !== null) {
        let str = vds
        let getStr = function(val, state, end) {
          if (val.length > state.length + end.length) {
            let s = val.indexOf(state)
            if (s === -1) {
              return ''
            } else {
              let nval = val.slice(s + state.length, val.length)
              let e = nval.indexOf(end)
              let str = nval.slice(0, e)
              if (e === -1) {
                str = nval.slice(0)
              }
              return str
            }
          } else {
            return ''
          }
        }
        let Validators = {}
        let reg = /required/gi
        Validators['max'] = getStr(str, 'ngMaxlength=', ';').length > 0 ? parseInt(getStr(str, 'ngMaxlength=', ';')) :
          null
        Validators['min'] = getStr(str, 'ngMinlength=', ';').length > 0 ? parseInt(getStr(str, 'ngMinlength=', ';')) :
          null
        Validators['reg'] = getStr(str, 'ngPattern=', ';')
        Validators['required'] = reg.test(str)
        Validators['msg'] = getStr(msg, 'ngPattern=', ';')
        Validators['isType'] = function(e) {
          let reg = new RegExp(getStr(str, 'ngPattern=', ';'))
          if (reg.test(e)) {
            let obj = {
              valid: reg.test(e)
            }
            return obj
          } else {
            let msgs = getStr(msg, 'ngPattern=', ';')
            msgs = msgs === '' ? '信息有误' : msgs
            let obj = {
              valid: reg.test(e),
              msg: msgs
            }
            return obj
          }
        }
        return Validators
      } else {
        return false
      }
    }
    Vue.prototype.getFeilds = async function(v2ColsData, key) {
      let datas = {}
      datas["fields"] = []
      datas["useType"] = []
      datas["srvType"] = []
      let cols = v2ColsData.srv_cols
      if (v2ColsData) {
        datas.useType = v2ColsData.use_type
        datas.srvType = v2ColsData.srv_type
      }
      let pageInCode = datas.srvType === "add" ? "in_add" : datas.srvType === "update" ? "in_update" : datas.srvType ===
        "select" ? "in_detail" : "in_list"
      datas.fields = cols.filter(item => item[pageInCode] === 1)
      let itemList = datas.fields
      for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].bx_col_type === 'fk') {
          let cond = []
          let srv = itemList[i].option_list_v2.serviceName
          let optionV2 = await Vue.prototype.selectOne(srv, cond)
          let data = []
          for (let j = 0; j < optionV2.length; j++) {
            let a = {
              "label": "",
              "key": ""
            }
            a.key = optionV2[j][itemList[i].option_list_v2.refed_col]
            a.label = optionV2[j][itemList[i].option_list_v2.key_disp_col]
            a.index = j
            data.push(a)
          }

          itemList[i]["_optionData"] = data
          //console.log("aaaaitemitemitem",itemList[i])
          itemList[i]["_optionIndex"] = null

        }
      }

      for (let q = 0; q < itemList.length; q++) {
        itemList[q]['_formItemValidators'] = await Vue.prototype.getColValidators(itemList[q])
        //console.log("aaaa3",itemList[q])
      }
      if (key) {
        let cond = [{
          colName: key.name,
          ruleType: 'eq',
          value: key.value
        }]
        Vue.prototype.selectOne(this.srvData.serviceName, [], e)
      } else {
        return datas
      }
    }
    Vue.prototype.getColData = async function(srv, srvType, pageType, url) {
      // url  请求地址
      // 表单信息 srvType : add | update | list | detail | select
      // use_type: detail | proclist | list | treelist | detaillist | selectlist | addchildlist | updatechildlist | procdetaillist | add | update
      let self = this
      if (srv && srvType && pageType) {
        let len = srv.lastIndexOf('_')
        let serviceName = srv.slice(0, len) + '_'
        if (srvType === 'list' || srvType === 'detail') {
          serviceName += 'select'
        } else {
          serviceName += srvType
        }
        // if(srvType === "add" || srvType === "update")
        // serviceName += 'select'
        // serviceName += srvType
        let cols = self.$store.getters.getSrvCol
        let nCols = cols.filter(item => item.service_name === serviceName && item.use_type === pageType)
        //console.log('=====1', nCols)
        if (nCols.length === 0) {
          let req = this.selectRequestObjs()
          req.serviceName = 'srvsys_service_columnex_v2_select'
          req.colNames = ['*']
          req.condition = []
          let condObj = {}
          condObj['colName'] = 'service_name'
          condObj['ruleType'] = 'eq'
          condObj['value'] = serviceName
          req.condition[0] = JSON.parse(JSON.stringify(condObj))
          condObj['colName'] = 'use_type'
          condObj['ruleType'] = 'eq'
          condObj['value'] = pageType
          req.condition[1] = JSON.parse(JSON.stringify(condObj))
          req.order[0].colName = 'seq'
          req.order[0].orderType = 'asc'
          const response = await this.$http.post(url, req) // url self.$api.select
          if (response.data.data) {
            //console.log('=====2', response.data.data)
            response.data.data.use_type = pageType
            response.data.data.srv_type = srvType
            if ('rowButton' in response.data.data) {
              response.data.data._footerBtns = this.getFooterBtns(response.data.data.rowButton)
            }
            self.$store.commit('setSrvCol', response.data.data)
            return response.data.data
          }
        } else {
          //console.log('=====3', nCols)
          return nCols[0]
        }
      } else {
        return false
      }
    }
    Vue.prototype.getUserAppMenu = async function() { // 查询app模块
      let promise = new Promise((resolve, reject) => {
        let menureq = {
          "serviceName": "srvauth_user_app_menu_select",
          "colNames": ["*"]
        }
        let s = this.$http.post(this.$api.getUserAppMenu, menureq).then((res) => {
          return res
        })
        resolve(s)
      })
      promise.then((e) => {
        console.log("获取app菜单状态：", e)
        if (e.data.state === this.$api.byState) {
          uni.setStorageSync("appMenu", e.data.data)
          return e.data.data
        } else {
          return false
        }
      })
    }
    Vue.prototype.getMenus = async function(e) { // 查询user菜单
      let url = this.$api.getMenus + e + "/select/srvsys_user_menu_select"
      let promise = new Promise((resolve, reject) => {
        let menureq = {
          "serviceName": "srvsys_user_menu_select",
          "colNames": ["*"],
          "order": [{
            "colName": "seq",
            "orderType": "asc"
          }]
        }
        let s = this.$http.post(url, menureq).then((res) => {
          return res
        })
        resolve(s)
      })
      promise.then((e) => {
        console.log("获取app菜单状态：", e)
        if (e.data.state === this.$api.byState) {
          uni.setStorageSync("userMenus", e.data.data)
        } else {
          return false
        }
      })
    }
  }
}
