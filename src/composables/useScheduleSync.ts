import { onShow } from '@dcloudio/uni-app'
import { syncSchedulesOnEnter } from '@/mock/schedule'

/** 页面 onShow 时自动从云端同步日程（微信端）并触发刷新回调 */
export function useScheduleSync(onSynced?: () => void) {
  onShow(() => {
    syncSchedulesOnEnter()
      .then(() => onSynced?.())
      .catch((e) => {
        console.error('[useScheduleSync] sync failed', e)
        onSynced?.()
      })
  })
}
