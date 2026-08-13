import path from 'node:path'

import react from '@vitejs/plugin-react'
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'
import { defineConfig as defineViteConfig, mergeConfig } from 'vite'
import preload from 'vite-plugin-preload'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'
import {
  coverageConfigDefaults,
  defineConfig as defineVitestConfig,
} from 'vitest/config'

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    css: true,
    bail: 1,
    environment: 'jsdom',
    setupFiles: ['./src/app/config/setup-tests.ts'],
    passWithNoTests: true,
    silent: true,
    reporters: ['json', 'verbose', 'vitest-sonar-reporter'],
    outputFile: {
      'vitest-sonar-reporter': 'sonar-report.xml',
    },
    coverage: {
      exclude: [
        '**/src/app/**',
        '**/public/**',
        ...coverageConfigDefaults.exclude,
      ],
      provider: 'istanbul',
      enabled: false,
      reporter: ['html', 'text', 'lcov'],
    },
  },
})

const viteConfig = defineViteConfig({
  optimizeDeps: {
    esbuildOptions: {
      plugins: [fixReactVirtualized],
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    preload(),
    tsconfigPaths(),
    VitePWA({
      disable: true, // REMOVE THIS LINE TO ENABLE PWA
      workbox: { maximumFileSizeToCacheInBytes: 3000000 },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      registerType: 'prompt',
      manifest: {
        // CHANGE MANIFEST IF YOU WANT TO USE PWA
        name: 'Example App',
        short_name: 'Example App',
        description: 'Short description of your app',
        theme_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            purpose: 'maskable',
            sizes: '512x512',
            src: 'assets/icon512_maskable.png',
            type: 'image/png',
          },
          {
            purpose: 'any',
            sizes: '512x512',
            src: 'assets/icon512_rounded.png',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      entities: path.resolve(__dirname, './src/entities'),
      features: path.resolve(__dirname, './src/features'),
      pages: path.resolve(__dirname, './src/pages'),
      shared: path.resolve(__dirname, './src/shared'),
      widgets: path.resolve(__dirname, './src/widgets'),
    },
  },
})

//CONFIG ONLY
// eslint-disable-next-line import/no-default-export
export default mergeConfig(viteConfig, vitestConfig)
