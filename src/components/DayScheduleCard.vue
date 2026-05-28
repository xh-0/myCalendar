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
        :class="{
          'task-item--border': index < schedules.length - 1,
          'task-item--cancelled': item.cancelled,
        }"
        @tap="emit('select', item.id)"
      >
        <view class="task-time-col">
          <text
            class="task-time"
            :class="{ 'task-time--cancelled': item.cancelled }"
            :style="item.cancelled ? undefined : { color: categoryColor(item.category) }"
          >
            {{ item.time }}
          </text>
          <view
            class="task-status-dot"
            :class="{ 'task-status-dot--cancelled': item.cancelled }"
            :style="item.cancelled ? undefined : { background: categoryColor(item.category) }"
          />
        </view>
        <view class="task-body">
          <view class="task-title-row">
            <text
              class="task-title"
              :class="{ 'task-title--cancelled': item.cancelled }"
            >
              {{ item.title }}
            </text>
            <text v-if="item.cancelled" class="task-cancelled-tag">已取消</text>
          </view>
          <view
            class="task-category-tag"
            :class="{ 'task-category-tag--cancelled': item.cancelled }"
            :style="item.cancelled ? undefined : categoryTagStyle(item.category)"
          >
            <text
              class="task-category-text"
              :class="{ 'task-category-text--cancelled': item.cancelled }"
            >
              {{ item.category }} {{ item.categoryIcon }}
            </text>
          </view>
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
  select: [id: string]
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
  margin: 0 -12rpx;
  padding-left: 12rpx;
  padding-right: 12rpx;
  border-radius: 12rpx;
}

.task-item:active {
  background: #f7f7f7;
}

.task-item--border {
  border-bottom: 1rpx solid #f0f0f0;
}

.task-item--cancelled {
  opacity: 0.85;
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

.task-time--cancelled {
  color: #b8b8b8;
  text-decoration: line-through;
}

.task-status-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  margin-left: 8rpx;
  margin-top: 2rpx;
}

.task-status-dot--cancelled {
  background: #d0d0d0;
}

.task-body {
  flex: 1;
  min-width: 0;
}

.task-title-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.task-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
}

.task-title--cancelled {
  color: #b8b8b8;
  text-decoration: line-through;
}

.task-cancelled-tag {
  font-size: 22rpx;
  color: #c0c0c0;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  background: #f3f3f3;
  flex-shrink: 0;
}

.task-category-tag {
  display: inline-flex;
  align-items: center;
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
}

.task-category-tag--cancelled {
  background: #f3f3f3;
}

.task-category-text {
  font-size: 24rpx;
  line-height: 1.3;
}

.task-category-text--cancelled {
  color: #c0c0c0;
  text-decoration: line-through;
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
