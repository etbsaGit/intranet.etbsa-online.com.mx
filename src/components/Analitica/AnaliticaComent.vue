<template>
  <q-form greedy ref="myForm">
    <q-item>
      <q-item-section>
        <q-input
          v-model="formAnaliticaDoc.comentarios"
          filled
          dense
          label="Comentarios"
          type="textarea"
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref } from "vue";

const { doc } = defineProps(["doc"]);

const myForm = ref(null);

const formAnaliticaDoc = ref({
  id: doc ? doc.id : null,
  comentarios: doc ? doc.comentarios : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formAnaliticaDoc,
  validate,
});
</script>
