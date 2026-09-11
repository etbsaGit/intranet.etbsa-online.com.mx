<template>
  <div class="row q-col-gutter-md">
    <!-- Card 1: Pagos Programados en el Mes -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-2">
      <q-card
        flat
        bordered
        class="resumen-card bg-white shadow-1 cursor-pointer"
        @click="$emit('click-kpi', 'prospectado')"
      >
        <q-tooltip class="bg-primary">Clic para ver todos los pagos programados</q-tooltip>
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-weight-bold text-grey-7 text-uppercase row items-center q-gutter-xs">
                <span>Programados</span>
                <q-icon name="open_in_new" size="12px" color="grey-6" />
              </div>
              <div class="text-h5 text-weight-bolder text-primary q-mt-xs">
                {{ resumen?.total_pagos_mes || 0 }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs flex items-center q-gutter-xs">
                <q-badge color="blue-1" text-color="blue-9" class="text-weight-bold q-pa-xs">
                  <q-icon name="calendar_month" size="xs" class="q-mr-xs" />
                  {{ (resumen?.total_pagos_mes === 1) ? '1 pago' : (resumen?.total_pagos_mes || 0) + ' pagos' }}
                </q-badge>
              </div>
            </div>
            <div class="resumen-icon bg-blue-1 text-primary">
              <q-icon name="event_available" size="sm" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card 2: Dinero Recaudado (Ingresado a banco) -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-2">
      <q-card
        flat
        bordered
        class="resumen-card bg-white shadow-1 cursor-pointer"
        @click="$emit('click-kpi', 'pagado')"
      >
        <q-tooltip class="bg-positive">Dinero total cobrado en el mes</q-tooltip>
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-weight-bold text-grey-7 text-uppercase row items-center q-gutter-xs">
                <span>Recaudado</span>
                <q-icon name="open_in_new" size="12px" color="grey-6" />
              </div>
              <div class="text-h6 text-weight-bolder text-positive q-mt-xs">
                {{ formatCurrency(resumen?.monto_pagado || 0) }}
              </div>
              <div class="text-caption q-mt-xs flex items-center q-gutter-xs">
                <q-badge color="green-1" text-color="green-9" class="text-weight-bold q-pa-xs">
                  <q-icon name="account_balance" size="xs" class="q-mr-xs" />
                  {{ resumen?.pagos_liquidados || 0 }} en cuenta
                </q-badge>
              </div>
            </div>
            <div class="resumen-icon bg-green-1 text-positive">
              <q-icon name="account_balance_wallet" size="sm" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card 3: Dinero Validado (Por Crédito) -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-2">
      <q-card
        flat
        bordered
        class="resumen-card bg-white shadow-1 cursor-pointer"
        @click="$emit('click-kpi', 'validado')"
      >
        <q-tooltip class="bg-teal-8">Pagos validados y verificados por Crédito</q-tooltip>
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-weight-bold text-teal-9 text-uppercase row items-center q-gutter-xs">
                <span>Validado</span>
                <q-icon name="open_in_new" size="12px" color="teal-8" />
              </div>
              <div class="text-h6 text-weight-bolder text-teal-9 q-mt-xs">
                {{ formatCurrency(resumen?.monto_validado || 0) }}
              </div>
              <div class="text-caption q-mt-xs flex items-center q-gutter-xs">
                <q-badge color="teal-1" text-color="teal-9" class="text-weight-bold q-pa-xs">
                  <q-icon name="verified" size="xs" class="q-mr-xs" />
                  {{ resumen?.pagos_validados || 0 }} validados
                </q-badge>
              </div>
            </div>
            <div class="resumen-icon bg-teal-1 text-teal-8">
              <q-icon name="fact_check" size="sm" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card 4: Dinero Por Validar (Falta Validar) -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-2">
      <q-card
        flat
        bordered
        class="resumen-card bg-white shadow-1 cursor-pointer"
        :class="Number(resumen?.pagos_por_validar || 0) > 0 ? 'card-por-validar-alert' : ''"
        @click="$emit('click-kpi', 'por_validar')"
      >
        <q-tooltip class="bg-orange-9">Pagos registrados que faltan por validar</q-tooltip>
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-weight-bold text-orange-10 text-uppercase row items-center q-gutter-xs">
                <span>Por Validar</span>
                <q-icon name="open_in_new" size="12px" color="orange-9" />
              </div>
              <div class="text-h6 text-weight-bolder text-orange-9 q-mt-xs">
                {{ formatCurrency(resumen?.monto_por_validar || 0) }}
              </div>
              <div class="text-caption q-mt-xs flex items-center q-gutter-xs">
                <q-badge
                  :color="Number(resumen?.pagos_por_validar || 0) > 0 ? 'orange-1' : 'grey-2'"
                  :text-color="Number(resumen?.pagos_por_validar || 0) > 0 ? 'orange-9' : 'grey-7'"
                  class="text-weight-bold q-pa-xs"
                >
                  <q-icon name="pending_actions" size="xs" class="q-mr-xs" />
                  {{ resumen?.pagos_por_validar || 0 }} por validar
                </q-badge>
              </div>
            </div>
            <div
              class="resumen-icon"
              :class="Number(resumen?.pagos_por_validar || 0) > 0 ? 'bg-orange-1 text-orange-9' : 'bg-grey-2 text-grey-6'"
            >
              <q-icon name="rule" size="sm" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card 5: Monto Vencido -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-2">
      <q-card
        flat
        bordered
        class="resumen-card bg-white shadow-1 cursor-pointer"
        :class="Number(resumen?.monto_vencido || 0) > 0 ? 'card-vencido-alert' : ''"
        @click="$emit('click-kpi', 'vencido')"
      >
        <q-tooltip class="bg-negative">Clic para ver los pagos vencidos en mora</q-tooltip>
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-weight-bold text-grey-7 text-uppercase row items-center q-gutter-xs">
                <span>Vencido (Mora)</span>
                <q-icon name="open_in_new" size="12px" color="negative" />
              </div>
              <div
                class="text-h6 text-weight-bolder q-mt-xs"
                :class="Number(resumen?.monto_vencido || 0) > 0 ? 'text-negative' : 'text-positive'"
              >
                {{ formatCurrency(resumen?.monto_vencido || 0) }}
              </div>
              <div class="text-caption q-mt-xs flex items-center q-gutter-xs">
                <q-badge
                  :color="Number(resumen?.monto_vencido || 0) > 0 ? 'red-1' : 'green-1'"
                  :text-color="Number(resumen?.monto_vencido || 0) > 0 ? 'red-9' : 'green-9'"
                  class="text-weight-bold q-pa-xs"
                >
                  <q-icon
                    :name="Number(resumen?.monto_vencido || 0) > 0 ? 'error_outline' : 'task_alt'"
                    size="xs"
                    class="q-mr-xs"
                  />
                  {{ resumen?.pagos_vencidos || 0 }} en mora
                </q-badge>
              </div>
            </div>
            <div
              class="resumen-icon"
              :class="Number(resumen?.monto_vencido || 0) > 0 ? 'bg-red-1 text-negative' : 'bg-green-1 text-positive'"
            >
              <q-icon name="history_toggle_off" size="sm" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card 6: Pagos Por Vencer en el Mes (Conteo y Listado) -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-2">
      <q-card
        flat
        bordered
        class="resumen-card bg-white shadow-1 cursor-pointer"
        @click="$emit('click-kpi', 'pendiente')"
      >
        <q-tooltip class="bg-amber-9">Clic para ver los pagos que vencerán en los próximos días</q-tooltip>
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-weight-bold text-grey-7 text-uppercase row items-center q-gutter-xs">
                <span>Por Vencer</span>
                <q-icon name="open_in_new" size="12px" color="amber-8" />
              </div>
              <div class="text-h5 text-weight-bolder text-amber-9 q-mt-xs">
                {{ resumen?.pagos_pendientes || 0 }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs flex items-center q-gutter-xs">
                <q-badge color="amber-1" text-color="amber-10" class="text-weight-bold q-pa-xs">
                  <q-icon name="schedule" size="xs" class="q-mr-xs" />
                  {{ (resumen?.pagos_pendientes === 1) ? '1 pendiente' : (resumen?.pagos_pendientes || 0) + ' pendientes' }}
                </q-badge>
              </div>
            </div>
            <div class="resumen-icon bg-amber-1 text-amber-9">
              <q-icon name="timelapse" size="sm" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <!-- Barra de Efectividad de Cobranza del Mes -->
  <q-card flat bordered class="bg-white q-pa-sm rounded-borders shadow-1 q-mt-md">
    <div class="row items-center justify-between q-mb-xs">
      <div class="text-caption text-weight-bold text-grey-8 flex items-center q-gutter-xs">
        <q-icon name="speed" color="primary" />
        <span>Avance de Pagos en {{ resumen?.nombre_mes || 'el Mes' }}</span>
      </div>
      <div class="text-subtitle2 text-weight-bolder text-primary">
        {{ resumen?.pagos_liquidados || 0 }} de {{ resumen?.total_pagos_mes || 0 }} pagos liquidados ({{ resumen?.tasa_cumplimiento_pct || 0 }}%)
      </div>
    </div>
    <q-linear-progress
      rounded
      size="10px"
      :value="(resumen?.tasa_cumplimiento_pct || 0) / 100"
      color="positive"
      track-color="grey-3"
    />
  </q-card>
</template>

<script setup>
import { formatCurrency } from "src/boot/format";

defineProps({
  resumen: {
    type: Object,
    default: () => ({}),
  },
});

defineEmits(["click-kpi"]);
</script>

<style scoped>
.resumen-card {
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.resumen-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border-color: #1976d2;
}
.card-vencido-alert:hover {
  border-color: #d32f2f !important;
}
.resumen-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
