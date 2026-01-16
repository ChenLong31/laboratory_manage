export default {
  path: "/payManage",
  redirect: "/payManage/list",
  meta: {
    title: "支付管理",
    rank: 3
  },
  children: [
    {
      path: "/payManage/payHistory",
      name: "payHistory",
      component: () => import("@/views/payManage/payHistory.vue"),
      meta: {
        title: "支付记录",
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
