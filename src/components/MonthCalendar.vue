<template>
  <view class="calendar">
    <view class="calendar-header">
      <view class="today-btn" @tap="emit('go-today')">
        <text class="today-text">今天</text>
      </view>
      <view class="calendar-nav">
        <view class="nav-btn" @tap="goPrevMonth">
          <text class="nav-arrow">‹</text>
        </view>
        <picker
          mode="date"
          fields="month"
          :value="monthPickerValue"
          :start="pickerStart"
          :end="pickerEnd"
          @change="onMonthPickerChange"
        >
          <view class="month-label">
            <text class="month-text">{{ monthTitle }}</text>
            <text class="month-chevron">▾</text>
          </view>
        </picker>
        <view class="nav-btn" @tap="goNextMonth">
          <text class="nav-arrow">›</text>
        </view>
      </view>
      <view class="header-side" />
    </view>

    <view
      id="calendar-body"
      class="calendar-body"
      :catchtouchmove="isDragging"
      @touchstart="onTouchStart"
      @touchmove.stop="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchCancel"
    >
      <view class="calendar-track" :style="trackStyle">
        <view class="calendar-panel" :style="panelStyle">
          <CalendarGrid
            :view-year="prevMonth.year"
            :view-month="prevMonth.month"
            :selected-date="selectedDate"
            @select="onSelect"
          />
        </view>
        <view class="calendar-panel" :style="panelStyle">
          <CalendarGrid
            :view-year="year"
            :view-month="month"
            :selected-date="selectedDate"
            @select="onSelect"
          />
        </view>
        <view class="calendar-panel" :style="panelStyle">
          <CalendarGrid
            :view-year="nextMonth.year"
            :view-month="nextMonth.month"
            :selected-date="selectedDate"
            @select="onSelect"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import CalendarGrid from '@/components/CalendarGrid.vue'
import {
  formatMonthTitle,
  shiftMonth,
  type CalendarDay,
} from '@/utils/calendar'
import {
  clampDragOffset,
  getSnapTarget,
  getSwipeTouchState,
  getTouchX,
  getTouchY,
  type SwipeTouchState,
} from '@/utils/swipe'

const SWIPE_DURATION = 340
const SWIPE_EASING = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

const props = defineProps<{
  year: number
  month: number
  selectedDate: string
}>()

const emit = defineEmits<{
  'select-date': [dateKey: string]
  'prev-month': []
  'next-month': []
  'pick-month': [year: number, month: number]
  'go-today': []
}>()

const PICKER_START = '2020-01'
const PICKER_END = '2035-12'

const instance = getCurrentInstance()

function getDefaultPanelWidth() {
  const sys = uni.getSystemInfoSync()
  return sys.windowWidth - uni.upx2px(48)
}

const panelWidth = ref(getDefaultPanelWidth())
const dragOffset = ref(0)
const animating = ref(false)
const isDragging = ref(false)
const swipeAxis = ref<'none' | 'horizontal' | 'vertical'>('none')

const touchStart = ref<SwipeTouchState | null>(null)
const lastMoveX = ref(0)
const lastMoveTime = ref(0)
const velocityX = ref(0)

const prevMonth = computed(() => shiftMonth(props.year, props.month, -1))
const nextMonth = computed(() => shiftMonth(props.year, props.month, 1))
const monthTitle = computed(() => formatMonthTitle(props.year, props.month))

const monthPickerValue = computed(() => {
  const m = String(props.month + 1).padStart(2, '0')
  return `${props.year}-${m}`
})

const pickerStart = PICKER_START
const pickerEnd = PICKER_END

function onMonthPickerChange(e: { detail: { value: string } }) {
  const [year, month] = e.detail.value.split('-').map(Number)
  emit('pick-month', year, month - 1)
}

const trackStyle = computed(() => {
  const x = -panelWidth.value + dragOffset.value
  const style: Record<string, string> = {
    transform: `translate3d(${x}px, 0, 0)`,
  }
  if (animating.value) {
    style.transition = `transform ${SWIPE_DURATION}ms ${SWIPE_EASING}`
  } else {
    style.transition = 'none'
  }
  return style
})

const panelStyle = computed(() => ({
  width: `${panelWidth.value}px`,
  flexShrink: '0',
}))

