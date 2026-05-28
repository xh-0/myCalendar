import { ref } from 'vue'
import {
  loadSchedulesFromStorage,
  saveSchedulesToStorage,
  saveSchedulesToStorageAsync,
} from '@/utils/schedule-storage'
import type { ScheduleItem } from '@/types/schedule'
// #ifdef MP-WEIXIN
import { CLOUD_PULL_COOLDOWN_MS } from '@/config/weixin-cloud'
import {
  applyCloudScheduleChange,
  fetchAllSchedulesFromCloud,
} from '@/utils/schedule-cloud'
// #endif

/** 云端单条同步（微信端使用） */
type ScheduleCloudChange =
  | { type: 'upsert'; item: ScheduleItem }
  | { type: 'remove'; id: string }

export type { ScheduleItem } from '@/types/schedule'

export const scheduleVersion = ref(0)

function bumpScheduleVersion() {
  scheduleVersion.value += 1
}

export const PLAN_TYPES = [
  { label: '约拍', icon: '📷', color: '#3B82F6', colorLight: '#EFF6FF' },
  { label: '订婚', icon: '💍', color: '#EC4899', colorLight: '#FDF2F8' },
  { label: '结婚', icon: '💒', color: '#DC2626', colorLight: '#FEF2F2' },
  { label: '写真', icon: '✨', color: '#8B5CF6', colorLight: '#F5F3FF' },
  { label: '闺蜜照', icon: '👯', color: '#F59E0B', colorLight: '#FFFBEB' },
  { label: '亲子', icon: '👶', color: '#14B8A6', colorLight: '#F0FDFA' },
  { label: '毕业照', icon: '🎓', color: '#6366F1', colorLight: '#EEF2FF' },
  { label: '商业拍摄', icon: '🏢', color: '#64748B', colorLight: '#F8FAFC' },
  { label: '其他', icon: '📌', color: '#9CA3AF', colorLight: '#F9FAFB' },
] as const

export type PlanType = (typeof PLAN_TYPES)[number]

const DEFAULT_PLAN_TYPE = PLAN_TYPES[PLAN_TYPES.length - 1]

let schedules: ScheduleItem[] = []
let initialized = false
let initPromise: Promise<void> | null = null
let refreshPromise: Promise<void> | null = null
let lastCloudPullAt = 0
/** 本地有增删改后，下次进入页面需与云端合并一次（可绕过冷却） */
let pendingCloudSync = false

/** 更新内存中的日程并同步写入本地 storage */
function applySchedules(items: ScheduleItem[]): void {
  schedules = items.map((s) => ({ ...s }))
  saveSchedulesToStorage(schedules)
  bumpScheduleVersion()
}

function isActiveSchedule(item: ScheduleItem): boolean {
  return !item.cancelled
}

function cloudSync(change: ScheduleCloudChange): void {
  // #ifdef MP-WEIXIN
  pendingCloudSync = true
  applyCloudScheduleChange(change)
    .catch((e) => {
      console.error('[schedule] cloud sync failed', e)
    })
    .finally(() => {
      pendingCloudSync = false
    })
  // #endif
}

function persist(change: ScheduleCloudChange): void {
  pendingCloudSync = true
  saveSchedulesToStorage(schedules)
  cloudSync(change)
  bumpScheduleVersion()
}

async function persistAsync(change: ScheduleCloudChange): Promise<void> {
  pendingCloudSync = true
  await saveSchedulesToStorageAsync(schedules)
  // #ifdef MP-WEIXIN
  try {
    await applyCloudScheduleChange(change)
  } catch (e) {
    console.error('[schedule] cloud sync failed', e)
    throw e
  } finally {
    pendingCloudSync = false
  }
  // #endif
  // #ifndef MP-WEIXIN
  pendingCloudSync = false
  // #endif
  bumpScheduleVersion()
}

/** 非微信端：仅从本地 storage 加载 */
export function initSchedules(): void {
  if (initialized) return
  const stored = loadSchedulesFromStorage()
  applySchedules(stored ?? [])
  initialized = true
}

// #ifdef MP-WEIXIN
function getLocalSchedulesSnapshot(): ScheduleItem[] {
  if (schedules.length > 0) {
    return schedules.map((s) => ({ ...s }))
  }
  return (loadSchedulesFromStorage() ?? []).map((s) => ({ ...s }))
}

/** 同 id 以云端为准，仅存在于本地的条目保留（防止未同步条目被冲掉） */
function mergeSchedulesById(
  localItems: ScheduleItem[],
  cloudItems: ScheduleItem[],
): ScheduleItem[] {
  const map = new Map<string, ScheduleItem>()
  for (const item of localItems) {
    map.set(item.id, { ...item })
  }
  for (const item of cloudItems) {
    map.set(item.id, { ...item })
  }
  return Array.from(map.values())
}

