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
            <div
              class="text-subtitle1 text-weight-bold flex items-center q-gutter-xs"
            >
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
              Cliente:
              <strong>{{
                credito?.cliente?.nombre || "No especificado"
              }}</strong>
              <span v-if="credito?.linea?.name">
                | Línea: {{ credito.linea.name }}</span
              >
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
            <div
              class="text-subtitle1 text-weight-bold text-teal-9 flex items-center q-gutter-xs"
            >
              <q-icon name="format_list_numbered" />
              <span
                >Programación Detallada de Pagos ({{ listaPagos.length }})</span
              >
            </div>
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
                    Number(credito?.valor_enganche || credito?.anticipo) > 0)
                    ? 'orange-9'
                    : 'dark'
                "
                text-color="white"
                class="text-weight-bold q-px-sm"
              >
                {{ props.row.etiqueta }}
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
                    formatFechaLarga(props.row.fecha_a_pagar || props.row.fecha)
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

          <!-- Columna: Monto Pagado -->
          <template v-slot:body-cell-monto_pagado="props">
            <q-td :props="props" align="right">
              <!-- Caso 1: Pagos cubiertos por liquidación anticipada en un pago anterior -->
              <div
                v-if="
                  Number(props.row.saldo_pendiente) === 0 &&
                  (props.row._edit_monto_pagado === 0 ||
                    props.row.monto_pagado === 0) &&
                  props.row.fecha_liquidado &&
                  props.row.n_pago > 1
                "
                class="row items-center justify-end q-gutter-xs"
              >
                <q-badge
                  color="green-1"
                  text-color="green-9"
                  class="text-weight-bold q-pa-xs"
                >
                  <q-icon name="check_circle" size="xs" class="q-mr-xs" />
                  Liquidado anticipadamente
                </q-badge>
              </div>

              <!-- Caso 2: Pago registrado con monto -->
              <div
                v-else-if="
                  props.row.monto_pagado !== null &&
                  props.row.monto_pagado !== undefined &&
                  Number(props.row.monto_pagado) > 0
                "
                class="row items-center justify-end q-gutter-xs"
              >
                <span class="text-weight-bolder text-positive text-subtitle2">
                  {{ formatCurrency(props.row.monto_pagado) }}
                </span>
                <q-btn
                  flat
                  round
                  dense
                  icon="edit"
                  color="grey-8"
                  size="sm"
                  @click="abrirModalRegistroPago(props.row)"
                >
                  <q-tooltip>Modificar monto o comprobante</q-tooltip>
                </q-btn>
              </div>

              <!-- Caso 3: Pago pendiente pero disponible para registrar -->
              <div
                v-else-if="
                  props.row.saldo_pendiente !== null &&
                  props.row.saldo_pendiente !== undefined
                "
                class="row items-center justify-end q-gutter-xs"
              >
                <q-btn
                  dense
                  unelevated
                  color="teal-8"
                  icon="add_card"
                  label="Registrar Pago"
                  class="text-weight-bold"
                  @click="abrirModalRegistroPago(props.row)"
                >
                  <q-tooltip>Registrar pago y subir comprobante PDF</q-tooltip>
                </q-btn>
              </div>

              <!-- Caso 4: Pago bloqueado (pendiente anterior) -->
              <div v-else class="text-grey-5">—</div>
            </q-td>
          </template>

          <!-- Columna: Comprobante / Evidencia PDF -->
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
                <q-badge color="grey-3" text-color="grey-8" class="q-pa-xs">
                  Auto-liquidado
                </q-badge>
              </div>
              <div
                v-else-if="
                  props.row.monto_pagado !== null &&
                  Number(props.row.monto_pagado) > 0
                "
              >
                <q-badge color="orange-1" text-color="orange-9" class="q-pa-xs">
                  Sin comprobante
                </q-badge>
              </div>
              <div v-else class="text-grey-5">—</div>
            </q-td>
          </template>

          <!-- Columna: Saldo Pendiente -->
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

          <!-- Columna: Actualizado Por -->
          <template v-slot:body-cell-actualizado_por="props">
            <q-td :props="props" align="left">
              <div
                v-if="props.row.actualizado_por?.nombreCompleto"
                class="row items-center q-gutter-xs"
              >
                <q-icon name="person" size="xs" color="grey-7" />
                <span class="text-weight-medium text-dark">
                  {{ props.row.actualizado_por.nombreCompleto }}
                </span>
              </div>
              <div v-else class="text-grey-5">—</div>
            </q-td>
          </template>

          <!-- Columna: Validado Por -->
          <template v-slot:body-cell-validado_por="props">
            <q-td :props="props" align="left">
              <!-- Caso 1: Pago ya validado -->
              <div
                v-if="props.row.validado_por || props.row.validated_by"
                class="row items-center q-gutter-xs"
              >
                <q-icon name="verified" color="positive" size="sm">
                  <q-tooltip>Pago validado</q-tooltip>
                </q-icon>
                <span class="text-weight-bold text-dark">
                  {{ props.row.validado_por?.nombreCompleto || "Validado" }}
                </span>
              </div>

              <!-- Caso 2: Pago registrado / liquidado pero aún no validado -->
              <div
                v-else-if="
                  (props.row.monto_pagado !== null &&
                    Number(props.row.monto_pagado) > 0) ||
                  Boolean(props.row.fecha_liquidado)
                "
                class="row items-center q-gutter-xs"
              >
                <!-- Si es usuario con rol Crédito o Admin, mostrar botón de validar -->
                <q-btn
                  v-if="esUsuarioCredito"
                  dense
                  outline
                  color="teal-8"
                  icon="fact_check"
                  label="Validar"
                  class="text-weight-bold"
                  :loading="props.row._validating"
                  :disable="props.row._validating || props.row._saving"
                  @click="abrirModalValidar(props.row)"
                >
                  <q-tooltip>Validar este pago</q-tooltip>
                </q-btn>

                <!-- Si es otro usuario sin rol Crédito -->
                <q-badge
                  v-else
                  color="amber-1"
                  text-color="amber-9"
                  class="text-weight-medium q-pa-xs"
                >
                  <q-icon name="pending" size="xs" class="q-mr-xs" />
                  Pendiente de validar
                </q-badge>
              </div>

              <!-- Caso 3: Pago no registrado -->
              <div v-else class="text-grey-5">—</div>
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

    <!-- Modal para Registrar / Modificar Pago con Evidencia PDF Obligatoria -->
    <q-dialog
      v-model="modalRegistroPago"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card
        style="min-width: 420px; max-width: 520px; width: 100%"
        class="rounded-borders"
      >
        <q-card-section
          class="bg-teal-8 text-white row items-center justify-between q-py-sm"
        >
          <div
            class="text-subtitle1 text-weight-bold flex items-center q-gutter-xs"
          >
            <q-icon name="payments" size="sm" />
            <span>
              {{
                pagoSeleccionado?.monto_pagado
                  ? "Modificar Pago"
                  : "Registrar Pago"
              }}
              -
              {{
                pagoSeleccionado?.etiqueta ||
                `Pago #${pagoSeleccionado?.n_pago}`
              }}
            </span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
            :disable="savingPago"
          />
        </q-card-section>

        <q-card-section class="q-pa-md q-gutter-y-md">
          <!-- Resumen de la cuota -->
          <div class="bg-grey-2 q-pa-sm rounded-borders text-body2">
            <div class="row justify-between q-mb-xs">
              <span class="text-grey-7">Fecha programada:</span>
              <span class="text-weight-bold">
                {{
                  formatFechaLarga(
                    pagoSeleccionado?.fecha_a_pagar || pagoSeleccionado?.fecha
                  )
                }}
              </span>
            </div>
            <div class="row justify-between">
              <span class="text-grey-7">Saldo Pendiente:</span>
              <span class="text-weight-bolder text-primary text-subtitle2">
                {{ formatCurrency(pagoSeleccionado?.saldo_pendiente || 0) }}
              </span>
            </div>
          </div>

          <!-- Monto a Pagar -->
          <div>
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
              Monto a Pagar <span class="text-negative">*</span>
            </div>
            <q-input
              dense
              outlined
              type="number"
              prefix="$"
              v-model.number="formPago.monto"
              placeholder="0.00"
              :rules="[
                (val) =>
                  (val !== null &&
                    val !== '' &&
                    !isNaN(val) &&
                    Number(val) > 0) ||
                  'Ingrese un monto válido mayor a 0',
                (val) =>
                  Number(val) <=
                    Number(pagoSeleccionado?.saldo_pendiente || 0) ||
                  'El monto no puede exceder el saldo pendiente',
              ]"
            />
          </div>

          <!-- Archivo Comprobante PDF -->
          <div>
            <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
              Comprobante / Evidencia de Pago (PDF)
              <span class="text-negative" v-if="!pagoSeleccionado?.document_id"
                >*</span
              >
            </div>
            <q-file
              dense
              outlined
              v-model="formPago.archivo"
              label="Seleccionar archivo PDF"
              accept=".pdf"
              max-file-size="15728640"
            >
              <template v-slot:prepend>
                <q-icon name="picture_as_pdf" color="red-8" />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="formPago.archivo"
                  name="close"
                  @click.stop="formPago.archivo = null"
                  class="cursor-pointer"
                />
              </template>
            </q-file>
            <div
              v-if="
                pagoSeleccionado?.documento?.realpath ||
                pagoSeleccionado?.document_id
              "
              class="text-caption text-teal-8 q-mt-xs flex items-center q-gutter-xs cursor-pointer"
              @click="previsualizarPdf(pagoSeleccionado.documento)"
            >
              <q-icon name="check_circle" size="xs" color="positive" />
              <span
                >Ya cuenta con evidencia registrada. Clic aquí para verla.</span
              >
            </div>
          </div>

          <div class="text-caption text-grey-6">
            <q-icon name="info" size="xs" class="q-mr-xs" />
            La evidencia se registrará automáticamente como
            <strong>
              {{
                (pagoSeleccionado?.etiqueta &&
                  pagoSeleccionado.etiqueta
                    .toLowerCase()
                    .includes("enganche")) ||
                (pagoSeleccionado?.n_pago === 1 &&
                  Number(credito?.valor_enganche || credito?.anticipo) > 0)
                  ? "Evidencia enganche"
                  : "Evidencia pago"
              }}
            </strong>
            en los documentos del crédito.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md bg-grey-1 q-gutter-sm">
          <q-btn
            flat
            label="Cancelar"
            color="grey-8"
            v-close-popup
            :disable="savingPago"
          />
          <q-btn
            unelevated
            label="Guardar Pago y Evidencia"
            color="teal-8"
            icon="save"
            :loading="savingPago"
            @click="guardarPagoConEvidencia"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Confirmación de Validación de Pago -->
    <q-dialog
      v-model="modalValidar"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card
        style="min-width: 380px; max-width: 480px; width: 100%"
        class="rounded-borders"
      >
        <q-card-section
          class="bg-teal-8 text-white row items-center justify-between q-py-sm"
        >
          <div
            class="text-subtitle1 text-weight-bold flex items-center q-gutter-xs"
          >
            <q-icon name="verified" size="sm" />
            <span>Validar Pago de Crédito</span>
          </div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="text-body1 q-mb-md">
            ¿Confirmas que deseas <strong>validar</strong> el siguiente pago?
          </div>

          <div
            class="bg-grey-2 q-pa-md rounded-borders q-gutter-y-xs text-body2"
          >
            <div class="row justify-between">
              <span class="text-grey-7">Concepto / Cuota:</span>
              <span class="text-weight-bold">
                {{ pagoAValidar?.etiqueta || `Pago #${pagoAValidar?.n_pago}` }}
              </span>
            </div>
            <div class="row justify-between">
              <span class="text-grey-7">Monto Pagado:</span>
              <span class="text-weight-bold text-positive text-subtitle2">
                {{
                  formatCurrency(
                    pagoAValidar?.monto_pagado ??
                      pagoAValidar?._edit_monto_pagado ??
                      0
                  )
                }}
              </span>
            </div>
            <div
              class="row justify-between"
              v-if="pagoAValidar?.fecha_liquidado"
            >
              <span class="text-grey-7">Fecha de Liquidación:</span>
              <span class="text-weight-medium">{{
                formatFechaLarga(pagoAValidar.fecha_liquidado)
              }}</span>
            </div>
            <div
              class="row justify-between"
              v-if="pagoAValidar?.actualizado_por?.nombreCompleto"
            >
              <span class="text-grey-7">Registrado por:</span>
              <span class="text-weight-medium">{{
                pagoAValidar.actualizado_por.nombreCompleto
              }}</span>
            </div>

            <!-- Visualizar Comprobante de Pago si existe -->
            <div
              class="row justify-between items-center q-pt-xs border-top"
              v-if="
                pagoAValidar?.documento?.realpath ||
                pagoAValidar?.documento?.path ||
                pagoAValidar?.document_id
              "
            >
              <span class="text-grey-7">Comprobante adjunto:</span>
              <q-btn
                dense
                flat
                color="red-8"
                icon="picture_as_pdf"
                label="Ver Recibo PDF"
                class="text-weight-bold"
                @click="previsualizarPdf(pagoAValidar.documento)"
              >
                <q-tooltip>Ver comprobante PDF</q-tooltip>
              </q-btn>
            </div>
            <div
              class="row justify-between items-center q-pt-xs border-top"
              v-else
            >
              <span class="text-grey-7">Comprobante:</span>
              <span class="text-grey-6 text-caption"
                >Sin comprobante adjunto</span
              >
            </div>
          </div>

          <div class="text-caption text-grey-6 q-mt-sm">
            <q-icon name="info" size="xs" class="q-mr-xs" />
            Esta acción registrará tu usuario como validador en el historial del
            crédito.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md bg-grey-1 q-gutter-sm">
          <q-btn
            flat
            label="Cancelar"
            color="grey-8"
            v-close-popup
            :disable="pagoAValidar?._validating"
          />
          <q-btn
            unelevated
            label="Validar Pago"
            color="teal-8"
            icon="verified"
            :loading="pagoAValidar?._validating"
            @click="ejecutarValidacion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Previsualización de PDF del Comprobante -->
    <q-dialog v-model="modalPdf" full-width full-height>
      <q-card class="column no-wrap" style="height: 100%">
        <q-card-section
          class="bg-teal-8 text-white row items-center justify-between q-py-sm"
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
import { ref, computed, watch } from "vue";
import { formatCurrency, formatFechaLarga } from "src/boot/format";
import { show_notify } from "src/boot/functions";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/auth";

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

