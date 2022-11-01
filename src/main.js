import {
  createApp
} from 'vue';
import App from './App.vue';
const app = createApp(App);

app.directive('preventClick', {
  mounted(el) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, 3000);
      }
    });
  }
})

// vue-router
import router from './router/index';

import './utils/router';

// element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn';
app.use(ElementPlus, {
  locale
});

import * as ElementPlusIconsVue from '@element-plus/icons-vue';
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// pinia
import {
  createPinia
} from 'pinia';
const pinia = createPinia();
app.use(pinia);

app.use(router).mount('#app');