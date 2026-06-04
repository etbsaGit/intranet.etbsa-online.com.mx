<template>
  <q-tabs v-model="tab" dense :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" align="justify" narrow-indicator>
    <q-tab name="vehicles" label="vehicles" />
    <q-tab name="cultivos" label="cultivos" />
    <q-tab name="riego" label="Riego" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="vehicles">
      <vehicles-index />
    </q-tab-panel>
    <q-tab-panel name="cultivos">
      <cultivos-index />
    </q-tab-panel>
    <q-tab-panel name="riego">
      <riego-index />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>

import { ref } from "vue";
import VehiclesIndex from "../../components/ReporteClientes/VehiclesIndex.vue"
import CultivosIndex from "../../components/ReporteClientes/CultivosIndex.vue"
import RiegoIndex from "../../components/ReporteClientes/RiegoIndex.vue"

const tab = ref("vehicles");
</script>
