<template>
  <q-card flat bordered class="bg-white rounded-borders shadow-1 full-height column">
    <q-card-section class="q-pb-none row items-center justify-between">
      <div class="text-subtitle1 text-weight-bold text-grey-9 flex items-center q-gutter-xs">
        <q-icon name="donut_large" color="primary" />
        <span>Distribución por Estatus</span>
      </div>
    </q-card-section>

    <q-card-section class="col q-pa-sm flex flex-center">
      <div v-if="hasData" class="full-width" style="min-height: 280px">
        <VueApexCharts
          type="donut"
          height="280"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>
      <div
        v-else
        class="column items-center justify-center text-grey-5"
        style="height: 280px"
      >
        <q-icon name="pie_chart_outline" size="xl" />
        <div class="text-body2 q-mt-sm">Sin solicitudes registradas</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from "vue";
import VueApexCharts from "vue3-apexcharts";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ labels: [], series: [], colors: [] }),
  },
});

const hasData = computed(() => {
  return (
    props.data?.series &&
    props.data.series.some((v) => Number(v) > 0)
  );
});

const chartSeries = computed(() => {
  return (props.data?.series || []).map((v) => Number(v) || 0);
});

const chartOptions = computed(() => {
  const defaultColors = [
    "#1976d2",
    "#2e7d32",
    "#ff9800",
    "#d32f2f",
    "#7b1fa2",
    "#0288d1",
    "#546e7a",
  ];
  const colors =
    props.data?.colors && props.data.colors.length > 0
      ? props.data.colors.map((c, i) => c || defaultColors[i % defaultColors.length])
      : defaultColors;

  return {
    chart: {
      type: "donut",
      height: 280,
      fontFamily: "inherit",
    },
    labels: props.data?.labels || [],
    colors: colors,
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "13px",
              fontWeight: 600,
              color: "#616161",
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return `${total} solicitudes`;
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} solicitudes`,
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "11px",
    },
  };
});
</script>
