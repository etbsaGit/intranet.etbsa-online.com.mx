<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formRiego.name"
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

const { riego } = defineProps(["riego"]);

const myForm = ref(null);

const formRiego = ref({
  id: riego ? riego.id : null,
  name: riego ? riego.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formRiego,
  validate,
});
</script>
