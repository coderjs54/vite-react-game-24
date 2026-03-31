import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      // injectRegister: 'auto',
      registerType: 'autoUpdate',
      pwaAssets: {
        disabled: false,
        config: false,
      },
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: '24点小游戏',
        short_name: '经典小游戏之24点小游戏',
        description: '使用加减乘除四则运算计算出24即可获胜',
        theme_color: '#ffffff',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
    })
  ],
  server: {
    port: 5174,
  },
  base: '/vite-react-game-24/',
})
