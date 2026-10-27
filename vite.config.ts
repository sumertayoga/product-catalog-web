import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      proxy: {
        // Forward API calls to the backend so the browser stays same-origin (no CORS in dev).
        // 5183 = `dotnet run`; set API_PROXY_TARGET=http://localhost:8080 for the docker compose API.
        '/api': env.API_PROXY_TARGET || 'http://localhost:5183',
      },
    },
  }
})
