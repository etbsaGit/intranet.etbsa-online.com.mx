<template>
  <BaseCatalogo
    title="Modelos"
    :columns="columns"
    url="/api/intranet/invModels"
    :on-create="createItem"
    :on-update="updateItem"
    @delete="destroyItem"
    :on-delete="true"
    Maximized
  >
    <template #create-form>
      <InvModelForm ref="add" />
    </template>

    <template #edit-form="{ item }">
      <InvModelForm ref="edit" :invModel="item" />
    </template>

    <template #filters-extra="{}">
      <q-btn
        dense
        color="green"
        @click="getReportExcel"
        icon="fa-solid fa-file-arrow-down"
      />
    </template>

    <template v-slot:body-cell-doc="props">
      <q-td :props="props">
        <q-btn
          v-if="props.row.realpath"
          dense
          color="primary"
          flat
          icon="description"
          @click="openWindow(props.row)"
        />
      </q-td>
    </template>
  </BaseCatalogo>
</template>

<script setup>
import { ref } from "vue";
import { useCrudStore } from "src/stores/crud";
import { sendRequest } from "src/boot/functions";

import InvModelForm from "src/components/InvModel/InvModelForm.vue";
import BaseCatalogo from "src/bases/BaseCatalogo.vue";

import { formatCurrency } from "src/boot/format";

const crudStore = useCrudStore();

const add = ref(null);
const edit = ref(null);

const BASE_URL = "/api/intranet/invModel";

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
    name: "clas_equipo",
    label: "Clasificacion de equipo",
    align: "left",
    field: (row) => row.clas_equipo?.name,
  },
  {
    name: "tipo_equipo",
    label: "Tipo de equipo",
    align: "left",
    field: (row) => row.tipo_equipo?.name,
  },
  {
    name: "price",
    label: "Precio $",
    align: "left",
    field: (row) => formatCurrency(row.price),
  },
  {
    name: "doc",
    label: "Documento",
    align: "left",
    field: "doc",
  },
];

const createItem = async () => {
  const ok = await add.value.validate();
  if (!ok) return false;

  const data = { ...add.value.formModel };
  await crudStore.postItem(BASE_URL, data, add.value.validate);

  return true;
};

const updateItem = async (model) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = { ...edit.value.formModel, id: model.id };
  await crudStore.putItem(BASE_URL, data, edit.value.validate);

  return true;
};

const destroyItem = (item) => {
  crudStore.deleteItem(BASE_URL, item.id);
};

const openWindow = (item) => {
  window.open(item.realpath, "_blank");
};

const getReportExcel = async () => {
  const res = await sendRequest(
    "GET",
    null,
    "/api/intranet/invModel/report",
    ""
  );
  const base64Response = await fetch(
    `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.file_base64}`
  );
  const blob = await base64Response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = res.file_name;
  link.click();
  URL.revokeObjectURL(url);
};
</script>
