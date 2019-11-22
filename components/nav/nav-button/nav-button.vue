<template>
	<div class="nav-item-leaf">
		<uni-grid :options="menus"
			column-num="4" 
			show-border="false" 
			showOutBorder="false" 
			@click="onGridItem" >
		</uni-grid>
		<!-- <div :cols="4"  :show-vertical-dividers="false" :show-lr-borders="false">
			<div v-if="item.app_dest_page === 'list' && (item.app_temp_col_map !== null )" :label="item.menu_name" v-for="(item,index) in gridData" :key="index" :link="{path: '/listView', query: {serviceName: item.service_name,templateCfg:item.app_temp_col_map,title:item.menu_name,pageType:item.app_dest_page}}">
			  <img v-if="item.icon !== null" slot="icon" src="">
			  <span  v-if="item.icon === null" slot="icon" class="text-icon">
				  {{item.menu_name.substr(0, 1)}}
				</span>
			  <span slot="label">{{ item.menu_name}}</span>
			</div>
			<div v-if="item.app_dest_page === 'list-proc' && (item.app_temp_col_map !== null )" :label="item.menu_name" v-for="(item,index) in gridData" :key="index" :link="{path: '/proclist', query: {serviceName: item.service_name,templateCfg:item.app_temp_col_map,title:item.menu_name,pageType:item.app_dest_page}}">
			  <img v-if="item.icon !== null" slot="icon" src="">
			  <span  v-if="item.icon === null" slot="icon" class="text-icon">
				  {{item.menu_name.substr(0, 1)}}
				</span>
			  <span slot="label">{{ item.menu_name}}</span>
			</div>
			<div v-if="item.app_dest_page === '' || item.app_dest_page === null || item.app_temp_col_map === null || item.app_temp_col_map === ''" :label="item.menu_name" v-for="(item,index) in gridData" :key="index" @click.native="onNone(item.menu_name)">
			  <img v-if="item.icon !== null" slot="icon" src="">
			  <span  v-if="item.icon === null" slot="icon" class="text-icon-none">
				  {{item.menu_name.substr(0, 1)}}
				</span>
			  <span slot="label">{{ item.menu_name}}</span>
			</div>
		</div> -->
	</div>
</template>

<script>
	
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
export default {
  name: 'xNavItemLeaf',
  props: {
    gridData: null
  },
  components:{uniGrid},
  computed: {},
  data () {
    return {
      data: [],
	  menus:[
	  	{image:'',text:'圣诞树1',data:[]},
	  	{image:'https://img-cdn-qiniu.dcloud.net.cn/img/lindang.png',text:'铃铛'},
	  	{image:'https://img-cdn-qiniu.dcloud.net.cn/img/laoren.png',text:'圣诞老人'},
	  	{image:'https://img-cdn-qiniu.dcloud.net.cn/img/liwu.png',text:'礼物'},
	  	{image:'https://img-cdn-qiniu.dcloud.net.cn/img/maozi.png',text:'帽子'},
	  	{image:'https://img-cdn-qiniu.dcloud.net.cn/img/shoutao.png',text:'手套'},
	  	{image:'https://img-cdn-qiniu.dcloud.net.cn/img/xueqiao.png',text:'雪橇'},
	  	{image:'https://img-cdn-qiniu.dcloud.net.cn/img/xunlu.png',text:'驯鹿'},
	  	{image:'https://img-cdn-qiniu.dcloud.net.cn/img/xuehua.png',text:'雪花'},
	  ]
    }
  },
  created () {
	  console.log('a',this.gridData)
		this.getMenus(this.gridData)
  },
  methods: {
	  onGridItem(e){
		  let  self = this
		if("data" in e){
			if(e.data.data.app_dest_page !== null && e.data.data.app_temp_col_map !== null && e.data.data.service_name !== null){
				if(e.data.data.app_dest_page === "list"){
					let res = {
						app_dest_page:e.data.data.app_dest_page,
						app_temp_col_map:e.data.data.app_temp_col_map,
						service_name:e.data.data.service_name,
						menu_no:e.data.data.menu_no,
						menu_name:e.data.data.menu_name
					}
					let query = encodeURIComponent(JSON.stringify(res))
					self.goWxLink(e.data.link.link + "?query=" + query,e.data.link.type)
				}
			}else{
				uni.showModal({
					title: '提示',
					content: "[" + e.data.data.menu_name +']暂未开放',
					showCancel:false,
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		}
	  },
	getMenus(e){
	  let self = this
	  let cm = e
	  self.menus = cm
	  self.menus = self.menus.map((item)=>{
	  	let val = {}
	  	val["text"] = item.menu_name
		if(item.app_icon !== null){
			val["image"] = item.app_icon
			val["text"] = item.menu_name
		}else{
			val["image"] = item.app_icon
			val["text"] = item.menu_name.slice(0,1)
		}

	  	val["data"] = item

		if(item.app_dest_page === null){
			val["link"] = null
		}else if(item.app_dest_page === "list"){
			val["link"] = {
				link:"../list/list",
				type:"navigateTo"
			}
		}else if(item.app_dest_page === "proclist"){
			val["link"] = {
				link:"../list/proclist",
				type:"navigateTo"
			}
		}
	  	return val
	  })
	  let list = self.menus
	  for(let i = 0; i<list.length;i++){
		  if(list[i].image === null){
			  list[i].text = list[i].text.slice(0,1)
		  }else{
			 let promise = new Promise((resolve, reject) => {
				let s =  self.getImageUrl(list[i].image)
				resolve(s)
			 })
			 promise.then((e) => {
				if(e.length > 0){
					list[i].image = e[0]._url
				}	
			 }) 
		  }
	  }
	}
  }
}
</script>
<style lang="less">
.nav-item-leaf{
  .weui-grids:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 0px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
}
  .weui-grid{
    height: 24.9vw;
    &:after {
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 0px solid #D9D9D9;
      color: #D9D9D9;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
  .weui-grid__icon {
    width: 2.4rem;
    height: 2.4rem;
    margin: 0 auto;
    display: flex;
    .text-icon{
      height: 100%;
      width: 100%;
      // background: rgb(39, 99, 230);
      background: -webkit-linear-gradient(bottom, #214bbd , #3e91ff); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(top, #214bbd , #3e91ff); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(top, #214bbd , #3e91ff); /* Firefox 3.6 - 15 */
      background: linear-gradient(to top, #214bbd , #3e91ff); /* 标准的语法（必须放在最后） */
      color:#fff;
      text-align: center;
      border-radius: 4px;
      line-height: 2.4rem;
      font-size: 1.8rem;
    }
    .text-icon-none{
      height: 100%;
      width: 100%;
      // background: rgb(39, 99, 230);
      background: -webkit-linear-gradient(bottom, #7484b1 , #8ebfff); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(top, #7484b1 , #8ebfff); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(top, #7484b1 , #8ebfff); /* Firefox 3.6 - 15 */
      background: linear-gradient(to top, #7484b1 , #8ebfff); /* 标准的语法（必须放在最后） */
      color:#fff;
      text-align: center;
      border-radius: 4px;
      line-height: 2.4rem;
      font-size: 1.8rem;
    }
    .icon-tips{

    }
  }
}
</style>
