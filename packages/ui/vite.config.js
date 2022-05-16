import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

import { getInputs } from './build/rollup/generate-rollup-inputs'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~/': resolve(__dirname, 'src'),
      '~normalize.css/normalize.css': 'normalize.css/normalize.css',
    },
  },

  // css: {
  // убрать экстракт css
  //   postcss: {},
  // },

  // esbuild: {
  //
  // },
  build: {
    outDir: 'dist',
    // assetsDir: 'css',
    cssCodeSplit: true,
    sourcemap: true,
    // check
    // target: 'esnext',

      // default esbuild, not available for es/esm format in lib mode
    minify: false,

    // todo: vue version, js in css, downgrade vite vue plugin
    // terserOptions: {
    //     // ecma: 2019,
    //   keep_classnames: true,
    //   keep_fnames: true,
    // },

    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'VuesticUI',
      fileName: 'main',
      formats: ['es'],
    },

    rollupOptions: {
      treeshake: 'safest',

      external: ['vue'],

      // input: getInputs(),
      // input: resolve(__dirname, 'src/main.ts'),
      //
      // external: ['vue'],
      //
      // output: {
      //   dir: './dist/cjs',
      //   format: 'cjs',
      //   entryFileNames: '[name].cjs',
      //   chunkFileNames: '[name].cjs',
      // },
    },
  },

  plugins: [
      // Covered by default in Vite
      // terserPlugin(),

      // Included in Vite
      // commonjsPlugin(),

      // Covered by default in Vite
      // typescript2({ check: false }),

      // throws an error
      // vitePluginRequire(),

      // ?
      // compress(),

    chunkSplitPlugin({ strategy: 'unbundle' }),
    vue({
      isProduction: true,
      // spec.disabled
      exclude: [/\.md$/, /\.spec\.ts$/],
      // reactivityTransform: true,
    }),
    // viteCommonjs(),
  ],
})
