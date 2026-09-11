<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="min-width: 650px; max-width: 900px; width: 100%" class="rounded-borders">
      <!-- Encabezado del Modal con color temático -->
      <q-card-section
        class="text-white row items-center justify-between q-py-sm"
        :class="headerColor"
      >
        <div class="row items-center q-gutter-sm">
          <q-icon :name="headerIcon" size="sm" />
          <div>
            <div class="text-subtitle1 text-weight-bold">
              {{ titulo }}
            </div>
            <div class="text-caption text-white opacity-80">
              <span v-if="tipoKpi === 'pagado'">
                {{ pagosFiltrados.length }} {{ pagosFiltrados.length === 1 ? 'pago recaudado' : 'pagos recaudados' }} • Total Recaudado: {{ formatCurrency(totalMonto) }}
              </span>
              <span v-else-if="tipoKpi === 'validado'">
                {{ pagosFiltrados.length }} {{ pagosFiltrados.length === 1 ? 'pago validado' : 'pagos validados por Crédito' }} • Total Validado: {{ formatCurrency(totalMonto) }}
              </span>
              <span v-else-if="tipoKpi === 'por_validar'">
                {{ pagosFiltrados.length }} {{ pagosFiltrados.length === 1 ? 'pago pendiente de validar' : 'pagos pendientes de validar' }} • Monto por Validar: {{ formatCurrency(totalMonto) }}
              </span>
              <span v-else-if="tipoKpi === 'vencido'">
                {{ pagosFiltrados.length }} {{ pagosFiltrados.length === 1 ? 'pago vencido' : 'pagos vencidos en mora' }} • Total en Mora: {{ formatCurrency(totalMonto) }}
              </span>
              <span v-else-if="tipoKpi === 'pendiente'">
                {{ pagosFiltrados.length }} {{ pagosFiltrados.length === 1 ? 'pago por vencer en el mes' : 'pagos por vencer en el mes' }}
              </span>
              <span v-else>
                {{ pagosFiltrados.length }} {{ pagosFiltrados.length === 1 ? 'pago programado en el mes' : 'pagos programados en el mes' }}
              </span>
            </div>
          </div>
        </div>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <!-- Barra de búsqueda rápida -->
      <q-card-section class="q-pa-sm bg-grey-1 border-bottom">
        <q-input
          dense
          outlined
          debounce="200"
          v-model="filtroBusqueda"
          placeholder="Buscar por cliente, folio, sucursal, asesor o línea..."
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" color="grey-6" />
          </template>
        </q-input>
      </q-card-section>

      <!-- Lista de Pagos -->
      <q-card-section class="q-pa-md scroll" style="max-height: 65vh">
        <div v-if="pagosFiltrados && pagosFiltrados.length > 0" class="q-gutter-y-sm">
          <q-card
            v-for="pago in pagosFiltrados"
            :key="pago.id"
            flat
            bordered
            class="rounded-borders bg-white shadow-1"
          >
            <q-card-section class="q-pa-sm">
              <!-- Fila 1: Folio, Cliente, Estatus y Validación -->
              <div class="row items-center justify-between no-wrap q-mb-xs">
                <div class="row items-center q-gutter-xs col ellipsis">
                  <q-chip dense color="indigo-1" text-color="indigo-9" class="text-weight-bold">
                    #{{ pago.folio }}
                  </q-chip>
                  <span class="text-weight-bold text-dark text-body2 ellipsis">
                    {{ pago.cliente }}
                  </span>
                </div>

                <div class="row items-center q-gutter-xs">
                  <!-- Badge de Validación -->
                  <q-badge
                    v-if="pago.esta_validado"
                    color="teal-1"
                    text-color="teal-9"
                    class="text-weight-bold q-pa-xs"
                  >
                    <q-icon name="verified" size="xs" class="q-mr-xs" />
                    Validado
                  </q-badge>

                  <q-badge
                    v-else-if="Number(pago.monto_pagado) > 0 || pago.comprobante_url || pago.estado_cobro === 'liquidado'"
                    color="orange-1"
                    text-color="orange-10"
                    class="text-weight-bold q-pa-xs"
                  >
                    <q-icon name="pending_actions" size="xs" class="q-mr-xs" />
                    Falta Validar
                  </q-badge>

                  <q-chip
                    dense
                    class="text-weight-bold text-white q-px-sm"
                    :style="{ backgroundColor: pago.estatus_color || '#1976d2' }"
                  >
                    {{ pago.estatus }}
                  </q-chip>
                </div>
              </div>

              <!-- Fila 2: Sucursal, Asesor, Línea, Contacto y Validador -->
              <div class="row items-center justify-between text-caption text-grey-7 q-mb-xs">
                <div class="row items-center q-gutter-sm">
                  <span v-if="pago.telefono" class="flex items-center q-gutter-xs">
                    <q-icon name="phone" size="xs" color="positive" />
                    <a :href="'tel:' + pago.telefono" class="text-primary text-weight-medium">
                      {{ formatPhoneNumber(pago.telefono) }}
                    </a>
                  </span>
                  <span v-if="pago.sucursal">
                    • <strong>Sucursal:</strong> {{ pago.sucursal }}
                  </span>
                  <span v-if="pago.asesor">
                    • <strong>Asesor:</strong> {{ pago.asesor }}
                  </span>
                  <span v-if="pago.linea">
                    • <strong>Línea:</strong> {{ pago.linea }}
                  </span>
                  <span v-if="pago.validado_por" class="text-teal-9">
                    • <strong>Validado por:</strong> {{ pago.validado_por }}
                  </span>
                </div>

                <q-badge color="blue-grey-1" text-color="blue-grey-9" class="text-weight-medium">
                  {{ pago.etiqueta }}
                </q-badge>
              </div>

              <q-separator class="q-my-xs" />

              <!-- Fila 3: Fechas y Montos Financieros -->
              <div class="row items-center justify-between q-mt-xs">
                <div class="row items-center q-gutter-sm text-caption text-grey-8">
                  <span v-if="pago.fecha_a_pagar" class="flex items-center q-gutter-xs">
                    <q-icon name="event" size="xs" color="primary" />
                    <span>Fecha límite: <strong>{{ formatFechaLarga(pago.fecha_a_pagar) }}</strong></span>
                  </span>
                  <span v-if="pago.fecha_liquidado" class="flex items-center q-gutter-xs text-positive">
                    <q-icon name="check_circle" size="xs" color="positive" />
                    <span>Liquidado: <strong>{{ formatFechaLarga(pago.fecha_liquidado) }}</strong></span>
                  </span>
                </div>

                <div class="row items-center q-gutter-md">
                  <div v-if="Number(pago.monto_pagado) > 0">
                    <span class="text-caption text-grey-7">Pagado: </span>
                    <span class="text-weight-bold text-positive text-subtitle2">
                      {{ formatCurrency(pago.monto_pagado) }}
                    </span>
                  </div>

                  <div v-if="Number(pago.saldo_pendiente) > 0">
                    <span class="text-caption text-grey-7">Saldo Pendiente: </span>
                    <span
                      class="text-weight-bold text-subtitle2"
                      :class="pago.estado_cobro === 'vencido' ? 'text-negative' : 'text-dark'"
                    >
                      {{ formatCurrency(pago.saldo_pendiente) }}
                    </span>
                  </div>

                  <!-- Botón Comprobante PDF -->
                  <q-btn
                    v-if="pago.comprobante_url"
                    dense
                    flat
                    color="red-8"
                    icon="picture_as_pdf"
                    label="Recibo"
                    size="sm"
                    class="text-weight-bold"
                    @click="abrirComprobante(pago.comprobante_url)"
                  >
                    <q-tooltip>Abrir comprobante PDF</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div v-else class="text-center text-grey-5 q-pa-xl">
          <q-icon name="filter_list_off" size="xl" />
          <div class="text-body2 q-mt-sm">No se encontraron pagos con los criterios seleccionados</div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Acciones Inferiores -->
      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  formatCurrency,
  formatPhoneNumber,
  formatFechaLarga,
} from "src/boot/format";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  tipoKpi: {
    type: String, // 'pagado', 'validado', 'por_validar', 'prospectado', 'vencido', 'pendiente'
    default: 'vencido',
  },
  nombreMes: {
    type: String,
    default: '',
  },
  pagos: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["update:modelValue"]);

