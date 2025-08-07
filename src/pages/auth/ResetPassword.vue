<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg my_card" bordered>
      <q-card-section class="text-center">
        <q-img src="../../assets/Logo.png" alt="Logo" class="my-logo-image" />
        <div class="text-grey-9 text-h5 text-weight-bold">
          Equipos y tractores del bajio
        </div>
      </q-card-section>
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-bold">Restablecer contraseña</div>
        <div class="text-subtitle2 text-grey-7">
          Ingresa tu nueva contraseña
        </div>
      </q-card-section>

      <q-form @submit.prevent="submit" class="q-gutter-md">
        <q-card-section>
          <q-item>
            <q-item-section>
              <q-item-label>
                <q-input
                  v-model="form.email"
                  label="Correo electrónico"
                  type="email"
                  outlined
                  dense
                  required
                />
              </q-item-label>
              <q-item-label>
                <q-input
                  v-model="form.password"
                  label="Nueva contraseña"
                  type="password"
                  outlined
                  dense
                  required
                />
              </q-item-label>
              <q-item-label>
                <q-input
                  v-model="form.password_confirmation"
                  label="Confirmar contraseña"
                  type="password"
                  outlined
                  dense
                  required
                />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancelar" flat to="/login" />
          <q-btn
            label="Restablecer"
            color="primary"
            type="submit"
            :loading="loading"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { Notify } from "quasar";

const route = useRoute();
const router = useRouter();
const loading = ref(false);

// Form data
const form = ref({
  email: "",
  password: "",
  password_confirmation: "",
  token: "",
});

// Captura el token de la URL al cargar el componente
onMounted(() => {
  form.value.token = route.query.token || "";
  form.value.email = route.query.email || "";
});

const submit = async () => {
  loading.value = true;
  try {
    await axios.post("/api/auth/reset-password", form.value);
    Notify.create({
      type: "positive",
      message:
        "Contraseña restablecida con éxito. Ahora puedes iniciar sesión.",
      icon: "check_circle",
    });
    router.push("/login");
  } catch (error) {
    Notify.create({
      type: "negative",
      message:
        error.response?.data?.message || "Error al restablecer la contraseña",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.my_card {
  width: 400px;
  border-radius: 10px;
}
</style>
