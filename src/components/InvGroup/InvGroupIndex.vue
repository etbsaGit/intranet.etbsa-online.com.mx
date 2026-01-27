<template>
  <BaseCatalogo
    title="Grupos"
    :columns="columns"
    url="/api/intranet/invGroups"
    :on-create="createItem"
    :on-update="updateItem"
    @delete="destroyItem"
    :on-delete="true"
  >
    <template #create-form>
      <InvGroupForm ref="add" />
    </template>

    <template #edit-form="{ item }">
      <InvGroupForm ref="edit" :invGroup="item" />
    </template>
  </BaseCatalogo>
</template>

<script setup>
import { ref } from "vue";
import { useCrudStore } from "src/stores/crud";

import BaseCatalogo from "src/bases/BaseCatalogo.vue";
import InvGroupForm from "src/components/InvGroup/InvGroupForm.vue";

const crudStore = useCrudStore();

const add = ref(null);
const edit = ref(null);

const BASE_URL = "/api/intranet/invGroup";

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
];

const createItem = async () => {
  const ok = await add.value.validate();
  if (!ok) return false;

  const data = { ...add.value.formGroup };
  await crudStore.postItem(BASE_URL, data, add.value.validate);

  return true;
};

const updateItem = async (item) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = { ...edit.value.formGroup, id: item.id };
  await crudStore.putItem(BASE_URL, data, edit.value.validate);

  return true;
};

const destroyItem = (item) => {
  crudStore.deleteItem(BASE_URL, item.id);
};
</script>
