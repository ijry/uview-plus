import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { visualizer } from "rollup-plugin-visualizer";
import appNvueAsVue from "./vite-plugins/app-nvue-as-vue.mjs";
import UniUpRoot from "./src/uni_modules/uview-plus/libs/root/index.js";
import UpVite from "./src/uni_modules/uview-plus/libs/vite/index.js";
// import commonjs from '@rollup/plugin-commonjs';

const APP_NVUE_AS_VUE = true;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    appNvueAsVue(APP_NVUE_AS_VUE),
    // commonjs(),
    // uview-plus 通用构建插件（当前提供 App 端本地图标字体能力）
    UpVite(),
    // Root 注入插件；内部复用同一份图标字体 feature，与 UpVite 同时注册是幂等的
    UniUpRoot({
      rootFileName: "App.up",
    }),
    uni(),
	visualizer()
  ],
  css: {  
	preprocessorOptions: {  
	  scss: {  
		// 取消sass废弃API的报警
		silenceDeprecations: ['legacy-js-api', 'color-functions', 'import'],  
	  },  
	},  
  },
  server: {
    port: 5100,
    fs: {
        // Allow serving files from one level up to the project root
        allow: ['..']
    }
},
});
