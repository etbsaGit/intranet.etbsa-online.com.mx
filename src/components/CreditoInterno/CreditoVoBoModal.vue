<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      style="min-width: 650px; max-width: 950px; width: 100%"
      class="rounded-borders"
    >
      <!-- Encabezado del Modal -->
      <q-card-section
        class="bg-purple-9 text-white row items-center justify-between q-py-sm"
      >
        <div
          class="text-subtitle1 text-weight-bold flex items-center q-gutter-sm"
        >
          <q-icon name="fact_check" size="sm" />
          <span>Dictamen de VoBo — Crédito</span>
          <q-badge
            v-if="credito?.folio"
            color="white"
            text-color="purple-10"
            class="text-weight-bold"
          >
            #{{ credito.folio }}
          </q-badge>
        </div>
        <q-btn flat round dense icon="close" v-close-popup :disable="saving" />
      </q-card-section>

      <!-- Banner Informativo -->
      <div class="bg-purple-1 text-purple-10 q-pa-sm text-caption row items-center no-wrap" style="border-bottom: 1px solid #e1bee7">
        <q-icon name="verified_user" size="20px" class="q-mr-xs flex-shrink-0" />
        <div>
          Este dictamen queda registrado como <strong>evidencia formal</strong> de que el departamento de <strong>Crédito</strong> revisó y evaluó la solicitud.
        </div>
      </div>

      <!-- Contenido del Modal (Scroll) -->
      <q-card-section class="q-pa-md scroll" style="max-height: 70vh">
        <div v-if="credito" class="q-gutter-y-md">
          <!-- Estado actual del VoBo si ya fue dictaminado previamente -->
          <q-banner
            v-if="tieneVoBoPrevio"
            dense
            rounded
            :class="esVoBoPrevioAprobado ? 'bg-green-1 text-green-9' : 'bg-red-1 text-red-9'"
            :style="esVoBoPrevioAprobado ? 'border: 1px solid #a5d6a7' : 'border: 1px solid #ef9a9a'"
          >
            <template v-slot:avatar>
              <q-icon
                :name="esVoBoPrevioAprobado ? 'check_circle' : 'cancel'"
                :color="esVoBoPrevioAprobado ? 'positive' : 'negative'"
              />
            </template>
            <div class="text-subtitle2 text-weight-bold">
              Dictamen Actual: {{ esVoBoPrevioAprobado ? 'VoBo Otorgado' : 'VoBo No Otorgado' }}
            </div>
            <div class="text-caption" v-if="credito.vobo_fecha || credito.vobo_at">
              Registrado el {{ formatFechaLarga(credito.vobo_fecha || credito.vobo_at) }}
              <span v-if="credito.vobo_usuario?.nombreCompleto || credito.vobo_user?.name">
                por <strong>{{ credito.vobo_usuario?.nombreCompleto || credito.vobo_user?.name }}</strong>
              </span>
            </div>
            <div class="text-body2 q-mt-xs text-grey-9 bg-white q-pa-xs rounded-borders" v-if="credito.vobo_notas || credito.vobo_observaciones || credito.vobo_comentarios">
              <strong>Observaciones previas:</strong> {{ credito.vobo_notas || credito.vobo_observaciones || credito.vobo_comentarios }}
            </div>
          </q-banner>

          <!-- Tarjeta 1: Información del Cliente -->
          <q-card flat bordered class="bg-grey-1">
            <q-card-section class="q-pb-xs">
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center q-gutter-xs"
              >
                <q-icon name="person" />
                <span>Información del Cliente</span>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-xs">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-5">
                  <div class="text-caption text-grey-7">Nombre / Razón Social</div>
                  <div class="text-weight-medium text-dark">
                    {{ credito.cliente?.nombre || "N/A" }}
                  </div>
                </div>
                <div class="col-12 col-md-3">
                  <div class="text-caption text-grey-7">Tipo de Persona</div>
                  <q-badge
                    dense
                    :color="
                      (credito.cliente?.tipo || '')
                        .toLowerCase()
                        .includes('moral')
                        ? 'indigo-8'
                        : 'teal-8'
                    "
                    text-color="white"
                    class="text-weight-bold q-px-xs"
                  >
                    {{
                      (credito.cliente?.tipo || "")
                        .toLowerCase()
                        .includes("moral")
                        ? "Persona Moral"
                        : "Persona Física"
                    }}
                  </q-badge>
                </div>
                <div class="col-12 col-md-4">
                  <div class="text-caption text-grey-7">RFC</div>
                  <div class="text-weight-medium">
                    {{ credito.cliente?.rfc || "N/A" }}
                  </div>
                </div>
                <div class="col-12 col-md-4" v-if="credito.cliente?.telefono">
                  <div class="text-caption text-grey-7">Teléfono</div>
                  <div class="text-weight-medium">
                    {{ formatPhoneNumber(credito.cliente.telefono) }}
                  </div>
                </div>
                <div class="col-12 col-md-8" v-if="credito.cliente?.email">
                  <div class="text-caption text-grey-7">Email</div>
                  <div class="text-weight-medium">
                    {{ credito.cliente.email }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Tarjeta 2: Asignación y Condiciones Financieras -->
          <q-card flat bordered class="bg-blue-1">
            <q-card-section class="q-pb-xs">
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center q-gutter-xs"
              >
                <q-icon name="attach_money" />
                <span>Condiciones del Crédito y Asignación</span>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-xs">
              <div class="row q-col-gutter-md">
                <div class="col-6 col-sm-3">
                  <div class="text-caption text-grey-8">Monto Solicitado</div>
                  <div class="text-h6 text-weight-bolder text-primary">
                    {{ formatCurrency(credito.monto_solicitado || 0) }}
                  </div>
                </div>
                <div
                  class="col-6 col-sm-3"
                  v-if="credito.tipo_enganche?.nombre || credito.tipo_anticipo"
                >
                  <div class="text-caption text-grey-8">Tipo de Enganche</div>
                  <div class="text-h6 text-weight-bolder text-dark">
                    {{ credito.tipo_enganche?.nombre || credito.tipo_anticipo }}
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="text-caption text-grey-8">
                    {{
                      (credito.tipo_enganche?.nombre || credito.tipo_anticipo || "")
                        .toLowerCase()
                        .includes("a cuenta")
                        ? "Valor Maquinaria"
                        : (credito.tipo_enganche?.nombre || "")
                            .toLowerCase()
                            .includes("sin")
                        ? "Enganche"
                        : "Enganche / Anticipo"
                    }}
                  </div>
                  <div class="text-h6 text-weight-bolder text-amber-9">
                    {{
                      formatCurrency(
                        credito.valor_enganche || credito.anticipo || 0
                      )
                    }}
                  </div>
                </div>
                <div class="col-6 col-sm-3">
                  <div class="text-caption text-grey-8">Número de Pagos</div>
                  <div class="text-h6 text-weight-bolder text-indigo">
                    {{ credito.numero_pagos || credito.pagos?.length || 0 }}
                  </div>
                </div>

                <div class="col-12 col-md-4">
                  <div class="text-caption text-grey-7">Línea de Crédito</div>
                  <div class="text-weight-medium">
                    {{ credito.linea?.name || credito.credito_linea?.name || "Línea Asignada" }}
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="text-caption text-grey-7">Asesor Solicitante</div>
                  <div class="text-weight-medium">
                    {{ credito.asesor?.nombreCompleto || "N/A" }}
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="text-caption text-grey-7">Sucursal</div>
                  <div class="text-weight-medium">
                    {{ credito.sucursal?.nombre || "N/A" }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Tarjeta 3: Analítica Financiera (si existe o fue solicitada) -->
          <q-card
            flat
            bordered
            v-if="analiticaVinculada || credito.analitica_solicitada || cargandoAnalitica"
            class="bg-purple-1"
            style="border: 1px solid #ce93d8"
          >
            <q-card-section class="q-pb-xs">
              <div class="row items-center justify-between">
                <div
                  class="text-subtitle2 text-weight-bold text-purple-9 flex items-center q-gutter-xs"
                >
                  <q-icon name="insights" size="sm" />
                  <span>Analítica Financiera Vinculada</span>
                </div>
                <div v-if="analiticaVinculada" class="row items-center q-gutter-xs">
                  <q-chip
                    dense
                    :color="getDropdownPropsAut(analiticaVinculada.status).color"
                    :text-color="getDropdownPropsAut(analiticaVinculada.status).textColor"
                    :icon="getDropdownPropsAut(analiticaVinculada.status).icon"
                    :label="getDropdownPropsAut(analiticaVinculada.status).label"
                    class="text-weight-bold q-px-sm"
                  />
                  <q-btn
                    dense
                    color="purple-8"
                    icon="assessment"
                    label="Ver Analítica"
                    class="text-weight-bold q-px-sm"
                    @click="modalReporteAnalitica = true"
                  >
                    <q-tooltip>Consultar reporte completo de la analítica</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-xs">
              <div
                v-if="cargandoAnalitica"
                class="row items-center q-gutter-sm q-py-xs text-caption text-grey-7"
              >
                <q-spinner color="purple" size="20px" />
                <span>Consultando analítica vinculada...</span>
              </div>
              <div
                v-else-if="analiticaVinculada"
                class="row q-col-gutter-sm items-center"
              >
                <div class="col-12 col-md-4">
                  <div class="text-caption text-grey-7">Periodo / Título</div>
                  <div class="text-weight-medium text-dark">
                    {{ analiticaVinculada.titulo || "Sin periodo especificado" }}
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="text-caption text-grey-7">Fecha de Registro</div>
                  <div class="text-weight-medium text-dark">
                    {{ formatFechaLarga(analiticaVinculada.created_at || analiticaVinculada.fecha) }}
                  </div>
                </div>
                <div
                  class="col-12 col-md-4"
                  v-if="analiticaVinculada.comentarios"
                >
                  <div class="text-caption text-grey-7">Comentarios</div>
                  <div class="text-weight-medium text-dark ellipsis">
                    {{ analiticaVinculada.comentarios }}
                  </div>
                </div>
              </div>
              <div
                v-else-if="credito.analitica_solicitada"
                class="text-caption text-purple-9 row items-center q-gutter-xs"
              >
                <q-icon name="info" color="purple-8" size="18px" />
                <span>Analítica solicitada en esta solicitud (pendiente de captura).</span>
              </div>
            </q-card-section>
          </q-card>

          <!-- Tarjeta 4: Documentación Adjunta -->
          <CreditoDocumentacionCard
            :documentacion="credito.documentacion"
            :archivos="credito.archivos"
          />

          <!-- Tarjeta 5: Motivo y Observaciones del Asesor -->
          <q-card
            flat
            bordered
            v-if="credito.motivo || credito.notas"
            class="bg-grey-1"
          >
            <q-card-section class="q-pb-xs">
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center q-gutter-xs"
              >
                <q-icon name="notes" />
                <span>Justificación y Observaciones de la Solicitud</span>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-xs">
              <div v-if="credito.motivo" class="q-mb-sm">
                <div class="text-caption text-grey-7 text-weight-bold">
                  Justificación / Motivo:
                </div>
                <div
                  class="text-body2 text-grey-9 bg-white q-pa-sm rounded-borders"
                >
                  {{ credito.motivo }}
                </div>
              </div>
              <div v-if="credito.notas">
                <div class="text-caption text-grey-7 text-weight-bold">
                  Notas Adicionales:
                </div>
                <div
                  class="text-body2 text-grey-9 bg-white q-pa-sm rounded-borders"
                >
                  {{ credito.notas }}
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- SECCIÓN: DICTAMEN DE CRÉDITO -->
          <q-card flat bordered class="bg-grey-2 shadow-2" style="border: 2px solid #7b1fa2">
            <q-card-section class="bg-purple-9 text-white q-py-xs">
              <div class="text-subtitle2 text-weight-bold flex items-center q-gutter-xs">
                <q-icon name="rate_review" />
                <span>Dictamen del Visto Bueno (VoBo)</span>
              </div>
            </q-card-section>

            <q-card-section class="q-pa-md q-gutter-y-sm">
              <div class="text-body2 text-grey-9">
                Seleccione la resolución del departamento de Crédito e ingrese observaciones de evidencia si aplica:
              </div>

              <!-- Input de Observaciones / Comentarios -->
              <q-input
                v-model="observaciones"
                filled
                dense
                type="textarea"
                rows="3"
                label="Notas / Justificación del Dictamen (Obligatorio para No Dar VoBo)"
                placeholder="Ingrese notas o justificación del dictamen de Crédito..."
                bg-color="white"
                :disable="saving"
              />

              <!-- Botones de Acción para Dar o No Dar VoBo -->
              <div class="row q-col-gutter-md q-mt-xs">
                <div class="col-12 col-sm-6">
                  <q-btn
                    unelevated
                    color="positive"
                    icon="thumb_up"
                    label="Dar VoBo (Favorable)"
                    class="full-width text-weight-bold q-py-sm"
                    :loading="saving && dictamenSeleccionado === true"
                    :disable="saving"
                    @click="ejecutarVoBo(true)"
                  >
                    <q-tooltip>Otorgar el Visto Bueno de Crédito a esta solicitud</q-tooltip>
                  </q-btn>
                </div>
                <div class="col-12 col-sm-6">
                  <q-btn
                    unelevated
                    color="negative"
                    icon="thumb_down"
                    label="No Dar VoBo (Desfavorable)"
                    class="full-width text-weight-bold q-py-sm"
                    :loading="saving && dictamenSeleccionado === false"
                    :disable="saving"
                    @click="ejecutarVoBo(false)"
                  >
                    <q-tooltip>Indicar que Crédito no otorga el Visto Bueno</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Acciones del Modal -->
      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn flat label="Cerrar" color="grey-8" v-close-popup :disable="saving" />
      </q-card-actions>
    </q-card>

    <!-- Modal de Reporte de Analítica Financiera -->
    <q-dialog v-model="modalReporteAnalitica" full-width full-height>
      <q-card class="column no-wrap" style="height: 100%">
        <q-card-section
          class="bg-purple-8 text-white row items-center justify-between q-py-sm"
        >
          <div
            class="text-subtitle1 text-weight-bold flex items-center q-gutter-sm"
          >
            <q-icon name="assessment" />
            <span>
              Reporte de Analítica Financiera
              {{
                analiticaVinculada?.titulo
                  ? `— ${analiticaVinculada.titulo}`
                  : ""
              }}
            </span>
          </div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="col q-pa-none bg-grey-2 scroll">
          <analitica-report
            v-if="analiticaVinculada?.id"
            :id="analiticaVinculada.id"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import {
  formatPhoneNumber,
  formatCurrency,
  formatFechaLarga,
} from "src/boot/format";
import { sendRequest, show_notify } from "src/boot/functions";
import { api } from "src/boot/axios";
import CreditoDocumentacionCard from "./CreditoDocumentacionCard.vue";
import AnaliticaReport from "src/components/Analitica/AnaliticaReport.vue";

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

const saving = ref(false);
const dictamenSeleccionado = ref(null);
const observaciones = ref("");

const tieneVoBoPrevio = computed(() => {
  const c = props.credito;
  if (!c) return false;
  return (
    c.vobo !== null &&
    c.vobo !== undefined &&
    c.vobo !== ""
  ) || (
    c.vobo_credito !== null &&
    c.vobo_credito !== undefined &&
    c.vobo_credito !== ""
  );
});

const esVoBoPrevioAprobado = computed(() => {
  const c = props.credito;
  if (!c) return false;
  const val = c.vobo ?? c.vobo_credito;
  return val === true || val === 1 || val === "1" || val === "true" || val === "aprobado";
});

// --- Gestión y Vinculación de Analítica Financiera ---
const cargandoAnalitica = ref(false);
const analiticaVinculada = ref(null);
const modalReporteAnalitica = ref(false);

const sonMismoDia = (dateA, dateB) => {
  if (!dateA || !dateB) return false;
  if (dateA === dateB) return true;

  const strA = String(dateA).trim().substring(0, 10).replace(/\//g, "-");
  const strB = String(dateB).trim().substring(0, 10).replace(/\//g, "-");
  if (strA.length === 10 && strB.length === 10 && strA === strB) {
    return true;
  }

  const dA = new Date(dateA);
  const dB = new Date(dateB);
  if (!isNaN(dA.getTime()) && !isNaN(dB.getTime())) {
    const localA = `${dA.getFullYear()}-${String(dA.getMonth() + 1).padStart(2, "0")}-${String(dA.getDate()).padStart(2, "0")}`;
    const localB = `${dB.getFullYear()}-${String(dB.getMonth() + 1).padStart(2, "0")}-${String(dB.getDate()).padStart(2, "0")}`;
    if (localA === localB) return true;

    const utcA = `${dA.getUTCFullYear()}-${String(dA.getUTCMonth() + 1).padStart(2, "0")}-${String(dA.getUTCDate()).padStart(2, "0")}`;
    const utcB = `${dB.getUTCFullYear()}-${String(dB.getUTCMonth() + 1).padStart(2, "0")}-${String(dB.getUTCDate()).padStart(2, "0")}`;
    if (utcA === utcB) return true;

    if (Math.abs(dA.getTime() - dB.getTime()) <= 86400000) {
      return true;
    }
  }

  return false;
};

const buscarAnaliticaVinculada = async () => {
  analiticaVinculada.value = null;
  const creditoObj = props.credito;
  if (!creditoObj) return;

  if (creditoObj.analitica && typeof creditoObj.analitica === "object") {
    analiticaVinculada.value = creditoObj.analitica;
    return;
  }

  const clienteId = creditoObj.cliente_id || creditoObj.cliente?.id || creditoObj.id_cliente;
  const creditoCreatedAt = creditoObj.created_at || creditoObj.fecha || creditoObj.createdAt;

  if (!clienteId) return;

  try {
    cargandoAnalitica.value = true;
    const res = await sendRequest(
      "GET",
      null,
      `/api/intranet/analitica/cliente/${clienteId}`
    );

    let lista = [];
    if (Array.isArray(res)) {
      lista = res;
    } else if (Array.isArray(res?.analiticas)) {
      lista = res.analiticas;
    } else if (Array.isArray(res?.data?.analiticas)) {
      lista = res.data.analiticas;
    } else if (Array.isArray(res?.data)) {
      lista = res.data;
    } else if (typeof res === "object" && res !== null) {
      const foundArray = Object.values(res).find((v) => Array.isArray(v));
      if (foundArray) lista = foundArray;
    }

    if (lista.length > 0) {
      const delMismoDia = lista.filter((a) => {
        const aClienteId = a.cliente_id || a.cliente?.id || a.id_cliente;
        if (aClienteId && String(aClienteId) !== String(clienteId)) {
          return false;
        }
        if (!creditoCreatedAt) return true;
        return sonMismoDia(a.created_at || a.fecha, creditoCreatedAt);
      });

      if (delMismoDia.length > 0) {
        if (delMismoDia.length === 1) {
          analiticaVinculada.value = delMismoDia[0];
        } else {
          const timeCredito = creditoCreatedAt ? new Date(creditoCreatedAt).getTime() : 0;
          delMismoDia.sort((a, b) => {
            const timeA = new Date(a.created_at || a.fecha).getTime();
            const timeB = new Date(b.created_at || b.fecha).getTime();
            const diffA = isNaN(timeA) ? Infinity : Math.abs(timeA - timeCredito);
            const diffB = isNaN(timeB) ? Infinity : Math.abs(timeB - timeCredito);
            return diffA - diffB;
          });
          analiticaVinculada.value = delMismoDia[0];
        }
      } else if (lista.length === 1) {
        analiticaVinculada.value = lista[0];
      }
    }
  } catch (error) {
    console.error("Error al buscar analítica vinculada en VoBo:", error);
  } finally {
    cargandoAnalitica.value = false;
  }
};

const getDropdownPropsAut = (validated) => {
  if (validated === 0) {
    return {
      color: "red",
      textColor: "white",
      icon: "close",
      label: "Rechazado",
    };
  } else if (validated === 1) {
    return {
      color: "green",
      textColor: "white",
      icon: "check_circle",
      label: "Autorizada",
    };
  } else {
    return {
      color: "primary",
      textColor: "white",
      icon: "hourglass_empty",
      label: "Esperando autorización",
    };
  }
};

// --- Ejecutar Dictamen VoBo ---
const ejecutarVoBo = async (esAprobado) => {
  if (!props.credito?.id || saving.value) return;

  const obs = observaciones.value ? observaciones.value.trim() : null;

  if (!esAprobado && !obs) {
    show_notify(
      "Debe ingresar las notas u observaciones para un dictamen desfavorable (No dar VoBo)",
      "warning",
      "negative"
    );
    return;
  }

  dictamenSeleccionado.value = esAprobado;
  saving.value = true;

  const payload = {
    solicitud_id: props.credito.id,
    aprobado: Boolean(esAprobado),
    notas: obs,
  };

  try {
    let res;
    // Intentar endpoint principal definido en CreditoInternoController
    try {
      res = await api.post("/api/intranet/creditoInternos/voBoCredito", payload);
    } catch (err1) {
      if (err1?.response?.status === 404) {
        try {
          res = await api.post("/api/intranet/creditoInterno/voBoCredito", payload);
        } catch (err2) {
          if (err2?.response?.status === 404) {
            res = await api.post(`/api/intranet/creditoInternos/${props.credito.id}/voBoCredito`, payload);
          } else {
            throw err2;
          }
        }
      } else {
        throw err1;
      }
    }

    show_notify(
      res?.data?.message ||
        (esAprobado
          ? "VoBo de Crédito otorgado correctamente"
          : "Dictamen de VoBo no otorgado registrado"),
      "check",
      esAprobado ? "positive" : "orange-9"
    );

    emit("updated", res?.data?.data || res?.data);
    emit("update:modelValue", false);
  } catch (error) {
    console.error("Error al registrar VoBo de crédito:", error);
    show_notify(
      error?.response?.data?.message || "Error al procesar el VoBo de crédito",
      "error",
      "negative"
    );
  } finally {
    saving.value = false;
    dictamenSeleccionado.value = null;
  }
};

watch(
  [() => props.modelValue, () => props.credito],
  ([isOpen, cred]) => {
    if (isOpen && cred) {
      observaciones.value = cred.vobo_notas || cred.vobo_observaciones || cred.vobo_comentarios || "";
      buscarAnaliticaVinculada();
    } else {
      observaciones.value = "";
      analiticaVinculada.value = null;
    }
  },
  { immediate: true }
);
</script>
