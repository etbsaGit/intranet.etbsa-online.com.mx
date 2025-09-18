<template>
  <q-item>
    <q-item-section>
      <q-item-label class="text-h6 text-primary text-center q-mb-md">
        📊 Resumen de Inversión Agrícola
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <!-- Costo -->
      <q-card
        flat
        bordered
        class="bg-white q-pa-md"
        style="min-width: 150px; text-align: center"
      >
        <q-icon
          class="text-negative"
          name="fas fa-money-bill-wave"
          size="32px"
        />
        <div class="text-subtitle2 text-grey-7 q-mt-sm">
          Costos por hectarea
        </div>
        <div class="text-h6 text-negative">
          {{ formatCurrency(datos.costo) }}
        </div>
      </q-card>
    </q-item-section>
    <q-item-section>
      <!-- Total -->
      <q-card
        flat
        bordered
        class="bg-white q-pa-md"
        style="min-width: 150px; text-align: center"
      >
        <q-icon class="text-primary" name="fas fa-coins" size="32px" />
        <div class="text-subtitle2 text-grey-7 q-mt-sm">Total costos</div>
        <div class="text-h6 text-dark">{{ formatCurrency(datos.total) }}</div>
      </q-card>
    </q-item-section>

    <q-item-section>
      <!-- Precio -->
      <q-card
        flat
        bordered
        class="bg-white q-pa-md"
        style="min-width: 150px; text-align: center"
      >
        <q-icon class="text-primary" name="fas fa-tag" size="32px" />
        <div class="text-subtitle2 text-grey-7 q-mt-sm">
          Precio por tonelada
        </div>
        <div class="text-h6 text-primary">
          {{ formatCurrency(datos.precio) }}
        </div>
      </q-card>
    </q-item-section>
    <q-item-section>
      <!-- Ingreso -->
      <q-card
        flat
        bordered
        class="bg-white q-pa-md"
        style="min-width: 150px; text-align: center"
      >
        <q-icon
          class="text-positive"
          name="fas fa-hand-holding-usd"
          size="32px"
        />
        <div class="text-subtitle2 text-grey-7 q-mt-sm">Ingresos totales</div>
        <div class="text-h6 text-positive">
          {{ formatCurrency(datos.ingreso) }}
        </div>
      </q-card>
    </q-item-section>
    <q-item-section>
      <!-- Utilidad -->
      <q-card
        flat
        bordered
        class="bg-white q-pa-md"
        style="min-width: 150px; text-align: center"
      >
        <q-icon class="text-indigo" name="fas fa-chart-line" size="32px" />
        <div class="text-subtitle2 text-grey-7 q-mt-sm">Utilidad total</div>
        <div class="text-h6 text-indigo">
          {{ formatCurrency(datos.utilidad) }}
        </div>
      </q-card>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { formatCurrency } from "src/boot/format";
const { datos } = defineProps(["datos"]);
</script>
