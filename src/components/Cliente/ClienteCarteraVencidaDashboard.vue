<template>
  <div class="q-pa-sm text-white cartera-vencida-container">
    <!-- ENCABEZADO DEL DASHBOARD -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h6 text-weight-bold text-red-5 flex items-center q-gutter-x-sm">
          <q-icon name="account_balance_wallet" size="28px" />
          <span>CARTERA VENCIDA</span>
        </div>
        <div class="text-caption text-grey-4">
          Antigüedad de saldos y vencimientos por cliente
        </div>
      </div>

      <!-- BOTÓN DE RECARGA / SINCRONIZAR Y FECHA -->
      <div class="row items-center q-gutter-x-sm">
        <div class="text-right text-caption text-grey-4 q-mr-xs" v-if="carteraData?.last_sync">
          <div style="font-size: 10px;">Última sincronización:</div>
          <div class="text-weight-bold text-grey-2" style="font-size: 11px;">
            {{ carteraData.last_sync }}
          </div>
        </div>
        <q-btn
          color="red-7"
          icon="sync"
          label="Sincronizar"
          dense
          no-caps
          class="q-px-sm"
          :loading="syncing"
          @click="syncGoogleSheet"
        >
          <q-tooltip class="bg-dark text-white">
            Descargar y actualizar datos desde la hoja de Google Sheets
          </q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- SPINNER DE CARGA -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-orbit color="red-6" size="60px" />
      <div class="text-grey-3 q-mt-md text-subtitle2">Cargando datos de cartera vencida...</div>
    </div>

    <!-- MENSAJE DE NO ENCONTRADO O SIN CARTERA -->
    <div
      v-else-if="!carteraData || !carteraData.encontrado"
      class="q-pa-lg text-center bg-dark text-white rounded-borders"
    >
      <q-icon name="task_alt" size="56px" color="positive" class="q-mb-sm" />
      <div class="text-h6 text-weight-bold text-positive">Sin cartera vencida registrada</div>
      <div class="text-grey-4 q-mt-xs">
        No se encontraron saldos ni adeudos pendientes en la base de cartera para:
        <span class="text-weight-bold text-white">"{{ currentClienteNombre }}"</span>
        <span v-if="props.cliente?.equip" class="text-grey-5 q-ml-xs">
          (EQUIP: {{ props.cliente.equip }})
        </span>
      </div>
    </div>

    <!-- CONTENIDO DEL DASHBOARD -->
    <div v-else class="cartera-content">
      <!-- BADGES INFORMATIVOS DEL MATCH -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="row items-center q-gutter-xs">
          <q-badge color="grey-9" text-color="white" class="q-px-sm q-py-xs">
            <q-icon name="person" size="14px" class="q-mr-xs" />
            <span class="text-weight-bold">{{ carteraData.cliente_nombre }}</span>
          </q-badge>
        </div>

        <div class="text-caption text-grey-4">
          <span class="text-weight-bold text-white">{{ carteraData.totales?.total_documentos || 0 }}</span>
          folio(s) registrado(s)
        </div>
      </div>

      <!-- TARJETAS SUPERIORES TIPO KPI -->
      <div class="row q-col-gutter-sm q-mb-md">
        <!-- CARTERA TOTAL -->
        <div class="col-12 col-sm-6 col-md-3">
          <div class="kpi-box text-center">
            <q-icon name="account_balance_wallet" size="26px" color="amber-4" />
            <div class="text-h6 text-weight-bold text-amber-3 q-mt-xs">
              {{ formatMoneyInt(carteraData.totales?.cartera_total) }}
            </div>
            <div class="text-caption text-grey-4">CARTERA TOTAL</div>
          </div>
        </div>

        <!-- TOTAL VENCIDO -->
        <div class="col-12 col-sm-6 col-md-3">
          <div class="kpi-box text-center">
            <q-icon name="warning" size="26px" color="red-4" />
            <div class="text-h6 text-weight-bold text-red-4 q-mt-xs">
              {{ formatMoneyInt(carteraData.totales?.total_vencido) }}
            </div>
            <div class="text-caption text-grey-4">TOTAL VENCIDO</div>
          </div>
        </div>

        <!-- POR VENCER -->
        <div class="col-12 col-sm-6 col-md-3">
          <div class="kpi-box text-center">
            <q-icon name="schedule" size="26px" color="cyan-4" />
            <div class="text-h6 text-weight-bold text-cyan-3 q-mt-xs">
              {{ formatMoneyInt(carteraData.totales?.por_vencer) }}
            </div>
            <div class="text-caption text-grey-4">POR VENCER</div>
          </div>
        </div>

        <!-- % DE CARTERA EN MORA -->
        <div class="col-12 col-sm-6 col-md-3">
          <div class="kpi-box text-center">
            <q-icon name="pie_chart" size="26px" color="purple-4" />
            <div class="text-h6 text-weight-bold text-purple-3 q-mt-xs">
              {{ pctVencido }}%
            </div>
            <div class="text-caption text-grey-4">% EN MORA</div>
          </div>
        </div>
      </div>

      <!-- TABLA PRINCIPAL: CARTERA VENCIDA ETBSA (DISEÑO IDÉNTICO A LA IMAGEN) -->
      <div class="cartera-table-card q-mb-md">
        <!-- HEADER ROJO SUPERIOR -->
        <div class="cartera-banner-header text-center text-weight-bolder">
          CARTERA VENCIDA ETBSA
        </div>

        <!-- TABLA -->
        <div class="cartera-table-wrap">
          <table class="cartera-etbsa-table">
            <thead>
              <tr>
                <th class="text-left th-cliente">Cliente</th>
                <th class="text-right">MAS DE 90</th>
                <th class="text-right">MAS DE 60</th>
                <th class="text-right">MAS DE 30</th>
                <th class="text-right">MAS DE 15</th>
                <th class="text-right">DE 1 Y 15 DIAS</th>
                <th class="text-right">POR VENCER</th>
                <th class="text-right th-highlight">TOTAL VENCIDO</th>
                <th class="text-right th-total">CARTERA TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-left text-weight-bold td-cliente">
                  {{ carteraData.totales?.cliente }}
                </td>
                <td
                  class="text-right"
                  :class="{ 'text-red-4 text-weight-bolder': (carteraData.totales?.mas_de_90 || 0) > 0 }"
                >
                  {{ formatMoneyInt(carteraData.totales?.mas_de_90) }}
                </td>
                <td class="text-right">{{ formatMoneyInt(carteraData.totales?.mas_de_60) }}</td>
                <td class="text-right">{{ formatMoneyInt(carteraData.totales?.mas_de_30) }}</td>
                <td class="text-right">{{ formatMoneyInt(carteraData.totales?.mas_de_15) }}</td>
                <td class="text-right">{{ formatMoneyInt(carteraData.totales?.de_1_a_15) }}</td>
                <td class="text-right">{{ formatMoneyInt(carteraData.totales?.por_vencer) }}</td>
                <td class="text-right text-weight-bold td-vencido">
                  {{ formatMoneyInt(carteraData.totales?.total_vencido) }}
                </td>
                <td class="text-right text-weight-bold td-cartera-total">
                  {{ formatMoneyInt(carteraData.totales?.cartera_total) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="cartera-total-row">
                <td class="text-left text-weight-bolder">Total</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.mas_de_90) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.mas_de_60) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.mas_de_30) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.mas_de_15) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.de_1_a_15) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.por_vencer) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.total_vencido) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.cartera_total) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- SECCIÓN DE GRÁFICAS DE PASTEL: DEUDA POR SUCURSAL Y POR DEPARTAMENTO -->
      <div class="row q-col-gutter-sm q-mb-md">
        <!-- GRÁFICA 1: DEUDA POR SUCURSAL -->
        <div class="col-12 col-md-6">
          <div class="chart-box">
            <div class="chart-header-row row items-center justify-between q-pa-sm">
              <div class="row items-center q-gutter-x-xs">
                <q-icon name="storefront" size="20px" color="teal-4" />
                <span class="text-subtitle2 text-weight-bold text-white">DEUDA POR SUCURSAL</span>
              </div>
              <span class="text-caption text-grey-4 text-weight-bold">
                {{ formatMoneyInt(carteraData.totales?.cartera_total) }}
              </span>
            </div>
            <div class="q-pa-sm flex flex-center" style="min-height: 290px;">
              <apexchart
                v-if="sucursalSeries.length > 0 && sucursalTotalSum > 0"
                type="pie"
                width="100%"
                height="280"
                :options="sucursalChartOptions"
                :series="sucursalSeries"
              />
              <div v-else class="text-grey-5 text-center q-pa-md">
                Sin datos de deuda por sucursal
              </div>
            </div>
          </div>
        </div>

        <!-- GRÁFICA 2: DEUDA POR DEPARTAMENTO -->
        <div class="col-12 col-md-6">
          <div class="chart-box">
            <div class="chart-header-row row items-center justify-between q-pa-sm">
              <div class="row items-center q-gutter-x-xs">
                <q-icon name="category" size="20px" color="cyan-4" />
                <span class="text-subtitle2 text-weight-bold text-white">DEUDA POR DEPARTAMENTO</span>
              </div>
              <span class="text-caption text-grey-4 text-weight-bold">
                {{ formatMoneyInt(carteraData.totales?.cartera_total) }}
              </span>
            </div>
            <div class="q-pa-sm flex flex-center" style="min-height: 290px;">
              <apexchart
                v-if="deptoSeries.length > 0 && deptoTotalSum > 0"
                type="pie"
                width="100%"
                height="280"
                :options="deptoChartOptions"
                :series="deptoSeries"
              />
              <div v-else class="text-grey-5 text-center q-pa-md">
                Sin datos de deuda por departamento
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TABLA: ANTIGÜEDAD DE CARTERA POR DEPARTAMENTO -->
      <div class="cartera-table-card q-mb-md" v-if="deptoData.length">
        <div class="cartera-banner-header text-center text-weight-bolder">
          ANTIGÜEDAD DE CARTERA POR DEPARTAMENTO
        </div>
        <div class="cartera-table-wrap">
          <table class="cartera-etbsa-table">
            <thead>
              <tr>
                <th class="text-left th-cliente">DEPARTAMENTO</th>
                <th class="text-right">MAS DE 90</th>
                <th class="text-right">MAS DE 60</th>
                <th class="text-right">MAS DE 30</th>
                <th class="text-right">MAS DE 15</th>
                <th class="text-right">DE 1 Y 15 DIAS</th>
                <th class="text-right">POR VENCER</th>
                <th class="text-right th-highlight">TOTAL VENCIDO</th>
                <th class="text-right th-total">CARTERA TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dep, dIdx) in deptoData" :key="dIdx">
                <td class="text-left text-weight-bold td-cliente">
                  {{ dep.depto }}
                  <span class="text-caption text-grey-5 q-ml-xs" v-if="dep.total_documentos">
                    ({{ dep.total_documentos }} folio{{ dep.total_documentos > 1 ? 's' : '' }})
                  </span>
                </td>
                <td
                  class="text-right"
                  :class="{ 'text-red-4 text-weight-bolder': (dep.mas_de_90 || 0) > 0 }"
                >
                  {{ formatMoneyInt(dep.mas_de_90) }}
                </td>
                <td class="text-right">{{ formatMoneyInt(dep.mas_de_60) }}</td>
                <td class="text-right">{{ formatMoneyInt(dep.mas_de_30) }}</td>
                <td class="text-right">{{ formatMoneyInt(dep.mas_de_15) }}</td>
                <td class="text-right">{{ formatMoneyInt(dep.de_1_a_15) }}</td>
                <td class="text-right">{{ formatMoneyInt(dep.por_vencer) }}</td>
                <td class="text-right text-weight-bold td-vencido">
                  {{ formatMoneyInt(dep.total_vencido) }}
                </td>
                <td class="text-right text-weight-bold td-cartera-total">
                  {{ formatMoneyInt(dep.total) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="cartera-total-row">
                <td class="text-left text-weight-bolder">Total Departamentos</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.mas_de_90) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.mas_de_60) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.mas_de_30) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.mas_de_15) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.de_1_a_15) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.por_vencer) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.total_vencido) }}</td>
                <td class="text-right text-weight-bolder">{{ formatMoneyInt(carteraData.totales?.cartera_total) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- SECCIÓN DESPLEGABLE: DETALLE DE FOLIOS / FACTURAS -->
      <q-expansion-item
        v-if="carteraData.detalles?.length"
        dense
        dense-toggle
        expand-separator
        icon="receipt_long"
        label="Ver desglose detallado de folios y facturas"
        header-class="text-weight-bold text-grey-3 bg-dark-card rounded-borders"
        class="q-mt-sm"
      >
        <div class="q-pa-xs q-mt-xs">
          <q-table
            flat
            bordered
            dark
            dense
            :rows="carteraData.detalles"
            :columns="detalleColumns"
            row-key="id"
            hide-pagination
            :pagination="{ rowsPerPage: 0 }"
            class="detalle-table-scroll"
          >
            <template v-slot:body="props">
              <q-tr
                :props="props"
                :class="{ 'row-vencido-90': (props.row.mas_de_90 || 0) > 0 }"
              >
                <q-td key="folio" :props="props" class="text-left font-mono">
                  <q-badge
                    v-if="(props.row.mas_de_90 || 0) > 0"
                    color="red-10"
                    text-color="white"
                    class="q-mr-xs text-weight-bold"
                    label="+90 días"
                  />
                  {{ props.row.folio }}
                </q-td>
                <q-td key="sucursal" :props="props">{{ props.row.sucursal }}</q-td>
                <q-td key="depto" :props="props">{{ props.row.depto }}</q-td>
                <q-td key="fecha_vencimiento" :props="props" class="text-center">{{ props.row.fecha_vencimiento }}</q-td>
                <q-td
                  key="mas_de_90"
                  :props="props"
                  class="text-right"
                  :class="(props.row.mas_de_90 || 0) > 0 ? 'text-red-4 text-weight-bolder td-mas90-cell' : 'text-grey-6'"
                >
                  {{ formatMoneyInt(props.row.mas_de_90) }}
                </q-td>
                <q-td key="mas_de_60" :props="props" class="text-right">{{ formatMoneyInt(props.row.mas_de_60) }}</q-td>
                <q-td key="mas_de_30" :props="props" class="text-right">{{ formatMoneyInt(props.row.mas_de_30) }}</q-td>
                <q-td key="mas_de_15" :props="props" class="text-right">{{ formatMoneyInt(props.row.mas_de_15) }}</q-td>
                <q-td key="de_1_a_15" :props="props" class="text-right">{{ formatMoneyInt(props.row.de_1_a_15) }}</q-td>
                <q-td key="por_vencer" :props="props" class="text-right">{{ formatMoneyInt(props.row.por_vencer) }}</q-td>
                <q-td key="total_vencido" :props="props" class="text-right text-weight-bold text-red-4">
                  {{ formatMoneyInt(props.row.total_vencido) }}
                </q-td>
                <q-td key="cartera_total" :props="props" class="text-right text-weight-bold text-yellow-4">
                  {{ formatMoneyInt(props.row.cartera_total) }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-expansion-item>

      <!-- TABLA DETALLE INGRESOS (SEGUNDA FUENTE DE GOOGLE SHEETS) -->
      <div class="cartera-table-card q-mt-lg q-mb-md" v-if="ingresosData.length">
        <div class="cartera-banner-header text-center text-weight-bolder">
          DETALLE INGRESOS
        </div>
        <div class="cartera-table-wrap detalle-table-scroll">
          <table class="cartera-etbsa-table">
            <thead>
              <tr>
                <th class="text-center" style="min-width: 90px;">ID_Cliente</th>
                <th class="text-left th-cliente" style="min-width: 180px;">CLIENTE</th>
                <th class="text-center" style="min-width: 60px;">Año</th>
                <th class="text-center" style="min-width: 80px;">Mes</th>
                <th class="text-center" style="min-width: 50px;">Dia</th>
                <th class="text-center" style="min-width: 90px;">FOLIO</th>
                <th class="text-left" style="min-width: 220px;">Descripcion</th>
                <th class="text-right" style="min-width: 110px;">CREDITO</th>
                <th class="text-right" style="min-width: 100px;">CONTADO</th>
                <th class="text-right" style="min-width: 110px;">NOTA DEBITO</th>
                <th class="text-right" style="min-width: 110px;">NOTA CREDITO</th>
                <th class="text-right" style="min-width: 130px;">PAGOS COBRANZA</th>
                <th class="text-right" style="min-width: 130px;">PAGOS MOSTRADOR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in ingresosData" :key="idx">
                <td class="text-center font-mono">{{ item.id_cliente }}</td>
                <td class="text-left text-weight-medium td-cliente">{{ item.cliente }}</td>
                <td class="text-center">{{ item.ano }}</td>
                <td class="text-center text-lowercase">{{ item.mes }}</td>
                <td class="text-center">{{ item.dia }}</td>
                <td class="text-center font-mono text-weight-bold">{{ item.folio }}</td>
                <td class="text-left">{{ item.descripcion }}</td>
                <td class="text-right">{{ formatCellMoney(item.credito) }}</td>
                <td class="text-right">{{ formatCellMoney(item.contado) }}</td>
                <td class="text-right">{{ formatCellMoney(item.nota_debito) }}</td>
                <td class="text-right">{{ formatCellMoney(item.nota_credito) }}</td>
                <td class="text-right">{{ formatCellMoney(item.pagos_cobranza) }}</td>
                <td class="text-right">{{ formatCellMoney(item.pagos_mostrador) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="cartera-total-row">
                <td colspan="7" class="text-left text-weight-bolder" style="padding-left: 20px;">
                  Total
                </td>
                <td class="text-right text-weight-bolder">
                  {{ formatCellMoney(carteraData.ingresos?.totales?.credito) }}
                </td>
                <td class="text-right text-weight-bolder">
                  {{ formatCellMoney(carteraData.ingresos?.totales?.contado) }}
                </td>
                <td class="text-right text-weight-bolder">
                  {{ formatCellMoney(carteraData.ingresos?.totales?.nota_debito) }}
                </td>
                <td class="text-right text-weight-bolder">
                  {{ formatCellMoney(carteraData.ingresos?.totales?.nota_credito) }}
                </td>
                <td class="text-right text-weight-bolder">
                  {{ formatCellMoney(carteraData.ingresos?.totales?.pagos_cobranza) }}
                </td>
                <td class="text-right text-weight-bolder">
                  {{ formatCellMoney(carteraData.ingresos?.totales?.pagos_mostrador) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import apexchart from "vue3-apexcharts";
import { api } from "src/boot/axios";
import { formatCurrency } from "src/boot/format";
import { Notify } from "quasar";

const props = defineProps({
  cliente: {
    type: Object,
    default: () => ({}),
  },
});

const loading = ref(false);
const syncing = ref(false);
const carteraData = ref(null);

const currentClienteNombre = computed(() => {
  return (
    props.cliente?.nombre_completo ||
    props.cliente?.nombre ||
    props.cliente?.razon_social ||
    ""
  );
});

const pctVencido = computed(() => {
  const total = Number(carteraData.value?.totales?.cartera_total) || 0;
  const vencido = Number(carteraData.value?.totales?.total_vencido) || 0;
  if (total <= 0) return 0;
  return ((vencido / total) * 100).toFixed(1);
});

const formatMoneyInt = (val) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(val || 0));
};

const formatCellMoney = (val) => {
  const num = Number(val);
  if (!num || num === 0) return "";
  return formatMoneyInt(num);
};

const ingresosData = computed(() => {
  return carteraData.value?.ingresos?.items || [];
});

// Colores elegantes y contrastados para gráficas de pastel
const chartColors = [
  "#3b82f6", // azul
  "#10b981", // verde esmeralda
  "#f59e0b", // ámbar
  "#ec4899", // rosa
  "#8b5cf6", // violeta
  "#06b6d4", // cian
  "#f97316", // naranja
  "#6366f1", // índigo
  "#14b8a6", // teal
  "#e11d48", // rojo carmesí
];

// --- GRÁFICA: DEUDA POR SUCURSAL ---
const sucursalData = computed(() => {
  if (carteraData.value?.por_sucursal?.length) {
    return carteraData.value.por_sucursal;
  }
  const map = {};
  (carteraData.value?.detalles || []).forEach((d) => {
    const k = d.sucursal || "Sin Sucursal";
    map[k] = (map[k] || 0) + (Number(d.cartera_total) || 0);
  });
  return Object.keys(map).map((k) => ({ sucursal: k, total: map[k] }));
});

const sucursalSeries = computed(() => {
  return sucursalData.value.map((s) => Number(s.total) || 0);
});

const sucursalLabels = computed(() => {
  return sucursalData.value.map((s) => s.sucursal);
});

const sucursalTotalSum = computed(() => {
  return sucursalSeries.value.reduce((acc, val) => acc + val, 0);
});

const sucursalChartOptions = computed(() => ({
  chart: {
    type: "pie",
    background: "transparent",
    foreColor: "#cbd5e1",
    toolbar: { show: false },
  },
  labels: sucursalLabels.value,
  colors: chartColors,
  stroke: {
    colors: ["#111827"],
    width: 2,
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => val.toFixed(1) + "%",
    style: {
      fontSize: "11px",
      fontWeight: 700,
      colors: ["#ffffff"],
    },
    dropShadow: { enabled: false },
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontSize: "12px",
    labels: { colors: "#cbd5e1" },
    markers: { radius: 12 },
    itemMargin: { horizontal: 8, vertical: 4 },
  },
  tooltip: {
    theme: "dark",
    y: {
      formatter: (val) => formatMoneyInt(val),
    },
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        chart: { width: "100%" },
        legend: { position: "bottom" },
      },
    },
  ],
}));

// --- GRÁFICA: DEUDA POR DEPARTAMENTO ---
const deptoData = computed(() => {
  if (carteraData.value?.por_depto?.length) {
    return carteraData.value.por_depto;
  }
  const map = {};
  (carteraData.value?.detalles || []).forEach((d) => {
    const k = d.depto || "Sin Departamento";
    map[k] = (map[k] || 0) + (Number(d.cartera_total) || 0);
  });
  return Object.keys(map).map((k) => ({ depto: k, total: map[k] }));
});

const deptoSeries = computed(() => {
  return deptoData.value.map((d) => Number(d.total) || 0);
});

const deptoLabels = computed(() => {
  return deptoData.value.map((d) => d.depto);
});

const deptoTotalSum = computed(() => {
  return deptoSeries.value.reduce((acc, val) => acc + val, 0);
});

const deptoChartOptions = computed(() => ({
  chart: {
    type: "pie",
    background: "transparent",
    foreColor: "#cbd5e1",
    toolbar: { show: false },
  },
  labels: deptoLabels.value,
  colors: [
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f97316",
    "#14b8a6",
    "#a855f7",
    "#64748b",
  ],
  stroke: {
    colors: ["#111827"],
    width: 2,
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => val.toFixed(1) + "%",
    style: {
      fontSize: "11px",
      fontWeight: 700,
      colors: ["#ffffff"],
    },
    dropShadow: { enabled: false },
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontSize: "12px",
    labels: { colors: "#cbd5e1" },
    markers: { radius: 12 },
    itemMargin: { horizontal: 8, vertical: 4 },
  },
  tooltip: {
    theme: "dark",
    y: {
      formatter: (val) => formatMoneyInt(val),
    },
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        chart: { width: "100%" },
        legend: { position: "bottom" },
      },
    },
  ],
}));

const detalleColumns = [
  { name: "folio", label: "Folio", field: "folio", align: "left", sortable: true },
  { name: "sucursal", label: "Sucursal", field: "sucursal", align: "left", sortable: true },
  { name: "depto", label: "Departamento", field: "depto", align: "left", sortable: true },
  { name: "fecha_vencimiento", label: "Vencimiento", field: "fecha_vencimiento", align: "center", sortable: true },
  { name: "mas_de_90", label: "+90 Días", field: (r) => formatMoneyInt(r.mas_de_90), align: "right", sortable: true },
  { name: "mas_de_60", label: "+60 Días", field: (r) => formatMoneyInt(r.mas_de_60), align: "right", sortable: true },
  { name: "mas_de_30", label: "+30 Días", field: (r) => formatMoneyInt(r.mas_de_30), align: "right", sortable: true },
  { name: "mas_de_15", label: "+15 Días", field: (r) => formatMoneyInt(r.mas_de_15), align: "right", sortable: true },
  { name: "de_1_a_15", label: "1-15 Días", field: (r) => formatMoneyInt(r.de_1_a_15), align: "right", sortable: true },
  { name: "por_vencer", label: "Por Vencer", field: (r) => formatMoneyInt(r.por_vencer), align: "right", sortable: true },
  { name: "total_vencido", label: "Total Vencido", field: "total_vencido", align: "right", sortable: true },
  { name: "cartera_total", label: "Cartera Total", field: "cartera_total", align: "right", sortable: true },
];

const loadCarteraData = async () => {
  const nombre = currentClienteNombre.value;
  const clienteId = props.cliente?.id;

  if (!nombre && !clienteId && !props.cliente?.equip) return;

  loading.value = true;
  try {
    const res = await api.get("/api/intranet/cartera-vencida/cliente", {
      params: {
        cliente_id: clienteId,
        nombre: nombre,
        equip: props.cliente?.equip,
      },
    });
    carteraData.value = res.data;
  } catch (error) {
    console.error("Error al cargar cartera vencida:", error);
    Notify.create({
      type: "negative",
      message: "Error al obtener la cartera vencida.",
      position: "top",
    });
  } finally {
    loading.value = false;
  }
};

const syncGoogleSheet = async () => {
  syncing.value = true;
  try {
    const res = await api.post("/api/intranet/cartera-vencida/sync");
    Notify.create({
      type: res.data?.success ? "positive" : "negative",
      message: res.data?.message || "Sincronización completada.",
      position: "top",
    });
    await loadCarteraData();
  } catch (error) {
    console.error("Error al sincronizar cartera vencida:", error);
    Notify.create({
      type: "negative",
      message: "Error al contactar con el servidor.",
      position: "top",
    });
  } finally {
    syncing.value = false;
  }
};

onMounted(() => {
  loadCarteraData();
});

watch(
  () => props.cliente,
  (newVal) => {
    if (newVal) loadCarteraData();
  },
  { deep: true }
);
</script>

<style scoped>
.cartera-vencida-container {
  background-color: #0b111e;
  min-height: 500px;
  border-radius: 8px;
}

.bg-dark-card {
  background-color: #131b29;
  border: 1px solid #28374d;
}

.kpi-box {
  background: linear-gradient(135deg, #131b29 0%, #1a2436 100%);
  border: 1px solid #28374d;
  border-radius: 6px;
  padding: 12px 8px;
  height: 100%;
}

/* TABLA CARTERA VENCIDA ETBSA IDÉNTICA A LA IMAGEN */
.cartera-table-card {
  background-color: #111827;
  border: 1px solid #374151;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
}

.cartera-banner-header {
  background: #c62828;
  color: #ffffff;
  font-size: 14px;
  letter-spacing: 0.8px;
  padding: 8px 12px;
  border-bottom: 2px solid #8e0000;
}

.cartera-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.cartera-etbsa-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  color: #f3f4f6;
  white-space: nowrap;
}

.cartera-etbsa-table th {
  background-color: #182234;
  color: #ffffff;
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 0.5px;
  padding: 10px 12px;
  border-right: 1px solid #2a3a52;
  border-bottom: 1px solid #3b82f6;
}

.cartera-etbsa-table th:last-child {
  border-right: none;
}

.cartera-etbsa-table th.th-cliente {
  min-width: 180px;
}

.cartera-etbsa-table th.th-highlight {
  background-color: #1e293b;
  color: #fca5a5;
}

.cartera-etbsa-table th.th-total {
  background-color: #1e293b;
  color: #fef08a;
}

.cartera-etbsa-table td {
  padding: 10px 12px;
  background-color: #0f172a;
  border-right: 1px solid #1e293b;
  border-bottom: 1px solid #1e293b;
  font-variant-numeric: tabular-nums;
}

.cartera-etbsa-table td:last-child {
  border-right: none;
}

.cartera-etbsa-table td.td-cliente {
  color: #ffffff;
  background-color: #0d1525;
}

.cartera-etbsa-table td.td-vencido {
  color: #fca5a5;
}

.cartera-etbsa-table td.td-cartera-total {
  color: #fef08a;
}

/* FILA DE TOTAL (ROJO SÓLIDO COMO EN LA IMAGEN) */
.cartera-total-row td {
  background-color: #8b151e !important;
  color: #ffffff !important;
  font-weight: 800;
  border-right: 1px solid #a31c26;
  border-top: 2px solid #b91c1c;
  padding: 10px 12px;
}

.cartera-total-row td:last-child {
  border-right: none;
}

/* TABLA DE DESGLOSE CON SCROLLBAR Y HEADER FIJO */
.detalle-table-scroll {
  max-height: 480px;
}

.cartera-table-wrap.detalle-table-scroll {
  max-height: 480px;
  overflow-y: auto;
  overflow-x: auto;
}

.cartera-table-wrap.detalle-table-scroll thead th {
  position: sticky;
  top: 0;
  z-index: 3;
  background-color: #182234;
}

.cartera-table-wrap.detalle-table-scroll tfoot td {
  position: sticky;
  bottom: 0;
  z-index: 3;
}

.cartera-table-wrap.detalle-table-scroll::-webkit-scrollbar,
.detalle-table-scroll :deep(.q-table__middle)::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.cartera-table-wrap.detalle-table-scroll::-webkit-scrollbar-track,
.detalle-table-scroll :deep(.q-table__middle)::-webkit-scrollbar-track {
  background: #0b111e;
}

.cartera-table-wrap.detalle-table-scroll::-webkit-scrollbar-thumb,
.detalle-table-scroll :deep(.q-table__middle)::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}

.cartera-table-wrap.detalle-table-scroll::-webkit-scrollbar-thumb:hover,
.detalle-table-scroll :deep(.q-table__middle)::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}

/* FILAS Y CELDAS RESALTADAS DE ROJO PARA +90 DÍAS */
.row-vencido-90 {
  background-color: rgba(185, 28, 28, 0.16) !important;
}

.row-vencido-90:hover {
  background-color: rgba(185, 28, 28, 0.28) !important;
}

.row-vencido-90 td {
  border-bottom: 1px solid rgba(239, 68, 68, 0.3) !important;
}

.td-mas90-cell {
  background-color: rgba(220, 38, 38, 0.22) !important;
  color: #ff6b6b !important;
}

/* CAJAS PARA GRÁFICAS DE PASTEL */
.chart-box {
  background: linear-gradient(135deg, #111827 0%, #172235 100%);
  border: 1px solid #28374d;
  border-radius: 6px;
  overflow: hidden;
  height: 100%;
}

.chart-header-row {
  background-color: #0f172a;
  border-bottom: 1px solid #1e293b;
}
</style>
