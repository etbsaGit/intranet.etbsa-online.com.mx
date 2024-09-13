<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formTactic.name"
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

const { tactic } = defineProps(["tactic"]);

const myForm = ref(null);

const formTactic = ref({
  id: tactic ? tactic.id : null,
  name: tactic ? tactic.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formTactic,
  validate,
});
</script>
