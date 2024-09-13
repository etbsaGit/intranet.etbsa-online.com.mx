<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formKinship.name"
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

const { kinship } = defineProps(["kinship"]);

const myForm = ref(null);

const formKinship = ref({
  id: kinship ? kinship.id : null,
  name: kinship ? kinship.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formKinship,
  validate,
});
</script>
