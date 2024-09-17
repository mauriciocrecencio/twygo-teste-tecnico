/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setupTests.ts'],
  },
  server: {
    port: 3001,
    strictPort: true,
    host: true,
    origin: 'http://0.0.0.0:3001'
  },
})
