<template>
  <BaseCatalogo
    title="Parentescos"
    :columns="columns"
    url="/api/intranet/kinships"
    :on-create="createItem"
    :on-update="updateItem"
    @delete="destroyItem"
  >
    <template #create-form>
      <KinshipForm ref="add" />
    </template>

    <template #edit-form="{ item }">
      <KinshipForm ref="edit" :kinship="item" />
    </template>
  </BaseCatalogo>
</template>

<script setup>
import { ref } from "vue";
import { useCrudStore } from "src/stores/crud";

import KinshipForm from "src/components/catalogos/KinshipForm.vue";
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

const BASE_URL = "/api/intranet/kinship"; // singular para post/put/delete

const createItem = async () => {
  const ok = await add.value.validate();
  if (!ok) return false;

  const data = { ...add.value.formKinship };
  await crudStore.postItem(BASE_URL, data, add.value.validate);

  return true;
};

const updateItem = async (item) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = { ...edit.value.formKinship, id: item.id };
  await crudStore.putItem(BASE_URL, data, edit.value.validate);

  return true;
};

const destroyItem = (item) => {
  crudStore.deleteItem(BASE_URL, item.id);
};
</script>
