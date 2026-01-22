<template>
  <BaseCatalogo
    title="Inventario maquinaria"
    :columns="columns"
    url="/api/intranet/invItems"
    :on-create="createItem"
    :on-update="updateItem"
    :onDelete="false"
    Maximized
    :initialFilters="{ shipping_status: null }"
  >
    <template #create-form>
      <InvItemForm ref="add" />
    </template>

    <template #edit-form="{ item }">
      <InvItemForm ref="edit" :invItem="item" />
    </template>

    <template #filters-extra="{ filters, onSearchChange }">
      <q-select
        dense
        outlined
        emit-value
        map-options
        options-dense
        option-value="id"
        option-label="name"
        style="width: 180px"
        label="Disponiblidad"
        v-model="filters.shipping_status"
        :options="[
          { id: null, name: 'En camino' },
          { id: 0, name: 'En sucursal' },
          { id: 1, name: 'Vendido' },
        ]"
        @update:model-value="onSearchChange"
      />
    </template>

    <template v-slot:body-cell-inv_item_docs="props">
      <q-td :props="props">
        <div v-if="props.row.inv_item_docs">
          <q-btn-dropdown
            v-if="props.row.inv_item_docs.length"
            dense
            label="Documentos"
            color="black"
            outline
          >
            <q-list dense class="bg-primary" separator>
              <q-item
                v-for="(doc, index) in props.row.inv_item_docs"
                :key="index"
                clickable
                @click="openFile(doc.realpath)"
              >
                <q-item-section>
                  <q-item-label class="text-white">
                    <q-icon name="fa-solid fa-file-arrow-down" size="xs" />
                    {{ doc.name }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-td>
    </template>
  </BaseCatalogo>
</template>

<script setup>
import { ref } from "vue";
import { useCrudStore } from "src/stores/crud";

import InvItemForm from "src/components/InvItem/InvItemForm.vue";
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
    name: "rd",
    label: "RD",
    field: "rd",
    align: "left",
  },
  {
    name: "s_n",
    label: "# de serie",
    field: "s_n",
    align: "left",
  },
  {
    name: "inv_model",
    label: "Modelo",
    align: "left",
    field: (row) => row.inv_model?.name,
  },
  {
    name: "tipo_equipo",
    label: "Tipo de equipo",
    align: "left",
    field: (row) => row.tipo_equipo?.name,
  },
  {
    name: "shipping_status",
    label: "Disponibilidad",
    align: "left",
    field: (row) => {
      if (row.shipping_status === null) return "En camino";
      if (row.shipping_status === 0) return "En sucursal";
      if (row.shipping_status === 1) return "Vendido";
      return "Desconocido"; // por si llega otro valor
    },
  },
  {
    name: "inv_item_docs",
    label: "Documentos",
    align: "left",
    field: "inv_item_docs",
  },
];

const BASE_URL = "/api/intranet/invItem";

const createItem = async () => {
  const ok = await add.value.validate();
  if (!ok) return false;

  const data = { ...add.value.formItem };
  await crudStore.postItem(BASE_URL, data, add.value.validate);

  return true;
};

const updateItem = async (item) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = { ...edit.value.formItem, id: item.id };
  await crudStore.putItem(BASE_URL, data, edit.value.validate);

  return true;
};

const openFile = (url) => {
  window.open(url, "_blank");
};

const destroyItem = (item) => {
  crudStore.deleteItem(BASE_URL, item.id);
};
</script>
