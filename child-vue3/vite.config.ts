import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import EslintPlugin from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueJsx(),
    Components({
      // 要搜索组件的目录的相对路径
      dirs: ['src/components'],
      extensions: ['vue'],
      // 搜索子目录
      deep: true,
      // 生成自定义 `auto-components.d.ts` 全局声明
      dts: 'src/types/auto-components.d.ts',
      include: [/\.[tj]sx?$/,  /\.vue$/, /\.vue\?vue/],
      // 自定义组件的解析器
      resolvers: [ElementPlusResolver()],
      exclude: [/[\\/]node_modules[\\/]/]
    }),
    AutoImport({
      // 生成自定义 `auto-components.d.ts` 全局声明
      dts: 'src/types/auto-imports.d.ts',
      include: [/\.[tj]sx?$/, /\.vue$/],
      // 自动引入的api从这里找
      imports: ['vue', 'vue-router'],
      resolvers: [
        ElementPlusResolver() // 自动导入Element-Plus的Api
      ],
      eslintrc: {
        enabled: false,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      }
    }),
    createStyleImportPlugin({
      resolves: [ElementPlusResolve()],
      libs: [{
        libraryName: 'element-plus',
        esModule: true,
        resolveStyle: (name) => {
          return `element-plus/es/components/${name.substring(3)}/style/css`
        }
      }]
    }),
    EslintPlugin({
      cache: false,
      include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // 检查的文件
    }),
    DefineOptions()
  ],
  css: {
    preprocessorOptions: {
        scss: {
            additionalData: `@use "@/assets/scss/index.scss";`
        }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  base: '/',
  build: {
    minify: 'terser',
    outDir: 'dist',
    sourcemap: 'inline',
    terserOptions: {
      compress: {
        drop_debugger: true,
        drop_console: false
      }
    }
  },
  server: {
    host: 'localhost',
    port: 8081,
    open: true, //配置浏览器自动访问
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/api': {
        target: 'http://10.10.34.31:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, 'api')
      }
    },
    hmr: true,
  }
})
