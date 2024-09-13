<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formClasEquipo.name"
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

const { clasEquipo } = defineProps(["clasEquipo"]);

const myForm = ref(null);

const formClasEquipo = ref({
  id: clasEquipo ? clasEquipo.id : null,
  name: clasEquipo ? clasEquipo.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formClasEquipo,
  validate,
});
</script>
