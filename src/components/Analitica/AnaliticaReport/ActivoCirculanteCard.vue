<template>
  <div v-if="activos">
    <!-- Título general -->
    <q-item>
      <q-item-section>
        <q-item-label class="text-h5 text-primary text-center q-mb-md">
          💰 Activo Circulante
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-card flat bordered class="bg-white q-pa-md text-center">
          <div class="text-h6" style="font-size: 24px">💵</div>
          <div class="text-subtitle2 text-grey-7 q-mt-sm">Efectivo</div>
          <div class="text-h6 text-dark">
            {{ formatCurrency(activos.base.efectivo) }}
          </div>
        </q-card>
      </q-item-section>
      <q-item-section>
        <q-card flat bordered class="bg-white q-pa-md text-center">
          <div class="text-h6" style="font-size: 24px">🏦</div>
          <div class="text-subtitle2 text-grey-7 q-mt-sm">Caja</div>
          <div class="text-h6 text-dark">
            {{ formatCurrency(activos.base.caja) }}
          </div>
        </q-card>
      </q-item-section>
      <q-item-section>
        <q-card flat bordered class="bg-white q-pa-md text-center">
          <div class="text-h6" style="font-size: 24px">📦</div>
          <div class="text-subtitle2 text-grey-7 q-mt-sm">Mercancias</div>
          <div class="text-h6 text-dark">
            {{ formatCurrency(activos.base.mercancias) }}
          </div>
        </q-card>
      </q-item-section>
      <q-item-section>
        <q-card flat bordered class="bg-white q-pa-md text-center">
          <div class="text-h6" style="font-size: 24px">📜</div>
          <div class="text-subtitle2 text-grey-7 q-mt-sm">
            Documentos por cobrar
          </div>
          <div class="text-h6 text-dark">
            {{ formatCurrency(activos.base.documentospc) }}
          </div>
        </q-card>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-card bordered class="shadow-3 rounded-borders card-section">
          <q-card-section class="text-center bg-green-7 text-white">
            <div class="text-h6">🌱 Inversiones Agrícolas</div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-md text-center">
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-seedling"
                size="28px"
                class="text-green q-mb-sm"
              />
              <div class="text-caption text-grey-7">
                Total Inversiones Agricolas
              </div>
              <div class="text-subtitle1 text-green text-bold">
                💰
                {{
                  formatCurrency(activos.inversiones.agricolas.totalAgricolas)
                }}
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-subtitle2 text-primary text-center q-mb-none">
              <q-expansion-item
                dense
                expand-separator
                label="📋 Detalle de inversion"
              >
                <q-table
                  flat
                  bordered
                  dense
                  :rows="activos.inversiones.agricolas.items"
                  :columns="columnsA"
                  row-key="id"
                  hide-bottom
                  class="my-mini-table"
                />
              </q-expansion-item>
            </div>
          </q-card-section>
        </q-card>
      </q-item-section>
      <q-item-section>
        <q-card bordered class="shadow-3 rounded-borders card-section">
          <q-card-section class="text-center bg-brown-7 text-white">
            <div class="text-h6">🐄 Inversiones Ganaderas</div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-md text-center">
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-cow"
                size="28px"
                class="text-brown q-mb-sm"
              />

              <div class="text-caption text-grey-7">
                Total Inversiones ganaderas
              </div>
              <div class="text-subtitle1 text-green text-bold">
                💰
                {{
                  formatCurrency(activos.inversiones.ganaderas.totalGanaderas)
                }}
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-subtitle2 text-primary text-center q-mb-none">
              <q-expansion-item
                dense
                expand-separator
                label="📋 Detalle de inversion"
              >
                <q-table
                  flat
                  bordered
                  dense
                  :rows="activos.inversiones.ganaderas.items"
                  :columns="columnsG"
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
    <q-item>
      <q-item-section class="text-center">
        <div class="text-h6 text-weight-bold text-primary">
          🧾 Total Activos Circulantes:
          <span class="text-positive">
            {{ formatCurrency(activos.totalActivosCirculantes) }}
          </span>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup>
import { formatCurrency } from "src/boot/format";

const { activos } = defineProps(["activos"]);

const columnsA = [
  {
    name: "year",
    label: "📅 Año",
    field: "year",
    align: "left",
  },
  {
    name: "ciclo",
    label: "📅 Ciclo",
    field: "ciclo",
    align: "left",
  },
  {
    name: "cultivo",
    label: "🥬 Cultivo",
    field: (row) => row.cultivo?.name || "",
    align: "left",
  },
  {
    name: "hectareas",
    label: "🌾 Hectáreas",
    field: "hectareas",
    align: "right",
  },
  {
    name: "costo",
    label: "💵 Costo por hectárea",
    field: (row) => formatCurrency(row.costo),
    align: "right",
  },
  {
    name: "total",
    label: "💰 Total",
    field: (row) => formatCurrency(row.total),
    align: "right",
  },
];

const columnsG = [
  {
    name: "year",
    label: "📅 Año",
    field: "year",
    align: "left",
  },
  {
    name: "ciclo",
    label: "📅 Ciclo",
    field: "ciclo",
    align: "left",
  },
  {
    name: "ganado",
    label: "🐖 Tipo de ganado",
    field: (row) => row.ganado?.name || "",
    align: "left",
  },
  {
    name: "unidades",
    label: "🐄 Cabezas",
    field: "unidades",
    align: "right",
  },
  {
    name: "costo",
    label: "💵 Costo por cabeza",
    field: (row) => formatCurrency(row.costo),
    align: "right",
  },
  {
    name: "total",
    label: "💰 Total",
    field: (row) => formatCurrency(row.total),
    align: "right",
  },
];
</script>

<style scoped>
.card-section {
  transition: transform 0.2s, box-shadow 0.2s;
}
.card-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.my-mini-table :deep(.q-table__top) {
  display: none;
}
.my-mini-table :deep(.q-table th) {
  background: #f0f4f8;
  font-weight: bold;
  font-size: 13px;
  color: #333;
}
.my-mini-table :deep(.q-table td) {
  font-size: 13px;
  padding: 6px 8px;
}
</style>
