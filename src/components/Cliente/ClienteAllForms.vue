<template>
  <q-splitter v-model="splitterModel">
    <template v-slot:before>
      <q-tabs
        v-model="tab"
        vertical
        class="text-black"
        active-color="teal"
        indicator-color="teal"
      >
        <q-tab name="info" icon="person" label="Informacion" />
        <q-tab name="docs" icon="folder" label="Documentos" />
        <q-tab name="referencia" icon="3p" label="Referencias" />
        <q-tab
          name="representante"
          icon="supervisor_account"
          label="Representante"
        />
        <q-tab name="maquinas" icon="directions_car" label="Vehiculos" />
        <q-tab
          name="nuevaTecnologia"
          icon="satellite_alt"
          label="Tecnologias"
        />
        <q-tab
          name="classTech"
          icon="satellite"
          label="Adopción de tecnología"
        />
        <q-tab name="distribucion" icon="pin_drop" label="Distribucion" />
        <q-tab name="cultivos" icon="eco" label="Cultivos" />
        <q-tab name="riegos" icon="shower" label="Riegos" />
        <q-tab
          name="abastecimientos"
          icon="water_drop"
          label="Abastecimientos"
        />
      </q-tabs>
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

const { cliente } = defineProps(["cliente"]);

const tab = ref("info");
const splitterModel = ref(15);
const currentCliente = ref(null);
const edit = ref(null);

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
