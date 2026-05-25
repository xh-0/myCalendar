<template>
  <view v-if="rendered" class="drawer-root" :class="{ 'drawer-root--visible': visible }">
    <view class="drawer-mask" @tap="emit('close')" />
    <view class="drawer-panel" @tap.stop>
      <view class="drawer-handle-bar">
        <view class="drawer-handle" />
      </view>
      <view class="drawer-body">
        <DayScheduleCard
          :date-key="dateKey"
          :schedules="schedules"
          @add="emit('add')"
          @more="emit('more', $event)"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import DayScheduleCard from '@/components/DayScheduleCard.vue'
import type { ScheduleItem } from '@/mock/schedule'

const props = defineProps<{
  visible: boolean
  dateKey: string
  schedules: ScheduleItem[]
}>()

const emit = defineEmits<{
  close: []
  add: []
  more: [id: string]
}>()

const rendered = ref(false)

watch(
  () => props.visible,
  (open) => {
    if (open) rendered.value = true
    else {
      setTimeout(() => {
        if (!props.visible) rendered.value = false
      }, 300)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.drawer-root {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: none;
}

.drawer-root--visible {
  pointer-events: auto;
}

.drawer-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.drawer-root--visible .drawer-mask {
  opacity: 1;
}

.drawer-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 72vh;
  background: #f5f5f5;
  border-radius: 32rpx 32rpx 0 0;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  padding-bottom: env(safe-area-inset-bottom);
}

.drawer-root--visible .drawer-panel {
  transform: translateY(0);
}

.drawer-handle-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 0 8rpx;
}

.drawer-handle {
  width: 64rpx;
  height: 8rpx;
  border-radius: 4rpx;
  background: #dddddd;
}

.drawer-body {
  padding: 0 24rpx 24rpx;
  max-height: calc(72vh - 48rpx);
  overflow-y: auto;
}

.drawer-body :deep(.schedule-card) {
  margin-top: 0;
}
</style>
