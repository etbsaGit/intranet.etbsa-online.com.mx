<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formNuevaTecnologia.cantidad"
          filled
          dense
          label="Cantidad"
          lazy-rules
          hint
          mask="#####"
          reverse-fill-mask
          unmasked-value
          :rules="[(val) => (val !== null && val !== '') || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formNuevaTecnologia.hectareas"
          filled
          dense
          label="Hectareas"
          lazy-rules
          hint
          mask="#####"
          reverse-fill-mask
          unmasked-value
          :rules="[(val) => (val !== null && val !== '') || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formNuevaTecnologia.nueva_tecnologia_id"
          :options="tecnologias"
          label="Tecnologia"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { nuevaTecnologia, cliente } = defineProps([
  "nuevaTecnologia",
  "cliente",
]);

const tecnologias = ref([]);

const myForm = ref(null);

const formNuevaTecnologia = ref({
  id: nuevaTecnologia ? nuevaTecnologia.id : null,
  cantidad: nuevaTecnologia ? nuevaTecnologia.cantidad : null,
  hectareas: nuevaTecnologia ? nuevaTecnologia.hectareas : null,
  nueva_tecnologia_id: nuevaTecnologia
    ? nuevaTecnologia.nueva_tecnologia_id
    : null,
  cliente_id: nuevaTecnologia ? nuevaTecnologia.cliente_id : cliente.id,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/nuevaTecnologia", "");
  tecnologias.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formNuevaTecnologia,
  validate,
});
</script>
|
