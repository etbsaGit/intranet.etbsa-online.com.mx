<template>
  <BaseList
    :items="crud.items.analiticas"
    :headers="[
      { label: 'Eliminar', avatar: true, slot: 'delete' },
      { label: 'Editar', avatar: true, slot: 'edit' },
      { label: 'Titulo', key: 'titulo' },
      { label: 'Cliente', key: 'cliente.nombre' },
      { label: 'Estatus', key: 'status', slot: 'status' },
      { label: 'Fecha', key: 'fecha', slot: 'fecha' },
      { label: 'Reporte', key: 'reporte', slot: 'reporte' },
    ]"
    :labelAdd="'Nueva solicitud'"
    :onAdd="openCreate"
  >
    <template #edit="{ item }">
      <q-btn
        dense
        color="blue"
        flat
        icon="edit_square"
        @click="openEdit(item)"
      />
    </template>

    <template #delete="{ item }">
      <q-btn dense color="red" flat icon="delete" @click="openDelete(item)" />
    </template>

    <template #reporte="{ item }">
      <q-btn
        dense
        color="purple"
        flat
        icon="fa-solid fa-file-export"
        @click="openReport(item)"
      />
    </template>

    <template #status="{ item }">
      <q-chip
        :color="getDropdownPropsAut(item.status).color"
        :text-color="getDropdownPropsAut(item.status).textColor"
        :icon="getDropdownPropsAut(item.status).icon"
        :label="getDropdownPropsAut(item.status).label"
      />
    </template>
  </BaseList>

  <BaseDialog v-model="showAdd" mode="create" @submit="postItem">
    <template #form>
      <analitica-form ref="add" :cliente="cliente" />
    </template>
  </BaseDialog>

  <BaseDialog
    v-model="showEdit"
    mode="edit"
    @submit="putItem"
    @close="getRows(cliente.id, currentYear)"
  >
    <template #form>
      <analitica-form ref="edit" :analitica="selectedItem" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showDelete" mode="delete" @submit="destroyItem">
    <template #delete-message>
      ¿Estás seguro que deseas eliminar este elemento?
    </template>
  </BaseDialog>

  <BaseDialog maximized v-model="showReport" mode="show">
    <template #form>
      <analitica-report :id="selectedItem.id" />
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";

const crud = useCrudStore();

import BaseDialog from "src/bases/BaseDialog.vue";
import BaseList from "src/bases/BaseList.vue";
import AnaliticaForm from "src/components/Analitica/AnaliticaForm.vue";
import AnaliticaReport from "src/components/Analitica/AnaliticaReport.vue";

const { cliente } = defineProps(["cliente"]);

const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);
const showDelete = ref(false);
const showReport = ref(false);

const baseURL = ref("/api/intranet/analitica");

const openCreate = () => {
  selectedItem.value = null; // nuevo registro vacío
  showAdd.value = true;
};

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const openDelete = (item) => {
  selectedItem.value = item;
  showDelete.value = true;
};

const openReport = (item) => {
  selectedItem.value = item;
  showReport.value = true;
};

const getRows = async (id) => {
  await crud.getItems(baseURL.value + "/cliente/" + id);
};

const postItem = () => {
  const data = { ...add.value.formAnalitica };
  crud.postItem(baseURL.value, data, add.value.validate, () => {
    showAdd.value = false;
    getRows(cliente.id);
  });
};

const putItem = () => {
  const data = { ...edit.value.formAnalitica };
  crud.putItem(baseURL.value, data, edit.value.validate, () => {
    showEdit.value = false;
    getRows(cliente.id);
  });
};

const destroyItem = () => {
  crud.deleteItem(baseURL.value, selectedItem.value.id, () => {
    selectedItem.value = null;
    showDelete.value = false;
    getRows(cliente.id);
  });
};

function getDropdownPropsAut(validated) {
  if (validated === 0) {
    return {
      color: "red",
      textColor: "white",
      icon: "check_box_outline_blank",
      label: "Rechazado",
    };
  } else if (validated === 1) {
    return {
      color: "green",
      textColor: "white",
      icon: "check_box",
      label: "Autorizada",
    };
  } else {
    return {
      color: "primary",
      textColor: "white",
      icon: "check_box_outline_blank",
      label: "Esperando autorizacion",
    };
  }
}

onMounted(() => {
  getRows(cliente.id);
});
</script>
