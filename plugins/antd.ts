import Antd from "ant-design-vue";
// import { defineNuxtPlugin } from "#app";
import "ant-design-vue/dist/antd.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Antd);
});
