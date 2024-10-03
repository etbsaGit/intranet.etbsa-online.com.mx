import {
  auth,
  guest,
  admin,
  rrhh,
  encuestador,
  servicio,
  clientes,
  sales,
} from "./middleware";

const routes = [
  {
    path: "/login",
    component: () => import("/src/layouts/DefaultLayout.vue"),
    meta: {
      middlewares: [guest],
    },
    children: [
      { path: "", component: () => import("pages/auth/LoginPage.vue") },
    ],
  },
  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [auth],
    },
    children: [{ path: "", component: () => import("pages/HomePage.vue") }],
  },

  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [admin],
    },
    children: [
      {
        path: "/catalogos",
        component: () => import("src/pages/catalogos/indexPage.vue"),
      },
    ],
  },

  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [clientes],
    },
    children: [
      {
        path: "/cliente",
        component: () => import("src/pages/cliente/ClientePage.vue"),
      },
    ],
  },

  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [sales],
    },
    children: [
      {
        path: "/sale",
        component: () => import("src/pages/sale/SalePage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
