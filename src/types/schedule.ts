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
  /** 已取消的拍摄，日历与列表默认不展示 */
  cancelled?: boolean
}
