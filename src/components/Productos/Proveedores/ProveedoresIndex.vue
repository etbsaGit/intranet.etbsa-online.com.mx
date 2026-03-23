<template>
  <BaseCatalogo title="Proveedores" :columns="columns" url="/api/intranet/product-suppliers" :on-create="createItem"
    :on-update="updateItem" :on-delete="true" @delete="destroyItem" :initialFilters="{}">
    <template #create-form>
      <ProveedoresForm ref="add" />
    </template>

    <template #edit-form="{item}">
      <ProveedoresForm ref="edit" :proveedor="item"/>
    </template>

  </BaseCatalogo>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";
import { sendRequest } from "src/boot/functions";

import BaseCatalogo from "src/bases/BaseCatalogo.vue";
import ProveedoresForm from "src/components/Productos/Proveedores/ProveedoresForm.vue";

const crudStore = useCrudStore();
const add = ref(null);
const edit = ref(null);

const BASE_URL = "/api/intranet/product-supplier"

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

  const data = {...add.value.formProveedor};
  await crudStore.postItem(BASE_URL,data,add.value.validate);

  return true;
}

const updateItem = async (item) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = { ...edit.value.formProveedor, id: item.id };
  await crudStore.putItem(BASE_URL, data, edit.value.validate);

  return true;
};

const destroyItem = (item) => {
  crudStore.deleteItem(BASE_URL, item.id);
};


</script>
