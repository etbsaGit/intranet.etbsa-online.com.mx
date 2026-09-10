<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      style="min-width: 650px; max-width: 900px; width: 100%"
      class="rounded-borders"
    >
      <!-- Encabezado del Modal -->
      <q-card-section
        class="bg-primary text-white row items-center justify-between q-py-sm"
      >
        <div
          class="text-subtitle1 text-weight-bold flex items-center q-gutter-sm"
        >
          <q-icon name="account_balance_wallet" size="sm" />
          <span>Detalle de Solicitud de Crédito</span>
          <q-badge
            v-if="credito?.folio"
            color="white"
            text-color="primary"
            class="text-weight-bold"
          >
            #{{ credito.folio }}
          </q-badge>
        </div>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <!-- Contenido del Modal -->
      <q-card-section class="q-pa-md scroll" style="max-height: 80vh">
        <div v-if="credito" class="q-gutter-y-md">
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
                  <div class="text-caption text-grey-7">
                    Nombre / Razón Social
                  </div>
                  <div class="text-weight-medium">
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

          <!-- Tarjeta 2: Asignación y Estatus -->
          <q-card flat bordered class="bg-grey-1">
            <q-card-section class="q-pb-xs">
              <div
                class="text-subtitle2 text-weight-bold text-teal-8 flex items-center q-gutter-xs"
              >
                <q-icon name="storefront" />
                <span>Datos de Asignación y Estatus</span>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-xs">
              <div class="row q-col-gutter-sm items-center">
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
                <!-- Estatus sin ícono y con estatus.color -->
                <div class="col-12 col-md-4">
                  <div class="text-caption text-grey-7">Estatus Actual</div>
                  <q-chip
                    dense
                    class="text-weight-bold text-white q-px-sm"
                    :style="{
                      backgroundColor: credito.estatus?.color || '#1976d2',
                    }"
                  >
                    {{
                      credito.estatus?.nombre || credito.estatus || "Pendiente"
                    }}
                  </q-chip>
                </div>
                <div
                  class="col-12 col-md-6"
                  v-if="credito.notificado?.nombreCompleto"
                >
                  <div class="text-caption text-grey-7">Gerente Notificado</div>
                  <div class="text-weight-medium">
                    {{ credito.notificado.nombreCompleto }}
                  </div>
                </div>
                <div
                  class="col-12 col-md-6"
                  v-if="credito.linea?.name || credito.linea_id"
                >
                  <div class="text-caption text-grey-7">Línea de Crédito</div>
                  <div class="text-weight-medium">
                    {{
                      credito.linea?.name ||
                      credito.credito_linea?.name ||
                      "Línea Asignada"
                    }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Tarjeta 3: Condiciones Financieras -->
          <q-card flat bordered class="bg-blue-1">
            <q-card-section class="q-pb-xs">
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center q-gutter-xs"
              >
                <q-icon name="attach_money" />
                <span>Condiciones Financieras</span>
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
                      (
                        credito.tipo_enganche?.nombre ||
                        credito.tipo_anticipo ||
                        ""
                      )
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
              </div>
            </q-card-section>
          </q-card>

          <!-- Tarjeta 4: Programación de Pagos (si existen) -->
          <q-card
            flat
            bordered
            v-if="credito.pagos && credito.pagos.length > 0"
            class="bg-grey-1"
          >
            <q-card-section class="q-pb-xs">
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center q-gutter-xs"
              >
                <q-icon name="payments" />
                <span>Programación de Pagos ({{ credito.pagos.length }})</span>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-xs">
              <q-table
                flat
                bordered
                dense
                :rows="credito.pagos || []"
                :columns="columnsPagos"
                row-key="id"
                hide-pagination
                :rows-per-page-options="[0]"
                class="bg-white rounded-borders"
              >
                <!-- N° Pago -->
                <template v-slot:body-cell-n_pago="props">
                  <q-td :props="props" align="center">
                    <q-chip
                      dense
                      :color="
                        props.row.etiqueta === 'Enganche' ||
                        (props.row.n_pago === 1 &&
                          Number(credito.valor_enganche || credito.anticipo) >
                            0)
                          ? 'orange-9'
                          : 'dark'
                      "
                      text-color="white"
                      class="text-weight-bold"
                    >
                      {{ props.row.etiqueta }}
                    </q-chip>
                  </q-td>
                </template>

                <!-- Fecha a Pagar -->
                <template v-slot:body-cell-fecha_a_pagar="props">
                  <q-td :props="props">
                    <div
                      class="text-weight-medium flex items-center q-gutter-xs"
                    >
                      <q-icon name="event" size="xs" color="primary" />
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

                <!-- Monto Pagado -->
                <template v-slot:body-cell-monto_pagado="props">
                  <q-td :props="props" align="right">
                    <div
                      v-if="
                        props.row.monto_pagado &&
                        Number(props.row.monto_pagado) > 0
                      "
                      class="text-weight-bold text-positive"
                    >
                      {{ formatCurrency(props.row.monto_pagado) }}
                    </div>
                    <div
                      v-else-if="
                        Number(props.row.saldo_pendiente) === 0 &&
                        props.row.fecha_liquidado &&
                        props.row.n_pago > 1
                      "
                    >
                      <q-badge
                        color="green-1"
                        text-color="green-9"
                        class="text-weight-bold q-pa-xs"
                      >
                        Liquidado anticipadamente
                      </q-badge>
                    </div>
                    <div v-else class="text-grey-5">—</div>
                  </q-td>
                </template>

                <!-- Comprobante / Evidencia PDF -->
                <template v-slot:body-cell-comprobante="props">
                  <q-td :props="props" align="center">
                    <div
                      v-if="
                        props.row.documento?.realpath ||
                        props.row.documento?.path ||
                        props.row.documento_id ||
                        props.row.document_id
                      "
                      class="row items-center justify-center q-gutter-xs"
                    >
                      <q-btn
                        dense
                        flat
                        color="red-8"
                        icon="picture_as_pdf"
                        label="Ver Recibo"
                        class="text-weight-bold"
                        @click="previsualizarPdf(props.row.documento)"
                      >
                        <q-tooltip>Ver comprobante PDF</q-tooltip>
                      </q-btn>
                    </div>
                    <div
                      v-else-if="
                        Number(props.row.saldo_pendiente) === 0 &&
                        props.row.fecha_liquidado &&
                        props.row.n_pago > 1
                      "
                    >
                      <q-badge
                        color="grey-3"
                        text-color="grey-8"
                        class="q-pa-xs"
                      >
                        Auto-liquidado
                      </q-badge>
                    </div>
                    <div
                      v-else-if="
                        props.row.monto_pagado !== null &&
                        Number(props.row.monto_pagado) > 0
                      "
                    >
                      <q-badge
                        color="orange-1"
                        text-color="orange-9"
                        class="q-pa-xs"
                      >
                        Sin comprobante
                      </q-badge>
                    </div>
                    <div v-else class="text-grey-5">—</div>
                  </q-td>
                </template>

                <!-- Saldo Pendiente -->
                <template v-slot:body-cell-saldo_pendiente="props">
                  <q-td :props="props" align="right">
                    <div
                      v-if="
                        props.row.saldo_pendiente !== null &&
                        props.row.saldo_pendiente !== undefined
                      "
                      class="text-weight-bold text-dark"
                    >
                      {{ formatCurrency(props.row.saldo_pendiente) }}
                    </div>
                    <div v-else class="text-grey-5">—</div>
                  </q-td>
                </template>

                <!-- Estatus -->
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

                <!-- Fecha Liquidado -->
                <template v-slot:body-cell-fecha_liquidado="props">
                  <q-td :props="props">
                    <div
                      v-if="props.row.fecha_liquidado"
                      class="text-weight-medium text-positive flex items-center q-gutter-xs"
                    >
                      <q-icon name="check_circle" size="xs" color="positive" />
                      <span>{{
                        formatFechaLarga(props.row.fecha_liquidado)
                      }}</span>
                    </div>
                    <div v-else class="text-grey-5">—</div>
                  </q-td>
                </template>

                <!-- Registrado Por -->
                <template v-slot:body-cell-actualizado_por="props">
                  <q-td :props="props">
                    <div
                      v-if="props.row.actualizado_por?.nombreCompleto"
                      class="text-weight-medium text-grey-9 flex items-center q-gutter-xs"
                    >
                      <q-icon name="person" size="xs" color="grey-7" />
                      <span>{{
                        props.row.actualizado_por.nombreCompleto
                      }}</span>
                    </div>
                    <div v-else class="text-grey-5">—</div>
                  </q-td>
                </template>

                <!-- Validado Por -->
                <template v-slot:body-cell-validado_por="props">
                  <q-td :props="props">
                    <div
                      v-if="props.row.validado_por?.nombreCompleto"
                      class="text-weight-medium text-positive flex items-center q-gutter-xs"
                    >
                      <q-icon name="verified" size="xs" color="positive" />
                      <span>{{ props.row.validado_por.nombreCompleto }}</span>
                    </div>
                    <div
                      v-else-if="
                        (props.row.monto_pagado !== null &&
                          Number(props.row.monto_pagado) > 0) ||
                        Boolean(props.row.fecha_liquidado)
                      "
                    >
                      <q-badge
                        color="amber-1"
                        text-color="amber-9"
                        class="text-weight-medium q-pa-xs"
                      >
                        <q-icon name="pending" size="xs" class="q-mr-xs" />
                        Pendiente de validar
                      </q-badge>
                    </div>
                    <div v-else class="text-grey-5">—</div>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>

          <!-- Tarjeta 5: Documentación Adjunta -->
          <CreditoDocumentacionCard
            :documentacion="credito.documentacion"
            :archivos="credito.archivos"
          />

          <!-- Tarjeta 6: Justificación / Motivo y Notas -->
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
                <span>Motivo y Observaciones</span>
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
        </div>
      </q-card-section>

      <q-separator />

      <!-- Acciones del Modal -->
      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>

    <!-- Modal de Previsualización de PDF del Comprobante -->
    <q-dialog v-model="modalPdf" full-width full-height>
      <q-card class="column no-wrap" style="height: 100%">
        <q-card-section
          class="bg-primary text-white row items-center justify-between q-py-sm"
        >
          <div
            class="text-subtitle1 text-weight-bold flex items-center q-gutter-sm"
          >
            <q-icon name="picture_as_pdf" />
            <span>
              {{
                docPdfSeleccionado?.documento?.nombre ||
                docPdfSeleccionado?.nombre ||
                "Comprobante de Pago"
              }}
            </span>
          </div>
          <div class="row items-center q-gutter-xs">
            <q-btn
              flat
              dense
              icon="open_in_new"
              label="Abrir en pestaña"
              @click="abrirPdfExterno(docPdfSeleccionado)"
            />
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="col q-pa-none bg-grey-3">
          <iframe
            v-if="docPdfSeleccionadoUrl"
            :src="docPdfSeleccionadoUrl"
            style="width: 100%; height: 100%; border: none"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  formatPhoneNumber,
  formatCurrency,
  formatFechaLarga,
} from "src/boot/format";
import CreditoDocumentacionCard from "./CreditoDocumentacionCard.vue";

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  credito: {
    type: Object,
    default: null,
  },
});

