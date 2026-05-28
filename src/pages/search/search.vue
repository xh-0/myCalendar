<template>
  <view class="search-page">
    <view class="search-top">
      <view class="search-bar">
        <text class="search-bar-icon">🔍</text>
        <input
          v-model="filters.keyword"
          class="search-input"
          type="text"
          placeholder="搜索标题、地点、类型"
          placeholder-class="search-placeholder"
          confirm-type="search"
          :focus="inputFocus"
          @confirm="onInputConfirm"
        />
        <view v-if="filters.keyword" class="search-clear" @tap="clearKeyword">
          <text class="search-clear-text">×</text>
        </view>
      </view>

      <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
        <view class="category-scroll-inner">
          <view
            class="chip"
            :class="{ 'chip--active': filters.categories.length === 0 }"
            @tap="selectCategory('')"
          >
            <text class="chip-text">全部类型</text>
          </view>
          <view
            v-for="type in planTypes"
            :key="type.label"
            class="chip"
            :class="{ 'chip--active': isCategorySelected(type.label) }"
            @tap="selectCategory(type.label)"
          >
            <text class="chip-text">{{ type.icon }} {{ type.label }}</text>
          </view>
        </view>
      </scroll-view>

      <view class="status-row">
        <view
          v-for="opt in statusOptions"
          :key="opt.value"
          class="status-chip"
          :class="{ 'status-chip--active': filters.status === opt.value }"
          @tap="filters.status = opt.value"
        >
          <text class="status-chip-text">{{ opt.label }}</text>
        </view>
      </view>

      <view class="date-row">
        <picker
          mode="date"
          :value="filters.dateFrom || todayKey"
          @change="onDateFromChange"
        >
          <view
            class="date-pill"
            :class="{ 'date-pill--active': filters.dateFrom }"
          >
            <text class="date-pill-label">开始</text>
            <text class="date-pill-value">{{
              filters.dateFrom || "不限"
            }}</text>
          </view>
        </picker>
        <text class="date-sep">至</text>
        <picker
          mode="date"
          :value="filters.dateTo || todayKey"
          @change="onDateToChange"
        >
          <view
            class="date-pill"
            :class="{ 'date-pill--active': filters.dateTo }"
          >
            <text class="date-pill-label">结束</text>
            <text class="date-pill-value">{{ filters.dateTo || "不限" }}</text>
          </view>
        </picker>
        <view
          v-if="filters.dateFrom || filters.dateTo"
          class="date-clear"
          @tap="clearDateRange"
        >
          <text class="date-clear-text">清除</text>
        </view>
      </view>

      <view class="result-summary">
        <text class="result-count">共 {{ resultCount }} 条</text>
        <view v-if="hasFilters" class="reset-btn" @tap="resetFilters">
          <text class="reset-text">重置筛选</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="result-scroll" :show-scrollbar="false">
      <view v-if="groupedResults.length" class="result-list">
        <view
          v-for="group in groupedResults"
          :key="group.dateKey"
          class="result-group"
        >
          <text class="group-date">{{ group.dateLabel }}</text>
          <view class="group-card">
            <ScheduleSearchRow
              v-for="(item, index) in group.items"
              :key="item.id"
              :item="item"
              :show-border="index < group.items.length - 1"
              @select="onOpenDetail"
            />
          </view>
        </view>
      </view>

      <view v-else class="empty-wrap">
        <text class="empty-title">
          {{ hasFilters ? "没有符合条件的计划" : "暂无计划" }}
        </text>
        <text class="empty-desc">
          {{
            hasFilters
              ? "试试调整关键词或筛选条件"
              : "在日程页添加你的第一场拍摄吧"
          }}
        </text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import ScheduleSearchRow from "@/components/ScheduleSearchRow.vue";
import { useScheduleSync } from "@/composables/useScheduleSync";
import { getAllSchedules, PLAN_TYPES, scheduleVersion } from "@/mock/schedule";
import {
  DEFAULT_SCHEDULE_SEARCH_FILTERS,
  filterSchedules,
  groupSchedulesByDate,
  hasActiveSearchFilters,
  type ScheduleSearchFilters,
  type ScheduleStatusFilter,
} from "@/utils/schedule-search";

const planTypes = PLAN_TYPES;

const statusOptions: { label: string; value: ScheduleStatusFilter }[] = [
  { label: "全部", value: "all" },
  { label: "进行中", value: "active" },
  { label: "已取消", value: "cancelled" },
  { label: "重要", value: "priority" },
];

const todayKey = dayjs().format("YYYY-MM-DD");
const filters = ref<ScheduleSearchFilters>({
  ...DEFAULT_SCHEDULE_SEARCH_FILTERS,
});
const inputFocus = ref(false);
const pageRefreshKey = ref(0);

const hasFilters = computed(() => hasActiveSearchFilters(filters.value));

const filteredResults = computed(() => {
  pageRefreshKey.value;
  scheduleVersion.value;
  return filterSchedules(getAllSchedules(), filters.value);
});

