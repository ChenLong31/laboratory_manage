export default {
  path: "/userManage",
  redirect: "/userManage/list",
  meta: {
    title: "用户管理",
    rank: 4
  },
  children: [
    {
      path: "/userManage/list",
      name: "userManage",
      component: () => import("@/views/userManage/index.vue"),
      meta: {
        title: "用户管理",
        showParent: true
      }
    },

    {
      path: "/userManage/audit",
      name: "userAudit",
      component: () => import("@/views/userManage/userAudit.vue"),
      meta: {
        title: "用户审核",
        showParent: true
      }
    },
    {
      path: "/userManage/managerAudit",
      name: "managerAudit",
      component: () => import("@/views/userManage/managerAudit.vue"),
      meta: {
        title: "管理员申请审核",
        showParent: true
      }
    },
    {
      path: "/userManage/groupManage",
      name: "groupManage",
      component: () => import("@/views/userManage/groupManage.vue"),
      meta: {
        title: "课题组管理",
        showParent: true
      }
    },
    {
      path: "/userManage/userInfoForm",
      name: "userInfoForm",
      component: () => import("@/views/userManage/components/userInfoForm.vue"),
      meta: {
        title: "用户信息",
        showParent: true,
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
