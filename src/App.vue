<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { initSchedules, initSchedulesAsync } from "@/mock/schedule";
// #ifdef MP-WEIXIN
import { initWxCloud } from "@/utils/wx-cloud";
// #endif

onLaunch(() => {
  // #ifdef MP-WEIXIN
  initWxCloud();
  initSchedulesAsync().catch((e: unknown) => {
    console.error("[App] initSchedulesAsync failed", e);
    initSchedules();
  });
  // #endif
  // #ifndef MP-WEIXIN
  initSchedules();
  // #endif
});
onShow(() => {
  // 云端拉取由各页面的 useScheduleSync 负责，避免与页面 onShow 重复请求
});
onHide(() => {
  // console.log('App Hide')
});
</script>

<style>
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica,
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  color: #1a1a1a;
  box-sizing: border-box;
}

view,
text {
  box-sizing: border-box;
}
</style>
