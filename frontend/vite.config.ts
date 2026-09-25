import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: {
    port: 20110,
    host: "0.0.0.0",
    proxy: {
      // 与 frontend/nginx.conf 中的 /api/ 反向代理保持一致
      "/api": {
        target: "http://localhost:21110",
        changeOrigin: true
      }
    }
  }
});