defineEmits(["update:modelValue"]);

const columnsPagos = [
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
    name: "monto_pagado",
    label: "Monto Pagado",
    field: (row) => row.monto_pagado,
    align: "right",
  },
  {
    name: "comprobante",
    label: "Comprobante",
    field: (row) => row.documento?.path || "-",
    align: "center",
  },
  {
    name: "saldo_pendiente",
    label: "Saldo Pendiente",
    field: (row) => row.saldo_pendiente,
    align: "right",
    sortable: true,
  },
  {
    name: "estatus",
    label: "Estatus",
    field: (row) => row.estatus?.nombre || row.estatus || "Pendiente",
    align: "center",
  },
  {
    name: "fecha_liquidado",
    label: "Fecha Liquidado",
    field: (row) => row.fecha_liquidado || "",
    align: "left",
  },
  {
    name: "actualizado_por",
    label: "Registrado Por",
    field: (row) => row.actualizado_por?.nombreCompleto || "-",
    align: "left",
  },
  {
    name: "validado_por",
    label: "Validado Por",
    field: (row) => row.validado_por?.nombreCompleto || "-",
    align: "left",
  },
];

// --- Previsualización de PDF del Comprobante ---
const modalPdf = ref(false);
const docPdfSeleccionado = ref(null);

const docPdfSeleccionadoUrl = computed(() => {
  if (!docPdfSeleccionado.value) return null;
  return (
    docPdfSeleccionado.value.realpath ||
    docPdfSeleccionado.value.url ||
    docPdfSeleccionado.value.base64 ||
    null
  );
});

const previsualizarPdf = (doc) => {
  if (!doc) return;
  docPdfSeleccionado.value = doc;
  modalPdf.value = true;
};

const abrirPdfExterno = (doc) => {
  if (!doc) return;
  const url = doc.realpath || doc.url || doc.base64;
  if (url) {
    window.open(url, "_blank");
  }
};
</script>
