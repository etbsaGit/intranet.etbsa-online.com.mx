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
        title="Configuraciones"
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
        <template v-slot:body-cell-category="props">
          <q-td :props="props">
            <q-item dense>
              <q-item-section>
                <q-item-label caption>
                  {{ props.row.inv_category?.inv_group.name }}
                </q-item-label>
                <q-item-label caption>
                  {{ props.row.inv_category?.status.nombre }}
                </q-item-label>
                <q-item-label>
                  {{ props.row.inv_category?.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
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
      <inv-configuration-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showEdit" mode="edit" @submit="putItem">
    <template #form>
      <inv-configuration-form ref="edit" :invConfiguration="selectedItem" />
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

import BasePagination from "src/bases/BasePagination.vue";
import BaseDialog from "src/bases/BaseDialog.vue";
import InvConfigurationForm from "src/components/InvConfiguration/InvConfigurationForm.vue";

import { formatCurrency } from "src/boot/format";

const crud = useCrudStore();

const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);
const showDelete = ref(false);

const baseURL = ref("/api/intranet/invConfiguration");

const filterForm = ref({
  search: null,
});

const columns = [
  {
    name: "editar",
    align: "left",
    label: "Borrar editar",
    field: "editar",
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
  // {
  //   name: "description",
  //   label: "Descripcion",
  //   align: "left",
  //   field: "description",
  // },
  {
    name: "category",
    label: "Categoria",
    align: "left",
    field: "category",
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
  await crud.getPaginatedItems(baseURL.value + "s", filtersWithPage);
};

const postItem = async () => {
  const data = { ...add.value.formConfiguration };
  await crud.postItem(baseURL.value, data, add.value.validate, () => {
    showAdd.value = false;
    getRows();
  });
};

const putItem = async () => {
  const data = { ...edit.value.formConfiguration };
  await crud.putItem(baseURL.value, data, edit.value.validate, () => {
    showEdit.value = false;
    getRows();
  });
};

const destroyItem = async () => {
  await crud.deleteItem(baseURL.value, selectedItem.value.id, () => {
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

onMounted(() => {
  getRows();
});
</script>
