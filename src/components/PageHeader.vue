<template>
  <view class="page-layout">
    <!-- 固定在顶部的导航栏 -->
    <view class="page-header">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-bar">
        <text class="page-title">{{ title }}</text>
      </view>
    </view>

    <!-- 占位，避免内容被固定头部遮挡 -->
    <view class="header-placeholder" :style="{ height: headerHeight + 'px' }" />

    <!-- 页面正文，超出后由页面原生滚动 -->
    <view class="page-content">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { HEADER_BAR_PX } from '@/utils/layout'

defineProps<{
  title: string
}>()

const statusBarHeight = ref(0)
const sys = uni.getSystemInfoSync()
statusBarHeight.value = sys.statusBarHeight ?? 20

const headerHeight = computed(() => statusBarHeight.value + HEADER_BAR_PX)
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #f5f5f5;
}

.status-bar {
  width: 100%;
}

.header-bar {
  height: 88rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 32rpx;
}

.page-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #1a1a1a;
  text-align: center;
  line-height: 1.2;
}

.header-placeholder {
  width: 100%;
  flex-shrink: 0;
}

.page-content {
  width: 100%;
}
</style>
