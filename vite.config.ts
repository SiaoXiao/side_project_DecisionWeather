import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    minify: 'esbuild',
    rollupOptions: {
      plugins: [
        visualizer({
          filename: 'dist/report.html',
          template: 'treemap',
          emitFile: false,
          gzipSize: true,
          brotliSize: true,
        }),
      ],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? ''
          const ext = name.split('.').pop()?.toLowerCase() ?? ''
          if (/png|jpe?g|gif|svg|webp|ico/i.test(ext)) {
            return 'img/[name]-[hash][extname]'
          }
          if (/css/i.test(ext)) {
            return 'css/[name]-[hash][extname]'
          }
          if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return 'fonts/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
})
