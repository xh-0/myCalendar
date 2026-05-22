/** 标题栏内容区高度（不含状态栏，单位 px） */
export const HEADER_BAR_PX = uni.upx2px(88)

/** 完整头部高度（状态栏 + 标题栏，单位 px） */
export function getPageHeaderHeight(): number {
  const sys = uni.getSystemInfoSync()
  return (sys.statusBarHeight ?? 20) + HEADER_BAR_PX
}
