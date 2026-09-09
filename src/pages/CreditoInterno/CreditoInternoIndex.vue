<template>
  <BaseCatalogo
    :onCreate="false"
    title="Solicitudes Crédito Interno"
    :columns="columns"
    url="/api/intranet/creditoInternos"
    :on-delete="false"
    :initial-filters="{
      sucursal_id: null,
      asesor_id: null,
      estatus_id: null,
      linea_id: null,
    }"
  >
    <!-- Filtros extra -->
    <template #filters-extra="{ filters, onSearchChange }">
      <CreditoFiltros
        :filters="filters"
        :options="options"
        @update:filter="(key, val) => (filters[key] = val)"
        @clear="
          Object.assign(filters, {
            sucursal_id: null,
            asesor_id: null,
            estatus_id: null,
            linea_id: null,
          })
        "
        @update="onSearchChange"
      />
    </template>

    <!-- Columna: Folio -->
    <template v-slot:body-cell-folio="props">
      <q-td :props="props">
        <q-chip
          dense
          color="indigo-1"
          text-color="indigo-9"
          class="text-weight-bold q-px-sm"
          icon="receipt_long"
        >
          #{{ props.row.folio || props.row.id }}
        </q-chip>
      </q-td>
    </template>

    <!-- Columna: Cliente -->
    <template v-slot:body-cell-cliente="props">
      <q-td :props="props">
        <div class="row items-center no-wrap">
          <q-avatar
            size="32px"
            color="primary"
            text-color="white"
            icon="person"
            class="q-mr-sm shadow-1"
          />
          <div>
            <div class="text-weight-bold text-primary text-body2">
              {{ props.row.cliente?.nombre || "Cliente no especificado" }}
            </div>
            <div class="text-caption text-grey-7 flex items-center q-gutter-xs">
              <span v-if="props.row.cliente?.rfc">
                RFC: {{ props.row.cliente.rfc }}
              </span>
              <span
                v-if="props.row.cliente?.rfc && props.row.cliente?.telefono"
              >
                •
              </span>
              <span v-if="props.row.cliente?.telefono">
                {{ formatPhoneNumber(props.row.cliente.telefono) }}
              </span>
            </div>
          </div>
        </div>
      </q-td>
    </template>

    <!-- Columna: Línea de Crédito -->
    <template v-slot:body-cell-linea="props">
      <q-td :props="props">
        <q-badge
          v-if="props.row.linea?.name || props.row.credito_linea?.name"
          color="blue-grey-1"
          text-color="blue-grey-9"
          class="text-weight-bold q-pa-xs"
        >
          <q-icon
            name="category"
            size="xs"
            class="q-mr-xs"
            color="blue-grey-8"
          />
          {{ props.row.linea?.name || props.row.credito_linea?.name }}
        </q-badge>
        <div v-else class="text-caption text-grey-5">Sin línea</div>
      </q-td>
    </template>

    <!-- Columna: Asesor / Sucursal -->
    <template v-slot:body-cell-asesor="props">
      <q-td :props="props">
        <div class="row items-center no-wrap">
          <q-avatar
            size="28px"
            color="teal-1"
            text-color="teal-9"
            icon="badge"
            class="q-mr-xs"
          />
          <div>
            <div class="text-weight-medium text-dark">
              {{ props.row.asesor?.nombreCompleto || "Sin asesor" }}
            </div>
            <div v-if="props.row.sucursal?.nombre" class="text-caption">
              <q-badge
                color="grey-3"
                text-color="grey-9"
                class="text-weight-bold"
              >
                <q-icon name="store" size="xs" class="q-mr-xs" />
                {{ props.row.sucursal.nombre }}
              </q-badge>
            </div>
          </div>
        </div>
      </q-td>
    </template>

    <!-- Columna: Monto Solicitado -->
    <template v-slot:body-cell-monto_solicitado="props">
      <q-td :props="props">
        <div class="text-right">
          <div class="text-weight-bolder text-positive text-subtitle2">
            {{ formatCurrency(props.row.monto_solicitado || 0) }}
          </div>
          <div
            v-if="
              (props.row.valor_enganche || props.row.anticipo) &&
              Number(props.row.valor_enganche || props.row.anticipo) > 0
            "
            class="text-caption text-amber-9 text-weight-medium"
          >
            Enganche:
            {{
              formatCurrency(props.row.valor_enganche || props.row.anticipo)
            }}
          </div>
        </div>
      </q-td>
    </template>

    <!-- Columna: Estatus -->
    <template v-slot:body-cell-estatus="props">
      <q-td :props="props" align="center">
        <q-chip
          dense
          class="text-weight-bold text-white q-px-sm"
          :style="{
            backgroundColor: props.row.estatus?.color || '#1976d2',
          }"
        >
          {{ props.row.estatus?.nombre || props.row.estatus || "Pendiente" }}
        </q-chip>
      </q-td>
    </template>

    <!-- Columna: Pagos -->
    <template v-slot:body-cell-pagos="props">
      <q-td :props="props">
        <div class="column items-start q-gutter-xs">
          <div
            v-if="props.row.resumen_pagos"
            class="flex items-center q-gutter-xs"
          >
            <q-badge
              color="blue-1"
              text-color="blue-9"
              class="text-weight-bold q-pa-xs"
            >
              <q-icon name="payments" size="xs" class="q-mr-xs" />
              {{ props.row.resumen_pagos }}
            </q-badge>
          </div>
          <div
            v-if="props.row.proximo_pago"
            class="text-caption text-grey-8 flex items-center q-gutter-xs"
          >
            <q-icon name="event" color="orange-8" size="xs" />
            <span>
              Próximo: {{ formatFechaLarga(props.row.proximo_pago) }}
            </span>
          </div>
          <div
            v-if="!props.row.resumen_pagos && !props.row.proximo_pago"
            class="text-caption text-grey-5"
          >
            Sin programación
          </div>
        </div>
      </q-td>
    </template>

    <!-- Columna: Fecha -->
    <template v-slot:body-cell-created_at="props">
      <q-td :props="props" align="center">
        <div
          class="text-caption text-grey-8 flex items-center justify-center q-gutter-xs"
        >
          <q-icon name="calendar_today" size="xs" color="grey-6" />
          <span>{{ formatFechaLarga(props.row.created_at) }}</span>
        </div>
      </q-td>
    </template>

    <!-- Columna: Acciones / Detalles, Historial y Pagos -->
    <template v-slot:body-cell-detalles="props">
      <q-td :props="props" align="center">
        <div class="row items-center justify-center q-gutter-xs no-wrap">
          <q-btn
            flat
            round
            dense
            icon="visibility"
            color="primary"
            @click="verDetalles(props.row)"
          >
            <q-tooltip class="bg-primary">Ver detalles completos</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            icon="payments"
            color="teal-8"
            @click="verPagos(props.row)"
          >
            <q-tooltip class="bg-teal-8">Control y gestión de pagos</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            icon="history"
            color="indigo"
            @click="verHistorial(props.row)"
          >
            <q-tooltip class="bg-indigo">Ver historial de cambios</q-tooltip>
          </q-btn>
        </div>
      </q-td>
    </template>
  </BaseCatalogo>

  <!-- Modal de Detalles modular -->
  <CreditoDetallesModal v-model="showDetallesModal" :credito="selectedItem" />

  <!-- Modal de Pagos del Crédito -->
  <CreditoPagosModal
    v-model="showPagosModal"
    :credito="selectedPagosItem"
    @updated="onPagosUpdated"
  />

  <!-- Modal de Historial de Cambios -->
  <CreditoHistorialModal
    v-model="showHistorialModal"
    :credito="selectedHistorialItem"
    :historial="selectedHistorialItem?.historial"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";
