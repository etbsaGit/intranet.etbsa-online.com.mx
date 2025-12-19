<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formGroup.name"
          outlined
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

const { invGroup } = defineProps(["invGroup"]);

const myForm = ref(null);

const formGroup = ref({
  id: invGroup ? invGroup.id : null,
  name: invGroup ? invGroup.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formGroup,
  validate,
});
</script>
