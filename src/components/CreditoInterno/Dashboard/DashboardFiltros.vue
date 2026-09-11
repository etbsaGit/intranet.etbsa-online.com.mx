<template>
  <q-card flat bordered class="bg-white q-pa-sm rounded-borders shadow-1">
    <div class="row items-center justify-between q-col-gutter-sm">
      <!-- Título de Filtros -->
      <div class="col-12 col-md-auto flex items-center q-gutter-xs">
        <q-icon name="filter_alt" color="primary" size="sm" />
        <span class="text-subtitle2 text-weight-bold text-grey-9">
          Filtros Ejecutivos
        </span>
      </div>

      <!-- Controles de Filtro -->
      <div class="col-12 col-md row items-center justify-end q-gutter-xs">
        <!-- Filtro: Año -->
        <q-select
          dense
          outlined
          emit-value
          map-options
          options-dense
          v-model="localFilters.year"
          :options="yearOptions"
          label="Año"
          style="min-width: 105px; max-width: 120px"
          @update:model-value="onFilterChange"
        >
          <template v-slot:prepend>
            <q-icon name="calendar_today" size="xs" color="primary" />
          </template>
        </q-select>

        <!-- Filtro: Sucursal -->
        <q-select
          dense
          outlined
          clearable
          emit-value
          map-options
          options-dense
          use-input
          input-debounce="0"
          option-value="id"
          option-label="nombre"
          v-model="localFilters.sucursal_id"
          :options="filteredSucursales"
          label="Sucursal"
          style="min-width: 150px; max-width: 190px"
          @filter="filterSucursales"
          @update:model-value="onFilterChange"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">Sin resultados</q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- Filtro: Empleado / Asesor -->
        <q-select
          dense
          outlined
          clearable
          emit-value
          map-options
          options-dense
          use-input
          input-debounce="0"
          option-value="id"
          option-label="nombreCompleto"
          v-model="localFilters.asesor_id"
          :options="filteredEmpleados"
          label="Asesor / Empleado"
          style="min-width: 165px; max-width: 210px"
          @filter="filterEmpleados"
          @update:model-value="onFilterChange"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">Sin resultados</q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- Filtro: Línea de Crédito -->
        <q-select
          dense
          outlined
          clearable
          emit-value
          map-options
          options-dense
          option-value="id"
          option-label="name"
          v-model="localFilters.linea_id"
          :options="options?.creditoLineas || []"
          label="Línea de Crédito"
          style="min-width: 150px; max-width: 190px"
          @update:model-value="onFilterChange"
        />

        <!-- Botón Limpiar Filtros -->
        <q-btn
          v-if="hasActiveFilters"
          flat
          round
          dense
          color="negative"
          icon="filter_alt_off"
          @click="clearFilters"
        >
          <q-tooltip>Restablecer filtros</q-tooltip>
        </q-btn>

        <!-- Botón Refrescar -->
        <q-btn
          outline
          color="primary"
          icon="refresh"
          label="Actualizar"
          dense
          class="q-px-sm text-weight-bold"
          :loading="loading"
          @click="$emit('refresh')"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:filter", "refresh", "clear"]);

const currentYear = new Date().getFullYear();
const yearOptions = [
  currentYear + 1,
  currentYear,
  currentYear - 1,
  currentYear - 2,
  currentYear - 3,
];

const localFilters = ref({
  year: props.filters.year || currentYear,
  sucursal_id: props.filters.sucursal_id || null,
  asesor_id: props.filters.asesor_id || null,
  linea_id: props.filters.linea_id || null,
});

watch(
  () => props.filters,
  (newVal) => {
    localFilters.value = { ...newVal };
  },
  { deep: true }
);

// Filtro con autocompletado para sucursales
const filteredSucursales = ref([]);
const sucursalesList = computed(() => props.options?.sucursales || []);

watch(
  sucursalesList,
  (val) => {
    filteredSucursales.value = val || [];
  },
  { immediate: true }
);

const filterSucursales = (val, update) => {
  if (val === "") {
    update(() => {
      filteredSucursales.value = sucursalesList.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    filteredSucursales.value = sucursalesList.value.filter(
      (v) => v.nombre && v.nombre.toLowerCase().includes(needle)
    );
  });
};

// Filtro con autocompletado para empleados/asesores
const filteredEmpleados = ref([]);
const empleadosList = computed(() => props.options?.empleados || []);

watch(
  empleadosList,
  (val) => {
    filteredEmpleados.value = val || [];
  },
  { immediate: true }
);

const filterEmpleados = (val, update) => {
  if (val === "") {
    update(() => {
      filteredEmpleados.value = empleadosList.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    filteredEmpleados.value = empleadosList.value.filter(
      (v) =>
        (v.nombreCompleto && v.nombreCompleto.toLowerCase().includes(needle)) ||
        (v.nombre && v.nombre.toLowerCase().includes(needle)) ||
        (v.apellido_paterno && v.apellido_paterno.toLowerCase().includes(needle))
    );
  });
};

const hasActiveFilters = computed(() => {
  return (
    localFilters.value.year !== currentYear ||
    Boolean(localFilters.value.sucursal_id) ||
    Boolean(localFilters.value.asesor_id) ||
    Boolean(localFilters.value.linea_id)
  );
});

const onFilterChange = () => {
  emit("update:filter", { ...localFilters.value });
};

const clearFilters = () => {
  localFilters.value = {
    year: currentYear,
    sucursal_id: null,
    asesor_id: null,
    linea_id: null,
  };
  emit("clear");
};
</script>
