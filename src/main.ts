import { createSSRApp } from "vue";
import App from "./App.vue";
// #ifndef MP-WEIXIN
import { initSchedules } from "@/mock/schedule";
// #endif

export function createApp() {
  // 微信端由 App.vue onLaunch 拉取云数据库，此处不可提前 init（会跳过云端同步）
  // #ifndef MP-WEIXIN
  initSchedules();
  // #endif
  const app = createSSRApp(App);
  return {
    app,
  };
}
