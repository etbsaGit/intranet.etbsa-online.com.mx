<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input v-model="formProveedor.name" outlined dense label="Nombre" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />
      </q-item-section>

    </q-item>
  </q-form>
</template>

<script setup>
import { watch } from "vue";
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const props = defineProps({
  proveedor: Object,
});

const myForm = ref(null);

const formProveedor = ref({
  id: null,
  name: null,
});

const validate = async () => {
  return await myForm.value.validate();
}

watch(
  () => props.proveedor,
  (newVal) => {
    formProveedor.value = {
      id: newVal?.id ?? null,
      name: newVal?.name ?? null,
    };
  },
  { immediate: true }
);

defineExpose({
  formProveedor,
  validate,
});
</script>
