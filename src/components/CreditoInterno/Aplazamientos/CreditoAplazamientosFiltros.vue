<template>
  <div class="row items-center q-gutter-xs no-wrap filter-container">
    <!-- Filtro: Estatus de Aplazamiento -->
    <q-select
      dense
      outlined
      clearable
      emit-value
      map-options
      options-dense
      option-value="id"
      option-label="nombre"
      style="min-width: 175px; max-width: 215px"
      label="Estatus Aplazo"
      :model-value="filters.estatus_id"
      :options="estatusesList"
      @update:model-value="(val) => updateFilter('estatus_id', val)"
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar style="min-width: 20px" class="q-pr-xs">
            <div
              style="width: 10px; height: 10px; border-radius: 50%"
              :style="{ backgroundColor: scope.opt.color || '#1976d2' }"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.nombre }}</q-item-label>
          </q-item-section>
        </q-item>
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
      style="min-width: 155px; max-width: 190px"
      label="Sucursal"
      :model-value="filters.sucursal_id"
      :options="filteredSucursales"
      @filter="filterSucursales"
      @update:model-value="(val) => updateFilter('sucursal_id', val)"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">Sin resultados</q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- Filtro: Asesor / Empleado -->
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
      style="min-width: 175px; max-width: 220px"
      label="Asesor / Solicitante"
      :model-value="filters.asesor_id"
      :options="filteredEmpleados"
      @filter="filterEmpleados"
      @update:model-value="(val) => updateFilter('asesor_id', val)"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">Sin resultados</q-item-section>
        </q-item>
      </template>
    </q-select>

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
      <q-tooltip class="bg-negative text-body2">Limpiar filtros</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  options: {
    type: [Object, Array],
    default: () => ({}),
  },
});

const emit = defineEmits(["update:filter", "clear", "update"]);

const sucursalesList = computed(() => {
  return props.options?.sucursales || [];
});

const empleadosList = computed(() => {
  return props.options?.empleados || [];
});

const estatusesList = computed(() => {
  if (props.options?.estatusesAplazo && props.options.estatusesAplazo.length > 0) {
    return props.options.estatusesAplazo;
  }
  return [
    { id: 168, nombre: "Aplazo Solicitado", color: "#007bf5" },
    { id: 169, nombre: "Aplazo Aprobado", color: "#00f500" },
    { id: 170, nombre: "Aplazo Rechazado", color: "#f50000" },
    { id: 171, nombre: "Aplazo Cancelado", color: "#cce6ff" },
  ];
});

const filteredSucursales = ref([]);
const filteredEmpleados = ref([]);

const filterSucursales = (val, update) => {
  update(() => {
    if (!val || val === "") {
      filteredSucursales.value = sucursalesList.value;
    } else {
      const needle = val.toLowerCase();
      filteredSucursales.value = sucursalesList.value.filter(
        (v) => v.nombre && v.nombre.toLowerCase().includes(needle)
      );
    }
  });
};

const filterEmpleados = (val, update) => {
  update(() => {
    if (!val || val === "") {
      filteredEmpleados.value = empleadosList.value;
    } else {
      const needle = val.toLowerCase();
      filteredEmpleados.value = empleadosList.value.filter(
        (v) =>
          v.nombreCompleto &&
          v.nombreCompleto.toLowerCase().includes(needle)
      );
    }
  });
};

const hasActiveFilters = computed(() => {
  return Boolean(
    props.filters.sucursal_id ||
      props.filters.asesor_id ||
      props.filters.estatus_id
  );
});

const updateFilter = (key, value) => {
  emit("update:filter", key, value);
  emit("update");
};

const clearFilters = () => {
  emit("clear");
  emit("update");
};
</script>

<style scoped>
.filter-container {
  overflow-x: auto;
  padding-bottom: 2px;
}
</style>
