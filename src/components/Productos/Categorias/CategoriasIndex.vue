<template>

  <BaseCatalogo title="Categorías" :columns="columns" url="/api/intranet/product-categoriums" :on-create="createItem"
    :on-update="updateItem" :on-delete="true" @delete="destroyItem" :initialFilters="{}">
    <template #create-form>
      <CategoriasForm ref="add" />
    </template>

    <template #edit-form="{item}">
      <CategoriasForm ref="edit" :categoria="item"/>
    </template>

  </BaseCatalogo>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";
import { sendRequest } from "src/boot/functions";

import BaseCatalogo from "src/bases/BaseCatalogo.vue";
import CategoriasForm from "src/components/Productos/Categorias/CategoriasForm.vue";

const crudStore = useCrudStore();
const add = ref(null);
const edit = ref(null);

const BASE_URL = "/api/intranet/product-categorium"

const columns = [
  {
    name: "actions",
    align: "left",
    field: "actions"
  },
  {
    name: "name",
    label: "Nombre",
    align: "left",
    field: "name"
  },
];

// funciones
const createItem = async () => {
  const ok = await add.value.validate();
  if(!ok) return false;

  const data = {...add.value.formCategoria};
  await crudStore.postItem(BASE_URL,data,add.value.validate);

  return true;
}

const updateItem = async (item) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = { ...edit.value.formCategoria, id: item.id };
  await crudStore.putItem(BASE_URL, data, edit.value.validate);

  return true;
};

const destroyItem = (item) => {
  crudStore.deleteItem(BASE_URL, item.id);
};


</script>
