import { ref } from 'vue'

export const scheduleVersion = ref(0)

function bumpScheduleVersion() {
  scheduleVersion.value += 1
}

export interface ScheduleItem {
  id: string
  date: string
  time: string
  title: string
  category: string
  categoryIcon: string
  location?: string
  peopleCount?: number
  wechatNotify?: boolean
  priority?: boolean
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
  const colors: string[] = []
  const seen = new Set<string>()
  for (const s of MOCK_SCHEDULES) {
    if (s.date !== dateKey) continue
    const color = getCategoryColor(s.category)
    if (seen.has(color)) continue
    seen.add(color)
    colors.push(color)
    if (colors.length >= 3) break
  }
  return colors
}

export const MOCK_SCHEDULES: ScheduleItem[] = [
  {
    id: '1',
    date: '2026-05-01',
    time: '09:00',
    title: '王女士户外写真',
    category: '写真',
    categoryIcon: '✨',
    location: '滨江公园樱花大道',
    peopleCount: 2,
    wechatNotify: true,
  },
  {
    id: '2',
    date: '2026-05-03',
    time: '14:00',
    title: '情侣街拍约拍',
    category: '约拍',
    categoryIcon: '📷',
    location: '老城区梧桐街',
    peopleCount: 2,
  },
  {
    id: '3',
    date: '2026-05-06',
    time: '10:30',
    title: '张先生亲子外景',
    category: '亲子',
    categoryIcon: '👶',
    location: '市植物园东门',
    peopleCount: 4,
  },
  {
    id: '4',
    date: '2026-05-08',
    time: '15:00',
    title: '品牌lookbook拍摄',
    category: '商业拍摄',
    categoryIcon: '🏢',
    location: '创意园3号棚',
    peopleCount: 6,
    wechatNotify: true,
  },
  {
    id: '5',
    date: '2026-05-10',
    time: '08:00',
    title: '李女士订婚仪式跟拍',
    category: '订婚',
    categoryIcon: '💍',
    location: '香格里拉酒店宴会厅',
    peopleCount: 8,
    wechatNotify: true,
    priority: true,
  },
  {
    id: '6',
    date: '2026-05-11',
    time: '11:00',
    title: '闺蜜下午茶写真',
    category: '闺蜜照',
    categoryIcon: '👯',
    location: '西岸艺术区咖啡馆',
    peopleCount: 3,
  },
  {
    id: '7',
    date: '2026-05-12',
    time: '全天',
    title: '陈氏婚礼全天跟拍',
    category: '结婚',
    categoryIcon: '💒',
    location: '郊野庄园婚礼草坪',
    peopleCount: 12,
    wechatNotify: true,
    priority: true,
  },
  {
    id: '8',
    date: '2026-05-13',
    time: '16:00',
    title: '选片沟通预约',
    category: '其他',
    categoryIcon: '📌',
    location: '工作室展厅',
    peopleCount: 2,
  },
  {
    id: '9',
    date: '2026-05-14',
    time: '13:30',
    title: '毕业季宿舍合影',
    category: '毕业照',
    categoryIcon: '🎓',
    location: '大学城图书馆前广场',
    peopleCount: 6,
  },
  {
    id: '10',
    date: '2026-05-15',
    time: '18:00',
    title: '夜景人像约拍',
    category: '约拍',
    categoryIcon: '📷',
    location: '跨江大桥观景台',
    peopleCount: 1,
  },
  {
    id: '11',
    date: '2026-05-17',
    time: '09:00',
    title: '百天宝宝上门拍摄',
    category: '亲子',
    categoryIcon: '👶',
    location: '阳光花园小区',
    peopleCount: 4,
    wechatNotify: true,
  },
  {
    id: '12',
    date: '2026-05-18',
    time: '14:00',
    title: '订婚宴敬酒环节',
    category: '订婚',
    categoryIcon: '💍',
    location: '锦江宾馆二层宴会厅',
    peopleCount: 10,
  },
  {
    id: '13',
    date: '2026-05-20',
    time: '10:00',
    title: '企业形象照拍摄',
    category: '商业拍摄',
    categoryIcon: '🏢',
    location: '科创大厦A座前台',
    peopleCount: 5,
  },
  {
    id: '14',
    date: '2026-05-22',
    time: '11:30',
    title: '证件照+形象照套餐',
    category: '写真',
    categoryIcon: '✨',
    location: '工作室影棚',
    peopleCount: 1,
  },
  {
    id: '15',
    date: '2026-05-24',
    time: '09:00',
    title: '赵小姐订婚跟拍',
    category: '订婚',
    categoryIcon: '💍',
    location: '湖畔度假酒店',
    peopleCount: 6,
    wechatNotify: true,
  },
  {
    id: '16',
    date: '2026-05-24',
    time: '14:30',
    title: '婚礼彩排记录',
    category: '结婚',
    categoryIcon: '💒',
    location: '玫瑰庄园教堂',
    peopleCount: 8,
  },
  {
    id: '17',
    date: '2026-05-24',
    time: '19:30',
    title: '夜景情侣约拍',
    category: '约拍',
    categoryIcon: '📷',
    location: '摩天轮广场',
    peopleCount: 2,
  },
  {
    id: '18',
    date: '2026-05-25',
    time: '10:00',
    title: '闺蜜海边旅拍',
    category: '闺蜜照',
    categoryIcon: '👯',
    location: '黄金海岸沙滩',
    peopleCount: 3,
  },
  {
    id: '19',
    date: '2026-05-27',
    time: '16:30',
    title: '婚礼精修交付沟通',
    category: '结婚',
    categoryIcon: '💒',
    location: '工作室',
    peopleCount: 2,
  },
  {
    id: '20',
    date: '2026-05-29',
    time: '09:00',
    title: '幼儿园毕业照',
    category: '毕业照',
    categoryIcon: '🎓',
    location: '实验幼儿园操场',
    peopleCount: 28,
    wechatNotify: true,
  },
  {
    id: '21',
    date: '2026-05-31',
    time: '17:00',
    title: '月末档期整理',
    category: '其他',
    categoryIcon: '📌',
    location: '工作室',
    peopleCount: 1,
  },
  {
    id: '22',
    date: '2026-04-28',
    time: '10:00',
    title: '上月婚礼相册寄送',
    category: '结婚',
    categoryIcon: '💒',
    location: '顺丰网点',
    peopleCount: 1,
  },
  {
    id: '23',
    date: '2026-06-03',
    time: '14:00',
    title: '六月婚礼旺季洽谈',
    category: '结婚',
    categoryIcon: '💒',
    location: '工作室会客室',
    peopleCount: 2,
    wechatNotify: true,
  },
]

