<template>
  <view class="calendar-grid">
    <view class="week-row">
      <text v-for="label in weekLabels" :key="label" class="week-cell">{{ label }}</text>
    </view>
    <view class="days-grid">
      <view
        v-for="(cell, index) in days"
        :key="`${viewYear}-${viewMonth}-${index}-${cell.dateKey}`"
        class="day-cell"
        @tap="emit('select', cell)"
      >
        <view v-if="hasPriority(cell.dateKey)" class="priority-dot" />
        <view
          class="day-inner"
          :class="{
            'day-inner--other': !cell.isCurrentMonth,
            'day-inner--today': cell.isToday,
            'day-inner--selected': isSelected(cell),
          }"
        >
          <text
            class="day-num"
            :class="{
              'day-num--other': !cell.isCurrentMonth,
              'day-num--selected': isSelected(cell),
            }"
          >{{ cell.day }}</text>
          <view
            v-if="hasSchedule(cell.dateKey)"
            class="schedule-dot"
            :class="{ 'schedule-dot--selected': isSelected(cell) }"
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
  getWeekLabels,
  isDateSelected,
  type CalendarDay,
} from '@/utils/calendar'
import { hasPriorityOnDate, hasScheduleOnDate } from '@/mock/schedule'

const props = defineProps<{
  viewYear: number
  viewMonth: number
  selectedDate: string
}>()

const emit = defineEmits<{
  select: [cell: CalendarDay]
}>()

const weekLabels = getWeekLabels()
const days = computed(() => buildCalendarGrid(props.viewYear, props.viewMonth))

function hasSchedule(dateKey: string) {
  return hasScheduleOnDate(dateKey)
}

function hasPriority(dateKey: string) {
  return hasPriorityOnDate(dateKey)
}

function isSelected(cell: CalendarDay) {
  return isDateSelected(cell, props.selectedDate, props.viewYear, props.viewMonth)
}
</script>

<style scoped>
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

.day-inner--today {
  border: 2rpx solid #10ad61;
  box-sizing: border-box;
}

.day-inner--today.day-inner--selected {
  border-color: #ffffff;
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
