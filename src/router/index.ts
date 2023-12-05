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
          {
            path: "estados-financieros",
            name: "estados-financieros",
            component: () => import("../views/EstadosFinancieros.vue"),
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
