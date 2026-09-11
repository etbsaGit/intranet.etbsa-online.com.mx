<template>
  <q-card flat bordered class="bg-white q-pa-sm rounded-borders shadow-1">
    <div class="row items-center justify-between q-col-gutter-sm">
      <!-- Navegación de Mes -->
      <div class="col-12 col-md-auto row items-center q-gutter-xs">
        <q-btn
          flat
          dense
          round
          icon="chevron_left"
          color="primary"
          @click="prevMonth"
        >
          <q-tooltip>Mes anterior</q-tooltip>
        </q-btn>

        <q-select
          dense
          outlined
          options-dense
          emit-value
          map-options
          v-model="localMonth"
          :options="monthOptions"
          style="min-width: 135px; max-width: 155px"
          @update:model-value="emitUpdate"
        >
          <template v-slot:prepend>
            <q-icon name="event" size="xs" color="primary" />
          </template>
        </q-select>

        <q-select
          dense
          outlined
          options-dense
          emit-value
          map-options
          v-model="localYear"
          :options="yearOptions"
          style="min-width: 95px; max-width: 115px"
          @update:model-value="emitUpdate"
        />

        <q-btn
          flat
          dense
          round
          icon="chevron_right"
          color="primary"
          @click="nextMonth"
        >
          <q-tooltip>Mes siguiente</q-tooltip>
        </q-btn>

        <q-btn
          flat
          dense
          label="Hoy"
          color="primary"
          class="text-weight-bold q-px-sm"
          @click="goToCurrentMonth"
        >
          <q-tooltip>Ir al mes actual</q-tooltip>
        </q-btn>
      </div>

      <!-- Filtros adicionales y Alternador de vista -->
      <div class="col-12 col-md row items-center justify-end q-gutter-xs">
        <!-- Filtro: Sucursal (Solo visible para Admin y Credito) -->
        <q-select
          v-if="isAdminOrCredito"
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
          v-model="localSucursal"
          :options="filteredSucursales"
          label="Sucursal"
          style="min-width: 140px; max-width: 180px"
          @filter="filterSucursales"
          @update:model-value="emitUpdate"
        />

        <!-- Filtro: Empleado / Asesor (Solo visible para Admin y Credito) -->
        <q-select
          v-if="isAdminOrCredito"
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
          v-model="localAsesor"
          :options="filteredEmpleados"
          label="Asesor"
          style="min-width: 150px; max-width: 190px"
          @filter="filterEmpleados"
          @update:model-value="emitUpdate"
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
          v-model="localLinea"
          :options="options?.creditoLineas || []"
          label="Línea de Crédito"
          style="min-width: 140px; max-width: 180px"
          @update:model-value="emitUpdate"
        />

        <!-- Alternador Vista: Calendario vs Tabla -->
        <q-btn-toggle
          v-model="viewMode"
          dense
          unelevated
          toggle-color="primary"
          color="grey-2"
          text-color="grey-8"
          :options="[
            { icon: 'calendar_month', value: 'grid', slot: 'grid' },
            { icon: 'view_list', value: 'list', slot: 'list' },
          ]"
          @update:model-value="(val) => $emit('update:viewMode', val)"
        >
          <template v-slot:grid>
            <q-tooltip>Vista Calendario</q-tooltip>
          </template>
          <template v-slot:list>
            <q-tooltip>Vista Lista Detallada</q-tooltip>
          </template>
        </q-btn-toggle>

        <!-- Botón Refrescar -->
        <q-btn
          outline
          color="primary"
          icon="refresh"
          dense
          class="q-px-sm"
          :loading="loading"
          @click="$emit('refresh')"
        >
          <q-tooltip>Actualizar datos</q-tooltip>
        </q-btn>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { checkRole } from "src/boot/functions";

const isAdminOrCredito = computed(() => {
  return checkRole("Admin") || checkRole("Credito");
});

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  sucursalId: {
    type: [Number, String],
    default: null,
  },
  asesorId: {
    type: [Number, String],
    default: null,
  },
  lineaId: {
    type: [Number, String],
    default: null,
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

const emit = defineEmits([
  "update:year",
  "update:month",
  "update:sucursalId",
  "update:asesorId",
  "update:lineaId",
  "update:viewMode",
  "refresh",
]);

const viewMode = ref("grid");

const localYear = ref(props.year);
const localMonth = ref(props.month);
const localSucursal = ref(props.sucursalId);
const localAsesor = ref(props.asesorId);
const localLinea = ref(props.lineaId);

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const yearOptions = [
  currentYear + 2,
  currentYear + 1,
  currentYear,
  currentYear - 1,
  currentYear - 2,
];

const monthOptions = [
  { label: "Enero", value: 1 },
  { label: "Febrero", value: 2 },
  { label: "Marzo", value: 3 },
  { label: "Abril", value: 4 },
  { label: "Mayo", value: 5 },
  { label: "Junio", value: 6 },
  { label: "Julio", value: 7 },
  { label: "Agosto", value: 8 },
  { label: "Septiembre", value: 9 },
  { label: "Octubre", value: 10 },
  { label: "Noviembre", value: 11 },
  { label: "Diciembre", value: 12 },
];

watch(
  () => props.year,
  (val) => (localYear.value = val)
);
watch(
  () => props.month,
  (val) => (localMonth.value = val)
);
watch(
  () => props.sucursalId,
  (val) => (localSucursal.value = val)
);
watch(
  () => props.asesorId,
  (val) => (localAsesor.value = val)
);
watch(
  () => props.lineaId,
  (val) => (localLinea.value = val)
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

const emitUpdate = () => {
  emit("update:year", localYear.value);
  emit("update:month", localMonth.value);
  emit("update:sucursalId", localSucursal.value);
  emit("update:asesorId", localAsesor.value);
  emit("update:lineaId", localLinea.value);
  emit("refresh");
};

const prevMonth = () => {
  if (localMonth.value === 1) {
    localMonth.value = 12;
    localYear.value--;
  } else {
    localMonth.value--;
  }
  emitUpdate();
};

const nextMonth = () => {
  if (localMonth.value === 12) {
    localMonth.value = 1;
    localYear.value++;
  } else {
    localMonth.value++;
  }
  emitUpdate();
};

const goToCurrentMonth = () => {
  localYear.value = currentYear;
  localMonth.value = currentMonth;
  emitUpdate();
};
</script>
