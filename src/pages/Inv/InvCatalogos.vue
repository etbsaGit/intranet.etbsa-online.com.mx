<template>
  <q-tabs
    v-model="tab"
    dense
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    align="justify"
    narrow-indicator
  >
    <q-tab name="models" label="Modelos" />
    <q-tab name="configuration" label="Configuraciones" />
    <q-tab name="categories" label="Categorias" />
    <q-tab name="groups" label="Grupos" />
    <q-tab name="factory" label="Proveedores" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="models">
      <inv-model-index />
    </q-tab-panel>

    <q-tab-panel name="configuration">
      <inv-configuration-index />
    </q-tab-panel>

    <q-tab-panel name="categories">
      <inv-category-index />
    </q-tab-panel>

    <q-tab-panel name="groups">
      <inv-group-index />
    </q-tab-panel>

    <q-tab-panel name="factory">
      <inv-factory-index />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import InvCategoryIndex from "src/components/InvCategory/InvCategoryIndex.vue";
import InvConfigurationIndex from "src/components/InvConfiguration/InvConfigurationIndex.vue";
import InvModelIndex from "src/components/InvModel/InvModelIndex.vue";
import InvGroupIndex from "src/components/InvGroup/InvGroupIndex.vue";
import InvFactoryIndex from "src/components/InvFactory/InvFactoryIndex.vue";

import { ref } from "vue";

const tab = ref("models");
</script>
