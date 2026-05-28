<template>
  <view
    class="search-row"
    :class="{
      'search-row--border': showBorder,
      'search-row--cancelled': item.cancelled,
    }"
    @tap="emit('tap', item.id)"
  >
    <view class="search-row-time-col">
      <text v-if="showDate" class="search-row-date">{{ item.date.slice(5) }}</text>
      <text
        class="search-row-time"
        :class="{ 'search-row-time--cancelled': item.cancelled }"
        :style="item.cancelled ? undefined : { color: categoryColor(item.category) }"
      >
        {{ item.time }}
      </text>
      <view
        class="search-row-dot"
        :class="{ 'search-row-dot--cancelled': item.cancelled }"
        :style="item.cancelled ? undefined : { background: categoryColor(item.category) }"
      />
    </view>
    <view class="search-row-body">
      <view class="search-row-title-row">
        <text
          class="search-row-title"
          :class="{ 'search-row-title--cancelled': item.cancelled }"
        >
          {{ item.title }}
        </text>
        <text v-if="item.priority && !item.cancelled" class="search-row-priority">重要</text>
        <text v-if="item.cancelled" class="search-row-cancelled">已取消</text>
      </view>
      <view class="search-row-meta">
        <text
          class="search-row-category"
          :class="{ 'search-row-category--cancelled': item.cancelled }"
          :style="item.cancelled ? undefined : categoryTagStyle(item.category)"
        >
          {{ item.category }} {{ item.categoryIcon }}
        </text>
        <text
          v-if="item.location"
          class="search-row-location"
          :class="{ 'search-row-location--cancelled': item.cancelled }"
        >
          {{ item.location }}
        </text>
      </view>
    </view>
    <text class="search-row-chevron">›</text>
  </view>
</template>

<script setup lang="ts">
import {
  getCategoryColor,
  getCategoryColorLight,
  type ScheduleItem,
} from '@/mock/schedule'

defineProps<{
  item: ScheduleItem
  showDate?: boolean
  showBorder?: boolean
}>()

const emit = defineEmits<{
  tap: [id: string]
}>()

function categoryColor(category: string) {
  return getCategoryColor(category)
}

function categoryTagStyle(category: string) {
  return {
    color: getCategoryColor(category),
    background: getCategoryColorLight(category),
  }
}
</script>

<style scoped>
.search-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 24rpx 0;
}

.search-row--border {
  border-bottom: 1rpx solid #f0f0f0;
}

.search-row--cancelled {
  opacity: 0.85;
}

.search-row-time-col {
  width: 108rpx;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 4rpx;
}

.search-row-date {
  font-size: 22rpx;
  color: #999999;
  margin-bottom: 4rpx;
}

.search-row-time {
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.2;
}

.search-row-time--cancelled {
  color: #b8b8b8;
  text-decoration: line-through;
}

.search-row-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  margin-top: 8rpx;
}

.search-row-dot--cancelled {
  background: #d0d0d0;
}

.search-row-body {
  flex: 1;
  min-width: 0;
  padding-right: 8rpx;
}

.search-row-title-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 8rpx;
}

.search-row-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
}

.search-row-title--cancelled {
  color: #b8b8b8;
  text-decoration: line-through;
}

.search-row-priority {
  font-size: 22rpx;
  color: #10ad61;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  background: #e8f8ef;
}

.search-row-cancelled {
  font-size: 22rpx;
  color: #c0c0c0;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  background: #f3f3f3;
}

.search-row-meta {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
}

.search-row-category {
  font-size: 24rpx;
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
  line-height: 1.3;
}

.search-row-category--cancelled {
  color: #c0c0c0;
  background: #f3f3f3;
  text-decoration: line-through;
}

.search-row-location {
  font-size: 24rpx;
  color: #999999;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-row-location--cancelled {
  color: #c0c0c0;
  text-decoration: line-through;
}

.search-row-chevron {
  font-size: 36rpx;
  color: #cccccc;
  line-height: 1;
  padding-top: 8rpx;
  flex-shrink: 0;
}
</style>
