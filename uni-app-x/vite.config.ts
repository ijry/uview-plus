import path from "path";
import fs from 'fs';
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni()
  ],
  resolve: {
    alias: [
        // {
        //     find: "uview-plus",
        //     replacement: path.resolve(__dirname, "../src/uni_modules/uview-plus"),
        // }
    ],
    },
  server: {
    port: 5200,
    fs: {
        // Allow serving files from one level up to the project root
        allow: ['..']
    }
},
});
