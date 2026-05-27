import { createSSRApp } from "vue";
import App from "./App.vue";
import { initSchedules } from "@/mock/schedule";

export function createApp() {
  initSchedules();
  const app = createSSRApp(App);
  return {
    app,
  };
}
