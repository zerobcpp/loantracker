import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    define: {
    },
    server: {
      host: true,
      allowedHosts: ['lbdocumenttracker-1411096062.us-east-2.elb.amazonaws.com'],
      hmr: {
        clientHost: 'lbdocumenttracker-1411096062.us-east-2.elb.amazonaws.com',
        clientPort: 80,
      },
    },
  }
})
