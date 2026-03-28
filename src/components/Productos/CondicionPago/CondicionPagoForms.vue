<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input v-model="formCondicion.name" outlined dense label="Nombre" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { condicion } = defineProps(["condicion"]);

const myForm = ref(null);


const formCondicion = ref({
  id: condicion ? condicion.id : null,
  name: condicion ? condicion.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formCondicion,
  validate,
});
</script>

<style>
  .three-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px 16px; /* filas / columnas */
}
</style>
