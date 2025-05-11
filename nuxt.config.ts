import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["nuxt-auth-utils", "@nuxt/ui"],
  plugins: ['@/plugins/antd'],
  vite: {
    plugins: [
      Components({
        resolvers: [AntDesignVueResolver({ resolveIcons: true })],
      }),
      tailwindcss(),
    ],
  },
});