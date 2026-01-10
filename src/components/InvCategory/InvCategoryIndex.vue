<template>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        dense
        label="Buscar por nombre"
        v-model="filterForm.search"
        @update:model-value="onInputChange"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-item-section>

    <q-item-section>
      <q-select
        v-model="filterForm.inv_group_id"
        :options="invGroups"
        label="Grupo"
        option-value="id"
        option-label="name"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        outlined
        dense
        clearable
        @update:model-value="onInputChange"
      />
    </q-item-section>
    <q-item-section side>
      <q-btn
        label="Agregar"
        icon="fa-solid fa-plus"
        dense
        color="blue"
        @click="showAdd = true"
      />
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Categorias"
        :rows="crud.paginatedItems"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-editar="props">
          <q-td :props="props">
            <q-btn
              dense
              flat
              color="negative"
              icon="fa-solid fa-trash"
              @click="openDelete(props.row)"
            />
            <q-btn
              dense
              flat
              color="green"
              icon="fa-solid fa-pen-to-square"
              @click="openEdit(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:bottom>
          <BasePagination
            :pagination="crud.pagination"
            @update:currentPage="(val) => (crud.pagination.currentPage = val)"
          />
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <BaseDialog v-model="showAdd" mode="create" @submit="postItem">
    <template #form>
      <inv-category-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showEdit" mode="edit" @submit="putItem">
    <template #form>
      <inv-category-form ref="edit" :invCategory="selectedItem" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showDelete" mode="delete" @submit="destroyItem">
    <template #delete-message>
      ¿Estás seguro que deseas eliminar este elemento?
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, onMounted, watch, h } from "vue";
import { useCrudStore } from "src/stores/crud";
import { sendRequest } from "src/boot/functions";

import BasePagination from "src/bases/BasePagination.vue";
import BaseDialog from "src/bases/BaseDialog.vue";
import InvCategoryForm from "src/components/InvCategory/InvCategoryForm.vue";

const crud = useCrudStore();

const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);
const showDelete = ref(false);

const baseURL = ref("/api/intranet/invCategor");

const current_page = ref(1);

const invGroups = ref([]);
const estatus = ref([]);

const filterForm = ref({
  search: null,
  inv_group_id: null,
});

const columns = [
  {
    name: "editar",
    align: "left",
    label: "Borrar editar",
    field: "editar",
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

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const openDelete = (item) => {
  selectedItem.value = item;
  showDelete.value = true;
};

const getRows = async () => {
  const filtersWithPage = {
    ...filterForm.value,
    page: crud.pagination.currentPage,
  };
  await crud.getPaginatedItems(baseURL.value + "ies", filtersWithPage);
};

const postItem = async () => {
  const data = { ...add.value.formCategory };
  await crud.postItem(baseURL.value + "y", data, add.value.validate, (res) => {
    showAdd.value = false;
    getRows();
  });
};
const putItem = async () => {
  const data = { ...edit.value.formCategory };
  await crud.putItem(baseURL.value + "y", data, edit.value.validate, () => {
    showEdit.value = false;
    getRows();
  });
};

const destroyItem = async () => {
  await crud.deleteItem(baseURL.value + "y", selectedItem.value.id, () => {
    selectedItem.value = null;
    showDelete.value = false;
    getRows();
  });
};

watch(
  () => crud.pagination.currentPage,
  () => {
    getRows();
  }
);

let timeout = null;

const onInputChange = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    getRows();
  }, 1000);
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
  getRows();
  getOptions();
});
</script>
