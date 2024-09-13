<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formClassConst.name"
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

const { classConst } = defineProps(["classConst"]);

const myForm = ref(null);

const formClassConst = ref({
  id: classConst ? classConst.id : null,
  name: classConst ? classConst.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formClassConst,
  validate,
});
</script>
