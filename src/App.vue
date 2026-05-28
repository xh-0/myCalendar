<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import {
  initSchedules,
  initSchedulesAsync,
  refreshSchedulesFromCloud,
} from "@/mock/schedule";
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
  // #ifdef MP-WEIXIN
  // 从后台回到前台：若超过冷却时间才拉云（默认 5 分钟一次）
  refreshSchedulesFromCloud().catch((e: unknown) => {
    console.error("[App] refreshSchedulesFromCloud failed", e);
  });
  // #endif
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
