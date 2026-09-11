<template>
  <q-card flat bordered class="bg-white rounded-borders shadow-1 q-pa-sm">
    <!-- Encabezados de Días de la Semana -->
    <div class="row q-col-gutter-xs text-center text-weight-bold text-grey-8 q-pb-xs">
      <div v-for="d in diasSemana" :key="d" class="col text-caption text-uppercase">
        {{ d }}
      </div>
    </div>

    <q-separator class="q-mb-xs" />

    <!-- Cuadrícula de Días -->
    <div class="calendar-grid">
      <!-- Celdas vacías de relleno al inicio del mes -->
      <div
        v-for="blank in paddingStart"
        :key="'blank-' + blank"
        class="calendar-day day-empty bg-grey-1"
      />

      <!-- Días del Mes -->
      <div
        v-for="dia in dias"
        :key="dia.fecha"
        class="calendar-day"
        :class="{
          'day-today': dia.es_hoy,
          'day-has-events': dia.conteo_pagos > 0,
          'day-has-pending': getConteoPendientes(dia) > 0,
          'day-has-vencido': (dia.conteo_vencidos || 0) > 0 || Number(dia.total_vencido || 0) > 0,
          'day-has-cobrado': Number(dia.total_pagado || 0) > 0,
          'day-selected': selectedFecha === dia.fecha,
        }"
        @click="$emit('select-dia', dia)"
      >
        <!-- Encabezado del Día -->
        <div class="row items-center justify-between no-wrap q-mb-xs">
          <q-badge
            :color="dia.es_hoy ? 'primary' : 'transparent'"
            :text-color="dia.es_hoy ? 'white' : 'dark'"
            class="text-weight-bold day-badge"
            :class="{ 'day-number-today': dia.es_hoy }"
          >
            {{ dia.dia }}
          </q-badge>

          <!-- Badges de Conteo en el encabezado del día -->
          <div class="row items-center q-gutter-xs">
            <!-- Dinero Cobrado en este día -->
            <q-badge
              v-if="Number(dia.total_pagado || 0) > 0"
              color="green-1"
              text-color="green-9"
              class="text-weight-bold"
            >
              <q-icon name="check_circle" size="10px" class="q-mr-xs" />
              {{ dia.conteo_liquidados || 1 }}
            </q-badge>

            <!-- Pagos Pendientes -->
            <q-badge
              v-if="getConteoPendientes(dia) > 0"
              color="amber-2"
              text-color="amber-10"
              class="text-weight-bold"
            >
              <q-icon name="schedule" size="10px" class="q-mr-xs" />
              {{ getConteoPendientes(dia) }}
            </q-badge>

            <!-- Pagos Vencidos -->
            <q-badge
              v-if="(dia.conteo_vencidos || 0) > 0"
              color="red-1"
              text-color="red-9"
              class="text-weight-bold"
            >
              <q-icon name="error_outline" size="10px" class="q-mr-xs" />
              {{ dia.conteo_vencidos }}
            </q-badge>
          </div>
        </div>

        <!-- Mini resumen de pagos en el día -->
        <div v-if="dia.conteo_pagos > 0 || Number(dia.total_pagado || 0) > 0" class="column q-gutter-xs day-indicators">
          <!-- 1. Dinero Cobrado este día (Verde) -->
          <div
            v-if="Number(dia.total_pagado || 0) > 0"
            class="indicator-chip bg-green-1 text-positive text-weight-bold row items-center justify-between no-wrap"
          >
            <span class="flex items-center q-gutter-xs ellipsis">
              <q-icon name="check_circle" size="12px" />
              <span>Cobrado</span>
            </span>
            <span>{{ formatCompact(dia.total_pagado) }}</span>
          </div>

          <!-- 2. Pagos Pendientes (Ámbar) -->
          <div
            v-if="getConteoPendientes(dia) > 0"
            class="indicator-chip bg-amber-1 text-amber-10 text-weight-bold row items-center justify-between no-wrap"
          >
            <span class="flex items-center q-gutter-xs ellipsis">
              <q-icon name="schedule" size="12px" />
              <span>{{ getConteoPendientes(dia) === 1 ? '1 pendiente' : getConteoPendientes(dia) + ' pendientes' }}</span>
            </span>
          </div>

          <!-- 3. Monto Vencido (Rojo) -->
          <div
            v-if="(dia.conteo_vencidos || 0) > 0 || Number(dia.total_vencido || 0) > 0"
            class="indicator-chip bg-red-1 text-negative text-weight-bold row items-center justify-between no-wrap"
          >
            <span class="flex items-center q-gutter-xs ellipsis">
              <q-icon name="error_outline" size="12px" />
              <span>{{ (dia.conteo_vencidos || 1) }} vencido{{ (dia.conteo_vencidos > 1 ? 's' : '') }}</span>
            </span>
            <span>{{ formatCompact(dia.total_vencido) }}</span>
          </div>

          <!-- Mini etiquetas con detalle de clientes SOLO para pagos programados en este día -->
          <div
            v-for="pago in getPagosVisibles(dia).slice(0, 3)"
            :key="'p-tag-' + pago.id + '-' + (pago.tipo_evento || '')"
            class="mini-pago-tag ellipsis"
            :class="getClaseMiniTag(pago)"
          >
            <span class="text-weight-bold">#{{ pago.folio }}</span> {{ pago.cliente }}
            <span v-if="pago.estado_cobro === 'liquidado' || pago.tipo_evento === 'cobro'" class="text-weight-bold q-ml-xs">
              ✓ {{ Number(pago.monto_pagado) > 0 ? formatCompact(pago.monto_pagado) : '' }}
            </span>
            <span v-else-if="pago.estado_cobro === 'vencido'" class="text-weight-bold q-ml-xs">
              (!)
            </span>
          </div>

          <div
            v-if="getPagosVisibles(dia).length > 3"
            class="text-caption text-grey-8 text-weight-medium q-px-xs"
            style="font-size: 9.5px; line-height: 1"
          >
            +{{ getPagosVisibles(dia).length - 3 }} pago(s) más
          </div>
        </div>

        <div v-else class="day-no-events text-caption text-grey-4 text-center q-pt-sm">
          —
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { computed } from "vue";
import { formatCurrency } from "src/boot/format";

