import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LayoutComponent from "../components/Layout-component.vue";
import LayoutContent from "../components/Layout-content.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: { name: "dashboard" },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: LayoutComponent,
    children: [
      {
        path: "", // Ruta raíz del contenido
        component: LayoutContent,
        children: [
          {
            path: "cuentas",
            name: "cuentas",
            component: () => import("../views/CuentaContable.vue"),
          },
          {
            path: "libro-diario",
            name: "libro-diario",
            component: () => import("../views/LibroDiario.vue"),
          },
          {
            path: "mayorizacion",
            name: "mayorizacion",
            component: () => import("../views/MayorizacionComponent.vue"),
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    } else {
      document.querySelector(".app-layout__page")?.scrollTo(0, 0);
    }
  },
  routes,
});

export default router;
