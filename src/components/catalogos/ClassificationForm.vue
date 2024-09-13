<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formClassification.name"
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

const { classification } = defineProps(["classification"]);

const myForm = ref(null);

const formClassification = ref({
  id: classification ? classification.id : null,
  name: classification ? classification.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formClassification,
  validate,
});
</script>
