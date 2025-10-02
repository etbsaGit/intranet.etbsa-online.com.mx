<template>
  <q-item>
    <q-item-section>
      <q-item-label class="text-h6 text-primary text-center q-mb-md">
        📄 Reporte: {{ analitica.titulo }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <!-- Fecha -->
      <q-card flat bordered class="bg-white q-pa-md text-center">
        <div class="text-h6" style="font-size: 24px">📅</div>
        <div class="text-subtitle2 text-grey-7 q-mt-sm">Fecha</div>
        <div class="text-h6 text-dark">
          {{ formatDate(analitica.fecha) }}
        </div>
      </q-card>
    </q-item-section>
    <q-item-section>
      <!-- Efectivo -->
      <q-card flat bordered class="bg-white q-pa-md text-center">
        <div class="text-h6" style="font-size: 24px">💵</div>
        <div class="text-subtitle2 text-grey-7 q-mt-sm">Efectivo</div>
        <div class="text-h6 text-dark">
          {{ formatCurrency(analitica.efectivo) }}
        </div>
      </q-card>
    </q-item-section>
    <q-item-section>
      <!-- Caja -->
      <q-card flat bordered class="bg-white q-pa-md text-center">
        <div class="text-h6" style="font-size: 24px">🏦</div>
        <div class="text-subtitle2 text-grey-7 q-mt-sm">Caja</div>
        <div class="text-h6 text-dark">
          {{ formatCurrency(analitica.caja) }}
        </div>
      </q-card>
    </q-item-section>
    <q-item-section>
      <!-- Gastos -->
      <q-card flat bordered class="bg-white q-pa-md text-center">
        <div class="text-h6" style="font-size: 24px">💸</div>
        <div class="text-subtitle2 text-grey-7 q-mt-sm">Gastos</div>
        <div class="text-h6 text-dark">
          {{ formatCurrency(analitica.gastos) }}
        </div>
      </q-card>
    </q-item-section>
    <q-item-section>
      <!-- Status -->
      <q-card flat bordered class="bg-white q-pa-md text-center">
        <div class="text-h6" style="font-size: 24px">ℹ️</div>
        <div class="text-subtitle2 text-grey-7 q-mt-sm">Status</div>
        <div class="text-h6 text-dark">
          {{ analitica.status ?? "Pendiente" }}
        </div>
      </q-card>
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-card flat bordered class="bg-white q-pa-md text-center">
        <div class="text-h6" style="font-size: 24px">💬</div>
        <div class="text-subtitle2 text-grey-7 q-mt-sm">Comentarios</div>
        <div class="text-h6 text-dark">{{ analitica.comentarios }}</div>
      </q-card>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { date } from "quasar";
import { formatCurrency } from "src/boot/format";

const { analitica } = defineProps(["analitica"]);

function formatDate(value) {
  return date.formatDate(value, "DD/MM/YYYY");
}
</script>
