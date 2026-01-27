<template>
  <BaseCatalogo
    title="Configuraciones"
    :columns="columns"
    url="/api/intranet/invConfigurations"
    :on-create="createItem"
    :on-update="updateItem"
    @delete="destroyItem"
    :on-delete="true"
  >
    <template #create-form>
      <InvConfigurationForm ref="add" />
    </template>

    <template #edit-form="{ item }">
      <InvConfigurationForm ref="edit" :invConfiguration="item" />
    </template>

    <template v-slot:body-cell-category="props">
      <q-td :props="props">
        <q-item dense>
          <q-item-section>
            <q-item-label caption>
              {{ props.row.inv_category?.inv_group.name }}
            </q-item-label>

            <q-item-label>
              {{ props.row.inv_category?.name }}
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

import BaseCatalogo from "src/bases/BaseCatalogo.vue";
import InvConfigurationForm from "src/components/InvConfiguration/InvConfigurationForm.vue";

import { formatCurrency } from "src/boot/format";

const crudStore = useCrudStore();

const add = ref(null);
const edit = ref(null);

const BASE_URL = "/api/intranet/invConfiguration";

const columns = [
  {
    name: "actions",
    align: "left",
    field: "actions",
  },
  {
    name: "code",
    label: "Codigo",
    align: "left",
    field: "code",
  },
  {
    name: "name",
    label: "Nombre",
    align: "left",
    field: "name",
  },
  {
    name: "price",
    label: "Precio $",
    align: "left",
    field: (row) => formatCurrency(row.price),
  },
  {
    name: "category",
    label: "Categoria",
    align: "left",
    field: "category",
  },
];

const createItem = async () => {
  const ok = await add.value.validate();
  if (!ok) return false;

  const data = { ...add.value.formConfiguration };
  await crudStore.postItem(BASE_URL, data, add.value.validate);

  return true;
};

const updateItem = async (item) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = { ...edit.value.formConfiguration, id: item.id };
  await crudStore.putItem(BASE_URL, data, edit.value.validate);

  return true;
};

const destroyItem = (item) => {
  crudStore.deleteItem(BASE_URL, item.id);
};
</script>
