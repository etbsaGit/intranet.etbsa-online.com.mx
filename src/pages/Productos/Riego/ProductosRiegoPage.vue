<template>
  <q-tabs
    v-model="tab"
    dense
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    align="justify"
    narrow-indicator
  >
    <q-tab name="products" label="Productos Riego" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="products">
      <productos-riego-index />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import ProductosRiegoIndex from "src/components/Productos/Riego/ProductosRiegoIndex.vue";
import { ref } from "vue";

const tab = ref("products");
</script>
