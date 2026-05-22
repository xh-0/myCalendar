<template>
  <view class="calendar">
    <view class="calendar-nav">
      <view class="nav-btn" @tap="emit('prev-month')">
        <text class="nav-arrow">‹</text>
      </view>
      <view class="month-label" @tap="emit('pick-month')">
        <text class="month-text">{{ monthTitle }}</text>
        <text class="month-chevron">▾</text>
      </view>
      <view class="nav-btn" @tap="emit('next-month')">
        <text class="nav-arrow">›</text>
      </view>
    </view>

    <view class="week-row">
      <text v-for="label in weekLabels" :key="label" class="week-cell">{{ label }}</text>
    </view>

    <view class="days-grid">
      <view
        v-for="cell in days"
        :key="cell.dateKey"
        class="day-cell"
        @tap="onSelect(cell)"
      >
        <view v-if="hasPriority(cell.dateKey)" class="priority-dot" />
        <view
          class="day-inner"
          :class="{
            'day-inner--other': !cell.isCurrentMonth,
            'day-inner--selected': cell.dateKey === selectedDate,
          }"
        >
          <text
            class="day-num"
            :class="{
              'day-num--other': !cell.isCurrentMonth,
              'day-num--selected': cell.dateKey === selectedDate,
            }"
          >{{ cell.day }}</text>
          <view
            v-if="hasSchedule(cell.dateKey)"
            class="schedule-dot"
            :class="{ 'schedule-dot--selected': cell.dateKey === selectedDate }"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  buildCalendarGrid,
  formatMonthTitle,
  getWeekLabels,
  type CalendarDay,
} from '@/utils/calendar'
import { hasPriorityOnDate, hasScheduleOnDate } from '@/mock/schedule'

const props = defineProps<{
  year: number
  month: number
  selectedDate: string
}>()

const emit = defineEmits<{
  'select-date': [dateKey: string]
  'prev-month': []
  'next-month': []
  'pick-month': []
}>()

const weekLabels = getWeekLabels()
const monthTitle = computed(() => formatMonthTitle(props.year, props.month))
const days = computed(() => buildCalendarGrid(props.year, props.month))

function hasSchedule(dateKey: string) {
  return hasScheduleOnDate(dateKey)
}

function hasPriority(dateKey: string) {
  return hasPriorityOnDate(dateKey)
}

function onSelect(cell: CalendarDay) {
  emit('select-date', cell.dateKey)
}
</script>

<style scoped>
.calendar {
  padding: 0 8rpx 16rpx;
}

.calendar-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28rpx;
  padding: 0 16rpx;
}

.nav-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.nav-arrow {
  font-size: 40rpx;
  color: #666666;
  line-height: 1;
  margin-top: -4rpx;
}

.month-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
}

.month-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.month-chevron {
  font-size: 24rpx;
  color: #999999;
  margin-top: 4rpx;
}

.week-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 12rpx;
}

.week-cell {
  flex: 1;
  text-align: center;
  font-size: 26rpx;
  color: #999999;
  line-height: 48rpx;
}

.days-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.day-cell {
  width: 14.2857%;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.priority-dot {
  position: absolute;
  top: 6rpx;
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #ff4d4f;
  z-index: 2;
}

.day-inner {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.day-inner--selected {
  background: #10ad61;
}

.day-num {
  font-size: 30rpx;
  color: #1a1a1a;
  line-height: 1.2;
}

.day-num--other {
  color: #d8d8d8;
}

.day-num--selected {
  color: #ffffff;
  font-weight: 600;
}

.schedule-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #10ad61;
  margin-top: 4rpx;
}

.schedule-dot--selected {
  background: #ffffff;
}

.day-inner--other .schedule-dot {
  background: #c8e6d4;
}
</style>
