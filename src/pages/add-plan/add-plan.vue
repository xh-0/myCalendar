<template>
  <view class="add-page">
    <scroll-view scroll-y class="add-scroll" :show-scrollbar="false">
      <view class="form-block">
        <view class="card card--title">
          <input
            v-model="title"
            class="title-input"
            type="text"
            placeholder="今天想做什么"
            placeholder-class="title-placeholder"
            maxlength="50"
          />
        </view>

        <picker
          mode="selector"
          :range="typeLabels"
          :value="typeIndex"
          @change="onTypeChange"
        >
          <view class="card card--field">
            <text class="field-label">类型</text>
            <view class="field-value-row">
              <text class="field-value">{{ selectedType.label }}</text>
              <text class="field-chevron">›</text>
            </view>
          </view>
        </picker>

        <picker mode="date" :value="formDate" @change="onDateChange">
          <view class="card card--field">
            <text class="field-label">日期</text>
            <view class="field-value-row">
              <text class="field-value">{{ formDate }}</text>
              <text class="field-weekday">{{ weekdayLabel }}</text>
              <text class="field-chevron">›</text>
            </view>
          </view>
        </picker>

        <view class="card card--time">
          <view class="time-header">
            <text class="field-label">时间</text>
            <view class="allday-row">
              <text class="allday-text">全天</text>
              <switch
                :checked="allDay"
                color="#10ad61"
                @change="onAllDayChange"
              />
            </view>
          </view>
          <view v-if="!allDay" class="time-pickers">
            <picker mode="time" :value="startTime" @change="onStartTimeChange">
              <view class="time-box">
                <text class="time-box-label">开始</text>
                <view class="time-box-value-row">
                  <text class="time-box-value">{{ startTime }}</text>
                  <text class="time-chevron">›</text>
                </view>
              </view>
            </picker>
            <picker mode="time" :value="endTime" @change="onEndTimeChange">
              <view class="time-box">
                <text class="time-box-label">结束</text>
                <view class="time-box-value-row">
                  <text class="time-box-value">{{ endTime }}</text>
                  <text class="time-chevron">›</text>
                </view>
              </view>
            </picker>
          </view>
        </view>

        <view class="card card--field" @tap="onPickLocation">
          <text class="field-label">地点</text>
          <view class="field-value-row">
            <text
              class="field-value"
              :class="{ 'field-value--muted': !location }"
            >
              {{ location || "地图搜索并选择地址" }}
            </text>
            <text class="field-chevron">›</text>
          </view>
        </view>

        <view class="card card--people">
          <view class="people-header">
            <text class="field-label">人数</text>
            <text class="people-count">{{ peopleCount }} 人</text>
          </view>
          <slider
            class="people-slider"
            :min="1"
            :max="30"
            :value="peopleCount"
            active-color="#10ad61"
            background-color="#e8e8e8"
            block-size="20"
            @change="onPeopleChange"
          />
        </view>

        <view class="card card--notify">
          <view class="notify-main">
            <view class="notify-text-col">
              <text class="notify-title">报名时微信提醒我</text>
              <text class="notify-desc">
                勾选后，发布时会请求一次订阅授权；关闭后仅保留站内提醒。
              </text>
            </view>
            <switch
              :checked="wechatNotify"
              color="#10ad61"
              @change="onNotifyChange"
            />
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="footer">
      <view class="submit-btn" @tap="onSubmit">
        <text class="submit-text">发布活动</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { addSchedule, PLAN_TYPES } from "@/mock/schedule";
import { formatWeekdayShort } from "@/utils/calendar";

const typeLabels = PLAN_TYPES.map((t) => t.label);

const title = ref("");
const typeIndex = ref(0);
const formDate = ref(dayjs().format("YYYY-MM-DD"));
const allDay = ref(false);
const startTime = ref("11:00");
const endTime = ref("13:00");
const location = ref("");
const peopleCount = ref(1);
const wechatNotify = ref(true);

const selectedType = computed(() => PLAN_TYPES[typeIndex.value]);
const weekdayLabel = computed(() => formatWeekdayShort(formDate.value));

onLoad((options) => {
  const date = options?.date;
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    formDate.value = date;
  }
});

function onTypeChange(e: { detail: { value: string | number } }) {
  typeIndex.value = Number(e.detail.value);
}

