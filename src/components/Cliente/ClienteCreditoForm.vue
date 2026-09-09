<template>
  <q-form ref="myForm" greedy>
    <!-- Resumen de información del cliente -->
    <q-card flat bordered class="q-mb-md bg-grey-1">
      <q-card-section class="q-pb-none">
        <div
          class="text-subtitle1 text-weight-bold text-primary flex items-center q-gutter-xs"
        >
          <q-icon name="person" size="sm" />
          <span>Información del Cliente</span>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-6">
            <q-item dense class="q-pa-none">
              <q-item-section avatar style="min-width: 32px">
                <q-icon name="badge" color="primary" size="xs" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Nombre / Razón Social</q-item-label>
                <q-item-label class="text-weight-medium">
                  {{ cliente?.nombre || "No especificado" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-md-3">
            <q-item dense class="q-pa-none">
              <q-item-section avatar style="min-width: 32px">
                <q-icon name="fa-solid fa-id-card" color="indigo" size="xs" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>RFC</q-item-label>
                <q-item-label class="text-weight-medium">
                  {{ cliente?.rfc || "No especificado" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-md-3">
            <q-item dense class="q-pa-none">
              <q-item-section avatar style="min-width: 32px">
                <q-icon name="tag" color="secondary" size="xs" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption># Equip / Tipo</q-item-label>
                <q-item-label class="text-weight-medium">
                  {{ cliente?.equip ? `#${cliente.equip}` : "" }}
                  {{ cliente?.tipo ? `(${cliente.tipo})` : "" }}
                  {{ !cliente?.equip && !cliente?.tipo ? "N/A" : "" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-md-4">
            <q-item dense class="q-pa-none">
              <q-item-section avatar style="min-width: 32px">
                <q-icon name="phone" color="positive" size="xs" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Teléfono</q-item-label>
                <q-item-label class="text-weight-medium">
                  {{
                    cliente?.telefono
                      ? formatPhoneNumber(cliente.telefono)
                      : "Sin teléfono"
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-md-4">
            <q-item dense class="q-pa-none">
              <q-item-section avatar style="min-width: 32px">
                <q-icon name="email" color="negative" size="xs" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Email</q-item-label>
                <q-item-label class="text-weight-medium ellipsis">
                  {{ cliente?.email || "Sin email" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-md-4">
            <q-item dense class="q-pa-none">
              <q-item-section avatar style="min-width: 32px">
                <q-icon name="place" color="orange-8" size="xs" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Ubicación</q-item-label>
                <q-item-label class="text-weight-medium">
                  {{ formatLocation(cliente) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-separator class="q-my-sm" />

    <q-item>
      <q-item-section>
        <q-item-label caption align="center">
          -Datos de la Solicitud de Crédito-
        </q-item-label>
      </q-item-section>
    </q-item>

    <!-- Fila 1: Asesor, Sucursal, Notificar a -->
    <q-item>
      <q-item-section class="col-12 col-md-4">
        <q-select
          v-model="formCredito.asesor_id"
          :options="filterEmpleados"
          label="Asesor"
          option-value="id"
          option-label="nombreCompleto"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          options-dense
          use-input
          input-debounce="0"
          @filter="filterEmpleadosFn"
          :clearable="puedeSeleccionarAsesor"
          :disable="!puedeSeleccionarAsesor"
          :rules="[(val) => !!val || 'El asesor es obligatorio']"
        />
      </q-item-section>

      <q-item-section class="col-12 col-md-4">
        <q-select
          disable
          v-model="formCredito.sucursal_id"
          :options="crud.items.sucursales || []"
          label="Sucursal"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          options-dense
          :rules="[(val) => !!val || 'La sucursal es obligatoria']"
        />
      </q-item-section>

      <q-item-section class="col-12 col-md-4">
        <q-select
          disable
          v-model="formCredito.notificado_id"
          :options="crud.items.gerentes || []"
          label="Notificar a (Gerente Territorial)"
          option-value="id"
          option-label="nombreCompleto"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          options-dense
          clearable
          :rules="[(val) => !!val || 'El empleado a notificar es obligatorio']"
        />
      </q-item-section>
    </q-item>

    <!-- Fila 2: Línea de crédito, Tipo de anticipo -->
    <q-item>
      <q-item-section class="col-12 col-md-6">
        <q-select
          v-model="formCredito.linea_id"
          :options="crud.items.creditoLineas || []"
          label="Línea de crédito"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          options-dense
          clearable
          :rules="[(val) => !!val || 'La línea de crédito es obligatoria']"
        />
      </q-item-section>

      <q-item-section class="col-12 col-md-6">
        <q-select
          v-model="formCredito.tipo_enganche_id"
          :options="tipoEngancheOptions"
          label="Tipo de Enganche"
          option-value="id"
          option-label="nombre"
          emit-value
          map-options
          filled
          dense
          options-dense
          transition-show="jump-up"
          transition-hide="jump-up"
          :rules="[(val) => !!val || 'El tipo de enganche es obligatorio']"
        />
      </q-item-section>
    </q-item>

    <!-- Fila 3: Monto solicitado, Anticipo -->
    <q-item>
      <q-item-section class="col-12 col-md-6">
        <q-input
          v-model="formCredito.monto_solicitado"
          filled
          dense
          label="Monto solicitado"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          lazy-rules
          :rules="[
            (val) => !!val || 'El monto solicitado es obligatorio',
            (val) => Number(val) > 0 || 'El monto debe ser mayor a 0',
          ]"
        />
      </q-item-section>

      <q-item-section class="col-12 col-md-6">
        <q-input
          v-model="formCredito.valor_enganche"
          filled
          dense
          :label="anticipoLabel"
          :disable="esSinAnticipo"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          lazy-rules
        />
        <!-- Nota informativa para Servicio si el anticipo es menor al 50% -->
        <div
          v-if="mostrarAlertaAnticipoServicio"
          class="q-mt-xs q-pa-xs rounded-borders bg-orange-1 text-orange-9 text-caption row items-center no-wrap"
          style="border: 1px solid #ffb74d"
        >
          <q-icon
            name="warning_amber"
            color="orange-9"
            size="18px"
            class="q-mr-xs flex-shrink-0"
          />
          <div>
            <span>
              Nota: Para la línea de <strong>Servicio</strong> lo recomendable
              sería dar un <strong>50%</strong> de anticipo<span
                v-if="montoSolicitadoNum > 0"
              >
                ({{ formatCurrency(anticipoMinimoRecomendado) }})</span
              >.
            </span>
          </div>
        </div>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section class="col-12">
        <q-input
          v-model.number="formCredito.numero_pagos"
          type="number"
          min="1"
          max="120"
          filled
          dense
          label="Número de pagos"
          hint="Cantidad total de pagos en los que se dividirá el crédito"
          :rules="[
            (val) => !!val || 'El número de pagos es obligatorio',
            (val) => Number(val) >= 1 || 'Debe ser al menos 1 pago',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="payments" />
          </template>
        </q-input>
      </q-item-section>
    </q-item>

    <!-- Lista enumerada dinámica de fechas de pago -->
    <template v-if="formCredito.pagos && formCredito.pagos.length > 0">
      <q-separator class="q-my-md" />

      <q-item>
        <q-item-section>
          <q-item-label
            caption
            align="center"
            class="text-primary text-weight-bold"
          >
            -Programación de Fechas de Pago ({{ formCredito.pagos.length }}
            {{ formCredito.pagos.length === 1 ? "Registro" : "Registros" }})-
          </q-item-label>
        </q-item-section>
      </q-item>

      <div class="row q-col-gutter-sm q-px-md q-pb-sm">
        <div
          v-for="(pago, index) in formCredito.pagos"
          :key="index"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card
            flat
            bordered
            :class="
              pago.es_anticipo ? 'q-pa-xs bg-amber-1' : 'q-pa-xs bg-grey-1'
            "
          >
            <q-item dense class="q-pa-xs items-center">
              <q-item-section avatar style="min-width: 90px">
                <q-chip
                  :color="pago.es_anticipo ? 'amber-9' : 'primary'"
                  text-color="white"
                  dense
                  class="text-weight-bold q-ma-none"
                  :icon="pago.es_anticipo ? 'savings' : undefined"
                >
                  {{ pago.etiqueta }}
                </q-chip>
              </q-item-section>

              <q-item-section>
                <q-input
                  v-model="pago.fecha"
                  filled
                  dense
                  :label="
                    pago.es_anticipo
                      ? 'Fecha pago de enganche'
                      : 'Fecha de pago'
                  "
                  mask="####-##-##"
                  :rules="[
                    (val) => !!val || 'Fecha obligatoria',
                    (val) =>
                      validateFechaPago ? validateFechaPago(val, index) : true,
                  ]"
                  hide-bottom-space
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          minimal
                          v-model="pago.fecha"
                          mask="YYYY-MM-DD"
                          :options="
                            (d) =>
                              isDateAllowed ? isDateAllowed(d, index) : true
                          "
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Cerrar"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
    </template>

    <q-separator class="q-my-md" />

    <!-- 📎 Sección de Documentación Obligatoria -->
    <q-item>
      <q-item-section>
        <q-item-label
          caption
          align="center"
          class="text-primary text-weight-bold"
        >
          -Documentación Obligatoria del Crédito (Persona
          {{ clienteEsMoral ? "Moral" : "Física"
          }}{{ esEngancheACuenta ? " - A Cuenta" : "" }})-
        </q-item-label>
      </q-item-section>
    </q-item>

    <div
      v-if="listaDocsObligatorios && listaDocsObligatorios.length > 0"
      class="row q-col-gutter-sm q-px-md q-pb-sm"
    >
      <div
        v-for="item in listaDocsObligatorios"
        :key="item.doc_id"
        class="col-12 col-md-6"
      >
        <q-card flat bordered class="rounded-borders bg-white shadow-1">
          <q-card-section class="q-pa-sm">
            <!-- Título del documento y Badge de estado -->
            <div class="row items-center justify-between no-wrap q-mb-xs">
              <div
                class="text-subtitle2 text-weight-bold text-primary flex items-center q-gutter-xs ellipsis"
              >
                <q-icon name="description" size="18px" color="primary" />
                <span class="ellipsis">{{ item.nombre }}</span>
                <span class="text-negative text-weight-bolder">*</span>
              </div>

              <q-badge
                :color="getDocExpedienteInfo(item).color"
                text-color="white"
                class="text-weight-bold q-px-xs"
              >
                <q-icon
                  :name="getDocExpedienteInfo(item).icono"
                  size="xs"
                  class="q-mr-xs"
                />
                {{ getDocExpedienteInfo(item).badgeText }}
              </q-badge>
            </div>

            <!-- Caso 1: Documento vigente en expediente y no se ha seleccionado reemplazar -->
            <template
              v-if="
                getDocExpedienteInfo(item).estado === 'vigente' &&
                !reemplazarDoc[item.doc_id] &&
                !archivosObligatorios[item.doc_id]
              "
            >
              <div
                class="q-pa-xs rounded-borders bg-green-1 text-green-9 text-caption row items-center justify-between no-wrap"
                style="border: 1px solid #a5d6a7"
              >
                <div class="row items-center q-gutter-xs col ellipsis">
                  <q-icon
                    name="check_circle"
                    color="positive"
                    size="18px"
                    class="flex-shrink-0"
                  />
                  <span class="ellipsis">
                    Guardado en expediente
                    <strong
                      v-if="getDocExpedienteInfo(item).doc?.expiration_date"
                    >
                      (Vence:
                      {{ getDocExpedienteInfo(item).doc.expiration_date }})
                    </strong>
                  </span>
                </div>
                <div class="row items-center q-gutter-xs no-wrap flex-shrink-0">
                  <q-btn
                    v-if="getDocExpedienteInfo(item).doc?.realpath"
                    flat
                    dense
                    size="sm"
                    color="primary"
                    icon="visibility"
                    label="Ver"
                    @click="
                      openDocWindow(getDocExpedienteInfo(item).doc.realpath)
                    "
                  >
                    <q-tooltip>Ver documento del expediente</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    size="sm"
                    color="grey-8"
                    icon="swap_horiz"
                    label="Reemplazar"
                    @click="activarReemplazo(item.doc_id)"
                  >
                    <q-tooltip>Subir una versión nueva</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </template>

            <!-- Caso 2: Próximo a caducar, Caducado, No subido o el usuario eligió reemplazar -->
            <template v-else>
              <!-- Mensaje de estado -->
              <div
                v-if="
                  getDocExpedienteInfo(item).estado === 'proximo_a_caducar' ||
                  getDocExpedienteInfo(item).estado === 'caducado'
                "
                class="q-mb-xs q-pa-xs rounded-borders text-caption row items-center justify-between no-wrap"
                :class="
                  getDocExpedienteInfo(item).estado === 'caducado'
                    ? 'bg-red-1 text-negative'
                    : 'bg-orange-1 text-orange-9'
                "
                :style="
                  getDocExpedienteInfo(item).estado === 'caducado'
                    ? 'border: 1px solid #ef9a9a'
                    : 'border: 1px solid #ffcc80'
                "
              >
                <div class="row items-center q-gutter-xs col ellipsis">
                  <q-icon
                    :name="getDocExpedienteInfo(item).icono"
                    size="16px"
                    class="flex-shrink-0"
                  />
                  <span class="ellipsis">{{
                    getDocExpedienteInfo(item).mensaje
                  }}</span>
                </div>
                <q-btn
                  v-if="getDocExpedienteInfo(item).doc?.realpath"
                  flat
                  dense
                  size="xs"
                  color="primary"
                  icon="visibility"
                  label="Ver actual"
                  class="flex-shrink-0"
                  @click="
                    openDocWindow(getDocExpedienteInfo(item).doc.realpath)
                  "
                />
              </div>

              <!-- Selector de Archivo -->
              <div class="row q-col-gutter-xs items-center">
                <div class="col">
                  <q-file
                    v-model="archivosObligatoriosFiles[item.doc_id]"
                    filled
                    dense
                    :label="
                      archivosObligatorios[item.doc_id]
                        ? archivosObligatorios[item.doc_id].nombre
                        : `Seleccionar PDF (${item.nombre})`
                    "
                    accept=".pdf,application/pdf"
                    clearable
                    :rules="[
                      () =>
                        validarDocObligatorio(item) ||
                        `El documento ${item.nombre} es obligatorio`,
                    ]"
                    hide-bottom-space
                    @update:model-value="
                      (file) => onObligatorioFileSelected(file, item)
                    "
                  >
                    <template v-slot:prepend>
                      <q-icon
                        name="picture_as_pdf"
                        :color="
                          archivosObligatorios[item.doc_id]
                            ? 'positive'
                            : 'negative'
                        "
                      />
                    </template>
                  </q-file>
                </div>

                <!-- Botón Cancelar Reemplazo si era vigente -->
                <div
                  v-if="
                    getDocExpedienteInfo(item).estado === 'vigente' &&
                    reemplazarDoc[item.doc_id]
                  "
                  class="col-auto"
                >
                  <q-btn
                    flat
                    dense
                    round
                    color="grey-7"
                    icon="close"
                    @click="cancelarReemplazo(item.doc_id)"
                  >
                    <q-tooltip>Conservar archivo del expediente</q-tooltip>
                  </q-btn>
                </div>
              </div>

              <!-- Campo de fecha de vencimiento si subió archivo nuevo -->
              <div
                v-if="archivosObligatorios[item.doc_id]"
                class="row items-center q-mt-xs"
              >
                <q-input
                  v-model="archivosObligatorios[item.doc_id].expiration_date"
                  filled
                  dense
                  label="Fecha de vencimiento (para expediente)"
                  mask="####-##-##"
                  class="full-width"
                  hide-bottom-space
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          minimal
                          v-model="
                            archivosObligatorios[item.doc_id].expiration_date
                          "
                          mask="YYYY-MM-DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Cerrar"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </template>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-else class="q-px-md q-pb-sm text-caption text-grey-6 text-center">
      No hay documentos obligatorios configurados para esta categoría.
    </div>

    <q-separator class="q-my-sm" />

    <!-- 📎 Sección de Documentación Adicional (Opcional) -->
    <q-item>
      <q-item-section>
        <q-item-label
          caption
          align="center"
          class="text-grey-8 text-weight-bold"
        >
          -Documentación Adicional (Opcional)-
        </q-item-label>
      </q-item-section>
    </q-item>

    <div class="row q-col-gutter-sm q-px-md q-pb-sm items-center">
      <!-- Droplist de Tipos de Documento -->
      <div class="col-12 col-md-5">
        <q-select
          v-model="tempDoc.tipo"
          :options="tiposDocumentosOpcionales"
          label="Tipo de documento adicional"
          filled
          dense
          options-dense
          clearable
        />
      </div>

      <!-- Selector de Archivo (Solo PDF) -->
      <div class="col-12 col-md-5">
        <q-file
          v-model="tempDoc.file"
          filled
          dense
          label="Seleccionar archivo (Solo PDF)"
          accept=".pdf,application/pdf"
          clearable
          @update:model-value="onFileSelected"
        >
          <template v-slot:prepend>
            <q-icon name="picture_as_pdf" color="red-7" />
          </template>
        </q-file>
      </div>

      <!-- Botón Agregar Documento -->
      <div class="col-12 col-md-2 text-center">
        <q-btn
          label="Adjuntar"
          icon="add"
          color="primary"
          dense
          class="full-width q-py-xs"
          :disable="!tempDoc.tipo || !tempDoc.base64"
          @click="agregarArchivoOpcional"
        />
      </div>
    </div>

    <!-- Lista de Archivos Opcionales Adjuntos -->
    <div
      v-if="archivosOpcionales && archivosOpcionales.length > 0"
      class="q-px-md q-pb-sm"
    >
      <q-list bordered separator class="rounded-borders bg-white">
        <q-item
          v-for="(arch, idx) in archivosOpcionales"
          :key="idx"
          dense
          class="q-py-xs"
        >
          <q-item-section avatar style="min-width: 36px">
            <q-icon name="picture_as_pdf" color="red-7" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold text-primary">
              {{ arch.tipo }}
              <q-badge color="grey-6" class="q-ml-xs">Opcional</q-badge>
            </q-item-label>
            <q-item-label caption class="text-grey-8">
              {{ arch.nombre }}
              <span v-if="arch.size" class="text-grey-6"
                >({{ arch.size }})</span
              >
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              @click="eliminarArchivoOpcional(idx)"
            >
              <q-tooltip>Eliminar documento</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-separator class="q-my-sm" />

    <q-item>
      <q-item-section>
        <q-input
          v-model="formCredito.motivo"
          filled
          dense
          type="textarea"
          rows="2"
          label="Justificación / Motivo del crédito"
          hint
          :rules="[
            (val) =>
              (val && val.length > 0) || 'La justificación es obligatoria',
          ]"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input
          v-model="formCredito.notas"
          filled
          dense
          type="textarea"
          rows="2"
          label="Notas u observaciones adicionales (opcional)"
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { formatPhoneNumber, formatCurrency } from "src/boot/format";
import { useCrudStore } from "src/stores/crud";
import { useAuthStore } from "src/stores/auth";
import { checkRole, sendRequest } from "src/boot/functions";

const { cliente } = defineProps(["cliente"]);

const crud = useCrudStore();
const authStore = useAuthStore();
const myForm = ref(null);

const puedeSeleccionarAsesor = computed(() => {
  const roles = authStore.authUser?.roles || [];
  return (
    roles.some(
      (r) =>
        r.name === "Admin" ||
        r.name === "Credito" ||
        r.name === "Crédito" ||
        r.name === "Intranet.CreditoInterno"
    ) ||
    checkRole("Admin") ||
    checkRole("Credito")
  );
});

const filterEmpleados = ref([]);

const filterEmpleadosFn = (val, update) => {
  const lista = crud.items.empleados || [];
  if (val === "") {
    update(() => {
      filterEmpleados.value = lista;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterEmpleados.value = lista.filter(
      (empleado) =>
        (empleado.nombreCompleto || "").toLowerCase().indexOf(needle) > -1
    );
  });
};

const formCredito = ref({
  cliente_id: cliente ? cliente.id : null,
  monto_solicitado: null,
  tipo_enganche_id: null,
  valor_enganche: null,
  linea_id: null,
  sucursal_id:
    authStore.authUser?.empleado?.sucursal_id ||
    authStore.authUser?.empleado?.sucursal?.id ||
    null,
  asesor_id:
    authStore.authUser?.empleado?.id || authStore.authUser?.empleado_id || null,
  notificado_id: null,
  numero_pagos: null,
  pagos: [],
  archivos: [],
  motivo: null,
  notas: null,
});

const lineaSeleccionada = computed(() => {
  const lineas = crud.items.creditoLineas || crud.items.credito_lineas || [];
  const lineaId = formCredito.value.linea_id;
  if (!lineaId && lineaId !== 0) return null;

  if (typeof lineaId === "object" && lineaId !== null) {
    return lineaId;
  }

  return (
    lineas.find(
      (l) =>
        l.id == lineaId ||
        l.value == lineaId ||
        String(l.id) === String(lineaId) ||
        (l.name && l.name.toLowerCase() === String(lineaId).toLowerCase())
    ) || null
  );
});

const esLineaServicio = computed(() => {
  if (!lineaSeleccionada.value) return false;
  const txt = (
    lineaSeleccionada.value.name ||
    lineaSeleccionada.value.nombre ||
    ""
  ).toLowerCase();
  const clean = txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return clean.includes("servicio");
});

const tipoEngancheOptions = computed(() => {
  if (!lineaSeleccionada.value || !lineaSeleccionada.value.tipos_enganche) {
    return [];
  }
  return lineaSeleccionada.value.tipos_enganche;
});

const tipoEngancheSeleccionado = computed(() => {
  const id = formCredito.value.tipo_enganche_id;
  if (!id && id !== 0) return null;
  return (
    tipoEngancheOptions.value.find(
      (t) => t.id === id || t.id == id || t.nombre === id
    ) || null
  );
});

const esEngancheACuenta = computed(() => {
  const nombre = (
    tipoEngancheSeleccionado.value?.nombre ||
    tipoEngancheSeleccionado.value?.name ||
    ""
  ).toLowerCase();
  return nombre.includes("a cuenta");
});

const esSinAnticipo = computed(() => {
  const nombre = (
    tipoEngancheSeleccionado.value?.nombre ||
    tipoEngancheSeleccionado.value?.name ||
    ""
  ).toLowerCase();
  return nombre.includes("sin anticipo") || nombre.includes("sin enganche");
});

const anticipoLabel = computed(() => {
  if (esEngancheACuenta.value) {
    return "Valor de la Maquinaria";
  }
  if (esSinAnticipo.value) {
    return "Enganche (Sin anticipo)";
  }
  return "Enganche / Anticipo";
});

const montoSolicitadoNum = computed(() => {
  return Number(formCredito.value.monto_solicitado) || 0;
});

const anticipoNum = computed(() => {
  return Number(formCredito.value.valor_enganche) || 0;
});

const anticipoMinimoRecomendado = computed(() => {
  return montoSolicitadoNum.value * 0.5;
});

const mostrarAlertaAnticipoServicio = computed(() => {
  if (!esLineaServicio.value) return false;
  if (esSinAnticipo.value) return false;
  if (montoSolicitadoNum.value > 0) {
    return anticipoNum.value < anticipoMinimoRecomendado.value;
  }
  return anticipoNum.value <= 0;
});

const clienteEsMoral = computed(() => {
  const tipoCliente = (cliente?.tipo || "").toLowerCase().trim();
  return tipoCliente === "moral" || tipoCliente.includes("moral");
});

const categoriaClienteEnganche = computed(() => {
  const esMoral = clienteEsMoral.value;
  const esACuenta = esEngancheACuenta.value;

  if (esMoral) {
    return esACuenta ? "m/a cuenta" : "moral";
  } else {
    return esACuenta ? "f/a cuenta" : "fisica";
  }
});

const listaDocsObligatorios = computed(() => {
  const docsOblig = crud.items.docsObligatorios || [];
  const catalogoDocs = crud.items.documentos || [];
  const categoria = categoriaClienteEnganche.value;

  const filtrados = docsOblig.filter(
    (item) => (item.nombre || "").toLowerCase().trim() === categoria
  );

  return filtrados.map((item) => {
    const docInfo = catalogoDocs.find(
      (d) => d.id === item.doc_id || d.id == item.doc_id
    );
    const nombreDoc =
      docInfo?.nombre || docInfo?.name || `Documento #${item.doc_id}`;
    return {
      id: item.id,
      doc_id: item.doc_id,
      categoria: item.nombre,
      nombre: nombreDoc,
    };
  });
});

const tiposDocumentosOpcionales = computed(() => {
  const docs = crud.items.documentos || [];
  const obligatoriosIds = listaDocsObligatorios.value.map((d) => d.doc_id);
  return docs
    .filter((d) => !obligatoriosIds.includes(d.id))
    .map((d) =>
      typeof d === "object" && d !== null
        ? d.nombre || d.name || d.label || d.tipo || d
        : d
    );
});

const clienteDocs = ref([]);
const reemplazarDoc = ref({});

const getClienteDocs = async () => {
  const clienteId = cliente?.id || formCredito.value.cliente_id;
  if (!clienteId) return;
  try {
    const res = await sendRequest(
      "GET",
      null,
      `/api/intranet/clientesDoc/cliente/${clienteId}`
    );
    if (res && Array.isArray(res)) {
      clienteDocs.value = res;
    } else {
      clienteDocs.value = [];
    }
  } catch (e) {
    console.error("Error al obtener documentos del cliente:", e);
    clienteDocs.value = [];
  }
  actualizarArchivosEnForm();
};

const normalizeStr = (str) => {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const getDocExpedienteInfo = (item) => {
  if (!clienteDocs.value || clienteDocs.value.length === 0) {
    return {
      estado: "no_subido",
      badgeText: "No subido",
      color: "grey-7",
      icono: "warning",
      mensaje: "No se encuentra en el expediente del cliente",
      doc: null,
    };
  }

  const itemNom = normalizeStr(item.nombre);

  const doc = clienteDocs.value.find((d) => {
    if (
      d.status_id &&
      (d.status_id == item.doc_id || d.status_id === item.doc_id)
    ) {
      return true;
    }
    const stNom = normalizeStr(d.status?.nombre);
    if (
      stNom &&
      (stNom === itemNom || stNom.includes(itemNom) || itemNom.includes(stNom))
    ) {
      return true;
    }
    return false;
  });

  if (!doc || (!doc.path && !doc.realpath)) {
    return {
      estado: "no_subido",
      badgeText: "No subido",
      color: "grey-7",
      icono: "warning",
      mensaje: "No se encuentra en el expediente del cliente",
      doc: null,
    };
  }

  if (doc.expiration_date) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const parts = doc.expiration_date.split("-");
    if (parts.length === 3) {
      const expDate = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
      );
      const diffDays = Math.ceil((expDate - hoy) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return {
          estado: "caducado",
          badgeText: "Vencido",
          color: "negative",
          icono: "error",
          mensaje: `Documento vencido el ${doc.expiration_date}. Se requiere actualizar.`,
          doc,
        };
      }

      if (diffDays <= 21) {
        const diasTxt =
          diffDays === 0
            ? "hoy"
            : diffDays === 1
            ? "mañana"
            : `en ${diffDays} días`;
        return {
          estado: "proximo_a_caducar",
          badgeText: "Próximo a caducar",
          color: "orange-8",
          icono: "warning",
          mensaje: `Documento vence ${diasTxt} (${doc.expiration_date}). Se requiere actualizar.`,
          doc,
        };
      }
    }
  }

  return {
    estado: "vigente",
    badgeText: "Vigente",
    color: "positive",
    icono: "check_circle",
    mensaje: doc.expiration_date
      ? `Documento vigente en expediente (Vence: ${doc.expiration_date})`
      : "Documento guardado en expediente",
    doc,
  };
};

const activarReemplazo = (docId) => {
  reemplazarDoc.value[docId] = true;
  actualizarArchivosEnForm();
};

const cancelarReemplazo = (docId) => {
  reemplazarDoc.value[docId] = false;
  archivosObligatoriosFiles.value[docId] = null;
  delete archivosObligatorios.value[docId];
  actualizarArchivosEnForm();
};

const openDocWindow = (url) => {
  if (url) window.open(url, "_blank");
};

const validarDocObligatorio = (item) => {
  const info = getDocExpedienteInfo(item);
  if (info.estado === "vigente" && !reemplazarDoc.value[item.doc_id]) {
    return true;
  }
  return !!archivosObligatorios.value[item.doc_id]?.base64;
};

const archivosObligatoriosFiles = ref({});
const archivosObligatorios = ref({});
const archivosOpcionales = ref([]);

const actualizarArchivosEnForm = () => {
  const docsActuales = listaDocsObligatorios.value;
  const obligatorios = [];

  docsActuales.forEach((item) => {
    const info = getDocExpedienteInfo(item);
    const nuevoSubido = archivosObligatorios.value[item.doc_id];

    if (nuevoSubido && nuevoSubido.base64) {
      obligatorios.push({
        ...nuevoSubido,
        doc_id: item.doc_id,
        tipo: item.nombre,
      });
    } else if (
      info.estado === "vigente" &&
      !reemplazarDoc.value[item.doc_id] &&
      info.doc
    ) {
      obligatorios.push({
        doc_id: item.doc_id,
        tipo: item.nombre,
        nombre: info.doc.name || `${item.nombre}.pdf`,
        path: info.doc.path,
        realpath: info.doc.realpath,
        expiration_date: info.doc.expiration_date,
        existente: true,
        es_obligatorio: true,
      });
    }
  });

  formCredito.value.archivos = [...obligatorios, ...archivosOpcionales.value];
};

const getFechaVencimientoDefault = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const onObligatorioFileSelected = (file, itemOblig) => {
  if (!file) {
    delete archivosObligatorios.value[itemOblig.doc_id];
    actualizarArchivosEnForm();
    return;
  }

  const ext = file.name.split(".").pop().toLowerCase();
  if (ext !== "pdf") {
    archivosObligatoriosFiles.value[itemOblig.doc_id] = null;
    delete archivosObligatorios.value[itemOblig.doc_id];
    actualizarArchivosEnForm();
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const prevExp =
      archivosObligatorios.value[itemOblig.doc_id]?.expiration_date ||
      getFechaVencimientoDefault();
    archivosObligatorios.value[itemOblig.doc_id] = {
      doc_id: itemOblig.doc_id,
      tipo: itemOblig.nombre,
      nombre: file.name,
      extension: "pdf",
      size: (file.size / 1024).toFixed(1) + " KB",
      base64: e.target.result,
      expiration_date: prevExp,
      es_obligatorio: true,
    };
    actualizarArchivosEnForm();
  };
  reader.readAsDataURL(file);
};

const tempDoc = ref({
  tipo: null,
  file: null,
  nombre: null,
  extension: null,
  size: null,
  base64: null,
});

const onFileSelected = (file) => {
  if (!file) {
    tempDoc.value.nombre = null;
    tempDoc.value.extension = null;
    tempDoc.value.size = null;
    tempDoc.value.base64 = null;
    return;
  }

  const ext = file.name.split(".").pop().toLowerCase();
  if (ext !== "pdf") {
    tempDoc.value.file = null;
    tempDoc.value.nombre = null;
    tempDoc.value.extension = null;
    tempDoc.value.size = null;
    tempDoc.value.base64 = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    tempDoc.value.nombre = file.name;
    tempDoc.value.extension = "pdf";
    tempDoc.value.size = (file.size / 1024).toFixed(1) + " KB";
    tempDoc.value.base64 = e.target.result;
  };
  reader.readAsDataURL(file);
};

const agregarArchivoOpcional = () => {
  if (!tempDoc.value.tipo || !tempDoc.value.base64) return;

  const docCatalogo = (crud.items.documentos || []).find(
    (d) => (d.nombre || d.name) === tempDoc.value.tipo
  );

  archivosOpcionales.value.push({
    doc_id: docCatalogo?.id || null,
    tipo: tempDoc.value.tipo,
    nombre: tempDoc.value.nombre,
    extension: tempDoc.value.extension,
    size: tempDoc.value.size,
    base64: tempDoc.value.base64,
    es_obligatorio: false,
  });

  tempDoc.value = {
    tipo: null,
    file: null,
    nombre: null,
    extension: null,
    size: null,
    base64: null,
  };

  actualizarArchivosEnForm();
};

const eliminarArchivoOpcional = (index) => {
  archivosOpcionales.value.splice(index, 1);
  actualizarArchivosEnForm();
};

watch(
  () => listaDocsObligatorios.value,
  () => {
    actualizarArchivosEnForm();
  }
);

watch(
  () => clienteDocs.value,
  () => {
    actualizarArchivosEnForm();
  }
);

const seleccionarGerenteAutomatico = () => {
  const gerentes =
    crud.items.creditoInternos?.gerentes || crud.items.gerentes || [];
  if (!gerentes || gerentes.length === 0) return;

  // 1. Obtener el sucursal_id actual del formulario, del asesor seleccionado o del empleado
  let sucursalId = formCredito.value.sucursal_id;
  let sucursalNombre = "";

  if (sucursalId && crud.items.sucursales) {
    const suc = (crud.items.sucursales || []).find((s) => s.id === sucursalId);
    if (suc) {
      sucursalNombre = (suc.nombre || "").toLowerCase().trim();
    }
  }

  if (!sucursalId) {
    const asesor = (crud.items.empleados || []).find(
      (e) => e.id === formCredito.value.asesor_id
    );
    sucursalId = asesor?.sucursal_id || asesor?.sucursal?.id;
    sucursalNombre = (asesor?.sucursal?.nombre || "").toLowerCase().trim();
  }

  if (!sucursalId) {
    const empleado = authStore.authUser?.empleado;
    sucursalId = empleado?.sucursal_id || empleado?.sucursal?.id;
    sucursalNombre = (empleado?.sucursal?.nombre || "").toLowerCase().trim();
  }

  // 2. Buscar gerente de la misma sucursal
  let gerenteSeleccionado = null;

  if (sucursalId) {
    gerenteSeleccionado = gerentes.find(
      (g) => g.sucursal_id === sucursalId || g.sucursal?.id === sucursalId
    );
  }

  if (!gerenteSeleccionado && sucursalNombre) {
    gerenteSeleccionado = gerentes.find(
      (g) => (g.sucursal?.nombre || "").toLowerCase().trim() === sucursalNombre
    );
  }

  // 3. Si no hay gerente de la sucursal, buscar gerente de la sucursal CELAYA
  if (!gerenteSeleccionado) {
    gerenteSeleccionado = gerentes.find((g) =>
      (g.sucursal?.nombre || "").toLowerCase().includes("celaya")
    );
  }

  // 4. Asignar automáticamente a formCredito.notificado_id
  if (gerenteSeleccionado) {
    formCredito.value.notificado_id = gerenteSeleccionado.id;
  }
};

const actualizarSucursalPorAsesor = () => {
  const asesorId = formCredito.value.asesor_id;
  if (!asesorId) {
    formCredito.value.sucursal_id = null;
    seleccionarGerenteAutomatico();
    return;
  }

  const empleados = crud.items.empleados || [];
  const asesor = empleados.find((e) => e.id === asesorId);

  if (asesor) {
    const sucursalId = asesor.sucursal_id || asesor.sucursal?.id;
    if (sucursalId) {
      formCredito.value.sucursal_id = sucursalId;
    }
  } else if (authStore.authUser?.empleado?.id === asesorId) {
    const sucursalId =
      authStore.authUser.empleado.sucursal_id ||
      authStore.authUser.empleado.sucursal?.id;
    if (sucursalId) {
      formCredito.value.sucursal_id = sucursalId;
    }
  }

  seleccionarGerenteAutomatico();
};

const asignarEmpleadoPorDefecto = () => {
  const empleadoActual = authStore.authUser?.empleado;
  const empleadoId = empleadoActual?.id || authStore.authUser?.empleado_id;

  if (!puedeSeleccionarAsesor.value) {
    // Si NO es Admin ni Credito, forzar su empleado
    if (empleadoId) {
      formCredito.value.asesor_id = empleadoId;
    }
  } else {
    // Si es Admin o Credito, si aún no hay asesor seleccionado, poner el del usuario logueado si existe
    if (!formCredito.value.asesor_id && empleadoId) {
      formCredito.value.asesor_id = empleadoId;
    }
  }

  actualizarSucursalPorAsesor();
};

const getOptions = async () => {
  await crud.getItems("/api/intranet/creditoInternos/options");
  filterEmpleados.value = crud.items.empleados || [];
  asignarEmpleadoPorDefecto();
};

watch(
  () => formCredito.value.asesor_id,
  () => {
    actualizarSucursalPorAsesor();
  }
);

watch(
  () => formCredito.value.sucursal_id,
  () => {
    seleccionarGerenteAutomatico();
  }
);

watch(
  () => formCredito.value.linea_id,
  () => {
    const opciones = tipoEngancheOptions.value;
    if (opciones && opciones.length > 0) {
      const existe = opciones.some(
        (o) => o.id === formCredito.value.tipo_enganche_id
      );
      if (!existe) {
        formCredito.value.tipo_enganche_id = opciones[0].id;
      }
    } else {
      formCredito.value.tipo_enganche_id = null;
    }
  }
);

watch(
  () => formCredito.value.tipo_enganche_id,
  () => {
    if (esSinAnticipo.value) {
      formCredito.value.valor_enganche = null;
    }
    actualizarArchivosEnForm();
  }
);

const isDateAllowed = (dateString, index) => {
  if (!dateString || index === 0) return true;
  const prevFecha = formCredito.value.pagos?.[index - 1]?.fecha;
  if (!prevFecha) return true;
  // dateString viene en formato 'YYYY/MM/DD' de q-date
  return dateString >= prevFecha.replace(/-/g, "/");
};

const validateFechaPago = (val, index) => {
  if (index === 0 || !val) return true;
  const prevPago = formCredito.value.pagos?.[index - 1];
  if (prevPago?.fecha && val < prevPago.fecha) {
    return `No puede ser anterior a la fecha de ${
      prevPago.etiqueta || "pago anterior"
    }`;
  }
  return true;
};

const getOrdinal = (n) => {
  if (n === 1) return "1er Pago";
  if (n === 2) return "2do Pago";
  if (n === 3) return "3er Pago";
  if (n === 4) return "4to Pago";
  if (n === 5) return "5to Pago";
  if (n === 6) return "6to Pago";
  if (n === 7) return "7mo Pago";
  if (n === 8) return "8vo Pago";
  if (n === 9) return "9no Pago";
  if (n === 10) return "10mo Pago";
  return `${n}° Pago`;
};

const regenerarPagos = () => {
  const tieneAnticipo = Number(formCredito.value.valor_enganche) > 0;
  const numPagos = parseInt(formCredito.value.numero_pagos, 10);
  const totalPagos = numPagos && numPagos >= 1 ? Math.min(numPagos, 120) : 0;

  if (!tieneAnticipo && totalPagos === 0) {
    formCredito.value.pagos = [];
    return;
  }

  const currentPagos = formCredito.value.pagos || [];
  const prevAnticipo = currentPagos.find((p) => p.es_anticipo);
  const prevNormales = currentPagos.filter((p) => !p.es_anticipo);

  const newPagos = [];
  let contadorNumero = 1;

  // 1. Si hay anticipo, se agrega como el primer pago en la lista
  if (tieneAnticipo) {
    newPagos.push({
      numero: contadorNumero++,
      etiqueta: "Enganche",
      es_anticipo: true,
      fecha: prevAnticipo ? prevAnticipo.fecha : null,
    });
  }

  // 2. Pagos restantes programados (1er Pago, 2do Pago, ...)
  for (let i = 1; i <= totalPagos; i++) {
    const existing = prevNormales[i - 1];
    newPagos.push({
      numero: contadorNumero++,
      etiqueta: getOrdinal(i),
      es_anticipo: false,
      fecha: existing ? existing.fecha : null,
    });
  }

  formCredito.value.pagos = newPagos;
};

watch(
  [
    () => formCredito.value.numero_pagos,
    () => formCredito.value.valor_enganche,
  ],
  () => {
    regenerarPagos();
  }
);

const formatLocation = (cli) => {
  if (!cli) return "No especificada";
  const parts = [];
  if (cli.calle) parts.push(cli.calle);
  if (cli.colonia) parts.push(`Col. ${cli.colonia}`);
  if (cli.town?.name) parts.push(cli.town.name);
  if (cli.state_entity?.name) parts.push(cli.state_entity.name);
  if (cli.codigo_postal) parts.push(`CP ${cli.codigo_postal}`);
  return parts.length > 0 ? parts.join(", ") : "No especificada";
};

const validate = async () => {
  return await myForm.value.validate();
};

watch(
  () => cliente?.id,
  (newId) => {
    if (newId) {
      formCredito.value.cliente_id = newId;
      getClienteDocs();
    }
  }
);

onMounted(async () => {
  await getOptions();
  await getClienteDocs();
});

defineExpose({
  formCredito,
  validate,
  isDateAllowed,
  validateFechaPago,
});
</script>
