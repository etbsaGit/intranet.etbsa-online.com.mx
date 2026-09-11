<template>
  <q-card flat bordered class="bg-white rounded-borders shadow-1 full-height column">
    <q-card-section class="q-pb-none row items-center justify-between">
      <div class="text-subtitle1 text-weight-bold text-grey-9 flex items-center q-gutter-xs">
        <q-icon name="timelapse" color="orange-9" />
        <span>Antigüedad de Saldos (Aging de Cartera)</span>
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
        <q-icon name="check_circle_outline" size="xl" color="positive" />
        <div class="text-body2 q-mt-sm">No hay saldos pendientes o en mora registrados</div>
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
    default: () => ({ labels: [], series: [] }),
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
  return {
    chart: {
      type: "donut",
      height: 280,
      fontFamily: "inherit",
    },
    labels: props.data?.labels || [
      "Al Corriente",
      "Vencido 1-30 días",
      "Vencido 31-60 días",
      "Vencido 61-90 días",
      "Vencido +90 días",
    ],
    colors: ["#2e7d32", "#fbc02d", "#f57c00", "#e64a19", "#d32f2f"],
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Saldo Total",
              fontSize: "13px",
              fontWeight: 600,
              color: "#616161",
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return formatCurrency(total);
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
        formatter: (val) => formatCurrency(val || 0),
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
