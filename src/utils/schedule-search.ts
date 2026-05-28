import type { ScheduleItem } from '@/types/schedule'
import { formatDayHeader } from '@/utils/calendar'

export type ScheduleStatusFilter = 'all' | 'active' | 'cancelled' | 'priority'

export interface ScheduleSearchFilters {
  keyword: string
  /** 空数组表示不限类型 */
  categories: string[]
  status: ScheduleStatusFilter
  /** YYYY-MM-DD，空字符串表示不限 */
  dateFrom: string
  dateTo: string
}

export const DEFAULT_SCHEDULE_SEARCH_FILTERS: ScheduleSearchFilters = {
  keyword: '',
  categories: [],
  status: 'all',
  dateFrom: '',
  dateTo: '',
}

function matchesKeyword(item: ScheduleItem, keyword: string): boolean {
  const kw = keyword.trim().toLowerCase()
  if (!kw) return true
  const haystack = [item.title, item.location ?? '', item.category]
    .join(' ')
    .toLowerCase()
  return haystack.includes(kw)
}

function matchesStatus(item: ScheduleItem, status: ScheduleStatusFilter): boolean {
  if (status === 'all') return true
  if (status === 'active') return !item.cancelled
  if (status === 'cancelled') return Boolean(item.cancelled)
  return Boolean(item.priority) && !item.cancelled
}

function matchesCategory(item: ScheduleItem, categories: string[]): boolean {
  if (categories.length === 0) return true
  return categories.includes(item.category)
}

function matchesDateRange(
  item: ScheduleItem,
  dateFrom: string,
  dateTo: string,
): boolean {
  if (dateFrom && item.date < dateFrom) return false
  if (dateTo && item.date > dateTo) return false
  return true
}

export function filterSchedules(
  items: ScheduleItem[],
  filters: ScheduleSearchFilters,
): ScheduleItem[] {
  return items
    .filter(
      (item) =>
        matchesKeyword(item, filters.keyword) &&
        matchesStatus(item, filters.status) &&
        matchesCategory(item, filters.categories) &&
        matchesDateRange(item, filters.dateFrom, filters.dateTo),
    )
    .sort((a, b) => {
      const dateCmp = b.date.localeCompare(a.date)
      if (dateCmp !== 0) return dateCmp
      const aCancelled = a.cancelled ? 1 : 0
      const bCancelled = b.cancelled ? 1 : 0
      if (aCancelled !== bCancelled) return aCancelled - bCancelled
      return a.time.localeCompare(b.time)
    })
}

export interface ScheduleSearchGroup {
  dateKey: string
  dateLabel: string
  items: ScheduleItem[]
}

export function groupSchedulesByDate(items: ScheduleItem[]): ScheduleSearchGroup[] {
  const groups: ScheduleSearchGroup[] = []
  let current: ScheduleSearchGroup | null = null

  for (const item of items) {
    if (!current || current.dateKey !== item.date) {
      current = {
        dateKey: item.date,
        dateLabel: formatDayHeader(item.date),
        items: [],
      }
      groups.push(current)
    }
    current.items.push(item)
  }

  return groups
}

export function hasActiveSearchFilters(filters: ScheduleSearchFilters): boolean {
  return (
    filters.keyword.trim().length > 0 ||
    filters.categories.length > 0 ||
    filters.status !== 'all' ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo)
  )
}
