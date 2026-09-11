<template>
  <div class="q-pa-md relative-position">
    <!-- Spinner de Carga General -->
    <q-inner-loading :showing="loading" style="z-index: 10">
      <q-spinner-dots size="50px" color="primary" />
      <span class="text-caption text-primary q-mt-sm">Cargando métricas ejecutivas...</span>
    </q-inner-loading>

    <!-- Barra Superior: Filtros Ejecutivos -->
    <div class="q-mb-md">
      <DashboardFiltros
        :filters="filters"
        :options="options"
        :loading="loading"
        @update:filter="onFilterUpdate"
        @refresh="fetchDashboardData"
        @clear="onFilterClear"
      />
    </div>

    <!-- Bloque 1: Tarjetas de KPIs Ejecutivos (Clickeables) -->
    <div class="q-mb-md">
      <DashboardKpis
        :kpis="dashboardData?.kpis"
        @click-kpi="abrirDetalleKpi"
      />
    </div>

    <!-- Bloque 2: Gráfica de Flujo Mensual (Ancho Completo) -->
    <div class="q-mb-md">
      <ChartFlujoMensual
        :data="dashboardData?.flujo_mensual"
        :year="filters.year"
      />
    </div>

    <!-- Bloque 3: Colocación por Línea de Crédito y Desempeño por Sucursal -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-lg-6">
        <ChartCarteraLineas :data="dashboardData?.cartera_por_linea" />
      </div>
      <div class="col-12 col-lg-6">
        <ChartSucursales :data="dashboardData?.desempeno_por_sucursal" />
      </div>
    </div>

    <!-- Bloque 4: Antigüedad de Saldos (Aging) y Distribución por Estatus -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <ChartAntiguedadSaldos :data="dashboardData?.antiguedad_saldos" />
      </div>
      <div class="col-12 col-md-6">
        <ChartEstatusDonut :data="dashboardData?.distribucion_estatus" />
      </div>
    </div>

    <!-- Bloque 5: Top Clientes en Mora (Acción Inmediata) -->
    <div class="q-mb-md">
      <TopClientesMoraTable :clientes="dashboardData?.top_clientes_mora || []" />
    </div>

    <!-- Modal de Detalle de KPI Clickeado -->
    <DashboardKpiDetalleModal
      v-model="modalKpiOpen"
      :tipo-kpi="kpiSeleccionado"
      :items="itemsKpiSeleccionado"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { api } from "src/boot/axios";
import { show_notify } from "src/boot/functions";

import DashboardFiltros from "./DashboardFiltros.vue";
import DashboardKpis from "./DashboardKpis.vue";
import ChartFlujoMensual from "./ChartFlujoMensual.vue";
import ChartCarteraLineas from "./ChartCarteraLineas.vue";
import ChartSucursales from "./ChartSucursales.vue";
import ChartAntiguedadSaldos from "./ChartAntiguedadSaldos.vue";
import ChartEstatusDonut from "./ChartEstatusDonut.vue";
import TopClientesMoraTable from "./TopClientesMoraTable.vue";
import DashboardKpiDetalleModal from "./DashboardKpiDetalleModal.vue";

const loading = ref(false);
const modalKpiOpen = ref(false);
const kpiSeleccionado = ref("vencido");

const options = ref({
  sucursales: [],
  empleados: [],
  creditoLineas: [],
  estatuses: [],
});

const currentYear = new Date().getFullYear();

const filters = reactive({
  year: currentYear,
  sucursal_id: null,
  linea_id: null,
  asesor_id: null,
  fecha_inicio: null,
  fecha_fin: null,
});

const dashboardData = ref({
  kpis: null,
  detalles_kpis: {
    colocado: [],
    cobrado: [],
    validado: [],
    vencido: [],
    pendiente: [],
    por_validar: [],
    ticket_promedio: [],
  },
  flujo_mensual: { categories: [], series: [] },
  cartera_por_linea: { categories: [], series: [] },
  desempeno_por_sucursal: { categories: [], series: [] },
  antiguedad_saldos: { labels: [], series: [] },
  distribucion_estatus: { labels: [], series: [], colors: [] },
  top_clientes_mora: [],
});

const itemsKpiSeleccionado = computed(() => {
  if (!dashboardData.value?.detalles_kpis) return [];
  return dashboardData.value.detalles_kpis[kpiSeleccionado.value] || [];
});

const abrirDetalleKpi = (tipo) => {
  kpiSeleccionado.value = tipo;
  modalKpiOpen.value = true;
};

const fetchOptions = async () => {
  try {
    const res = await api.get("/api/intranet/creditoInternos/options");
    if (res?.data?.data || res?.data) {
      options.value = res.data.data || res.data;
    }
  } catch (error) {
    console.error("Error al cargar opciones de filtros en dashboard:", error);
  }
};

const fetchDashboardData = async () => {
  loading.value = true;
  try {
    const payload = {
      year: filters.year,
      sucursal_id: filters.sucursal_id || null,
      linea_id: filters.linea_id || null,
      asesor_id: filters.asesor_id || null,
      fecha_inicio: filters.fecha_inicio || null,
      fecha_fin: filters.fecha_fin || null,
    };

    const res = await api.post("/api/intranet/creditoInternos/dashboard", payload);
    const data = res?.data?.data || res?.data || {};

    dashboardData.value = {
      kpis: data.kpis || null,
      detalles_kpis: data.detalles_kpis || {
        colocado: [],
        cobrado: [],
        validado: [],
        vencido: [],
        pendiente: [],
        por_validar: [],
        ticket_promedio: [],
      },
      flujo_mensual: data.flujo_mensual || { categories: [], series: [] },
      cartera_por_linea: data.cartera_por_linea || { categories: [], series: [] },
      desempeno_por_sucursal: data.desempeno_por_sucursal || { categories: [], series: [] },
      antiguedad_saldos: data.antiguedad_saldos || { labels: [], series: [] },
      distribucion_estatus: data.distribucion_estatus || { labels: [], series: [], colors: [] },
      top_clientes_mora: data.top_clientes_mora || [],
    };
  } catch (error) {
    console.error("Error al obtener datos del dashboard de crédito:", error);
    show_notify("No se pudieron cargar las métricas del dashboard", "error", "negative");
  } finally {
    loading.value = false;
  }
};

const onFilterUpdate = (newFilters) => {
  Object.assign(filters, newFilters);
  fetchDashboardData();
};

const onFilterClear = () => {
  filters.year = currentYear;
  filters.sucursal_id = null;
  filters.linea_id = null;
  filters.asesor_id = null;
  filters.fecha_inicio = null;
  filters.fecha_fin = null;
  fetchDashboardData();
};

onMounted(async () => {
  await fetchOptions();
  await fetchDashboardData();
});
</script>
