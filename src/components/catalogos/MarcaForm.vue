<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formMarca.name"
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

const { marca } = defineProps(["marca"]);

const myForm = ref(null);

const formMarca = ref({
  id: marca ? marca.id : null,
  name: marca ? marca.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formMarca,
  validate,
});
</script>