function shouldPullFromCloud(force: boolean): boolean {
  if (force) return true
  if (pendingCloudSync) return true
  return Date.now() - lastCloudPullAt >= CLOUD_PULL_COOLDOWN_MS
}

/**
 * 从云数据库拉取并合并/写入 storage。
 * - 默认 merge：云端 + 本地并集，不丢本地未上传成功的条
 * - cloudWins：下拉刷新时用云端覆盖（云端为空则保留本地）
 */
async function pullSchedulesFromCloud(
  options: {
    fallbackLocal?: boolean
    force?: boolean
    cloudWins?: boolean
  } = {},
): Promise<void> {
  const { fallbackLocal = true, force = false, cloudWins = false } = options
  if (!shouldPullFromCloud(force)) {
    return
  }
  const localItems = getLocalSchedulesSnapshot()
  try {
    const cloudItems = await fetchAllSchedulesFromCloud()
    let next: ScheduleItem[]

    if (cloudItems.length === 0 && localItems.length > 0) {
      console.warn('[schedule] cloud empty, keep local', localItems.length)
      if (force) {
        uni.showToast({ title: '云端暂无可见数据，已保留本地', icon: 'none' })
      }
      next = localItems
    } else if (cloudWins) {
      next = cloudItems
    } else {
      next = mergeSchedulesById(localItems, cloudItems)
    }

    console.log(
      `[schedule] pull merged local=${localItems.length} cloud=${cloudItems.length} => ${next.length}`,
    )
    applySchedules(next)
    lastCloudPullAt = Date.now()
    pendingCloudSync = false
  } catch (e) {
    console.error('[schedule] cloud pull failed', e)
    if (!fallbackLocal) {
      uni.showToast({ title: '云端同步失败', icon: 'none' })
      throw e
    }
    const stored = loadSchedulesFromStorage()
    schedules = (stored ?? []).map((s) => ({ ...s }))
    saveSchedulesToStorage(schedules)
    bumpScheduleVersion()
  }
}
// #endif

/** 应用启动：微信端从云拉取，其它端读 storage */
export async function initSchedulesAsync(): Promise<void> {
  if (initPromise) return initPromise
  if (initialized) return
  initPromise = (async () => {
    // #ifdef MP-WEIXIN
    const stored = loadSchedulesFromStorage()
    if (stored && stored.length > 0) {
      schedules = stored.map((s) => ({ ...s }))
    }
    await pullSchedulesFromCloud({ force: true, cloudWins: false })
    initialized = true
    // #endif
    // #ifndef MP-WEIXIN
    initSchedules()
    // #endif
  })().finally(() => {
    initPromise = null
  })
  return initPromise
}

/**
 * 等待日程就绪（首次为云拉取完成）。
 * 页面/写操作前应 await，避免用到未同步的旧缓存。
 */
export async function whenSchedulesReady(): Promise<void> {
  if (initialized) return
  await initSchedulesAsync()
}

// #ifdef MP-WEIXIN
/**
 * 从云端刷新（受冷却时间限制，避免 Tab 切换刷爆额度）。
 * @param force 为 true 时忽略冷却（下拉刷新）
 */
export async function refreshSchedulesFromCloud(
  options: { force?: boolean } = {},
): Promise<void> {
  if (!initialized) {
    await initSchedulesAsync()
    return
  }
  if (!shouldPullFromCloud(options.force ?? false)) {
    return
  }
  if (refreshPromise) return refreshPromise
  refreshPromise = pullSchedulesFromCloud({
    fallbackLocal: false,
    force: options.force ?? false,
    cloudWins: options.force ?? false,
  }).finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}
// #endif

/** 进入页面：仅保证本地/内存数据就绪，不自动拉云（省额度） */
export async function syncSchedulesOnEnter(): Promise<void> {
  await whenSchedulesReady()
}

/** 下拉刷新：以云端为准（云端为空时不覆盖本地） */
export async function forceRefreshSchedulesFromCloud(): Promise<void> {
  // #ifdef MP-WEIXIN
  await pullSchedulesFromCloud({
    fallbackLocal: false,
    force: true,
    cloudWins: true,
  })
  // #endif
}

function ensureInit(): void {
  if (initialized) return
  // #ifdef MP-WEIXIN
  const stored = loadSchedulesFromStorage()
  if (stored && stored.length > 0) {
    schedules = stored.map((s) => ({ ...s }))
  }
  return
  // #endif
  // #ifndef MP-WEIXIN
  initSchedules()
  // #endif
}

export function getPlanTypeByLabel(label: string): PlanType {
  return PLAN_TYPES.find((t) => t.label === label) ?? DEFAULT_PLAN_TYPE
}

export function getCategoryColor(category: string): string {
  return getPlanTypeByLabel(category).color
}

export function getCategoryColorLight(category: string): string {
  return getPlanTypeByLabel(category).colorLight
}

