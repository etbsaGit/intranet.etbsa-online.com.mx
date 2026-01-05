<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
  >
    <q-tab v-for="t in tabs" :key="t.name" :name="t.name" :label="t.label" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel
      v-for="t in tabs"
      :key="t.name"
      :name="t.name"
      class="q-pa-none"
    >
      <component :is="t.component" />
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
import ganadoPage from "./ganadoPage.vue";
import tipoCultivoPage from "./tipoCultivoPage.vue";
import marcaPage from "./marcaPage.vue";
import nuevaTecnologiaPage from "./nuevaTecnologiaPage.vue";
import riegoPage from "./riegoPage.vue";
import tipoEquipoPage from "./tipoEquipoPage.vue";
import clasEquipoPage from "./clasEquipoPage.vue";

const tabs = [
  {
    name: "clasificacion_construccion",
    label: "Clasificacion Construccion",
    component: classConstPage,
  },
  {
    name: "tactic",
    label: "Tacticas John Deere",
    component: tacticPage,
  },
  {
    name: "technological-capability",
    label: "Capacidad Tecnologica",
    component: capTecPage,
  },
  {
    name: "segmentation",
    label: "Segmentacion",
    component: segmentationPage,
  },
  {
    name: "classification",
    label: "Clasificacion",
    component: classificationPage,
  },
  { name: "kinship", label: "Parentesco", component: kinshipPage },
  {
    name: "abastecimiento",
    label: "Abastecimiento",
    component: abastecimientoPage,
  },
  {
    name: "condicion",
    label: "Condicion",
    component: condicionPage,
  },
  { name: "cultivo", label: "Cultivos", component: cultivoPage },
  { name: "ganado", label: "Ganado", component: ganadoPage },
  {
    name: "tipoCultivo",
    label: "Tipos de cultivo",
    component: tipoCultivoPage,
  },
  { name: "marca", label: "Marcas", component: marcaPage },
  {
    name: "nuevaTecnologia",
    label: "Nuevas Tecnologias",
    component: nuevaTecnologiaPage,
  },
  { name: "riego", label: "Tipos de riego", component: riegoPage },
  {
    name: "tipoEquipo",
    label: "Tipos de equipo",
    component: tipoEquipoPage,
  },
  {
    name: "clasEquipo",
    label: "Clasificacion de equipo",
    component: clasEquipoPage,
  },
];

const tab = ref("ganado"); // por defecto "ganado" (índice 9), si existe
</script>
