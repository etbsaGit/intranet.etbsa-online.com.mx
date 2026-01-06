<template>
  <!-- <BaseCatalogo
    title="Pedidos"
    createLabel="Nuevo pedido"
    :columns="columns"
    url="/api/intranet/sales"
    :on-create="createItem"
    :on-update="updateItem"
    :on-delete="false"
    FullWidth
  >
    <template #create-form>
      <SaleForm ref="add" />
    </template>

    <template #edit-form="{ item }">
      <SaleForm ref="edit" :sale="item" />
    </template>
  </BaseCatalogo> -->

  <q-item class="custom-item" align="center">
    <q-item-section>
      <q-item-label class="custom-label">-Pedidos-</q-item-label>
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

  <!-- Dialogs -->
  <BaseDialog full-width v-model="showAdd" mode="create" @submit="postItem">
    <template #form>
      <sale-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog full-width v-model="showEdit" mode="edit" @submit="putItem">
    <template #form>
      <sale-form ref="edit" :sale="selectedItem" />
    </template>
  </BaseDialog>

  <BaseDialog full-width v-model="showValid" mode="edit" @submit="putValidated">
    <template #form>
      <sale-validate-form ref="valid" />
    </template>
  </BaseDialog>

  <BaseDialog full-width v-model="showEditValid" mode="edit" @submit="putItem">
    <template #form>
      <sale-edit-validate-form ref="edit" :sale="selectedItem" />
    </template>
  </BaseDialog>

  <!-- Filtros -->
  <q-dialog v-model="showFilters" position="top" full-width>
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Filtros</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" icon="close" dense color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn
            label="Buscar"
            icon="search"
            dense
            color="blue"
            @click="getRows"
          />
        </q-item-section>
        <q-item-section side>
          <q-btn
            dense
            label="Limpiar"
            color="orange"
            @click="clearFilters"
            icon="filter_alt_off"
          />
        </q-item-section>
      </q-item>

      <q-separator />

      <!-- Buscador y toggle -->
      <q-item>
        <q-item-section>
          <q-input
            outlined
            dense
            label="Buscar"
            v-model="filterForm.search"
            @update:model-value="onInputChange"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            :color="filterForm.cancellation == 1 ? 'red' : 'green'"
            keep-color
            v-model="filterForm.cancellation"
            label="Canceladas"
            checked-icon="close"
            unchecked-icon="check"
            :true-value="1"
            :false-value="0"
          />
        </q-item-section>
      </q-item>

      <!-- Selects -->
      <q-item>
        <q-item-section>
          <q-select
            v-model="filterForm.cliente_id"
            :options="filterClientes"
            label="Cliente"
            option-value="id"
            option-label="nombre"
            emit-value
            map-options
            outlined
            dense
            clearable
            use-input
            options-dense
            @filter="(val, update) => filterOptions(val, update, 'clientes')"
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.status_id"
            :options="crud.items.statuses"
            label="Tipo de pedido"
            option-value="id"
            option-label="nombre"
            option-disable="inactive"
            emit-value
            map-options
            outlined
            dense
            clearable
          />
        </q-item-section>
      </q-item>

      <!-- Admin filters -->
      <q-item v-if="checkRole('Admin')">
        <q-item-section>
          <q-select
            v-model="filterForm.empleado_id"
            :options="filterEmpleados"
            label="Vendedor"
            option-value="id"
            option-label="apellidoCompleto"
            emit-value
            map-options
            outlined
            dense
            clearable
            use-input
            options-dense
            @filter="(val, update) => filterOptions(val, update, 'empleados')"
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.sucursal_id"
            :options="crud.items.sucursales"
            label="Sucursal"
            option-value="id"
            option-label="nombre"
            emit-value
            map-options
            outlined
            dense
            clearable
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { h } from "vue";
import { QChip, QTooltip, QBtn } from "quasar";
import { useCrudStore } from "src/stores/crud";
import { checkRole } from "src/boot/functions";

import BaseDialog from "src/bases/BaseDialog.vue";
import BasePagination from "src/bases/BasePagination.vue";
import SaleForm from "src/components/Sale/SaleForm.vue";
import SaleValidateForm from "src/components/Sale/SaleValidateForm.vue";
import SaleEditValidateForm from "src/components/Sale/SaleEditValidateForm.vue";

import BaseCatalogo from "src/bases/BaseCatalogo.vue";

const crud = useCrudStore();
const selectedItem = ref(null);
const showAdd = ref(false);
const showEdit = ref(false);
const showValid = ref(false);
const showEditValid = ref(false);
const showFilters = ref(false);
const add = ref(null);
const edit = ref(null);
const valid = ref(null);

const filterForm = ref({
  search: null,
  cancellation: null,
  cliente_id: null,
  status_id: null,
  sucursal_id: null,
  empleado_id: null,
  validate: null,
});

const filterClientes = ref([]);
const filterEmpleados = ref([]);

const baseURL = "/api/intranet/sale";

