import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so one build works on GitHub Pages (/MSA/) and root hosts (Netlify).
  base: './',
})
