<template>
  <q-tabs
    v-model="tab"
    dense
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    align="justify"
    narrow-indicator
  >
    <q-tab name="products" label="Productos" />
    <q-tab name="condiciones" label="Condición Pago" />
    <q-tab name="categories" label="Categorías" />
    <q-tab name="subcategories" label="Sub Categorías" />
    <q-tab name="brands" label="Marcas" />
    <q-tab name="suppliers" label="Proveedores" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="products">
      <productos-index/>
    </q-tab-panel>
    <q-tab-panel name="condiciones">
      <condicion-pago-index/>
    </q-tab-panel>
    <q-tab-panel name="categories">
      <categorias-index/>
    </q-tab-panel>
    <q-tab-panel name="subcategories">
      <sub-categorias-index />
    </q-tab-panel>
    <q-tab-panel name="brands">
      <marcas-index />
    </q-tab-panel>
    <q-tab-panel name="suppliers">
      <proveedores-index/>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>

import ProveedoresIndex from "src/components/Productos/Proveedores/ProveedoresIndex.vue";
import MarcasIndex from "src/components/Productos/Marcas/MarcasIndex.vue";
import CategoriasIndex from "src/components/Productos/Categorias/CategoriasIndex.vue";
import SubCategoriasIndex from "src/components/Productos/Categorias/SubCategoriasIndex.vue";
import ProductosIndex from "src/components/Productos/Productos/ProductosIndex.vue";
import CondicionPagoIndex from "src/components/Productos/CondicionPago/CondicionPagoIndex.vue";

import { ref } from "vue";


const tab = ref("products");
</script>
