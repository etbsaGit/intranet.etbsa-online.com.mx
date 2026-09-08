<template>
  <div class="row items-center q-gutter-xs no-wrap filter-container">
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
          <q-item-section class="text-grey">
            Sin resultados
          </q-item-section>
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
      style="min-width: 175px; max-width: 220px"
      label="Asesor / Empleado"
      :model-value="filters.asesor_id"
      :options="filteredEmpleados"
      @filter="filterEmpleados"
      @update:model-value="(val) => updateFilter('asesor_id', val)"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Sin resultados
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- Filtro: Estatus -->
    <q-select
      dense
      outlined
      clearable
      emit-value
      map-options
      options-dense
      option-value="id"
      option-label="nombre"
      style="min-width: 165px; max-width: 200px"
      label="Estatus"
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

    <!-- Filtro: Líneas de Crédito -->
    <q-select
      dense
      outlined
      clearable
      emit-value
      map-options
      options-dense
      option-value="id"
      option-label="name"
      style="min-width: 155px; max-width: 185px"
      label="Línea de Crédito"
      :model-value="filters.linea_id"
      :options="lineasList"
      @update:model-value="(val) => updateFilter('linea_id', val)"
    />

    <!-- Botón Limpiar Filtros -->
    <q-btn
      v-if="hasActiveFilters"
      flat
      round
      dense
      color="negative"
      icon="filter_alt_off"
      @click="limpiarFiltros"
    >
      <q-tooltip>Limpiar filtros aplicados</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update", "update:filter", "clear"]);

const updateFilter = (key, value) => {
  emit("update:filter", key, value);
  emit("update");
};

const limpiarFiltros = () => {
  emit("clear");
  emit("update");
};

const localOptions = ref({
  sucursales: [],
  empleados: [],
  estatuses: [],
  creditoLineas: [],
});

// Obtener las listas fuente
const sucursalesList = computed(() => {
  return (
    props.options?.sucursales ||
    localOptions.value.sucursales ||
    []
  );
});

const empleadosList = computed(() => {
  return (
    props.options?.empleados ||
    localOptions.value.empleados ||
    []
  );
});

const estatusesList = computed(() => {
  return (
    props.options?.estatuses ||
    localOptions.value.estatuses ||
    []
  );
});

const lineasList = computed(() => {
  return (
    props.options?.creditoLineas ||
    localOptions.value.creditoLineas ||
    []
  );
});

// Opciones filtrables para inputs con autocompletado
const filteredSucursales = ref([]);
const filteredEmpleados = ref([]);

watch(
  sucursalesList,
  (newVal) => {
    filteredSucursales.value = newVal || [];
  },
  { immediate: true }
);

watch(
  empleadosList,
  (newVal) => {
    filteredEmpleados.value = newVal || [];
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
    Boolean(props.filters.sucursal_id) ||
    Boolean(props.filters.asesor_id) ||
    Boolean(props.filters.estatus_id) ||
    Boolean(props.filters.linea_id)
  );
});



const getOptionsFallback = async () => {
  if (props.options && Object.keys(props.options).length > 0) return;
  try {
    const res = await sendRequest(
      "GET",
      null,
      "/api/intranet/creditoInternos/options"
    );
    const data = res?.data || res || {};
    localOptions.value = {
      sucursales: data.sucursales || [],
      empleados: data.empleados || [],
      estatuses: data.estatuses || [],
      creditoLineas: data.creditoLineas || [],
    };
    filteredSucursales.value = localOptions.value.sucursales;
    filteredEmpleados.value = localOptions.value.empleados;
  } catch (e) {
    console.error("Error al cargar opciones en CreditoFiltros:", e);
  }
};

onMounted(() => {
  getOptionsFallback();
});
</script>

<style scoped>
.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
