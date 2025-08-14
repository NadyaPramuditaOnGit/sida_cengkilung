import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss({
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
    extend: {},
    },
    plugins: [],
    publicDir: 'public',
    build: {
       assetsDir: 'assets',
    emptyOutDir: true,
    }
    })
  ],
  define: {
    'process.env': {
      REACT_APP_API_BASE_URL: JSON.stringify(process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api')
    }
  },
})
