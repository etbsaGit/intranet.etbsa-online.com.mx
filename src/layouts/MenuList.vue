<template>
  <q-list bordered padding dense class="rounded-borders text-primary">
    <q-item v-if="checkRole('Intranet.sales')" clickable v-ripple to="/sale" :active="link === 'sale'"
      @click="link = 'sale'" active-class="my-menu-link">
      <q-item-section avatar>
        <q-icon name="point_of_sale" />
      </q-item-section>

      <q-item-section>Pedidos</q-item-section>

    </q-item>

    <q-item v-if="checkRole('Intranet.clientes')" clickable v-ripple to="/cliente" :active="link === 'cliente'"
      @click="link = 'cliente'" active-class="my-menu-link">
      <q-item-section avatar>
        <q-icon name="people" />
      </q-item-section>

      <q-item-section>Clientes</q-item-section>
    </q-item>

    <!-- Módulo Productos -->
    <q-item v-if="checkRole('Intranet.products')" clickable v-ripple to="/productos" :active="link === 'productos'"
      @click="link = 'productos'" active-class="my-menu-link">
      <q-item-section avatar>
        <q-icon name="agriculture" />
      </q-item-section>

      <q-item-section>Productos</q-item-section>
    </q-item>

    <!-- módulo Cotización -->
    <q-expansion-item expand-separator icon="fa-solid fa-file-invoice-dollar" label="Cotizaciones" group="somegroup"
      v-if="checkRole('Intranet.crm')">
      <q-item clickable v-ripple to="/cotizaciones/pedidosFormalizados" :active="link === 'pedidosFormalizados'"
        @click="link = 'pedidosFormalizados'" active-class="my-menu-link" v-if="checkRole('Intranet.crm.formalizados')">
        <q-item-section avatar>
          <q-icon name="fa-solid fa-hourglass-half" />
        </q-item-section>

        <q-item-section>Formalizados</q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/cotizaciones/pedidosAutorizados" :active="link === 'pedidosAutorizados'"
        @click="link = 'pedidosAutorizados'" active-class="my-menu-link" v-if="checkRole('Intranet.crm.autorizados')">
        <q-item-section avatar>
          <q-icon name="fa-solid fa-hourglass-half" />
        </q-item-section>

        <q-item-section>Autorizados</q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/cotizaciones/asignacionSerie" :active="link === 'asignacionSerie'"
        @click="link = 'asignacionSerie'" active-class="my-menu-link" v-if="checkRole('Intranet.crm.asignacion_serie')">
        <q-item-section avatar>
          <q-icon name="fa-solid fa-hourglass-half" />
        </q-item-section>

        <q-item-section>Asignación #Serie</q-item-section>
      </q-item>

    </q-expansion-item>

    <!-- módulo Nuevas Tecnologías -->
    <q-expansion-item expand-separator icon="fa-solid fa-microchip" label="Nuevas Tecnologias" group="somegroup"
      v-if="checkRole('Intranet.nt')">
      <q-item clickable v-ripple to="/nt/hectareas" :active="link === 'nt'" @click="link = 'nt'"
        active-class="my-menu-link">
        <q-item-section avatar>
          <q-icon name="fa-solid fa-globe" />
        </q-item-section>

        <q-item-section>Hectareas conectadas</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item expand-separator icon="fa-solid fa-boxes-stacked" label="Inventarios" group="somegroup"
      v-if="checkRole('Intranet.invItem')">
      <q-item clickable v-ripple to="/invItems" :active="link === 'invItems'" @click="link = 'invItems'"
        active-class="my-menu-link" v-if="checkRole('Intranet.invItem')">
        <q-item-section avatar>
          <q-icon name="fa-solid fa-box-open" />
        </q-item-section>

        <q-item-section>Existencias</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/invCatalogos" :active="link === 'invCatalogos'" @click="link = 'invCatalogos'"
        active-class="my-menu-link" v-if="checkRole('Intranet.invItem')">
        <q-item-section avatar>
          <q-icon name="fa-solid fa-box" />
        </q-item-section>

        <q-item-section>Catalogos de modelo</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-item v-if="checkRole('Admin')" clickable v-ripple to="/catalogos" :active="link === 'catalogos'"
      @click="link = 'catalogos'" active-class="my-menu-link">
      <q-item-section avatar>
        <q-icon name="list" />
      </q-item-section>

      <q-item-section>Catalogos</q-item-section>
    </q-item>

    <!-- reportes clientes -->
    <q-item v-if="checkRole('Admin')" clickable v-ripple to="/reportes" :active="link === 'reportes'"
      @click="link = 'reportes'" active-class="my-menu-link">
      <q-item-section avatar>
        <q-icon name="archive" />
      </q-item-section>

      <q-item-section>Reportes</q-item-section>
    </q-item>

    <q-expansion-item expand-separator icon="fa-solid fa-chart-column" label="Power BI" group="powerbi"
      v-if="checkRole('powerbi')">

      <q-expansion-item dense expand-separator icon="fa-solid fa-building" label="Dirección"
        header-class="powerbi-category">

        <q-item clickable v-ripple to="/powerbi/historico">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-chart-line" />
          </q-item-section>

          <q-item-section>
            Histórico
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/powerbi/ventas">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-chart-column" />
          </q-item-section>

          <q-item-section>
            Ventas
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/powerbi/refacciones">
          <q-item-section avatar>
            <q-icon name="fa-solid fa-screwdriver-wrench" />
          </q-item-section>

          <q-item-section>
            Refacciones
          </q-item-section>
        </q-item>

      </q-expansion-item>

    </q-expansion-item>

  </q-list>
</template>

<script setup>
import { ref } from "vue";
import { checkRole } from "../boot/functions";

const link = ref("inbox");
</script>

<style>
.my-menu-link {
  color: black;
  background: gray
}

.powerbi-category {
  color: #616161;
  font-weight: 600;
  font-size: 13px;
}

.powerbi-category .q-item {
  min-height: 40px;
}

.powerbi-category .q-icon {
  font-size: 18px;
}
</style>
