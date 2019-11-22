import Vue from "vue"

// Vue继承
import _g from './global.js'
copyFuns()
/**
 * @name 复制对象到Vue的原型上
 */
function copyFuns(){
	let keys = Object.keys(_g)
	keys.forEach(ele=>{
		Vue.prototype[ele]=_g[ele]
	})
}


// 注册全局组件
// import myIconfont from '@/components/myIconfont/myIconfont.vue'
// Vue.component("my-iconfont",myIconfont)
// 
// import myLoading from '@/components/myLoading/myLoading.vue'
// Vue.component("my-loading",myLoading)
