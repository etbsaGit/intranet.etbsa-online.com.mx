<template>
  <div class="q-pa-md relative-position">
    <!-- Spinner de Carga General -->
    <q-inner-loading :showing="loading" style="z-index: 10">
      <q-spinner-dots size="50px" color="primary" />
      <span class="text-caption text-primary q-mt-sm">Cargando calendario de cobranza...</span>
    </q-inner-loading>

    <!-- Barra Superior: Filtros y Navegación de Mes -->
    <div class="q-mb-md">
      <CalendarioFiltros
        :year="year"
        :month="month"
        :sucursal-id="sucursalId"
        :asesor-id="asesorId"
        :linea-id="lineaId"
        :options="options"
        :loading="loading"
        @update:year="(val) => (year = val)"
        @update:month="(val) => (month = val)"
        @update:sucursal-id="(val) => (sucursalId = val)"
        @update:asesor-id="(val) => (asesorId = val)"
        @update:linea-id="(val) => (lineaId = val)"
        @update:view-mode="(val) => (viewMode = val)"
        @refresh="fetchCalendarioData"
      />
    </div>

    <!-- Bloque 1: Resumen Mensual de Cobranza (YA Pagado, Prospectado, Vencido, Por Vencer) -->
    <div class="q-mb-md">
      <CalendarioResumenMes
        :resumen="calendarioData?.resumen_mes"
        @click-kpi="abrirModalKpi"
      />
    </div>

    <!-- Bloque 2: Vista Calendario (Grid) o Vista Lista Detallada -->
    <div v-if="viewMode === 'grid'" class="q-mb-md">
      <CalendarioGrid
        :dias="calendarioData?.dias || []"
        :selected-fecha="selectedDia?.fecha"
        @select-dia="onSelectDia"
      />
    </div>

    <!-- Vista Alternativa: Tabla Mensual Detallada -->
    <div v-else class="q-mb-md">
      <q-card flat bordered class="bg-white rounded-borders shadow-1 q-pa-sm">
        <q-table
          flat
          bordered
          dense
          :rows="calendarioData?.todos_pagos || []"
          :columns="columnsTablaMensual"
          row-key="id"
          :filter="filterSearch"
          :rows-per-page-options="[10, 20, 50, 0]"
          class="rounded-borders"
        >
          <template v-slot:top-left>
            <div class="text-subtitle1 text-weight-bold text-primary flex items-center q-gutter-xs">
              <q-icon name="list_alt" />
              <span>Todos los Pagos de {{ calendarioData?.resumen_mes?.nombre_mes }} ({{ (calendarioData?.todos_pagos || []).length }})</span>
            </div>
          </template>

          <template v-slot:top-right>
            <q-input
              dense
              outlined
              debounce="300"
              v-model="filterSearch"
              placeholder="Buscar cliente, folio..."
              style="min-width: 220px"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <!-- Columna Folio -->
          <template v-slot:body-cell-folio="props">
            <q-td :props="props" align="center">
              <q-chip dense color="indigo-1" text-color="indigo-9" class="text-weight-bold">
                #{{ props.row.folio }}
              </q-chip>
            </q-td>
          </template>

          <!-- Columna Cliente -->
          <template v-slot:body-cell-cliente="props">
            <q-td :props="props">
              <div class="text-weight-bold text-dark">{{ props.row.cliente }}</div>
              <div v-if="props.row.telefono" class="text-caption text-grey-7">
                {{ formatPhoneNumber(props.row.telefono) }}
              </div>
            </q-td>
          </template>

          <!-- Columna Fecha a Pagar -->
          <template v-slot:body-cell-fecha_a_pagar="props">
            <q-td :props="props">
              <div class="flex items-center q-gutter-xs">
                <q-icon name="event" size="xs" color="primary" />
                <span>{{ formatFechaLarga(props.row.fecha_a_pagar) }}</span>
              </div>
            </q-td>
          </template>

          <!-- Columna Estatus / Estado de Cobro -->
          <template v-slot:body-cell-estado_cobro="props">
            <q-td :props="props" align="center">
              <q-chip
                dense
                class="text-weight-bold text-white q-px-sm"
                :color="
                  props.row.estado_cobro === 'liquidado'
                    ? 'positive'
                    : props.row.estado_cobro === 'vencido'
                    ? 'negative'
                    : 'amber-9'
                "
              >
                {{
                  props.row.estado_cobro === 'liquidado'
                    ? 'Liquidado'
                    : props.row.estado_cobro === 'vencido'
                    ? 'Vencido'
                    : 'Pendiente'
                }}
              </q-chip>
            </q-td>
          </template>

          <!-- Columna Validación -->
          <template v-slot:body-cell-validacion="props">
            <q-td :props="props" align="center">
              <q-badge
                v-if="props.row.esta_validado"
                color="teal-1"
                text-color="teal-9"
                class="text-weight-bold q-pa-xs"
              >
                <q-icon name="verified" size="xs" class="q-mr-xs" />
                Validado
                <q-tooltip v-if="props.row.validado_por">Validado por {{ props.row.validado_por }}</q-tooltip>
              </q-badge>
              <q-badge
                v-else-if="Number(props.row.monto_pagado) > 0 || props.row.comprobante_url || props.row.estado_cobro === 'liquidado'"
                color="orange-1"
                text-color="orange-10"
                class="text-weight-bold q-pa-xs"
              >
                <q-icon name="pending_actions" size="xs" class="q-mr-xs" />
                Falta Validar
              </q-badge>
              <span v-else class="text-grey-5 text-caption">—</span>
            </q-td>
          </template>

          <!-- Columna Monto Pagado -->
          <template v-slot:body-cell-monto_pagado="props">
            <q-td :props="props" align="right">
              <span
                v-if="Number(props.row.monto_pagado) > 0"
                class="text-weight-bold text-positive"
              >
                {{ formatCurrency(props.row.monto_pagado) }}
              </span>
              <span v-else class="text-grey-5">—</span>
            </q-td>
          </template>

          <!-- Columna Saldo Pendiente -->
          <template v-slot:body-cell-saldo_pendiente="props">
            <q-td :props="props" align="right">
              <span
                v-if="Number(props.row.saldo_pendiente) > 0"
                class="text-weight-bold"
                :class="props.row.estado_cobro === 'vencido' ? 'text-negative' : 'text-dark'"
              >
                {{ formatCurrency(props.row.saldo_pendiente) }}
              </span>
              <span v-else class="text-grey-5">—</span>
            </q-td>
          </template>

          <!-- Columna Comprobante Recibo -->
          <template v-slot:body-cell-comprobante="props">
            <q-td :props="props" align="center">
              <q-btn
                v-if="props.row.comprobante_url"
                dense
                flat
                color="red-8"
                icon="picture_as_pdf"
                size="sm"
                @click="abrirComprobante(props.row.comprobante_url)"
              >
                <q-tooltip>Abrir comprobante PDF</q-tooltip>
              </q-btn>
              <span v-else class="text-grey-5">—</span>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- Modal 1: Detalle del Día Seleccionado en el Calendario -->
    <CalendarioDiaModal
      v-model="showDiaModal"
      :dia="selectedDia"
    />

    <!-- Modal 2: Detalle Desplegado de Pagos al hacer clic en un KPI Mensual -->
    <CalendarioKpiDetalleModal
      v-model="showKpiModal"
      :tipo-kpi="selectedTipoKpi"
      :nombre-mes="calendarioData?.resumen_mes?.nombre_mes"
      :pagos="calendarioData?.todos_pagos || []"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { show_notify } from "src/boot/functions";
