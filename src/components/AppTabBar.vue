<template>
  <view class="tab-bar-wrap">
    <view class="tab-bar">
      <view
        class="tab-item"
        :class="{ 'tab-item--active': active === 'schedule' }"
        @tap="switchTab('schedule')"
      >
        <view class="tab-icon tab-icon--calendar" :class="{ 'tab-icon--active': active === 'schedule' }">
          <view class="cal-top" />
          <view class="cal-body">
            <view class="cal-dot" />
            <view class="cal-dot" />
            <view class="cal-dot" />
          </view>
        </view>
        <text class="tab-label" :class="{ 'tab-label--active': active === 'schedule' }">日程</text>
      </view>

      <view
        class="tab-item"
        :class="{ 'tab-item--active': active === 'profile' }"
        @tap="switchTab('profile')"
      >
        <view class="tab-icon tab-icon--user" :class="{ 'tab-icon--active': active === 'profile' }">
          <view class="user-head" />
          <view class="user-body" />
        </view>
        <text class="tab-label" :class="{ 'tab-label--active': active === 'profile' }">我</text>
      </view>
    </view>
    <view class="safe-bottom" />
  </view>
</template>

<script setup lang="ts">
defineProps<{
  active: 'schedule' | 'profile'
}>()

const ROUTES = {
  schedule: '/pages/index/index',
  profile: '/pages/profile/profile',
} as const

function switchTab(tab: 'schedule' | 'profile') {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  const route = '/' + (current?.route ?? '')
  const target = ROUTES[tab]
  if (route === target) return
  uni.reLaunch({ url: target })
}
</script>

<style scoped>
.tab-bar-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: #ffffff;
  border-top: 1rpx solid #eeeeee;
}

.tab-bar {
  display: flex;
  flex-direction: row;
  height: 100rpx;
  padding-top: 8rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
}

.tab-label {
  font-size: 22rpx;
  color: #666666;
}

.tab-label--active {
  color: #10ad61;
  font-weight: 500;
}

.tab-icon {
  width: 44rpx;
  height: 44rpx;
  position: relative;
}

.tab-icon--calendar .cal-top {
  width: 36rpx;
  height: 10rpx;
  border: 3rpx solid #333333;
  border-bottom: none;
  border-radius: 6rpx 6rpx 0 0;
  margin: 0 auto;
  box-sizing: border-box;
}

.tab-icon--calendar.tab-icon--active .cal-top {
  border-color: #10ad61;
}

.tab-icon--calendar .cal-body {
  width: 36rpx;
  height: 28rpx;
  border: 3rpx solid #333333;
  border-radius: 0 0 6rpx 6rpx;
  margin: -2rpx auto 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: 4rpx;
  padding-bottom: 6rpx;
}

.tab-icon--calendar.tab-icon--active .cal-body {
  border-color: #10ad61;
}

.cal-dot {
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  background: #333333;
}

.tab-icon--calendar.tab-icon--active .cal-dot {
  background: #10ad61;
}

.tab-icon--user .user-head {
  width: 18rpx;
  height: 18rpx;
  border: 3rpx solid #333333;
  border-radius: 50%;
  margin: 4rpx auto 0;
  box-sizing: border-box;
}

.tab-icon--user.tab-icon--active .user-head {
  border-color: #10ad61;
}

.tab-icon--user .user-body {
  width: 32rpx;
  height: 16rpx;
  border: 3rpx solid #333333;
  border-top: none;
  border-radius: 0 0 16rpx 16rpx;
  margin: 4rpx auto 0;
  box-sizing: border-box;
}

.tab-icon--user.tab-icon--active .user-body {
  border-color: #10ad61;
}

.safe-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}
</style>
