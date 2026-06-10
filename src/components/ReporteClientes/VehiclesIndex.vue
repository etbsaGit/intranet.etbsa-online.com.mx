<template>
  <q-item class="custom-item" align="center">
    <q-item-section>
      <q-item-label class="custom-label">-Maquinaria de Clientes-</q-item-label>
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-table flat bordered title="Clientes" :rows="crud.paginatedItems" :columns="columns" row-key="id"
        :rows-per-page-options="[0]">
        <template v-slot:top-left>
          <q-item>
            <q-item-section side>
              <q-btn outline dense color="primary" icon="filter_alt" label="Filtros" @click="showFilters = true" />
            </q-item-section>
            <q-item-section side>
              <q-btn color="green" icon="download" label="Excel" @click="exportReport" />
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:bottom>
          <BasePagination :pagination="crud.pagination"
            @update:currentPage="(val) => (crud.pagination.currentPage = val)" />
        </template>
        <template v-slot:body-cell-vendedor="props">
          <q-td :props="props">
            <div v-for="emp in props.row.empleados" :key="emp.id">
              <q-chip color="primary" text-color="white" dense class="q-mr-xs">
                {{ emp.nombreCompleto }}
              </q-chip>
            </div>
          </q-td>
        </template>

        <template #body-cell-cliente="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ props.row.cliente?.nombre }}
            </div>

            <div class="text-caption text-grey-7">
              RFC: {{ props.row.cliente?.rfc }}
            </div>
            <div class="text-caption text-grey-7">
              Teléfono: {{ props.row.cliente?.telefono }}
            </div>
            <div class="text-caption text-grey-7">
              Ubicación: {{ props.row.cliente?.calle }} {{ props.row.cliente?.colonia }}
            </div>
          </q-td>
        </template>


      </q-table>
    </q-item-section>


  </q-item>

  <q-dialog v-model="showFilters" position="top" full-width>
    <q-card style="width: 900px">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Filtros</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" icon="close" dense color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Buscar" icon="search" dense color="blue" @click="getRows" />
        </q-item-section>
        <q-item-section side>
          <q-btn dense label="limpiar" color="orange" @click="clearFilters" icon="filter_alt_off" />
        </q-item-section>
      </q-item>
      <q-separator />

      <q-item>
        <q-item-section>
          <q-input outlined dense label="Buscar por modelo" v-model="filterForm.search"
            @update:model-value="onInputChange">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-section>
        <q-item-section>
          <q-select v-model="filterForm.anio" :options="anios" label="Año" emit-value map-options outlined dense
            clearable />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select v-model="filterForm.marca_id" :options="marcas" label="Marca" option-value="id" option-label="name"
            emit-value map-options outlined dense clearable />
        </q-item-section>
        <q-item-section>
          <q-select v-model="filterForm.condicion_id" :options="condiciones" label="Condición" option-value="id"
            option-label="name" emit-value map-options outlined dense clearable />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select v-model="filterForm.clas_equipo_id" :options="clasEquipos" label="Clasificación de Equipo"
            option-value="id" option-label="name" emit-value map-options outlined dense clearable />
        </q-item-section>
        <q-item-section>
          <q-select v-model="filterForm.tipo_equipo_id" :options="tiposEquipo" label="Tipo de Equipo" option-value="id"
            option-label="name" emit-value map-options outlined dense clearable />
        </q-item-section>
        <q-item-section>
          <q-select v-model="filterForm.state_entity_id" :options="states" label="Estado" option-value="id"
            option-label="name" option-disable="inactive" emit-value map-options transition-show="jump-up"
            transition-hide="jump-up" clearable outlined dense
            @update:model-value="updateTowns(filterForm.state_entity_id)" />
        </q-item-section>
        <q-item-section>
          <q-select v-model="filterForm.town_id" :options="towns" label="Ciudad" option-value="id" option-label="name"
            option-disable="inactive" emit-value map-options transition-show="jump-up" transition-hide="jump-up"
            outlined dense clearable />
        </q-item-section>
      </q-item>

    </q-card>
  </q-dialog>

</template>

<script setup>
import { ref, onMounted, watch, h } from "vue";
import { checkRole, sendRequest } from "src/boot/functions";
import { formatPhoneNumber } from "src/boot/format.js";
import { useCrudStore } from "src/stores/crud";
import axios from "axios";

import BasePagination from "src/bases/BasePagination.vue";

