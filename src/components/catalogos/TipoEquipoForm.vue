<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formTipoEquipo.name"
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

const { tipoEquipo } = defineProps(["tipoEquipo"]);

const myForm = ref(null);

const formTipoEquipo = ref({
  id: tipoEquipo ? tipoEquipo.id : null,
  name: tipoEquipo ? tipoEquipo.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formTipoEquipo,
  validate,
});
</script>
