<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input v-model="formCategoria.name" outlined dense label="Nombre" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />
      </q-item-section>

    </q-item>
  </q-form>
</template>

<script setup>
import { watch } from "vue";
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { categoria } = defineProps(["categoria"]);

const myForm = ref(null);

const formCategoria = ref({
  id: categoria ? categoria.id : null,
  name: categoria ? categoria.name : null,
});

const validate = async () => {
  return await myForm.value.validate();
}

defineExpose({
  formCategoria,
  validate,
});
</script>
