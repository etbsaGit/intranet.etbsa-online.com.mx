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
    :items="crud.items"
    :headers="[
      { label: 'Eliminar', avatar: true, slot: 'delete' },
      { label: 'Editar', avatar: true, slot: 'edit' },
      { label: 'Tipo', key: 'tipo' },
      { label: 'Monto mensual', key: 'monto', slot: 'monto' },
      { label: 'Meses efectivos', key: 'months' },
      { label: 'Total ingreso anual bruto', key: 'total', slot: 'total' },
      { label: 'Costos', key: 'costos', slot: 'costos' },
      { label: 'Total ingreso neto', key: 'neto', slot: 'neto' },
      { label: 'Documentos', key: 'docs', slot: 'docs' },
    ]"
    :labelAdd="'Nuevo ingreso'"
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

    <template #monto="{ item }">
      {{ formatCurrency(item.monto) }}
    </template>

    <template #total="{ item }">
      {{ formatCurrency(item.total) }}
    </template>

    <template #costos="{ item }">
      {{ formatCurrency(item.costos) }}
    </template>

    <template #neto="{ item }">
      {{ formatCurrency(item.neto) }}
    </template>

    <template #docs="{ item }">
      <div v-if="item.ingreso_docs">
        <q-btn-dropdown
          v-if="item.ingreso_docs.length"
          dense
          label="Documentos"
          color="primary"
        >
          <q-list dense class="bg-primary" separator>
            <q-item
              v-for="(doc, index) in item.ingreso_docs"
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
      <ingreso-form ref="add" :cliente="cliente" />
    </template>
  </BaseDialog>

  <BaseDialog
    v-model="showEdit"
    mode="edit"
    @submit="putItem"
    @close="getRows(cliente.id, currentYear)"
  >
    <template #form>
      <ingreso-form ref="edit" :ingreso="selectedItem" />
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
import { formatCurrency } from "src/boot/format";
import { useCrudStore } from "src/stores/crud";

const crud = useCrudStore();

import BaseDialog from "src/bases/BaseDialog.vue";
import BaseList from "src/bases/BaseList.vue";
import IngresoForm from "src/components/Ingreso/IngresoForm.vue";

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

const baseURL = ref("/api/intranet/ingreso");

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
  const data = { ...add.value.formIngreso };
  crud.postItem(baseURL.value, data, add.value.validate, () => {
    showAdd.value = false;
    getRows(cliente.id, currentYear.value);
  });
};

const putItem = () => {
  const data = { ...edit.value.formIngreso };
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

const openFile = (url) => {
  window.open(url, "_blank");
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
