import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import Icons from "unplugin-icons/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueI18nPlugin({
      include: [fileURLToPath(new URL("./locales/**", import.meta.url))]
    }),
    Icons({
      compiler: "vue3",
      scale: 1
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  build: {
    // 禁用 CSS 代码分割，将所有 CSS 合并成一个文件
    cssCodeSplit: false,

    rollupOptions: {
      output: {
        // 将所有 JS 合并成一个文件
        manualChunks: undefined,
        // 设置 JS 输出文件名
        entryFileNames: "assets/all.js",
        // 设置 CSS 和其他资源文件输出文件名
        assetFileNames: assetInfo => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "assets/all.css";
          }
          return "assets/[name].[hash].[ext]";
        }
      }
    }
  }
});
