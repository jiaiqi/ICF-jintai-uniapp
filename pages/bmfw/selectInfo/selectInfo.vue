<template>
  <view class="selectView">
    <from-view v-if="showChild" :pathQuery="query" :pageType="query.type" ref="iForms"></from-view>
    <view class="bottom_flex" style="padding:10px">
      <view class="bottom">
        <button type="primary" @click.native="submitForm">搜索</button>
      </view>
      <view class="bottom">
        <button type="warn" @click.native="resetForm">重置</button>
      </view>
    </view>
  </view>
</template>

<script>
import Emitter from "@/static/js/mixins/emitter.js";
import fromView from "../form/form.vue";
export default {
  components: { fromView },
  name: "selectPeopleInfo",
  data() {
    return {
      query: Object,
      showChild: false,
      pageBtns: [],
      foreignKey: []
    };
  },
  mixins: [Emitter],
  onLoad: function(option) {
    let query = JSON.parse(option.query);
    this.query = query;
    this.getCols(query);
    console.log("query", query);
  },
  methods: {
    async getCols(query) {
      this.query.cols = await this.getColData(
        query.serviceName,
        query.pageType,
        "list",
        this.$api.select +
          "/" +
          query.appType +
          "/select/srvsys_service_columnex_v2_select"
      );
      this.query.serviceName = query.serviceName;
      this.showChild = true;
    },
    submitForm() {
      this.broadcast("iFormItem", "on-submit");
      let a = this.$refs.iForms.returnFields();
      if (a.data.length === 0) {
        uni.showToast({
          icon: "none",
          title: "没有需要提交的信息"
        });
      } else {
        uni.showModal({
          title: "确认操作",
          content: "是否确认提交",
          success: function(res) {
            if (res.confirm) {
              this.selectInfo(a.data);
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      }
      console.log(a);
    },
    toDetail(backData) {
      uni.redirectTo({
        url:
          "../peopleInfo/peopleInfo?query=" +
          encodeURIComponent(JSON.stringify(this.query)) +
          "&data=" +
          encodeURIComponent(JSON.stringify(backData))
      });
    },
    selectInfo(data) {
      console.log("条件：", data);
      let condition = [];
      let obj = {};
      data.map(dataItem => {
        (obj = {
          colName: dataItem.columns,
          ruleType: "like",
          value: dataItem.column
        }),
          condition.push(obj);
      });
      let serviceName = this.query.serviceName;
      let url =
        this.$api.select + "/" + this.query.appType + "/select/" + serviceName;
      let req = {
        serviceName: serviceName,
        colNames: ["*"],
        condition: condition
      };
      this.$http.post(url, req).then(res => {
        console.log(res);
        if (res.data.data) {
          this.backData = res.data.data;
          this.toDetail(this.backData);
        }
      });
    },
    resetForm() {
      this.$refs.iForms.resetForm();
      // location.reload()
      console.log("重置");
    }
  }
};
</script>

<style lang="scss">
.selectView {
  width: 100%;
}
.scroll {
  height: 500px;
}
.bottom_flex {
  display: flex;
  justify-content: space-between;
}
.bottom {
  overflow: hidden;
  width: 48%;
  button {
    margin-left: 1%;
    float: left;
  }
}
</style>
