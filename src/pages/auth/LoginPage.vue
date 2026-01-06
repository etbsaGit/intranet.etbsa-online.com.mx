<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-sm shadow-2 my_card" bordered>
      <q-card-section class="text-center">
        <q-img src="../../assets/Logo.png" alt="Logo" class="my-logo-image" />
        <div class="text-grey-9 text-h5 text-weight-bold">
          Equipos y tractores del bajio
        </div>
      </q-card-section>

      <q-form @submit.prevent="submitLogin" class="q-gutter-md">
        <q-card-section>
          <q-input
            dense
            outlined
            v-model="form.email"
            label="Email Address"
            type="email"
            required
          />
          <q-input
            dense
            outlined
            class="q-mt-md"
            v-model="form.password"
            type="password"
            label="Password"
            required
          />
        </q-card-section>

        <q-card-section>
          <q-btn
            style="border-radius: 8px"
            color="dark"
            rounded
            size="md"
            label="Sign in"
            no-caps
            class="full-width"
            type="submit"
            :loading="loading"
          />
        </q-card-section>
      </q-form>

      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          Olvidaste tu contraseña?
          <q-btn to="/forgot-password" class="text-dark text-weight-bold" flat>
            Cambiala aqui.
          </q-btn>
        </div>
      </q-card-section>
    </q-card>

    <!-- 2FA Modal -->
    <q-dialog v-model="showTwoFactor">
      <q-card style="min-width: 300px">
        <q-card-section class="text-center">
          <div class="text-h6">Verificación en dos pasos</div>
          <div class="text-caption text-grey">
            Ingresa el código enviado a tu correo
          </div>
        </q-card-section>

        <q-form @submit.prevent="submit2FACode">
          <q-card-section>
            <q-input
              v-model="code"
              label="Código de verificación"
              maxlength="6"
              outlined
              autofocus
              dense
              required
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn
              label="Verificar"
              color="primary"
              :loading="verifying"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "src/stores/auth";

const auth = useAuthStore();

const form = ref({
  email: "",
  password: "",
});

const loading = ref(false);
const verifying = ref(false);
const code = ref("");
const showTwoFactor = ref(false);

const submitLogin = async () => {
  loading.value = true;
  try {
    await auth.login(form.value);
    showTwoFactor.value = auth.isTwoFactorPending;
  } finally {
    loading.value = false;
  }
};

const submit2FACode = async () => {
  verifying.value = true;
  try {
    await auth.verifyTwoFactor(code.value);
    showTwoFactor.value = false;
    code.value = "";
  } finally {
    verifying.value = false;
  }
};
</script>

<style>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
