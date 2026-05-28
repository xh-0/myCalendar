<template>
  <view class="page-body">
    <view class="search-entry" @tap="goSearch">
      <text class="search-entry-icon">🔍</text>
      <text class="search-entry-placeholder">搜索标题、地点、类型…</text>
    </view>
    <MonthCalendar
      :year="viewYear"
      :month="viewMonth"
      :selected-date="selectedDate"
      :refresh-key="pageRefreshKey"
      @select-date="onSelectDate"
      @prev-month="onPrevMonth"
      @next-month="onNextMonth"
      @pick-month="onPickMonth"
      @go-today="onGoToday"
    />
    <DayScheduleCard
      :date-key="selectedDate"
      :schedules="daySchedules"
      @add="onAddPlan"
      @select="onTaskSelect"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onPullDownRefresh } from "@dcloudio/uni-app";
import MonthCalendar from "@/components/MonthCalendar.vue";
import DayScheduleCard from "@/components/DayScheduleCard.vue";
import dayjs from "dayjs";
import { useScheduleSync } from "@/composables/useScheduleSync";
import {
  forceRefreshSchedulesFromCloud,
  getSchedulesByDate,
  scheduleVersion,
} from "@/mock/schedule";
import { parseDateKey } from "@/utils/calendar";

const DEFAULT_DATE = dayjs().format("YYYY-MM-DD");

const viewYear = ref(dayjs().year());
const viewMonth = ref(dayjs().month());
const selectedDate = ref(DEFAULT_DATE);

const pageRefreshKey = ref(0);

const daySchedules = computed(() => {
  pageRefreshKey.value;
  scheduleVersion.value;
  return getSchedulesByDate(selectedDate.value);
});

useScheduleSync(() => {
  pageRefreshKey.value += 1;
});

onPullDownRefresh(async () => {
  try {
    await forceRefreshSchedulesFromCloud();
    pageRefreshKey.value += 1;
  } finally {
    uni.stopPullDownRefresh();
  }
});

function onSelectDate(dateKey: string) {
  selectedDate.value = dateKey;
  const { year, month } = parseDateKey(dateKey);
  viewYear.value = year;
  viewMonth.value = month;
}

function onPrevMonth() {
  if (viewMonth.value === 0) {
    viewYear.value -= 1;
    viewMonth.value = 11;
  } else {
    viewMonth.value -= 1;
  }
}

function onNextMonth() {
  if (viewMonth.value === 11) {
    viewYear.value += 1;
    viewMonth.value = 0;
  } else {
    viewMonth.value += 1;
  }
}

function onPickMonth(year: number, month: number) {
  viewYear.value = year;
  viewMonth.value = month;
}

function onGoToday() {
  const today = dayjs();
  viewYear.value = today.year();
  viewMonth.value = today.month();
  selectedDate.value = today.format("YYYY-MM-DD");
}

function goSearch() {
  uni.navigateTo({
    url: "/pages/search/search?focus=1",
  });
}

function onAddPlan() {
  uni.navigateTo({
    url: `/pages/add-plan/add-plan?date=${selectedDate.value}`,
  });
}

function onTaskSelect(id: string) {
  uni.navigateTo({
    url: `/pages/plan-detail/plan-detail?id=${id}`,
  });
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
