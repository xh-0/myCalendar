import { onShow } from '@dcloudio/uni-app'
import { refreshSchedulesFromCloud, whenSchedulesReady } from '@/mock/schedule'

/**
 * 页面 onShow：先读本地，再在「冷却结束 / 刚编辑过」时与云端合并（1 次分页拉取）。
 * 避免每次 Tab 都拉云，又能在返回页面后尽快与云端对齐。
 */
export function useScheduleSync(onSynced?: () => void) {
  onShow(() => {
    whenSchedulesReady()
      .then(() => refreshSchedulesFromCloud())
      .then(() => onSynced?.())
      .catch((e) => {
        console.error('[useScheduleSync] sync failed', e)
        onSynced?.()
      })
  })
}
