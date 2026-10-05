<template>
  <div class="pbi-tendencias-container q-mt-lg">
    <!-- ENCABEZADO DE LA SECCIÓN DE TENDENCIAS -->
    <div class="pbi-section-header row items-center justify-between q-pa-sm">
      <div class="row items-center">
        <q-icon name="show_chart" size="24px" color="teal-4" class="q-mr-sm" />
        <span class="text-subtitle1 text-weight-bolder text-white">
          TENDENCIAS ANUALES POR DEPARTAMENTO (2012 - 2026)
        </span>
      </div>
      <div class="row items-center q-gutter-xs">
        <q-btn-toggle
          v-model="activeFilter"
          dense
          rounded
          toggle-color="primary"
          color="dark"
          text-color="grey-4"
          toggle-text-color="white"
          :options="[
            { label: 'Todas', value: 'all' },
            { label: 'Ventas', value: 'venta' },
            { label: 'Márgenes', value: 'margen' },
          ]"
        />
      </div>
    </div>

    <!-- SI NO HAY DATOS ANUALES -->
    <div
      v-if="!tendencias || tendencias.length === 0"
      class="text-center q-pa-lg text-grey-4 bg-dark rounded-borders q-mt-sm"
    >
      <q-icon name="info" size="36px" color="grey-5" class="q-mb-xs" />
      <div>No se encontraron registros de tendencias anuales para este cliente.</div>
    </div>

    <!-- CONTENEDOR DE GRÁFICAS -->
    <div v-else class="q-mt-sm">
      <!-- SECCIÓN VENTAS (IMÁGENES 1 Y 2) -->
      <div v-if="activeFilter === 'all' || activeFilter === 'venta'" class="q-mb-md">
        <div class="section-title text-caption text-weight-bold text-green-4 q-mb-sm row items-center">
          <q-icon name="payments" size="18px" class="q-mr-xs" />
          VENTA POR DEPARTAMENTO (LÍNEA DE TIEMPO ANUAL)
        </div>

        <div class="column q-gutter-y-sm">
          <div
            v-for="chart in ventaCharts"
            :key="chart.key"
            class="chart-card"
          >
            <div class="chart-header row items-center justify-between">
              <span class="chart-title">{{ chart.label }}</span>
              <span class="text-caption text-weight-bold" :style="{ color: chart.color }">
                Total acumulado: {{ formatCurrency(getAccumulated(chart.key)) }}
              </span>
            </div>
            <div class="chart-body">
              <apexchart
                type="line"
                height="150"
                :options="getOptions(chart)"
                :series="getSeries(chart)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN MÁRGENES (IMÁGENES 3 Y 4) -->
      <div v-if="activeFilter === 'all' || activeFilter === 'margen'" class="q-mb-md">
        <div class="section-title text-caption text-weight-bold text-orange-4 q-mb-sm row items-center">
          <q-icon name="trending_up" size="18px" class="q-mr-xs" />
          MARGEN POR DEPARTAMENTO (LÍNEA DE TIEMPO ANUAL)
        </div>

        <div class="column q-gutter-y-sm">
          <div
            v-for="chart in margenCharts"
            :key="chart.key"
            class="chart-card"
          >
            <div class="chart-header row items-center justify-between">
              <span class="chart-title">{{ chart.label }}</span>
              <span class="text-caption text-weight-bold" :style="{ color: chart.color }">
                Total acumulado: {{ formatCurrency(getAccumulated(chart.key)) }}
              </span>
            </div>
            <div class="chart-body">
              <apexchart
                type="line"
                height="150"
                :options="getOptions(chart)"
                :series="getSeries(chart)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import apexchart from "vue3-apexcharts";
import { formatCurrency } from "src/boot/format";

const props = defineProps({
  tendencias: {
    type: Array,
    default: () => [],
  },
});

const activeFilter = ref("all");

// Rango completo de años a mostrar (2012 a 2026 como en Power BI)
const years = [
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
];

