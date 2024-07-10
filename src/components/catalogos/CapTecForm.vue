<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formCapTec.name"
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

const { CapTec } = defineProps(["CapTec"]);

const myForm = ref(null);

const formCapTec = ref({
  id: CapTec ? CapTec.id : null,
  name: CapTec ? CapTec.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formCapTec,
  validate,
});
</script>