const props = defineProps({
  dias: {
    type: Array,
    default: () => [],
  },
  selectedFecha: {
    type: String,
    default: null,
  },
});

defineEmits(["select-dia"]);

const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Espacios vacíos antes del 1er día del mes (1 = Lun -> 0 padding, 7 = Dom -> 6 padding)
const paddingStart = computed(() => {
  if (!props.dias || props.dias.length === 0) return 0;
  const primerDiaSemana = props.dias[0].dia_semana || 1;
  return primerDiaSemana - 1;
});

const getPagosPendientes = (dia) => {
  if (!dia?.pagos) return [];
  return dia.pagos.filter((p) => p.estado_cobro === "pendiente");
};

const getConteoPendientes = (dia) => {
  if (dia?.conteo_pendientes !== undefined && dia.conteo_pendientes !== null && dia.conteo_pendientes > 0) {
    return dia.conteo_pendientes;
  }
  return getPagosPendientes(dia).length;
};

const getPagosVisibles = (dia) => {
  if (!dia?.pagos) return [];
  // Solo se listan en el recuadro del día los pagos PROGRAMADOS para esta fecha
  const programados = dia.pagos.filter((p) => {
    if (p.tipo_evento === "cobro") return false;
    if (p.tipo_evento === "programado" || p.tipo_evento === "ambos") return true;
    return p.fecha_a_pagar && p.fecha_a_pagar.startsWith(dia.fecha);
  });

  // Orden de prioridad: pendientes primero, luego vencidos, luego ya liquidados
  return programados.sort((a, b) => {
    const score = (p) =>
      p.estado_cobro === "pendiente" ? 1 : p.estado_cobro === "vencido" ? 2 : 3;
    return score(a) - score(b);
  });
};

const getClaseMiniTag = (pago) => {
  if (pago.estado_cobro === "liquidado" || pago.tipo_evento === "cobro") {
    return "border-green text-positive";
  }
  if (pago.estado_cobro === "vencido") {
    return "border-red text-negative";
  }
  return "border-amber text-amber-10";
};

const formatCompact = (val) => {
  if (!val) return "$0";
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
  return formatCurrency(val);
};
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.calendar-day {
  min-height: 110px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 6px;
  background-color: #ffffff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.calendar-day:hover {
  border-color: #1976d2;
  box-shadow: 0 3px 10px rgba(25, 118, 210, 0.15);
  transform: translateY(-2px);
}

.day-empty {
  opacity: 0.4;
  border-style: dashed;
  cursor: default;
}
.day-empty:hover {
  border-color: #e0e0e0;
  box-shadow: none;
  transform: none;
}

.day-today {
  border-color: #1976d2;
  background-color: #f0f7ff;
}

.day-has-pending {
  border-top: 3px solid #ff9800;
}

.day-has-vencido {
  border-left: 3px solid #d32f2f;
}

.day-has-cobrado {
  border-bottom: 3px solid #2e7d32;
}

.day-selected {
  border: 2px solid #1976d2 !important;
  background-color: #e3f2fd;
}

.day-badge {
  font-size: 13px;
  padding: 2px 6px;
}

.day-number-today {
  border-radius: 12px;
}

.day-indicators {
  flex: 1;
  justify-content: flex-start;
}

.indicator-chip {
  font-size: 10.5px;
  padding: 2px 5px;
  border-radius: 4px;
  line-height: 1.2;
}

.mini-pago-tag {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
  line-height: 1.2;
}

.border-green {
  border: 1px solid #c8e6c9;
  background-color: #f1f8e9;
}

.border-amber {
  border: 1px solid #ffe082;
  background-color: #fffde7;
}

.border-red {
  border: 1px solid #ffcdd2;
  background-color: #ffebee;
}

.day-no-events {
  user-select: none;
}

@media (max-width: 768px) {
  .calendar-day {
    min-height: 85px;
    padding: 3px;
  }
  .indicator-chip {
    font-size: 9px;
    padding: 1px 3px;
  }
  .mini-pago-tag {
    font-size: 8.5px;
  }
}
</style>
