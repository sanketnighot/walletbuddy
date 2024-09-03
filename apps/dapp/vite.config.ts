import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    define: {
      'import.meta.env.VITE_WEBHOOK_URL': JSON.stringify(env.VITE_WEBHOOK_URL),
    },
  }
})
