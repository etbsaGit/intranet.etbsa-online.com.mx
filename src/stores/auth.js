import axios from "axios";
import { defineStore } from "pinia";
import { LocalStorage, Notify } from "quasar";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authUser: null,
    authToken: null,
    twoFactorUserId: null,
    awaitingTwoFactor: false,
  }),
  getters: {
    user: (state) => state.authUser,
    token: (state) => state.authToken,
    isTwoFactorPending: (state) => state.awaitingTwoFactor,
  },
  actions: {
    async getToken() {
      await axios.get("/sanctum/csrf-cookie");
    },
    async login(form) {
      await this.getToken();
      try {
        const res = await axios.post("/api/auth/login", form);
        if (res.data.two_factor_required) {
          this.twoFactorUserId = res.data.user_id;
          this.awaitingTwoFactor = true;
          Notify.create({
            color: "info",
            message: res.data.message || "Código 2FA enviado",
            icon: "mail",
          });
        } else {
          this.authToken = res.data.token;
          this.authUser = res.data.data;
          this.awaitingTwoFactor = false;
          this.twoFactorUserId = null;
          this.router.push("/");
        }
      } catch (error) {
        Notify.create({
          color: "negative",
          message: error.response?.data || "Login fallido",
          icon: "report_problem",
        });
      }
    },
    async verifyTwoFactor(code) {
      try {
        const res = await axios.post("/api/auth/verify", {
          user_id: this.twoFactorUserId,
          two_factor_code: code,
        });
        this.authToken = res.data.token;
        this.authUser = res.data.data;
        this.awaitingTwoFactor = false;
        this.twoFactorUserId = null;
        this.router.push("/");
      } catch (error) {
        throw error; // se maneja en el componente
      }
    },
    async logout() {
      // Primero, elimina los datos del almacenamiento local
      LocalStorage.remove("auth");
      localStorage.clear();

      // Configura el encabezado de autorización para la solicitud de cierre de sesión
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.authToken}`;

      // Opcionalmente, limpia los datos de autenticación en la aplicación
      this.authToken = null;
      this.authUser = null;

      try {
        // Realiza la solicitud de cierre de sesión
        await axios.post("/api/auth/logout");
      } catch (error) {
      } finally {
        // Recarga la página independientemente del resultado de la solicitud
        location.reload();
      }
    },
  },
  persist: true,
});
