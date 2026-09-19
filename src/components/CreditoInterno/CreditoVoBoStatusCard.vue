<template>
  <q-card flat bordered class="bg-grey-1 rounded-borders">
    <q-card-section class="q-pb-xs">
      <div
        class="text-subtitle2 text-weight-bold text-primary flex items-center q-gutter-xs"
      >
        <q-icon name="verified_user" color="primary" />
        <span>Dictámenes y Vistos Buenos (VoBo)</span>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-xs">
      <div class="row q-col-gutter-sm">
        <!-- Tarjeta 1: VoBo Departamento de Crédito -->
        <div class="col-12 col-md-6">
          <q-card
            flat
            bordered
            :class="infoCredito.bgClass"
            :style="{ border: infoCredito.borderStyle }"
          >
            <q-card-section class="q-pa-sm">
              <div class="row items-center justify-between no-wrap q-mb-xs">
                <div
                  class="text-weight-bold text-subtitle2 flex items-center q-gutter-xs"
                  :class="infoCredito.titleColor"
                >
                  <q-icon name="fact_check" size="20px" />
                  <span>VoBo Crédito</span>
                </div>
                <q-chip
                  dense
                  :color="infoCredito.chipColor"
                  :text-color="infoCredito.chipTextColor"
                  :icon="infoCredito.chipIcon"
                  class="text-weight-bold q-px-sm"
                >
                  {{ infoCredito.chipLabel }}
                </q-chip>
              </div>

              <div class="text-caption text-grey-8 q-gutter-y-xs">
                <div
                  v-if="infoCredito.fecha"
                  class="flex items-center q-gutter-xs"
                >
                  <q-icon name="event" size="xs" color="grey-7" />
                  <span>
                    <strong>Fecha:</strong>
                    {{ formatFechaLarga(infoCredito.fecha) }}
                  </span>
                </div>
                <div
                  v-if="infoCredito.usuario"
                  class="flex items-center q-gutter-xs"
                >
                  <q-icon name="person" size="xs" color="grey-7" />
                  <span>
                    <strong>Revisó:</strong> {{ infoCredito.usuario }}
                  </span>
                </div>
                <div class="q-mt-xs">
                  <div class="text-caption text-weight-bold text-grey-8">
                    Notas / Observaciones:
                  </div>
                  <div
                    class="bg-white q-pa-xs rounded-borders text-body2 text-grey-9"
                    style="border: 1px dashed #bdbdbd"
                  >
                    {{ infoCredito.notas }}
                  </div>
                </div>
                <div
                  v-if="infoCredito.status === 'pendiente'"
                  class="text-caption text-grey-6 italic q-mt-xs"
                >
                  Pendiente de dictamen por el departamento de Crédito.
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Tarjeta 2: VoBo Gerencia Territorial -->
        <div class="col-12 col-md-6">
          <q-card
            flat
            bordered
            :class="infoGerencia.bgClass"
            :style="{ border: infoGerencia.borderStyle }"
          >
            <q-card-section class="q-pa-sm">
              <div class="row items-center justify-between no-wrap q-mb-xs">
                <div
                  class="text-weight-bold text-subtitle2 flex items-center q-gutter-xs"
                  :class="infoGerencia.titleColor"
                >
                  <q-icon name="how_to_reg" size="20px" />
                  <span>VoBo Gerencia Territorial</span>
                </div>
                <q-chip
                  dense
                  :color="infoGerencia.chipColor"
                  :text-color="infoGerencia.chipTextColor"
                  :icon="infoGerencia.chipIcon"
                  class="text-weight-bold q-px-sm"
                >
                  {{ infoGerencia.chipLabel }}
                </q-chip>
              </div>

              <div class="text-caption text-grey-8 q-gutter-y-xs">
                <div
                  v-if="infoGerencia.fecha"
                  class="flex items-center q-gutter-xs"
                >
                  <q-icon name="event" size="xs" color="grey-7" />
                  <span>
                    <strong>Fecha:</strong>
                    {{ formatFechaLarga(infoGerencia.fecha) }}
                  </span>
                </div>
                <div
                  v-if="infoGerencia.usuario"
                  class="flex items-center q-gutter-xs"
                >
                  <q-icon name="person" size="xs" color="grey-7" />
                  <span>
                    <strong>Gerente:</strong> {{ infoGerencia.usuario }}
                  </span>
                </div>
                <div class="q-mt-xs">
                  <div class="text-caption text-weight-bold text-grey-8">
                    Notas / Justificación:
                  </div>
                  <div
                    class="bg-white q-pa-xs rounded-borders text-body2 text-grey-9"
                    style="border: 1px dashed #bdbdbd"
                  >
                    {{ infoGerencia.notas }}
                  </div>
                </div>
                <div
                  v-if="infoGerencia.status === 'pendiente'"
                  class="text-caption text-grey-6 italic q-mt-xs"
                >
                  Pendiente de dictamen por Gerencia Territorial.
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { formatFechaLarga } from "src/boot/format";

