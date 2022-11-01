// 配置路由守卫
import router from '@/router/index';
import {
  startNprogress,
  closeNprogress
} from './nprogress';
import {
  useUserStore
} from '@/store/userStore';

// 前置守卫
router.beforeEach((to, from, next) => {
  startNprogress();
  const userStore = useUserStore();
  if (to.path === '/') {
    next();
  } else {
    // 检查token
    if (!userStore.token) {
      next('/');
    } else {
      next();
    }
  }
})

// 后置守卫
router.afterEach((to, from) => {
  closeNprogress();
})