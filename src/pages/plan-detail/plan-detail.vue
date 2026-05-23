<template>
  <view v-if="plan" class="detail-page">
    <view class="hero-card">
      <view v-if="plan.priority" class="priority-tag">
        <text class="priority-text">重要</text>
      </view>
      <text class="hero-title">{{ plan.title }}</text>
      <view class="hero-meta">
        <text class="hero-time">{{ plan.time }}</text>
        <text class="hero-dot">·</text>
        <text class="hero-category">{{ plan.category }} {{ plan.categoryIcon }}</text>
      </view>
    </view>

    <view class="info-card">
      <view class="info-row">
        <text class="info-label">日期</text>
        <view class="info-value-col">
          <text class="info-value">{{ plan.date }}</text>
          <text class="info-extra">{{ weekdayLabel }}</text>
        </view>
      </view>
      <view class="info-divider" />
      <view class="info-row">
        <text class="info-label">时间</text>
        <text class="info-value">{{ timeLabel }}</text>
      </view>
      <view class="info-divider" />
      <view class="info-row">
        <text class="info-label">类型</text>
        <text class="info-value">{{ plan.category }} {{ plan.categoryIcon }}</text>
      </view>
    </view>

    <view class="action-card">
      <view class="action-btn" @tap="onEdit">
        <text class="action-text">编辑计划</text>
      </view>
    </view>
  </view>

  <view v-else class="empty-page">
    <text class="empty-title">计划不存在或已删除</text>
    <view class="empty-btn" @tap="goBack">
      <text class="empty-btn-text">返回</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getScheduleById, type ScheduleItem } from "@/mock/schedule";
import { formatWeekdayShort } from "@/utils/calendar";

const plan = ref<ScheduleItem | null>(null);

const weekdayLabel = computed(() =>
  plan.value ? formatWeekdayShort(plan.value.date) : "",
);

const timeLabel = computed(() => {
  if (!plan.value) return "";
  return plan.value.time === "全天" ? "全天" : plan.value.time;
});

onLoad((options) => {
  const id = options?.id;
  if (typeof id === "string" && id) {
    plan.value = getScheduleById(id) ?? null;
  }
});

function goBack() {
  uni.navigateBack();
}

function onEdit() {
  uni.showToast({ title: "编辑功能即将上线", icon: "none" });
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding: 24rpx 24rpx 48rpx;
  background: #f7f8fa;
}

.hero-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 40rpx 32rpx 36rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);
}

.priority-tag {
  display: inline-flex;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  background: rgba(16, 173, 97, 0.12);
  margin-bottom: 20rpx;
}

.priority-text {
  font-size: 22rpx;
  color: #10ad61;
  font-weight: 600;
}

.hero-title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
  margin-bottom: 20rpx;
}

.hero-meta {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}

.hero-time {
  font-size: 30rpx;
  font-weight: 600;
  color: #10ad61;
}

.hero-dot {
  margin: 0 12rpx;
  font-size: 28rpx;
  color: #cccccc;
}

.hero-category {
  font-size: 28rpx;
  color: #999999;
}

.info-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 8rpx 32rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);
}

.info-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
}

.info-label {
  font-size: 28rpx;
  color: #999999;
  flex-shrink: 0;
}

.info-value-col {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
}

.info-value {
  font-size: 30rpx;
  font-weight: 500;
  color: #1a1a1a;
  text-align: right;
}

.info-extra {
  font-size: 26rpx;
  color: #999999;
}

.info-divider {
  height: 1rpx;
  background: #f0f0f0;
}

.action-card {
  margin-top: 8rpx;
}

.action-btn {
  height: 96rpx;
  border-radius: 48rpx;
  background: #ffffff;
  border: 1rpx solid #10ad61;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #10ad61;
}

.empty-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  background: #f7f8fa;
}

.empty-title {
  font-size: 30rpx;
  color: #999999;
  margin-bottom: 40rpx;
}

.empty-btn {
  padding: 20rpx 48rpx;
  border-radius: 40rpx;
  background: #10ad61;
}

.empty-btn-text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}
</style>