const filtroBusqueda = ref("");

const headerColor = computed(() => {
  switch (props.tipoKpi) {
    case "pagado":
      return "bg-positive";
    case "validado":
      return "bg-teal-8";
    case "por_validar":
      return "bg-orange-9";
    case "prospectado":
      return "bg-primary";
    case "vencido":
      return "bg-negative";
    case "pendiente":
      return "bg-amber-9";
    default:
      return "bg-primary";
  }
});

const headerIcon = computed(() => {
  switch (props.tipoKpi) {
    case "pagado":
      return "paid";
    case "validado":
      return "verified";
    case "por_validar":
      return "pending_actions";
    case "prospectado":
      return "calendar_month";
    case "vencido":
      return "error_outline";
    case "pendiente":
      return "timelapse";
    default:
      return "payments";
  }
});

const titulo = computed(() => {
  const mes = props.nombreMes || "el Mes";
  switch (props.tipoKpi) {
    case "pagado":
      return `Dinero Recaudado en ${mes} (Ingresado a Cuenta)`;
    case "validado":
      return `Dinero Validado en ${mes} (Verificado por Crédito)`;
    case "por_validar":
      return `Dinero y Pagos Por Validar en ${mes}`;
    case "prospectado":
      return `Pagos Programados en ${mes}`;
    case "vencido":
      return `Pagos Vencidos en ${mes} (Mora)`;
    case "pendiente":
      return `Pagos Por Vencer en ${mes}`;
    default:
      return `Detalle de Pagos en ${mes}`;
  }
});

