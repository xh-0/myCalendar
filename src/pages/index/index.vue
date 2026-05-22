<template>
  <view class="page">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />
    <view class="page-header">
      <text class="page-title">这个月的日程</text>
    </view>

    <scroll-view class="page-scroll" scroll-y :style="{ height: scrollHeight + 'px' }">
      <view class="page-body">
        <MonthCalendar
          :year="viewYear"
          :month="viewMonth"
          :selected-date="selectedDate"
          @select-date="onSelectDate"
          @prev-month="onPrevMonth"
          @next-month="onNextMonth"
          @pick-month="onPickMonth"
        />
        <DayScheduleCard
          :date-key="selectedDate"
          :schedules="daySchedules"
          @add="onAddPlan"
          @more="onTaskMore"
        />
      </view>
      <view class="tab-placeholder" />
    </scroll-view>

    <AppTabBar active="schedule" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MonthCalendar from '@/components/MonthCalendar.vue'
import DayScheduleCard from '@/components/DayScheduleCard.vue'
import AppTabBar from '@/components/AppTabBar.vue'
import { getSchedulesByDate } from '@/mock/schedule'

const DEFAULT_DATE = '2024-05-24'

const statusBarHeight = ref(0)
const scrollHeight = ref(600)
const viewYear = ref(2024)
const viewMonth = ref(4)
const selectedDate = ref(DEFAULT_DATE)

const daySchedules = computed(() => getSchedulesByDate(selectedDate.value))

function initLayout() {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight ?? 20
  const tabBarH = 100 + (sys.safeAreaInsets?.bottom ?? 0)
  scrollHeight.value = sys.windowHeight - statusBarHeight.value - 56 - tabBarH
}

initLayout()

function onSelectDate(dateKey: string) {
  selectedDate.value = dateKey
  const [y, m] = dateKey.split('-').map(Number)
  if (y !== viewYear.value || m - 1 !== viewMonth.value) {
    viewYear.value = y
    viewMonth.value = m - 1
  }
}

function onPrevMonth() {
  if (viewMonth.value === 0) {
    viewYear.value -= 1
    viewMonth.value = 11
  } else {
    viewMonth.value -= 1
  }
}

function onNextMonth() {
  if (viewMonth.value === 11) {
    viewYear.value += 1
    viewMonth.value = 0
  } else {
    viewMonth.value += 1
  }
}

function onPickMonth() {
  uni.showToast({ title: '月份选择即将上线', icon: 'none' })
}

function onAddPlan() {
  uni.showToast({ title: '添加计划功能开发中', icon: 'none' })
}

function onTaskMore(id: string) {
  uni.showToast({ title: `计划 ${id}`, icon: 'none' })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

.status-bar {
  width: 100%;
}

.page-header {
  padding: 12rpx 32rpx 20rpx;
}

.page-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
}

.page-scroll {
  width: 100%;
}

.page-body {
  padding: 0 24rpx 24rpx;
}

.tab-placeholder {
  height: 140rpx;
}
</style>
