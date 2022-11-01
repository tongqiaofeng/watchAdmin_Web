import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  resolve: {
    // 设置别名
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js',
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      // 引入公用的样式
      scss: {
        additionalData: `
          @use "@/styles/index.scss" as *;
        `,
        charset: false, 
      },
    },
  }
})
