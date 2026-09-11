<template>
  <q-card flat bordered class="bg-white rounded-borders shadow-1">
    <q-card-section class="q-pb-none row items-center justify-between">
      <div class="text-subtitle1 text-weight-bold text-negative flex items-center q-gutter-xs">
        <q-icon name="warning" color="negative" />
        <span>Top Clientes con Mayor Saldo Vencido</span>
      </div>
      <q-badge color="red-1" text-color="negative" class="text-weight-bold">
        Acción Inmediata
      </q-badge>
    </q-card-section>

    <q-card-section class="q-pa-sm">
      <div v-if="clientes && clientes.length > 0">
        <q-table
          flat
          bordered
          dense
          :rows="clientes"
          :columns="columns"
          row-key="folio"
          hide-pagination
          :rows-per-page-options="[0]"
          class="rounded-borders"
        >
          <!-- Columna Cliente -->
          <template v-slot:body-cell-cliente="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-avatar
                  size="26px"
                  color="red-1"
                  text-color="negative"
                  icon="person"
                  class="q-mr-xs"
                />
                <div>
                  <div class="text-weight-bold text-dark">
                    {{ props.row.cliente || "Cliente" }}
                  </div>
                  <div v-if="props.row.telefono" class="text-caption text-grey-7">
                    {{ formatPhoneNumber(props.row.telefono) }}
                  </div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Columna Folio -->
          <template v-slot:body-cell-folio="props">
            <q-td :props="props" align="center">
              <q-chip dense color="indigo-1" text-color="indigo-9" class="text-weight-bold">
                #{{ props.row.folio }}
              </q-chip>
            </q-td>
          </template>

          <!-- Columna Sucursal -->
          <template v-slot:body-cell-sucursal="props">
            <q-td :props="props">
              <q-badge color="grey-3" text-color="grey-9" class="text-weight-medium">
                {{ props.row.sucursal || "General" }}
              </q-badge>
            </q-td>
          </template>

          <!-- Columna Fecha más antigua -->
          <template v-slot:body-cell-fecha_mas_antigua="props">
            <q-td :props="props" align="center">
              <div class="text-caption text-weight-medium text-negative flex items-center justify-center q-gutter-xs">
                <q-icon name="event_busy" size="xs" color="negative" />
                <span>{{ formatFechaLarga(props.row.fecha_mas_antigua) }}</span>
              </div>
            </q-td>
          </template>

          <!-- Columna Saldo en Mora -->
          <template v-slot:body-cell-total_mora="props">
            <q-td :props="props" align="right">
              <span class="text-weight-bolder text-negative text-subtitle2">
                {{ formatCurrency(props.row.total_mora || 0) }}
              </span>
            </q-td>
          </template>
        </q-table>
      </div>

      <div
        v-else
        class="column items-center justify-center text-grey-5 q-pa-lg"
      >
        <q-icon name="task_alt" size="lg" color="positive" />
        <div class="text-subtitle2 text-positive q-mt-xs">¡Excelente!</div>
        <div class="text-caption text-grey-6">No hay clientes con saldos vencidos en este período</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import {
  formatCurrency,
  formatPhoneNumber,
  formatFechaLarga,
} from "src/boot/format";

defineProps({
  clientes: {
    type: Array,
    default: () => [],
  },
});

const columns = [
  {
    name: "cliente",
    label: "Cliente",
    field: (row) => row.cliente,
    align: "left",
  },
  {
    name: "folio",
    label: "Folio Crédito",
    field: (row) => row.folio,
    align: "center",
  },
  {
    name: "sucursal",
    label: "Sucursal",
    field: (row) => row.sucursal,
    align: "left",
  },
  {
    name: "fecha_mas_antigua",
    label: "Vencimiento Más Antiguo",
    field: (row) => row.fecha_mas_antigua,
    align: "center",
  },
  {
    name: "total_mora",
    label: "Saldo en Mora",
    field: (row) => row.total_mora,
    align: "right",
  },
];
</script>
