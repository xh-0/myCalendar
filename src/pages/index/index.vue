<template>
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
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import MonthCalendar from "@/components/MonthCalendar.vue";
import DayScheduleCard from "@/components/DayScheduleCard.vue";
import dayjs from "dayjs";

import { getSchedulesByDate } from "@/mock/schedule";
import { parseDateKey } from "@/utils/calendar";

const DEFAULT_DATE = dayjs().format("YYYY-MM-DD");

const viewYear = ref(dayjs().year());
const viewMonth = ref(dayjs().month());
const selectedDate = ref(DEFAULT_DATE);

const daySchedules = computed(() => getSchedulesByDate(selectedDate.value));

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

function onPickMonth() {
  uni.showToast({ title: "月份选择即将上线", icon: "none" });
}

function onAddPlan() {
  uni.navigateTo({
    url: `/pages/add-plan/add-plan?date=${selectedDate.value}`,
  });
}

function onTaskMore(id: string) {
  uni.navigateTo({
    url: `/pages/plan-detail/plan-detail?id=${id}`,
  });
}
</script>

<style scoped>
.page-body {
  padding: 0 24rpx 32rpx;
}
</style>
