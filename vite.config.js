import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

/**
 * @type {import('vite').UserConfig}
 */

export default defineConfig({
  build: {
    sourcemap: false, // App，小程序端源码调试，需要在 vite.config.js 中主动开启 sourcemap
  },

  plugins: [uni()],
});