function onDateChange(e: { detail: { value: string } }) {
  formDate.value = e.detail.value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onAllDayChange(e: any) {
  allDay.value = Boolean(e.detail.value);
}

function onStartTimeChange(e: { detail: { value: string } }) {
  startTime.value = e.detail.value;
}

function onEndTimeChange(e: { detail: { value: string } }) {
  endTime.value = e.detail.value;
}

function onPeopleChange(e: { detail: { value: number } }) {
  peopleCount.value = e.detail.value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onNotifyChange(e: any) {
  wechatNotify.value = Boolean(e.detail.value);
}

function onPickLocation() {
  uni.showToast({ title: "地图选点即将上线", icon: "none" });
}

function onSubmit() {
  const trimmed = title.value.trim();
  if (!trimmed) {
    uni.showToast({ title: "请填写计划标题", icon: "none" });
    return;
  }

  if (!allDay.value && startTime.value >= endTime.value) {
    uni.showToast({ title: "结束时间需晚于开始时间", icon: "none" });
    return;
  }

  const time = allDay.value ? "全天" : startTime.value;
  const type = selectedType.value;

  addSchedule({
    date: formDate.value,
    time,
    title: trimmed,
    category: type.label,
    categoryIcon: type.icon,
  });

  if (wechatNotify.value) {
    uni.showToast({ title: "已保存，订阅提醒即将上线", icon: "none" });
  } else {
    uni.showToast({ title: "计划已发布", icon: "success" });
  }

  setTimeout(() => {
    uni.navigateBack();
  }, 400);
}
</script>

<style scoped>
.add-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
}

.add-scroll {
  flex: 1;
  height: 0;
}

.form-block {
  padding: 24rpx 24rpx 200rpx;
}

.card {
  background: #ffffff;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);
}

.card--title {
  padding: 36rpx 32rpx;
}

.title-input {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
}

.title-placeholder {
  color: #c8c8c8;
  font-weight: 600;
}

.card--field {
  padding: 28rpx 32rpx;
}

.field-label {
  display: block;
  font-size: 24rpx;
  color: #999999;
  margin-bottom: 12rpx;
}

.field-value-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.field-value {
  flex: 1;
  font-size: 32rpx;
  font-weight: 500;
  color: #1a1a1a;
}

.field-value--muted {
  color: #666666;
  font-weight: 400;
}

.field-weekday {
  font-size: 28rpx;
  color: #999999;
  margin-right: 8rpx;
}

.field-chevron {
  font-size: 36rpx;
  color: #cccccc;
  line-height: 1;
  flex-shrink: 0;
}

.card--time {
  padding: 28rpx 32rpx 32rpx;
}

.time-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.time-header .field-label {
  margin-bottom: 0;
}

.allday-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
}

.allday-text {
  font-size: 28rpx;
  color: #666666;
}

.time-pickers {
  display: flex;
  flex-direction: row;
  gap: 20rpx;
}

.time-box {
  flex: 1;
  padding: 24rpx 28rpx;
  border: 1rpx solid #eeeeee;
  border-radius: 16rpx;
  background: #fafafa;
}

.time-box-label {
  display: block;
  font-size: 24rpx;
  color: #999999;
  margin-bottom: 8rpx;
}

.time-box-value-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.time-box-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.time-chevron {
  font-size: 28rpx;
  color: #cccccc;
}

.card--people {
  padding: 28rpx 32rpx 20rpx;
}

.people-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.people-header .field-label {
  margin-bottom: 0;
}

.people-count {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.people-slider {
  margin: 8rpx 0 0;
}

.card--notify {
  padding: 32rpx;
}

.notify-main {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 24rpx;
}

.notify-text-col {
  flex: 1;
  min-width: 0;
}

.notify-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
  margin-bottom: 12rpx;
}

.notify-desc {
  font-size: 24rpx;
  color: #999999;
  line-height: 1.5;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16rpx 24rpx calc(16rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(247, 248, 250, 0) 0%, #f7f8fa 24%);
}

.submit-btn {
  height: 96rpx;
  border-radius: 48rpx;
  background: #10ad61;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(16, 173, 97, 0.28);
}

.submit-text {
  font-size: 34rpx;
  font-weight: 600;
  color: #ffffff;
}
</style>
