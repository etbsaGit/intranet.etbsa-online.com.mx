<template>
  <BaseCatalogo
    title="Capacidad Tecnologica"
    :columns="columns"
    url="/api/intranet/technologicalCapabilities"
    :on-create="createItem"
    :on-update="updateItem"
    @delete="destroyItem"
  >
    <template #create-form>
      <CapTecForm ref="add" />
    </template>

    <template #edit-form="{ item }">
      <CapTecForm ref="edit" :ganado="item" />
    </template>

    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        <q-item dense>
          <q-item-section>
            <q-item-label>
              {{ props.row.name }}
            </q-item-label>
            <q-item-label caption>
              {{ props.row.level }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-td>
    </template>
  </BaseCatalogo>
</template>

<script setup>
import { ref } from "vue";
import { useCrudStore } from "src/stores/crud";

import CapTecForm from "src/components/catalogos/CapTecForm.vue";
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

const BASE_URL = "/api/intranet/technologicalCapability"; // singular para post/put/delete

const createItem = async () => {
  const ok = await add.value.validate();
  if (!ok) return false;

  const data = { ...add.value.formCapTec };
  await crudStore.postItem(BASE_URL, data, add.value.validate);

  return true;
};

const updateItem = async (item) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = { ...edit.value.formCapTec, id: item.id };
  await crudStore.putItem(BASE_URL, data, edit.value.validate);

  return true;
};

const destroyItem = (item) => {
  crudStore.deleteItem(BASE_URL, item.id);
};
</script>
