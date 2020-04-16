<template>
  <view class="forum_detail_wrap">
    <view class="forum_detail">
      <!-- 发贴用户信息 -->
      <div class="poster_view">
        <uni-icons type="contact" size="60" color="#dd524d" v-if="!userImage"></uni-icons>
        <image :src="userImage" mode="" class="touxiang" v-if="userImage" style="width: 60px;height: 60px;"></image>
        <view class="user_info">
          <div class="account">
            <!-- 发帖人: -->
            <text class="username">{{ query.create_user }}</text>
          </div>
          <!-- <div class="state">状&nbsp;&nbsp;&nbsp;态:&nbsp;&nbsp;{{ query.note_status }}</div> -->
          <span class="time_date">{{ query.create_time }}</span>
        </view>
        <view class="guanzhu"></view>
      </div>

      <!-- 标题 -->
      <div class="title_view">
        <text class="title_text bold_text" v-if="query.note_title">{{ query.note_title }}</text>
        <text class="title_text bold_text" v-if="query.opinion_title">{{ query.opinion_title }}</text>
        <text class="title_text bold_text" v-if="query.bt">{{ query.bt }}</text>
        <text class="title_text bold_text" v-if="query.title">{{ query.title }}</text>
        <!-- <span class="time_date">时间：{{ query.create_time }}</span> -->
      </div>

      <!-- 内容 -->
      <!-- <rich-text :nodes=""></rich-text> -->
      <div v-if="query.content" class="content_view" v-html="query.content"></div>
      <div v-if="query.nr" class="content_view" v-html="JSON.parse(JSON.stringify(query.nr).replace(/\<img/gi, '<img width=100% height=100% '))"></div>

      <!-- 官方答复 -->
 <!--     <div class="little_title" v-if="query.ssp_no"><text>官方答复</text></div>
      <div class="reply_view" v-if="query.ssp_no">
        <div class="discuss_item" v-for="(item, index) in replyList" :key="index">
          <image :src="commentUserPhoto[item.create_user]" v-if="commentUserPhoto[item.create_user]" class="touxiang"></image>
          <uni-icons type="contact" size="60" color="#dd524d" v-if="!commentUserPhoto[item.create_user]"></uni-icons>
          <div class="text_box">
            <div class="user_info_box">
              <div class="user_info">{{ item.create_user }}</div>
            </div>
            <div class="content_box" v-html="item.content" v-if="item.content"></div>
            <div class="time_date_box">
              <div class="time_date">{{ item.create_time }}</div>
            </div>
          </div>
        </div>
      </div> -->
      <!-- 回复 -->
      <div class="little_title" v-if="query.opinion_no||query.ssp_no"><text>回复</text></div>
      <div class="little_title" v-else><text>网友留言</text></div>
      <div class="reply_view">
        <div style="color: #9E9E9E;" class="noddata" v-if="PostLeaveMeaasgeList && PostLeaveMeaasgeList.length <= 0">暂无评论</div>
        <div class="discuss_item" v-for="(item, index) in PostLeaveMeaasgeList" :key="index">
          <image :src="commentUserPhoto[item.create_user]" mode="" v-if="commentUserPhoto[item.create_user]" class="touxiang"></image>
          <image :src="item.head_img_path" v-if="item.head_img_path" class="touxiang"></image>
          <uni-icons type="contact" size="60" color="#dd524d" v-if="!item.head_img_path && !commentUserPhoto[item.create_user]"></uni-icons>
          <div class="text_box">
            <div class="user_info_box">
              <div class="user_info">{{ item.create_user }}</div>
              <div class="agree" v-if="!query.ssp_no&&!query.opinion_no">
                <!-- 留言点赞 -->
                <image :src="item.agree_icon" style="width: 16px;height: 16px;" @click="addAgree(item, item.praise_num, item.id)"></image>
                <uni-badge :text="item.praise_num ? item.praise_num : '0'" type="error" v-if="item.praise_num <= 99"></uni-badge>
                <uni-badge text="99+" type="error" v-else></uni-badge>
              </div>
            </div>
            <div class="content_box" v-html="item.content" v-if="item.content"></div>
            <div class="content_box" v-html="item.remark" v-if="item.remark"></div>
            <div class="content_box" v-html="item.nr" v-if="item.nr"></div>
            <div class="time_date_box">
              <div class="time_date">{{ item.create_time }}</div>
              <div class="settings_icon" v-if="item.create_user === userInfo.user_no && !commentUserPhoto[item.create_user]&&!query.opinion_no">
                <image src="../../static/img/shanchu.png" style="width: 16px;height: 16px;" @click="deleteItem(item.id)"></image>
              </div>
            </div>
          </div>
        </div>
      </div>
    </view>
    <div class="tool_bar" v-if="pbox">
      <textarea class="huifu" v-model="remark" placeholder="想对Ta说点什么..." />
      <button type="primary" class="huifu_btn" @click="writeBack" v-if="query.opinion_no">回复</button>
      <button type="primary" class="huifu_btn" @click="writeBack" v-else>留言</button>
      <!-- <input type="textarea" v-model="remark" class="huifu" placeholder="想对Ta说点什么..." /> -->
      <!-- 主贴点赞 -->
      <div class="main_agree" v-if="!query.opinion_no">
        <div class="agree">
          <image :src="agree_icon" style="width: 16px;height: 16px;" @click="addMainAgree(query, query.praise_num)"></image>
          <uni-badge type="error" :text="query.praise_num ? query.praise_num : '0'"></uni-badge>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
