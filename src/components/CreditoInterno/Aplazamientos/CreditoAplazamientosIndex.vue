<template>
  <div class="q-pa-md">
    <!-- Tarjetas de Resumen KPI Superior -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card
          flat
          bordered
          class="bg-blue-1 cursor-pointer hover-shadow transition-all"
          @click="filtrarPorEstatus(null)"
        >
          <q-card-section class="q-pa-sm row items-center justify-between">
            <div>
              <div class="text-caption text-grey-8">Total Solicitudes</div>
              <div class="text-h6 text-weight-bolder text-primary">
                {{ totalSolicitudesCount }}
              </div>
            </div>
            <q-avatar
              size="40px"
              color="primary"
              text-color="white"
              icon="all_inbox"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card
          flat
          bordered
          class="bg-orange-1 cursor-pointer hover-shadow transition-all"
          @click="filtrarPorEstatus(168)"
        >
          <q-card-section class="q-pa-sm row items-center justify-between">
            <div>
              <div class="text-caption text-orange-9 text-weight-bold">
                Pendientes de Revisión
              </div>
              <div class="text-h6 text-weight-bolder text-orange-9">
                {{ pendientesCount }}
              </div>
            </div>
            <q-avatar
              size="40px"
              color="orange-9"
              text-color="white"
              icon="pending_actions"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card
          flat
          bordered
          class="bg-green-1 cursor-pointer hover-shadow transition-all"
          @click="filtrarPorEstatus(169)"
        >
          <q-card-section class="q-pa-sm row items-center justify-between">
            <div>
              <div class="text-caption text-green-9 text-weight-bold">
                Aplazos Aprobados
              </div>
              <div class="text-h6 text-weight-bolder text-positive">
                {{ aprobadosCount }}
              </div>
            </div>
            <q-avatar
              size="40px"
              color="positive"
              text-color="white"
              icon="check_circle"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card
          flat
          bordered
          class="bg-red-1 cursor-pointer hover-shadow transition-all"
          @click="filtrarPorEstatus(170)"
        >
          <q-card-section class="q-pa-sm row items-center justify-between">
            <div>
              <div class="text-caption text-negative text-weight-bold">
                Rechazados / Cancelados
              </div>
              <div class="text-h6 text-weight-bolder text-negative">
                {{ rechazadosCount + canceladosCount }}
              </div>
            </div>
            <q-avatar
              size="40px"
              color="negative"
              text-color="white"
              icon="cancel"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Catálogo de Solicitudes de Aplazamiento -->
    <BaseCatalogo
      ref="catalogoRef"
      :onCreate="false"
      title="Revisión y Control de Solicitudes de Aplazamiento"
      :columns="columns"
      url="/api/intranet/creditoAplazamientos"
      :on-delete="false"
      :initial-filters="filtrosIniciales"
    >
      <!-- Filtros extra personalizados -->
      <template #filters-extra="{ filters, onSearchChange }">
        <CreditoAplazamientosFiltros
          :filters="filters"
          :options="options"
          @update:filter="(key, val) => (filters[key] = val)"
          @clear="
            Object.assign(filters, {
              sucursal_id: null,
              asesor_id: null,
              estatus_id: null,
            })
          "
          @update="onSearchChange"
        />
      </template>

      <!-- Columna: Folio del Crédito -->
      <template v-slot:body-cell-folio="props">
        <q-td :props="props" align="center">
          <q-chip
            dense
            clickable
            color="indigo-1"
            text-color="indigo-9"
            class="text-weight-bold q-px-sm"
            icon="receipt_long"
            @click="abrirDetallesCredito(props.row.pago?.solicitud)"
          >
            #{{ props.row.pago?.solicitud?.folio || props.row.pago?.solicitud_id }}
            <q-tooltip>Ver detalles del crédito</q-tooltip>
          </q-chip>
        </q-td>
      </template>

      <!-- Columna: Cliente -->
      <template v-slot:body-cell-cliente="props">
        <q-td :props="props">
          <div class="row items-center no-wrap">
            <q-avatar
              size="32px"
              color="primary"
              text-color="white"
              icon="person"
              class="q-mr-sm shadow-1"
            />
            <div>
              <div class="text-weight-bold text-primary text-body2">
                {{
                  props.row.pago?.solicitud?.cliente?.nombre ||
                  "Cliente no especificado"
                }}
              </div>
              <div class="text-caption text-grey-7 flex items-center q-gutter-xs">
                <span v-if="props.row.pago?.solicitud?.cliente?.rfc">
                  RFC: {{ props.row.pago?.solicitud?.cliente?.rfc }}
                </span>
                <span
                  v-if="
                    props.row.pago?.solicitud?.cliente?.rfc &&
                    props.row.pago?.solicitud?.cliente?.telefono
                  "
                >
                  •
                </span>
                <span v-if="props.row.pago?.solicitud?.cliente?.telefono">
                  {{
                    formatPhoneNumber(
                      props.row.pago?.solicitud?.cliente?.telefono
                    )
                  }}
                </span>
              </div>
            </div>
          </div>
        </q-td>
      </template>

      <!-- Columna: Pago / Concepto -->
      <template v-slot:body-cell-pago="props">
        <q-td :props="props" align="center">
          <div class="column items-center q-gutter-xs">
            <q-chip
              dense
              :color="
                props.row.pago?.etiqueta === 'Enganche' ||
                props.row.pago?.n_pago === 1
                  ? 'orange-9'
                  : 'dark'
              "
              text-color="white"
              class="text-weight-bold q-px-sm"
            >
              {{ props.row.pago?.etiqueta || `Pago #${props.row.pago?.n_pago}` }}
            </q-chip>
            <div
              v-if="props.row.pago?.saldo_pendiente !== null"
              class="text-caption text-weight-bold text-teal-9"
            >
              {{ formatCurrency(props.row.pago?.saldo_pendiente || 0) }}
            </div>
          </div>
        </q-td>
      </template>

      <!-- Columna: Fechas (Actual -> Nueva) -->
      <template v-slot:body-cell-fechas="props">
        <q-td :props="props">
          <div class="column items-start q-gutter-xs">
            <div class="text-caption text-grey-7 flex items-center q-gutter-xs">
              <q-icon name="event" size="xs" color="grey-7" />
              <span>
                Original:
                <strong class="text-dark">
                  {{ formatFechaLarga(props.row.fecha_actual) }}
                </strong>
              </span>
            </div>
            <div
              class="text-body2 text-weight-bold text-orange-10 flex items-center q-gutter-xs"
            >
              <q-icon name="arrow_forward" size="xs" color="orange-9" />
              <span>{{ formatFechaLarga(props.row.fecha_nueva) }}</span>
              <q-badge
                v-if="calcularDiasDiferencia(props.row.fecha_actual, props.row.fecha_nueva)"
                color="orange-2"
                text-color="orange-10"
                class="text-weight-bold q-ml-xs"
              >
                +{{ calcularDiasDiferencia(props.row.fecha_actual, props.row.fecha_nueva) }} días
              </q-badge>
            </div>
          </div>
        </q-td>
      </template>

      <!-- Columna: Motivo -->
      <template v-slot:body-cell-motivo="props">
        <q-td :props="props" style="max-width: 260px">
          <div
            class="text-body2 text-grey-9 ellipsis-2-lines bg-grey-1 q-pa-xs rounded-borders"
            style="border: 1px solid #e0e0e0"
          >
            {{ props.row.motivo || "Sin motivo registrado" }}
            <q-tooltip class="bg-dark text-white text-body2" max-width="350px">
              {{ props.row.motivo }}
            </q-tooltip>
          </div>
        </q-td>
      </template>

      <!-- Columna: Solicitado Por -->
      <template v-slot:body-cell-solicitante="props">
        <q-td :props="props">
          <div class="row items-center no-wrap">
            <q-avatar
              size="28px"
              color="teal-1"
              text-color="teal-9"
              icon="badge"
              class="q-mr-xs"
            />
            <div>
              <div class="text-weight-medium text-dark">
                {{ props.row.solicitante?.nombreCompleto || "Solicitante" }}
              </div>
              <div class="text-caption text-grey-7 flex items-center q-gutter-xs">
                <q-icon name="schedule" size="xs" />
                <span>{{ formatFechaHora(props.row.created_at) }}</span>
              </div>
            </div>
          </div>
        </q-td>
      </template>

      <!-- Columna: Estatus -->
      <template v-slot:body-cell-estatus="props">
        <q-td :props="props" align="center">
          <q-chip
            dense
            class="text-weight-bold text-white q-px-sm"
            :style="{
              backgroundColor: props.row.estatus?.color || '#1976d2',
            }"
          >
            {{ props.row.estatus?.nombre || props.row.estatus || "Pendiente" }}
          </q-chip>
        </q-td>
      </template>

      <!-- Columna: Validado Por -->
      <template v-slot:body-cell-validado_por="props">
        <q-td :props="props" align="left">
          <div
            v-if="props.row.validado_por?.nombreCompleto"
            class="row items-center q-gutter-xs"
          >
            <q-icon name="verified" color="positive" size="sm" />
            <span class="text-weight-bold text-dark">
              {{ props.row.validado_por.nombreCompleto }}
            </span>
          </div>
          <div
            v-else-if="props.row.estatus?.nombre === 'Aplazo Solicitado'"
            class="text-caption text-orange-9 text-weight-medium"
          >
            <q-icon name="hourglass_empty" size="xs" />
            Pendiente de revisión
          </div>
          <div v-else class="text-grey-5">—</div>
        </q-td>
      </template>

      <!-- Columna: Acciones de Revisión -->
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" align="center">
          <div class="row items-center justify-center q-gutter-xs no-wrap">
            <!-- Botones de Resolución (Solo Admin / Crédito y cuando está 'Aplazo Solicitado') -->
            <template
              v-if="
                isAdminOrCredito &&
                props.row.estatus?.nombre === 'Aplazo Solicitado'
              "
            >
              <q-btn
                dense
                unelevated
                color="positive"
                icon="check"
                label="Aprobar"
                class="text-weight-bold q-px-xs"
                @click="abrirModalAprobar(props.row)"
              >
                <q-tooltip>Aprobar y actualizar fecha de pago</q-tooltip>
              </q-btn>
              <q-btn
                dense
                outline
                color="negative"
                icon="close"
                label="Rechazar"
                class="text-weight-bold q-px-xs"
                @click="abrirModalRechazar(props.row)"
              >
                <q-tooltip>Rechazar solicitud de aplazamiento</q-tooltip>
              </q-btn>
            </template>

            <!-- Acciones de visualización -->
            <q-btn
              flat
              round
              dense
              icon="payments"
              color="teal-8"
              @click="abrirPagosCredito(props.row.pago?.solicitud)"
            >
              <q-tooltip class="bg-teal-8">Ver gestión de pagos</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="visibility"
              color="primary"
              @click="abrirDetallesCredito(props.row.pago?.solicitud)"
            >
              <q-tooltip class="bg-primary">Ver detalles del crédito</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
    </BaseCatalogo>

    <!-- Modal para Aprobar Solicitud de Aplazamiento -->
    <q-dialog
      v-model="modalAprobar"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="min-width: 420px; max-width: 520px; width: 100%" class="rounded-borders">
        <q-card-section class="bg-green-8 text-white row items-center justify-between q-py-sm">
          <div class="text-subtitle1 text-weight-bold flex items-center q-gutter-xs">
            <q-icon name="check_circle" size="sm" />
            <span>Aprobar Solicitud de Aplazamiento</span>
          </div>
          <q-btn flat round dense icon="close" v-close-popup :disable="savingResolucion" />
        </q-card-section>

        <q-card-section class="q-pa-md q-gutter-y-md">
          <div class="text-body1">
            ¿Confirmas que deseas <strong>aprobar</strong> el aplazamiento para este pago?
          </div>

          <!-- Resumen de la Solicitud -->
          <div class="bg-grey-2 q-pa-md rounded-borders q-gutter-y-xs text-body2">
            <div class="row justify-between">
              <span class="text-grey-7">Crédito / Folio:</span>
              <span class="text-weight-bold">
                #{{ itemSeleccionado?.pago?.solicitud?.folio || itemSeleccionado?.pago?.solicitud_id }}
              </span>
            </div>
            <div class="row justify-between">
              <span class="text-grey-7">Cliente:</span>
              <span class="text-weight-medium">
                {{ itemSeleccionado?.pago?.solicitud?.cliente?.nombre }}
              </span>
            </div>
            <div class="row justify-between">
              <span class="text-grey-7">Pago / Cuota:</span>
              <span class="text-weight-bold">
                {{ itemSeleccionado?.pago?.etiqueta || `Pago #${itemSeleccionado?.pago?.n_pago}` }}
              </span>
            </div>
            <q-separator class="q-my-xs" />
            <div class="row justify-between">
              <span class="text-grey-7">Fecha Programada Actual:</span>
              <span class="text-weight-medium text-grey-9">
                {{ formatFechaLarga(itemSeleccionado?.fecha_actual) }}
              </span>
            </div>
            <div class="row justify-between">
              <span class="text-grey-7">Nueva Fecha de Pago Aprobada:</span>
              <span class="text-weight-bolder text-positive text-subtitle2">
                {{ formatFechaLarga(itemSeleccionado?.fecha_nueva) }}
              </span>
            </div>
            <div class="row justify-between" v-if="itemSeleccionado?.motivo">
              <span class="text-grey-7">Motivo Solicitado:</span>
              <span class="text-grey-9">{{ itemSeleccionado.motivo }}</span>
            </div>
          </div>

          <!-- Notas u observaciones opcionales -->
          <div>
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
              Notas u observaciones de aprobación (opcional)
            </div>
            <q-input
              dense
              outlined
              type="textarea"
              rows="2"
              v-model="notasResolucion"
              placeholder="Notas internas de la autorización..."
            />
          </div>

          <div class="text-caption text-grey-7 bg-green-1 q-pa-sm rounded-borders">
            <q-icon name="info" size="xs" color="positive" class="q-mr-xs" />
            Al aprobar, la fecha de pago en el calendario y programación del crédito se actualizará a
            <strong>{{ formatFechaLarga(itemSeleccionado?.fecha_nueva) }}</strong>.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md bg-grey-1 q-gutter-sm">
          <q-btn flat label="Cancelar" color="grey-8" v-close-popup :disable="savingResolucion" />
          <q-btn
            unelevated
            label="Confirmar Aprobación"
            color="positive"
            icon="check_circle"
            :loading="savingResolucion"
            @click="ejecutarAprobacion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal para Rechazar Solicitud de Aplazamiento -->
    <q-dialog
      v-model="modalRechazar"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="min-width: 420px; max-width: 520px; width: 100%" class="rounded-borders">
        <q-card-section class="bg-red-8 text-white row items-center justify-between q-py-sm">
          <div class="text-subtitle1 text-weight-bold flex items-center q-gutter-xs">
            <q-icon name="cancel" size="sm" />
            <span>Rechazar Solicitud de Aplazamiento</span>
          </div>
          <q-btn flat round dense icon="close" v-close-popup :disable="savingResolucion" />
        </q-card-section>

        <q-card-section class="q-pa-md q-gutter-y-md">
          <div class="text-body1">
            Indique el motivo por el cual se <strong>rechaza</strong> la solicitud de aplazamiento.
          </div>

          <!-- Resumen de la Solicitud -->
          <div class="bg-grey-2 q-pa-md rounded-borders q-gutter-y-xs text-body2">
            <div class="row justify-between">
              <span class="text-grey-7">Crédito / Folio:</span>
              <span class="text-weight-bold">
                #{{ itemSeleccionado?.pago?.solicitud?.folio || itemSeleccionado?.pago?.solicitud_id }}
              </span>
            </div>
            <div class="row justify-between">
              <span class="text-grey-7">Pago:</span>
              <span class="text-weight-bold">
                {{ itemSeleccionado?.pago?.etiqueta || `Pago #${itemSeleccionado?.pago?.n_pago}` }}
              </span>
            </div>
            <div class="row justify-between">
              <span class="text-grey-7">Fecha Solicitada:</span>
              <span class="text-weight-medium text-negative">
                {{ formatFechaLarga(itemSeleccionado?.fecha_nueva) }}
              </span>
            </div>
          </div>

          <!-- Motivo del Rechazo -->
          <div>
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
              Motivo del Rechazo <span class="text-negative">*</span>
            </div>
            <q-input
              dense
              outlined
              type="textarea"
              rows="3"
              v-model="notasResolucion"
              placeholder="Explique la justificación del rechazo..."
              :rules="[
                (val) => (val && val.trim().length >= 3) || 'Ingrese el motivo del rechazo (mínimo 3 caracteres)'
              ]"
            />
          </div>

          <div class="text-caption text-grey-7 bg-red-1 q-pa-sm rounded-borders">
            <q-icon name="info" size="xs" color="negative" class="q-mr-xs" />
            La fecha original del pago se mantendrá sin cambios y se notificará en el historial.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md bg-grey-1 q-gutter-sm">
          <q-btn flat label="Cancelar" color="grey-8" v-close-popup :disable="savingResolucion" />
          <q-btn
            unelevated
            label="Confirmar Rechazo"
            color="negative"
            icon="cancel"
            :loading="savingResolucion"
            @click="ejecutarRechazo"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Detalles del Crédito -->
    <CreditoDetallesModal
      v-model="showDetallesModal"
      :credito="creditoSeleccionadoModal"
    />

    <!-- Modal de Control y Gestión de Pagos del Crédito -->
    <CreditoPagosModal
      v-model="showPagosModal"
      :credito="creditoSeleccionadoModal"
      @updated="onCreditoUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";
