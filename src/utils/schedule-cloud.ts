import {
  CLOUD_PAGE_SIZE,
  SCHEDULES_COLLECTION,
} from '@/config/weixin-cloud'
import type { ScheduleItem } from '@/types/schedule'

type ScheduleDoc = ScheduleItem & { _id?: string; _openid?: string }

/** 业务 id → 云文档 _id，拉取后缓存，避免每次 upsert 都 where.get */
const docIdByScheduleId = new Map<string, string>()

function collection() {
  return wx.cloud.database().collection(SCHEDULES_COLLECTION)
}

function normalizeCloudDoc(doc: ScheduleDoc): ScheduleItem | null {
  const { _id, _openid, ...rest } = doc
  const id = rest.id ?? _id
  if (!id) return null
  if (!rest.date || !rest.title) {
    console.warn('[schedule-cloud] skip invalid doc', _id)
    return null
  }
  return {
    id: String(id),
    date: rest.date,
    time: rest.time ?? '09:00',
    title: rest.title,
    category: rest.category ?? '其他',
    categoryIcon: rest.categoryIcon ?? '📌',
    location: rest.location,
    peopleCount: rest.peopleCount,
    wechatNotify: rest.wechatNotify,
    priority: rest.priority,
    cancelled: rest.cancelled,
  }
}

function rememberDoc(doc: ScheduleDoc, item: ScheduleItem): void {
  if (doc._id) {
    docIdByScheduleId.set(item.id, doc._id)
  }
}

/** 从云数据库分页拉取当前用户可见的全部日程 */
export async function fetchAllSchedulesFromCloud(): Promise<ScheduleItem[]> {
  const allDocs: ScheduleDoc[] = []
  let skip = 0

  while (true) {
    const { data } = await collection().skip(skip).limit(CLOUD_PAGE_SIZE).get()
    const page = data as unknown as ScheduleDoc[]
    if (page.length === 0) break
    allDocs.push(...page)
    skip += page.length
    // 满页说明可能还有下一页；不足一页才是最后一页
    if (page.length < CLOUD_PAGE_SIZE) break
  }

  docIdByScheduleId.clear()
  const items: ScheduleItem[] = []
  for (const doc of allDocs) {
    const item = normalizeCloudDoc(doc)
    if (!item) continue
    rememberDoc(doc, item)
    items.push(item)
  }

  console.log(
    `[schedule-cloud] pulled ${items.length} schedules (${allDocs.length} raw docs)`,
  )
  return items
}

async function findDocIdByScheduleId(scheduleId: string): Promise<string | null> {
  const cached = docIdByScheduleId.get(scheduleId)
  if (cached) return cached
  const { data } = await collection().where({ id: scheduleId }).get()
  const doc = (data as unknown as ScheduleDoc[])[0]
  if (doc?._id) {
    const item = normalizeCloudDoc(doc)
    if (item) rememberDoc(doc, item)
    return doc._id
  }
  return null
}

/** 新增一条（1 次 add） */
export async function addScheduleToCloud(item: ScheduleItem): Promise<void> {
  const res = (await collection().add({ data: { ...item } })) as { _id?: string }
  if (res._id) {
    docIdByScheduleId.set(item.id, res._id)
  }
}

/** 更新或新增一条 */
export async function upsertScheduleInCloud(item: ScheduleItem): Promise<void> {
  const docId = await findDocIdByScheduleId(item.id)
  if (docId) {
    await collection().doc(docId).update({ data: { ...item } })
    return
  }
  await addScheduleToCloud(item)
}

/** 删除一条 */
export async function removeScheduleFromCloud(scheduleId: string): Promise<void> {
  const docId = await findDocIdByScheduleId(scheduleId)
  if (!docId) return
  await collection().doc(docId).remove()
  docIdByScheduleId.delete(scheduleId)
}

export type CloudScheduleChange =
  | { type: 'upsert'; item: ScheduleItem }
  | { type: 'remove'; id: string }

export async function applyCloudScheduleChange(
  change: CloudScheduleChange,
): Promise<void> {
  if (change.type === 'upsert') {
    await upsertScheduleInCloud(change.item)
    return
  }
  await removeScheduleFromCloud(change.id)
}
