<template>
  <q-list bordered padding class="rounded-borders text-primary">
    <q-item
      v-if="checkRole('Empleado')"
      clickable
      v-ripple
      to="/catalogos"
      :active="link === 'catalogos'"
      @click="link = 'catalogos'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="list" />
      </q-item-section>

      <q-item-section>Catalogos</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref } from "vue";
import { checkRole } from "../boot/functions";

const link = ref("inbox");
</script>

<style lang="sass">
.my-menu-link
  color: black
  background: gray
</style>
