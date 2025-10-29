<template>
  <div v-if="data != null" class="report-container">
    <q-tabs
      v-model="tab"
      dense
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      align="justify"
      narrow-indicator
    >
      <q-tab name="cliente" label="Cliente" />

      <q-tab name="analitica" label="Analitica" />
      <q-tab name="balance" label="Balance" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="cliente">
        <ClienteCard :cliente="data.cliente" />
        <ReferenciaCard :referencias="data.cliente.referencia" />
        <ReferenciaComercialCard
          :referencias="data.cliente.referencia_comercial"
        />
        <docs-card :docs="data.cliente.cliente_doc" />
      </q-tab-panel>

      <q-tab-panel name="analitica">
        <activo-fijo-card :activos="data.activos_fijos" />
        <activo-circulante-card :activos="data.activos_circulantes" />
        <pasivo-card :pasivos="data.pasivos" />
      </q-tab-panel>

      <q-tab-panel name="balance">
        <InvercionAgricolaCard :inverciones="data.ingresos.agricolas" />
        <InvercionGanaderaCard :inverciones="data.ingresos.ganaderas" />
        <IngresoCard :ingresos="data.ingresosDirectos" />
        <GastosCard :gastos="data.otros_gastos" />
      </q-tab-panel>
    </q-tab-panels>
    <q-page-sticky position="bottom-right" :offset="[30, 30]">
      <q-btn
        fab
        color="blue"
        icon="fa-solid fa-file-arrow-down"
        @click="onRowClickPDF"
        class="shadow-8"
      >
        <q-tooltip
          class="text-h6 bg-blue"
          anchor="center left"
          self="center right"
          :offset="[10, 10]"
        >
          Generar reporte
        </q-tooltip>
      </q-btn>
    </q-page-sticky>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { date } from "quasar";

import ClienteCard from "src/components/Analitica/AnaliticaReport/ClienteCard.vue";
import ReferenciaCard from "src/components/Analitica/AnaliticaReport/ReferenciaCard.vue";
import ReferenciaComercialCard from "src/components/Analitica/AnaliticaReport/ReferenciaComercialCard.vue";
import DocsCard from "src/components/Analitica/AnaliticaReport/DocsCard.vue";
import ActivoFijoCard from "src/components/Analitica/AnaliticaReport/ActivoFijoCard.vue";
import ActivoCirculanteCard from "src/components/Analitica/AnaliticaReport/ActivoCirculanteCard.vue";
import PasivoCard from "src/components/Analitica/AnaliticaReport/PasivoCard.vue";
import GastosCard from "src/components/Analitica/AnaliticaReport/GastosCard.vue";
import InvercionAgricolaCard from "src/components/Analitica/AnaliticaReport/InvercionAgricolaCard.vue";
import InvercionGanaderaCard from "src/components/Analitica/AnaliticaReport/InvercionGanaderaCard.vue";
import IngresoCard from "src/components/Analitica/AnaliticaReport/IngresoCard.vue";

const { id } = defineProps(["id"]);

const data = ref(null);
const tab = ref("cliente");

const getInfo = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/analitica/report/" + id,
    ""
  );
  data.value = res;
};

const onRowClickPDF = async () => {
  try {
    // Llamada al backend
    const res = await sendRequest(
      "GET",
      null,
      "/api/intranet/analitica/report/pdf/" + id,
      ""
    );

    // Si `res` es un string JSON, conviértelo
    const { file_name, mime_type, base64 } =
      typeof res === "string" ? JSON.parse(res) : res;

    // Crear un blob a partir del base64
    const base64Response = await fetch(`data:${mime_type};base64,${base64}`);
    const blob = await base64Response.blob();

    // Crear URL temporal y abrir en nueva pestaña
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    // (opcional) Liberar el objeto URL después de un tiempo
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
  }
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
  padding: 0px;
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