import uniBadge from '@/components/uni-badge/uni-badge.vue';
import uniIcons from '@/components/uni-icons/uni-icons.vue';
export default {
  components: { uniIcons, uniBadge },
  name: 'ForumDetail', // 论坛详情
  data() {
    return {
      appName: 'sqfw', //app
      serviceName: '', //select服务
      userInfo: {}, //账号用户信息
      userImage: '',
      note_user_info: {}, //发帖用户信息
      query: {},
      note_no: '',
      agree_icon: '../../static/img/agreeb.png',
      disagree_icon: '../../static/img/agreea.png',
      agree_status: false,
      backData: [],
      PostAgreePeopleList: [], //此贴所有点赞人记录
      PostLeaveMeaasgeList: [], //此贴下所有留言记录
      PostLeaveMeaasgeAgreeList: [], //此贴下所有留言的点赞记录
      agreePepoleList: [], //点赞人合集
      remark: '', //回复内容
      replyList: [], //答复列表
      commentUserPhoto: {},
      commentUserList: [],
      pbox: true
    };
  },
  onLoad: function(option) {
    uni.setNavigationBarTitle({
      title: '详情'
    });
    if (option.pbox) {
      this.pbox = false;
    } else {
      this.pbox = true;
    }
    if (option.no) {
      if (option.no.includes('LTFT')) {
        this.appName = 'zhdj';
        this.serviceName = 'srvzhsq_djlt_ftxx_select';
      } else {
        this.appName = 'sqfw';
        this.serviceName = 'srvzhsq_forum_note_select';
        if (option.no.includes('BX-SSP')) {
          this.serviceName = 'srvzhsq_bmfw_ssp_select';
        }
        if(option.no.includes('BX-YJ')){
          this.serviceName = 'srvzhsq_forum_opinion_select';
        }
      }
      this.note_no = option.no;
      this.getMainInfo();
      this.getWriteBackList(); // 获取留言列表
      this.getAgreePeopleList(this.note_no); // 查找点赞过此贴的人
    }
    let userInfo = uni.getStorageSync('userInfo');
    this.userInfo = userInfo;
  },

  methods: {
    getNoteUserInfo(reg) {
      // 获取发帖人信息
      let serviceName = '';
      let path = '';
      if (reg) {
        serviceName = 'srvzhsq_reg_select';
        path = '/sqfw/select/srvzhsq_reg_select';
      } else {
        serviceName = 'srvsso_user_select';
        path = '/sso/select/srvsso_user_select';
      }
      let url = this.$api.select + path;
      let req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [{ colName: 'user_no', ruleType: 'eq', value: this.query.create_user }],
        order: []
      };
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS' && res.data.data) {
          this.note_user_info = res.data.data[0];
          this.getTouxiangPath(this.note_user_info.photo_url);
        }
      });
    },
    getTouxiangPath(photoUrl) {
      // 获取头像路径
      let imgId = photoUrl ? photoUrl : this.query.head_img;
      let url = this.$api.select + '/file/select/srvfile_attachment_select';
      let req = {
        colNames: ['*'],
        condition: [
          {
            colName: 'file_no',
            ruleType: 'eq',
            value: imgId // 图片编号
          }
        ],
        serviceName: 'srvfile_attachment_select'
      };

      this.$http.post(url, req).then(res => {
        if (res.data.data && res.data.data.length > 0) {
          this.note_user_info['head_img'] = this.$api.select + '/file/download?filePath=' + res.data.data[0].fileurl;
          this.userImage = this.$api.select + '/file/download?filePath=' + res.data.data[0].fileurl;
          console.log('photo_url', this.userImage);
        }
      });
    },
    getMainInfo() {
      // 查找主贴相关数据
      let note_no = this.note_no;
      let url = this.$api.select + '/' + this.appName + '/select/' + this.serviceName;
      let colName = '';
      if (this.appName === 'zhdj') {
        colName = 'ftno';
      } else {
        if (this.serviceName === 'srvzhsq_bmfw_ssp_select') {
          colName = 'ssp_no';
        } else if(this.serviceName === 'srvzhsq_forum_opinion_select'){
          colName = 'opinion_no'
        }else {
          colName = 'note_no';
        }
      }
      let req = { serviceName: this.serviceName, colNames: ['*'], condition: [{ colName: colName, ruleType: 'like', value: note_no }], order: [] };
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS' && res.data.data) {
          let data = res.data.data[0];
          if (data.nr && data.nr.indexOf('<img') != -1) {
            data.nr = JSON.parse(JSON.stringify(data.nr).replace(/\<img/gi, '<img width=100% height=100% '));
          }
          if (data.content && data.content.indexOf('<img') != -1) {
            data.content = JSON.parse(JSON.stringify(data.content).replace(/\<img/gi, '<img width=100% height=100% '));
          }
          this.query = data;
          console.log(data);
          // this.query.content = JSON.parse(JSON.stringify(this.query.content).replace(/\<img/gi, '<img width=100% height=100% '));
          this.getNoteUserInfo(); //查找此贴发帖人信息
          this.getTouxiangPath(); // 查找发帖人头像
          this.getAgreePeopleList(this.note_no);
          this.getReplyInfo();
        }
      });
    },
    getAgreePeopleList(note_no) {
      // 查找赞过此贴的人的列表
      let serviceName = 'srvzhsq_forum_praise_select';
      let colName = 'note_no';
      if (this.appName === 'zhdj') {
        serviceName = 'srvzhsq_djlt_ftxx_praise_select';
        colName = 'ftno';
      }
      if (this.serviceName === 'srvzhsq_bmfw_ssp_select') {
        colName = 'ssp_no';
        serviceName = 'srvzhsq_bmfw_ssppraise_select';
      }
      let url = this.$api.select + '/'+this.appName+'/select/' + serviceName;
      let req = { serviceName: serviceName, colNames: ['*'], condition: [{ colName: colName, ruleType: 'like', value: note_no }] };
      this.$http.post(url, req).then(res => {
        if (res.data.data) {
          this.agreePepoleList = res.data.data;
          // 得到此贴所有点赞人的集合
          let userList = this.agreePepoleList;
          let userInfo = uni.getStorageSync('userInfo');
          userList = userList.map(users => {
            return users.praise_user;
          });
          console.log(userList, userInfo.user_no);
          if (userList.indexOf(userInfo.user_no) != -1) {
            console.log(userInfo, userInfo.user_no);
            this.agree_icon = '../../static/img/agreea.png';
            this.agree_status = true;
          } else {
            this.agree_icon = '../../static/img/agreeb.png';
            this.agree_status = false;
          }
        }
      });
    },
    // async getAgreePeopleForLiuYan(leave_no) {
    // 	// 获取赞过此条留言的人的列表
    // 	let url = this.$api.select + '/sqfw/select/srvzhsq_leaveword_praise_select';
    // 	let req = {
    // 		serviceName: 'srvzhsq_leaveword_praise_select',
    // 		colNames: ['*'],
    // 		condition: [
    // 			{
    // 				colName: 'leave_no',
    // 				ruleType: 'eq',
    // 				value: leave_no // 留言编号
    // 			}
    // 		]
    // 	};
    // 	let res = await this.$http.post(url, req);
    // 	if (res.data.data) {
    // 		console.log('留言点赞信息：', res.data.data);
    // 		let data = res.data.data;
    // 		let arr = data.map(item => {
    // 			return item.praise_user;
    // 		});
    // 		return arr;
    // 	}
    // },
    getAgreePeopleForLeaveMessage(msgData) {
      // 获取赞过此条留言的人的列表
      let serviceName = 'srvzhsq_leaveword_praise_select';
      let colName = 'leave_no';
      if (this.appName === 'zhdj') {
        serviceName = 'srvzhsq_djlt_lyjl_praise_select';
        colName = 'lyno';
      }
      let url = this.$api.select + '/' + this.appName + '/select/' + serviceName;
      let req = {};
      let userInfo = this.userInfo;
      let arr = [];
      msgData.map(msg => {
        req = {
          serviceName: 'srvzhsq_leaveword_praise_select',
          colNames: ['*'],
          condition: [
            {
              colName: 'colName',
              ruleType: 'eq',
              value: msg.leave_no // 留言编号
            }
          ],
          order: [{ colName: 'create_time', orderType: 'desc' }]
        };
        this.$http
          .post(url, req)
          .then(resp => {
            if (resp.data.data) {
              let data = resp.data.data;
              let arr = data.map(item => {
                return item.praise_user;
              });
              msg['agreePeople'] = arr;
              if (arr.indexOf(userInfo.user_no) != -1) {
                msg['agree_icon'] = '../../static/img/agreea.png';
                this.agree_status = true
              } else {
                this.agree_status = false
                msg['agree_icon'] = '../../static/img/agreeb.png';
              }
            }
          })
          .then(() => {
            arr.push(msg);
            this.backData = arr;
          });
      });
    },
    addAgreePeople() {
      // 在点赞信息表中增加此账号对此贴的点赞信息
      let serviceName = 'srvzhsq_forum_praise_add';
      if (this.appName === 'zhdj') {
        serviceName = 'srvzhsq_djlt_ftxx_praise_add';
      }
      if (this.serviceName === 'srvzhsq_bmfw_ssp_select') {
        serviceName = 'srvzhsq_bmfw_ssppraise_add';
      }
      let url = this.$api.select + '/' + this.appName + '/operate/' + serviceName;
      let userInfo = uni.getStorageSync('userInfo');
      console.log(userInfo);
      let req = [{ serviceName: serviceName, condition: [], data: [{ note_no: this.note_no, praise_user: userInfo.user_no }] }];
      if (this.appName === 'zhdj') {
        req = [{ serviceName: serviceName, condition: [], data: [{ ftno: this.note_no, praise_user: userInfo.user_no }] }];
      }
      if (this.serviceName === 'srvzhsq_bmfw_ssp_select') {
        req = [{ serviceName: serviceName, condition: [], data: [{ ssp_no: this.note_no, praise_user: userInfo.user_no }] }];
      }
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS') {
          // this.getWriteBackList();
          console.log('点赞成功');
          this.getMainInfo();
          this.getAgreePeopleList(this.note_no);
        }
      });
    },
    delAgreePeople() {
      // 在点赞信息表中删除此账号对此贴的点赞信息
      let serviceName = 'srvzhsq_forum_praise_delete';
    // serviceName = 'srvzhsq_forum_praise_praise_num_delete';
      let colName = 'note_no';
      if (this.appName == 'zhdj') {
        serviceName = 'srvzhsq_djlt_ftxx_praise_delete';
        // serviceName = 'srvzhsq_djlt_ftxx_praise_praise_num_delete'
        colName = 'ftno';
      }
      if (this.serviceName === 'srvzhsq_bmfw_ssp_select') {
        serviceName = 'srvzhsq_bmfw_ssppraise_delete';
        colName = 'ssp_no';
      }
      let url = this.$api.select + '/' + this.appName + '/operate/' + serviceName;
      let userInfo = this.userInfo;
      let req = [
        {
          serviceName: serviceName,
          condition: [{ colName: 'praise_user', ruleType: 'eq', value: userInfo.user_no }, { colName: colName, ruleType: 'eq', value: this.note_no }]
        }
      ];
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS') {
          // this.getWriteBackList();
          console.log('删除点赞成功');
          this.getMainInfo();
          this.getAgreePeopleList(this.note_no);
        }
      });
    },
    addAgree(item, num, id) {
      console.log('-------触发回帖点赞-------\n', item);
      let leave_no = '';
      if (this.appName == 'zhdj') {
        leave_no = item.lyno;
      } else {
        leave_no = item.leave_no;
      }
      if (item.agreePeople.indexOf(this.userInfo.user_no) != -1) {
        //如果此评论点赞人列表中有当前登录用户,已经点过赞,则此次点赞事件为取消点赞
        num--;
        // this.delDiscussAgreePeople(leave_no);
      } else {
        // this.addDiscussAgreePeople(leave_no);
        num++;
      }
      this.updateLeaveMessageInfo(id, num, item,leave_no);
    },

    /**
     * @param  id
     * @param  num
     */
    updateLeaveMessageInfo(id, num, item,leave_no) {
      // 修改留言信息
      let serviceName = 'srvzhsq_leave_word_update';
      serviceName = 'srvzhsq_leave_word_praise_num_update'
      if (this.appName === 'zhdj') {
        serviceName = 'srvzhsq_djlt_lyjl_update';
        serviceName = 'srvzhsq_djlt_lyjl_praise_num_update'
      }
      let url = this.$api.select + '/' + this.appName + '/operate/' + serviceName;
      let req = [{ serviceName: serviceName, condition: [{ colName: 'id', ruleType: 'eq', value: id }], data: [{ praise_num: num }] }];
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS') {
          if (item.agreePeople.indexOf(this.userInfo.user_no) != -1) {
            //如果此评论点赞人列表中有当前登录用户,已经点过赞,则此次点赞事件为取消点赞
            // num--;
            this.delDiscussAgreePeople(leave_no);
          } else {
            this.addDiscussAgreePeople(leave_no);
            // num++;
          }
          // this.getWriteBackList();
        }
      });
    },
    delDiscussAgreePeople(leave_no) {
      // 删除当前登录账号对当前评论的点赞记录
      let serviceName = 'srvzhsq_leaveword_praise_delete';
   // serviceName = 'srvzhsq_leaveword_praise_praise_num_delete';
      if (this.appName === 'zhdj') {
        serviceName = 'srvzhsq_djlt_lyjl_praise_delete';
        // serviceName = 'srvzhsq_djlt_lyjl_praise_praise_num_delete';
      }
      let url = this.$api.select + '/' + this.appName + '/operate/' + serviceName;
      let userInfo = uni.getStorageSync('userInfo');
      console.log(userInfo);
      let req = [
        {
          serviceName: serviceName,
          condition: [
            { colName: 'leave_no', ruleType: 'eq', value: leave_no },
            { colName: 'note_no', ruleType: 'eq', value: this.note_no },
            { colName: 'praise_user', ruleType: 'eq', value: this.userInfo.user_no }
          ]
        }
      ];
      if (this.appName === 'zhdj') {
        req = [
          {
            serviceName: serviceName,
            condition: [
              { colName: 'lyno', ruleType: 'eq', value: leave_no },
              { colName: 'ftno', ruleType: 'eq', value: this.note_no },
              { colName: 'praise_user', ruleType: 'eq', value: this.userInfo.user_no }
            ]
          }
        ];
      }
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS') {
          this.getWriteBackList();
          console.log('删除成功');
        }
      });
    },
    addDiscussAgreePeople(leave_no) {
      // 增加当前登录账号对当前评论的点赞记录
      let serviceName = 'srvzhsq_leaveword_praise_add';
      if (this.appName === 'zhdj') {
        serviceName = 'srvzhsq_djlt_lyjl_praise_add';
      }
      let url = this.$api.select + '/' + this.appName + '/operate/' + serviceName;
      let userInfo = uni.getStorageSync('userInfo');
      console.log(userInfo);
      let req = [{ serviceName: 'srvzhsq_leaveword_praise_add', condition: [], data: [{ leave_no: leave_no, praise_user: userInfo.user_no }] }];
      if (this.appName === 'zhdj') {
        req = [{ serviceName: 'srvzhsq_djlt_lyjl_praise_add', condition: [], data: [{ lyno: leave_no, praise_user: userInfo.user_no }] }];
      }
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS') {
          this.getWriteBackList();
          console.log('增加成功');
        }
      });
    },
    addMainAgree(item, num, no) {
      // this.getAgreePeopleList(this.note_no)
      // 主贴点赞
      if (this.query.proc_status) {
        if (this.query.proc_status !== '完成') {
          uni.showToast({
            title: '当前帖子状态为[' + this.query.proc_status + '], 不可以进行点赞',
            icon: 'none',
            duration: 3000
          });
          return;
        } else {
          this.agree_status = !this.agree_status;
          if (this.agree_status) {
            this.agree_icon = '../../static/img/agreea.png';
            num++;
            // this.addAgreePeople();
          } else {
            this.agree_icon = '../../static/img/agreeb.png';
            num--;
            // this.delAgreePeople();
          }
          let serviceName = 'srvzhsq_forum_note_update';
          serviceName = 'srvzhsq_forum_note_praise_num_update'
          let colName = 'note_no';
          if (this.appName === 'zhdj') {
            serviceName = 'srvzhsq_djlt_ftxx_update';
            serviceName = 'srvzhsq_djlt_ftxx_praise_num_update';
            colName = 'ftno';
          }
          let url = this.$api.select + '/' + this.appName + '/operate/' + serviceName;
          if (this.serviceName === 'srvzhsq_bmfw_ssp_select') {
            colName = 'ssp_no';
            this.appName = 'sqfw';
            serviceName = 'srvzhsq_bmfw_ssp_praise_num_update';
          }
          url = this.$api.select + '/' + this.appName + '/update/' + serviceName;
          let req = [{ serviceName: serviceName, condition: [{ colName: colName, ruleType: 'eq', value: this.note_no }], data: [{ praise_num: num }] }];
          this.$http.post(url, req).then(res => {
            if (res.data.state === 'SUCCESS') {
              if (this.agree_status) {
                // this.agree_icon = '../../static/img/agreea.png';
                // num++;
                this.addAgreePeople();
              } else {
                // this.agree_icon = '../../static/img/agreeb.png';
                // num--;
                this.delAgreePeople();
              }
              // this.getMainInfo();
            }
          });
        }
      }
    },
    async getWriteBackList() {
      // 获取留言列表
      let leaveServiceName = 'srvzhsq_leave_word_select';
      let colName = 'note_no';
      if (this.appName === 'zhdj') {
        leaveServiceName = 'srvzhsq_djlt_lyjl_select';
        colName = 'ftno';
      }
      if (this.serviceName === 'srvzhsq_bmfw_ssp_select') {
        colName = 'ssp_no';
        leaveServiceName = 'srvzhsq_bmfw_ssply_select';
      }
      if (this.serviceName === 'srvzhsq_forum_opinion_select') {
        colName = 'opinion_no';
        leaveServiceName = 'srvzhsq_forum_opinion_comment_select';
      }
      let url = this.$api.select + '/' + this.appName + '/select/' + leaveServiceName;
      let req = {
        serviceName: leaveServiceName,
        colNames: ['*'],
        condition: [{ colName: colName, ruleType: 'eq', value: this.note_no }],
        // page: { pageNo: 1, rownumber: 10 },
        order: [{ colName: 'create_time', orderType: 'desc' }]
      };
      let res = await this.$http.post(url, req);
      if (res.data.data) {
        let data = res.data.data;
        data.map(d => {
          if (d.nr && d.nr.indexOf('<img') != -1) {
            data.nr = JSON.parse(JSON.stringify(data.nr).replace(/\<img/gi, '<img width=100% height=100% '));
          }
          if (d.remark && d.remark.indexOf('<img') != -1) {
            data.remark = JSON.parse(JSON.stringify(data.remark).replace(/\<img/gi, '<img width=100% height=100% '));
          }
        });
        if (this.serviceName === 'srvzhsq_bmfw_ssp_select') {
          this.PostLeaveMeaasgeList = data;
          this.setCommentPhotoUrl();
        } else {
          let PostLeaveMeaasgeList = data; // 此贴所有留言记录
          this.getPostLeaveMeaasgeAgreeList(data).then(PostLeaveMeaasgeList => {
            this.PostLeaveMeaasgeList = PostLeaveMeaasgeList;
          });
        }
      }
    },
    replyLeaveMessage() {
      // 回复留言(评论)/评论留言(评论)
    },
    writeBack() {
      // 留言/评论
      if (this.query.proc_status) {
        if (this.query.proc_status !== '完成') {
          uni.showToast({
            title: '当前帖子状态为[' + this.query.proc_status + '], 不可以进行评论',
            icon: 'none',
            duration: 3000
          });
          return;
        }
      }
      let str = this.remark;
      str = str.replace(/\s*/g, '');
      if (!str) {
        uni.showToast({
          title: '请输入文字',
          icon: 'none'
        });
        this.remark = '';
        return;
      }
      let serviceName = 'srvzhsq_leave_word_add';
      if (this.appName === 'zhdj') {
        serviceName = 'srvzhsq_djlt_lyjl_add';
      }
      if (this.query.ssp_no) {
        serviceName = 'srvzhsq_bmfw_ssply_add';
      }
      if (this.serviceName === 'srvzhsq_forum_opinion_select') {
        serviceName = 'srvzhsq_forum_opinion_comment_add';
      }
      let url = this.$api.select + '/' + this.appName + '/operate/' + serviceName;
      let req = [
        {
          serviceName: serviceName,
          condition: [],
          data: [
            {
              leave_title: this.getDateTime(),
              note_no: this.note_no,
              leave_time: this.getDateTime(),
              leave_type: '留言',
              adopt_state: '否',
              type: '留言',
              leave_user: this.userInfo.user_no,
              praise_num: 0,
              head_img_path: this.userInfo.head_img_path ? this.userInfo.head_img_path : '',
              remark: this.remark
            }
          ]
        }
      ];
      if (this.appName === 'zhdj') {
        req = [
          {
            serviceName: serviceName,
            condition: [],
            data: [
              {
                bt: this.getDateTime(),
                ftno: this.note_no,
                lytime: this.getDateTime(),
                lylx: '留言',
                adopt_state: '是',
                lyr: this.userInfo.user_no,
                praise_num: 0,
                head_img_path: this.userInfo.head_img_path ? this.userInfo.head_img_path : '',
                nr: this.remark
              }
            ]
          }
        ];
      }
      if (serviceName === 'srvzhsq_bmfw_ssply_add') {
        req = [
          {
            serviceName: 'srvzhsq_bmfw_ssply_add',
            condition: [],
            data: [{ ssp_no: this.query.ssp_no, title: '随手拍留言', content: this.remark, top_state: '未置顶', ssply_user: this.userInfo.user_no }]
          }
        ];
      }
      if (serviceName === 'srvzhsq_forum_opinion_comment_add') {
        req = [
          {
            serviceName: 'srvzhsq_forum_opinion_comment_add',
            condition: [],
            data: [{ opinion_no: this.query.opinion_no, content: this.remark, comment_user: this.userInfo.user_no,comment_time:this.getDateTime() }]
          }
        ];
      }
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS') {
          uni.showToast({
            title: '评论成功',
            duration: 1000
          });
          this.remark = '';
          this.getWriteBackList();
        }
      });
    },
    setCommentPhotoUrl() {
      // 设置随手拍留言人的头像路径
      let list = this.PostLeaveMeaasgeList;
      let commentUserList = list.map(item => item.create_user);
      commentUserList = Array.from(new Set(commentUserList));
      console.log('commentUserList', commentUserList);
      let serviceName = 'srvsso_user_select';
      let req = {
        serviceName: serviceName,
        colNames: ['*']
      };
      let that = this;
      let commentArr = [];
      let url = this.$api.select + '/sso/select/' + serviceName;
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS') {
          let data = res.data.data;
          commentArr = data.filter(item => commentUserList.includes(item.user_no));
          console.log('commentArr', commentArr[0]);
          this.commentUserList = commentArr;
          commentArr.map(item => {
            console.log('item', item);
            if (item.photo_url) {
              this.getPhotoUrl(item.photo_url).then(urls => {
                if (urls) {
                  item['photoPath'] = urls;
                  that.$set(that.commentUserPhoto, item.user_no, urls);
                }
              });
            }
          });
        }
      });
    },
    /**@function 查询用户头像 */
    async getPhotoUrl(url_no) {
      let url1 = this.$api.select + '/file/select/srvfile_attachment_select';
      let req = {
        colNames: ['*'],
        condition: [
          {
            colName: 'file_no',
            ruleType: 'eq',
            value: url_no // 图片编号
          }
        ],
        serviceName: 'srvfile_attachment_select'
      };
      let res = await this.$http.post(url1, req);
      if (res.data.data) {
        console.log(res.data.data);
        let url = this.$api.select + '/file/download?filePath=' + res.data.data[0].fileurl;
        console.log(url);
        return url;
      } else {
        return null;
      }

      // });
    },
    deleteItem(id) {
      // 删除回复
      uni.showModal({
        title: '确认删除此条评论？',
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定');
            let serviceName = 'srvzhsq_leave_word_delete';
            if (this.appName === 'zhdj') {
              serviceName = 'srvzhsq_djlt_lyjl_delete';
            }
            let url = this.$api.select + '/' + this.appName + '/operate/' + serviceName;
            let req = [{ serviceName: serviceName, condition: [{ colName: 'id', ruleType: 'in', value: id }] }];
            this.$http.post(url, req).then(ress => {
              if (ress.data.state === 'SUCCESS') {
                uni.showToast({
                  title: '删除成功!',
                  duration: 1000
                });
                this.getWriteBackList();
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },

    async getPostLeaveMeaasgeAgreeList(PostLeaveMeaasgeList) {
      // 获取此贴下所有留言的点赞记录
      let serviceName = 'srvzhsq_leaveword_praise_select';
      let colName = 'note_no';
      if (this.appName === 'zhdj') {
        serviceName = 'srvzhsq_djlt_lyjl_praise_select';
        colName = 'ftno';
      }
      if (this.serviceName === 'srvzhsq_forum_opinion_select') {
        
      }
      let url = this.$api.select + '/' + this.appName + '/select/' + serviceName;
      let req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [
          {
            colName: colName,
            ruleType: 'eq',
            value: this.note_no // 帖子编号
          }
        ],
        order: [{ colName: 'create_time', orderType: 'desc' }]
      };
      let res = await this.$http.post(url, req);
      if (res.data.data) {
        let PostLeaveMeaasgeAgreeList = res.data.data;
        console.log('data,resdata', PostLeaveMeaasgeList, PostLeaveMeaasgeAgreeList);
        // let PostLeaveMeaasgeList = this.PostLeaveMeaasgeList
        PostLeaveMeaasgeList.map(item => {
          item.agreePeople = [];
          item.agree_icon = '../../static/img/agreeb.png';
          PostLeaveMeaasgeAgreeList.map(item2 => {
            if (this.appName === 'zhdj') {
              if (item2.lyno === item.lyno && item2.ftno === item.ftno && item2.create_user === this.userInfo.user_no) {
                // 若此条点赞记录的留言编号和帖子编号与此条留言的一致,并且此条点赞记录的创建人是当前登录用户,则此条留言已点赞状态
                item.agree_icon = '../../static/img/agreea.png';
                item.agreePeople.push(item2.create_user);
              }
            } else {
              if (item2.leave_no === item.leave_no && item2.note_no === item.note_no && item2.create_user === this.userInfo.user_no) {
                // 若此条点赞记录的留言编号和帖子编号与此条留言的一致,并且此条点赞记录的创建人是当前登录用户,则此条留言已点赞状态
                item.agree_icon = '../../static/img/agreea.png';
                item.agreePeople.push(item2.create_user);
              }
            }
          });
        });
        return PostLeaveMeaasgeList;
        console.log('PostLeaveMeaasgeList:', PostLeaveMeaasgeList);
      }
    },
    getReplyInfo() {
      // 查找当前随手拍官方回复信息
      let ssp_no = this.note_no;
      let serviceName = 'srvzhsq_bmfw_sspdf_select';
      let url = this.$api.select + '/' + this.appName + '/select/' + serviceName;
      let req = {
        serviceName: serviceName,
        colNames: ['*'],
        condition: [{ colName: 'ssp_no', ruleType: 'like', value: ssp_no }],
        // page: {
        //   pageNo: 1,
        //   rownumber: 10
        // },
        order: []
      };
      this.$http.post(url, req).then(res => {
        console.log(res.data.data);
        if (res.data.data) {
          this.replyList = res.data.data;
        }
      });
    },
    getDateTime() {
     return new Date().toLocaleDateString().replace(/\//g, '-') + ' ' + new Date().toTimeString().slice(0, 8)
      // let date = new Date();
      // let h = date.getHours();
      // let m = date.getMinutes();
      // let s = date.getSeconds();
      // let yy = date.getFullYear();
      // let mm = date.getMonth() + 1;
      // let dd = date.getDay();
      // console.log(yy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s);
      // return yy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s;
    }
  }
};
</script>

<style lang="scss" scoped>
.forum_detail_wrap {
  width: 100%;
  position: relative;
  background-color: #f1f1f1;
  overflow: hidden;
}
.forum_detail {
  animation: 1.2s ease 0s 1 normal none running show;
  display: flex;
  width: 95%;
  margin: 0 auto;
  flex-direction: column;
  .touxiang {
    width: 100upx;
    height: 100upx;
    padding: 10upx;
    border-radius: 100%;
    margin-right: 10upx;
  }
  .title_view {
    display: flex;
    background-color: #fff;
    flex-direction: column;
    width: 100%;
    text-align: left;
    box-shadow: 0 2px 12px 0 rgba($color: #e54d42, $alpha: 0.1);
    margin: 30upx auto 0;
    border-bottom: 1px solid #efefef;
    border-top-left-radius: 10upx;
    border-top-right-radius: 10upx;
    .title_text {
      width: calc(100% - 40upx);
      padding: 0 20upx;
    }
    .time_date {
      text-indent: 1rem;
      color: #888888;
      font-size: 20upx;
      font-weight: 300;
    }
  }
  .poster_view {
    margin-top: 20upx;
    border-radius: 4px;
    height: 150upx;
    display: flex;
    background-color: #fff;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .user_info {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0 20upx;
      .username {
        font-weight: 600;
        font-size: 36upx;
        // margin-left: 20upx;
      }
      .state {
        font-size: 28upx;
      }
      .time_date {
        color: #666;
        font-size: 20upx;
        font-weight: 300;
      }
    }
  }
  .content_view {
    background-color: #fff;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    // width: calc(100% - 20upx);
    min-height: 200upx;
    margin: 0 0;
    padding: 20upx;
    border-radius: 5px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    // /deep/ img {
    // 	height: 230px;
    // }
  }
  .main_agree {
    display: flex;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    width: calc(100% - 40upx);
    min-height: 50upx;
    padding: 20upx;
    border-radius: 5px;
    .agree {
      width: 100upx;
      display: flex;
      justify-content: center;
      align-items: center;
      .text {
        font-size: 24upx;
        font-weight: 600;
        padding: 0 20upx;
      }
    }
  }
  .little_title {
    font-size: 24upx;
    font-weight: 600;
    margin-top: 50upx;
    height: 80upx;
    line-height: 80upx;
    background-color: #fff;
    text-indent: 0.5rem;
    text {
      padding-left: 0.5rem;
      border-left: 2px solid #e51c23;
    }
  }
  .reply_view {
    width: 100%;
    background-color: #fff;
    min-height: 200upx;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    &:last-child {
      margin-bottom: 150upx;
    }
    .noddata {
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 200upx;
    }
    .discuss_item {
      width: 100%;
      min-height: 150upx;
      display: flex;
      border-bottom: 1px solid #d8d8d8;
      padding-top: 10upx;
      &:last-child {
        border-bottom: none;
      }
      .text_box {
        flex: 1;
        min-height: 150upx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .user_info_box {
          width: calc(100% - 20upx);
          display: flex;
          margin-right: 20upx;
          justify-content: space-between;
          .user_info {
            color: #dd524d;
            font-size: 26upx;
            line-height: 40upx;
          }
          .agree {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100upx;
            height: 50upx;
            image {
              margin: 0 5upx;
            }
          }
        }
        .content_box {
          flex: 1;
          width: calc(100% - 20upx);
          margin: 10upx 0 20upx;
          margin-right: 20upx;
          font-size: 28upx;
          line-height: 32upx;
        }
        .time_date_box {
          width: calc(100% - 20upx);
          margin-right: 20upx;
          display: flex;
          font-size: 20upx;
          justify-content: space-between;
          color: #888888;
        }
      }
    }
  }

  .bold_text {
    font-weight: bold;
    font-size: 34upx;
  }
}
.tool_bar {
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  position: fixed;
  background-color: #fff;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  // width: calc(100% - 40upx);
  height: 80upx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20upx;
  .huifu {
    border-radius: 30upx;
    height: 60upx;
    line-height: 60upx;
    width: 60%;
    max-width: 80%;
    // margin-right: 50upx;
    text-indent: 1rem;
    font-size: 26upx;
    border: 1px solid #e0e0e0;
  }
  .huifu_btn {
    line-height: 50upx;
    height: 50upx;
    font-size: 26upx;
    margin: 0;
  }
  .agree {
    display: flex;
    justify-content: center;
    align-items: center;
    uni-image {
      padding-right: 5upx;
    }
    .text {
      font-size: 24upx;
      font-weight: 600;
      padding: 0 20upx;
    }
  }
}

@keyframes show {
  0% {
    transform: translateY(-50px);
  }
  60% {
    transform: translateY(20px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
