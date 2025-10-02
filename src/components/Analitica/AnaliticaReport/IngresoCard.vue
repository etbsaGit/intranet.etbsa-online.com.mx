<template>
  <div v-if="ingresos?.length">
    <q-item>
      <q-item-section>
        <q-item-label class="text-h6 text-primary text-center q-mb-md">
          👛 Otros ingresos
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section v-for="ing in ingresos" :key="ing.id">
        <q-card
          flat
          bordered
          class="bg-white q-pa-md referencia-card"
          style="min-width: 150px; text-align: center"
        >
          <div class="text-subtitle1 text-primary">
            <b>Tipo: </b>
            <strong class="text-h6 text-dark">
              {{ ing.tipo }}
            </strong>
          </div>

          <div class="text-subtitle1 text-primary q-mt-sm">
            <b>Monto: </b>
            <strong class="text-h6 text-positive">
              {{ formatCurrency(ing.monto) }}
            </strong>
          </div>
        </q-card>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup>
import { formatCurrency } from "src/boot/format";

const { ingresos } = defineProps(["ingresos"]);
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