export const parseVoBoCredito = (c) => {
  // 1. objeto en c.vo_bo_credito
  let rec = c.vo_bo_credito;

  let status = "pendiente";
  let fecha = null;
  let usuario = null;
  let notas = null;

  if (rec) {
    const estatusName = String(rec.estatus?.nombre || "");
    const esAprob = estatusName === "Crédito Aprobado";
    const esRechaz = estatusName === "Crédito Rechazado";

    if (esAprob) status = "aprobado";
    else if (esRechaz) status = "rechazado";

    fecha = rec.created_at;
    usuario = rec.empleado?.nombreCompleto;
    notas = rec.notas;

    return {
      status,
      fecha,
      usuario,
      notas,
      chipColor: esAprob ? "green-1" : "red-1",
      chipTextColor: esAprob ? "green-9" : "red-9",
      chipIcon: esAprob ? "check_circle" : "cancel",
      chipLabel: esAprob ? "VoBo Otorgado" : "No Otorgado",
      bgClass: esAprob ? "bg-green-1" : "bg-red-1",
      borderStyle: esAprob ? "1px solid #a5d6a7" : "1px solid #ef9a9a",
      titleColor: esAprob ? "text-green-9" : "text-red-9",
    };
  }

  return {
    status: "pendiente",
    fecha: null,
    usuario: null,
    notas: null,
    chipColor: "grey-3",
    chipTextColor: "grey-8",
    chipIcon: "hourglass_empty",
    chipLabel: "Pendiente",
    bgClass: "bg-purple-1",
    borderStyle: "1px dashed #ce93d8",
    titleColor: "text-purple-9",
  };
};

export const parseVoBoGerencia = (c) => {
  // 1. objeto en c.vo_bo_gerencia
  let rec = c.vo_bo_gerencia;

  let status = "pendiente";
  let fecha = null;
  let usuario = null;
  let notas = null;

  if (rec) {
    const estatusName = String(rec.estatus?.nombre || "");
    const esAprob = estatusName === "Crédito Aprobado";
    const esRechaz = estatusName === "Crédito Rechazado";

    if (esAprob) status = "aprobado";
    else if (esRechaz) status = "rechazado";

    fecha = rec.created_at;
    usuario = rec.empleado?.nombreCompleto;
    notas = rec.notas;

    return {
      status,
      fecha,
      usuario,
      notas,
      chipColor: esAprob ? "green-1" : "red-1",
      chipTextColor: esAprob ? "green-9" : "red-9",
      chipIcon: esAprob ? "check_circle" : "cancel",
      chipLabel: esAprob ? "VoBo Otorgado" : "No Otorgado",
      bgClass: esAprob ? "bg-green-1" : "bg-red-1",
      borderStyle: esAprob ? "1px solid #a5d6a7" : "1px solid #ef9a9a",
      titleColor: esAprob ? "text-green-9" : "text-red-9",
    };
  }

  return {
    status: "pendiente",
    fecha: null,
    usuario: null,
    notas: null,
    chipColor: "grey-3",
    chipTextColor: "grey-8",
    chipIcon: "hourglass_empty",
    chipLabel: "Pendiente",
    bgClass: "bg-purple-1",
    borderStyle: "1px dashed #ce93d8",
    titleColor: "text-purple-9",
  };
};
</script>

<script setup>
import { computed } from "vue";

const props = defineProps({
  credito: {
    type: Object,
    default: null,
  },
});

const infoCredito = computed(() => parseVoBoCredito(props.credito));
const infoGerencia = computed(() => parseVoBoGerencia(props.credito));
</script>