import { checkRole, show_notify } from "src/boot/functions";
import {
  formatPhoneNumber,
  formatCurrency,
  formatFechaLarga,
  formatFechaHora,
} from "src/boot/format";
import { api } from "src/boot/axios";
import BaseCatalogo from "src/bases/BaseCatalogo.vue";
import CreditoAplazamientosFiltros from "./CreditoAplazamientosFiltros.vue";
import CreditoDetallesModal from "../CreditoDetallesModal.vue";
import CreditoPagosModal from "../CreditoPagosModal.vue";

const crud = useCrudStore();
const catalogoRef = ref(null);

const isAdminOrCredito = computed(() => {
  return checkRole("Admin") || checkRole("Credito");
});

const filtrosIniciales = {
  sucursal_id: null,
  asesor_id: null,
  estatus_id: null,
};

const options = ref({});

const columns = [
  {
    name: "folio",
    label: "Folio",
    field: (row) => row.pago?.solicitud?.folio || row.pago?.solicitud_id,
    sortable: true,
    align: "center",
  },
  {
    name: "cliente",
    label: "Cliente",
    field: (row) => row.pago?.solicitud?.cliente?.nombre || "-",
    sortable: true,
    align: "left",
  },
  {
    name: "pago",
    label: "Pago / Cuota",
    field: (row) => row.pago?.etiqueta || `Pago #${row.pago?.n_pago}`,
    sortable: true,
    align: "center",
  },
  {
    name: "fechas",
    label: "Fechas (Actual -> Propuesta)",
    field: (row) => row.fecha_nueva || "",
    sortable: true,
    align: "left",
  },
  {
    name: "motivo",
    label: "Motivo del Aplazamiento",
    field: (row) => row.motivo || "",
    align: "left",
  },
  {
    name: "solicitante",
    label: "Solicitado Por",
    field: (row) => row.solicitante?.nombreCompleto || "-",
    sortable: true,
    align: "left",
  },
  {
    name: "estatus",
    label: "Estatus",
    field: (row) => row.estatus?.nombre || "Pendiente",
    sortable: true,
    align: "center",
  },
  {
    name: "validado_por",
    label: "Validado Por",
    field: (row) => row.validado_por?.nombreCompleto || "-",
    sortable: true,
    align: "left",
  },
  {
    name: "acciones",
    label: "Acciones",
    field: (row) => row.id,
    align: "center",
  },
];

