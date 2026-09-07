<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      style="min-width: 600px; max-width: 850px; width: 100%"
      class="rounded-borders"
    >
      <!-- Encabezado del Modal -->
      <q-card-section
        class="bg-indigo-8 text-white row items-center justify-between q-py-sm"
      >
        <div
          class="text-subtitle1 text-weight-bold flex items-center q-gutter-sm"
        >
          <q-icon name="timeline" size="sm" />
          <span>Línea del Tiempo - Historial</span>
          <q-badge
            v-if="credito?.folio"
            color="white"
            text-color="indigo-9"
            class="text-weight-bold"
          >
            #{{ credito.folio }}
          </q-badge>
        </div>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <!-- Contenido del Historial en Línea del Tiempo -->
      <q-card-section class="q-pa-md scroll" style="max-height: 75vh">
        <!-- Resumen del Cliente y Movimientos -->
        <div
          class="q-mb-lg q-pa-sm bg-indigo-1 rounded-borders row items-center justify-between"
        >
          <div
            v-if="itemsHistorial.length > 0"
            class="text-caption text-grey-8"
          >
            <span class="text-weight-bold">{{ itemsHistorial.length }}</span>
            {{
              itemsHistorial.length === 1
                ? " movimiento registrado"
                : " movimientos registrados"
            }}
          </div>
        </div>

        <!-- Línea del Tiempo (Timeline) -->
        <div v-if="itemsHistorial && itemsHistorial.length > 0" class="q-px-sm">
          <q-timeline color="indigo" layout="dense">
            <q-timeline-entry
              v-for="(item, idx) in itemsHistorial"
              :key="item.id || idx"
              color="blue-grey"
              icon="history"
            >
              <!-- Título / Encabezado de la Entrada del Timeline -->
              <template v-slot:title>
                <div class="row items-center justify-between q-mb-xs">
                  <!-- Estatus sin ícono y con estatus.color -->
                  <div>
                    <q-chip
                      v-if="item.estatus?.nombre || item.estatus"
                      dense
                      class="text-weight-bold text-white q-px-sm"
                      :style="{
                        backgroundColor: item.estatus?.color || '#1976d2',
                      }"
                    >
                      {{ item.estatus?.nombre || item.estatus }}
                    </q-chip>
                    <q-badge
                      v-else
                      color="indigo-7"
                      text-color="white"
                      class="text-weight-medium q-px-sm"
                    >
                      Movimiento #{{ item.id || idx + 1 }}
                    </q-badge>
                  </div>

                  <!-- Fecha y Hora -->
                  <div
                    class="text-caption text-grey-8 flex items-center q-gutter-xs"
                  >
                    <q-icon name="schedule" size="xs" color="indigo" />
                    <span class="text-weight-medium">
                      {{ formatFechaHora(item.created_at) }}
                    </span>
                  </div>
                </div>
              </template>

              <!-- Cuerpo de la Entrada -->
              <div
                class="bg-grey-1 q-pa-sm rounded-borders shadow-1 q-my-xs"
                style="border: 1px solid #e0e0e0"
              >
                <!-- Descripción del cambio / movimiento -->
                <div
                  v-if="item.descripcion"
                  class="text-body2 text-grey-9 bg-white q-pa-sm rounded-borders q-mb-xs"
                >
                  {{ item.descripcion }}
                </div>

                <!-- Empleado / Usuario responsable -->
                <div
                  class="row items-center justify-end text-caption text-grey-7 q-gutter-xs"
                >
                  <q-icon name="person_outline" size="xs" />
                  <span class="text-weight-bold text-dark">
                    {{
                      item.empleado?.nombreCompleto ||
                      (item.empleado_id
                        ? `Empleado #${item.empleado_id}`
                        : "Sistema")
                    }}
                  </span>
                </div>
              </div>
            </q-timeline-entry>
          </q-timeline>
        </div>

        <!-- Estado vacío si no hay historial -->
        <div
          v-else
          class="q-pa-xl text-center text-grey-6 bg-grey-1 rounded-borders"
        >
          <q-icon
            name="history_toggle_off"
            size="xl"
            color="grey-5"
            class="q-mb-sm"
          />
          <div class="text-subtitle2 text-weight-medium">
            Sin historial de cambios
          </div>
          <div class="text-caption text-grey-6">
            Esta solicitud aún no tiene registros de cambios o movimientos en su
            línea del tiempo.
          </div>
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
import { computed } from "vue";
import { formatFechaHora } from "src/boot/format";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  credito: {
    type: Object,
    default: null,
  },
  historial: {
    type: Array,
    default: null,
  },
});

defineEmits(["update:modelValue"]);

const itemsHistorial = computed(() => {
  if (props.historial && Array.isArray(props.historial)) {
    return props.historial;
  }
  if (props.credito?.historial && Array.isArray(props.credito.historial)) {
    return props.credito.historial;
  }
  return [];
});
</script>
