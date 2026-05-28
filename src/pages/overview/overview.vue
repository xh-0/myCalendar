<template>
  <view class="page-body">
    <view class="search-entry" @tap="goSearch">
      <text class="search-entry-icon">🔍</text>
      <text class="search-entry-placeholder">搜索标题、地点、类型…</text>
    </view>
    <YearCalendar
      :year="viewYear"
      :selected-date="selectedDate"
      :refresh-key="pageRefreshKey"
      @select-date="onSelectDate"
      @prev-year="onPrevYear"
      @next-year="onNextYear"
      @pick-year="onPickYear"
      @go-today="onGoToday"
    />
    <ScheduleDrawer
      :visible="drawerVisible"
      :date-key="selectedDate"
      :schedules="daySchedules"
      @close="drawerVisible = false"
      @add="onAddPlan"
      @more="onTaskMore"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import YearCalendar from '@/components/YearCalendar.vue'
import ScheduleDrawer from '@/components/ScheduleDrawer.vue'
import { useScheduleSync } from '@/composables/useScheduleSync'
import { getSchedulesByDate, scheduleVersion } from '@/mock/schedule'
import { parseDateKey } from '@/utils/calendar'

const DEFAULT_DATE = dayjs().format('YYYY-MM-DD')

const viewYear = ref(dayjs().year())
const selectedDate = ref(DEFAULT_DATE)
const drawerVisible = ref(false)
const pageRefreshKey = ref(0)

const daySchedules = computed(() => {
  pageRefreshKey.value
  scheduleVersion.value
  return getSchedulesByDate(selectedDate.value)
})

useScheduleSync(() => {
  pageRefreshKey.value += 1
})

function onSelectDate(dateKey: string) {
  selectedDate.value = dateKey
  const { year } = parseDateKey(dateKey)
  viewYear.value = year
  drawerVisible.value = true
}

function onPrevYear() {
  viewYear.value -= 1
}

function onNextYear() {
  viewYear.value += 1
}

function onPickYear(year: number) {
  viewYear.value = year
}

function onGoToday() {
  const today = dayjs()
  viewYear.value = today.year()
  selectedDate.value = today.format('YYYY-MM-DD')
  drawerVisible.value = true
}

function goSearch() {
  uni.navigateTo({ url: '/pages/search/search?focus=1' })
}

function onAddPlan() {
  drawerVisible.value = false
  uni.navigateTo({
    url: `/pages/add-plan/add-plan?date=${selectedDate.value}`,
  })
}

function onTaskMore(id: string) {
  drawerVisible.value = false
  uni.navigateTo({
    url: `/pages/plan-detail/plan-detail?id=${id}`,
  })
}
</script>

<style scoped>
.page-body {
  padding: 0 24rpx 32rpx;
}

.search-entry {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 72rpx;
  margin: 8rpx 0 16rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.search-entry-icon {
  font-size: 30rpx;
  margin-right: 12rpx;
  line-height: 1;
}

.search-entry-placeholder {
  font-size: 28rpx;
  color: #cccccc;
}
</style>
