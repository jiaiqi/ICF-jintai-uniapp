<template>
  <view class="bg-white" style="width:100%;" v-if="allField.length > 0">
    <!-- <scroll-view scroll-x="false" scroll-y="true"> -->
    <view v-for="(item, index) in allField" :key="index">
      <formItem
	  @to-editor='toEditor'
        :field="item"
        :pageFormType="BxformType"
        :showTextarea="showTextarea"
        :fieldsModel="fieldModel"
        ref="fitem"
        @on-form-item="onItemButtons($event)"
        @on-value-change="onValChange($event)"
        @on-value-blur="onValBlur($event)"
        @get-cascader-val="getCascaderVal"
      ></formItem>
    </view>
    <!-- </scroll-view> -->
  </view>
</template>

<script>
import formItem from '@/components/bx-form/bx-form-item.vue';
export default {
  name: 'bx-form',
  components: { formItem },
  props: {
    fields: {
      type: Array,
      default() {
        return [];
      }
    },
    pageType: {
      type: String,
      default() {
        return '';
      }
    },
    BxformType: {
      type: String,
      default() {
        return 'form';
      }
    },
    showTextarea: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    fieldsData: function() {
      return this.fields;
    }
  },
  data() {
    return {
      allField: this.fields,
      fieldModel: {},
      oldFieldModel: {}
    };
  },
  onLoad() {},
  updated() {
    // this.getAllField() ,
  },
  created() {
    this.oldField = this.deepClone(this.fields);
    this.oldField.forEach((item, index) => {
      this.oldFieldModel[item.column] = item.value;
    });
    this.getAllField();
  },
  onShow() {
  	console.log('进入')
  },
  methods: {
	  toEditor(e){
		  this.$emit('to-editor',e)
	  },
    onItemButtons(e) {
      this.$emit('on-form-item', e);
      return e;
    },
    getAllField() {
      console.log('getAllField', this.fields);
      if (this.fields.length > 0) {
        this.allField = this.fields.map((itemData, index) => {
          this.fieldModel[itemData.column] = itemData.value;
          let item = this.fieldModel;
          if (itemData.hasOwnProperty('isShowExp') && item.hasOwnProperty(itemData.column)) {
            itemData['showExp'] = this.evalInTo(itemData, item);
            itemData['display'] = itemData.isShowExp && itemData.isShowExp.length > 0 ? this.colItemShowExps(itemData, item) : true;
          } else {
            itemData['showExp'] = itemData['showExp'] || true;
          }
          itemData.valid = {
            column: itemData.column,
            valid: true,
            msg: '不能为空!'
          };
          return itemData;
        });
      }
    },
    onValChange(e) {
	  if (e.type === 'number') {
	    this.fieldModel[e.column] =Number(e.value);
	  }else{
		this.fieldModel[e.column] = e.value;  
	  }
      console.log('valueChange',e, this.fieldModel[e.column],this.fieldModel);
      this.allField = this.allField.map((item, index) => {
        if (item.column === e.column) {
          item.value = e.value !== null? e.value : "";
        }
        return item;
      });
      this.allField = this.allField.map((items, index) => {
        items.display = items.isShowExp && items.isShowExp.length > 0 ? this.colItemShowExps(items, this.fieldModel) : true;
        // items.showExp = items.isShowExp !== '' ? this.evalInTo(items, item) : true;
        return items;
      });
      // console.log('allField',this.allField)
    },
    onValBlur(e) {
      this.$emit('value-blur', e);
    },
    getFieldModel() {
      let valid = 0;
      let showsNum = 0;
      console.log('this.$refs', this.$refs);

      this.allField.map((item, index) => {
        let valids = this.$refs.fitem[index].getValid();
        console.log('字段校验', valids);
        if (item.display) {
          showsNum++;
          if (valids.valid) {
            valid++;
          }
          // if (item.isRequire && item.valid.valid && item.value !== '') {
          // 	valid++;
          // } else if (!item.isRequire) {
          // 	valid++;
          // }
        }
      });
      console.log(valid, showsNum);
      if (valid === showsNum) {
        console.log('表单校验通过', showsNum, valid, this.fieldModel);
        let model = {};
        switch (this.pageType) {
          case 'update':
            for (let key in this.fieldModel) {
              if (this.oldFieldModel[key] !== this.fieldModel[key]) {
                model[key] = this.fieldModel[key];
              }
            }
            break;
          case 'add':
            for (let key in this.fieldModel) {
              if (this.fieldModel[key] === '') {
                delete this.fieldModel[key];
              }
            }
            model = this.fieldModel;
            break;
          default:
            model = this.fieldModel;
            break;
        }
        console.log('this.fieldModel', this.fieldModel, model);
        if (Object.keys(model).length > 0) {
          return model;
        } else {
          uni.showToast({
            title: '没有需要提交的数据'
          });
        }
      } else {
        console.log('表单校验失败', showsNum, valid, this.fieldModel);
        uni.showToast({
          title: '请填写完信息后，再尝试提交'
        });
        return false;
      }
    },
    getCascaderVal(val) {
      if (val) {
        this.$emit('get-cascader-val', val);
      } else {
        this.$emit('get-cascader-val');
      }
    },
    onReset() {
		this.getAllField()
      this.allField = this.deepClone(this.oldField);
      try {
        return true;
      } catch (e) {
        return false;
        //TODO handle the exception
      }
    }
  },
  watch: {
    fields: {
      handler: function(newval, old) {
        console.log('newval', newval, this.allField);
        this.getAllField();
      },
      deep: true
    }
  }
};
</script>

<style lang="less"></style>