const pagosPorTipo = computed(() => {
  if (!props.pagos || props.pagos.length === 0) return [];
  switch (props.tipoKpi) {
    case "pagado":
      return props.pagos.filter(
        (p) =>
          p.fue_cobrado_en_mes === true ||
          (p.fue_cobrado_en_mes === undefined &&
            (p.estado_cobro === "liquidado" || Number(p.monto_pagado) > 0))
      );
    case "validado":
      return props.pagos.filter(
        (p) =>
          (p.fue_cobrado_en_mes === true || p.fue_cobrado_en_mes === undefined) &&
          p.esta_validado === true
      );
    case "por_validar":
      return props.pagos.filter(
        (p) =>
          (p.fue_cobrado_en_mes === true || p.fue_cobrado_en_mes === undefined) &&
          !p.esta_validado &&
          (p.estado_validacion === "por_validar" ||
            Number(p.monto_pagado) > 0 ||
            p.comprobante_url ||
            p.estado_cobro === "liquidado")
      );
    case "vencido":
      return props.pagos.filter(
        (p) => p.estado_cobro === "vencido" && p.fue_programado_en_mes !== false
      );
    case "pendiente":
      return props.pagos.filter(
        (p) => p.estado_cobro === "pendiente" && p.fue_programado_en_mes !== false
      );
    case "prospectado":
      return props.pagos.filter((p) => p.fue_programado_en_mes !== false);
    default:
      return props.pagos;
  }
});

const pagosFiltrados = computed(() => {
  let list = pagosPorTipo.value;
  if (!filtroBusqueda.value || filtroBusqueda.value.trim() === "") {
    return list;
  }
  const needle = filtroBusqueda.value.toLowerCase();
  return list.filter(
    (p) =>
      (p.cliente && p.cliente.toLowerCase().includes(needle)) ||
      (p.folio && p.folio.toString().includes(needle)) ||
      (p.sucursal && p.sucursal.toLowerCase().includes(needle)) ||
      (p.asesor && p.asesor.toLowerCase().includes(needle)) ||
      (p.linea && p.linea.toLowerCase().includes(needle))
  );
});

const totalMonto = computed(() => {
  return pagosFiltrados.value.reduce((acc, p) => {
    if (props.tipoKpi === "pagado" || props.tipoKpi === "validado") {
      return acc + (Number(p.monto_pagado) || 0);
    }
    if (props.tipoKpi === "por_validar") {
      return acc + (Number(p.monto_pagado) > 0 ? Number(p.monto_pagado) : (Number(p.monto_esperado) || 0));
    }
    if (props.tipoKpi === "vencido") {
      return acc + (Number(p.saldo_pendiente) > 0 ? Number(p.saldo_pendiente) : (Number(p.monto_esperado) || 0));
    }
    if (props.tipoKpi === "pendiente") {
      return acc + (Number(p.saldo_pendiente) > 0 ? Number(p.saldo_pendiente) : (Number(p.monto_esperado) || 0));
    }
    return acc + (Number(p.monto_esperado) || Number(p.monto_pagado) || 0);
  }, 0);
});

const abrirComprobante = (url) => {
  if (url) {
    window.open(url, "_blank");
  }
};
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.opacity-80 {
  opacity: 0.85;
}
</style>
