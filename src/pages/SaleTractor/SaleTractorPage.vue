<template>
  <q-item class="custom-item" align="center">
    <q-item-section>
      <q-item-label class="custom-label">-Pedidos Tractores-</q-item-label>
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        :rows="crud.paginatedItems"
        :columns="columns"
        row-key="id"
        :dense="$q.screen.lt.md"
        :rows-per-page-options="[0]"
      >
        <template v-slot:top-left>
          <q-item>
            <q-item-section>
              <q-btn
                dense
                outline
                label="Agregar pedido"
                color="primary"
                icon="add_circle"
                @click="showAdd = true"
              />
            </q-item-section>
            <q-item-section side>
              <q-btn
                dense
                outline
                label="Filtros"
                color="primary"
                icon="filter_alt"
                @click="showFilters = true"
              />
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:top-right>
          <q-item v-if="checkRole('Admin')">
            <q-item-section>
              <q-btn
                dense
                outline
                label="Validar pedidos"
                color="primary"
                icon="task_alt"
                @click="showValid = true"
              />
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:bottom>
          <base-pagination
            :pagination="crud.pagination"
            @update:currentPage="(val) => (crud.pagination.currentPage = val)"
          />
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <!-- DIALOGS VENTANAS EMERGENTES -->
   <BaseDialog full-width v-model="showAdd" mode="create" @submit="postItem">
    <template #form>
      <saleTractor-form ref="add" />
    </template>
  </BaseDialog>

</template>

<script setup>
// IMPORTS
import BaseDialog from "src/bases/BaseDialog.vue";
import BasePagination from "src/bases/BasePagination.vue";
import { ref, onMounted, watch } from "vue";
import { h } from "vue";
import { QChip, QTooltip, QBtn } from "quasar";
import { useCrudStore } from "src/stores/crud";
import { checkRole } from "src/boot/functions";
import SaleTractorForm from "src/components/SaleTractor/SaleTractorForm.vue";

// CONST
const crud = useCrudStore();
const selectedItem = ref(null);
const showAdd = ref(false);

const baseURL = "/api/intranet/sales-tractors";

// CONST RENDERS
const renderDate = (row) =>
  h(
    QChip,
    {
      color: "green-3",
      "text-color": "black",
      icon: "event",
      dense: true,
    },
    () => formatDate(row.fecha)
  );

// filtros
const filterForm = ref({
  search: null,
  cancellation: null,
  cliente_id: null,
  status_id: null,
  sucursal_id: null,
  empleado_id: null,
  validate: null,
});

//HELPERS FUNCTIONS
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// COLUMNAS
const columns = [
  {
    name: "actions",
    label: "",
    align: "left",
    field: (row) =>
      h(QBtn, {
        dense: true,
        color: "blue",
        flat: true,
        icon: "edit",
        onClick: () => openEdit(row),
      }),
  },

  {
    name: "order",
    label: "# Orden",
    align: "left",
    field: "order",
    sortable: true,
  },
  { name: "date", label: "Fecha", align: "left", field: renderDate },
  {
    name: "origin",
    label: "Origen",
    align: "left",
    field: (row) => [
      h("div", row.vendedor?.nombreCompleto || ""),
      h("div", { class: "text-caption text-grey" }, row.sucursal?.nombre || ""),
    ],
  },
  {
    name: "cliente",
    label: "Cliente",
    align: "left",
    field: (row) => [
      h("div", row.cliente?.nombre || ""),
    ],
  },
  {
    name: "tractor",
    label: "Modelo Tractor",
    align: "left",
    field: (row) => {
      const model = row.inv_model;
      if (!model) return "N/A";

      return [
        h("div", { class: "text-weight-bold" }, `Código: ${model.code || "N/A"}`),
        h("div", { class: "text-caption" }, `${model.name || "N/A"}`),
      ];
    },
  },
  {
    name: "estatus",
    label: "Estatus",
    align: "left",
    field: (row) =>
      h(
        QChip,
        {
          color: row.estatus?.color || "grey",
          "text-color": "white",
          dense: true,
        },
        () => row.estatus?.nombre || "N/A"
      ),
  },
];

// FUNCTIONS
// obtener registros de bd
const getRows = async () => {
  await crud.getPaginatedItems(baseURL, {
    ...filterForm.value,
    page: crud.pagination.currentPage,
  });
};

// nuevo registro
const postItem = async () => {
  const data = { ...add.value.formSale };
  await crud.postItem(baseURL, data, add.value.validate, () => {
    showAdd.value = false;
    getRows();
  });
};



// MOUNTED
onMounted(() => {
  getRows();

});
</script>

<style scoped>
.custom-item {
  border-radius: 8px;
  padding: 10px;
}
.custom-label {
  font-size: 1.2em;
  font-weight: bold;
}
.column {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
