import { formatDateKey } from '@/mock/schedule'

export interface CalendarDay {
  year: number
  month: number
  day: number
  dateKey: string
  isCurrentMonth: boolean
  isToday: boolean
}

const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const

export function getWeekLabels(): readonly string[] {
  return WEEK_LABELS
}

export function buildCalendarGrid(year: number, month: number): CalendarDay[] {
  const today = new Date()
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: CalendarDay[] = []
  const totalCells = 42

  for (let i = 0; i < totalCells; i++) {
    let y = year
    let m = month
    let d: number

    if (i < startWeekday) {
      d = daysInPrevMonth - startWeekday + i + 1
      m = month - 1
      if (m < 0) {
        m = 11
        y = year - 1
      }
    } else if (i < startWeekday + daysInMonth) {
      d = i - startWeekday + 1
    } else {
      d = i - startWeekday - daysInMonth + 1
      m = month + 1
      if (m > 11) {
        m = 0
        y = year + 1
      }
    }

    const dateKey = formatDateKey(y, m, d)
    cells.push({
      year: y,
      month: m,
      day: d,
      dateKey,
      isCurrentMonth: y === year && m === month,
      isToday: dateKey === todayKey,
    })
  }

  return cells
}

export function formatMonthTitle(year: number, month: number): string {
  return `${year}年${month + 1}月`
}

export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  let m = month + delta
  let y = year
  while (m < 0) {
    m += 12
    y -= 1
  }
  while (m > 11) {
    m -= 12
    y += 1
  }
  return { year: y, month: m }
}

const WEEKDAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] as const

export function formatDayHeader(dateKey: string): string {
  const { year, month, day } = parseDateKey(dateKey)
  const date = new Date(year, month, day)
  const weekday = WEEKDAY_NAMES[date.getDay()]
  return `${month + 1}月${day}日 ${weekday}`
}

export function parseDateKey(dateKey: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateKey.split('-').map(Number)
  return { year, month: month - 1, day }
}

/** 选中态仅在该日期属于当前展示月份时高亮，避免跨月后出现两个选中格 */
export function isDateSelected(
  cell: CalendarDay,
  selectedDate: string,
  viewYear: number,
  viewMonth: number,
): boolean {
  if (cell.dateKey !== selectedDate) return false
  const sel = parseDateKey(selectedDate)
  return sel.year === viewYear && sel.month === viewMonth
}