const calcularDiasDiferencia = (fechaActual, fechaNueva) => {
  if (!fechaActual || !fechaNueva) return null;
  const f1 = new Date(fechaActual);
  const f2 = new Date(fechaNueva);
  const diffTime = f2.getTime() - f1.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : null;
};

// --- KPIs de Conteo ---
const itemsList = computed(() => {
  return crud.paginatedItems || [];
});

const totalSolicitudesCount = computed(() => {
  return itemsList.value.length;
});

const pendientesCount = computed(() => {
  return itemsList.value.filter(
    (item) => item.estatus?.nombre === "Aplazo Solicitado" || item.estatus_id === 168
  ).length;
});

const aprobadosCount = computed(() => {
  return itemsList.value.filter(
    (item) => item.estatus?.nombre === "Aplazo Aprobado" || item.estatus_id === 169
  ).length;
});

const rechazadosCount = computed(() => {
  return itemsList.value.filter(
    (item) => item.estatus?.nombre === "Aplazo Rechazado" || item.estatus_id === 170
  ).length;
});

const canceladosCount = computed(() => {
  return itemsList.value.filter(
    (item) => item.estatus?.nombre === "Aplazo Cancelado" || item.estatus_id === 171
  ).length;
});

const filtrarPorEstatus = (estatusId) => {
  if (catalogoRef.value?.filters) {
    catalogoRef.value.filters.estatus_id = estatusId;
    catalogoRef.value.onSearchChange();
  }
};

