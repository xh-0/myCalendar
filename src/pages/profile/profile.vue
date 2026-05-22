<template>
  <view class="profile-card">
    <view class="avatar">
      <text class="avatar-text">我</text>
    </view>
    <text class="nickname">日历用户</text>
    <text class="desc">个人中心功能即将上线</text>
  </view>

  <view class="menu-list">
    <view class="menu-item" @tap="showTip('账号设置')">
      <text class="menu-label">账号设置</text>
      <text class="menu-arrow">›</text>
    </view>
    <view class="menu-item" @tap="showTip('提醒设置')">
      <text class="menu-label">提醒设置</text>
      <text class="menu-arrow">›</text>
    </view>
    <view class="menu-item menu-item--last" @tap="showTip('关于')">
      <text class="menu-label">关于</text>
      <text class="menu-arrow">›</text>
    </view>
  </view>
</template>

<script setup lang="ts">
function showTip(name: string) {
  uni.showToast({ title: `${name}开发中`, icon: "none" });
}
</script>

<style scoped>
.profile-card {
  margin: 16rpx 24rpx 24rpx;
  padding: 48rpx 32rpx;
  background: #ffffff;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.04);
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #10ad61;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.avatar-text {
  font-size: 48rpx;
  color: #ffffff;
  font-weight: 600;
}

.nickname {
  font-size: 36rpx;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12rpx;
}

.desc {
  font-size: 26rpx;
  color: #999999;
}

.menu-list {
  margin: 0 24rpx 32rpx;
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.04);
}

.menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 28rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-item--last {
  border-bottom: none;
}

.menu-label {
  font-size: 30rpx;
  color: #1a1a1a;
}

.menu-arrow {
  font-size: 36rpx;
  color: #cccccc;
}
</style>
