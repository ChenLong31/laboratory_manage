import { $t } from "@/plugins/i18n";
import { list } from "@/router/enums";

export default {
  path: "/instrumentManage",
  redirect: "/instrumentManage/list",
  meta: {
    title: "仪器管理",
    rank: 1
  },
  children: [
    {
      path: "/instrumentManage/list",
      name: "instrumentManage",
      component: () => import("@/views/instrumentManage/index.vue"),
      meta: {
        title: "仪器管理",
        showParent: true
      }
    },
    {
      path: "/instrumentManage/infoForm",
      name: "infoForm",
      component: () => import("@/views/instrumentManage/infoForm.vue"),
      meta: {
        title: "仪器信息",
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
