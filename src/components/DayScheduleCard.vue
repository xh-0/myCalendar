<template>
  <view class="schedule-card">
    <view class="card-header">
      <text class="card-date">{{ dayHeader }}</text>
      <text class="card-count">共{{ schedules.length }}项计划</text>
    </view>

    <view v-if="schedules.length" class="task-list">
      <view
        v-for="(item, index) in schedules"
        :key="item.id"
        class="task-item"
        :class="{ 'task-item--border': index < schedules.length - 1 }"
      >
        <view class="task-time-col">
          <text class="task-time" :style="{ color: categoryColor(item.category) }">
            {{ item.time }}
          </text>
          <view
            class="task-status-dot"
            :style="{ background: categoryColor(item.category) }"
          />
        </view>
        <view class="task-body">
          <text class="task-title">{{ item.title }}</text>
          <view
            class="task-category-tag"
            :style="categoryTagStyle(item.category)"
          >
            <text class="task-category-text">
              {{ item.category }} {{ item.categoryIcon }}
            </text>
          </view>
        </view>
        <view class="task-more" @tap.stop="emit('more', item.id)">
          <text class="more-icon">···</text>
        </view>
      </view>
    </view>

    <view v-else class="empty-tip">
      <text class="empty-text">这一天还没有计划</text>
    </view>

    <view class="add-btn" @tap="emit('add')">
      <text class="add-text">+ 添加计划</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDayHeader } from '@/utils/calendar'
import {
  getCategoryColor,
  getCategoryColorLight,
  type ScheduleItem,
} from '@/mock/schedule'

function categoryColor(category: string) {
  return getCategoryColor(category)
}

function categoryTagStyle(category: string) {
  return {
    color: getCategoryColor(category),
    background: getCategoryColorLight(category),
  }
}

const props = defineProps<{
  dateKey: string
  schedules: ScheduleItem[]
}>()

const emit = defineEmits<{
  add: []
  more: [id: string]
}>()

const dayHeader = computed(() => formatDayHeader(props.dateKey))
</script>

<style scoped>
.schedule-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx 28rpx 28rpx;
  margin-top: 8rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.card-date {
  font-size: 34rpx;
  font-weight: 700;
  color: #1a1a1a;
}

.card-count {
  font-size: 26rpx;
  color: #999999;
}

.task-list {
  margin-bottom: 8rpx;
}

.task-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 24rpx 0;
}

.task-item--border {
  border-bottom: 1rpx solid #f0f0f0;
}

.task-time-col {
  width: 100rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  padding-top: 4rpx;
}

.task-time {
  font-size: 28rpx;
  font-weight: 600;
}

.task-status-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  margin-left: 8rpx;
  margin-top: 2rpx;
}

.task-body {
  flex: 1;
  min-width: 0;
  padding-right: 16rpx;
}

.task-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
  margin-bottom: 8rpx;
}

.task-category-tag {
  display: inline-flex;
  align-items: center;
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
}

.task-category-text {
  font-size: 24rpx;
  line-height: 1.3;
}

.task-more {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.more-icon {
  font-size: 32rpx;
  color: #cccccc;
  letter-spacing: 2rpx;
  line-height: 1;
}

.empty-tip {
  padding: 48rpx 0 32rpx;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #cccccc;
}

.add-btn {
  margin-top: 16rpx;
  height: 88rpx;
  border-radius: 16rpx;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-text {
  font-size: 30rpx;
  color: #10ad61;
  font-weight: 500;
}
</style>
