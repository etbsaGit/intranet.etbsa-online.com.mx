<template>
  <BaseCatalogo
    title="Categorias"
    :columns="columns"
    url="/api/intranet/invCategories"
    :on-create="createItem"
    :on-update="updateItem"
    :on-delete="true"
    @delete="destroyItem"
    :initialFilters="{ inv_group_id: null }"
  >
    <template #create-form>
      <InvCategoryForm ref="add" />
    </template>

    <template #edit-form="{ item }">
      <InvCategoryForm ref="edit" :invCategory="item" />
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
        v-model="filters.inv_group_id"
        :options="invGroups"
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
import InvCategoryForm from "src/components/InvCategory/InvCategoryForm.vue";

const crudStore = useCrudStore();

const add = ref(null);
const edit = ref(null);

const BASE_URL = "/api/intranet/invCategory";

const invGroups = ref([]);
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
    name: "group",
    label: "Grupo",
    align: "left",
    field: (row) => row.inv_group?.name,
  },
];

const createItem = async () => {
  const ok = await add.value.validate();
  if (!ok) return false;

  const data = { ...add.value.formCategory };
  await crudStore.postItem(BASE_URL, data, add.value.validate);

  return true;
};

const updateItem = async (item) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = { ...edit.value.formCategory, id: item.id };
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
    "/api/intranet/invCategory/forms",
    ""
  );
  invGroups.value = res.invGroups;
  estatus.value = res.estatus;
};

onMounted(() => {
  getOptions();
});
</script>
