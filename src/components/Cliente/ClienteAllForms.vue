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
          <q-tab name="info" icon="person" label="Información" />
          <q-tab name="docs" icon="folder" label="Documentos" />
          <q-tab name="referencia" icon="3p" label="Referencias personales" />
          <q-tab
            name="referenciaComercial"
            icon="fa-regular fa-id-card"
            label="Referencias comerciales"
          />
          <q-tab
            name="representante"
            icon="supervisor_account"
            label="Representante"
          />
          <q-tab name="maquinas" icon="directions_car" label="Vehículos" />
          <q-tab
            name="fincas"
            icon="fa-solid fa-map-location"
            label="Fincas y terrenos"
          />
          <q-tab
            name="inversiones"
            icon="fa-solid fa-file-invoice-dollar"
            label="Inversiones"
          />
          <q-tab
            name="inversionAgricola"
            icon="fa-solid fa-sack-dollar"
            label="Ingresos"
          />
          <q-tab
            name="ingreso"
            icon="fa-solid fa-hand-holding-dollar"
            label="Otros ingresos"
          />
          <q-tab
            name="analitica"
            icon="fa-solid fa-chart-pie"
            label="Analítica"
          />

          <q-separator spaced inset />

          <q-tab
            name="nuevaTecnologia"
            icon="satellite_alt"
            label="Tecnologías"
          />
          <q-tab
            name="classTech"
            icon="satellite"
            label="Adopción tecnológica"
          />
          <q-tab name="distribucion" icon="pin_drop" label="Distribución" />
          <q-tab name="cultivos" icon="eco" label="Cultivos" />
          <q-tab name="riegos" icon="shower" label="Riegos" />
          <q-tab
            name="abastecimientos"
            icon="water_drop"
            label="Abastecimientos"
          />
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
        <q-tab-panel name="info">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Informacion general </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn label="Guardar" color="blue" @click="putItem" />
            </q-item-section>
          </q-item>
          <cliente-form
            ref="edit"
            :cliente="currentCliente"
            :key="currentCliente"
          />
        </q-tab-panel>

        <q-tab-panel name="docs">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Documentos </q-item-label>
            </q-item-section>
          </q-item>
          <cliente-docs-index :cliente="currentCliente" :key="currentCliente" />
        </q-tab-panel>

        <q-tab-panel name="referencia">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Referencias </q-item-label>
            </q-item-section>
          </q-item>
          <referencia-index :cliente="currentCliente" :key="currentCliente" />
        </q-tab-panel>

        <q-tab-panel name="referenciaComercial">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6">
                Referencias comerciales
              </q-item-label>
            </q-item-section>
          </q-item>
          <referencia-comercial-index
            :cliente="currentCliente"
            :key="currentCliente"
          />
        </q-tab-panel>

        <q-tab-panel name="representante">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Representante legal </q-item-label>
            </q-item-section>
          </q-item>
          <representante-card :cliente="currentCliente" :key="currentCliente" />
        </q-tab-panel>
        <q-tab-panel name="maquinas">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6">
                Maquinas y vehículos utilitarios
              </q-item-label>
            </q-item-section>
          </q-item>
          <maquina-table :cliente="currentCliente" :key="currentCliente" />
        </q-tab-panel>
        <q-tab-panel name="nuevaTecnologia">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Nuevas tecnologias </q-item-label>
            </q-item-section>
          </q-item>
          <cliente-tecnologia-index
            :cliente="currentCliente"
            :key="currentCliente"
          />
        </q-tab-panel>
        <q-tab-panel name="classTech">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6">
                Adopción de tecnología
              </q-item-label>
            </q-item-section>
          </q-item>
          <clasificacion-tecnologica-index
            :cliente="currentCliente"
            :key="currentCliente"
          />
        </q-tab-panel>
        <q-tab-panel name="distribucion">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Distribucion </q-item-label>
            </q-item-section>
          </q-item>
          <distribucion-index :cliente="currentCliente" :key="currentCliente" />
        </q-tab-panel>

        <q-tab-panel name="fincas">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Fincas y terrenos </q-item-label>
            </q-item-section>
          </q-item>
          <finca-index :cliente="currentCliente" :key="currentCliente" />
        </q-tab-panel>

        <q-tab-panel name="inversionAgricola">
          <ingresos-tab :cliente="currentCliente" :key="currentCliente" />
        </q-tab-panel>

        <q-tab-panel name="inversiones">
          <inversiones-tab :cliente="currentCliente" :key="currentCliente" />
        </q-tab-panel>

        <q-tab-panel name="ingreso">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Otros ingresos </q-item-label>
            </q-item-section>
          </q-item>
          <ingreso-index :cliente="currentCliente" :key="currentCliente" />
        </q-tab-panel>

        <q-tab-panel name="cultivos">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Cultivos </q-item-label>
            </q-item-section>
          </q-item>
          <cultivos-index :cliente="currentCliente" :key="currentCliente" />
        </q-tab-panel>

        <q-tab-panel name="riegos">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Riegos </q-item-label>
            </q-item-section>
          </q-item>
          <riegos-index :cliente="currentCliente" :key="currentCliente" />
        </q-tab-panel>

        <q-tab-panel name="abastecimientos">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Abastecimientos </q-item-label>
            </q-item-section>
          </q-item>
          <abastecimientos-index
            :cliente="currentCliente"
            :key="currentCliente"
          />
        </q-tab-panel>

        <q-tab-panel name="analitica">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-h6"> Analitica </q-item-label>
            </q-item-section>
          </q-item>
          <analitica-index :cliente="currentCliente" :key="currentCliente" />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCrudStore } from "src/stores/crud";

const crud = useCrudStore();

import ClienteForm from "src/components/Cliente/ClienteForm.vue";
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

const { cliente } = defineProps(["cliente"]);

const tab = ref("info");
const splitterModel = ref(270);
const currentCliente = ref(null);
const edit = ref(null);
let animationFrame = null;

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
  const data = { ...edit.value.formCliente };

  await crud.putItem(baseURL.value, data, edit.value.validate, (res) => {
    currentCliente.value = res;
  });
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
</style>