const groupedResults = computed(() =>
  groupSchedulesByDate(filteredResults.value)
);
const resultCount = computed(() => filteredResults.value.length);

useScheduleSync(() => {
  pageRefreshKey.value += 1;
});

onLoad((query) => {
  if (query?.focus === "1") {
    inputFocus.value = true;
  }
  if (query?.category && typeof query.category === "string") {
    filters.value.categories = [decodeURIComponent(query.category)];
  }
});

function isCategorySelected(label: string): boolean {
  return filters.value.categories.includes(label);
}

function selectCategory(label: string) {
  if (!label) {
    filters.value.categories = [];
    return;
  }
  filters.value.categories = [label];
}

function onDateFromChange(e: { detail: { value: string } }) {
  filters.value.dateFrom = e.detail.value;
  if (filters.value.dateTo && filters.value.dateFrom > filters.value.dateTo) {
    filters.value.dateTo = filters.value.dateFrom;
  }
}

function onDateToChange(e: { detail: { value: string } }) {
  filters.value.dateTo = e.detail.value;
  if (filters.value.dateFrom && filters.value.dateTo < filters.value.dateFrom) {
    filters.value.dateFrom = filters.value.dateTo;
  }
}

function clearKeyword() {
  filters.value.keyword = "";
}

function clearDateRange() {
  filters.value.dateFrom = "";
  filters.value.dateTo = "";
}

function resetFilters() {
  filters.value = { ...DEFAULT_SCHEDULE_SEARCH_FILTERS };
}

function onInputConfirm() {
  uni.hideKeyboard();
}

function onOpenDetail(id: string) {
  uni.navigateTo({
    url: `/pages/plan-detail/plan-detail?id=${id}`,
  });
}
</script>

<style scoped>
.search-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
}

.search-top {
  flex-shrink: 0;
  padding: 16rpx 24rpx 0;
  background: #f7f8fa;
}

.search-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 80rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.search-bar-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
  line-height: 1;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #1a1a1a;
  height: 80rpx;
}

.search-placeholder {
  color: #cccccc;
}

.search-clear {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12rpx;
}

.search-clear-text {
  font-size: 32rpx;
  color: #999999;
  line-height: 1;
}

.category-scroll {
  width: 100%;
  margin-top: 20rpx;
  white-space: nowrap;
}

.category-scroll-inner {
  display: inline-flex;
  flex-direction: row;
  gap: 16rpx;
  padding: 4rpx 0 8rpx;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
  background: #ffffff;
  border: 2rpx solid transparent;
}

.chip--active {
  background: #e8f8ef;
  border-color: #10ad61;
}

.chip-text {
  font-size: 26rpx;
  color: #666666;
  white-space: nowrap;
}

.chip--active .chip-text {
  color: #10ad61;
  font-weight: 600;
}

.status-row {
  display: flex;
  flex-direction: row;
  gap: 16rpx;
  margin-top: 16rpx;
}

.status-chip {
  flex: 1;
  height: 64rpx;
  border-radius: 16rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-chip--active {
  background: #10ad61;
}

.status-chip-text {
  font-size: 26rpx;
  color: #666666;
}

.status-chip--active .status-chip-text {
  color: #ffffff;
  font-weight: 600;
}

.date-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16rpx;
  gap: 12rpx;
}

.date-pill {
  flex: 1;
  min-width: 0;
  padding: 16rpx 20rpx;
  background: #ffffff;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
}

.date-pill--active {
  border-color: #10ad61;
  background: #f0faf5;
}

.date-pill-label {
  display: block;
  font-size: 22rpx;
  color: #999999;
  margin-bottom: 4rpx;
}

.date-pill-value {
  display: block;
  font-size: 26rpx;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date-sep {
  font-size: 24rpx;
  color: #cccccc;
  flex-shrink: 0;
}

.date-clear {
  flex-shrink: 0;
  padding: 16rpx 8rpx;
}

.date-clear-text {
  font-size: 26rpx;
  color: #10ad61;
}

.result-summary {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 4rpx 16rpx;
}

.result-count {
  font-size: 26rpx;
  color: #999999;
}

.reset-btn {
  padding: 8rpx 0;
}

.reset-text {
  font-size: 26rpx;
  color: #10ad61;
}

.result-scroll {
  flex: 1;
  min-height: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 24rpx calc(24rpx + env(safe-area-inset-bottom));
}

.result-list {
  padding-bottom: 32rpx;
}

.result-group {
  margin-bottom: 24rpx;
}

.group-date {
  display: block;
  font-size: 26rpx;
  color: #999999;
  margin-bottom: 12rpx;
  padding-left: 8rpx;
}

.group-card {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 8rpx 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.04);
}

.empty-wrap {
  padding: 120rpx 48rpx;
  text-align: center;
}

.empty-title {
  display: block;
  font-size: 30rpx;
  color: #666666;
  margin-bottom: 16rpx;
}

.empty-desc {
  display: block;
  font-size: 26rpx;
  color: #cccccc;
  line-height: 1.5;
}
</style>
