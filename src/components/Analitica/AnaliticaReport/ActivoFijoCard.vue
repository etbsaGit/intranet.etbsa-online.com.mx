<template>
  <div v-if="activos">
    <!-- Título general -->
    <q-item>
      <q-item-section>
        <q-item-label class="text-h5 text-primary text-center q-mb-md">
          🧱 Activos Fijos
        </q-item-label>
      </q-item-section>
    </q-item>

    <!-- === CARD MAQUINARIA === -->
    <q-item>
      <q-item-section>
        <q-card bordered class="shadow-3 rounded-borders card-section">
          <q-card-section class="text-center bg-blue-7 text-white">
            <div class="text-h6">🚜 Maquinaria</div>
          </q-card-section>

          <q-separator color="blue-3" />

          <q-card-section class="row q-col-gutter-md text-center">
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-tractor"
                size="28px"
                class="text-green q-mb-sm"
              />
              <div class="text-caption text-grey-7">Total Maquinaria</div>
              <div class="text-subtitle1 text-green text-bold">
                💰 {{ formatCurrency(machines.totalMachines) }}
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 text-primary text-center q-mb-none">
              <q-expansion-item
                dense
                expand-separator
                label="📋 Detalle de maquinaria"
              >
                <q-table
                  flat
                  bordered
                  dense
                  :rows="machines.items"
                  :columns="columnsM"
                  row-key="id"
                  class="my-mini-table"
                />
              </q-expansion-item>
            </div>
          </q-card-section>
        </q-card>
      </q-item-section>

      <!-- === CARD FINCAS === -->
      <q-item-section>
        <q-card bordered class="shadow-3 rounded-borders card-section">
          <q-card-section class="text-center bg-green-8 text-white">
            <div class="text-h6">🌾 Fincas y Terrenos</div>
          </q-card-section>

          <q-separator color="green-4" />

          <q-card-section class="row q-col-gutter-md text-center">
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-tree"
                size="28px"
                class="text-positive q-mb-sm"
              />
              <div class="text-caption text-grey-7">
                Total Fincas y Terrenos
              </div>
              <div class="text-subtitle1 text-positive text-bold">
                💵 {{ formatCurrency(fincas.totalFincas) }}
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 text-primary text-center q-mb-none">
              <q-expansion-item
                dense
                expand-separator
                label="📋 Detalle de fincas"
              >
                <q-table
                  flat
                  bordered
                  dense
                  :rows="fincas.items"
                  :columns="columnsF"
                  row-key="id"
                  class="my-mini-table"
                />
              </q-expansion-item>
            </div>
          </q-card-section>
        </q-card>
      </q-item-section>
    </q-item>

    <!-- TOTAL GENERAL -->
    <q-item>
      <q-item-section class="text-center">
        <div class="text-h6 text-weight-bold text-primary">
          🧾 Total Activos Fijos:
          <span class="text-positive"> {{ formatCurrency(total) }} </span>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup>
import { formatCurrency } from "src/boot/format";

const { activos } = defineProps(["activos"]);

const machines = activos.machines;
const fincas = activos.fincas;
const total = activos.totalActivosFijos;

const columnsM = [
  {
    name: "tipo_equipo",
    label: "🔧 Tipo de Equipo",
    field: (row) => row.tipo_equipo?.name,
    align: "left",
  },
  { name: "anio", label: "📅 Año", field: "anio", align: "center" },
  {
    name: "valor",
    label: "💰 Valor",
    field: (row) => formatCurrency(row.valor),
    align: "right",
  },
  {
    name: "marca",
    label: "🏷️ Marca",
    field: (row) => row.marca?.name,
    align: "left",
  },
  {
    name: "condicion",
    label: "⚙️ Condición",
    field: (row) => row.condicion?.name,
    align: "left",
  },
  {
    name: "clas_equipo",
    label: "🧩 Clase de Equipo",
    field: (row) => row.clas_equipo?.name,
    align: "left",
  },
];

const columnsF = [
  {
    name: "nombre",
    label: "🏡 Nombre",
    field: "nombre",
    align: "left",
  },
  {
    name: "descripcion",
    label: "📝 Descripción",
    field: "descripcion",
    align: "left",
  },
  {
    name: "valor",
    label: "💵 Valor",
    field: (row) => formatCurrency(row.valor),
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
