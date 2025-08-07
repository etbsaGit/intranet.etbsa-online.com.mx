<template>
  <q-item>
    <q-btn
      dense
      label="Nueva Capacidad Tecnologica"
      color="primary"
      @click="openCreate"
      icon="add_circle"
    />
  </q-item>
  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Capacidad Tecnologica"
        :rows="crudStore.items"
        :columns="columns"
        row-key="name"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-name="props">
          <q-td>
            <q-item dense>
              <q-item-section avatar>
                <q-btn
                  dense
                  color="red"
                  flat
                  icon="delete"
                  @click="openDelete(props.row)"
                />
              </q-item-section>
              <q-item-section avatar>
                <q-btn
                  dense
                  color="blue"
                  flat
                  icon="edit_square"
                  @click="openEdit(props.row)"
                />
              </q-item-section>
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
      </q-table>
    </q-item-section>
  </q-item>

  <BaseDialog v-model="showAdd" mode="create" @submit="postItem">
    <template #form>
      <cap-tec-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showEdit" mode="edit" @submit="putItem">
    <template #form>
      <cap-tec-form ref="edit" :CapTec="selectedItem" />
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

const crudStore = useCrudStore();

import BaseDialog from "src/bases/BaseDialog.vue";
import CapTecForm from "src/components/catalogos/CapTecForm.vue";

const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);
const showDelete = ref(false);

const baseURL = ref("/api/intranet/technological-capability");

const columns = [
  {
    name: "name",
    align: "left",
    field: "name",
  },
];

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

const getRows = async () => {
  await crudStore.getItems(baseURL.value);
};

const postItem = () => {
  const data = { ...add.value.formCapTec };
  crudStore.postItem(baseURL.value, data, add.value.validate, () => {
    showAdd.value = false;
    getRows();
  });
};

const putItem = () => {
  const data = { ...edit.value.formCapTec };
  crudStore.putItem(baseURL.value, data, edit.value.validate, () => {
    showEdit.value = false;
    getRows();
  });
};

const destroyItem = () => {
  crudStore.deleteItem(baseURL.value, selectedItem.value.id, () => {
    selectedItem.value = null;
    showDelete.value = false;
    getRows();
  });
};

onMounted(() => {
  getRows();
});
</script>
