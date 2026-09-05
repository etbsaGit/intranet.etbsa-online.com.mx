import {
  auth,
  guest,
  admin,
  clientes,
  sales,
  NT,
  invItem,
  products,
  productsTractores,
  productsRiego,
  crm,
  reporteCliente,
  powerbi,
  creditoInterno,
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
      middlewares: [invItem],
    },
    children: [
      {
        path: "/catalogos",
        component: () => import("src/pages/catalogos/indexPage.vue"),
      },
      {
        path: "/invCatalogos",
        component: () => import("src/pages/Inv/InvCatalogos.vue"),
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
      middlewares: [creditoInterno],
    },
    children: [
      {
        path: "/creditoint/dashboard",
        component: () => import("src/pages/Creditoint/AllCreditoIntIndex.vue"),
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
      middlewares: [productsTractores],
    },
    children: [
      {
        path: "/productos-tractores",
        component: () =>
          import("src/pages/Productos/Tractores/ProductosTractoresPage.vue"),
      },
    ],
  },

  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [productsRiego],
    },
    children: [
      {
        path: "/productos-riego",
        component: () =>
          import("src/pages/Productos/Riego/ProductosRiegoPage.vue"),
      },
    ],
  },

  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [crm],
    },
    children: [
      {
        path: "/cotizaciones/pedidosFormalizados",
        component: () =>
          import("src/pages/Cotizaciones/PedidosFormalizadosPage.vue"),
      },
      {
        path: "/cotizaciones/pedidosAutorizados",
        component: () =>
          import("src/pages/Cotizaciones/PedidosAutorizadosPage.vue"),
      },
      {
        path: "/cotizaciones/asignacionSerie",
        component: () =>
          import("src/pages/Cotizaciones/AsignacionSeriePage.vue"),
      },
    ],
  },

  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [invItem],
    },
    children: [
      {
        path: "/invItems",
        component: () => import("src/pages/InvItem/InvItemIndex.vue"),
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

  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [reporteCliente],
    },
    children: [
      {
        path: "/reportes",
        component: () =>
          import("src/pages/ReporteClientes/ReporteClientesPage.vue"),
      },
    ],
  },
  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middlewares: [powerbi],
    },
    children: [
      {
        path: "/powerbi/historico",
        component: () =>
          import("src/pages/PowerBI/Direccion/DireccionPage.vue"),
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
