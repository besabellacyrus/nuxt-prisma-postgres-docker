// https://nuxt.com/docs/api/configuration/nuxt-config
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["nuxt-auth-utils"],
  css: ["ant-design-vue/dist/antd.css"],
  vite: {
    plugins: [
      Components({
        resolvers: [AntDesignVueResolver({ importStyle: "css" })],
      }),
    ],
    optimizeDeps: {
      include: ["ant-design-vue"], // <- Important for Docker/Vite resolution
    },
  },
});