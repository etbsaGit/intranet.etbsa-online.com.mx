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
          v-model="formCredito.anticipo"
          filled
          dense
          label="Anticipo"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          lazy-rules
          :rules="[
            (val) => !!val || 'El anticipo es obligatorio',
            (val) => Number(val) > 0 || 'El anticipo debe ser mayor a 0',
          ]"
        />
      </q-item-section>
    </q-item>

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
            {{ formCredito.pagos.length === 1 ? "Pago" : "Pagos" }})-
          </q-item-label>
        </q-item-section>
      </q-item>

      <div class="row q-col-gutter-sm q-px-md q-pb-sm">
        <div
          v-for="(pago, index) in formCredito.pagos"
          :key="index"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card flat bordered class="q-pa-xs bg-grey-1">
            <q-item dense class="q-pa-xs items-center">
              <q-item-section avatar style="min-width: 90px">
                <q-chip
                  color="primary"
                  text-color="white"
                  dense
                  class="text-weight-bold q-ma-none"
                >
                  {{ pago.etiqueta }}
                </q-chip>
              </q-item-section>

              <q-item-section>
                <q-input
                  v-model="pago.fecha"
                  filled
                  dense
                  label="Fecha de pago"
                  mask="####-##-##"
                  :rules="[
                    (val) => !!val || 'Fecha obligatoria',
                    (val) => (validateFechaPago ? validateFechaPago(val, index) : true),
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
                          :options="(d) => (isDateAllowed ? isDateAllowed(d, index) : true)"
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
import { ref, watch, onMounted } from "vue";
import { formatPhoneNumber } from "src/boot/format";
import { useCrudStore } from "src/stores/crud";
import { useAuthStore } from "src/stores/auth";

const { cliente } = defineProps(["cliente"]);

const crud = useCrudStore();
const authStore = useAuthStore();
const myForm = ref(null);

const formCredito = ref({
  cliente_id: cliente ? cliente.id : null,
  monto_solicitado: null,
  anticipo: null,
  linea_id: null,
  notificado_id: null,
  numero_pagos: null,
  pagos: [],
  motivo: null,
  notas: null,
});

const seleccionarGerenteAutomatico = () => {
  const gerentes =
    crud.items.creditoInternos?.gerentes || crud.items.gerentes || [];
  if (!gerentes || gerentes.length === 0) return;

  const empleado = authStore.authUser?.empleado;
  const sucursalId = empleado?.sucursal_id || empleado?.sucursal?.id;
  const sucursalNombre = (empleado?.sucursal?.nombre || "")
    .toLowerCase()
    .trim();

  // 1. Buscar gerente de la misma sucursal del empleado
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

  // 2. Si no hay gerente de la sucursal del empleado, buscar gerente de la sucursal CELAYA
  if (!gerenteSeleccionado) {
    gerenteSeleccionado = gerentes.find((g) =>
      (g.sucursal?.nombre || "").toLowerCase().includes("celaya")
    );
  }

  // 3. Asignar automáticamente a formCredito.notificado_id
  if (gerenteSeleccionado) {
    formCredito.value.notificado_id = gerenteSeleccionado.id;
  }
};

const getOptions = async () => {
  await crud.getItems("/api/intranet/creditoInternos/options");
  seleccionarGerenteAutomatico();
};

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
    return `No puede ser anterior al ${prevPago.etiqueta || "pago anterior"}`;
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

watch(
  () => formCredito.value.numero_pagos,
  (val) => {
    const num = parseInt(val, 10);
    if (!num || num < 1) {
      formCredito.value.pagos = [];
      return;
    }

    const total = Math.min(num, 120);
    const currentPagos = formCredito.value.pagos || [];
    const newPagos = [];

    for (let i = 1; i <= total; i++) {
      const existing = currentPagos[i - 1];
      newPagos.push({
        numero: i,
        etiqueta: getOrdinal(i),
        fecha: existing ? existing.fecha : null,
      });
    }

    formCredito.value.pagos = newPagos;
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

onMounted(() => {
  getOptions();
});

defineExpose({
  formCredito,
  validate,
  isDateAllowed,
  validateFechaPago,
});
</script>
