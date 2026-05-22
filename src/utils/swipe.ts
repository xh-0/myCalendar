export interface SwipeTouchState {
  startX: number
  startY: number
  time: number
}

type TouchLike = Touch & { pageX?: number; pageY?: number }

export function getTouchX(touch: TouchLike): number {
  return touch.clientX ?? touch.pageX ?? 0
}

export function getTouchY(touch: TouchLike): number {
  return touch.clientY ?? touch.pageY ?? 0
}

export function getSwipeTouchState(e: TouchEvent): SwipeTouchState {
  const touch = (e.touches[0] ?? e.changedTouches[0]) as TouchLike
  return {
    startX: getTouchX(touch),
    startY: getTouchY(touch),
    time: Date.now(),
  }
}

/**
 * 跟手拖动：范围内 1:1，超出后橡皮筋
 */
export function clampDragOffset(offset: number, panelWidth: number, rubberFactor = 0.22): number {
  if (panelWidth <= 0) return offset
  const min = -panelWidth
  const max = panelWidth
  if (offset >= min && offset <= max) return offset
  if (offset < min) return min - (min - offset) * rubberFactor
  return max + (offset - max) * rubberFactor
}

/**
 * 根据位移与速度决定吸附目标
 * @returns -1 上一月 | 0 回弹 | 1 下一月
 */
export function getSnapTarget(
  offset: number,
  panelWidth: number,
  velocity: number,
): -1 | 0 | 1 {
  const distanceThreshold = panelWidth * 0.18
  const velocityThreshold = 0.35

  if (velocity <= -velocityThreshold) return 1
  if (velocity >= velocityThreshold) return -1
  if (offset <= -distanceThreshold) return 1
  if (offset >= distanceThreshold) return -1
  return 0
}
