import { auth, guest, admin, rrhh, encuestador, servicio } from "./middleware";

const routes = [
  {
    path: "",
    component: () => import("/src/layouts/DefaultLayout.vue"),
    meta: {
      middlewares: [guest],
    },
    children: [
      { path: "/login", component: () => import("pages/auth/LoginPage.vue") },
    ],
  },
  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [auth],
    },
    children: [
      { path: "/home", component: () => import("pages/HomePage.vue") },
      {
        path: "/catalogos",
        component: () => import("src/pages/catalogos/indexPage.vue"),
      },
      {
        path: "/cliente",
        component: () => import("src/pages/cliente/ClientePage.vue"),
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
