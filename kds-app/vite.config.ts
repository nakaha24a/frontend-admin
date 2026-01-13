import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {}, 
    "process.platform": '"browser"',
    "process.arch": '"x64"',
    "process.versions": '{}',
  },
  build: { ssr: false },
  server: {
    // 開発用プロキシ設定（CORS回避）
    proxy: {
      "/api": {
        target: "https://172.16.31.16", // バックエンドのURLに置き換え
        changeOrigin: true,            // オリジンを書き換える
        rewrite: (path) => path.replace(/^\/api/, "/api"), // パスはそのまま
      },
    },
  },
})