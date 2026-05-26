<template>
  <view class="calendar-grid" :class="{ 'calendar-grid--compact': compact }">
    <view v-if="!hideWeekHeader" class="week-row">
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
            v-if="scheduleColors(cell.dateKey).length"
            class="schedule-dots"
          >
            <view
              v-for="(color, dotIndex) in scheduleColors(cell.dateKey)"
              :key="dotIndex"
              class="schedule-dot"
              :class="{
                'schedule-dot--selected': isSelected(cell),
                'schedule-dot--other-month': !cell.isCurrentMonth,
              }"
              :style="{ background: color }"
            />
          </view>
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
import {
  getScheduleColorsOnDate,
  hasPriorityOnDate,
  scheduleVersion,
} from '@/mock/schedule'

const props = defineProps<{
  viewYear: number
  viewMonth: number
  selectedDate: string
  refreshKey?: number
  compact?: boolean
  hideWeekHeader?: boolean
}>()

const emit = defineEmits<{
  select: [cell: CalendarDay]
}>()

const weekLabels = getWeekLabels()
const days = computed(() => buildCalendarGrid(props.viewYear, props.viewMonth))

function scheduleColors(dateKey: string) {
  props.refreshKey
  scheduleVersion.value
  return getScheduleColorsOnDate(dateKey)
}

function hasPriority(dateKey: string) {
  props.refreshKey
  scheduleVersion.value
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

.schedule-dots {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  margin-top: 4rpx;
  min-height: 8rpx;
}

.schedule-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.schedule-dot--selected {
  box-shadow: 0 0 0 1rpx rgba(255, 255, 255, 0.85);
}

.schedule-dot--other-month {
  opacity: 0.45;
}

.calendar-grid--compact .week-cell {
  font-size: 24rpx;
  line-height: 40rpx;
  margin-bottom: 0;
}

.calendar-grid--compact .week-row {
  margin-bottom: 4rpx;
}

.calendar-grid--compact .day-cell {
  height: 76rpx;
}

.calendar-grid--compact .day-inner {
  width: 64rpx;
  height: 64rpx;
  border-radius: 14rpx;
}

.calendar-grid--compact .day-num {
  font-size: 28rpx;
}

.calendar-grid--compact .schedule-dots {
  gap: 3rpx;
  margin-top: 3rpx;
  min-height: 7rpx;
}

.calendar-grid--compact .schedule-dot {
  width: 7rpx;
  height: 7rpx;
}

.calendar-grid--compact .priority-dot {
  top: 5rpx;
  width: 7rpx;
  height: 7rpx;
}
</style>
