<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="min-width: 680px; max-width: 950px; width: 100%" class="rounded-borders">
      <!-- Encabezado con color temático según el KPI -->
      <q-card-section
        class="text-white row items-center justify-between q-py-sm"
        :class="headerColor"
      >
        <div class="row items-center q-gutter-sm">
          <q-icon :name="headerIcon" size="sm" />
          <div>
            <div class="text-subtitle1 text-weight-bold">
              {{ headerTitle }}
            </div>
            <div class="text-caption text-white opacity-85">
              {{ itemsFiltrados.length }} {{ esTipoSolicitud ? (itemsFiltrados.length === 1 ? 'crédito registrado' : 'créditos registrados') : (itemsFiltrados.length === 1 ? 'pago' : 'pagos') }} • Total: {{ formatCurrency(totalMonto) }}
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

      <!-- Lista de Registros -->
      <q-card-section class="q-pa-md scroll" style="max-height: 68vh">
        <div v-if="itemsFiltrados && itemsFiltrados.length > 0" class="q-gutter-y-sm">

          <!-- CASO A: Listado de Solicitudes (Colocado o Ticket Promedio) -->
          <template v-if="esTipoSolicitud">
            <q-card
              v-for="item in itemsFiltrados"
              :key="'solicitud-' + item.id"
              flat
              bordered
              class="rounded-borders bg-white shadow-1"
            >
              <q-card-section class="q-pa-sm">
                <!-- Fila 1: Folio, Cliente y Estatus -->
                <div class="row items-center justify-between no-wrap q-mb-xs">
                  <div class="row items-center q-gutter-xs col ellipsis">
                    <q-chip dense color="indigo-1" text-color="indigo-9" class="text-weight-bold">
                      #{{ item.folio }}
                    </q-chip>
                    <span class="text-weight-bold text-dark text-body2 ellipsis">
                      {{ item.cliente }}
                    </span>
                  </div>

                  <q-chip
                    dense
                    class="text-weight-bold text-white q-px-sm"
                    :style="{ backgroundColor: item.estatus_color || '#1976d2' }"
                  >
                    {{ item.estatus }}
                  </q-chip>
                </div>

                <!-- Fila 2: Sucursal, Asesor, Línea y Teléfono -->
                <div class="row items-center justify-between text-caption text-grey-7 q-mb-xs">
                  <div class="row items-center q-gutter-sm">
                    <span v-if="item.telefono" class="flex items-center q-gutter-xs">
                      <q-icon name="phone" size="xs" color="positive" />
                      <a :href="'tel:' + item.telefono" class="text-primary text-weight-medium">
                        {{ formatPhoneNumber(item.telefono) }}
                      </a>
                    </span>
                    <span v-if="item.sucursal">
                      • <strong>Sucursal:</strong> {{ item.sucursal }}
                    </span>
                    <span v-if="item.asesor">
                      • <strong>Asesor:</strong> {{ item.asesor }}
                    </span>
                    <span v-if="item.linea">
                      • <strong>Línea:</strong> {{ item.linea }}
                    </span>
                  </div>

                  <q-badge color="blue-1" text-color="blue-9" class="text-weight-bold">
                    {{ item.numero_pagos }} pagos pactados
                  </q-badge>
                </div>

                <q-separator class="q-my-xs" />

                <!-- Fila 3: Fecha de Registro y Monto Solicitado -->
                <div class="row items-center justify-between q-mt-xs">
                  <div class="row items-center q-gutter-sm text-caption text-grey-8">
                    <span v-if="item.created_at" class="flex items-center q-gutter-xs">
                      <q-icon name="event" size="xs" color="primary" />
                      <span>Registrado: <strong>{{ formatFechaLarga(item.created_at) }}</strong></span>
                    </span>
                    <span v-if="item.resumen_pagos" class="flex items-center q-gutter-xs text-grey-7">
                      <q-icon name="donut_large" size="xs" color="indigo" />
                      <span>Progreso: {{ item.resumen_pagos }}</span>
                    </span>
                  </div>

                  <div class="row items-center q-gutter-xs">
                    <span class="text-caption text-grey-7">Monto Colocado: </span>
                    <span class="text-weight-bolder text-primary text-subtitle1">
                      {{ formatCurrency(item.monto_solicitado) }}
                    </span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </template>

          <!-- CASO B: Listado de Pagos (Cobrado, Vencido, Pendiente, Por Validar) -->
          <template v-else>
            <q-card
              v-for="pago in itemsFiltrados"
              :key="'pago-' + pago.id"
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
                  <!-- Badge de Días Vencido en Mora -->
                  <q-badge
                    v-if="pago.dias_vencido > 0 && tipoKpi === 'vencido'"
                    color="red-1"
                    text-color="red-9"
                    class="text-weight-bold q-pa-xs"
                  >
                    <q-icon name="alarm" size="xs" class="q-mr-xs" />
                    {{ pago.dias_vencido }} días de mora
                  </q-badge>

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
                    v-else-if="Number(pago.monto_pagado) > 0 || pago.comprobante_url || pago.estado_cobro === 'liquidado' || pago.estado_validacion === 'por_validar'"
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
                    <q-icon name="event" size="xs" :color="tipoKpi === 'vencido' ? 'negative' : 'primary'" />
                    <span>Fecha límite: <strong>{{ formatFechaLarga(pago.fecha_a_pagar) }}</strong></span>
                  </span>
                  <span v-if="pago.fecha_liquidado" class="flex items-center q-gutter-xs text-positive">
                    <q-icon name="check_circle" size="xs" color="positive" />
                    <span>Cobrado: <strong>{{ formatFechaLarga(pago.fecha_liquidado) }}</strong></span>
                  </span>
                </div>

                <div class="row items-center q-gutter-md">
                  <div v-if="Number(pago.monto_pagado) > 0 && (tipoKpi === 'cobrado' || tipoKpi === 'validado' || tipoKpi === 'por_validar')">
                    <span class="text-caption text-grey-7">Monto Pagado: </span>
                    <span class="text-weight-bold text-positive text-subtitle2">
                      {{ formatCurrency(pago.monto_pagado) }}
                    </span>
                  </div>

                  <div v-if="Number(pago.saldo_pendiente) > 0 && (tipoKpi === 'vencido' || tipoKpi === 'pendiente')">
                    <span class="text-caption text-grey-7">Saldo Pendiente: </span>
                    <span
                      class="text-weight-bold text-subtitle2"
                      :class="tipoKpi === 'vencido' ? 'text-negative' : 'text-dark'"
                    >
                      {{ formatCurrency(pago.saldo_pendiente) }}
                    </span>
                  </div>

                  <div v-if="tipoKpi === 'por_validar' && !pago.monto_pagado">
                    <span class="text-caption text-grey-7">Monto Esperado: </span>
                    <span class="text-weight-bold text-orange-9 text-subtitle2">
                      {{ formatCurrency(pago.monto_esperado) }}
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
        </template>

      </div>

      <div v-else class="text-center text-grey-5 q-pa-xl">
        <q-icon name="filter_list_off" size="xl" />
        <div class="text-body2 q-mt-sm">No se encontraron registros con los criterios seleccionados</div>
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
  type: String, // 'colocado', 'cobrado', 'validado', 'vencido', 'pendiente', 'por_validar', 'ticket_promedio'
  default: 'vencido',
},
items: {
  type: Array,
  default: () => [],
},
});