const crud = useCrudStore();

const showFilters = ref(false);

const baseURL = ref("/api/intranet/reporte_clientes/maquinaria");

const current_page = ref(1);
const towns = ref([]);
const marcas = ref([]);
const anios = ref([]);
const condiciones = ref([]);
const clasEquipos = ref([]);
const tiposEquipo = ref([]);
const states = ref([]);

const filterForm = ref({
  search: null,
  state_entity_id: null,
  town_id: null,
  marca_id: null,
  condicion_id: null,
  clas_equipo_id: null,
  tipo_equipo_id: null,
  anio: null,
});

const columns = [
  {
    name: "cliente",
    label: "Cliente",
    align: "left",
    field: 'cliente',
    sortable: true,
  },
  {
    name: "tipo",
    label: "Tipo de Equipo",
    align: "left",
    field: row => row.tipo_equipo?.name,
    sortable: true,
  },
  {
    name: "marca",
    label: "Marca",
    align: "left",
    field: row => row.marca?.name,
    sortable: true,
  },
  {
    name: "modelo",
    label: "Modelo",
    align: "left",
    field: row => row.modelo ?? '',
    sortable: true,
  },
  {
    name: "anio",
    label: "Año",
    align: "left",
    field: row => row.anio ?? '',
    sortable: true,
  },
  {
    name: "serie",
    label: "Serie",
    align: "left",
    field: row => row.serie ?? '',
    sortable: true,
  },
  {
    name: "condicion",
    label: "Condición",
    align: "left",
    field: row => row.condicion?.name ?? '',
    sortable: true,
  },
  {
    name: "valor",
    label: "Valor",
    align: "left",
    field: row =>
      `${new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(row.valor)} MXN`,
    sortable: true,
  },

];


const clearFilters = () => {
  filterForm.value.search = null;
  filterForm.value.state_entity_id = null;
  filterForm.value.town_id = null;
  filterForm.value.marca_id = null;
  filterForm.value.condicion_id = null;
  filterForm.value.clas_equipo_id = null;
  filterForm.value.tipo_equipo_id = null;
  filterForm.value.anio = null;
  current_page.value = 1;
  towns.value = [];
  getRows();
};

const exportReport = async () => {
  const final = {
    ...filterForm.value,
  };
  let res = await sendRequest("POST", final, "/api/intranet/reporte_clientes/maquinaria/export", "");
  const base64Response = await fetch(
    `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.file_base64}`
  );
  const blob = await base64Response.blob();
  const url = URL.createObjectURL(blob);

  // Creación de un enlace temporal para descargar el archivo con un nombre específico
  const link = document.createElement("a");
  link.href = url;
  link.download = res.file_name ; // Nombre que se le asigna al archivo
  link.click();

  // Limpieza
  URL.revokeObjectURL(url);
};

const updateTowns = (id) => {
  filterForm.value.town_id = null;
  towns.value = [];
  getTowns(id);
};

const getTowns = async (id) => {
  if (id == null) {
    return;
  }
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/town/state/" + id,
    ""
  );
  towns.value = res;
};

const getRows = async () => {
  const filtersWithPage = {
    ...filterForm.value,
    page: crud.pagination.currentPage,
  };

  const res = await sendRequest(
    "POST",
    filtersWithPage,
    baseURL.value,
  );

  crud.paginatedItems = res.maquinas.data;

  marcas.value = res.filters.marcas;
  condiciones.value = res.filters.condiciones;
  clasEquipos.value = res.filters.clasEquipos;
  tiposEquipo.value = res.filters.tiposEquipo;
  states.value = res.filters.states;
  anios.value = res.filters.anios;

  crud.pagination = {
    currentPage: res.maquinas.current_page,
    lastPage: res.maquinas.last_page,
    perPage: res.maquinas.per_page,
    total: res.maquinas.total,
  };
};

watch(
  () => crud.pagination.currentPage,
  () => {
    getRows();
  }
);

let timeout = null;

const onInputChange = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    getRows();
  }, 1000);
};

onMounted(() => {
  getRows();
  // getOptions();
});
</script>

<style scoped>
.custom-item {
  border-radius: 8px;
  /* Bordes redondeados */
  padding: 10px;
  /* Espaciado interno */
}

.custom-label {
  font-size: 1.2em;
  /* Tamaño de fuente aumentado */
  font-weight: bold;
  /* Negrita */
}
</style>
