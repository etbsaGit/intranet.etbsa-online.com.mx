<template>
  <BaseCatalogo
    title="Sub Categorías"
    :columns="columns"
    url="/api/intranet/product-subcategoriums"
    :on-create="createItem"
    :on-update="updateItem"
    :on-delete="true"
    @delete="destroyItem"
    :initialFilters="{ category_id: null }"
  >
    <template #create-form>
      <sub-categorias-form ref="add" />
    </template>

    <template #edit-form="{ item }">
      <sub-categorias-form ref="edit" :subcat="item" />
    </template>

    <template #filters-extra="{ filters, onSearchChange }">
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
    </template>
  </BaseCatalogo>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";
import { sendRequest } from "src/boot/functions";

import BaseCatalogo from "src/bases/BaseCatalogo.vue";
import SubCategoriasForm from "src/components/Productos/Categorias/SubCategoriasForm.vue";

const crudStore = useCrudStore();

const add = ref(null);
const edit = ref(null);

const BASE_URL = "/api/intranet/product-subcategorium";

const categorias = ref([]);
const estatus = ref([]);

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
  },
  {
    name: "categoria",
    label: "Categoria",
    align: "left",
    field: (row) => row.categoria?.name,
  },
];

const createItem = async () => {
  const ok = await add.value.validate();
  if (!ok) return false;

  const data = { ...add.value.formSubCat };
  await crudStore.postItem(BASE_URL, data, add.value.validate);

  return true;
};

const updateItem = async (item) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = { ...edit.value.formSubCat, id: item.id };
  await crudStore.putItem(BASE_URL, data, edit.value.validate);

  return true;
};

const destroyItem = (item) => {
  crudStore.deleteItem(BASE_URL, item.id);
};

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/product-subcategorium/options",
    ""
  );
  categorias.value = res.categorias;

};

onMounted(() => {
  getOptions();
});
</script>
