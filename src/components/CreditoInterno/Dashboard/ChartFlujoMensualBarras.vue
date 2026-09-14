<template>
  <q-card flat bordered class="bg-white rounded-borders shadow-1 full-height column">
    <q-card-section class="q-pb-none row items-center justify-between">
      <div class="text-subtitle1 text-weight-bold text-grey-9 flex items-center q-gutter-xs">
        <q-icon name="bar_chart" color="primary" />
        <span>Flujo Mensual: Cobranza Real vs Programada (Barras)</span>
      </div>
      <q-badge color="blue-1" text-color="primary" class="text-weight-bold">
        Año {{ year }}
      </q-badge>
    </q-card-section>

    <q-card-section class="col q-pa-sm">
      <div v-if="hasData" style="min-height: 320px">
        <VueApexCharts
          type="bar"
          height="320"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>
      <div
        v-else
        class="column items-center justify-center text-grey-5"
        style="height: 320px"
      >
        <q-icon name="bar_chart" size="xl" />
        <div class="text-body2 q-mt-sm">Sin datos registrados para el período seleccionado</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { formatCurrency } from "src/boot/format";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ categories: [], series: [] }),
  },
  year: {
    type: [Number, String],
    default: new Date().getFullYear(),
  },
});

const hasData = computed(() => {
  return (
    props.data?.series &&
    props.data.series.some((s) => s.data && s.data.some((v) => Number(v) > 0))
  );
});

const chartSeries = computed(() => {
  return props.data?.series || [];
});

const chartOptions = computed(() => {
  return {
    chart: {
      type: "bar",
      height: 320,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
      },
    },
    colors: ["#2e7d32", "#1976d2"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: props.data?.categories || [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => {
          if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
          if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
          return `$${val}`;
        },
        style: {
          colors: "#616161",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => formatCurrency(val || 0),
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    grid: {
      borderColor: "#f0f0f0",
      strokeDashArray: 3,
    },
  };
});
</script>
