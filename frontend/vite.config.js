import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/aladin-api': {
        target: 'http://www.aladin.co.kr/ttb/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/aladin-api/, ''),
      },
      '/aladin-img': {
        target: 'http://image.aladin.co.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/aladin-img/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Host', 'image.aladin.co.kr');
            proxyReq.setHeader('Referer', 'http://www.aladin.co.kr');
          });
        }
      },
    },
  },
})
