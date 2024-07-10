import axios from "axios";
import { defineStore } from "pinia";
import { LocalStorage, Notify } from "quasar";

export const useAuthStore = defineStore("auth", {
  state: () => ({ authUser: null, authToken: null }),
  getters: {
    user: (state) => state.authUser,
    token: (state) => state.authToken,
  },
  actions: {
    async getToken() {
      await axios.get("/sanctum/csrf-cookie");
    },
    async login(form) {
      await this.getToken();
      await axios
        .post("/api/auth/login", form)
        .then((res) => {
          this.authToken = res.data.token;
          this.authUser = res.data.data;
          Notify.create({
            color: "green",
            position: "top",
            message: res.data.message,
            icon: "check",
          });
          this.router.push("/");
        })
        .catch((errors) => {
          Notify.create({
            color: "negative",
            position: "top",
            message: errors.response.data,
            icon: "report_problem",
          });
        });
    },
    async register(form) {
      await this.getToken();
      await axios
        .post("/api/auth/register", form)
        .then((res) => {
          Notify.create({
            color: "green",
            position: "top",
            message: res.data.message,
            icon: "info",
          });

          setTimeout(() => this.router.push("/login"), 2000);
        })
        .catch((errors) => {
          Notify.create({
            color: "negative",
            position: "top",
            message: errors.response.data.message,
            icon: "report_problem",
          });
        });
    },
    async logout() {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.authToken}`;
      await axios.post("/api/auth/logout");
      this.authToken = null;
      this.authUser = null;

      LocalStorage.remove("auth");
      this.router.push("/login");
      localStorage.clear();
      location.reload();
    },
  },
  persist: true,
});
