<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input v-model="formCategoria.name" outlined dense label="Nombre" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />
      </q-item-section>
    </q-item>
    <!-- categoria con checkboxes -->
        <q-item>
          <q-item-section>
            <div class="text-subtitle2 q-mb-sm">Condicones de Pago</div>

            <q-option-group v-model="formCategoria.condicion_ids" :options="condiciones" type="checkbox"
              class="two-columns" />
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

const condiciones = ref([]);

const formCategoria = ref({
  id: categoria ? categoria.id : null,
  name: categoria ? categoria.name : null,
  condicion_ids: categoria ? categoria.condiciones_pago?.map(cat => cat.id) || [] : [],
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/product-condicion-pago/options",
  );
  condiciones.value = res.condiciones.map(cat => ({
    label: cat.name,
    value: cat.id
  }));
};

const validate = async () => {
  return await myForm.value.validate();
}

onMounted(() => {
  getOptions();
});

defineExpose({
  formCategoria,
  validate,
});
</script>

<style>
  .two-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px; /* filas / columnas */
}
</style>
