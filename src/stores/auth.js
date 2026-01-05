import { defineStore } from "pinia";
import { LocalStorage, Notify } from "quasar";
import { sendRequest } from "src/boot/functions";

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
      // Sanctum CSRF cookie
      await sendRequest("GET", null, "/sanctum/csrf-cookie");
    },

    async login(form) {
      await this.getToken();

      try {
        const res = await sendRequest("POST", form, "/api/auth/login");

        if (res?.two_factor_required) {
          this.twoFactorUserId = res.user_id;
          this.awaitingTwoFactor = true;

          Notify.create({
            color: "info",
            message: res.message || "Código 2FA enviado",
            icon: "mail",
          });
        } else {
          this.authToken = res.token;
          this.authUser = res.data;
          this.awaitingTwoFactor = false;
          this.twoFactorUserId = null;

          this.router.push("/");
        }

        return res;
      } catch (error) {
        Notify.create({
          color: "negative",
          message: error?.response?.data || "Login fallido",
          icon: "report_problem",
        });
        throw error;
      }
    },

    async sendEmailVerification() {
      try {
        await sendRequest("POST", {}, "/api/auth/send-email-verification", {
          headers: { Authorization: `Bearer ${this.authToken}` },
        });

        Notify.create({
          color: "positive",
          message: "Correo de verificación enviado",
          icon: "mail",
        });
      } catch (error) {
        Notify.create({
          color: "negative",
          message: error?.response?.data?.message || "Error enviando correo",
          icon: "report_problem",
        });
        throw error;
      }
    },

    async confirmEmailVerification(id, hash) {
      try {
        const res = await sendRequest(
          "GET",
          null,
          `/api/auth/verify-email/${id}/${hash}`
        );

        Notify.create({
          color: "positive",
          message: res?.message || "Correo verificado",
          icon: "check",
        });

        return res;
      } catch (error) {
        Notify.create({
          color: "negative",
          message: error?.response?.data?.message || "Error verificando correo",
          icon: "report_problem",
        });
        throw error;
      }
    },

    async verifyTwoFactor(code) {
      try {
        const res = await sendRequest(
          "POST",
          {
            user_id: this.twoFactorUserId,
            two_factor_code: code,
          },
          "/api/auth/verify"
        );

        this.authToken = res.token;
        this.authUser = res.data;
        this.awaitingTwoFactor = false;
        this.twoFactorUserId = null;

        this.router.push("/");
        return res;
      } catch (error) {
        throw error; // se maneja en el componente
      }
    },

    async logout() {
      try {
        // intenta avisar al backend antes de limpiar (opcional, pero recomendado)
        await sendRequest("POST", {}, "/api/auth/logout", {
          headers: { Authorization: `Bearer ${this.authToken}` },
        });
      } catch (error) {
        // si falla, igual limpiamos local
      } finally {
        LocalStorage.remove("auth");
        localStorage.clear();

        this.authToken = null;
        this.authUser = null;
        this.awaitingTwoFactor = false;
        this.twoFactorUserId = null;

        location.reload();
      }
    },
  },
  persist: true,
});
