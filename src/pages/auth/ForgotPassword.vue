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
        <div class="text-h6 text-weight-bold">Recuperar contraseña</div>
        <div class="text-subtitle2 text-grey-7">
          Ingresa tu correo para recibir el enlace de recuperación
        </div>
      </q-card-section>

      <q-form @submit.prevent="submitEmail" class="q-gutter-md">
        <q-card-section>
          <q-input
            v-model="email"
            label="Correo electrónico"
            type="email"
            outlined
            dense
            required
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancelar" flat to="/login" />
          <q-btn
            label="Enviar enlace"
            color="primary"
            :loading="loading"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";

const email = ref("");
const loading = ref(false);

const submitEmail = async () => {
  loading.value = true;
  try {
    await axios.post("/api/auth/forgot-password", { email: email.value });
    Notify.create({
      type: "positive",
      message: "Se ha enviado el enlace a tu correo electrónico.",
      icon: "email",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error.response?.data?.message || "Error al enviar el correo",
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
