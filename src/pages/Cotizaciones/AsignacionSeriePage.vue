<template>
  <BaseCatalogo title="Asignación de Número de Serie" :columns="columns"
    url="/api/intranet/trackingAutorizaciones/Asignacion/Para Asignar/Tractor Asignado">

    <template v-slot:body-cell-detalles="props">
      <q-td :props="props">
        <!-- Historial -->
        <q-btn flat round dense icon="history" color="blue" class="q-mr-sm" @click="verHistorial(props.row)" />

        <!-- Ver detalles -->
        <q-btn flat round dense icon="visibility" color="primary" class="q-mr-sm" @click="verDetalles(props.row)" />

        <!-- Descargar PDF -->
        <q-btn flat round dense icon="download" color="green" @click="descargarPDF(props.row)"
          :loading="loadingPdfId === props.row.id" />



      </q-td>
    </template>

    <template #body-cell-asignado="props">
      <q-td :props="props">
        <q-icon :name="props.value === 'Asignado' ? 'check_circle' : 'cancel'"
          :color="props.value === 'Asignado' ? 'positive' : 'grey'" size="md" />
      </q-td>
    </template>
  </BaseCatalogo>

  <!-- modal detalles -->
  <BaseDialog full-width v-model="showDetails" mode="edit">
    <template #form>
      <AsignacionSerieModal :cotizacion="item" @success="onSuccess" />
    </template>
  </BaseDialog>

  <!-- modal historial -->
  <BaseDialog full-width v-model="showHistorial" mode="">
    <template #form>
      <HistorialTrackingModal :cotizacion="item" />
    </template>
  </BaseDialog>

</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";
import { sendRequest } from "src/boot/functions";
import { api } from "src/boot/axios"
import BaseDialog from "src/bases/BaseDialog.vue";

import BaseCatalogo from "src/bases/BaseCatalogo.vue";
import AsignacionSerieModal from "src/components/Cotizaciones/AsignacionSerieModal.vue";
import HistorialTrackingModal from "src/components/Cotizaciones/HistorialTrackingModal.vue";

const showDetails = ref(false);
const showHistorial = ref(false);
const item = ref(null);
const edit = ref(null);

const crud = useCrudStore();

const baseURL = "/api/intranet/trackingAutorizaciones/Para Asignar/Asignado";

const loadingPdfId = ref(false);

const onSuccess = async () => {
  showDetails.value = false;
  await crud.getPaginatedItems(baseURL);
};

const columns = [
  {
    name: "folio",
    label: "Folio",
    align: "left",
    field: row => `#${row.folio}`,
  },
  {
    name: "categoria",
    label: "Categoria",
    align: "left",
    field: row => row.categoria?.name || "",
  },
  {
    name: "condicion",
    label: "Condición de Pago",
    align: "left",
    field: row => row.condicion_pago?.name || "",
  },
  {
    name: "sucursal",
    label: "Sucursal",
    align: "left",
    field: row => row.sucursal?.nombre || "",
  },
  {
    name: "vendedor_depto",
    label: "Vendedor / Departamento",
    align: "left",
    field: row => row,
    format: row => {
      const vendedor = row.vendedor?.nombreCompleto;
      const depto = row.depto?.nombre;

      return [vendedor, depto].filter(Boolean).join(" - ");
    }
  },
  {
    name: "notificado",
    label: "Notificado",
    align: "left",
    field: row => row.notificado?.nombreCompleto || "",
  },
  {
    name: "asignado",
    label: "Asignado",
    align: "left",
    field: row => row.situacion?.nombre || "",
  },
  {
    name: "detalles",
    label: "Detalles",
    align: "left",
    field: row => row.id,
  },
];

const verDetalles = (row) => {
  item.value = row;
  showDetails.value = true;
};

const verHistorial = (row) => {
  item.value = row;
  showHistorial.value = true;
};

const descargarPDF = async (row) => {
  try {
    loadingPdfId.value = row.id;
    const response = await api.get(
      `/api/intranet/tracking/print-quote/${row.id}`,
      {
        responseType: "blob"
      }
    );
    const file = new Blob(
      [response.data],
      { type: "application/pdf" }
    );
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  } catch (error) {
    console.error(error);
  } finally {
    loadingPdfId.value = null;
  }
};

</script>
