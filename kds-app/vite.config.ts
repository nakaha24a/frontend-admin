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
    build: { ssr: false },
  },
  server:{
    proxy:{
         "/api": "http://172.16.31.18:5000",
    }
  }
})

