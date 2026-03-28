<template>
  <BaseCatalogo title="Condiciones de Pago por Categoría" :columns="columns" url="/api/intranet/product-condicion-pagos"
    :on-create="createItem" :on-update="updateItem" :on-delete="true" @delete="destroyItem">
    <template #create-form>
      <condicion-pago-forms ref="add" />
    </template>

    <template #edit-form="{ item }">
      <condicion-pago-forms ref="edit" :condicion="item" />
    </template>

    <!-- <template #filters-extra="{ filters, onSearchChange }">
      <q-select
        dense
        outlined
        clearable
        emit-value
        map-options
        options-dense
        option-value="id"
        option-label="name"
        style="width: 180px"
        label="Grupo"
        v-model="filters.category_id"
        :options="categorias"
        @update:model-value="onSearchChange"
      />
    </template> -->
  </BaseCatalogo>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";
import { sendRequest } from "src/boot/functions";

import BaseCatalogo from "src/bases/BaseCatalogo.vue";
import CondicionPagoForms from "src/components/Productos/CondicionPago/CondicionPagoForms.vue";

const crudStore = useCrudStore();

const add = ref(null);
const edit = ref(null);

const BASE_URL = "/api/intranet/product-condicion-pago";


const columns = [
  {
    name: "actions",
    align: "left",
    field: "actions",
  },
  {
    name: "name",
    label: "Nombre",
    align: "left",
    field: "name",
  }
];

const createItem = async () => {
  const ok = await add.value.validate();
  if (!ok) return false;

  const data = { ...add.value.formCondicion };
  await crudStore.postItem(BASE_URL, data, add.value.validate);

  return true;
};

const updateItem = async (item) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = { ...edit.value.formCondicion, id: item.id };
  await crudStore.putItem(BASE_URL, data, edit.value.validate);

  return true;
};

const destroyItem = (item) => {
  crudStore.deleteItem(BASE_URL, item.id);
};

</script>
