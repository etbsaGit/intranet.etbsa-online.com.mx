<template>
  <div class="row q-col-gutter-md">
    <!-- KPI 1: Total Colocado -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <q-card
        flat
        bordered
        class="kpi-card bg-white shadow-1 cursor-pointer"
        @click="$emit('click-kpi', 'colocado')"
      >
        <q-card-section class="q-pa-md">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-weight-bold text-grey-7 text-uppercase flex items-center q-gutter-xs">
                <span>Monto Colocado</span>
                <q-icon name="open_in_new" size="xs" color="grey-5" />
              </div>
              <div class="text-h6 text-weight-bolder text-primary q-mt-xs">
                {{ formatCurrency(kpis?.total_colocado || 0) }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs flex items-center q-gutter-xs">
                <q-badge color="blue-1" text-color="blue-9" class="text-weight-bold q-pa-xs">
                  <q-icon name="receipt_long" size="xs" class="q-mr-xs" />
                  {{ kpis?.total_solicitudes || 0 }} solicitudes
                </q-badge>
              </div>
            </div>
            <div class="kpi-icon-container bg-blue-1 text-primary">
              <q-icon name="account_balance_wallet" size="md" />
            </div>
          </div>
        </q-card-section>
        <q-tooltip anchor="top middle" self="bottom middle">
          Clic para ver el listado de créditos colocados
        </q-tooltip>
      </q-card>
    </div>

    <!-- KPI 2: Dinero Recaudado / Cobrado -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <q-card
        flat
        bordered
        class="kpi-card bg-white shadow-1 cursor-pointer"
        @click="$emit('click-kpi', 'cobrado')"
      >
        <q-card-section class="q-pa-md">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-weight-bold text-grey-7 text-uppercase flex items-center q-gutter-xs">
                <span>Dinero Recaudado</span>
                <q-icon name="open_in_new" size="xs" color="grey-5" />
              </div>
              <div class="text-h6 text-weight-bolder text-positive q-mt-xs">
                {{ formatCurrency(kpis?.total_cobrado || 0) }}
              </div>
              <div class="text-caption q-mt-xs flex items-center q-gutter-xs">
                <q-badge color="green-1" text-color="green-9" class="text-weight-bold q-pa-xs">
                  <q-icon name="trending_up" size="xs" class="q-mr-xs" />
                  {{ kpis?.tasa_recuperacion_pct || 0 }}% recuperado
                </q-badge>
              </div>
            </div>
            <div class="kpi-icon-container bg-green-1 text-positive">
              <q-icon name="payments" size="md" />
            </div>
          </div>
        </q-card-section>
        <q-tooltip anchor="top middle" self="bottom middle">
          Clic para ver los pagos liquidados y cobrados
        </q-tooltip>
      </q-card>
    </div>

    <!-- KPI 3: Dinero Validado (Por Crédito) -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <q-card
        flat
        bordered
        class="kpi-card bg-white shadow-1 cursor-pointer"
        @click="$emit('click-kpi', 'validado')"
      >
        <q-card-section class="q-pa-md">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-weight-bold text-teal-9 text-uppercase flex items-center q-gutter-xs">
                <span>Dinero Validado</span>
                <q-icon name="open_in_new" size="xs" color="teal-8" />
              </div>
              <div class="text-h6 text-weight-bolder text-teal-9 q-mt-xs">
                {{ formatCurrency(kpis?.pagos_validados?.monto || 0) }}
              </div>
              <div class="text-caption q-mt-xs flex items-center q-gutter-xs">
                <q-badge color="teal-1" text-color="teal-9" class="text-weight-bold q-pa-xs">
                  <q-icon name="verified" size="xs" class="q-mr-xs" />
                  {{ kpis?.pagos_validados?.conteo || 0 }} validados
                </q-badge>
              </div>
            </div>
            <div class="kpi-icon-container bg-teal-1 text-teal-8">
              <q-icon name="fact_check" size="md" />
            </div>
          </div>
        </q-card-section>
        <q-tooltip anchor="top middle" self="bottom middle">
          Clic para ver los pagos validados y confirmados por Crédito
        </q-tooltip>
      </q-card>
    </div>

    <!-- KPI 4: Dinero Por Validar (Falta Validar) -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <q-card
        flat
        bordered
        class="kpi-card bg-white shadow-1 cursor-pointer"
        :class="Number(kpis?.pagos_por_validar?.conteo || 0) > 0 ? 'card-alert' : ''"
        @click="$emit('click-kpi', 'por_validar')"
      >
        <q-card-section class="q-pa-md">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-weight-bold text-orange-10 text-uppercase flex items-center q-gutter-xs">
                <span>Dinero Por Validar</span>
                <q-icon name="open_in_new" size="xs" color="orange-9" />
              </div>
              <div class="text-h6 text-weight-bolder text-orange-9 q-mt-xs">
                {{ formatCurrency(kpis?.pagos_por_validar?.monto || 0) }}
              </div>
              <div class="text-caption q-mt-xs flex items-center q-gutter-xs">
                <q-badge
                  :color="Number(kpis?.pagos_por_validar?.conteo || 0) > 0 ? 'orange-1' : 'grey-2'"
                  :text-color="Number(kpis?.pagos_por_validar?.conteo || 0) > 0 ? 'orange-10' : 'grey-7'"
                  class="text-weight-bold q-pa-xs"
                >
                  <q-icon name="pending_actions" size="xs" class="q-mr-xs" />
                  {{ kpis?.pagos_por_validar?.conteo || 0 }} por validar
                </q-badge>
              </div>
            </div>
            <div
              class="kpi-icon-container"
              :class="Number(kpis?.pagos_por_validar?.conteo || 0) > 0 ? 'bg-orange-1 text-orange-9' : 'bg-grey-2 text-grey-6'"
            >
              <q-icon name="rule" size="md" />
            </div>
          </div>
        </q-card-section>
        <q-tooltip anchor="top middle" self="bottom middle">
          Clic para ver los pagos que faltan por validar
        </q-tooltip>
      </q-card>
    </div>

    <!-- KPI 5: Saldo Vencido / Cartera en Mora -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-4">
      <q-card
        flat
        bordered
        class="kpi-card bg-white shadow-1 cursor-pointer"
        :class="Number(kpis?.saldo_vencido || 0) > 0 ? 'card-vencido-alert' : ''"
        @click="$emit('click-kpi', 'vencido')"
      >
        <q-card-section class="q-pa-md">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-weight-bold text-grey-7 text-uppercase flex items-center q-gutter-xs">
                <span>Cartera Vencida (Mora)</span>
                <q-icon name="open_in_new" size="xs" color="grey-5" />
              </div>
              <div
                class="text-h6 text-weight-bolder q-mt-xs"
                :class="Number(kpis?.saldo_vencido || 0) > 0 ? 'text-negative' : 'text-positive'"
              >
                {{ formatCurrency(kpis?.saldo_vencido || 0) }}
              </div>
              <div class="text-caption q-mt-xs flex items-center q-gutter-xs">
                <q-badge
                  :color="Number(kpis?.tasa_morosidad_pct || 0) > 0 ? 'red-1' : 'green-1'"
                  :text-color="Number(kpis?.tasa_morosidad_pct || 0) > 0 ? 'red-9' : 'green-9'"
                  class="text-weight-bold q-pa-xs"
                >
                  <q-icon
                    :name="Number(kpis?.tasa_morosidad_pct || 0) > 0 ? 'warning' : 'check_circle'"
                    size="xs"
                    class="q-mr-xs"
                  />
                  {{ kpis?.tasa_morosidad_pct || 0 }}% índice mora
                </q-badge>
              </div>
            </div>
            <div
              class="kpi-icon-container"
              :class="Number(kpis?.saldo_vencido || 0) > 0 ? 'bg-red-1 text-negative' : 'bg-green-1 text-positive'"
            >
              <q-icon name="report_problem" size="md" />
            </div>
          </div>
        </q-card-section>
        <q-tooltip anchor="top middle" self="bottom middle">
          Clic para ver los pagos vencidos en mora
        </q-tooltip>
      </q-card>
    </div>

    <!-- KPI 6: Saldo Pendiente Activo -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-4">
      <q-card
        flat
        bordered
        class="kpi-card bg-white shadow-1 cursor-pointer"
        @click="$emit('click-kpi', 'pendiente')"
      >
        <q-card-section class="q-pa-md">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-weight-bold text-grey-7 text-uppercase flex items-center q-gutter-xs">
                <span>Saldo Pendiente Activo</span>
                <q-icon name="open_in_new" size="xs" color="grey-5" />
              </div>
              <div class="text-h6 text-weight-bolder text-dark q-mt-xs">
                {{ formatCurrency(kpis?.saldo_pendiente_total || 0) }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs flex items-center q-gutter-xs">
                <q-badge color="amber-1" text-color="amber-10" class="text-weight-bold q-pa-xs">
                  <q-icon name="schedule" size="xs" class="q-mr-xs" />
                  {{ kpis?.solicitudes_activas || 0 }} créditos activos
                </q-badge>
              </div>
            </div>
            <div class="kpi-icon-container bg-amber-1 text-amber-9">
              <q-icon name="timelapse" size="md" />
            </div>
          </div>
        </q-card-section>
        <q-tooltip anchor="top middle" self="bottom middle">
          Clic para ver los pagos activos pendientes
        </q-tooltip>
      </q-card>
    </div>

    <!-- KPI 7: Ticket Promedio -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-4">
      <q-card
        flat
        bordered
        class="kpi-card bg-white shadow-1 cursor-pointer"
        @click="$emit('click-kpi', 'ticket_promedio')"
      >
        <q-card-section class="q-pa-md">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-weight-bold text-grey-7 text-uppercase flex items-center q-gutter-xs">
                <span>Ticket Promedio</span>
                <q-icon name="open_in_new" size="xs" color="grey-5" />
              </div>
              <div class="text-h6 text-weight-bolder text-indigo-9 q-mt-xs">
                {{ formatCurrency(kpis?.ticket_promedio || 0) }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs flex items-center q-gutter-xs">
                <q-badge color="indigo-1" text-color="indigo-9" class="text-weight-bold q-pa-xs">
                  <q-icon name="pie_chart" size="xs" class="q-mr-xs" />
                  Promedio por crédito
                </q-badge>
              </div>
            </div>
            <div class="kpi-icon-container bg-indigo-1 text-indigo-8">
              <q-icon name="analytics" size="md" />
            </div>
          </div>
        </q-card-section>
        <q-tooltip anchor="top middle" self="bottom middle">
          Clic para ver el desglose de solicitudes de crédito
        </q-tooltip>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from "src/boot/format";

defineProps({
  kpis: {
    type: Object,
    default: () => ({}),
  },
});

defineEmits(["click-kpi"]);
</script>

<style scoped>
.kpi-card {
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.kpi-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border-color: #1976d2;
}
.card-vencido-alert:hover {
  border-color: #d32f2f !important;
}
.card-alert:hover {
  border-color: #f57c00 !important;
}
.kpi-icon-container {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
