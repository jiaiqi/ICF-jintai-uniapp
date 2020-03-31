<template>
  <view class="editor-wrap">
    <view :id="eleId" type="text/plain"></view>
    <!-- <view style="border-radius: 4px; border:1px solid #dcdfe6; overflow: auto"  v-html="field.value"></view> -->
  </view>
</template>

<script>
import jQuery from '@/static/js/jquery-1.9.1.min.js';
export default {
  props: {
    field: {
      type: Object,
      default: null
    }
  },
  watch: {
    field: {
      deep: true,
      immediate: true,
      handler(newVal, oldValue) {
        console.log('fiefieldld', newVal, newVal.value);
        // this.fieldData.info = newVal
        this.fieldData.info.type = newVal.type;
        this.fieldData.info.name = newVal.column;
        this.fieldData.info.label = newVal.label;
        this.fieldData.info.editor = newVal.type;
        this.fieldData.value = newVal.value;
      }
    }
  },
  data() {
    return {
      fieldData: {
        value: '',
        info: {
          type: 'snote',
          name: 'remark',
          label: '活动描述',
          placeholder: '请输入...',
          readonly: false,
          editor: 'snote',
          visible: 'true',
          editable: true
        }
      },
      selected: null,
      ue: null,
      eleId: null
    };
  },
  methods: {
    setSrvVal(srvVal) {
      if (this.ue) {
        srvVal = srvVal || '';
        this.ue.setContent(srvVal);
      } else {
        this.fieldData.value = srvVal;
      }
    },
    getSrvVal() {
      return this.fieldData.value;
    },
    async initUeditor() {
      const config = await import('../../static/ueditor/ueditor.config.js');
      const all = await import('../../static/ueditor/ueditor.all.js');
      const parser = await import('../../static/ueditor/ueditor.parse.js');

      this.ue = UE.getEditor(this.eleId, {
        BaseUrl: '/',
        UEDITOR_HOME_URL: '/static/ueditor/',
        UEDITOR_PUBHOME_URL: '/static/ueditor/',
        theme: 'om',
        imagePopup: false,
        toolbars: [[ 'simpleupload', 'insertlink', '|', 'bold', 'h1', 'h2', '|', 'removeformat', '|', 'undo', 'redo']],
        labelMap: {
          simpleupload: '插入图片',
          insertvideo: '插入视频',
          inserturl: '插入超链接',
          bold: '加粗',
          h1: '一级标题',
          h2: '二级标题',
          summary: '摘要',
          conclusion: '结语',
          removeformat: '清除格式',
          'om-paragraphcheck': '段落检查',
          undo: '撤销',
          redo: '重做',
          fullscreen: '全屏',
          showmsg: '消息',
          preview: '预览'
        },
        autoHeightEnabled: true,
        enableContextMenu: false,
        elementPathEnabled: false,
        wordCount: false,
        scaleEnabled: false,
        retainOnlyLabelPasted: true,
        removeFormatTags: 'big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,sub,sup,tt,u,var',
        removeFormatAttributes: 'class,style,lang,width,height,align,hspace,valign',
        pasteplain: false,
        filterTxtRules: (function() {
          function e(e) {
            (e.tagName = 'p'), (e.attrs = {}), e.setStyle();
          }
          return {
            '-': 'script style object iframe embed input select table noscript',
            img: function(e) {
              var t = e.getAttr('src') || e.getAttr('data-src') || '',
                n = e.getAttr('desc') || '',
                i = e.getAttr('class') || '',
                o = e.getAttr('style') || '';
              /^(http\:|https\:)*\/\//.test(t)
                ? ((e.attrs = {
                    src: t,
                    desc: n,
                    class: i,
                    style: o
                  }),
                  e.setStyle())
                : e.parentNode.removeChild(e);
            },
            p: function(e) {
              'pgc-img-caption' == e.getAttr('class') && '请输入图片描述' == e.innerText() ? e.parentNode.removeChild(e) : ((e.attrs = {}), e.setStyle());
            },
            a: 0,
            div: e,
            strong: {
              $: {}
            },
            ul: e,
            ol: e,
            li: e,
            blockquote: e,
            caption: e,
            code: e,
            h1: e,
            h2: e,
            h3: e,
            h4: e,
            h5: e,
            h6: e,
            br: e
          };
        })(),
        lang: 'zh-cn', //语言
        initialFrameHeight: 300,
        // scaleEnabled: true, //缩放
        catchRemoteImageEnable: false //远程抓图
      });
      this.setSrvVal(this.fieldData.value);
      let self = this;
      this.ue.srvApp = this.$api.appName;
      this.ue.addListener('blur', _ => {
        let currContent = self.ue.getContent();
        if (currContent != self.fieldData.value) {
          console.info('ueditor blur event');
          self.fieldData.value = currContent;
          self.$emit('fieldData-value-changed', this.fieldData.info.name, this.fieldData);
        }
      });
    }
  },
  created: function() {
    this.eleId = 'ueditor' + this._uid;
  },
  mounted: function() {
    // path config
    window.pathConfig = window.pathConfig || {};
    // window.pathConfig.fileServer = this.serviceApi().uploadFile.replace('upload', '');
    window.pathConfig.fileServer = this.$api.file;
    setTimeout(_ => {
      if (this.fieldData.info.editable) {
        this.initUeditor();
      }
    });
  }
};
</script>

<style scoped lang="scss">
.editor-wrap {
  width: 100%;
  margin: 0 auto;
  /deep/ #edui1_bottombar {
    display: none;
  }
  /deep/ #edui1,
  #edui2,
  #edui3,
  #edui4,
  #edui5,
  #edui6,
  #edui7,
  #edui8,
  #edui9,
  #edui10,
  #edui11,
  #edui12,
  #edui13 {
    z-index: 0 !important;
  }
  /deep/ #edui51 {
    z-index: 0 !important;
  }
}
</style>
