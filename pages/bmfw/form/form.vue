
<template>
  <form>
   <div v-for="(itema, key) in fields" :key="key">
		<formItems :fromColData='itema' v-if="fieldsIsUpload" v-show="onXifFun(itemVal,itema)" :key="key"></formItems>
   </div>
   </form>
</template>
<script>
import formItems from '@/components/from/formItems.vue'
import Emitter from '@/static/js/mixins/emitter.js'
export default {
  name: 'iForm',
  components: {
    formItems
  },
  mixins: [Emitter],
  props: {
    pathQuery: Object,
    pageType: ''
  },
  data () {
    return {
      cols: [],
      itemVal: null,
      fields: [],
      childData: {
        childService: Array
      },
	  fieldsIsUpload:false,
      vMainData: Array,
      validators: Object
    }
  },
  created(){
	  this.getCols(this.pathQuery.cols.srv_cols, this.pageType)
    this.cols = this.pathQuery.cols.srv_cols
    this.$on('on-form-blur', (event) => {
      let a = this.fields
      this.fields = a.map((item) => {
        if (item.columns === event.columns) {
          item.column = event.currentValue
          return item
        } else {
          return item
        }
      })

    })
    this.$on('on-set-item', (event) => {
      console.log(event)
    })
    this.$on('currentValue-update', (event) => {
      // console.log('currentValue-update', event)
      if (this.itemVal !== null) {
        let a = this.itemVal
        let keys = Object.keys(a)
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] === event.columns) {
            a[keys[i]] = event.currentValue
            if (event.currentValue === undefined) {
              if (event.column !== undefined) {
                a[keys[i]] = event.column
              } else {
                a[keys[i]] = ''
              }
            } else {
              a[keys[i]] = event.currentValue
            }
          }
        }
      }
    })
    this.$on('on-form-item-valid', (colValids) => {
      let colValid = colValids
      let field = this.fields
      for (let i = 0; i < field.length; i++) {
        if (field[i].columns === colValid.columns) {
          this.fields[i]._valid = colValid.formValids.valid
        }
      }
    })
  },

  beforeDestroy () {
    this.fields = []
  },
  methods: {
    getFromData (e) {
      let data = {}
      e.forEach((item) => {
        if (item.column) {
          data[item.columns] = item.column
        } else {
          data[item.columns] = ''
        }
      })
      this.itemVal = data
      return data
    },
    onXifFun (r, i) {
      /* eslint-disable */
      let self = this 
      let rowa = i
        if(rowa.hasOwnProperty('x_if')){
          let xif = rowa.x_if
          
        let row = r
          // val[row.columns]
          // if(row.columns)
          try {
            let ret = eval("var zz=" + xif + "(row); zz");
            return ret;  
          } catch (error) {
            return true
          }
          
        }else{
          return true
        }
      
    },
    async getColV2 (e) {
      let self = this
	  let  url = self.$api.select + '/sqfw/select/srvsys_service_columnex_v2_select'
      self.vMainData = await self.getColData(e, 'select', 'detail',url)
    },
    async getCols (co, pageType) {
      let self = this
      self.cols = JSON.parse(JSON.stringify(co))
      let arr = self.cols.filter((item) => {
        if (pageType === 'add') {
          if (item.in_add === 1 && item.updatable !== 0) {
            // item['_formItemValidators'] = self.getColValidators(item)
            return item
          }
        } else if (pageType === 'update') {
          if (item.in_update === 1 && item.updatable !== 0) {
            // item['_formItemValidators'] = self.getColValidators(item)
            return item
          }
        } else if (pageType === 'apply') {
          if (item.in_add === 1 && item.updatable !== 0) {
            // item['_formItemValidators'] = self.getColValidators(item)
            return item
          }
        } else if (pageType === 'proc_step_form_update') {
          if (item.in_update === 1) {
            // item['_formItemValidators'] = self.getColValidators(item)
            return item
          }
        }
      })

      self.cols = arr
      let valFields = this.deepClone(this.cols)
      
	  for (let i = 0;i<valFields.length;i++) {
		  valFields[i]['_formItemValidators'] = await self.getColValidators(valFields[i])
		  
		  let promise = new Promise((resolve, reject) => {
		  	let s =  self.getColValidators(valFields[i])
		  	resolve(s)
		  })
		  promise.then((e) => {
		  	 valFields[i]['_formItemValidators'] = e
		  })
	  
		console.log("self.fields[i]['_formItemValidators']",valFields[i])
	  }
	  
	  console.log('valFields.length',valFields.length)
	  self.fields = valFields
	 
	  if(self.fields.length === valFields.length){
	  		  this.fieldsIsUpload = true
	  }
	  self.getFromData(self.fields)
	  
	  console.log('valFields',valFields)
    },
    getValidatorsVal (val, s, e) {
      let vl = this.getValidators(val, s, e)
      return vl
    },
    setRules () {
      this.$on('on-form-blur', this.onFieldBlur)
      this.$on('on-form-change', this.onFieldChange)
    },
    returnFields () {
      let self = this
      let fieldValid = []
      let valids = []
      fieldValid = self.fields
	  console.log('fieldValid',fieldValid)
      for (let i = 0; i < fieldValid.length; i++) {
        // console.log(fieldValid[i].label, fieldValid[i]._valid)
        if (fieldValid[i]._valid.valid !== true && fieldValid[i]._valid.valid !== undefined) {
          valids.push(fieldValid[i]._valid)
          // return item
        }
      }
      let olddata = JSON.parse(JSON.stringify(self.cols))
      let newData = JSON.parse(JSON.stringify(self.fields))
      let fids = []
      for (let j = 0; j < newData.length; j++) {
        for (let i = 0; i < olddata.length; i++) {
          if (newData[j].columns === olddata[i].columns && newData[j].column !== olddata[i].column) {
            fids.push(newData[j])
			
          } else {
          }
        }
      }
      // console.log('fieldValid:::', fieldValid, valids)
      let fields = {}
      fields['valid'] = !(valids.length > 0)
      fields['data'] = fids
      return fields
    },
    resetForm () {
      if (this.pathQuery.cols.srv_cols !== 'undefined') {
       this.getCols(this.pathQuery.cols.srv_cols, this.pageType)
       this.cols = this.pathQuery.cols.srv_cols
      }
      console.log(this.fields)
    },
    async onValidatorsFun(){
      await this.onFormValidators(this.itemVal,this.validators.in_table_validate)
    },
    async onFormValidators(val,fun){
      let ctx = val
      let self = this
      let vals = null
      if(fun !==""){
        try {
          let ret = await eval("var zz=" + fun + "(ctx); zz")
            let msg = ret
            let col = ret.cols
             
            // for(let j = 0; j<col.length;j++){
            //   let valid = {
            //     "colName":col[j],
            //     "valid":msg.valid,
            //     "msg":msg.msg
            //   }
            //   // self.broadcast('iFormItem', 'set-table-valid',valid)
            //   for(let i = 0;i<self.fields.length;i++){
            //     if(self.fields[i].columns === col[j]){
            //       self.fields[i]._tableValid = valid
            //       vals = valid
                 
            //     }else{
            //       self.fields[i]._tableValid = {
            //         "colName":"",
            //         "valid":"",
            //         "msg":""
            //       }
            //       vals = self.fields[i]._tableValid
            //     }
            //   }
            // }
            // col = col.filter((item) =>{
              
            //   return valid
            // })
            // self.
          // let ret = xxx(ctx)
          // console.warn(`field:: ${ctx.columns} visible: ${ret}`)
          
        // if(vals !== null){
        //   self.broadcast('iFormItem', 'set-table-valid',vals)
        // }
          return ret;  
        } catch (error) {
          return false
        }
      }    
    }
  },
  watch: {
    'cols': {
      handler: function (val, oldval) {
        let self = this
        this.broadcast('iFormItem', 'on-submit')
        this.fields = JSON.parse(JSON.stringify(this.cols))
        console.log('更新fields')
        this.fields = this.fields.map((item) => {
          item['_formItemValidators'] = self.getColValidators(item)
          return item
        })
      },
      deep: true   // 是否深度监听
    },
    // "pathQuery":{
    //   handler: function (val, oldval) {
    //     let self = this
    //     // this.broadcast('iFormItem', 'on-submit')
    //     // this.fields = JSON.parse(JSON.stringify(this.cols))
    //     console.log('更新val',pathQuery)
    //   },
    //   deep: true   // 是否深度监听
    // }
  }
}
</script>
<style lang="less">
.form-view-item{
  // padding: 8px;
  div{
    .weui-cells{

      &:before {
        border-top: 0px solid #D9D9D9!important;
      }
    }
  }
  .weui-cells__title {
    padding-left: 10px 15px;
    border-left: 2px solid #03A9F4;
    border-bottom:#D9D9D9;
    font-size: 17px;
  }
}
</style>


