<template>
  <view v-if="plan" class="detail-page">
    <view v-if="plan.cancelled" class="cancelled-banner">
      <text class="cancelled-text">该拍摄已取消</text>
    </view>

    <view class="hero-card" :class="{ 'hero-card--muted': plan.cancelled }">
      <view v-if="plan.priority && !plan.cancelled" class="priority-tag">
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
      <view v-if="plan.location" class="info-divider" />
      <view v-if="plan.location" class="info-row info-row--top">
        <text class="info-label">地点</text>
        <text class="info-value info-value--wrap">{{ plan.location }}</text>
      </view>
      <view v-if="plan.peopleCount" class="info-divider" />
      <view v-if="plan.peopleCount" class="info-row">
        <text class="info-label">人数</text>
        <text class="info-value">{{ plan.peopleCount }} 人</text>
      </view>
      <view class="info-divider" />
      <view class="info-row">
        <text class="info-label">微信提醒</text>
        <text class="info-value">{{ plan.wechatNotify ? "已开启" : "未开启" }}</text>
      </view>
    </view>

    <view class="action-card">
      <view
        v-if="plan.cancelled"
        class="action-btn"
        @tap="onRestore"
      >
        <text class="action-text">重新进行</text>
      </view>

      <view
        v-if="!plan.cancelled"
        class="action-btn"
        @tap="onEdit"
      >
        <text class="action-text">编辑计划</text>
      </view>

      <view v-if="!plan.cancelled" class="action-row">
        <picker
          class="action-picker"
          mode="date"
          :value="plan.date"
          @change="onRescheduleChange"
        >
          <view class="action-btn action-btn--secondary">
            <text class="action-text action-text--dark">改期</text>
          </view>
        </picker>
        <view class="action-btn action-btn--warn" @tap="onCancelShoot">
          <text class="action-text action-text--warn">取消拍摄</text>
        </view>
      </view>

      <view class="delete-wrap">
        <text class="delete-link" @tap="onDelete">删除计划</text>
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
import { onLoad, onShow } from "@dcloudio/uni-app";
import {
  cancelSchedule,
  deleteSchedule,
  getScheduleById,
  rescheduleSchedule,
  restoreSchedule,
  type ScheduleItem,
} from "@/mock/schedule";
import { formatWeekdayShort } from "@/utils/calendar";

const plan = ref<ScheduleItem | null>(null);
const planId = ref<string | null>(null);

const weekdayLabel = computed(() =>
  plan.value ? formatWeekdayShort(plan.value.date) : "",
);

const timeLabel = computed(() => {
  if (!plan.value) return "";
  return plan.value.time === "全天" ? "全天" : plan.value.time;
});

function reloadPlan() {
  if (!planId.value) return;
  plan.value = getScheduleById(planId.value) || null;
}

onLoad((options) => {
  const id = options?.id;
  if (typeof id === "string" && id) {
    planId.value = id;
    reloadPlan();
  }
});

onShow(() => {
  reloadPlan();
});

function goBack() {
  uni.navigateBack();
}

function onEdit() {
  if (!plan.value || plan.value.cancelled) return;
  uni.navigateTo({
    url: `/pages/add-plan/add-plan?id=${plan.value.id}`,
  });
}

function onRescheduleChange(e: { detail: { value: string } }) {
  if (!plan.value || plan.value.cancelled) return;
  const newDate = e.detail.value;
  if (newDate === plan.value.date) return;

  const updated = rescheduleSchedule(plan.value.id, newDate);
  if (!updated) {
    uni.showToast({ title: "改期失败", icon: "none" });
    return;
  }
  plan.value = updated;
  uni.showToast({ title: "已改期", icon: "success" });
}

function onCancelShoot() {
  if (!plan.value || plan.value.cancelled) return;
  uni.showModal({
    title: "取消拍摄",
    content: "取消后计划在列表中以灰色显示，可随时重新进行。确定取消？",
    confirmColor: "#e6a23c",
    success(res) {
      if (!res.confirm || !plan.value) return;
      const ok = cancelSchedule(plan.value.id);
      if (!ok) {
        uni.showToast({ title: "操作失败", icon: "none" });
        return;
      }
      reloadPlan();
      uni.showToast({ title: "已取消拍摄", icon: "none" });
    },
  });
}

function onRestore() {
  if (!plan.value || !plan.value.cancelled) return;
  uni.showModal({
    title: "重新进行",
    content: "恢复后计划将重新显示为正常状态，确定恢复？",
    confirmColor: "#10ad61",
    success(res) {
      if (!res.confirm || !plan.value) return;
      const updated = restoreSchedule(plan.value.id);
      if (!updated) {
        uni.showToast({ title: "恢复失败", icon: "none" });
        return;
      }
      plan.value = updated;
      uni.showToast({ title: "已恢复拍摄", icon: "success" });
    },
  });
}

function onDelete() {
  if (!plan.value) return;
  uni.showModal({
    title: "删除计划",
    content: "删除后无法恢复，确定删除？",
    confirmColor: "#ee0a24",
    success(res) {
      if (!res.confirm || !planId.value) return;
      const ok = deleteSchedule(planId.value);
      if (!ok) {
        uni.showToast({ title: "删除失败", icon: "none" });
        return;
      }
      uni.showToast({ title: "已删除", icon: "success" });
      setTimeout(() => {
        uni.navigateBack();
      }, 400);
    },
  });
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding: 24rpx 24rpx 48rpx;
  background: #f7f8fa;
}

.cancelled-banner {
  margin-bottom: 16rpx;
  padding: 20rpx 28rpx;
  background: #fff7e6;
  border-radius: 16rpx;
  border: 1rpx solid #ffe7ba;
}

.cancelled-text {
  font-size: 28rpx;
  color: #e6a23c;
  font-weight: 500;
}

.hero-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 40rpx 32rpx 36rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);
}

.hero-card--muted {
  opacity: 0.72;
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

.info-value--wrap {
  flex: 1;
  margin-left: 24rpx;
  line-height: 1.5;
}

.info-row--top {
  align-items: flex-start;
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

.action-row {
  display: flex;
  flex-direction: row;
  gap: 20rpx;
  margin-top: 20rpx;
}

.action-picker {
  flex: 1;
}

.action-row .action-btn {
  flex: 1;
  margin-top: 0;
}

.action-btn {
  height: 96rpx;
  border-radius: 48rpx;
  background: #10ad61;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(16, 173, 97, 0.28);
}

.action-btn--secondary {
  background: #ffffff;
  border: 1rpx solid #e8e8e8;
  box-shadow: none;
}

.action-btn--warn {
  background: #ffffff;
  border: 1rpx solid #ffe7ba;
  box-shadow: none;
}

.action-text {
  font-size: 34rpx;
  font-weight: 600;
  color: #ffffff;
}

.action-text--dark {
  color: #1a1a1a;
  font-size: 32rpx;
}

.action-text--warn {
  color: #e6a23c;
  font-size: 32rpx;
}

.delete-wrap {
  margin-top: 40rpx;
  text-align: center;
}

.delete-link {
  font-size: 28rpx;
  color: #ee0a24;
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
