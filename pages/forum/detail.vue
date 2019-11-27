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
        <uni-icons type="contact" size="60" color="#dd524d"></uni-icons>
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

      <!-- 回复 -->
      <div class="little_title">评论</div>
      <div class="reply_view">
        <div class="noddata" v-if="backData.length<=0">暂无评论</div>
        <div class="discuss_item" v-for="(item, index) in backData" :key="index">
          <!-- <image src="" mode="" class="touxiang"></image> -->
          <uni-icons type="contact" size="60" color="#dd524d"></uni-icons>
          <div class="text_box">
            <div class="user_info_box">
              <div class="user_info">{{ item.create_user }}</div>
              <div class="agree">
                <image :src="item.agree_icon" mode="" style="width: 16px;height: 16px;" @click="addAgree(item, item.praise_num, item.id)"></image>
                <uni-badge :text="item.praise_num" type="error" v-if="item.praise_num <= 99"></uni-badge>
                <uni-badge text="99+" type="error" v-else></uni-badge>
              </div>
            </div>
            <div class="content_box" v-html="item.remark">
              <!--              我如果爱你</br>
              绝不像攀援的凌霄花，</br>
              借你的高枝炫耀自己；</br>
              我如果爱你</br>
              绝不学痴情的鸟儿，</br>
              为绿荫重复单调的歌曲；</br>
              也不止像泉源，</br>
              常年送来清凉的慰藉；</br>
              也不止像险峰，</br>
              增加你的高度，衬托你的威仪。</br>
              甚至日光，</br>
              甚至春雨。</br> -->
            </div>
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
      userImage:"",
      note_user_info: {}, //发帖用户信息
      query: {},
      note_no: '',
      agree_icon: '../../static/img/agreeb.png',
      agree_status: false,
      backData: [],
      remark: '' //回复内容
    };
  },
  methods: {
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
    getWriteBackList() {
      // 获取回复列表
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
          data.map(item => {
            item.agree_icon = '../../static/img/agreeb.png';
          });
          this.backData = data;
          console.log(this.backData);
        }
      });
    },
    writeBack() {
      // 回复消息
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
        success: (res) => {
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
  },
  onLoad(option) {
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo).data;
      console.log('userInfo', this.userInfo);
    }
    console.log(option.query);
    if (option) {
      let query = JSON.parse(option.query);
      console.log('query:', query);
      this.query = query;
      this.note_no = query.note_no;
      this.getWriteBackList();
      uni.setNavigationBarTitle({
        title: '详情'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
    background-color: #dd524d;
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
    .noddata{
      width: 100%;
      height: 100%;
      text-align: center;
      line-height:  200upx;
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
