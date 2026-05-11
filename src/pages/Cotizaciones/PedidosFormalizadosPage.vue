<template>
  <BaseCatalogo title="Asignación de Número de Serie" :columns="columns"
    url="/api/intranet/trackingAutorizaciones/Formalizado">

    <template v-slot:body-cell-detalles="props">
      <q-td :props="props">

        <!-- Ver detalles -->
        <q-btn flat round dense icon="visibility" color="primary" class="q-mr-sm" @click="verDetalles(props.row)" />

        <!-- Descargar PDF -->
        <q-btn flat round dense icon="download" color="green" @click="descargarPDF(props.row)"
          :loading="loadingPdfId === props.row.id" />

      </q-td>
    </template>
  </BaseCatalogo>

  <!-- modal detalles -->
  <BaseDialog full-width v-model="showDetails" mode="edit">
    <template #form>
      <DetallesModal :cotizacion="item" @success="onSuccess" />
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
import DetallesModal from "src/components/Cotizaciones/DetallesModal.vue";

const showDetails = ref(false);
const item = ref(null);
const edit = ref(null);

const crud = useCrudStore();

const baseURL = "/api/intranet/trackingAutorizaciones/Formalizado";

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
