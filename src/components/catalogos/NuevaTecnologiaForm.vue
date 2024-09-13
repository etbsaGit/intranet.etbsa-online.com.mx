<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formNuevaTecnologia.name"
          filled
          dense
          label="Nombre"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { nuevaTecnologia } = defineProps(["nuevaTecnologia"]);

const myForm = ref(null);

const formNuevaTecnologia = ref({
  id: nuevaTecnologia ? nuevaTecnologia.id : null,
  name: nuevaTecnologia ? nuevaTecnologia.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formNuevaTecnologia,
  validate,
});
</script>
