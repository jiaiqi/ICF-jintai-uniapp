<template>
    <view class="content">
			<view>{{userInfo.user_disp}}</view>
        <view class="btn-row">
            <button v-if="isExpired" type="primary" class="primary" @tap="bindLogin">登录1</button>
            <!-- <button v-if="hasLogin" type="default" @tap="bindLogout">退出登录</button> -->
        </view>
    </view>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        computed: {
            ...mapState(['hasLogin', 'forcedLogin'])
        },
		data(){
			return {
				userInfo:Object,
				isExpired:Boolean
			}
		},
		updated(){
			let outTime = uni.getStorageSync("outTime")
			let userInfos = uni.getStorageSync("userInfo")
			this.userInfo = userInfos
			let date = new Date().getTime()
			let isExpireds = outTime < date
			this.isExpired = isExpireds
		},
        methods: {
            ...mapMutations(['logout']),
            bindLogin() {
                uni.navigateTo({
                    url: '../login/login',
                });
            },
            bindLogout() {
                this.logout();
                /**
                 * 如果需要强制登录跳转回登录页面
                 */
                if (this.forcedLogin) {
                    // uni.navigateTo({
                    //     url: '../login/login',
                    // });
                }
            }
        }
    }
</script>

<style>

</style>
