<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formSegmentation.name"
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

const { segmentation } = defineProps(["segmentation"]);

const myForm = ref(null);

const formSegmentation = ref({
  id: segmentation ? segmentation.id : null,
  name: segmentation ? segmentation.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formSegmentation,
  validate,
});
</script>
