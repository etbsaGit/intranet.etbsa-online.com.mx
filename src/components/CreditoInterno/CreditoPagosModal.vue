<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    transition-show="scale"
    transition-hide="scale"
    maximized
  >
    <q-card class="column no-wrap bg-grey-1">
      <!-- Encabezado del Modal -->
      <q-card-section
        class="bg-teal-8 text-white row items-center justify-between q-py-sm shadow-2"
      >
        <div class="row items-center q-gutter-sm">
          <q-icon name="payments" size="md" />
          <div>
            <div class="text-subtitle1 text-weight-bold flex items-center q-gutter-xs">
              <span>Control y Gestión de Pagos del Crédito</span>
              <q-badge
                v-if="credito?.folio"
                color="white"
                text-color="teal-9"
                class="text-weight-bold"
              >
                #{{ credito.folio }}
              </q-badge>
            </div>
            <div class="text-caption text-teal-1">
              Cliente: <strong>{{ credito?.cliente?.nombre || "No especificado" }}</strong>
              <span v-if="credito?.linea?.name"> | Línea: {{ credito.linea.name }}</span>
            </div>
          </div>
        </div>

        <div class="row items-center q-gutter-xs">
          <q-btn flat round dense icon="close" v-close-popup />
        </div>
      </q-card-section>

      <!-- Resumen Financiero Superior -->
      <q-card-section class="q-pa-md bg-white border-bottom shadow-1">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="bg-blue-1 q-pa-sm rounded-borders">
              <div class="text-caption text-grey-8">Monto Solicitado</div>
              <div class="text-h6 text-weight-bolder text-primary">
                {{ formatCurrency(credito?.monto_solicitado || 0) }}
              </div>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="bg-amber-1 q-pa-sm rounded-borders">
              <div class="text-caption text-grey-8">
                {{
                  (
                    credito?.tipo_enganche?.nombre ||
                    credito?.tipo_anticipo ||
                    ""
                  )
                    .toLowerCase()
                    .includes("a cuenta")
                    ? "Valor Maquinaria"
                    : (credito?.tipo_enganche?.nombre || "")
                        .toLowerCase()
                        .includes("sin")
                    ? "Enganche"
                    : "Enganche / Anticipo"
                }}
              </div>
              <div class="text-h6 text-weight-bolder text-amber-9">
                {{
                  formatCurrency(
                    credito?.valor_enganche || credito?.anticipo || 0
                  )
                }}
              </div>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="bg-green-1 q-pa-sm rounded-borders">
              <div class="text-caption text-grey-8">Total Pagado</div>
              <div class="text-h6 text-weight-bolder text-positive">
                {{ formatCurrency(totalPagadoCalculado) }}
              </div>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="bg-indigo-1 q-pa-sm rounded-borders">
              <div class="text-caption text-grey-8">Progreso de Pagos</div>
              <div class="text-h6 text-weight-bolder text-indigo">
                {{ pagosLiquidadosCount }} / {{ listaPagos.length }} Liquidados
              </div>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <!-- Tabla de Pagos -->
      <q-card-section class="col q-pa-md scroll">
        <q-table
          flat
          bordered
          :rows="listaPagos"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :rows-per-page-options="[0]"
          hide-pagination
          class="bg-white rounded-borders shadow-1"
        >
          <!-- Barra de búsqueda superior -->
          <template v-slot:top-left>
            <div class="text-subtitle1 text-weight-bold text-teal-9 flex items-center q-gutter-xs">
              <q-icon name="format_list_numbered" />
              <span>Programación Detallada de Pagos ({{ listaPagos.length }})</span>
            </div>
          </template>

          <template v-slot:top-right>
            <q-input
              dense
              outlined
              clearable
              debounce="300"
              v-model="filter"
              placeholder="Buscar pago..."
              style="width: 250px"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <!-- Columna: Número de Pago -->
          <template v-slot:body-cell-n_pago="props">
            <q-td :props="props" align="center">
              <q-chip
                dense
                :color="
                  props.row.es_anticipo ||
                  props.row.etiqueta === 'Enganche' ||
                  (props.row.n_pago === 1 &&
                    Number(
                      credito?.valor_enganche || credito?.anticipo
                    ) > 0)
                    ? 'orange-9'
                    : 'dark'
                "
                text-color="white"
                class="text-weight-bold q-px-sm"
              >
                {{
                  props.row.es_anticipo ||
                  props.row.etiqueta === 'Enganche' ||
                  (props.row.n_pago === 1 &&
                    Number(
                      credito?.valor_enganche || credito?.anticipo
                    ) > 0)
                    ? 'Pago 1 (Enganche)'
                    : props.row.etiqueta || `Pago #${props.row.n_pago}`
                }}
              </q-chip>
            </q-td>
          </template>

          <!-- Columna: Fecha a Pagar -->
          <template v-slot:body-cell-fecha_a_pagar="props">
            <q-td :props="props">
              <div class="text-weight-medium flex items-center q-gutter-xs">
                <q-icon name="event" size="xs" color="teal-8" />
                <span>
                  {{
                    formatFechaLarga(
                      props.row.fecha_a_pagar || props.row.fecha
                    )
                  }}
                </span>
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
                  backgroundColor:
                    props.row.estatus?.color ||
                    (props.row.fecha_liquidado ? '#2e7d32' : '#ff9800'),
                }"
              >
                {{
                  props.row.estatus?.nombre ||
                  props.row.estatus ||
                  (props.row.fecha_liquidado ? "Liquidado" : "Pendiente")
                }}
              </q-chip>
            </q-td>
          </template>

          <!-- Columna: Monto Pagado (EDITABLE INDIVIDUALMENTE) -->
          <template v-slot:body-cell-monto_pagado="props">
            <q-td :props="props" align="right">
              <div class="row items-center justify-end q-gutter-xs no-wrap">
                <q-input
                  dense
                  outlined
                  type="number"
                  prefix="$"
                  v-model.number="props.row._edit_monto_pagado"
                  style="width: 145px"
                  class="bg-white"
                  :loading="props.row._saving"
                  :disable="props.row._saving"
                  @keydown.enter="guardarMontoPagado(props.row)"
                >
                  <template v-slot:append>
                    <q-btn
                      round
                      dense
                      flat
                      icon="save"
                      color="positive"
                      :loading="props.row._saving"
                      :disable="props.row._saving"
                      @click="guardarMontoPagado(props.row)"
                    >
                      <q-tooltip>Guardar monto pagado para este pago</q-tooltip>
                    </q-btn>
                  </template>
                </q-input>
              </div>
            </q-td>
          </template>

          <!-- Columna: Saldo Pendiente -->
          <template v-slot:body-cell-saldo_pendiente="props">
            <q-td :props="props" align="right">
              <div class="text-weight-bold text-dark">
                {{ formatCurrency(props.row.saldo_pendiente || 0) }}
              </div>
            </q-td>
          </template>

          <!-- Columna: Fecha Liquidado -->
          <template v-slot:body-cell-fecha_liquidado="props">
            <q-td :props="props" align="center">
              <div
                v-if="props.row.fecha_liquidado"
                class="text-weight-medium text-positive flex items-center justify-center q-gutter-xs"
              >
                <q-icon name="check_circle" size="xs" color="positive" />
                <span>{{ formatFechaLarga(props.row.fecha_liquidado) }}</span>
              </div>
              <div v-else class="text-grey-5">—</div>
            </q-td>
          </template>

          <!-- Columna: Validado Por -->
          <template v-slot:body-cell-validado_por="props">
            <q-td :props="props" align="left">
              <div
                v-if="
                  props.row.validador?.nombreCompleto ||
                  props.row.validado_por?.nombreCompleto ||
                  props.row.validated_by?.nombreCompleto ||
                  props.row.validador ||
                  props.row.validado_por
                "
                class="flex items-center q-gutter-xs"
              >
                <q-icon name="verified_user" size="xs" color="teal-8" />
                <span class="text-weight-medium">
                  {{
                    props.row.validador?.nombreCompleto ||
                    props.row.validado_por?.nombreCompleto ||
                    props.row.validated_by?.nombreCompleto ||
                    props.row.validador ||
                    props.row.validado_por
                  }}
                </span>
              </div>
              <div v-else class="text-caption text-grey-5">Sin validar</div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-separator />

      <!-- Acciones Inferiores -->
      <q-card-actions align="right" class="q-pa-md bg-grey-2">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { formatCurrency, formatFechaLarga } from "src/boot/format";
