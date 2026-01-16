export default {
  path: "/appointManage",
  redirect: "/appointManage/list",
  meta: {
    title: "预约管理",
    rank: 2
  },
  children: [
    {
      path: "/appointManage/list",
      name: "appointManage",
      component: () => import("@/views/appointManage/index.vue"),
      meta: {
        title: "预约管理",
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
