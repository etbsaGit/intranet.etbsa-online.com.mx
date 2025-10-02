<template>
  <div v-if="inverciones != null">
    <q-item>
      <q-item-section>
        <q-item-label class="text-h6 text-primary text-center q-mb-md">
          🐄 Inversiones Ganaderas
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section v-for="(info, year) in inverciones" :key="year">
        <q-card bordered class="bg-white shadow-2 rounded-borders">
          <q-card-section class="text-center bg-primary text-white">
            <div class="text-h6">📊 Año {{ year }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row q-col-gutter-md text-center">
            <!-- Costo -->
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-money-bill-wave"
                size="28px"
                class="text-negative q-mb-sm"
              />
              <div class="text-caption text-grey-7">Costo</div>
              <div class="text-subtitle1 text-negative">
                {{ formatCurrency(info.costo) }}
              </div>
            </div>

            <!-- Total -->
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-coins"
                size="28px"
                class="text-primary q-mb-sm"
              />
              <div class="text-caption text-grey-7">Total</div>
              <div class="text-subtitle1 text-dark">
                {{ formatCurrency(info.total) }}
              </div>
            </div>

            <!-- Precio -->
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-tag"
                size="28px"
                class="text-warning q-mb-sm"
              />
              <div class="text-caption text-grey-7">Precio</div>
              <div class="text-subtitle1 text-warning">
                {{ formatCurrency(info.precio) }}
              </div>
            </div>

            <!-- Ingreso -->
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-hand-holding-usd"
                size="28px"
                class="text-positive q-mb-sm"
              />
              <div class="text-caption text-grey-7">Ingreso</div>
              <div class="text-subtitle1 text-positive">
                {{ formatCurrency(info.ingreso) }}
              </div>
            </div>

            <!-- Utilidad -->
            <div class="col-12 col-sm">
              <q-icon
                name="fas fa-chart-line"
                size="28px"
                class="text-indigo q-mb-sm"
              />
              <div class="text-caption text-grey-7">Utilidad</div>
              <div class="text-subtitle1 text-indigo">
                {{ formatCurrency(info.utilidad) }}
              </div>
            </div>
          </q-card-section>
          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 text-primary text-center q-mb-none">
              <q-expansion-item
                dense
                expand-separator
                :label="`📌 Registros ${year}`"
              >
                <q-table
                  flat
                  bordered
                  dense
                  :rows="info.registros"
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

const { inverciones } = defineProps(["inverciones"]);

const columns = [
  { name: "ciclo", label: "Ciclo", field: "ciclo", align: "left" },
  {
    name: "ganado",
    label: "Tipo de Ganado",
    field: (row) => row.ganado?.name,
    align: "left",
  },
  {
    name: "unidades",
    label: "Unidades",
    field: "unidades",
    align: "center",
  },
  {
    name: "costo",
    label: "Costo",
    field: (row) => formatCurrency(row.costo),
    align: "right",
  },
  {
    name: "cantidad",
    label: "Cantidad",
    field: "cantidad",
    align: "center",
  },
  {
    name: "precio",
    label: "Precio",
    field: (row) => formatCurrency(row.precio),
    align: "right",
  },
  {
    name: "total",
    label: "Total",
    field: (row) => formatCurrency(row.total),
    align: "right",
  },
  {
    name: "ingreso",
    label: "Ingreso",
    field: (row) => formatCurrency(row.ingreso),
    align: "right",
  },
  {
    name: "utilidad",
    label: "Utilidad",
    field: (row) => formatCurrency(row.utilidad),
    align: "right",
  },
];
</script>

<style scoped>
.my-mini-table :deep(.q-table__top) {
  display: none;
}

.my-mini-table :deep(.q-table th) {
  background: #f5f5f5;
  font-weight: bold;
  font-size: 13px;
}

.my-mini-table :deep(.q-table td) {
  font-size: 13px;
  padding: 6px 8px;
}
</style>
