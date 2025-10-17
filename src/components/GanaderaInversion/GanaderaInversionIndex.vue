<template>
  <q-item class="year-navigator bg-primary">
    <q-btn
      @click="prevYear"
      round
      dense
      flat
      icon="arrow_left"
      class="year-btn"
    />
    <span class="year-display">{{ currentYear }}</span>
    <q-btn
      @click="nextYear"
      round
      dense
      flat
      icon="arrow_right"
      class="year-btn"
    />
  </q-item>
  <BaseList
    :items="crud.items.inverciones"
    :headers="[
      { label: 'Eliminar', avatar: true, slot: 'delete' },
      { label: 'Editar', avatar: true, slot: 'edit' },
      { label: 'Ciclo', key: 'ciclo' },
      { label: '# de Cabezas', key: 'unidades' },
      { label: 'Ganado', key: 'ganado', slot: 'ganado' },
      { label: 'Costo p/ cabeza', key: 'costo', slot: 'costo' },
      { label: 'Total', key: 'total', slot: 'total' },
      { label: 'Cantidad de cabezas para venta', key: 'cantidad' },
      { label: 'Precio p/ kilo', key: 'precio', slot: 'precio' },
      { label: 'Ingreso total', key: 'ingreso', slot: 'ingreso' },
      { label: 'Utilidad del ganado', key: 'utilidad', slot: 'utilidad' },
    ]"
    :labelAdd="'Ingresar inversion ganadera'"
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

    <template #ganado="{ item }">
      {{ item.ganado?.name }}
    </template>

    <template #costo="{ item }">
      {{ formatCurrency(item.costo) }}
    </template>
    <template #total="{ item }">
      {{ formatCurrency(item.total) }}
    </template>
    <template #precio="{ item }">
      {{ formatCurrency(item.precio) }}
    </template>
    <template #ingreso="{ item }">
      {{ formatCurrency(item.ingreso) }}
    </template>
    <template #utilidad="{ item }">
      {{ formatCurrency(item.utilidad) }}
    </template>
  </BaseList>

  <q-separator spaced dark />

  <q-item v-if="crud.items.totales">
    <q-item-section align="right">
      <ganadera-inversion-total-card :datos="crud.items.totales" />
    </q-item-section>
  </q-item>

  <BaseDialog fullWidth v-model="showAdd" mode="create" @submit="postItem">
    <template #form>
      <ganadera-inversion-form ref="add" :cliente="cliente" />
    </template>
  </BaseDialog>

  <BaseDialog fullWidth v-model="showEdit" mode="edit" @submit="putItem">
    <template #form>
      <ganadera-inversion-form ref="edit" :inversion="selectedItem" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showDelete" mode="delete" @submit="destroyItem">
    <template #delete-message>
      ¿Estás seguro que deseas eliminar este elemento?
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useCrudStore } from "src/stores/crud";

const crud = useCrudStore();

import { formatCurrency } from "src/boot/format";
import BaseDialog from "src/bases/BaseDialog.vue";
import BaseList from "src/bases/BaseList.vue";
import GanaderaInversionForm from "src/components/GanaderaInversion/GanaderaInversionForm.vue";
import GanaderaInversionTotalCard from "src/components/GanaderaInversion/GanaderaInversionTotalCard.vue";

const { cliente } = defineProps(["cliente"]);

const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);
const showDelete = ref(false);

const currentYear = ref(new Date().getFullYear());

const prevYear = () => {
  currentYear.value -= 1;
};

const nextYear = () => {
  currentYear.value += 1;
};

const baseURL = ref("/api/intranet/ganaderaInversion");

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

const getRows = async (id, year) => {
  await crud.getItems(baseURL.value + "/cliente/" + id + "/" + year);
};

const postItem = () => {
  const data = { ...add.value.formInversion };
  crud.postItem(baseURL.value, data, add.value.validate, () => {
    showAdd.value = false;
    getRows(cliente.id, currentYear.value);
  });
};

const putItem = () => {
  const data = { ...edit.value.formInversion };
  crud.putItem(baseURL.value, data, edit.value.validate, () => {
    showEdit.value = false;
    getRows(cliente.id, currentYear.value);
  });
};

const destroyItem = () => {
  crud.deleteItem(baseURL.value, selectedItem.value.id, () => {
    selectedItem.value = null;
    showDelete.value = false;
    getRows(cliente.id, currentYear.value);
  });
};

watch(currentYear, (newYear) => {
  getRows(cliente.id, newYear);
});

onMounted(() => {
  getRows(cliente.id, currentYear.value);
});
</script>

<style scoped>
.year-navigator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  padding: 0.8rem 1.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.year-display {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
  min-width: 80px;
  text-align: center;
}

.year-btn {
  background: rgba(255, 255, 255, 0.15) !important;
  color: #fff !important;
  transition: all 0.3s ease;
}

.year-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: scale(1.1);
}
</style>