/** 某日日程涉及的类型颜色（去重，最多 3 个，供日历格展示） */
export function getScheduleColorsOnDate(dateKey: string): string[] {
  ensureInit()
  const colors: string[] = []
  const seen = new Set<string>()
  for (const s of schedules) {
    if (s.date !== dateKey || !isActiveSchedule(s)) continue
    const color = getCategoryColor(s.category)
    if (seen.has(color)) continue
    seen.add(color)
    colors.push(color)
    if (colors.length >= 3) break
  }
  return colors
}

export function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

export function getSchedulesByDate(dateKey: string): ScheduleItem[] {
  ensureInit()
  return schedules
    .filter((s) => s.date === dateKey)
    .sort((a, b) => {
      const aCancelled = a.cancelled ? 1 : 0
      const bCancelled = b.cancelled ? 1 : 0
      if (aCancelled !== bCancelled) return aCancelled - bCancelled
      return a.time.localeCompare(b.time)
    })
}

export function getScheduleById(id: string): ScheduleItem | undefined {
  ensureInit()
  return schedules.find((s) => s.id === id)
}

export function hasScheduleOnDate(dateKey: string): boolean {
  ensureInit()
  return schedules.some((s) => s.date === dateKey && isActiveSchedule(s))
}

export function hasPriorityOnDate(dateKey: string): boolean {
  ensureInit()
  return schedules.some(
    (s) => s.date === dateKey && s.priority && isActiveSchedule(s),
  )
}

export function getDatesWithSchedulesInMonth(year: number, month: number): Set<string> {
  ensureInit()
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`
  const set = new Set<string>()
  schedules.forEach((s) => {
    if (s.date.startsWith(prefix) && isActiveSchedule(s)) set.add(s.date)
  })
  return set
}

export function addSchedule(item: Omit<ScheduleItem, 'id'>): ScheduleItem {
  ensureInit()
  const maxNum = schedules.reduce((max, s) => Math.max(max, Number(s.id) || 0), 0)
  const newItem: ScheduleItem = { ...item, id: String(maxNum + 1) }
  schedules.push(newItem)
  persist({ type: 'upsert', item: newItem })
  return newItem
}

export async function addScheduleAsync(
  item: Omit<ScheduleItem, 'id'>,
): Promise<ScheduleItem> {
  await whenSchedulesReady()
  ensureInit()
  const maxNum = schedules.reduce((max, s) => Math.max(max, Number(s.id) || 0), 0)
  const newItem: ScheduleItem = { ...item, id: String(maxNum + 1) }
  schedules.push(newItem)
  await persistAsync({ type: 'upsert', item: newItem })
  return newItem
}

export function updateSchedule(
  id: string,
  item: Omit<ScheduleItem, 'id'>,
): ScheduleItem | undefined {
  ensureInit()
  const index = schedules.findIndex((s) => s.id === id)
  if (index === -1) return undefined
  const updated: ScheduleItem = {
    ...schedules[index],
    ...item,
    id,
    cancelled: schedules[index].cancelled,
  }
  schedules[index] = updated
  persist({ type: 'upsert', item: updated })
  return updated
}

export async function updateScheduleAsync(
  id: string,
  item: Omit<ScheduleItem, 'id'>,
): Promise<ScheduleItem | undefined> {
  await whenSchedulesReady()
  ensureInit()
  const index = schedules.findIndex((s) => s.id === id)
  if (index === -1) return undefined
  const updated: ScheduleItem = {
    ...schedules[index],
    ...item,
    id,
    cancelled: schedules[index].cancelled,
  }
  schedules[index] = updated
  await persistAsync({ type: 'upsert', item: updated })
  return updated
}

export function rescheduleSchedule(
  id: string,
  newDate: string,
): ScheduleItem | undefined {
  ensureInit()
  const index = schedules.findIndex((s) => s.id === id)
  if (index === -1) return undefined
  const updated = { ...schedules[index], date: newDate }
  schedules[index] = updated
  persist({ type: 'upsert', item: updated })
  return updated
}

export function cancelSchedule(id: string): boolean {
  ensureInit()
  const index = schedules.findIndex((s) => s.id === id)
  if (index === -1) return false
  const updated = { ...schedules[index], cancelled: true }
  schedules[index] = updated
  persist({ type: 'upsert', item: updated })
  return true
}

/** 恢复已取消的拍摄计划 */
export function restoreSchedule(id: string): ScheduleItem | undefined {
  ensureInit()
  const index = schedules.findIndex((s) => s.id === id)
  if (index === -1) return undefined
  if (!schedules[index].cancelled) return schedules[index]
  const updated = { ...schedules[index], cancelled: false }
  schedules[index] = updated
  persist({ type: 'upsert', item: updated })
  return updated
}

export function deleteSchedule(id: string): boolean {
  ensureInit()
  const index = schedules.findIndex((s) => s.id === id)
  if (index === -1) return false
  schedules.splice(index, 1)
  persist({ type: 'remove', id })
  return true
}
