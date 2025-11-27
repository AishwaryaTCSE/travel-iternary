import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    historyApiFallback: true,
    open: true,
    port: 5173,
    proxy: {
      // Add any API proxies if needed
    },
    // This ensures that all routes fall back to index.html
    fs: {
      strict: false
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  base: '/',
})