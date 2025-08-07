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
    <q-tab name="abastecimiento" label="Abastecimiento" />
    <q-tab name="condicion" label="Condicion" />
    <q-tab name="cultivo" label="Cultivos" />
    <q-tab name="tipoCultivo" label="Tipos de cultivo" />
    <q-tab name="marca" label="Marcas" />
    <q-tab name="nuevaTecnologia" label="Nuevas Tecnologias" />
    <q-tab name="riego" label="Tipos de riego" />
    <q-tab name="tipoEquipo" label="Tipos de equipo" />
    <q-tab name="clasEquipo" label="Clasificacion de equipo" />
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
    <q-tab-panel name="abastecimiento" class="q-pa-none">
      <abastecimiento-page />
    </q-tab-panel>
    <q-tab-panel name="condicion" class="q-pa-none">
      <condicion-page />
    </q-tab-panel>
    <q-tab-panel name="cultivo" class="q-pa-none">
      <cultivo-page />
    </q-tab-panel>
    <q-tab-panel name="tipoCultivo" class="q-pa-none">
      <tipo-cultivo-page />
    </q-tab-panel>
    <q-tab-panel name="marca" class="q-pa-none">
      <marca-page />
    </q-tab-panel>
    <q-tab-panel name="nuevaTecnologia" class="q-pa-none">
      <nueva-tecnologia-page />
    </q-tab-panel>
    <q-tab-panel name="riego" class="q-pa-none">
      <riego-page />
    </q-tab-panel>
    <q-tab-panel name="tipoEquipo" class="q-pa-none">
      <tipo-equipo-page />
    </q-tab-panel>
    <q-tab-panel name="clasEquipo" class="q-pa-none">
      <clas-equipo-page />
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
import abastecimientoPage from "./abastecimientoPage.vue";
import condicionPage from "./condicionPage.vue";
import cultivoPage from "./cultivoPage.vue";
import tipoCultivoPage from "./tipoCultivoPage.vue";
import marcaPage from "./marcaPage.vue";
import nuevaTecnologiaPage from "./nuevaTecnologiaPage.vue";
import riegoPage from "./riegoPage.vue";
import tipoEquipoPage from "./tipoEquipoPage.vue";
import clasEquipoPage from "./clasEquipoPage.vue";

const tab = ref("clasificacion_construccion");
</script>
