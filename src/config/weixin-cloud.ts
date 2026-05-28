/** 微信小程序云开发环境 ID */
export const WX_CLOUD_ENV_ID = 'cloud1-d5gm34enqce82ca3d'

/** 云数据库：日程集合名（需在云开发控制台创建） */
export const SCHEDULES_COLLECTION = 'schedules'

/**
 * 非强制刷新时，两次全量拉取云库的最小间隔（毫秒）。
 * 切换 Tab、页面 onShow 不会重复拉取；下拉刷新、冷启动仍会拉取。
 */
/** 常规后台合并的最小间隔；本地刚编辑完会绕过冷却立即合并一次 */
export const CLOUD_PULL_COOLDOWN_MS = 3 * 60 * 1000

/**
 * 小程序端 collection.get 单次最多 20 条（微信官方上限）。
 * 必须按 20 分页循环，不能用 100 判断是否还有下一页，否则会只拉到 20 条就停。
 */
export const CLOUD_PAGE_SIZE = 20
