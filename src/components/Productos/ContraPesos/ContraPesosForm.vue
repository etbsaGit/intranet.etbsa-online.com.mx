<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>

        <!-- Número de parte -->
        <q-input v-model="formContraPeso.nro_parte" outlined dense label="Número de Parte" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />

        <!-- Descripción -->
        <q-input v-model="formContraPeso.descripcion" outlined dense label="Descripción" lazy-rules class="q-mt-sm"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />

        <!-- Trasero/Delantero -->
        <q-select v-model="formContraPeso.trasero_delantero" outlined dense clearable label="Ubicación"
          :options="opcionesUbicacion" option-label="label" option-value="value" emit-value map-options behavior="menu"
          menu-anchor="bottom left" menu-self="top left" />
        <q-item>
          <q-item-section>
            <!-- costo -->
            <q-input v-model="formContraPeso.costo" outlined dense label="Costo" lazy-rules class="q-mt-sm"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />
          </q-item-section>
          <q-item-section>
            <!-- precio -->
            <q-input v-model="formContraPeso.precio" outlined dense label="Precio" lazy-rules class="q-mt-sm"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />
          </q-item-section>
        </q-item>
        <!-- Buscador de tractores -->
        <q-select v-model="tractorSeleccionado" use-input hide-selected clearable outlined dense label="Buscar tractor"
          :options="tractoresFiltrados" option-label="label" option-value="value" @filter="filtrarTractores"
          @update:model-value="agregarTractor" behavior="menu" menu-anchor="bottom left" menu-self="top left"
          input-debounce="0" />

        <!-- Lista de tractores agregados -->
        <q-item-section>
          <div class="text-subtitle2 q-mb-sm">Tractores asignados</div>

          <q-chip v-for="tractor in tractoresSeleccionados" :key="tractor.value" removable color="primary"
            text-color="white" class="q-mr-sm q-mb-sm" @remove="eliminarTractor(tractor.value)">
            {{ tractor.label }}
          </q-chip>

          <div v-if="tractoresSeleccionados.length === 0" class="text-grey">
            No hay tractores seleccionados
          </div>
        </q-item-section>
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { watch } from "vue";

const { contrapeso } = defineProps(["contrapeso"]);

const myForm = ref(null);

const tractores = ref([]);
const tractoresFiltrados = ref([]);

const tractorSeleccionado = ref(null);

const tractoresSeleccionados = ref(
  contrapeso?.tractor_contrapesos
    ? contrapeso.tractor_contrapesos.map((tractor) => ({
      label: `${tractor.sku} - ${tractor.name}`,
      value: tractor.id,
      sku: tractor.sku,
      name: tractor.name
    }))
    : []
);

const opcionesUbicacion = [
  { label: "Delantero", value: "delantero" },
  { label: "Trasero", value: "trasero" }
];

const formContraPeso = ref({
  id: contrapeso ? contrapeso.id : null,
  nro_parte: contrapeso ? contrapeso.nro_parte : null,
  descripcion: contrapeso ? contrapeso.descripcion : null,
  trasero_delantero: contrapeso ? contrapeso.trasero_delantero : null,
  costo: contrapeso ? contrapeso.costo : null,
  precio: contrapeso ? contrapeso.precio : null,
});

const validate = async () => {
  return await myForm.value.validate();
}

const getTractores = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/tractor-contrapesos/options"
  );

  tractores.value = res.map((trac) => ({
    label: `${trac.sku} - ${trac.name}`,
    value: trac.id,
    sku: trac.sku,
    name: trac.name
  }));

  tractoresFiltrados.value = tractores.value;
};

const filtrarTractores = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();

    tractoresFiltrados.value = tractores.value.filter((tractor) => {
      const noSeleccionado = !tractoresSeleccionados.value.some(
        (sel) => sel.value === tractor.value
      );

      const coincide =
        tractor.sku.toLowerCase().includes(needle) ||
        tractor.name.toLowerCase().includes(needle);

      return coincide && noSeleccionado;
    });
  });
};

const agregarTractor = (tractor) => {
  if (!tractor) return;

  const existe = tractoresSeleccionados.value.some(
    (t) => t.value === tractor.value
  );

  if (!existe) {
    tractoresSeleccionados.value.push(tractor);
  }

  tractorSeleccionado.value = null;
};

const eliminarTractor = (id) => {
  tractoresSeleccionados.value =
    tractoresSeleccionados.value.filter(
      (t) => t.value !== id
    );
};

watch(
  () => contrapeso,
  (nuevo) => {
    if (!nuevo) return;

    formContraPeso.value = {
      id: nuevo.id,
      nro_parte: nuevo.nro_parte,
      descripcion: nuevo.descripcion,
      trasero_delantero: nuevo.trasero_delantero
        ?.trim()
        .toLowerCase(),
      costo: nuevo.costo,
      precio: nuevo.precio
    };
  },
  { immediate: true }
);

defineExpose({
  myForm,
  formContraPeso,
  tractoresSeleccionados,
  validate,
});

onMounted(() => {
  getTractores();
});
</script>