import {
  formatPhoneNumber,
  formatCurrency,
  formatFechaLarga,
} from "src/boot/format";
import BaseCatalogo from "src/bases/BaseCatalogo.vue";
import CreditoFiltros from "src/components/CreditoInterno/CreditoFiltros.vue";
import CreditoDetallesModal from "src/components/CreditoInterno/CreditoDetallesModal.vue";
import CreditoHistorialModal from "src/components/CreditoInterno/CreditoHistorialModal.vue";
import CreditoPagosModal from "src/components/CreditoInterno/CreditoPagosModal.vue";

const showDetallesModal = ref(false);
const selectedItem = ref(null);

const showPagosModal = ref(false);
const selectedPagosItem = ref(null);

const showHistorialModal = ref(false);
const selectedHistorialItem = ref(null);
const options = ref([]);

const crud = useCrudStore();

const columns = [
  {
    name: "folio",
    label: "Folio",
    field: (row) => row.folio || row.id,
    sortable: true,
    align: "center",
  },
  {
    name: "cliente",
    label: "Cliente",
    field: (row) => row.cliente?.nombre || "Sin cliente",
    sortable: true,
    align: "left",
  },
  {
    name: "linea",
    label: "Línea de Crédito",
    field: (row) =>
      row.linea?.name || row.credito_linea?.name || row.linea || "Sin línea",
    sortable: true,
    align: "left",
  },
  {
    name: "asesor",
    label: "Asesor / Sucursal",
    field: (row) =>
      `${row.asesor?.nombreCompleto || ""} ${row.sucursal?.nombre || ""}`,
    sortable: true,
    align: "left",
  },
  {
    name: "monto_solicitado",
    label: "Monto Solicitado",
    field: (row) => row.monto_solicitado || 0,
    sortable: true,
    align: "right",
  },
  {
    name: "estatus",
    label: "Estatus",
    field: (row) => row.estatus?.nombre || row.estatus || "Pendiente",
    sortable: true,
    align: "center",
  },
  {
    name: "pagos",
    label: "Progreso de Pagos",
    field: (row) => row.resumen_pagos || "",
    align: "left",
  },
  {
    name: "created_at",
    label: "Fecha",
    field: (row) => row.created_at || "",
    sortable: true,
    align: "center",
  },
  {
    name: "detalles",
    label: "Acciones",
    field: (row) => row.id,
    align: "center",
  },
];

const verDetalles = (row) => {
  selectedItem.value = row;
  showDetallesModal.value = true;
};

const verPagos = (row) => {
  selectedPagosItem.value = row;
  showPagosModal.value = true;
};

const verHistorial = (row) => {
  selectedHistorialItem.value = row;
  showHistorialModal.value = true;
};

const onPagosUpdated = async () => {
  await crud.getPaginatedItems("/api/intranet/creditoInternos");
  if (selectedPagosItem.value?.id) {
    const updated = (crud.paginatedItems || []).find(
      (c) => c.id === selectedPagosItem.value.id
    );
    if (updated) {
      selectedPagosItem.value = updated;
    }
  }
};

const getOptions = async () => {
  await crud.getItems("/api/intranet/creditoInternos/options");
  options.value = crud.items || [];
};

onMounted(() => {
  getOptions();
});
</script>
