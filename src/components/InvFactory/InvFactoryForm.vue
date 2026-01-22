<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formFactory.name"
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

const { invFactory } = defineProps(["invFactory"]);

const myForm = ref(null);

const formFactory = ref({
  id: invFactory ? invFactory.id : null,
  name: invFactory ? invFactory.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formFactory,
  validate,
});
</script>
