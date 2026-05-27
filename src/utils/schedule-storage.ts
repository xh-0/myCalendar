import type { ScheduleItem } from '@/types/schedule'

const STORAGE_KEY = 'my_calendar_schedules_v1'

/** 兼容字符串 / 对象 / 历史双重 JSON 编码 */
function normalizeStored(raw: unknown): ScheduleItem[] | null {
  if (raw == null || raw === '') return null

  let data: unknown = raw
  for (let i = 0; i < 2; i++) {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch {
        return null
      }
    } else {
      break
    }
  }

  if (!Array.isArray(data)) return null
  return data as ScheduleItem[]
}

function toPlainSchedules(schedules: ScheduleItem[]): ScheduleItem[] {
  return schedules.map((item) => ({ ...item }))
}

export function loadSchedulesFromStorage(): ScheduleItem[] | null {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    return normalizeStored(raw)
  } catch {
    return null
  }
}

/** 同步保存（供大部分场景） */
export function saveSchedulesToStorage(schedules: ScheduleItem[]): void {
  const data = toPlainSchedules(schedules)
  try {
    uni.setStorageSync(STORAGE_KEY, data)
  } catch (e) {
    console.error('[schedule-storage] save failed', e)
    uni.showToast({ title: '保存失败，请重试', icon: 'none' })
    throw e
  }
}

/** 异步保存，确保写入完成后再跳转页面 */
export function saveSchedulesToStorageAsync(
  schedules: ScheduleItem[],
): Promise<void> {
  const data = toPlainSchedules(schedules)
  return new Promise((resolve, reject) => {
    uni.setStorage({
      key: STORAGE_KEY,
      data,
      success: () => resolve(),
      fail: (err) => {
        console.error('[schedule-storage] async save failed', err)
        uni.showToast({ title: '保存失败，请重试', icon: 'none' })
        reject(err)
      },
    })
  })
}

export function clearSchedulesStorage(): void {
  try {
    uni.removeStorageSync(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
