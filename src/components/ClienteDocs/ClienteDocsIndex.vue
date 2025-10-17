<template>
  <BaseList
    :items="crud.items"
    :headers="[
      { label: 'Eliminar', avatar: true, slot: 'delete' },
      { label: 'Editar', avatar: true, slot: 'edit' },
      { label: 'check', avatar: true, slot: 'check' },
      { label: 'nombre', key: 'name' },
      { label: 'Tipo', key: 'status.nombre' },
      { label: 'Fecha de caducidad', key: 'expiration_date' },
      { label: 'Ver / Descargar', avatar: true, slot: 'download' },
    ]"
    :rowHighlightFn="
      (item) => (isExpired(item.expiration_date) ? 'text-red' : '')
    "
    :labelAdd="'Agregar documento'"
    :onAdd="checkRole('Credito') ? openCreate : null"
  >
    <!-- Slots personalizados -->
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
      <q-btn
        v-if="item.realpath"
        dense
        color="red"
        flat
        icon="delete"
        @click="openDelete(item)"
      />
    </template>

    <template #download="{ item }">
      <q-btn
        v-if="item.realpath"
        dense
        color="primary"
        flat
        icon="description"
        @click="openWindow(item)"
      />
    </template>

    <template #check="{ item }">
      <q-checkbox
        v-model="item.checked"
        :model-value="!!item.realpath"
        :disable="true"
        :color="item.realpath ? 'green' : 'red'"
        keep-color
      />
    </template>
  </BaseList>

  <BaseDialog v-model="showAdd" mode="create" @submit="postItem">
    <template #form>
      <cliente-docs-form ref="add" :cliente="cliente" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showEdit" mode="edit" @submit="putItem">
    <template #form>
      <cliente-docs-form ref="edit" :doc="selectedItem" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showDelete" mode="delete" @submit="destroyItem">
    <template #delete-message>
      ¿Estás seguro que deseas eliminar este elemento?
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";

const crud = useCrudStore();

import BaseDialog from "src/bases/BaseDialog.vue";
import BaseList from "src/bases/BaseList.vue";
import ClienteDocsForm from "src/components/ClienteDocs/ClienteDocsForm.vue";
import { checkRole } from "src/boot/functions";

const { cliente } = defineProps(["cliente"]);

const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);
const showDelete = ref(false);

const baseURL = ref("/api/intranet/clientesDoc");

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

const getRows = async (id) => {
  await crud.getItems(baseURL.value + "/cliente/" + id);
};

const postItem = () => {
  const data = { ...add.value.formDoc };
  crud.postItem(baseURL.value, data, add.value.validate, () => {
    showAdd.value = false;
    getRows(cliente.id);
  });
};

const putItem = () => {
  const data = { ...edit.value.formDoc };
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

const openWindow = (item) => {
  window.open(item.realpath, "_blank");
};

const isExpired = (date) => {
  const now = new Date();
  return new Date(date) < now;
};

onMounted(() => {
  getRows(cliente.id);
});
</script>

<style scoped>
.text-red {
  color: red !important;
}
</style>