import {
  formatCurrency,
  formatPhoneNumber,
  formatFechaLarga,
} from "src/boot/format";

import CalendarioFiltros from "./CalendarioFiltros.vue";
import CalendarioResumenMes from "./CalendarioResumenMes.vue";
import CalendarioGrid from "./CalendarioGrid.vue";
import CalendarioDiaModal from "./CalendarioDiaModal.vue";
import CalendarioKpiDetalleModal from "./CalendarioKpiDetalleModal.vue";

const loading = ref(false);
const viewMode = ref("grid");
const filterSearch = ref("");

const now = new Date();
const year = ref(now.getFullYear());
const month = ref(now.getMonth() + 1);
const sucursalId = ref(null);
const asesorId = ref(null);
const lineaId = ref(null);

const options = ref({
  sucursales: [],
  empleados: [],
  creditoLineas: [],
});

const calendarioData = ref({
  resumen_mes: null,
  dias: [],
  todos_pagos: [],
});

const showDiaModal = ref(false);
const selectedDia = ref(null);

const showKpiModal = ref(false);
const selectedTipoKpi = ref("vencido");

const columnsTablaMensual = [
  {
    name: "folio",
    label: "Folio",
    field: (row) => row.folio,
    sortable: true,
    align: "center",
  },
  {
    name: "cliente",
    label: "Cliente",
    field: (row) => row.cliente,
    sortable: true,
    align: "left",
  },
  {
    name: "sucursal",
    label: "Sucursal",
    field: (row) => row.sucursal,
    sortable: true,
    align: "left",
  },
  {
    name: "linea",
    label: "Línea",
    field: (row) => row.linea,
    sortable: true,
    align: "left",
  },
  {
    name: "etiqueta",
    label: "# Pago",
    field: (row) => row.etiqueta,
    align: "center",
  },
  {
    name: "fecha_a_pagar",
    label: "Fecha a Pagar",
    field: (row) => row.fecha_a_pagar,
    sortable: true,
    align: "left",
  },
  {
    name: "estado_cobro",
    label: "Estatus",
    field: (row) => row.estado_cobro,
    sortable: true,
    align: "center",
  },
  {
    name: "validacion",
    label: "Validación",
    field: (row) => row.esta_validado,
    sortable: true,
    align: "center",
  },
  {
    name: "monto_pagado",
    label: "Pagado",
    field: (row) => row.monto_pagado,
    sortable: true,
    align: "right",
  },
  {
    name: "saldo_pendiente",
    label: "Saldo Pendiente",
    field: (row) => row.saldo_pendiente,
    sortable: true,
    align: "right",
  },
  {
    name: "comprobante",
    label: "Recibo",
    field: (row) => row.comprobante_url,
    align: "center",
  },
];

