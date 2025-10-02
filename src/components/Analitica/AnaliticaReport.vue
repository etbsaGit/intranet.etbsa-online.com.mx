<template>
  <div v-if="data != null" class="report-container">
    <ResumenCard :analitica="data.analitica" />

    <!-- Cards -->
    <ClienteCard :cliente="data.analitica.cliente" />
    <ReferenciaCard :referencias="data.analitica.cliente.referencia" />
    <ReferenciaComercialCard
      :referencias="data.analitica.cliente.referencia_comercial"
    />
    <IngresoCard :ingresos="data.analitica.cliente.ingresos" />
    <FincaCard :fincas="data.analitica.cliente.fincas" />
    <InvercionAgricolaCard :inverciones="data.totales.agricolas" />
    <InvercionGanaderaCard :inverciones="data.totales.ganaderas" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { date } from "quasar";

import { formatCurrency } from "src/boot/format";

import ClienteCard from "src/components/Analitica/AnaliticaReport/ClienteCard.vue";
import ReferenciaCard from "src/components/Analitica/AnaliticaReport/ReferenciaCard.vue";
import ReferenciaComercialCard from "src/components/Analitica/AnaliticaReport/ReferenciaComercialCard.vue";
import InvercionAgricolaCard from "src/components/Analitica/AnaliticaReport/InvercionAgricolaCard.vue";
import InvercionGanaderaCard from "src/components/Analitica/AnaliticaReport/InvercionGanaderaCard.vue";
import FincaCard from "src/components/Analitica/AnaliticaReport/FincaCard.vue";
import IngresoCard from "src/components/Analitica/AnaliticaReport/IngresoCard.vue";
import ResumenCard from "./AnaliticaReport/ResumenCard.vue";

const { id } = defineProps(["id"]);

const data = ref(null);

const getInfo = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/analitica/report/" + id,
    ""
  );
  data.value = res;
};

onMounted(() => {
  getInfo(id);
});

function formatDate(value) {
  return date.formatDate(value, "DD/MM/YYYY");
}
</script>

<style scoped>
.report-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

/* Estilo para resumen analítica */
.summary-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.summary-header {
  font-size: 1.4rem;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 10px;
}

.summary-body div {
  margin-bottom: 5px;
  font-size: 1rem;
}

.summary-body strong {
  color: #424242;
}

/* Estilo general para las cards */
.report-container ::v-deep(.q-card) {
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: white;
}

.report-container ::v-deep(.q-card:hover) {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.report-container ::v-deep(.q-card-section) {
  padding: 15px;
}

.report-container ::v-deep(.q-item-label) {
  font-weight: bold;
  font-size: 1.2rem;
}

.report-container ::v-deep(.text-h6) {
  font-weight: 600;
}

.report-container ::v-deep(.text-caption) {
  font-size: 0.9rem;
}

.report-container ::v-deep(.q-icon) {
  transition: transform 0.3s ease;
}

.report-container ::v-deep(.q-icon:hover) {
  transform: scale(1.2);
}
</style>