const authStore = useAuthStore();
const esUsuarioCredito = computed(() => {
  const roles = authStore.authUser?.roles || [];
  return roles.some((r) => r.name === "Credito" || r.name === "Admin");
});

const filter = ref("");
const listaPagos = ref([]);

const columns = [
  {
    name: "n_pago",
    label: "Pago",
    field: (row) => row.etiqueta || "-",
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
    label: "Monto Pagado",
    field: (row) => row.monto_pagado ?? 0,
    align: "right",
    sortable: true,
  },
  {
    name: "comprobante",
    label: "Comprobante / Evidencia",
    field: (row) => row.documento?.path || "-",
    align: "center",
    sortable: false,
  },
  {
    name: "saldo_pendiente",
    label: "Saldo Pendiente",
    field: (row) => row.saldo_pendiente ?? null,
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
    name: "actualizado_por",
    label: "Registrado Por",
    field: (row) => row.actualizado_por?.nombreCompleto || "-",
    align: "left",
    sortable: true,
  },
  {
    name: "validado_por",
    label: "Validado Por",
    field: (row) => row.validado_por?.nombreCompleto || "-",
    align: "left",
    sortable: true,
  },
];

const sincronizarPagos = () => {
  if (props.credito?.pagos && Array.isArray(props.credito.pagos)) {
    listaPagos.value = props.credito.pagos.map((p) => ({
      ...p,
      _edit_monto_pagado:
        p.monto_pagado !== null && p.monto_pagado !== undefined
          ? Number(p.monto_pagado)
          : null,
      _saving: false,
      _validating: false,
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
    const val = Number(curr.monto_pagado ?? curr._edit_monto_pagado ?? 0);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
});

const pagosLiquidadosCount = computed(() => {
  return listaPagos.value.filter(
    (p) => Boolean(p.fecha_liquidado) || Number(p.monto_pagado) > 0
  ).length;
});

// --- Registro y Modificación de Pago con Evidencia PDF ---
const modalRegistroPago = ref(false);
const pagoSeleccionado = ref(null);
const savingPago = ref(false);
const formPago = ref({
  monto: null,
  archivo: null,
});

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const abrirModalRegistroPago = (pago) => {
  pagoSeleccionado.value = pago;
  formPago.value = {
    monto:
      pago.monto_pagado !== null && pago.monto_pagado !== undefined
        ? Number(pago.monto_pagado)
        : Number(pago.saldo_pendiente || 0),
    archivo: null,
  };
  modalRegistroPago.value = true;
};

const guardarPagoConEvidencia = async () => {
  if (savingPago.value) return;

  const pago = pagoSeleccionado.value;
  if (!pago) return;

  const monto = Number(formPago.value.monto);
  const saldoMax = Number(pago.saldo_pendiente || 0);

  // 1. Validaciones de monto
  if (isNaN(monto) || monto <= 0) {
    show_notify(
      "Debe ingresar un monto a pagar válido mayor a $0.00.",
      "warning",
      "warning"
    );
    return;
  }

  if (monto > saldoMax) {
    show_notify(
      `El monto a pagar (${formatCurrency(
        monto
      )}) no puede ser mayor al saldo pendiente disponible (${formatCurrency(
        saldoMax
      )}).`,
      "warning",
      "warning"
    );
    return;
  }

  // 2. Validación de archivo PDF obligatorio
  if (!pago.document_id && !formPago.value.archivo) {
    show_notify(
      "El comprobante o evidencia de pago en formato PDF es obligatorio.",
      "warning",
      "warning"
    );
    return;
  }

  savingPago.value = true;

  try {
    let archivoData = null;
    if (formPago.value.archivo) {
      const base64String = await fileToBase64(formPago.value.archivo);
      archivoData = {
        base64: base64String,
        nombre: formPago.value.archivo.name,
        extension: "pdf",
      };
    }

    const payload = {
      monto_pagado: monto,
      solicitud_id: pago.solicitud_id || props.credito?.id,
      archivo: archivoData,
    };

    const res = await api.put(
      `/api/intranet/creditoInternoPagos/${pago.id}`,
      payload
    );

    if (res?.data?.data) {
      pago.monto_pagado = res.data.data.monto_pagado;
      pago.document_id = res.data.data.document_id;
      pago.documento = res.data.data.documento;
      pago.saldo_pendiente = res.data.data.saldo_pendiente;
      pago.fecha_liquidado = res.data.data.fecha_liquidado;
      pago.estatus = res.data.data.estatus;
      pago.actualizado_por = res.data.data.actualizado_por;
      pago.validado_por = res.data.data.validado_por;
    }

    show_notify(
      "Pago registrado y comprobante adjuntado correctamente",
      "check",
      "positive"
    );
    modalRegistroPago.value = false;
    emit("updated");
  } catch (error) {
    console.error("Error al registrar pago con comprobante:", error);
    show_notify(
      error?.response?.data?.message || "Error al registrar el pago",
      "error",
      "negative"
    );
  } finally {
    savingPago.value = false;
  }
};

// --- Validación por Rol Crédito ---
const modalValidar = ref(false);
const pagoAValidar = ref(null);

const abrirModalValidar = (pago) => {
  pagoAValidar.value = pago;
  modalValidar.value = true;
};

const ejecutarValidacion = async () => {
  if (!pagoAValidar.value || pagoAValidar.value._validating) return;

  const pago = pagoAValidar.value;
  pago._validating = true;

  try {
    const res = await api.post(
      `/api/intranet/creditoInternoPagos/${pago.id}/validar`
    );

    if (res?.data?.data) {
      pago.validated_by = res.data.data.validated_by;
      pago.validado_por = res.data.data.validado_por;
    }

    show_notify(
      "Pago validado correctamente por el departamento de Crédito",
      "check",
      "positive"
    );
    modalValidar.value = false;
    emit("updated");
  } catch (error) {
    console.error("Error al validar el pago:", error);
    show_notify(
      error?.response?.data?.message || "Error al validar el pago",
      "error",
      "negative"
    );
  } finally {
    pago._validating = false;
  }
};

// --- Previsualización de Comprobante PDF ---
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

<style scoped>
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
</style>
