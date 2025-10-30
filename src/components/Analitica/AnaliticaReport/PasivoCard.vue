<template>
  <div v-if="pasivos">
    <!-- <q-item>
      <q-item-section>
        <q-item-label class="text-h5 text-primary text-center q-mb-md">
          💸 Pasivos
        </q-item-label>
      </q-item-section>
    </q-item> -->
    <q-item>
      <q-item-section>
        <q-card bordered class="shadow-3 rounded-borders card-section">
          <q-card-section class="text-center bg-red-7 text-white">
            <div class="text-h6">💸 Pasivos</div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-md text-center">
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-money-bill-wave"
                size="28px"
                class="text-red q-mb-sm"
              />
              <div class="text-caption text-grey-7">Pasivo a corto plazo</div>
              <div class="text-subtitle1 text-red text-bold">
                💰
                {{ formatCurrency(pasivos.corto_plazo) }}
              </div>
            </div>
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-university"
                size="28px"
                class="text-red q-mb-sm"
              />
              <div class="text-caption text-grey-7">Pasivo a largo plazo</div>
              <div class="text-subtitle1 text-red text-bold">
                💰
                {{ formatCurrency(pasivos.largo_plazo) }}
              </div>
            </div>
            <div class="col-6 col-sm">
              <q-icon
                name="fas fa-chart-pie"
                size="28px"
                class="text-purple q-mb-sm"
              />

              <div class="text-caption text-grey-7">Pasivo total</div>
              <div class="text-subtitle1 text-red text-bold">
                💰
                {{ formatCurrency(pasivos.total_pasivos) }}
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="text-subtitle2 text-primary text-center q-mb-none">
              <q-expansion-item
                dense
                expand-separator
                label="📋 Detalle de pasivos"
              >
                <q-table
                  flat
                  bordered
                  dense
                  :rows="pasivos.items"
                  :columns="columnsPasivos"
                  row-key="id"
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
import { obtenerPeriodicidad } from "src/boot/format";

const { pasivos } = defineProps(["pasivos"]);

const columnsPasivos = [
  {
    name: "year",
    label: "📅 Año",
    field: "year",
    align: "left",
  },
  {
    name: "entidad",
    label: "🏦 Entidad",
    field: "entidad",
    align: "left",
  },
  {
    name: "concepto",
    label: "💼 Concepto",
    field: "concepto",
    align: "left",
  },
  {
    name: "pago",
    label: "💸 Pago",
    field: (row) => formatCurrency(row.pago),
    align: "right",
  },
  {
    name: "months",
    label: "🗓️ Meses",
    field: "months",
    align: "right",
  },
  {
    name: "type",
    label: "⏱ Periodicidad",
    field: (row) => obtenerPeriodicidad(row.type),
    align: "center",
  },
  {
    name: "pasivo_corto",
    label: "💵 Pasivo a corto plazo",
    field: (row) => formatCurrency(row.pasivo_corto),
    align: "right",
  },
  {
    name: "pasivo_largo",
    label: "🏦 Pasivo a largo plazo",
    field: (row) => formatCurrency(row.pasivo_largo),
    align: "right",
  },
  {
    name: "total",
    label: "📊 Total pasivo",
    field: (row) => formatCurrency(row.total),
    align: "right",
  },
];
</script>