// -------------------- RENDERERS DE COLUMNAS --------------------
const renderFolio = (row) =>
  h("div", { class: "column" }, [
    row.folio &&
      h(QChip, {
        color: "green-3",
        "text-color": "black",
        label: row.folio,
        dense: true,
      }),
    row.cancellation_folio &&
      h(QChip, {
        color: "red-3",
        "text-color": "black",
        label: row.cancellation_folio,
        dense: true,
      }),
  ]);

const renderDate = (row) =>
  h("div", { class: "column" }, [
    h(
      QChip,
      { color: "green-3", "text-color": "black", icon: "event", dense: true },
      () => row.date
    ),
    row.cancellation_date &&
      h(
        QChip,
        { color: "red-3", "text-color": "black", icon: "event", dense: true },
        () => row.cancellation_date
      ),
  ]);

const renderValidated = (row) => {
  const config = {
    0: { color: "red-10", icon: "close", tooltipClass: "bg-red" },
    1: { color: "green-10", icon: "check", tooltipClass: "bg-green" },
    default: { color: "grey-9", icon: "error" },
  };
  const { color, icon, tooltipClass } = config[row.validated] || config.default;

  return h(
    QChip,
    {
      clickable: row.validated !== undefined,
      color,
      "text-color": "white",
      icon,
      dense: true,
      onClick: () => openEditValidate(row),
    },
    () =>
      tooltipClass
        ? h(
            QTooltip,
            { class: `${tooltipClass} text-h6` },
            () => row.feedback || ""
          )
        : null
  );
};

// -------------------- COLUMNAS --------------------
const columns = [
  {
    name: "actions",
    label: "",
    field: "actions",
    align: "left",
  },

  {
    name: "economic",
    label: "# Económico",
    align: "left",
    field: "economic",
    sortable: true,
  },
  {
    name: "invoice",
    label: "Factura",
    align: "left",
    field: "invoice",
    sortable: true,
  },
  { name: "folio", label: "Folio", align: "left", field: renderFolio },
  { name: "date", label: "Fecha", align: "left", field: renderDate },
  {
    name: "origin",
    label: "Origen",
    align: "left",
    field: (row) => [
      h("div", row.empleado?.nombreCompleto || ""),
      h("div", { class: "text-caption text-grey" }, row.sucursal?.nombre || ""),
    ],
  },
  {
    name: "cliente",
    label: "Cliente",
    align: "left",
    field: (row) => [
      h("div", row.cliente?.nombre || ""),
      h(
        "div",
        { class: "text-caption text-grey" },
        row.referencia?.nombre || ""
      ),
    ],
  },
  {
    name: "validated",
    label: "Validado",
    align: "center",
    field: renderValidated,
  },
];

// -------------------- FUNCIONES --------------------
const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};
const openEditValidate = (item) => {
  if (checkRole("Admin")) {
    selectedItem.value = item;
    showEditValid.value = true;
  }
};

const clearFilters = () => {
  Object.keys(filterForm.value).forEach((k) => (filterForm.value[k] = null));
  getRows();
};

const getRows = async () => {
  await crud.getPaginatedItems(baseURL + "s", {
    ...filterForm.value,
    page: crud.pagination.currentPage,
  });
};

const postItem = async () => {
  const data = { ...add.value.formSale };
  await crud.postItem(baseURL, data, add.value.validate, () => {
    showAdd.value = false;
    getRows();
  });
};

const putItem = async () => {
  const data = { ...edit.value.formSale };
  await crud.putItem(baseURL, data, edit.value.validate, () => {
    showEdit.value = false;
    showEditValid.value = false;
    getRows();
  });
};

const putValidated = async () => {
  const data = { ...valid.value.salesData };
  await crud.postItem(
    baseURL + "/post/validated",
    data,
    valid.value.validate,
    () => {
      showValid.value = false;
      getRows();
    }
  );
};

// -------------------- FILTRO REUTILIZABLE --------------------
const filterOptions = (val, update, type) => {
  if (!update) return;
  const list =
    type === "clientes"
      ? crud.items.clientes || []
      : crud.items.empleados || [];
  const needle = (val || "").toLowerCase();
  const filtered = list.filter((item) =>
    type === "clientes"
      ? item.nombre.toLowerCase().includes(needle)
      : item.apellidoCompleto.toLowerCase().includes(needle)
  );
  update(() => {
    if (type === "clientes") filterClientes.value = filtered;
    else filterEmpleados.value = filtered;
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

// -------------------- MOUNTED --------------------
onMounted(() => {
  getRows();
  crud.getItems(baseURL + "/options");
});

const BASE_URL = "/api/intranet/sale"; // singular para post/put/delete

const createItem = async () => {
  const ok = await add.value.validate();
  if (!ok) return false;

  const data = { ...add.value.saleForm };
  await crud.postItem(BASE_URL, data, add.value.validate);

  return true;
};

const updateItem = async (item) => {
  const ok = await edit.value.validate();
  if (!ok) return false;

  const data = { ...edit.value.saleForm, id: item.id };
  await crud.putItem(BASE_URL, data, edit.value.validate);

  return true;
};
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