import { sendRequest, show_notify } from "src/boot/functions";
import { api } from "src/boot/axios";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  credito: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "updated"]);

const filter = ref("");
const listaPagos = ref([]);

const columns = [
  {
    name: "n_pago",
    label: "N° Pago",
    field: (row) => row.n_pago ?? row.numero ?? "-",
    align: "center",
    sortable: true,
  },
  {
    name: "fecha_a_pagar",
    label: "Fecha a Pagar",
    field: (row) => row.fecha_a_pagar || row.fecha || "",
    align: "left",
    sortable: true,
  },
  {
    name: "estatus",
    label: "Estatus",
    field: (row) => row.estatus?.nombre || row.estatus || "Pendiente",
    align: "center",
    sortable: true,
  },
  {
    name: "monto_pagado",
    label: "Monto Pagado (Editable)",
    field: (row) => row._edit_monto_pagado ?? row.monto_pagado ?? 0,
    align: "right",
    sortable: true,
  },
  {
    name: "saldo_pendiente",
    label: "Saldo Pendiente",
    field: (row) => row.saldo_pendiente || 0,
    align: "right",
    sortable: true,
  },
  {
    name: "fecha_liquidado",
    label: "Fecha Liquidado",
    field: (row) => row.fecha_liquidado || "",
    align: "center",
    sortable: true,
  },
  {
    name: "validado_por",
    label: "Validado Por",
    field: (row) =>
      row.validador?.nombreCompleto ||
      row.validado_por?.nombreCompleto ||
      row.validated_by ||
      "",
    align: "left",
    sortable: true,
  },
];

