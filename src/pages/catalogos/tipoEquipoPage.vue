<template>
  <BaseCatalogo
    title="Tipos de equipo"
    :columns="columns"
    url="/api/intranet/tipoEquipos"
    :on-create="createItem"
    :on-update="updateItem"
    @delete="destroyItem"
  >
    <template #create-form>
      <TipoEquipoForm ref="add" />
    </template>

    <template #edit-form="{ item }">
      <TipoEquipoForm ref="edit" :tipoEquipo="item" />
    </template>
  </BaseCatalogo>
</template>

<script setup>
import { ref } from "vue";
import { useCrudStore } from "src/stores/crud";

import TipoEquipoForm from "src/components/catalogos/TipoEquipoForm.vue";
import BaseCatalogo from "src/bases/BaseCatalogo.vue";

const crudStore = useCrudStore();

const add = ref(null);
const edit = ref(null);

const columns = [
  {
    name: "actions",
    label: "",
    field: "actions",
    align: "left",
  },
  {
    name: "name",
    label: "Nombre",
    field: "name",
    align: "left",
  },
];

const BASE_URL = "/api/intranet/tipoEquipo"; // singular para post/put/delete

const createItem = async () => {
  const ok = await add.value.validate();
  if (!ok) return false;

  const data = { ...add.value.formTipoEquipo };
  await crudStore.postItem(BASE_URL, data, add.value.validate);

  return true;
};

const updateItem = async (item) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = { ...edit.value.formTipoEquipo, id: item.id };
  await crudStore.putItem(BASE_URL, data, edit.value.validate);

  return true;
};

const destroyItem = (item) => {
  crudStore.deleteItem(BASE_URL, item.id);
};
</script>
