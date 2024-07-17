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
              <q-btn label="Guardar" color="blue" @click="putCliente" />
            </q-item-section>
          </q-item>
          <cliente-form
            ref="edit"
            :cliente="currentCliente"
            :key="currentCliente"
          />
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
import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

const $q = useQuasar();

import ClienteForm from "src/components/Cliente/ClienteForm.vue";
import ReferenciaIndex from "src/components/Referencia/ReferenciaIndex.vue";
import RepresentanteCard from "src/components/Representante/RepresentanteCard.vue";
import MaquinaTable from "src/components/Maquina/MaquinaTable.vue";
import ClienteTecnologiaIndex from "src/components/ClienteTecnologia/ClienteTecnologiaIndex.vue";
import DistribucionIndex from "src/components/Distribucion/DistribucionIndex.vue";
import CultivosIndex from "src/components/Cultivos/CultivosIndex.vue";
import RiegosIndex from "src/components/Riegos/RiegosIndex.vue";
import AbastecimientosIndex from "src/components/Abastecimientos/AbastecimientosIndex.vue";

const { cliente } = defineProps(["cliente"]);

const tab = ref("info");
const splitterModel = ref(15);
const currentCliente = ref(null);
const edit = ref(null);

const putCliente = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...edit.value.formCliente,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/cliente/" + final.id,
    ""
  );
  currentCliente.value = res;
};

onMounted(() => {
  currentCliente.value = cliente;
});
</script>