function measurePanelWidth() {
  if (!instance) return
  uni
    .createSelectorQuery()
    .in(instance)
    .select('#calendar-body')
    .boundingClientRect((rect) => {
      const width = rect && !Array.isArray(rect) ? (rect.width ?? 0) : 0
      if (width > 0) panelWidth.value = width
    })
    .exec()
}

onMounted(() => {
  measurePanelWidth()
})

watch(
  () => [props.year, props.month],
  () => {
    dragOffset.value = 0
    animating.value = false
    isDragging.value = false
    swipeAxis.value = 'none'
  },
)

function onSelect(cell: CalendarDay) {
  if (isDragging.value || swipeAxis.value === 'horizontal') return
  emit('select-date', cell.dateKey)
}

function onTouchStart(e: TouchEvent) {
  if (animating.value) return
  measurePanelWidth()
  touchStart.value = getSwipeTouchState(e)
  lastMoveX.value = touchStart.value.startX
  lastMoveTime.value = touchStart.value.time
  velocityX.value = 0
  swipeAxis.value = 'none'
  animating.value = false
  isDragging.value = false
}

function applyDrag(dx: number) {
  dragOffset.value = clampDragOffset(dx, panelWidth.value)
}

function onTouchMove(e: TouchEvent) {
  if (!touchStart.value || animating.value) return

  const touch = e.touches[0]
  if (!touch) return

  const x = getTouchX(touch)
  const y = getTouchY(touch)
  const dx = x - touchStart.value.startX
  const dy = y - touchStart.value.startY

  if (swipeAxis.value === 'none') {
    if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return
    if (Math.abs(dx) >= Math.abs(dy)) {
      swipeAxis.value = 'horizontal'
      isDragging.value = true
      applyDrag(dx)
    } else {
      swipeAxis.value = 'vertical'
      touchStart.value = null
      return
    }
  }

  if (swipeAxis.value !== 'horizontal') return

  const now = Date.now()
  const dt = now - lastMoveTime.value
  if (dt > 0) {
    velocityX.value = (x - lastMoveX.value) / dt
  }
  lastMoveX.value = x
  lastMoveTime.value = now

  applyDrag(dx)
}

function onTouchEnd(e: TouchEvent) {
  if (!touchStart.value || swipeAxis.value !== 'horizontal') {
    resetTouch()
    return
  }

  const touch = e.changedTouches[0]
  const dx = touch ? getTouchX(touch) - touchStart.value.startX : dragOffset.value
  const target = getSnapTarget(dx, panelWidth.value, velocityX.value)
  resetTouch()

  if (target === 0) {
    snapTo(0)
    return
  }

  snapTo(target === 1 ? -panelWidth.value : panelWidth.value, () => {
    if (target === 1) emit('next-month')
    else emit('prev-month')
    dragOffset.value = 0
    animating.value = false
  })
}

function onTouchCancel() {
  if (swipeAxis.value === 'horizontal') snapTo(0)
  resetTouch()
}

function resetTouch() {
  touchStart.value = null
  isDragging.value = false
  swipeAxis.value = 'none'
  velocityX.value = 0
}

function snapTo(offset: number, onDone?: () => void) {
  animating.value = true
  dragOffset.value = offset
  setTimeout(() => {
    if (onDone) onDone()
    else animating.value = false
  }, SWIPE_DURATION)
}

function goPrevMonth() {
  if (animating.value) return
  if (!panelWidth.value) {
    emit('prev-month')
    return
  }
  snapTo(panelWidth.value, () => {
    emit('prev-month')
    dragOffset.value = 0
    animating.value = false
  })
}

function goNextMonth() {
  if (animating.value) return
  if (!panelWidth.value) {
    emit('next-month')
    return
  }
  snapTo(-panelWidth.value, () => {
    emit('next-month')
    dragOffset.value = 0
    animating.value = false
  })
}
</script>

<style scoped>
.calendar {
  padding: 0 8rpx 16rpx;
}

.calendar-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 28rpx;
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

.month-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
}

.month-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.month-chevron {
  font-size: 24rpx;
  color: #999999;
  margin-top: 4rpx;
}

.calendar-body {
  overflow: hidden;
  width: 100%;
  touch-action: pan-y;
}

.calendar-track {
  display: flex;
  flex-direction: row;
  will-change: transform;
  backface-visibility: hidden;
}

.calendar-panel {
  flex-shrink: 0;
}
</style>
