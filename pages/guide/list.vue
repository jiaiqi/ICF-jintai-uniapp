<template>
    <view class="guide">
        <swiper class="flex1" interval="3000" :show-indicators="false" :auto-play="autoPlay" @change="sliderChange" :infinite="false" :forbid-slide-animation="false">
            <swiper-item class="flex1" v-for="(img, index) in imageList" :key="index">
                <view class="flex1" @click="launchAppIndex">
                    <!-- #ifndef APP-PLUS -->
                    <image class="flex1" mode="aspectFill" style="width: 100%;height: 100%;" :src="img.src" />

                    <!-- #endif -->

                    <!-- #ifdef APP-PLUS -->
                    <image class="flex1" style="width: 100%;height: 100%;" :src="img.src" />
                    <!-- #endif -->
                </view>
            </swiper-item>
        </swiper>
        <view class="swiper-to-home" @click="launchApp"><text class="swiper-to-home-text">跳过{{indexdata}}</text></view>
    </view>
</template>

<script>
const SystemInfo = uni.getSystemInfoSync();

export default {
    data() {
        return {
            imageList: [
                {
                    src: '../../static/img/guide01.jpg'
                },
                {
                    src: '../../static/img/guide02.jpg'
                },
                {
                    src: '../../static/img/guide03.jpg'
                }
            ],
			indexdata:5,
            autoPlay: false,
            currIndex: 0,
            screenWidth: SystemInfo.screenWidth
        };
    },
    methods: {
        sliderChange(e) {
            console.log(e);
            this.currIndex = e.detail.current;
        },
        launchAppIndex() {
            console.log('launchAppIndex');
            if (this.imageList.length == this.currIndex + 1) {
                this.launchApp();
            } else {
                return;
            }
        },
        launchApp() {
            // 直接到APP 且下次不再显示引导页
            uni.setStorage({
                key: 'launchFlag',
                data: true,
                success() {
                    uni.switchTab({
                        url: '/pages/SmartCity/smartcity'
                    });
                }
            });
        }
    },
	onLoad() {
		let that = this
	var time =setInterval(()=>{
			that.indexdata--
			if(that.indexdata == 0){
				that.indexdata = 0
				clearInterval(time);
				that.launchApp()
			}
			console.log(that.indexdata)
		},1000)	
	}
};
</script>
<style scoped>
.guide {
    /* #ifndef APP-PLUS */
    display: flex;
    height: 100%;
    /* #endif */
    flex-direction: column;
    flex: 1;
}

.flex1 {
    flex: 1;
}
.apptestnnnn {
    border-width: 1px;
    border-color: #4cd964;
    border-style: solid;
}
.apptest {
    border-width: 1px;
    border-color: #007aff;
    border-style: solid;
}
.swiper-to-home {
    position: absolute;
    z-index: 999;
    right: 40rpx;
    /* #ifndef MP */
    top: 80rpx;
    /* #endif */
    /* #ifdef MP */
    top: 150rpx;
    /* #endif */
}

.swiper-to-home-text {
    color: #ffffff;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
    border-width: 1rpx;
    border-color: #ffffff;
    border-style: solid;
    border-radius: 30rpx;
    font-size: 28rpx;
    padding-top: 5rpx;
    padding-bottom: 5rpx;
    padding-left: 25rpx;
    padding-right: 25rpx;
}

.indicator {
    width: 714rpx;
    height: 30rpx;
    position: absolute;
    bottom: 50rpx;
    left: 1rpx;
    item-color: #f6f6f6;
    item-selected-color: #fd575c;
    item-size: 20rpx;
}
</style>