const fetchOptions = async () => {
  try {
    const res = await api.get("/api/intranet/creditoInternos/options");
    if (res?.data?.data || res?.data) {
      options.value = res.data.data || res.data;
    }
  } catch (error) {
    console.error("Error al cargar opciones de filtros en calendario:", error);
  }
};

const fetchCalendarioData = async () => {
  loading.value = true;
  try {
    const payload = {
      year: year.value,
      month: month.value,
      sucursal_id: sucursalId.value || null,
      asesor_id: asesorId.value || null,
      linea_id: lineaId.value || null,
    };

    const res = await api.post("/api/intranet/creditoInternos/calendario", payload);
    const data = res?.data?.data || res?.data || {};

    calendarioData.value = {
      resumen_mes: data.resumen_mes || null,
      dias: data.dias || [],
      todos_pagos: data.todos_pagos || [],
    };
  } catch (error) {
    console.error("Error al obtener datos del calendario de cobranza:", error);
    show_notify("No se pudieron cargar los datos del calendario", "error", "negative");
  } finally {
    loading.value = false;
  }
};

const onSelectDia = (dia) => {
  selectedDia.value = dia;
  showDiaModal.value = true;
};

const abrirModalKpi = (tipo) => {
  selectedTipoKpi.value = tipo;
  showKpiModal.value = true;
};

const abrirComprobante = (url) => {
  if (url) {
    window.open(url, "_blank");
  }
};

onMounted(async () => {
  await fetchOptions();
  await fetchCalendarioData();
});
</script>
