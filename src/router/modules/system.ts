export default {
  path: "/system",
  redirect: "/system/banner",
  meta: {
    title: "系统管理",
    rank: 5
  },
  children: [
    {
      path: "/system/banner",
      name: "bannerConfig",
      component: () => import("@/views/system/banner/index.vue"),
      meta: {
        title: "轮播图配置",
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
