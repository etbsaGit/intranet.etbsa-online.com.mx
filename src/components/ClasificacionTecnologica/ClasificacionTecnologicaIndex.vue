<template>
  <q-page class="q-pa-md">
    <q-stepper v-model="step" ref="stepper" color="red-10" animated>
      <q-step :name="1" title="Adopción Baja" :done="step > 1">
        <q-list bordered separator class="my-list">
          <q-item class="year-navigator">
            <span class="year-display">Adopción Baja</span>
          </q-item>
          <q-item v-for="item in lowLevelData" :key="item.id">
            <q-item-section>
              <q-toggle
                color="blue"
                :label="item.name"
                v-model="items"
                :val="item.id"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-step>

      <q-step :name="2" title="Adopción Media" :done="step > 2">
        <q-list bordered separator class="my-list">
          <q-item class="year-navigator">
            <span class="year-display">Adopción Media</span>
          </q-item>
          <q-item v-for="item in mediumLevelData" :key="item.id">
            <q-item-section>
              <q-toggle
                color="orange"
                :label="item.name"
                v-model="items"
                :val="item.id"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-step>

      <q-step :name="3" title="Adopción Alta" :done="step > 3">
        <q-list bordered separator class="my-list">
          <q-item class="year-navigator">
            <span class="year-display">Adopción Alta</span>
          </q-item>
          <q-item v-for="item in highLevelData" :key="item.id">
            <q-item-section>
              <q-toggle
                color="yellow"
                :label="item.name"
                v-model="items"
                :val="item.id"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-step>

      <q-step :name="4" title="Adopción experto">
        <q-list bordered separator class="my-list">
          <q-item class="year-navigator">
            <span class="year-display">Adopción Experto</span>
          </q-item>
          <q-item v-for="item in expertLevelData" :key="item.id">
            <q-item-section>
              <q-toggle
                color="red"
                :label="item.name"
                v-model="items"
                :val="item.id"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-item dense>
            <q-item-section avatar v-if="step != 4">
              <q-btn
                :disabled="!isStepComplete(step)"
                @click="nextStep"
                color="primary"
                label="Continue"
              />
            </q-item-section>
            <q-item-section avatar v-if="step > 1">
              <q-btn
                outline
                color="primary"
                @click="previousStep"
                label="Back"
                class="q-ml-sm"
              />
            </q-item-section>
            <q-space></q-space>
            <q-item-section side>
              <q-btn
                label="Guardar"
                color="blue"
                @click="postItems(cliente.id)"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section align="center">
              <q-item-label class="title-label">Nivel actual:</q-item-label>
              <q-item-label class="current-level">
                {{ currentClassTech }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { cliente } = defineProps(["cliente"]);

const classTechs = ref([]);
const lowLevelData = ref([]);
const mediumLevelData = ref([]);
const highLevelData = ref([]);
const expertLevelData = ref([]);
const currentClassTech = ref(null);

const items = ref([]);
const step = ref(1);

const nextStep = () => {
  if (step.value < 4) {
    step.value++;
  }
};

const previousStep = () => {
  if (step.value > 1) {
    step.value--;
  }
};

const getRows = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/cliente/get/capTech/" + id,
    ""
  );
  currentClassTech.value = res.currentClassTech;
  items.value = res.capabilities;
  classTechs.value = res.capTech;
  lowLevelData.value = classTechs.value.filter((item) => item.level === "Baja");
  mediumLevelData.value = classTechs.value.filter(
    (item) => item.level === "Media"
  );
  highLevelData.value = classTechs.value.filter(
    (item) => item.level === "Alta"
  );
  expertLevelData.value = classTechs.value.filter(
    (item) => item.level === "Experto"
  );
};

const postItems = async (id) => {
  const final = {
    capabilities: items.value,
  };

  let res = await sendRequest(
    "POST",
    final,
    "/api/intranet/cliente/add/capTech/" + id,
    ""
  );
  getRows(cliente.id);
};

// Computed property to check if all toggles in the current step are selected
const isStepComplete = (currentStep) => {
  switch (currentStep) {
    case 1:
      return lowLevelData.value.every((item) => items.value.includes(item.id));
    case 2:
      return mediumLevelData.value.every((item) =>
        items.value.includes(item.id)
      );
    case 3:
      return highLevelData.value.every((item) => items.value.includes(item.id));
    case 4:
      return expertLevelData.value.every((item) =>
        items.value.includes(item.id)
      );
    default:
      return false;
  }
};

onMounted(() => {
  getRows(cliente.id);
});
</script>

<style scoped>
.year-navigator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px;
}

.year-display {
  font-size: 24px;
  margin: 0 16px;
}

.my-list {
  border-radius: 8px;
}

.title-label {
  font-size: 1.2rem; /* Tamaño de fuente más grande para el título */
  font-weight: bold; /* Negrita para el título */
  color: #333; /* Color de texto oscuro */
}

.current-level {
  font-size: 1.5rem; /* Tamaño de fuente más grande para el nivel actual */
  font-weight: bold; /* Negrita para el nivel actual */
  color: #007bff; /* Color azul para el nivel actual */
  margin-left: 8px; /* Espacio a la izquierda del nivel actual */
}
</style>
