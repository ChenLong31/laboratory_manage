import { $t } from "@/plugins/i18n";
import { home } from "@/router/enums";
const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/instrumentManage/list",
  meta: {
    icon: "ep/home-filled",
    title: $t("menus.pureHome"),
    rank: home
  },
  children: []
} satisfies RouteConfigsTable;
