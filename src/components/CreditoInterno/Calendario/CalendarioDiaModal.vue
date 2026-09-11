<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="min-width: 580px; max-width: 800px; width: 100%" class="rounded-borders">
      <!-- Encabezado del Modal -->
      <q-card-section class="bg-primary text-white row items-center justify-between q-py-sm">
        <div class="row items-center q-gutter-sm">
          <q-icon name="event" size="sm" />
          <div>
            <div class="text-subtitle1 text-weight-bold">
              Pagos del {{ formatFechaLarga(dia?.fecha) }}
            </div>
            <div class="text-caption text-blue-1">
              {{ dia?.pagos?.length || 0 }} {{ (dia?.pagos?.length === 1) ? 'pago / movimiento' : 'pagos / movimientos' }}
            </div>
          </div>
        </div>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <!-- Resumen del Día -->
      <q-card-section class="q-pa-sm bg-grey-2 border-bottom">
        <div class="row q-col-gutter-xs text-center">
          <div class="col-3">
            <div class="text-caption text-grey-7">Recaudado</div>
            <div class="text-weight-bold text-positive">
              {{ formatCurrency(dia?.total_pagado || 0) }}
            </div>
          </div>
          <div class="col-3">
            <div class="text-caption text-grey-7">Validado</div>
            <div class="text-weight-bold text-teal-9">
              {{ formatCurrency(dia?.total_validado || 0) }}
            </div>
          </div>
          <div class="col-3">
            <div class="text-caption text-grey-7">Por Validar</div>
            <div class="text-weight-bold text-orange-9">
              {{ formatCurrency(dia?.total_por_validar || 0) }}
            </div>
          </div>
          <div class="col-3">
            <div class="text-caption text-grey-7">Vencido</div>
            <div class="text-weight-bold text-negative">
              {{ formatCurrency(dia?.total_vencido || 0) }}
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Lista de Pagos del Día -->
      <q-card-section class="q-pa-md scroll" style="max-height: 60vh">
        <div v-if="dia?.pagos && dia.pagos.length > 0" class="q-gutter-y-sm">
          <q-card
            v-for="pago in dia.pagos"
            :key="'pago-modal-' + pago.id + '-' + (pago.tipo_evento || '')"
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
                  <span class="text-weight-bold text-dark ellipsis text-body2">
                    {{ pago.cliente }}
                  </span>
                </div>

                <div class="row items-center q-gutter-xs">
                  <!-- Badge Cobro Recibido en este día -->
                  <q-badge
                    v-if="pago.tipo_evento === 'cobro' || (pago.fecha_liquidado && pago.fecha_liquidado.startsWith(dia?.fecha))"
                    color="green-1"
                    text-color="green-9"
                    class="text-weight-bold q-pa-xs"
                  >
                    <q-icon name="payments" size="xs" class="q-mr-xs" />
                    Cobro Recibido
                  </q-badge>

                  <!-- Badge Programado para este día -->
                  <q-badge
                    v-if="pago.tipo_evento === 'programado' || (pago.fecha_a_pagar && pago.fecha_a_pagar.startsWith(dia?.fecha))"
                    color="blue-1"
                    text-color="blue-9"
                    class="text-weight-bold q-pa-xs"
                  >
                    <q-icon name="event" size="xs" class="q-mr-xs" />
                    Programado
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

              <!-- Fila 2: Datos de Contacto y Sucursal -->
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
                    <span class="text-weight-bold text-positive">
                      {{ formatCurrency(pago.monto_pagado) }}
                    </span>
                  </div>

                  <div v-if="Number(pago.saldo_pendiente) > 0">
                    <span class="text-caption text-grey-7">Saldo Pendiente: </span>
                    <span
                      class="text-weight-bold"
                      :class="pago.estado_cobro === 'vencido' ? 'text-negative' : 'text-dark'"
                    >
                      {{ formatCurrency(pago.saldo_pendiente) }}
                    </span>
                  </div>

                  <!-- Botón Comprobante si existe -->
                  <q-btn
                    v-if="pago.comprobante_url"
                    dense
                    flat
                    color="red-8"
                    icon="picture_as_pdf"
                    label="Ver Recibo"
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
          <q-icon name="event_busy" size="xl" />
          <div class="text-body2 q-mt-sm">No hay pagos registrados para este día</div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Acciones del Modal -->
      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {
  formatCurrency,
  formatPhoneNumber,
  formatFechaLarga,
} from "src/boot/format";

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  dia: {
    type: Object,
    default: null,
  },
});

defineEmits(["update:modelValue"]);

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
</style>
