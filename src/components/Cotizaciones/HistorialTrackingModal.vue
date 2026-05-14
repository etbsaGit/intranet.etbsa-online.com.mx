<template>
  <q-form ref="myForm">


    <q-item-section>

      <div class="text-h5 q-mb-md">
        Actualizaciones del pedido con folio: #{{ cotizacion?.folio }}
      </div>

      <q-table class="table-wrap" flat bordered dense :rows="cotizacion?.historial || []" :columns="columnsHistorial" row-key="id"
        hide-pagination :rows-per-page-options="[0]"/>
    </q-item-section>


  </q-form>
</template>



<script setup>
import { ref, watch } from "vue";
import { useCrudStore } from "src/stores/crud";

const feedback = ref("");
const validation = ref(null);
const myForm = ref(null);
const crud = useCrudStore();

const baseURL = "/api/intranet/trackingAutorizacion";

const props = defineProps({
  cotizacion: Object
});

const columnsHistorial = [
  {
    name: "fecha",
    label: "Fecha",
    align: "left",
    field: row => row.created_at,
    format: (val) => formatFecha(val),
  },
  {
    name: "empleado",
    label: "Empleado",
    align: "left",
    field: row => row.empleado?.nombreCompleto || "Administrador",
  },
  {
    name: "situacion",
    label: "Autorización",
    align: "left",
    field: row => row.situacion?.nombre,
  },
  {
    name: "comentarios",
    label: "Comentarios",
    align: "left",
    field: row => row.comentario,
  },
]

const formatFecha = (fecha) => {
  if (!fecha) return "";

  return new Date(fecha).toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


</script>

<style scoped>
.table-wrap :deep(td) {
  white-space: normal;
  word-break: break-word;
}
</style>