// --- Modales de Resolución ---
const modalAprobar = ref(false);
const modalRechazar = ref(false);
const itemSeleccionado = ref(null);
const notasResolucion = ref("");
const savingResolucion = ref(false);

const abrirModalAprobar = (row) => {
  itemSeleccionado.value = row;
  notasResolucion.value = "";
  modalAprobar.value = true;
};

const abrirModalRechazar = (row) => {
  itemSeleccionado.value = row;
  notasResolucion.value = "";
  modalRechazar.value = true;
};

const ejecutarAprobacion = async () => {
  if (!itemSeleccionado.value || savingResolucion.value) return;

  savingResolucion.value = true;
  try {
    const payload = {
      notas: notasResolucion.value ? notasResolucion.value.trim() : null,
    };
    await api.post(
      `/api/intranet/creditoAplazamientos/${itemSeleccionado.value.id}/aprobar`,
      payload
    );

    show_notify(
      "Solicitud de aplazamiento aprobada y fecha de pago actualizada",
      "check",
      "positive"
    );
    modalAprobar.value = false;
    await recargarCatalogo();
  } catch (error) {
    console.error("Error al aprobar aplazamiento:", error);
    show_notify(
      error?.response?.data?.message || "Error al aprobar la solicitud",
      "error",
      "negative"
    );
  } finally {
    savingResolucion.value = false;
  }
};

