<template>
  <q-list bordered padding dense class="rounded-borders text-primary">
    <!-- POWER BI -->
    <q-expansion-item
      expand-separator
      icon="fa-solid fa-chart-column"
      label="Power BI"
      group="powerbi"
      v-if="checkRole('powerbi')"
    >
      <q-expansion-item
        v-for="categoria in visiblePowerBiMenu"
        :key="categoria.label"
        dense
        expand-separator
        :icon="categoria.icon"
        :label="categoria.label"
        header-class="powerbi-category"
        group="powerbi-categoria"
      >
        <q-item
          v-for="item in categoria.children"
          :key="item.to"
          clickable
          v-ripple
          :to="item.to"
          :active="link === item.to"
          @click="link = item.to"
          active-class="my-menu-link"
          class="powerbi-subcategory"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>

          <q-item-section>
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-expansion-item>
    </q-expansion-item>

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

    <!-- Módulo Productos -->

    <q-expansion-item
      expand-separator
      icon="fa-solid fa-store"
      label="Productos"
      group="somegroup"
      v-if="checkRole('Intranet.products')"
    >
      <!-- tractores -->
      <q-item
        v-if="checkRole('Intranet.products.tractores')"
        clickable
        v-ripple
        to="/productos-tractores"
        :active="link === 'productos.tractores'"
        @click="link = 'productos.tractores'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="agriculture" />
        </q-item-section>
        <q-item-section>Tractores</q-item-section>
      </q-item>
      <!-- riego -->
      <q-item
        v-if="checkRole('Intranet.products.riego')"
        clickable
        v-ripple
        to="/productos-riego"
        :active="link === 'productos-riego'"
        @click="link = 'productos-riego'"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="water_drop" />
        </q-item-section>
        <q-item-section>Riego</q-item-section>
      </q-item>
    </q-expansion-item>

    <!-- módulo Cotización -->
    <q-expansion-item
      expand-separator
      icon="fa-solid fa-file-invoice-dollar"
      label="Cotizaciones"
      group="somegroup"
      v-if="checkRole('crm')"
    >
      <q-item
        clickable
        v-ripple
        to="/cotizaciones/pedidosFormalizados"
        :active="link === 'pedidosFormalizados'"
        @click="link = 'pedidosFormalizados'"
        active-class="my-menu-link"
        v-if="checkRole('crm.formalizados')"
      >
        <q-item-section avatar>
          <q-icon name="fa-solid fa-hourglass-half" />
        </q-item-section>

        <q-item-section>Formalizados</q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        to="/cotizaciones/pedidosAutorizados"
        :active="link === 'pedidosAutorizados'"
        @click="link = 'pedidosAutorizados'"
        active-class="my-menu-link"
        v-if="checkRole('crm.autorizados')"
      >
        <q-item-section avatar>
          <q-icon name="fa-solid fa-hourglass-half" />
        </q-item-section>

        <q-item-section>Autorizados</q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        to="/cotizaciones/asignacionSerie"
        :active="link === 'asignacionSerie'"
        @click="link = 'asignacionSerie'"
        active-class="my-menu-link"
        v-if="checkRole('crm.asignacion_serie')"
      >
        <q-item-section avatar>
          <q-icon name="fa-solid fa-hourglass-half" />
        </q-item-section>

        <q-item-section>Asignación #Serie</q-item-section>
      </q-item>
    </q-expansion-item>

    <!-- módulo Nuevas Tecnologías -->
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
      v-if="checkRole('Intranet.invItem')"
    >
      <q-item
        clickable
        v-ripple
        to="/invItems"
        :active="link === 'invItems'"
        @click="link = 'invItems'"
        active-class="my-menu-link"
        v-if="checkRole('Intranet.invItem')"
      >
        <q-item-section avatar>
          <q-icon name="fa-solid fa-box-open" />
        </q-item-section>

        <q-item-section>Existencias</q-item-section>
      </q-item>
      <q-item
        clickable
        v-ripple
        to="/invCatalogos"
        :active="link === 'invCatalogos'"
        @click="link = 'invCatalogos'"
        active-class="my-menu-link"
        v-if="checkRole('Intranet.invItem')"
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

    <!-- reportes clientes -->
    <q-item
      v-if="checkRole('Admin')"
      clickable
      v-ripple
      to="/reportes"
      :active="link === 'reportes'"
      @click="link = 'reportes'"
      active-class="my-menu-link"
    >
      <q-item-section avatar>
        <q-icon name="archive" />
      </q-item-section>

      <q-item-section>Reportes</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref, computed } from "vue";
import { checkRole } from "../boot/functions";

const link = ref("inbox");

const powerBiMenu = [
  {
    label: "Dirección",
    icon: "fa-solid fa-building",
    role: "powerbi",
    children: [
      {
        label: "Histórico",
        icon: "fa-solid fa-chart-line",
        to: "/powerbi/historico",
        role: "powerbi",
      },
      {
        label: "Ventas",
        icon: "fa-solid fa-chart-column",
        to: "/powerbi/ventas",
        role: "powerbi",
      },
      {
        label: "Refacciones",
        icon: "fa-solid fa-screwdriver-wrench",
        to: "/powerbi/refacciones",
        role: "powerbi",
      },
    ],
  },

  {
    label: "Sucursales",
    icon: "fa-solid fa-store",
    role: "powerbi",
    children: [
      {
        label: "Celaya",
        icon: "fa-solid fa-location-dot",
        to: "/powerbi/celaya",
        role: "powerbi",
      },
      {
        label: "Irapuato",
        icon: "fa-solid fa-location-dot",
        to: "/powerbi/irapuato",
        role: "powerbi",
      },
      {
        label: "Salamanca",
        icon: "fa-solid fa-location-dot",
        to: "/powerbi/irapuato",
        role: "powerbi",
      },
      {
        label: "Silao",
        icon: "fa-solid fa-location-dot",
        to: "/powerbi/irapuato",
        role: "powerbi",
      },
      {
        label: "Qro 5 de Febrero",
        icon: "fa-solid fa-location-dot",
        to: "/powerbi/irapuato",
        role: "powerbi",
      },
      {
        label: "Qro Colorado",
        icon: "fa-solid fa-location-dot",
        to: "/powerbi/irapuato",
        role: "powerbi",
      },
      {
        label: "San Luis Potosí",
        icon: "fa-solid fa-location-dot",
        to: "/powerbi/irapuato",
        role: "powerbi",
      },
    ],
  },

  {
    label: "Taller",
    icon: "fa-solid fa-screwdriver-wrench",
    role: "powerbi",
    children: [
      {
        label: "Tasa de conversiones",
        icon: "fa-solid fa-chart-line",
        to: "/powerbi/taller/conversiones",
        role: "powerbi",
      },
      {
        label: "Pronóstico de servicios",
        icon: "fa-solid fa-chart-area",
        to: "/powerbi/taller/pronosticos",
        role: "powerbi",
      },
    ],
  },
];
const visiblePowerBiMenu = computed(() => {
  return powerBiMenu
    .filter((categoria) => checkRole(categoria.role))
    .map((categoria) => ({
      ...categoria,
      children: categoria.children.filter((item) => checkRole(item.role)),
    }))
    .filter((categoria) => categoria.children.length > 0);
});
</script>

<style>
.my-menu-link {
  color: black;
  background: gray;
}

.powerbi-category {
  color: #616161;
  font-weight: 600;
  font-size: 14px;
  padding-left: 30px;
}

.powerbi-subcategory {
  min-height: 38px;
  padding-left: 50px;
}

.powerbi-subcategory .q-icon {
  font-size: 18px;
}
</style>
