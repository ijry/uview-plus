import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { visualizer } from "rollup-plugin-visualizer";
import UniUpRoot from "./src/uni_modules/uview-plus/libs/root/index.js";
// import commonjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // commonjs(),
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
