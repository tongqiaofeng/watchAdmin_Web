import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layouts/index.vue";

export const constantRoutes = [
  {
    path: "/",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/admin",
    component: Layout,
    redirect: "/index",
    children: [
      {
        path: "/index",
        name: "首页",
        icon: new URL("../assets/imgs/menu-icon/index.png", import.meta.url)
          .href,
        component: () => import("@/views/index/index.vue"),
        meta: {
          title: "首页",
          name: "index",
        },
      },
      {
        path: "/data",
        name: "基础数据管理",
        icon: new URL(
          "../assets/imgs/menu-icon/msg-search.png",
          import.meta.url
        ).href,
        meta: {
          title: "基础数据管理",
        },
        children: [
          {
            path: "/data/shop",
            name: "店铺管理",
            component: () => import("@/views/data/shop.vue"),
            meta: {
              title: "店铺管理",
              name: "shop",
            },
          },
          {
            path: "/data/watch",
            name: "手表管理",
            component: () => import("@/views/data/watch.vue"),
            meta: {
              title: "手表管理",
              name: "watch",
            },
          },
          {
            path: "/data/rate",
            name: "汇率查询",
            component: () => import("@/views/data/rate-query.vue"),
            meta: {
              title: "汇率查询",
              name: "rate",
            },
          },
          {
            path: "/data/merchant",
            name: "贸易商管理",
            component: () => import("@/views/data/merchant.vue"),
            meta: {
              title: "贸易商管理",
              name: "merchant",
            },
          },
          {
            path: "/data/client",
            name: "客户管理",
            component: () => import("@/views/data/client.vue"),
            meta: {
              title: "客户管理",
              name: "client",
            },
          },
          {
            path: "/data/price",
            name: "手表价格管理",
            component: () => import("@/views/data/watch-price.vue"),
            meta: {
              title: "手表价格管理",
              name: "price",
            },
          },
        ],
      },
      {
        path: "/purchase",
        name: "采购管理",
        icon: new URL("../assets/imgs/menu-icon/cargo.png", import.meta.url)
          .href,
        meta: {
          title: "采购管理",
        },
        children: [
          {
            path: "/purchase/enter",
            name: "采购单录入",
            component: () => import("@/views/purchase/purchase-enter.vue"),
            meta: {
              title: "采购单录入",
              name: "purchaseEnter",
            },
          },
          {
            path: "/purchase/query",
            name: "采购单查询",
            component: () => import("@/views/purchase/purchase-query.vue"),
            meta: {
              title: "采购单查询",
              name: "purchaseQuery",
            },
          },
        ],
      },
      {
        path: "/sale",
        name: "销售管理",
        icon: new URL("../assets/imgs/menu-icon/sale.png", import.meta.url)
          .href,
        meta: {
          title: "销售管理",
        },
        children: [
          {
            path: "/sale/billing",
            name: "销售开单",
            component: () => import("@/views/sale/sale-billing.vue"),
            meta: {
              title: "销售开单",
              name: "billing",
            },
          },
          {
            path: "/sale/history",
            name: "销售历史",
            component: () => import("@/views/sale/sale-history.vue"),
            meta: {
              title: "销售历史",
              name: "history",
            },
          },
          {
            path: "/sale/consignment",
            name: "新增寄卖",
            component: () => import("@/views/sale/sale-insert.vue"),
            meta: {
              title: "新增寄卖",
              name: "consignment",
            },
          },
          {
            path: "/sale/record",
            name: "寄卖记录",
            component: () => import("@/views/sale/sale-record.vue"),
            meta: {
              title: "寄卖记录",
              name: "record",
            },
          },
        ],
      },
      {
        path: "/stock",
        name: "库存管理",
        icon: new URL("../assets/imgs/menu-icon/stock.png", import.meta.url)
          .href,
        meta: {
          title: "库存管理",
        },
        children: [
          {
            path: "/stock/query",
            name: "stockQuery",
            component: () => import("@/views/stock/stock-query.vue"),
            meta: {
              title: "库存查询",
              name: "stockQuery",
            },
          },
          {
            path: "/stock/logistics",
            name: "物流查询",
            component: () => import("@/views/stock/logistics-query.vue"),
            meta: {
              title: "物流查询",
              name: "logistics",
            },
          },
        ],
      },
      {
        path: "/bill",
        name: "账单管理",
        icon: new URL("../assets/imgs/menu-icon/capital.png", import.meta.url)
          .href,
        meta: {
          title: "账单管理",
        },
        children: [
          {
            path: "/bill/enter",
            name: "账单录入",
            component: () => import("@/views/bill/bill-enter.vue"),
            meta: {
              title: "账单录入",
              name: "billEnter",
            },
          },
          {
            path: "/bill/query",
            name: "账单查询",
            component: () => import("@/views/bill/bill-query.vue"),
            meta: {
              title: "账单查询",
              name: "billQuery",
            },
          },
        ],
      },
      {
        path: "/webAdmin",
        name: "网站管理",
        icon: new URL("../assets/imgs/menu-icon/capital.png", import.meta.url)
          .href,
        meta: {
          title: "网站管理",
        },
        children: [
          {
            path: "/webAdmin/watch",
            name: "手表信息",
            component: () => import("@/views/admin/watch-update.vue"),
            meta: {
              title: "手表信息",
              name: "watchUpdate",
            },
          },
          {
            path: "/webAdmin/index",
            name: "首页管理",
            component: () => import("@/views/admin/home-content.vue"),
            meta: {
              title: "首页管理",
              name: "homeContent",
            },
          },

          {
            path: "/webAdmin/news",
            name: "新闻管理",
            component: () => import("@/views/admin/news/news-release.vue"),
            meta: {
              title: "新闻管理",
              name: "newsAdmin",
            },
          },
        ],
      },
      // {
      //   path: '/company',
      //   name: '企业在线办公',
      //   icon: new URL('../assets/imgs/menu-icon/work.png',
      //     import.meta.url).href,
      //   meta: {
      //     title: '企业在线办公'
      //   },
      //   children: [{
      //     path: '/company/index',
      //     name: '企业管理',
      //     component: () => import('@/views/company/company-index.vue'),
      //     meta: {
      //       title: '企业管理'
      //     }
      //   }]
      // }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  // 路由跳转,页面回到顶部
  scrollBehavior: (to, from, savePosition) => {
    if (savePosition) {
      return savePosition;
    } else {
      return {
        top: 0,
      };
    }
  },
});

export default router;
