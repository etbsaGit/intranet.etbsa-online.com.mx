import axios from "axios";
import { useAuthStore } from "src/stores/auth";
import { Loading, QSpinnerGears, Notify } from "quasar";

export function show_notify(msj, icon, color, focus = "") {
  if (focus !== "") {
    nextTick(() => focus.value.focus());
  }
  Notify.create({
    message: msj,
    icon: icon,
    color: color,
    position: "bottom-right",
  });
}

const sleep = (miliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
};

export async function sendRequest(method, params, url, redirect = "") {
  const authStore = useAuthStore();
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${authStore.authToken}`;
  try {
    Loading.show({
      spinner: QSpinnerGears,
    });
    const response = await axios({ method: method, url: url, data: params });
    const data = response.data;
    if (method == "POST" || method == "PUT") {
      show_notify("Registro cargado", "publish", "blue", "");
    }
    if (method == "GET") {
      show_notify("Informacion cargada del servidor", "download", "green", "");
    }
    if (method == "DELETE") {
      show_notify("Registro borrado", "delete", "orange", "");
    }
    if (!!redirect) {
      await sleep(2000);
      window.location.href = redirect;
    }
    Loading.hide();
    return data;
  } catch (err) {
    Loading.hide();
    const errorMessage = err.response.data;
    if (err.response.status === 401 || errorMessage === "Unauthorized") {
      localStorage.clear();
      location.reload();
      await sleep(2000);
    }
    if (typeof errorMessage === "object" && errorMessage !== null) {
      let errorMessages = [];
      for (const key in errorMessage) {
        if (Object.hasOwnProperty.call(errorMessage, key)) {
          const error = errorMessage[key];
          errorMessages.push(`Error en ${key}: ${error}`);
        }
      }
      show_notify(errorMessages.join("\n"), "error", "red", "");
    } else {
      show_notify("Error desconocido: " + errorMessage, "check", "red", "");
    }
    throw err;
  }
}

export function getNamesRoles(usuario) {
  const nameRoles = [];
  if (usuario && Array.isArray(usuario.roles)) {
    for (const role of usuario.roles) {
      nameRoles.push(role.name);
    }
  }
  return nameRoles;
}

export function checkRole(role) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;
  return usuario.roles.some((usuarioRol) => usuarioRol.name === role);
}

export function checkLine(linea) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;
  if (
    usuario &&
    usuario.roles &&
    usuario.roles.some((usuarioRol) => usuarioRol.name === "Admin")
  ) {
    // Si el usuario tiene el rol de "admin", devuelve true
    return true;
  }
  if (
    usuario &&
    usuario.empleado &&
    usuario.empleado.linea &&
    usuario.empleado.linea.nombre
  ) {
    return usuario.empleado.linea.nombre === linea;
  }
  return false;
}

export function checkSucursal(linea) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;
  if (
    usuario &&
    usuario.roles &&
    usuario.roles.some((usuarioRol) => usuarioRol.name === "Admin")
  ) {
    // Si el usuario tiene el rol de "admin", devuelve true
    return true;
  }
  if (
    usuario &&
    usuario.empleado &&
    usuario.empleado.sucursal &&
    usuario.empleado.sucursal.nombre
  ) {
    return usuario.empleado.sucursal.nombre === linea;
  }
  return false;
}

export function checkUserId(userId) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;

  // Verificar si el usuario tiene el rol de administrador
  const isAdmin = usuario.roles.some((role) => role.name === "Admin");

  // Verificar si el usuario es administrador o si el id del empleado coincide con userId
  if (!usuario.empleado && isAdmin) {
    return true;
  }

  return usuario.empleado && usuario.empleado.id === userId;
}

export function checkId(userId) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;

  // Verificar si el usuario tiene el rol de administrador
  const isAdmin = usuario.roles.some((role) => role.name === "Admin");

  // Verificar si el usuario es administrador o si el id del empleado coincide con userId
  if (!usuario.empleado && isAdmin) {
    return true;
  }

  return usuario.id === userId;
}

export function checkPermissions(permission) {
  const authStore = useAuthStore();
  const usuario = authStore.authUser;
  return usuario.permissions.some(
    (usuarioPermission) => usuarioPermission.name === permission
  );
}

export function getNamesPermissions(usuario) {
  const namePermissions = [];
  if (usuario && Array.isArray(usuario.permissions)) {
    for (const permission of usuario.permissions) {
      namePermissions.push(permission.name);
    }
  }
  return namePermissions;
}
