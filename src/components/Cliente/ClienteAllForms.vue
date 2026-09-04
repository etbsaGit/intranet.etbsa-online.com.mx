<template>
  <q-splitter v-model="splitterModel" unit="px" style="height: 90vh" disable>
    <template v-slot:before>
      <div class="q-pa-none">
        <q-tabs
          v-model="tab"
          vertical
          class="custom-tabs"
          active-color="white"
          active-bg-color="primary"
          switch-indicator
          inline-label
          indicator-color="transparent"
        >
          <template v-for="item in tabs" :key="item.name">
            <q-tab :name="item.name" :icon="item.icon" :label="item.label" />
          </template>

          <q-separator spaced inset />
        </q-tabs>
      </div>
    </template>

    <template v-slot:separator>
      <q-btn
        round
        color="primary"
        :icon="
          splitterModel === 50
            ? 'fa-solid fa-arrow-right'
            : 'fa-solid fa-arrow-left'
        "
        @click="toggleSidebar"
      />
    </template>

    <template v-slot:after>
      <q-tab-panels
        v-model="tab"
        animated
        swipeable
        vertical
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <template v-for="item in tabs" :key="item.name">
          <q-tab-panel :name="item.name">
            <div class="panel-header">
              <q-item dense>
                <q-item-section>
                  <q-item-label class="panel-title">{{
                    item.label
                  }}</q-item-label>
                </q-item-section>
                <q-item-section v-if="item.name === 'info'" side>
                  <q-btn label="Guardar" color="blue" @click="putItem" />
                </q-item-section>
              </q-item>
            </div>

            <!-- Cargar componente dinámicamente -->
            <component
              :is="item.component"
              :cliente="currentCliente"
              :key="currentCliente"
              :ref="
                (el) => {
                  if (item.name === 'info') edit = el;
                }
              "
            />
          </q-tab-panel>
        </template>
      </q-tab-panels>

      <q-page-sticky position="bottom-left" :offset="[50, 50]">
        <q-btn
          fab
          icon="mail"
          color="primary"
          class="pulse-btn"
          @click="sendEmail"
        >
          <q-tooltip
            class="bg-primary text-white text-body2"
            :offset="[10, 10]"
            anchor="center right"
            self="center left"
          >
            Enviar notificación de informacion acualizada
          </q-tooltip>
        </q-btn>
      </q-page-sticky>

      <q-page-sticky position="bottom-right" :offset="[50, 50]">
        <q-btn
          fab
          icon="local_atm"
          color="green"
          class="pulse-btn"
          @click="openCreditoModal"
        >
          <q-tooltip
            class="bg-primary text-white text-body2"
            :offset="[10, 10]"
            anchor="center right"
            self="center left"
          >
            Solicitud de Crédito Interno
          </q-tooltip>
        </q-btn>
      </q-page-sticky>
    </template>
  </q-splitter>

  <BaseDialog
    fullWidth
    v-model="showCreditoModal"
    mode="create"
    title-create="Solicitud de Crédito Interno"
    button-label-create="Enviar Solicitud"
    @submit="postCredito"
  >
    <template #form>
      <cliente-credito-form
        ref="refCredito"
        :cliente="currentCliente || cliente"
      />
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";

const crud = useCrudStore();

import BaseDialog from "src/bases/BaseDialog.vue";
import ClienteForm from "src/components/Cliente/ClienteForm.vue";
import ClienteCreditoForm from "src/components/Cliente/ClienteCreditoForm.vue";
import ReferenciaIndex from "src/components/Referencia/ReferenciaIndex.vue";
import RepresentanteCard from "src/components/Representante/RepresentanteCard.vue";
import MaquinaTable from "src/components/Maquina/MaquinaTable.vue";
import ClienteTecnologiaIndex from "src/components/ClienteTecnologia/ClienteTecnologiaIndex.vue";
import DistribucionIndex from "src/components/Distribucion/DistribucionIndex.vue";
import CultivosIndex from "src/components/Cultivos/CultivosIndex.vue";
import RiegosIndex from "src/components/Riegos/RiegosIndex.vue";
import AbastecimientosIndex from "src/components/Abastecimientos/AbastecimientosIndex.vue";
import ClasificacionTecnologicaIndex from "src/components/ClasificacionTecnologica/ClasificacionTecnologicaIndex.vue";
import ClienteDocsIndex from "src/components/ClienteDocs/ClienteDocsIndex.vue";
import ReferenciaComercialIndex from "src/components/ReferenciaComercial/ReferenciaComercialIndex.vue";
import FincaIndex from "src/components/Finca/FincaIndex.vue";
import AnaliticaIndex from "src/components/Analitica/AnaliticaIndex.vue";
import IngresoIndex from "src/components/Ingreso/IngresoIndex.vue";
import IngresosTab from "src/components/AgricolaInversion/IngresosTab.vue";
import InversionesTab from "src/components/InversionesAgricolas/InversionesTab.vue";
import EgresoIndex from "src/components/Egresos/EgresoIndex.vue";

const { cliente } = defineProps(["cliente"]);

const tab = ref("info");
const splitterModel = ref(270);
const currentCliente = ref(null);
const edit = ref(null);
const showCreditoModal = ref(false);
const refCredito = ref(null);
let animationFrame = null;

