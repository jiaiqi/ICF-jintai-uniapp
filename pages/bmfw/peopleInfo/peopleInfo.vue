<template>
	<view>
		<div class="form_box" v-for="(item,index) in formData" :key="index">
      <div class="label"></div>
      <div class="content">
        <input type="text" value="" />
      </div>
    </div>
	</view>
</template>

<script>
	export default {
    name:'peopleInfo',
		data() {
			return {
				query:{},
        formData:[],
        datas:[]
			}
		},
		methods: {
			async getCols(query) {
			  let self = this;
			  self.query.cols = await self.getColData(query.serviceName, query.pageType, 'list', this.$api.select + '/' + query.appType + '/select/srvsys_service_columnex_v2_select');
			  console.log(self.query.cols);
			},
		},
    onLoad(option) {
      let query = JSON.parse(option.query);
      this.query = query
      let formData = JSON.parse(option.data);
      this.datas = formData
      console.log(query.cols.srv_cols,formData)
      let arr = []
      query.cols.srv_cols.map(cols=>{
       let obj = {}
        // formData.map(item=>{
          // if(item[cols['columns']]){
            obj.label = cols['label']
            obj.columns = cols['columns']
            // obj.value = item[cols['columns']]
            arr.push(obj)
          // }
        // })
      })
      console.log("arr",arr)
    }
	}
</script>

<style>

</style>
