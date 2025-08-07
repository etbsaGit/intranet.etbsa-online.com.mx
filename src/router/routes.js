import { auth, guest, admin, clientes, sales, NT } from "./middleware";

const routes = [
  {
    path: "/login",
    component: () => import("/src/layouts/DefaultLayout.vue"),
    meta: {
      middlewares: [guest],
    },
    children: [
      { path: "", component: () => import("pages/auth/LoginPage.vue") },
      {
        path: "/reset-password",
        component: () => import("src/pages/auth/ResetPassword.vue"),
      },
      {
        path: "/forgot-password",
        component: () => import("src/pages/auth/ForgotPassword.vue"),
        meta: { requiresGuest: true },
      },
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

  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [NT],
    },
    children: [
      {
        path: "/nt/hectareas",
        component: () =>
          import(
            "src/pages/NuevasTecnologias/HectareasConectadas/HectareasConectadasIndex.vue"
          ),
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
