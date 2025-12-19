<template>
  <q-list bordered padding class="rounded-borders text-primary">
    <q-item
      v-if="checkRole('Intranet.sales')"
      clickable
      v-ripple
      to="/sale"
      :active="link === 'sale'"
      @click="link = 'sale'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="point_of_sale" />
      </q-item-section>

      <q-item-section>Pedidos</q-item-section>
    </q-item>
    <q-item
      v-if="checkRole('Intranet.clientes')"
      clickable
      v-ripple
      to="/cliente"
      :active="link === 'cliente'"
      @click="link = 'cliente'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="people" />
      </q-item-section>

      <q-item-section>Clientes</q-item-section>
    </q-item>

    <q-expansion-item
      expand-separator
      icon="fa-solid fa-microchip"
      label="Nuevas Tecnologias"
      group="somegroup"
      v-if="checkRole('Intranet.nt')"
    >
      <q-item
        clickable
        v-ripple
        to="/nt/hectareas"
        :active="link === 'nt'"
        @click="link = 'nt'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="fa-solid fa-globe" />
        </q-item-section>

        <q-item-section>Hectareas conectadas</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item
      expand-separator
      icon="fa-solid fa-boxes-stacked"
      label="Inventarios"
      group="somegroup"
      v-if="checkRole('Admin')"
    >
      <q-item
        clickable
        v-ripple
        to="invCatalogos"
        :active="link === 'invCatalogos'"
        @click="link = 'invCatalogos'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="fa-solid fa-box" />
        </q-item-section>

        <q-item-section>Catalogos de modelo</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-item
      v-if="checkRole('Admin')"
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
