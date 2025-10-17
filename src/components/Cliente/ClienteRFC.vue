<template>
  <q-form greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="rfc"
          filled
          dense
          label="RFC"
          lazy-rules
          hint
          :rules="[
            (val) => !!val || 'Este campo es obligatorio',
            (val) =>
              (val && val.length >= 12 && val.length <= 13) ||
              'El RFC debe tener entre 12 y 13 caracteres',
          ]"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { useCrudStore } from "src/stores/crud";

const rfc = ref(null);

defineExpose({
  rfc,
});
</script>
