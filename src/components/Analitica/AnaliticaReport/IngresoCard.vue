<template>
  <div v-if="ingresos">
    <q-item>
      <q-item-section>
        <q-item-label class="text-h6 text-primary text-center q-mb-md">
          💲 Otros ingresos
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-card bordered class="bg-white shadow-2 rounded-borders">
          <!-- Encabezado del año -->
          <q-card-section class="text-center bg-primary text-white">
            <div class="text-h6">📊 Año {{ ingresos.anio }}</div>
          </q-card-section>

          <q-separator />

          <!-- Totales -->
          <q-card-section class="row q-col-gutter-md text-center">
            <!-- Total -->
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-coins"
                size="28px"
                class="text-primary q-mb-sm"
              />
              <div class="text-caption text-grey-7">Total</div>
              <div class="text-subtitle1 text-dark">
                {{ formatCurrency(ingresos.totales.total) }}
              </div>
            </div>

            <!-- Costos -->
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-money-bill-wave"
                size="28px"
                class="text-negative q-mb-sm"
              />
              <div class="text-caption text-grey-7">Costos</div>
              <div class="text-subtitle1 text-negative">
                {{ formatCurrency(ingresos.totales.costos) }}
              </div>
            </div>

            <!-- Neto -->
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-hand-holding-usd"
                size="28px"
                class="text-positive q-mb-sm"
              />
              <div class="text-caption text-grey-7">Neto</div>
              <div class="text-subtitle1 text-positive">
                {{ formatCurrency(ingresos.totales.neto) }}
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Tabla de registros -->
          <q-card-section>
            <div class="text-subtitle2 text-primary text-center q-mb-none">
              <q-expansion-item
                dense
                expand-separator
                :label="`📌 Registros ${ingresos.anio}`"
              >
                <q-table
                  flat
                  bordered
                  dense
                  :rows="ingresos.items"
                  :columns="columns"
                  row-key="id"
                  hide-bottom
                  class="my-mini-table"
                />
              </q-expansion-item>
            </div>
          </q-card-section>
        </q-card>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup>
import { formatCurrency } from "src/boot/format";

const { ingresos } = defineProps(["ingresos"]);

const columns = [
  { name: "tipo", label: "Tipo", field: "tipo", align: "left" },
  {
    name: "monto",
    label: "Monto",
    field: (row) => formatCurrency(row.monto),
    align: "right",
  },
  { name: "months", label: "Meses", field: "months", align: "right" },
  {
    name: "costos",
    label: "Costos",
    field: (row) => formatCurrency(row.costos),
    align: "right",
  },
  {
    name: "total",
    label: "Total",
    field: (row) => formatCurrency(row.total),
    align: "right",
  },
  {
    name: "neto",
    label: "Neto",
    field: (row) => formatCurrency(row.neto),
    align: "right",
  },
];
</script>

<style scoped>
.referencia-card {
  border-radius: 12px;
  font-family: "Segoe UI", sans-serif;
}

.text-subtitle1 {
  font-size: 14px;
  font-weight: 600;
}

.text-h6 {
  font-size: 16px;
}
</style>
