import { defineConfig } from 'rollup'
import postcssPlugin from 'rollup-plugin-postcss'
import deleteJunkPlugin from '../plugins/rollup-delete-junk'
import transformScssPlugin from '../plugins/rollup-transform-scss'
import copyPlugin from 'rollup-plugin-copy'
import postcssImport from '../postcss-plugins/postcss-import'
import vuePlugin from 'rollup-plugin-vue'
import { nodeResolve as nodeResolvePlugin } from '@rollup/plugin-node-resolve'
import typescriptPlugin from 'rollup-plugin-typescript2'
import commonjsPlugin from '@rollup/plugin-commonjs'

export function createStylesConfig ({ input, outDir = 'dist/', minify = false }) {
  const inputPathWithoutFilename = input.split('/').slice(0, -1).join('/')
  const transformSrc = (src) => `./${src.replace(inputPathWithoutFilename, '')}`

  return defineConfig({
    input: ['./src/main.ts', input],
    output: {
      dir: outDir,
    },

    plugins: [
      typescriptPlugin({ check: false }),
      vuePlugin({
        target: 'browser',
        preprocessStyles: true,
      }),
      commonjsPlugin(),
      postcssPlugin({
        minimize: minify,
        plugins: [postcssImport()],
        extract: 'vuestic-ui.css',
        inject: false,
      }),
      nodeResolvePlugin(),
      transformScssPlugin({
        inputDir: inputPathWithoutFilename,
        outDir: `${outDir}/styles`,
        filter: /.*\.scss/,
      }),
      copyPlugin({
        targets: [
          {
            src: `${inputPathWithoutFilename}/**/*.scss`,
            dest: `${outDir}/styles/`,
            rename: (name, extension, src) => transformSrc(src),
          },
        ],
      }),
      deleteJunkPlugin({ dirPath: outDir, deleteFilesRegex: /[.]js|[.].js.map$/ }),
    ],
  })
}