// Definición de tabs dinámicos
const tabs = [
  {
    name: "info",
    label: "Información",
    icon: "person",
    component: ClienteForm,
  },
  {
    name: "docs",
    label: "Documentos",
    icon: "folder",
    component: ClienteDocsIndex,
  },
  {
    name: "referencia",
    label: "Referencias personales",
    icon: "3p",
    component: ReferenciaIndex,
  },
  {
    name: "referenciaComercial",
    label: "Referencias comerciales",
    icon: "fa-regular fa-id-card",
    component: ReferenciaComercialIndex,
  },
  {
    name: "representante",
    label: "Representante",
    icon: "supervisor_account",
    component: RepresentanteCard,
  },
  {
    name: "maquinas",
    label: "Vehículos",
    icon: "directions_car",
    component: MaquinaTable,
  },
  {
    name: "fincas",
    label: "Fincas y terrenos",
    icon: "fa-solid fa-map-location",
    component: FincaIndex,
  },
  {
    name: "inversiones",
    label: "Inversiones",
    icon: "fa-solid fa-file-invoice-dollar",
    component: InversionesTab,
  },
  {
    name: "inversionAgricola",
    label: "Ingresos",
    icon: "fa-solid fa-sack-dollar",
    component: IngresosTab,
  },
  {
    name: "ingreso",
    label: "Otros ingresos",
    icon: "fa-solid fa-hand-holding-dollar",
    component: IngresoIndex,
  },
  {
    name: "egreso",
    label: "Pasivos",
    icon: "fa-solid fa-receipt",
    component: EgresoIndex,
  },
  {
    name: "analitica",
    label: "Analítica",
    icon: "fa-solid fa-chart-pie",
    component: AnaliticaIndex,
  },
  {
    name: "nuevaTecnologia",
    label: "Tecnologías",
    icon: "satellite_alt",
    component: ClienteTecnologiaIndex,
  },
  {
    name: "classTech",
    label: "Adopción tecnológica",
    icon: "satellite",
    component: ClasificacionTecnologicaIndex,
  },
  {
    name: "distribucion",
    label: "Distribución",
    icon: "pin_drop",
    component: DistribucionIndex,
  },
  {
    name: "cultivos",
    label: "Cultivos",
    icon: "eco",
    component: CultivosIndex,
  },
  { name: "riegos", label: "Riegos", icon: "shower", component: RiegosIndex },
  {
    name: "abastecimientos",
    label: "Abastecimientos",
    icon: "water_drop",
    component: AbastecimientosIndex,
  },
];

const animateSplitter = (target, duration = 300) => {
  if (animationFrame) cancelAnimationFrame(animationFrame);

  const start = splitterModel.value;
  const distance = target - start;
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    // Easing suave
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    splitterModel.value = Math.round(start + distance * easedProgress);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step);
    }
  };

  animationFrame = requestAnimationFrame(step);
};

const toggleSidebar = () => {
  const target = splitterModel.value > 60 ? 50 : 270;
  animateSplitter(target, 400); // 400ms de animación
};

const baseURL = ref("/api/intranet/cliente");

const putItem = async () => {
  if (!edit.value) {
    console.warn("⚠️ El formulario aún no está montado");
    return;
  }

  const data = { ...edit.value.formCliente };

  await crud.putItem(baseURL.value, data, edit.value.validate, (res) => {
    currentCliente.value = res;
  });
};

const sendEmail = async () => {
  await crud.getItems(baseURL.value + "/mail/" + cliente.id);
};

const openCreditoModal = () => {
  showCreditoModal.value = true;
};

const postCredito = async () => {
  if (!refCredito.value) return;

  const data = { ...refCredito.value.formCredito };

  await crud.postItem(
    "/api/intranet/creditoInterno",
    data,
    refCredito.value.validate,
    () => {
      showCreditoModal.value = false;
    }
  );
};

onMounted(() => {
  currentCliente.value = cliente;
});
</script>
<style scoped>
.custom-tabs {
  background: #f9fafb; /* Fondo claro */
  border-right: 1px solid #e0e0e0;
  padding-top: 8px;
  padding-bottom: 8px;
  min-width: 230px;
}

.custom-tabs .q-tab {
  justify-content: flex-start;
  text-align: left;
  font-weight: 500;
  color: #444;
  border-radius: 8px;
  margin: 2px 6px;
  transition: all 0.2s ease;
}

.custom-tabs .q-tab:hover {
  background-color: #e8f0fe;
  color: #1976d2;
}

.custom-tabs .q-tab--active {
  background-color: #1976d2 !important;
  color: white !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.custom-tabs .q-icon {
  margin-right: 10px;
  font-size: 20px;
}

.q-btn[icon="menu"] {
  transition: transform 0.2s ease;
}

.q-btn[icon="menu"]:hover {
  transform: scale(1.1);
}

/* 🌈 Nuevo estilo de encabezado */
.panel-header {
  padding-bottom: 8px;
  margin-bottom: 12px;
  border-bottom: 2px solid #1976d2;
}

.panel-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a237e;
  letter-spacing: 0.5px;
}

.pulse-btn {
  animation: pulse 1.5s infinite;
  box-shadow: 0 0 12px rgba(33, 150, 243, 0.4);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 12px rgba(33, 150, 243, 0.4);
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 0 20px rgba(33, 150, 243, 0.7);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 12px rgba(33, 150, 243, 0.4);
  }
}
</style>