export function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

export function getSchedulesByDate(dateKey: string): ScheduleItem[] {
  return MOCK_SCHEDULES.filter((s) => s.date === dateKey).sort((a, b) =>
    a.time.localeCompare(b.time),
  )
}

export function getScheduleById(id: string): ScheduleItem | undefined {
  return MOCK_SCHEDULES.find((s) => s.id === id)
}

export function hasScheduleOnDate(dateKey: string): boolean {
  return MOCK_SCHEDULES.some((s) => s.date === dateKey)
}

export function hasPriorityOnDate(dateKey: string): boolean {
  return MOCK_SCHEDULES.some((s) => s.date === dateKey && s.priority)
}

export function getDatesWithSchedulesInMonth(year: number, month: number): Set<string> {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`
  const set = new Set<string>()
  MOCK_SCHEDULES.forEach((s) => {
    if (s.date.startsWith(prefix)) set.add(s.date)
  })
  return set
}

export function addSchedule(
  item: Omit<ScheduleItem, 'id'>,
): ScheduleItem {
  const maxNum = MOCK_SCHEDULES.reduce((max, s) => Math.max(max, Number(s.id) || 0), 0)
  const newItem: ScheduleItem = { ...item, id: String(maxNum + 1) }
  MOCK_SCHEDULES.push(newItem)
  bumpScheduleVersion()
  return newItem
}

export function updateSchedule(
  id: string,
  item: Omit<ScheduleItem, 'id'>,
): ScheduleItem | undefined {
  const index = MOCK_SCHEDULES.findIndex((s) => s.id === id)
  if (index === -1) return undefined
  const updated: ScheduleItem = { ...MOCK_SCHEDULES[index], ...item, id }
  MOCK_SCHEDULES[index] = updated
  bumpScheduleVersion()
  return updated
}
