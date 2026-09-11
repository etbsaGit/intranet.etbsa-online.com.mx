<template>
  <q-card flat bordered class="bg-white rounded-borders shadow-1 full-height column">
    <q-card-section class="q-pb-none row items-center justify-between">
      <div class="text-subtitle1 text-weight-bold text-grey-9 flex items-center q-gutter-xs">
        <q-icon name="category" color="indigo" />
        <span>Colocación y Recuperación por Línea de Crédito</span>
      </div>
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
        <div class="text-body2 q-mt-sm">Sin datos por línea de crédito</div>
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
});

const hasData = computed(() => {
  return (
    props.data?.categories &&
    props.data.categories.length > 0 &&
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
        show: false,
      },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
        borderRadius: 4,
        barHeight: "65%",
      },
    },
    colors: ["#0288d1", "#2e7d32"],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: props.data?.categories || [],
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
    yaxis: {
      labels: {
        style: {
          colors: "#424242",
          fontSize: "12px",
          fontWeight: 500,
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
