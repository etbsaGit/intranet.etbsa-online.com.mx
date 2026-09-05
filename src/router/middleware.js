import { useAuthStore } from "src/stores/auth";
import { checkRole } from "src/boot/functions";

export function guest(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();
  if (auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/");
  }
  return next();
}

export function auth(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();
  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }
  return next();
}

export function admin(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Admin")) {
    return next("/");
  }

  return next();
}

export function clientes(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Intranet.clientes")) {
    return next("/");
  }

  return next();
}

export function sales(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Intranet.sales")) {
    return next("/");
  }

  return next();
}

export function products(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Intranet.products")) {
    return next("/");
  }

  return next();
}
export function productsTractores(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Intranet.products.tractores")) {
    return next("/");
  }

  return next();
}

export function productsRiego(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Intranet.products.riego")) {
    return next("/");
  }

  return next();
}

export function crm(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("crm")) {
    return next("/");
  }

  return next();
}

export function NT(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Intranet.nt")) {
    return next("/");
  }

  return next();
}

export function invItem(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Intranet.invItem")) {
    return next("/");
  }

  return next();
}
// credito interno
export function creditoInterno(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Intranet.CreditoInterno")) {
    return next("/");
  }

  return next();
}
// report clientes
export function reporteCliente(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("Intranet.reporteCliente")) {
    return next("/");
  }

  return next();
}
// historico ventas
export function powerbi(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("powerbi")) {
    return next("/");
  }

  return next();
}
