import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
// import commonjs from '@rollup/plugin-commonjs'

/**
 * @type {import('vite').UserConfig}
 */

export default defineConfig({
  build: {
    sourcemap: false, // App，小程序端源码调试，需要在 vite.config.js 中主动开启 sourcemap
	rollupOptions: {
	}
  },

  plugins: [
	// commonjs(),
	uni()
  ],
});
