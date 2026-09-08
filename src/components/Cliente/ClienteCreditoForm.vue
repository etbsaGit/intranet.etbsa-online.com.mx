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
          v-model="formCredito.tipo_anticipo"
          :options="tipoAnticipoOptions"
          label="Tipo de anticipo"
          filled
          dense
          options-dense
          transition-show="jump-up"
          transition-hide="jump-up"
          :rules="[(val) => !!val || 'El tipo de anticipo es obligatorio']"
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
          v-model="formCredito.anticipo"
          filled
          dense
          :label="anticipoLabel"
          :disable="formCredito.tipo_anticipo === 'Sin Anticipo'"
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
                      ? 'Fecha pago de anticipo'
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

    <!-- 📎 Sección de Documentación Adjunta -->
    <q-item>
      <q-item-section>
        <q-item-label
          caption
          align="center"
          class="text-primary text-weight-bold"
        >
          -Documentación del Crédito (Opcional)-
        </q-item-label>
      </q-item-section>
    </q-item>

    <div class="row q-col-gutter-sm q-px-md q-pb-sm items-center">
      <!-- Droplist de Tipos de Documento -->
      <div class="col-12 col-md-5">
        <q-select
          v-model="tempDoc.tipo"
          :options="tiposDocumentos"
          label="Tipo de documento"
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
          @click="agregarArchivo"
        />
      </div>
    </div>

    <!-- Lista de Archivos Adjuntos -->
    <div
      v-if="formCredito.archivos && formCredito.archivos.length > 0"
      class="q-px-md q-pb-sm"
    >
      <q-list bordered separator class="rounded-borders bg-white">
        <q-item
          v-for="(arch, idx) in formCredito.archivos"
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
              @click="eliminarArchivo(idx)"
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
import { checkRole } from "src/boot/functions";

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
  tipo_anticipo: "Anticipo",
  anticipo: null,
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

const esLineaServicio = computed(() => {
  const lineaId = formCredito.value.linea_id;
  if (!lineaId && lineaId !== 0) return false;

  // Si lineaId es un objeto
  if (typeof lineaId === "object" && lineaId !== null) {
    const txt = (
      lineaId.name ||
      lineaId.nombre ||
      lineaId.label ||
      lineaId.descripcion ||
      ""
    ).toLowerCase();
    const clean = txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return clean.includes("servicio");
  }

  // Si lineaId es un string con el nombre directo
  if (typeof lineaId === "string" && isNaN(Number(lineaId))) {
    const clean = lineaId
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (clean.includes("servicio")) return true;
  }

  // Buscar en la lista de opciones de líneas de crédito
  const lineas = crud.items.creditoLineas || crud.items.credito_lineas || [];
  const linea = lineas.find(
    (l) =>
      l.id == lineaId || l.value == lineaId || String(l.id) === String(lineaId)
  );

  if (linea) {
    const txt = (
      linea.name ||
      linea.nombre ||
      linea.label ||
      linea.descripcion ||
      ""
    ).toLowerCase();
    const clean = txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return clean.includes("servicio");
  }

  return false;
});

const esLineaMaquinaria = computed(() => {
  const lineaId = formCredito.value.linea_id;
  if (!lineaId && lineaId !== 0) return false;

  // Si lineaId es un objeto
  if (typeof lineaId === "object" && lineaId !== null) {
    const txt = (
      lineaId.name ||
      lineaId.nombre ||
      lineaId.label ||
      lineaId.descripcion ||
      ""
    ).toLowerCase();
    const clean = txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return clean.includes("maquinaria") || clean.includes("tractor");
  }

  // Si lineaId es un string con el nombre directo
  if (typeof lineaId === "string" && isNaN(Number(lineaId))) {
    const clean = lineaId
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return clean.includes("maquinaria") || clean.includes("tractor");
  }

  // Buscar en la lista de opciones de líneas de crédito
  const lineas = crud.items.creditoLineas || crud.items.credito_lineas || [];
  const linea = lineas.find(
    (l) =>
      l.id == lineaId || l.value == lineaId || String(l.id) === String(lineaId)
  );

  if (linea) {
    const txt = (
      linea.name ||
      linea.nombre ||
      linea.label ||
      linea.descripcion ||
      ""
    ).toLowerCase();
    const clean = txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return clean.includes("maquinaria") || clean.includes("tractor");
  }

  return false;
});

const tipoAnticipoOptions = computed(() => {
  if (esLineaServicio.value) {
    return ["Anticipo"];
  }
  if (esLineaMaquinaria.value) {
    return ["Sin Anticipo", "Anticipo", "Maquinaria a Cuenta"];
  }
  return ["Sin Anticipo", "Anticipo"];
});

const anticipoLabel = computed(() => {
  if (formCredito.value.tipo_anticipo === "Maquinaria a Cuenta") {
    return "Valor de la Maquinaria";
  }
  if (formCredito.value.tipo_anticipo === "Sin Anticipo") {
    return "Anticipo (Sin anticipo)";
  }
  return "Anticipo (Opcional)";
});

const montoSolicitadoNum = computed(() => {
  return Number(formCredito.value.monto_solicitado) || 0;
});

const anticipoNum = computed(() => {
  return Number(formCredito.value.anticipo) || 0;
});

const anticipoMinimoRecomendado = computed(() => {
  return montoSolicitadoNum.value * 0.5;
});

const mostrarAlertaAnticipoServicio = computed(() => {
  if (!esLineaServicio.value) return false;
  if (formCredito.value.tipo_anticipo === "Sin Anticipo") return false;
  if (montoSolicitadoNum.value > 0) {
    return anticipoNum.value < anticipoMinimoRecomendado.value;
  }
  return anticipoNum.value <= 0;
});

const tiposDocumentos = [
  "INE",
  "Comprobante de Domicilio",
  "Comprobante de Ingreso",
  "CURP",
  "RFC",
  "Estado de Cuenta",
  "Cotización",
  "Otro",
];

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

const agregarArchivo = () => {
  if (!tempDoc.value.tipo || !tempDoc.value.base64) return;

  if (!formCredito.value.archivos) {
    formCredito.value.archivos = [];
  }

  formCredito.value.archivos.push({
    tipo: tempDoc.value.tipo,
    nombre: tempDoc.value.nombre,
    extension: tempDoc.value.extension,
    size: tempDoc.value.size,
    base64: tempDoc.value.base64,
  });

  tempDoc.value = {
    tipo: null,
    file: null,
    nombre: null,
    extension: null,
    size: null,
    base64: null,
  };
};

const eliminarArchivo = (index) => {
  if (formCredito.value.archivos) {
    formCredito.value.archivos.splice(index, 1);
  }
};

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
    if (esLineaServicio.value) {
      formCredito.value.tipo_anticipo = "Anticipo";
    } else if (
      !esLineaMaquinaria.value &&
      formCredito.value.tipo_anticipo === "Maquinaria a Cuenta"
    ) {
      formCredito.value.tipo_anticipo = "Anticipo";
    }
  }
);

watch(
  () => formCredito.value.tipo_anticipo,
  (newVal) => {
    if (newVal === "Sin Anticipo") {
      formCredito.value.anticipo = null;
    }
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
  const tieneAnticipo = Number(formCredito.value.anticipo) > 0;
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
      etiqueta: "Anticipo",
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
  [() => formCredito.value.numero_pagos, () => formCredito.value.anticipo],
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
