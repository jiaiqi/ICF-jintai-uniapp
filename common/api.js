// apis/index.js
// 把所有api的url统一在一起并挂在到vue对象上
// 所有接口都在一个文件里会比较大
// 可以按功能模块分组编写 http://www.100xsys.cn/xxxxxx/wx/authorize
let remoteAddress = {
  ssourl: 'https://www.100xsys.cn', // 微信登陆sso 端口
  ssoAddress: 'https://sso.100xsys.cn',
  serviceAddress: 'http://192.168.0.195:8101',
  // serviceAddress: 'http://39.98.203.134:8081',
  // serviceAddress: 'http://113.200.255.90:8101', //金台外网
  srvType: "ms", //"mono" 传统单体 || "ms" 微服务
  // assetsUrl: 'http://139.129.128.155'
}

let ENV = {
  backUrl: remoteAddress.ssourl, // 授权域名
  serverURL: remoteAddress.serviceAddress + '/mvpages', // 后台地址
  refuseCode: '0111', // 后台拒绝识别码
  byCode: '1111', // 后台通过码
  byState: 'SUCCESS', // 状态码
  bindLogin: 'bind_login', // 授权成功,请登录绑定账号
  authorizedLoginSuccess: 'authorized_login_success', // 授权成功,可以直接请求业务数据
  ssoAuthor: remoteAddress.ssoAddress + '/wx/authorize', // sso授权地址
  srvHost: remoteAddress.serviceAddress,
  // ssoAuthorurl: remoteAddress.ssoAddress + '/wx/authorizeurl', // sso授权地址
  savewxuser: remoteAddress.ssoAddress + '/wx/savewxuser', // sso保存微信用户
  untied: remoteAddress.ssoAddress + '/wx/untied', // 微信解绑 http://Ip:port/wx/untied
  loginAuthor: remoteAddress.ssoAddress + '/bindlogin', // 微信绑定登录地址http://Ip:port/bindlogin
  getImg: remoteAddress.assetsUrl + '/main/', // 图片地址
  downloadImg: remoteAddress.serviceAddress + '/download?filePath=', // 图片地址https://srv.100xsys.cn/upload
  upload: remoteAddress.serviceAddress + '/upload', // 图片upload
  getFilePath: remoteAddress.serviceAddress + '/download?filePath=', // 文件路径地址
  select: remoteAddress.serviceAddress, // 查询接口 + '/zhdj/select'
  toLogin: remoteAddress.serviceAddress + '/sso/operate/srvuser_login', // ms登录
  getUserAppMenu: remoteAddress.serviceAddress + "/auth/select/srvauth_user_app_menu_select", // 查询app模块
  getMenus: remoteAddress.serviceAddress + "/", // 查询菜单
  getFile: remoteAddress.serviceAddress + '/file/select/srvfile_attachment_select', //文件查询接口
  imgCode: "192.168.0.160:8101",



  getUserInfo: remoteAddress.ssoAddress + '/getUserInfo', // 用户信息
  // selectByUser: remoteAddress.serviceAddress + '/bxsys/selectByUser', // 用户菜单
  selectByUser: remoteAddress.serviceAddress + '/auth/select',
  selectOne: remoteAddress.serviceAddress + '/bxsys/selectOne', // 产品相关接口
  startProc: remoteAddress.serviceAddress + '/bxsys/startProc', // 流程开启
  approval: remoteAddress.serviceAddress + '/bxsys/approval', // 流程开启
  startDataProc: remoteAddress.serviceAddress + '/bxsys/startDataProc', // 流程子开启
  // add: remoteAddress.serviceAddress + '/bxsys/operate', // 新增
  add: remoteAddress.serviceAddress, // 新增

  update: remoteAddress.serviceAddress, // 修改
  delete: remoteAddress.serviceAddress + '/bxsys/operate', // 删除
  saveDraft: remoteAddress.serviceAddress + '/bxsys/saveDraft', // 保存草稿
  getLoginTicket: remoteAddress.ssoAddress + '/wx/getLoginTicket', // 获取登录sso凭证
  programlogin: remoteAddress.ssoAddress + "/programlogin", // 小程序登录 /programlogin;SSOSESSIONID=会话信息字符串值
  promoteQrcode: remoteAddress.ssoAddress + "/promoteQrcode", // 获取小程序二维码 ;SSOSESSIONID=会话信息字符串值?url=sdsfdsfdsfsdf&scene=sdfsffdfd
  getSeesionId: remoteAddress.serviceAddress + "/bxsys/getSeesionId", // 获取后端会话凭证 /getSeesionId?BXSSOCOOKIEID=SSO登录成功票据信息
  newuserlogin: remoteAddress.ssoAddress + "/newuserlogin", // 微信新用户登录接口
}
export default ENV
