<template>
  <q-tabs
    v-model="tab"
    dense
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    align="justify"
    narrow-indicator
  >
    <q-tab name="agricolas" label="Agricolas" />
    <q-tab name="ganaderas" label="Ganaderas" />
  </q-tabs>

  <q-separator />
  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="agricolas">
      <inversiones-agricolas-index :cliente="cliente" :key="cliente" />
    </q-tab-panel>
    <q-tab-panel name="ganaderas">
      <inversiones-ganaderas-index :cliente="cliente" :key="cliente" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";
import InversionesAgricolasIndex from "src/components/InversionesAgricolas/InversionesAgricolasIndex.vue";
import InversionesGanaderasIndex from "src/components/InversionesGanaderas/InversionesGanaderasIndex.vue";

const { cliente } = defineProps(["cliente"]);

const tab = ref("agricolas");
</script>
