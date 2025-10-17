<template>
  <BaseList
    :items="crud.items"
    :headers="[
      { label: 'Eliminar', avatar: true, slot: 'delete' },
      { label: 'Editar', avatar: true, slot: 'edit' },
      { label: 'Nombre', key: 'nombre' },
      { label: '# de superficie', key: 'descripcion', slot: 'descripcion' },
      { label: 'Tipo', key: 'estatus', slot: 'estatus' },
      { label: 'Valor', key: 'valor', slot: 'valor' },
      { label: 'Costo', key: 'costo', slot: 'costo' },
      { label: 'Documentos', key: 'docs', slot: 'docs' },
    ]"
    :labelAdd="'Nueva finca'"
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

    <template #costo="{ item }">
      {{ formatCurrency(item.costo) }}
    </template>
    <template #valor="{ item }">
      {{ formatCurrency(item.valor) }}
    </template>
    <template #estatus="{ item }">
      {{ item.estatus?.nombre }}
    </template>
    <template #docs="{ item }">
      <div v-if="item.finca_docs">
        <q-btn-dropdown
          v-if="item.finca_docs.length"
          dense
          label="Documentos"
          color="primary"
        >
          <q-list dense class="bg-primary" separator>
            <q-item
              v-for="(doc, index) in item.finca_docs"
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
    </template>
  </BaseList>

  <BaseDialog v-model="showAdd" mode="create" @submit="postItem">
    <template #form>
      <finca-form ref="add" :cliente="cliente" />
    </template>
  </BaseDialog>

  <BaseDialog
    v-model="showEdit"
    mode="edit"
    @submit="putItem"
    @close="getRows(cliente.id, currentYear)"
  >
    <template #form>
      <finca-form ref="edit" :finca="selectedItem" />
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
import { formatPhoneNumber, formatCurrency } from "src/boot/format.js";
import { useCrudStore } from "src/stores/crud";

const crud = useCrudStore();

import BaseDialog from "src/bases/BaseDialog.vue";
import BaseList from "src/bases/BaseList.vue";
import FincaForm from "src/components/Finca/FincaForm.vue";

const { cliente } = defineProps(["cliente"]);

const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);
const showDelete = ref(false);

const baseURL = ref("/api/intranet/finca");

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
  const data = { ...add.value.formFinca };
  crud.postItem(baseURL.value, data, add.value.validate, () => {
    showAdd.value = false;
    getRows(cliente.id);
  });
};

const putItem = () => {
  const data = { ...edit.value.formFinca };
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

const openFile = (url) => {
  window.open(url, "_blank");
};

onMounted(() => {
  getRows(cliente.id);
});
</script>
