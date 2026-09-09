<template>
  <q-card flat bordered class="bg-grey-1">
    <q-card-section class="q-pb-xs flex items-center justify-between">
      <div
        class="text-subtitle2 text-weight-bold text-primary flex items-center q-gutter-xs"
      >
        <q-icon name="folder_shared" color="primary" />
        <span>
          Documentación Adjunta
          <template v-if="docs && docs.length > 0">
            ({{ docs.length }})
          </template>
        </span>
      </div>
      <q-badge
        v-if="docs && docs.length > 0"
        color="positive"
        text-color="white"
        class="text-weight-bold"
      >
        {{ docs.length }} {{ docs.length === 1 ? "Archivo" : "Archivos" }}
      </q-badge>
    </q-card-section>

    <q-card-section class="q-pt-xs">
      <div v-if="docs && docs.length > 0" class="row q-col-gutter-sm">
        <div
          v-for="(doc, idx) in docs"
          :key="doc.id || idx"
          class="col-12 col-md-6"
        >
          <q-card
            flat
            bordered
            class="bg-white rounded-borders shadow-1 q-pa-xs"
          >
            <q-item dense class="items-center">
              <q-item-section avatar style="min-width: 36px">
                <q-avatar
                  size="36px"
                  color="red-1"
                  text-color="red-8"
                  icon="picture_as_pdf"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold text-primary text-body2">
                  {{
                    doc.documento?.nombre ||
                    doc.archivo ||
                    doc.tipo ||
                    doc.nombre ||
                    "Documento"
                  }}
                </q-item-label>
                <q-item-label
                  caption
                  class="text-grey-7 flex items-center q-gutter-xs"
                >
                  <q-badge
                    dense
                    color="red-6"
                    text-color="white"
                    class="text-weight-bold"
                  >
                    {{ (doc.extension || "PDF").toUpperCase() }}
                  </q-badge>
                  <span v-if="doc.created_at">
                    • Subido: {{ formatFechaLarga(doc.created_at) }}
                  </span>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row items-center no-wrap q-gutter-xs">
                  <!-- Botón previsualizar dentro del sistema -->
                  <q-btn
                    flat
                    round
                    dense
                    color="primary"
                    icon="visibility"
                    @click="previsualizar(doc)"
                  >
                    <q-tooltip>Previsualizar PDF</q-tooltip>
                  </q-btn>

                  <!-- Botón abrir en pestaña externa -->
                  <q-btn
                    flat
                    round
                    dense
                    color="teal-8"
                    icon="open_in_new"
                    @click="abrirExterno(doc)"
                  >
                    <q-tooltip>Abrir en nueva pestaña</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>

      <!-- Estado vacío cuando no hay documentos -->
      <div
        v-else
        class="q-pa-md text-center text-grey-6 bg-white rounded-borders bordered"
      >
        <q-icon name="folder_off" size="md" color="grey-5" class="q-mb-xs" />
        <div class="text-caption text-weight-medium">
          El asesor no adjuntó documentación para esta solicitud.
        </div>
      </div>
    </q-card-section>

    <!-- Modal de Previsualización de PDF -->
    <q-dialog v-model="showPreview" full-width full-height>
      <q-card class="column no-wrap" style="height: 100%">
        <q-card-section
          class="bg-primary text-white row items-center justify-between q-py-sm"
        >
          <div
            class="text-subtitle1 text-weight-bold flex items-center q-gutter-sm"
          >
            <q-icon name="picture_as_pdf" />
            <span>{{
              selectedDoc?.documento?.nombre ||
              selectedDoc?.archivo ||
              selectedDoc?.tipo ||
              selectedDoc?.nombre ||
              "Documento"
            }}</span>
          </div>
          <div class="row items-center q-gutter-xs">
            <q-btn
              flat
              dense
              icon="open_in_new"
              label="Abrir en pestaña"
              @click="abrirExterno(selectedDoc)"
            />
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="col q-pa-none bg-grey-3">
          <iframe
            v-if="selectedDocUrl"
            :src="selectedDocUrl"
            style="width: 100%; height: 100%; border: none"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { formatFechaLarga } from "src/boot/format";

const props = defineProps({
  documentacion: {
    type: Array,
    default: () => [],
  },
  archivos: {
    type: Array,
    default: () => [],
  },
});

const docs = computed(() => {
  if (props.documentacion && props.documentacion.length > 0) {
    return props.documentacion;
  }
  return props.archivos || [];
});

const showPreview = ref(false);
const selectedDoc = ref(null);

const selectedDocUrl = computed(() => {
  if (!selectedDoc.value) return null;
  return (
    selectedDoc.value.realpath ||
    selectedDoc.value.url ||
    selectedDoc.value.base64 ||
    null
  );
});

const previsualizar = (doc) => {
  selectedDoc.value = doc;
  showPreview.value = true;
};

const abrirExterno = (doc) => {
  if (!doc) return;
  const url = doc.realpath || doc.url || doc.base64;
  if (url) {
    window.open(url, "_blank");
  }
};
</script>
