import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { resolveConfigs } from 'imagetools-core'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import svgoPlugin from './dev/svgoPlugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({
      include: ['buffer'], // required for @ton/core
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
      },
    }),
    vue(),
    tailwindcss(),
    svgoPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: './vendor/tradingview/charting_library/bundles',
          dest: './charting_library',
        },
      ],
    }),
    imagetools({
      defaultDirectives: new URLSearchParams({ format: 'webp', quality: '80' }),
      include: ['./src/assets/img-src/**/*'],
      resolveConfigs: (entries, outputFormats) => {
        const out = resolveConfigs(entries, outputFormats)
        const entry = out[0]
        // add hi-DPR copies
        if (entry.as && entry.as !== 'url') {
          return [
            { ...entry },
            { ...entry, w: String(+entry.w * 2) },
            { ...entry, w: String(+entry.w * 3) },
          ]
        }
        return out
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@vendor': fileURLToPath(new URL('./vendor', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
})
