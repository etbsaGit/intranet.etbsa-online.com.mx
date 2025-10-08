<template>
  <q-tabs
    v-model="tab"
    dense
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    align="justify"
    narrow-indicator
  >
    <q-tab name="agricolas" label="Agricolas" />
    <q-tab name="ganaderas" label="Ganaderos" />
  </q-tabs>

  <q-separator />
  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="agricolas">
      <agricola-inversion-index :cliente="cliente" :key="cliente" />
    </q-tab-panel>
    <q-tab-panel name="ganaderas">
      <ganadera-inversion-index :cliente="cliente" :key="cliente" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";
import AgricolaInversionIndex from "src/components/AgricolaInversion/AgricolaInversionIndex.vue";
import GanaderaInversionIndex from "src/components/GanaderaInversion/GanaderaInversionIndex.vue";

const { cliente } = defineProps(["cliente"]);

const tab = ref("agricolas");
</script>
