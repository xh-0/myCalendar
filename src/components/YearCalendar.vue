<template>
  <view class="year-calendar">
    <view class="calendar-header">
      <view class="today-btn" @tap="emit('go-today')">
        <text class="today-text">今天</text>
      </view>
      <view class="calendar-nav">
        <view class="nav-btn" @tap="goPrevYear">
          <text class="nav-arrow">‹</text>
        </view>
        <picker
          mode="date"
          fields="year"
          :value="yearPickerValue"
          start="2020"
          end="2035"
          @change="onYearPickerChange"
        >
          <view class="year-label">
            <text class="year-text">{{ year }}年</text>
            <text class="year-chevron">▾</text>
          </view>
        </picker>
        <view class="nav-btn" @tap="goNextYear">
          <text class="nav-arrow">›</text>
        </view>
      </view>
      <view class="header-side" />
    </view>

    <view class="week-row week-row--sticky">
      <text v-for="label in weekLabels" :key="label" class="week-cell">{{ label }}</text>
    </view>

    <view
      v-for="month in monthIndexes"
      :id="`year-month-${month}`"
      :key="month"
      class="month-section"
    >
      <text class="month-title">{{ month + 1 }}月</text>
      <CalendarGrid
        compact
        hide-week-header
        :view-year="year"
        :view-month="month"
        :selected-date="selectedDate"
        :refresh-key="refreshKey"
        @select="onSelect"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CalendarGrid from '@/components/CalendarGrid.vue'
import { getWeekLabels, type CalendarDay } from '@/utils/calendar'

const props = defineProps<{
  year: number
  selectedDate: string
  refreshKey?: number
}>()

const emit = defineEmits<{
  'select-date': [dateKey: string]
  'prev-year': []
  'next-year': []
  'pick-year': [year: number]
  'go-today': []
}>()

const weekLabels = getWeekLabels()
const monthIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

const yearPickerValue = computed(() => String(props.year))

function onSelect(cell: CalendarDay) {
  emit('select-date', cell.dateKey)
}

function onYearPickerChange(e: { detail: { value: string } }) {
  const year = Number(e.detail.value.split('-')[0])
  emit('pick-year', year)
}

function goPrevYear() {
  emit('prev-year')
}

function goNextYear() {
  emit('next-year')
}
</script>

<style scoped>
.year-calendar {
  padding: 0 8rpx 16rpx;
}

.calendar-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 0 8rpx;
}

.today-btn {
  flex-shrink: 0;
  padding: 10rpx 24rpx;
  border-radius: 32rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.today-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #10ad61;
  line-height: 1.2;
}

.calendar-nav {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 32rpx;
}

.header-side {
  flex-shrink: 0;
  width: 104rpx;
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

.year-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
}

.year-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.year-chevron {
  font-size: 24rpx;
  color: #999999;
  margin-top: 4rpx;
}

.week-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 8rpx;
  padding: 0 0 12rpx;
  background: #f5f5f5;
}

.week-row--sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}

.week-cell {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
  color: #999999;
  line-height: 40rpx;
}

.month-section {
  margin-bottom: 28rpx;
}

.month-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8rpx;
  padding-left: 4rpx;
}
</style>
