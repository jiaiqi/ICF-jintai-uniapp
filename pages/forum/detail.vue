<template>
  <view class="forum_detail_wrap">
    <view class="forum_detail">
      <!-- 标题 -->
      <div class="title_view">
        <text class="title_text bold_text">{{ query.note_title }}</text>
        <span class="time_date">时间：{{ query.create_time }}</span>
      </div>

      <!-- 发贴用户信息 -->
      <div class="poster_view">
        <uni-icons type="contact" size="60" color="#dd524d" v-if="!userImage"></uni-icons>
        <image :src="userImage" mode="" class="touxiang" v-if="userImage"></image>
        <view class="user_info">
          <div class="account">
            发帖人:
            <text class="username">{{ query.create_user }}</text>
          </div>
          <div class="state">状&nbsp;&nbsp;&nbsp;态:&nbsp;&nbsp;{{ query.note_status }}</div>
        </view>
      </div>

      <!-- 内容 -->
      <div v-if="query.content" class="content_view" v-html="query.content"></div>
      <!-- 主贴点赞 -->
      <div class="main_agree">
        <div class="agree">
          <text class="text">赞一下</text>
          <image :src="agree_icon" mode="" style="width: 16px;height: 16px;" @click="addMainAgree(query, query.praise_num, query.note_no)"></image>
          <uni-badge type="error" :text="query.praise_num ? query.praise_num : '0'"></uni-badge>
        </div>
      </div>

      <!-- 回复 -->
      <div class="little_title">评论</div>
      <div class="reply_view">
        <div class="noddata" v-if="backData.length <= 0">暂无评论</div>
        <div class="discuss_item" v-for="(item, index) in backData" :key="index">
          <!-- <image src="" mode="" class="touxiang"></image> -->
          <uni-icons type="contact" size="60" color="#dd524d"></uni-icons>
          <div class="text_box">
            <div class="user_info_box">
              <div class="user_info">{{ item.create_user }}</div>
              <div class="agree">
                <image :src="item.agree_icon" mode="" style="width: 16px;height: 16px;" @click="addAgree(item, item.praise_num, item.id)"></image>
                <uni-badge :text="item.praise_num ? item.praise_num : '0'" type="error" v-if="item.praise_num <= 99"></uni-badge>
                <uni-badge text="99+" type="error" v-else></uni-badge>
              </div>
            </div>
            <div class="content_box" v-html="item.remark"></div>
            <div class="time_date_box">
              <div class="time_date">{{ item.create_time }}</div>
              <div class="settings_icon" v-if="item.create_user === userInfo.user_no">
                <image src="../../static/img/shanchu.png" style="width: 16px;height: 16px;" @click="deleteItem(item.id)"></image>
              </div>
            </div>
          </div>
        </div>
      </div>
    </view>
    <div class="tool_bar">
      <input type="text" v-model="remark" class="huifu" placeholder="想对Ta说点什么..." />
      <button type="primary" class="huifu_btn" @click="writeBack">回复</button>
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
      userInfo: {}, //账号用户信息
      userImage: '',
      note_user_info: {}, //发帖用户信息
      query: {},
      note_no: '',
      agree_icon: '../../static/img/agreeb.png',
      disagree_icon: '../../static/img/agreea.png',
      agree_status: false,
      backData: [],
      agreePepoleList: [], //点赞人合集
      remark: '' //回复内容
    };
  },
  onLoad: function(option) {
    uni.setNavigationBarTitle({
      title: '详情'
    });
    if (option) {
      // let query = JSON.parse(option.query);
      // console.log('query:', query);
      // this.query = query;
      this.note_no = option.no;
      // this.note_no = query.note_no;
      this.getMainInfo();
      this.getWriteBackList(); // 获取留言列表
      uni.setNavigationBarTitle({
        title: '详情'
      });
      this.getAgreePeopleList(this.note_no);
    }
    let userInfo = uni.getStorageSync('userInfo');
    this.userInfo = userInfo;
  },
  methods: {
    getNoteUserInfo() {
      // 获取发帖人信息
      let url = this.$api.select + '/sso/select/srvsso_user_select';
      let req = {
        serviceName: 'srvsso_user_select',
        colNames: ['*'],
        condition: [{ colName: 'user_no', ruleType: 'eq', value: this.query.create_user }],
        order: []
      };
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS' && res.data.data) {
          console.log(res.data.data[0]);
          this.note_user_info = res.data.data[0];
        }
      });
    },
    getTouxiangPath() {
      // 获取头像路径
      let imgId = this.query.head_img;
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
        console.log(res.data.data[0].fileurl);
        if (res.data.data) {
          this.note_user_info['head_img'] = this.$api.select + '/file/download?filePath=' + res.data.data[0].fileurl;
          this.userImage = this.$api.select + '/file/download?filePath=' + res.data.data[0].fileurl;
        }
      });
    },
    getMainInfo() {
      // 查找主贴相关数据
      let note_no = this.note_no;
      let url = this.$api.select + '/sqfw/select/srvzhsq_forum_note_select';
      let req = { serviceName: 'srvzhsq_forum_note_select', colNames: ['*'], condition: [{ colName: 'note_no', ruleType: 'like', value: note_no }], order: [] };
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS' && res.data.data) {
          this.query = res.data.data[0];
          this.getNoteUserInfo(); //查找此贴发帖人信息
          this.getTouxiangPath(); // 查找发帖人头像
          this.getAgreePeopleList(this.note_no);
        }
      });
    },
    getAgreePeopleList(note_no) {
      // 查找赞过此贴的人的列表
      let url = this.$api.select + '/sqfw/select/srvzhsq_forum_praise_select';
      let req = { serviceName: 'srvzhsq_forum_praise_select', colNames: ['*'], condition: [{ colName: 'note_no', ruleType: 'like', value: note_no }] };
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
            this.agree_icon = '../../static/img/agreea.png';
            this.agree_status = true;
          } else {
            this.agree_icon = '../../static/img/agreeb.png';
            this.agree_status = false;
          }
        }
      });
    },
    getAgreePeopleForLiuYan(leave_no) {
      // 获取赞过此条留言的人的列表
      let url = this.$api.select + '/sqfw/select/srvzhsq_leaveword_praise_select';
      let req = {
        serviceName: 'srvzhsq_leaveword_praise_select',
        colNames: ['*'],
        condition: [
          {
            colName: 'leave_no',
            ruleType: 'eq',
            value: leave_no // 图片编号
          }
        ]
      };
      this.$http.post(url, req).then(res => {
        console.log(res.data.data);
        let data = res.data.data;
        let arr = [];
        data.map(d => {
          arr.push(d.praise_user);
        });
      });
    },
    addAgreePeople() {
      // 在点赞信息表中增加此账号对此贴的点赞信息
      let url = this.$api.select + '/sqfw/operate/srvzhsq_forum_praise_add';
      let userInfo = uni.getStorageSync('userInfo');
      console.log(userInfo);
      let req = [
        { serviceName: 'srvzhsq_forum_praise_add', condition: [], data: [{ note_no: 'BX-NT201911270053', praise_user: userInfo.user_no, praise_time: this.getDateTime() }] }
      ];
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS') {
          // this.getWriteBackList();
          console.log('点赞成功');
        }
      });
    },
    delAgreePeople() {
      // 在点赞信息表中删除此账号对此贴的点赞信息
      let url = this.$api.select + '/sqfw/operate/srvzhsq_forum_praise_delete';
      let userInfo = this.userInfo;
      let req = [
        {
          serviceName: 'srvzhsq_forum_praise_delete',
          condition: [{ colName: 'praise_user', ruleType: 'eq', value: userInfo.user_no }, { colName: 'note_no', ruleType: 'eq', value: this.note_no }]
        }
      ];
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS') {
          // this.getWriteBackList();
          console.log('删除点赞成功');
        }
      });
    },
    addAgree(item, num, id) {
      this.agree_status = !this.agree_status;
      if (this.agree_status) {
        item.agree_icon = '../../static/img/agreea.png';
        num++;
      } else {
        item.agree_icon = '../../static/img/agreeb.png';
        num--;
      }
      let url = this.$api.select + '/sqfw/operate/srvzhsq_leave_word_update';
      let req = [{ serviceName: 'srvzhsq_leave_word_update', condition: [{ colName: 'id', ruleType: 'eq', value: id }], data: [{ praise_num: num }] }];
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS') {
          this.getWriteBackList();
        }
      });
    },
    addMainAgree(item, num, no) {
      // 主贴点赞
      this.agree_status = !this.agree_status;
      if (this.agree_status) {
        this.agree_icon = '../../static/img/agreea.png';
        num++;
        this.addAgreePeople();
      } else {
        this.agree_icon = '../../static/img/agreeb.png';
        num--;
        this.delAgreePeople();
      }
      let url = this.$api.select + '/sqfw/operate/srvzhsq_forum_note_update';
      let req = [{ serviceName: 'srvzhsq_forum_note_update', condition: [{ colName: 'note_no', ruleType: 'eq', value: no }], data: [{ praise_num: num }] }];
      this.$http.post(url, req).then(res => {
        if (res.data.state === 'SUCCESS') {
          this.getMainInfo();
        }
      });
    },
    getWriteBackList() {
      // 获取留言列表
      let url = this.$api.select + '/sqfw/select/srvzhsq_leave_word_select';
      let req = {
        serviceName: 'srvzhsq_leave_word_select',
        colNames: ['*'],
        condition: [{ colName: 'note_no', ruleType: 'eq', value: this.note_no }],
        page: { pageNo: 1, rownumber: 10 },
        order: [{ colName: 'praise_num', orderType: 'desc' }]
      };
      this.$http.post(url, req).then(res => {
        if (res.data.data) {
          let data = res.data.data;
          let userList = this.agreePepoleList;
          userList = userList.map(users => {
            return users.praise_user;
          });
          // console.log(userList);
          data.map(item => {
            if (userList.indexOf(item.leave_user) != -1) {
              item.agree_icon = '../../static/img/agreea.png';
            } else {
              item.agree_icon = '../../static/img/agreeb.png';
            }
          });
          let arr = [];
          data.map(datas => {
            arr = this.getAgreePeopleForLiuYan(datas.leave_no);
            // arr
            console.log(arr);
          });
          this.backData = data;
          console.log(this.backData, arr);
        }
      });
    },
    replyLeaveMessage() {
      // 回复留言(评论)/评论留言(评论)
    },
    writeBack() {
      // 留言/评论
      let url = this.$api.select + '/sqfw/operate/srvzhsq_leave_word_add';
      let req = [
        {
          serviceName: 'srvzhsq_leave_word_add',
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
              remark: this.remark
            }
          ]
        }
      ];

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
    deleteItem(id) {
      // 删除回复
      uni.showModal({
        
        title: '确认删除此条评论？',
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定');
            let url = this.$api.select + '/sqfw/operate/srvzhsq_leave_word_delete';
            let req = [{ serviceName: 'srvzhsq_leave_word_delete', condition: [{ colName: 'id', ruleType: 'in', value: id }] }];
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
    getDateTime() {
      let date = new Date();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      let yy = date.getFullYear();
      let mm = date.getMonth() + 1;
      let dd = date.getDay();
      return yy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s;
    }
  }
};
</script>

<style lang="scss" scoped>
img {
  width: 100upx;
}
.forum_detail_wrap {
  width: 100%;
  position: relative;
  background-color: #f1f1f1;
}
.forum_detail {
  animation: 1.2s ease 0s 1 normal none running show;
  display: flex;
  width: 95%;
  margin: 0 auto;
  // background-color: #fff;
  flex-direction: column;
  .touxiang {
    width: 120upx;
    height: 120upx;
    border-radius: 100%;
    // background-color: #dd524d;
    margin: 20upx;
  }
  .title_view {
    display: flex;
    background-color: #fff;
    flex-direction: column;
    width: 100%;
    text-align: left;
    box-shadow: 0 2px 12px 0 rgba($color: #e54d42, $alpha: 0.1);
    margin: 30upx auto;
    .title_text {
      width: calc(100% - 40upx);

      padding: 0 40upx;
      // line-height: 80upx;
      // font-weight: normal;
    }
    .time_date {
      text-indent: 1rem;
      color: #888888;
      font-size: 20upx;
      font-weight: 300;
    }
  }
  .poster_view {
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
        margin-left: 20upx;
      }
      .state {
        font-size: 28upx;
      }
    }
  }
  .content_view {
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: calc(100% - 40upx);
    min-height: 200upx;
    margin: 10upx auto;
    padding: 20upx;
    border-radius: 5px;
    /deep/ img {
      max-width: 300px;
    }
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
  }
  .reply_view {
    width: 100%;
    background-color: #fff;
    margin-bottom: 150upx;
    min-height: 200upx;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
      padding: 20upx 0;
      border-bottom: 1px solid #d8d8d8;
      margin-bottom: 10upx;
      &:last-child {
        border-bottom: none;
      }
      // align-items: center;
      .text_box {
        flex: 1;
        min-height: 150upx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        // border-left: 1px solid #333;
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
  width: calc(100% - 40upx);
  height: 80upx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 20upx;
  .huifu {
    border-radius: 30upx;
    height: 60upx;
    width: 70%;
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
