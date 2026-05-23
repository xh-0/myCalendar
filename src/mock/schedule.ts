export interface ScheduleItem {
  id: string
  date: string
  time: string
  title: string
  category: string
  categoryIcon: string
  priority?: boolean
}

export const MOCK_SCHEDULES: ScheduleItem[] = [
  { id: '1', date: '2026-05-01', time: '10:00', title: '周会同步', category: '工作', categoryIcon: '💼' },
  { id: '2', date: '2026-05-03', time: '14:00', title: '客户沟通', category: '工作', categoryIcon: '💼' },
  { id: '3', date: '2026-05-06', time: '09:30', title: '晨跑', category: '生活', categoryIcon: '🌿' },
  { id: '4', date: '2026-05-08', time: '16:00', title: '代码评审', category: '工作', categoryIcon: '💼' },
  {
    id: '5',
    date: '2026-05-10',
    time: '08:00',
    title: '项目里程碑汇报',
    category: '工作',
    categoryIcon: '💼',
    priority: true,
  },
  { id: '6', date: '2026-05-11', time: '11:00', title: '团队午餐', category: '生活', categoryIcon: '🌿' },
  { id: '7', date: '2026-05-12', time: '15:00', title: 'UI 走查', category: '工作', categoryIcon: '💼' },
  { id: '8', date: '2026-05-13', time: '10:30', title: '读书分享', category: '生活', categoryIcon: '🌿' },
  { id: '9', date: '2026-05-14', time: '13:30', title: '需求梳理', category: '工作', categoryIcon: '💼' },
  { id: '10', date: '2026-05-15', time: '18:00', title: '瑜伽课', category: '生活', categoryIcon: '🌿' },
  { id: '11', date: '2026-05-17', time: '09:00', title: '版本发布', category: '工作', categoryIcon: '💼' },
  { id: '12', date: '2026-05-18', time: '20:00', title: '看电影', category: '生活', categoryIcon: '🌿' },
  { id: '13', date: '2026-05-20', time: '14:00', title: '技术分享', category: '工作', categoryIcon: '💼' },
  { id: '14', date: '2026-05-22', time: '11:30', title: '体检预约', category: '生活', categoryIcon: '🌿' },
  {
    id: '15',
    date: '2026-05-24',
    time: '09:00',
    title: '产品需求评审会',
    category: '工作',
    categoryIcon: '💼',
  },
  {
    id: '16',
    date: '2026-05-24',
    time: '14:30',
    title: '设计稿评审',
    category: '工作',
    categoryIcon: '💼',
  },
  {
    id: '17',
    date: '2026-05-24',
    time: '19:30',
    title: '健身训练',
    category: '生活',
    categoryIcon: '🌿',
  },
  { id: '18', date: '2026-05-25', time: '10:00', title: '家庭聚会', category: '生活', categoryIcon: '🌿' },
  { id: '19', date: '2026-05-27', time: '16:30', title: '迭代复盘', category: '工作', categoryIcon: '💼' },
  { id: '20', date: '2026-05-29', time: '09:00', title: '月度总结', category: '工作', categoryIcon: '💼' },
  { id: '21', date: '2026-05-31', time: '17:00', title: '团建活动', category: '生活', categoryIcon: '🌿' },
  { id: '22', date: '2026-04-28', time: '10:00', title: '上月遗留事项', category: '工作', categoryIcon: '💼' },
  { id: '23', date: '2026-06-03', time: '14:00', title: '下月规划会', category: '工作', categoryIcon: '💼' },
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
