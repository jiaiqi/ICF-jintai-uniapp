<template>
  <view class="category"><ForumCategory :listData="categoryList" :query="query"></ForumCategory></view>
</template>

<script>
import ForumCategory from '@/components/bx-Category/bx-category.vue';
export default {
  name: 'category', //分类、栏目
  components: { ForumCategory },
  data() {
    return {
      categoryList: [],
      query:{}
    };
  },
  methods: {
    getCategory() {
      // 查找论坛栏目列表
      let url = this.$api.select + '/sqfw/select/srvzhsq_forum_column_select';
      let req = {
        serviceName: 'srvzhsq_forum_column_select',
        colNames: ['*'],
        condition: [{ colName: 'parent_no', ruleType: 'isnull' }],
        page: { pageNo: 1, rownumber: 10 },
        order: []
      };
      this.$http
        .post(url, req)
        .then(res => {
          if (res.data.data) {
            return res.data.data;
          }
        })
        .then(datas => {
          if (datas) {
            datas.map(data => {
              data.children = [];
              data.arrowDirection = "arrowdown"
              let req = {
                serviceName: 'srvzhsq_forum_column_select',
                colNames: ['*'],
                condition: [ {
                  colName: 'parent_no',
                  value: data.column_no,
                  ruleType: 'eq'
                }]
              };
              this.$http.post(url, req).then(resp => {
                   console.log(req.condition[0].value,'req.condition')
                if (resp.data.data && resp.data.data[0].parent_no == data.column_no) {
                  data.children = resp.data.data;
                  data.children.map(item=>{
                    item.text = item.column_title
                    item.url = '../../pages/normal/list/list?to=sqlt&column_no='+item.column_no+'&parent_no='+item.parent_no
                    item.image = "../../static/img/sqlt.png"
                  })
                }
              });
            });
            return datas;
          }
        })
        .then(datas => {
          if (datas) {
            console.log('datas:', datas);
            this.categoryList = datas;
          }
        });
    }
  },
  onLoad(option) {
    this.getCategory();
    if(option.query){
      this.query = JSON.parse(option.query)
      console.log(this.query)
    }
  }
};
</script>

<style lang="scss">
  .category{
    width: 100%;
  }
</style>
