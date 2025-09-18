<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formGanado.name"
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

const { ganado } = defineProps(["ganado"]);

const myForm = ref(null);

const formGanado = ref({
  id: ganado ? ganado.id : null,
  name: ganado ? ganado.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formGanado,
  validate,
});
</script>
