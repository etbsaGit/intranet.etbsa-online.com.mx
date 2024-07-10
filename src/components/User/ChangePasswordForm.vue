<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formUser.old_password"
          filled
          dense
          label="Contraseña vieja"
          lazy-rules
          type="password"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formUser.password"
          filled
          dense
          label="Contraseña nueva"
          lazy-rules
          type="password"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formUser.password_confirmation"
          filled
          dense
          label="Confirmar contraseña nueva"
          lazy-rules
          type="password"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const myForm = ref(null);

const formUser = ref({
  old_password: null,
  password: null,
  password_confirmation: null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formUser,
  validate,
});
</script>
