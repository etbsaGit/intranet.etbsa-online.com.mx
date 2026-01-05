<template>
  <q-item v-for="n in rows" :key="n">
    <q-item-section avatar>
      <q-skeleton type="QBtn" />
    </q-item-section>
    <q-item-section avatar>
      <q-skeleton type="QBtn" />
    </q-item-section>

    <q-item-section>
      <q-skeleton type="rect" animation="wave" />
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  rows: {
    type: Number,
    default: 10,
  },
});
</script>
