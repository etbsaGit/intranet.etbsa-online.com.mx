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
                        props.row.es_anticipo ||
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
                      {{
                        props.row.es_anticipo ||
                        props.row.etiqueta === "Enganche" ||
                        (props.row.n_pago === 1 &&
                          Number(credito.valor_enganche || credito.anticipo) >
                            0)
                          ? "Pago 1 (Enganche)"
                          : props.row.etiqueta || `Pago #${props.row.n_pago}`
                      }}
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
  </q-dialog>
</template>

<script setup>
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
];
</script>