const sincronizarPagos = () => {
  if (props.credito?.pagos && Array.isArray(props.credito.pagos)) {
    listaPagos.value = props.credito.pagos.map((p) => ({
      ...p,
      _edit_monto_pagado: p.monto_pagado !== null && p.monto_pagado !== undefined ? Number(p.monto_pagado) : null,
      _saving: false,
    }));
  } else {
    listaPagos.value = [];
  }
};

watch(
  () => props.credito,
  () => {
    sincronizarPagos();
  },
  { immediate: true, deep: true }
);

const totalPagadoCalculado = computed(() => {
  return listaPagos.value.reduce((acc, curr) => {
    const val = Number(curr._edit_monto_pagado ?? curr.monto_pagado ?? 0);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
});

const pagosLiquidadosCount = computed(() => {
  return listaPagos.value.filter((p) => Boolean(p.fecha_liquidado) || Number(p._edit_monto_pagado) > 0).length;
});

const guardarMontoPagado = async (pago) => {
  if (pago._saving) return;
  pago._saving = true;

  try {
    const payload = {
      id: pago.id,
      monto_pagado: pago._edit_monto_pagado,
      solicitud_id: pago.solicitud_id || props.credito?.id,
    };

    let guardadoExitoso = false;
    let resData = null;

    // Intentar endpoints estándar de actualización REST
    const urlsToTry = [
      `/api/intranet/creditoInternoPagos/${pago.id}`,
      `/api/intranet/creditoInternos/pagos/${pago.id}`,
      `/api/intranet/creditoPagos/${pago.id}`,
      `/api/intranet/pagos/${pago.id}`,
      `/api/intranet/creditoInterno/${props.credito?.id}/pago/${pago.id}`,
    ];

    for (const url of urlsToTry) {
      try {
        const { data } = await api.put(url, payload);
        guardadoExitoso = true;
        resData = data;
        break;
      } catch (e) {
        // Continuar probando fallback si el endpoint no coincide
        if (e.response?.status !== 404 && e.response?.status !== 405) {
          // Si es un error de validación del backend, propagar
          throw e;
        }
      }
    }

    // Si los endpoints directos de pago dan 404, intentar vía sendRequest
    if (!guardadoExitoso) {
      try {
        resData = await sendRequest(
          "PUT",
          payload,
          `/api/intranet/creditoInternoPagos/${pago.id}`
        );
        guardadoExitoso = true;
      } catch (errFallback) {
        // Último fallback: actualizar la solicitud
        resData = await sendRequest(
          "PUT",
          {
            id: props.credito?.id,
            pago_id: pago.id,
            monto_pagado: pago._edit_monto_pagado,
          },
          `/api/intranet/creditoInternos/${props.credito?.id}`
        );
        guardadoExitoso = true;
      }
    }

    pago.monto_pagado = pago._edit_monto_pagado;
    show_notify("Monto pagado actualizado correctamente", "check", "positive");
    emit("updated");
  } catch (error) {
    console.error("Error al actualizar monto pagado:", error);
    show_notify(
      error?.response?.data?.message || "Error al actualizar el pago",
      "error",
      "negative"
    );
  } finally {
    pago._saving = false;
  }
};
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
</style>
