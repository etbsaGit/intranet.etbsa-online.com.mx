<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formCultivo.name"
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

const { cultivo } = defineProps(["cultivo"]);

const myForm = ref(null);

const formCultivo = ref({
  id: cultivo ? cultivo.id : null,
  name: cultivo ? cultivo.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formCultivo,
  validate,
});
</script>
