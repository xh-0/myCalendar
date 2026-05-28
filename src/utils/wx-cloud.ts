import { WX_CLOUD_ENV_ID } from '@/config/weixin-cloud'

let cloudReady = false

/** 初始化微信云开发（仅 MP-WEIXIN 编译产物中可用） */
export function initWxCloud(): void {
  if (cloudReady) return
  wx.cloud.init({
    env: WX_CLOUD_ENV_ID,
    traceUser: true,
  })
  cloudReady = true
}