defineEmits(["update:modelValue"]);

const filtroBusqueda = ref("");

const esTipoSolicitud = computed(() => {
return props.tipoKpi === "colocado" || props.tipoKpi === "ticket_promedio";
});

const headerColor = computed(() => {
switch (props.tipoKpi) {
  case "colocado":
    return "bg-primary";
  case "cobrado":
    return "bg-positive";
  case "validado":
    return "bg-teal-8";
  case "por_validar":
    return "bg-orange-9";
  case "vencido":
    return "bg-negative";
  case "pendiente":
    return "bg-amber-9";
  case "ticket_promedio":
    return "bg-indigo-8";
  default:
    return "bg-primary";
}
});

const headerIcon = computed(() => {
switch (props.tipoKpi) {
  case "colocado":
    return "account_balance_wallet";
  case "cobrado":
    return "payments";
  case "validado":
    return "verified";
  case "por_validar":
    return "pending_actions";
  case "vencido":
    return "report_problem";
  case "pendiente":
    return "schedule";
  case "ticket_promedio":
    return "pie_chart";
  default:
    return "analytics";
}
});

const headerTitle = computed(() => {
switch (props.tipoKpi) {
  case "colocado":
    return "Créditos Registrados (Monto Total Colocado)";
  case "cobrado":
    return "Cobranza Recuperada (Pagos Liquidados / Cobrados)";
  case "validado":
    return "Cobranza Validada (Confirmada por Crédito)";
  case "por_validar":
    return "Dinero y Pagos Por Validar (Falta Validación)";
  case "vencido":
    return "Cartera Vencida (Pagos en Mora)";
  case "pendiente":
    return "Saldo Pendiente Activo por Cobrar";
  case "ticket_promedio":
    return "Detalle de Solicitudes y Ticket Promedio";
  default:
    return "Detalle de Métricas Ejecutivas";
}
});

const itemsFiltrados = computed(() => {
if (!props.items || props.items.length === 0) return [];
if (!filtroBusqueda.value || filtroBusqueda.value.trim() === "") {
  return props.items;
}
const needle = filtroBusqueda.value.toLowerCase();
return props.items.filter(
  (item) =>
    (item.cliente && item.cliente.toLowerCase().includes(needle)) ||
    (item.folio && item.folio.toString().includes(needle)) ||
    (item.sucursal && item.sucursal.toLowerCase().includes(needle)) ||
    (item.asesor && item.asesor.toLowerCase().includes(needle)) ||
    (item.linea && item.linea.toLowerCase().includes(needle))
);
});

const totalMonto = computed(() => {
if (esTipoSolicitud.value) {
  return itemsFiltrados.value.reduce(
    (acc, s) => acc + (Number(s.monto_solicitado) || 0),
    0
  );
}

return itemsFiltrados.value.reduce((acc, p) => {
  if (props.tipoKpi === "cobrado" || props.tipoKpi === "validado") {
    return acc + (Number(p.monto_pagado) || 0);
  }
  if (props.tipoKpi === "vencido" || props.tipoKpi === "pendiente") {
    return (
      acc +
      (Number(p.saldo_pendiente) > 0
        ? Number(p.saldo_pendiente)
        : Number(p.monto_esperado) || 0)
    );
  }
  if (props.tipoKpi === "por_validar") {
    return (
      acc +
      (Number(p.monto_pagado) > 0
        ? Number(p.monto_pagado)
        : Number(p.monto_esperado) || 0)
    );
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
.opacity-85 {
  opacity: 0.88;
}
</style>
