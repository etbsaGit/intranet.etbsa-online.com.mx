<template>
  <div v-if="gastos">
    <q-item>
      <q-item-section>
        <q-card bordered class="bg-white shadow-2 rounded-borders">
          <!-- Encabezado -->
          <q-card-section class="text-center bg-primary text-white">
            <div class="text-h6">💼 Otros Gastos</div>
          </q-card-section>

          <q-separator />

          <!-- Resumen general -->
          <q-card-section class="row q-col-gutter-md text-center">
            <!-- Costos de Fincas -->
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-warehouse"
                size="28px"
                class="text-primary q-mb-sm"
              />
              <div class="text-caption text-grey-7">Costos Fincas</div>
              <div class="text-subtitle1 text-primary">
                {{ formatCurrency(gastos.fincas.total_costos_fincas) }}
              </div>
            </div>

            <!-- Gastos Analítica -->
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-chart-line"
                size="28px"
                class="text-warning q-mb-sm"
              />
              <div class="text-caption text-grey-7">Gastos familiares</div>
              <div class="text-subtitle1 text-warning">
                {{ formatCurrency(gastos.analitica.gastos) }}
              </div>
            </div>

            <!-- Total Otros Gastos -->
            <div class="col-12 col-sm">
              <q-icon
                name="fas fa-file-invoice-dollar"
                size="28px"
                class="text-negative q-mb-sm"
              />
              <div class="text-caption text-grey-7">Total Otros Gastos</div>
              <div class="text-subtitle1 text-negative">
                {{ formatCurrency(gastos.total_otros_gastos) }}
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Tabla de Fincas -->
          <q-card-section>
            <div class="text-subtitle2 text-primary text-center q-mb-none">
              <q-expansion-item
                dense
                expand-separator
                label="🏡 Registros de Fincas"
              >
                <q-table
                  flat
                  bordered
                  dense
                  :rows="gastos.fincas.items"
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
const { gastos } = defineProps(["gastos"]);
import { formatCurrency } from "src/boot/format";

const columns = [
  { name: "nombre", label: "Nombre", field: "nombre", align: "left" },
  {
    name: "descripcion",
    label: "Superficie",
    field: "descripcion",
    align: "left",
  },
  {
    name: "costo",
    label: "Costo",
    field: (row) => formatCurrency(row.costo),
    align: "right",
  },
];
</script>

<style scoped>
.my-mini-table {
  font-size: 13px;
}
</style>
