<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
  >
    <q-tab
      name="clasificacion_construccion"
      label="Clasificacion Construccion"
    />
    <q-tab name="tactic" label="Tacticas John Deere" />
    <q-tab name="technological-capability" label="Capacidad Tecnologica" />
    <q-tab name="segmentation" label="Segmentacion" />
    <q-tab name="classification" label="Clasificacion" />
    <q-tab name="kinship" label="Parentesco" />
  </q-tabs>
  <q-separator />
  <q-tab-panels v-model="tab" animated keep-alive>
    <q-tab-panel name="clasificacion_construccion" class="q-pa-none">
      <class-const-page />
    </q-tab-panel>
    <q-tab-panel name="tactic" class="q-pa-none">
      <tactic-page />
    </q-tab-panel>
    <q-tab-panel name="technological-capability" class="q-pa-none">
      <cap-tec-page />
    </q-tab-panel>
    <q-tab-panel name="segmentation" class="q-pa-none">
      <segmentation-page />
    </q-tab-panel>
    <q-tab-panel name="classification" class="q-pa-none">
      <classification-page />
    </q-tab-panel>
    <q-tab-panel name="kinship" class="q-pa-none">
      <kinship-page />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";
import classConstPage from "./classConstPage.vue";
import tacticPage from "./tacticPage.vue";
import capTecPage from "./capTecPage.vue";
import segmentationPage from "./segmentationPage.vue";
import classificationPage from "./classificationPage.vue";
import kinshipPage from "./kinshipPage.vue";

const tab = ref("");
</script>