const ejecutarRechazo = async () => {
  if (!itemSeleccionado.value || savingResolucion.value) return;

  const motivo = notasResolucion.value ? notasResolucion.value.trim() : "";
  if (!motivo || motivo.length < 3) {
    show_notify(
      "Debe ingresar el motivo por el cual se rechaza la solicitud.",
      "warning",
      "warning"
    );
    return;
  }

  savingResolucion.value = true;
  try {
    const payload = {
      motivo_rechazo: motivo,
    };
    await api.post(
      `/api/intranet/creditoAplazamientos/${itemSeleccionado.value.id}/rechazar`,
      payload
    );

    show_notify(
      "Solicitud de aplazamiento rechazada correctamente",
      "check",
      "positive"
    );
    modalRechazar.value = false;
    await recargarCatalogo();
  } catch (error) {
    console.error("Error al rechazar aplazamiento:", error);
    show_notify(
      error?.response?.data?.message || "Error al rechazar la solicitud",
      "error",
      "negative"
    );
  } finally {
    savingResolucion.value = false;
  }
};

const recargarCatalogo = async () => {
  if (catalogoRef.value?.reload) {
    await catalogoRef.value.reload();
  } else {
    await crud.getPaginatedItems("/api/intranet/creditoAplazamientos");
  }
};

// --- Modales de Visualización de Crédito / Pagos ---
const showDetallesModal = ref(false);
const showPagosModal = ref(false);
const creditoSeleccionadoModal = ref(null);

const abrirDetallesCredito = (credito) => {
  if (!credito) return;
  creditoSeleccionadoModal.value = credito;
  showDetallesModal.value = true;
};

const abrirPagosCredito = (credito) => {
  if (!credito) return;
  creditoSeleccionadoModal.value = credito;
  showPagosModal.value = true;
};

const onCreditoUpdated = async () => {
  await recargarCatalogo();
};

const getOptions = async () => {
  try {
    const res = await api.get("/api/intranet/creditoInternos/options");
    if (res?.data?.data) {
      options.value = res.data.data;
    }
  } catch (error) {
    console.error("Error al cargar opciones:", error);
  }
};

onMounted(() => {
  getOptions();
});
</script>

<style scoped>
.hover-shadow:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
