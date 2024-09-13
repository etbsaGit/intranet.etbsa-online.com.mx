<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formTipoCultivo.name"
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

const { tipoCultivo } = defineProps(["tipoCultivo"]);

const myForm = ref(null);

const formTipoCultivo = ref({
  id: tipoCultivo ? tipoCultivo.id : null,
  name: tipoCultivo ? tipoCultivo.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formTipoCultivo,
  validate,
});
</script>
