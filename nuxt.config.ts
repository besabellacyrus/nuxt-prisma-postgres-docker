// https://nuxt.com/docs/api/configuration/nuxt-config
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [],
  css: [], // No need to manually import ant-design-vue CSS
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
