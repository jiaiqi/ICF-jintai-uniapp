<template>
		<xNavItems :firstData="topMenus"></xNavItems>
</template>

<script>
import xNavItems from '../../components/nav/nav-item/nav-item.vue'
import Emitter from '../../static/js/mixins/emitter.js'

export default {
  name: 'xNavs',
  mixins: [Emitter],
  components: {xNavItems},
  props:{
	title:String  
  },
  data () {
    return {
      data: [],
      topMenus: [],
      showLoading: true
    }
  },
  onLoad (options) {
	  // console.log("options",options)
	  let query =  JSON.parse(options.query)
		wx.setNavigationBarTitle({
	  title: query.text
	})
    this.topMenus = this.$store.getters.selectByUser
    this.$on('on-nav-item', (event) => {
      // console.log('navs2', event)
      this.showLoading = event
      // this.fields.push(event)
    })
  },
  onShow(options) {
  	// console.log("options2",options)
	this.selectMenu()
  },
  methods:{
	  selectMenu () {
	    // 查询用户菜单
	    let self = this
	    let req = this.selectRequestObjs()
	    req.serviceName = 'srvsys_user_menu_select'
	    req.condition[0].colName = 'parent_no'
	    req.condition[0].ruleType = 'isnull'
	    req.order[0].colName = 'seq'
	    req.order[0].orderType = 'asc'
	    let condb =
	  	{
	  	  'colName': 'client_type',
	  	  'ruleType': '[like]',
	  	  'value': 'APP'
	  	}
	    req.condition.push(condb)
		self.$http.post(self.$api.select,req).then((res)=>{
			// console.log(res)
			if (res.data.data !== '') {
				
				self.topMenus = res.data.data
			  self.$store.dispatch({
				type: 'selectByUser',
				amount: res.data.data
			  })
			}
		})
	  }
  }
}
</script>
<style lang="scss">
	x-nav-items{
		width: 100%;
	}
	</style>