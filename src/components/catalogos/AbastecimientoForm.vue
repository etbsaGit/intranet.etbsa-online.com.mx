<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formAbastecimiento.name"
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

const { abastecimiento } = defineProps(["abastecimiento"]);

const myForm = ref(null);

const formAbastecimiento = ref({
  id: abastecimiento ? abastecimiento.id : null,
  name: abastecimiento ? abastecimiento.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formAbastecimiento,
  validate,
});
</script>