// Configuración de gráficas de VENTA
const ventaCharts = [
  { key: "venta_maquinaria", label: "Maquinaria - ( Venta )", color: "#00e676" },
  { key: "venta_refacciones", label: "Refacciones - ( Venta )", color: "#00e676" },
  { key: "venta_servicio", label: "Servicio - ( Venta )", color: "#00e676" },
  { key: "venta_riego", label: "Riego - ( Venta )", color: "#00e676" },
  { key: "venta_nuevas_tecnologias", label: "Nuevas Tecnologias - ( Venta )", color: "#e040fb" },
  { key: "venta_chevron", label: "Chevron - ( Venta )", color: "#0091ea" },
];

// Configuración de gráficas de MARGEN (color naranja/coral como en las capturas 3 y 4)
const margenCharts = [
  { key: "margen_maquinaria", label: "Maquinaria - ( Margen )", color: "#ff6e40" },
  { key: "margen_refacciones", label: "Refacciones - ( Margen )", color: "#ff6e40" },
  { key: "margen_servicio", label: "Servicio - ( Margen )", color: "#ff6e40" },
  { key: "margen_riego", label: "Riego - ( Margen )", color: "#ff6e40" },
  { key: "margen_nuevas_tecnologias", label: "Nuevas Tecnologias - ( Margen )", color: "#ff6e40" },
  { key: "margen_chevron", label: "Chevron - ( Margen )", color: "#ff6e40" },
];

// Total acumulado por columna
const getAccumulated = (key) => {
  if (!props.tendencias || !Array.isArray(props.tendencias)) return 0;
  return props.tendencias.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
};

// Formato compacto con signo de pesos y separadores de miles
const formatNumberVal = (val) => {
  if (!val || val === 0) return "$0";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(val);
};

// Obtiene la serie para cada gráfica
const getSeries = (config) => {
  const data = years.map((yr) => {
    const record = props.tendencias.find((t) => Number(t.anio) === yr);
    return record ? Math.round(Number(record[config.key]) || 0) : 0;
  });
  return [
    {
      name: config.label,
      data,
    },
  ];
};

// Opciones de ApexCharts adaptadas al diseño PowerBI oscuro de las capturas
const getOptions = (config) => {
  return {
    chart: {
      type: "line",
      height: 150,
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 500,
      },
    },
    colors: [config.color],
    stroke: {
      curve: "straight",
      width: 2.2,
    },
    markers: {
      size: 4,
      colors: [config.color],
      strokeColors: "#ffffff",
      strokeWidth: 1.5,
      hover: { size: 6 },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => formatNumberVal(val),
      offsetY: -6,
      style: {
        fontSize: "9px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontWeight: 600,
        colors: ["#ffffff"],
      },
      background: {
        enabled: true,
        foreColor: "#ffffff",
        padding: 2,
        borderRadius: 2,
        borderWidth: 0,
        opacity: 0.6,
      },
    },
    grid: {
      borderColor: "rgba(255, 255, 255, 0.08)",
      strokeDashArray: 3,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: { top: 12, bottom: 0, left: 15, right: 15 },
    },
    xaxis: {
      categories: years,
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "10px",
          fontWeight: 600,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: false,
      labels: { show: false },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val) => formatCurrency(val),
      },
    },
  };
};
</script>

<style scoped>
.pbi-tendencias-container {
  border-radius: 6px;
}

.pbi-section-header {
  background: linear-gradient(90deg, #1e293b 0%, #0f172a 100%);
  border-left: 4px solid #00e676;
  border-radius: 4px;
}

.section-title {
  letter-spacing: 0.5px;
  padding-left: 4px;
}

.chart-card {
  background: linear-gradient(135deg, #0e1526 0%, #131b2e 100%);
  border: 1px solid #1e293b;
  border-radius: 6px;
  padding: 8px 12px 4px 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.chart-card:hover {
  border-color: #334155;
  transform: translateY(-1px);
}

.chart-header {
  padding-bottom: 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.chart-title {
  color: #f1f5f9;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.chart-body {
  margin-top: -4px;
}
</style>
