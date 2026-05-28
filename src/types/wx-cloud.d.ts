/** 微信小程序云开发最小类型（避免额外安装 @types/wechat-miniprogram） */
interface WxCloudDatabaseQueryResult<T = Record<string, unknown>> {
  data: T[]
}

interface WxCloudCollection {
  skip(n: number): WxCloudCollection
  limit(n: number): WxCloudCollection
  where(condition: Record<string, unknown>): WxCloudCollection
  get(): Promise<WxCloudDatabaseQueryResult>
  add(options: { data: Record<string, unknown> }): Promise<{ _id?: string }>
  doc(id: string): WxCloudDocument
}

interface WxCloudDocument {
  update(options: { data: Record<string, unknown> }): Promise<unknown>
  remove(): Promise<unknown>
}

interface WxCloudDatabase {
  collection(name: string): WxCloudCollection
}

interface WxCloud {
  init(options: { env: string; traceUser?: boolean }): void
  database(): WxCloudDatabase
}

interface WxWithCloud {
  cloud: WxCloud
}

declare const wx: WxWithCloud
