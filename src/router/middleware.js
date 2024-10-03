import { useAuthStore } from "src/stores/auth";
import { checkRole } from "src/boot/functions";

export function guest(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();
  if (auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/home");
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

export function rrhh({ to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (!checkRole("RRHH")) {
    if (!checkRole("Jefe")) {
      return next("/");
    }
    return next();
  }

  return next();
}

export function servicio({ to, next }) {
  const auth = useAuthStore();

  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }

  if (checkRole("Servicio") || checkRole("Taller")) {
    return next();
  }
  auth.returnUrl = to.fullPath;
  return next("/");
}

export function encuestador(/* { to, from, next } */ { to, next }) {
  const auth = useAuthStore();
  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next("/login");
  }
  if (checkRole("Encuestador") || checkRole("Evaluador")) {
    return next();
  }
  auth.returnUrl = to.fullPath;
  return next("/");
}
