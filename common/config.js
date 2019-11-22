const config = {
	Host: {
	  production: 'https://xxx.xxx.cn',
	  development: 'http://test-xxx.xxx.cn',
	  test: 'http://test-xxx.xxx.cn'
	},
	// 不需要检查cookie的名单
	urlNotNeedSession: [
	  '/xxx/xxx.xx.xxxx/xx1', // 我是该接口注释
	  '/xxx/xxx.xx.xxxx/xx2', // 我是该接口注释
	  '/xxx/xxx.xx.xxxx/xx3', // 我是该接口注释
	  '/xxx/xxx.xx.xxxx/xx4', // 我是该接口注释
	  '/xxx/xxx.xx.xxxx/xx5' // 我是该接口注释
	],
	// cookie信息
	COOKIE_VALID_DURATION: 1000 * 60 * 60 * 24 * 30 // 有效期30天
}
 
module.exports = config