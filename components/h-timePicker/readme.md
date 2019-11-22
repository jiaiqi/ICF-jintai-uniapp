<!--
 * @Description:
 * @Author: hjh
 * @Date: 2019-08-16 11:17:37
 * @LastEditors: hjh
 * @LastEditTime: 2019-08-22 18:16:24
 * @Sign: 扬眉剑出鞘
 -->

### hTimePicker

预约时间的选择，支持营业时间的判断

**使用方式：**

在 `script` 中引用组件

```javascript
import hTimePicker from "@/components/h-timePicker/h-timePicker.vue";
export default {
  components: { hTimePicker }
};
```

在 `template` 中使用组件

```html
<hTimePicker sTime="15" cTime="15" interval="1" @changeTime="changeTime">
  <view slot="pCon" class="changeTime">
    点击选择时间
  </view>
</hTimePicker>
```

**属性说明：**

|属性名|类型|默认值	|说明|
|---|----|---|---|
|sTime|String|0|小时开始|
|cTime|String|23|小时结束|
|timeNum|String|0|当天预约时的延迟小时|
|interval|String|1|分钟的间隔|
|sDay|String|0|预约日期从几天后开始，0就是今天，1就是明天|
|dayNum|String|7|可以预约的天数|

**事件说明：**

|事件称名|说明|返回参数|
|---|----|---|
|changeTime|改变时间的事件|第一个参数是格式化时间,第二个是时间戳|


### 更新日志

**1.0.0**

- 初始项目

**1.0.1**

- 修复H5下不滚动，确定无效问题


**1.0.2**

- 修复选择时间后再次打开显示不正确的问题
**1.0.3**

- 可延迟预约时间的选择
