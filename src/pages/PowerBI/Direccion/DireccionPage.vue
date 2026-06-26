<template>
  <q-tabs
    v-model="tab"
    dense
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    align="justify"
    narrow-indicator
  >
    <q-tab  name="historico" label="Histórico" />
    <q-tab name="ventas" label="Ventas" />
    <q-tab name="refacciones" label="Refacciones" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="historico">
      <historico-dashboard/>
    </q-tab-panel>
    <q-tab-panel name="ventas">
      <ventas-index/>
    </q-tab-panel>
    <q-tab-panel name="refacciones">
      <refacciones-index/>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>



import { ref } from "vue";
import HistoricoDashboard from "./HistoricoDashboard.vue";



const tab = ref("historico");
</script>
