<template>
  <q-form ref="myForm" greedy class="form-container">
    <q-item class="form-row">
      <q-item-section avatar>
        <q-input
          v-model="formModel.code"
          outlined
          dense
          label="Código"
          lazy-rules
          class="form-input"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>

      <q-item-section>
        <q-input
          v-model="formModel.name"
          outlined
          dense
          label="Nombre"
          lazy-rules
          class="form-input"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>

    <q-item class="form-row">
      <q-item-section>
        <q-input
          v-model="formModel.price"
          outlined
          dense
          label="Precio"
          prefix="$"
          mask="###,###,###,###"
          unmasked-value
          reverse-fill-mask
          input-class="text-right"
          class="form-input"
          :rules="[
            (val) =>
              val === null ||
              val === '' ||
              Number(val) > 0 ||
              'Debe ser mayor a 0',
          ]"
        />
      </q-item-section>

      <q-item-section>
        <q-file
          clearable
          outlined
          dense
          v-model="model"
          hint
          label="Buscar documento"
          accept=".pdf"
          class="form-input"
          @input="convertirFile($event)"
        />
      </q-item-section>
    </q-item>

    <q-item class="form-row">
      <q-item-section>
        <q-input
          v-model="formModel.description"
          outlined
          dense
          label="Descripción"
          type="textarea"
          class="form-input"
        />
      </q-item-section>
    </q-item>

    <q-splitter v-model="splitterModel" class="splitter">
      <!-- ASIGNADAS -->
      <template #before>
        <div class="panel">
          <div class="panel-title">Configuraciones asignadas</div>

          <q-expansion-item
            v-for="grupo in configuracionesAsignadasPorCategoria"
            :key="grupo.id"
            expand-separator
            default-opened
            :label="grupo.name"
            header-class="expansion-header"
          >
            <q-list bordered separator>
              <q-item v-for="conf in grupo.items" :key="conf.id" tag="label">
                <q-item-section>
                  <q-item-label class="item-code">{{ conf.code }}</q-item-label>
                  <q-item-label caption>{{ conf.name }}</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-checkbox
                    v-model="selectedConfigurations"
                    :val="conf.id"
                    color="blue"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </div>
      </template>

      <!-- DISPONIBLES -->
      <template #after>
        <div class="panel">
          <div class="panel-title">Configuraciones disponibles</div>
          <q-select
            v-model="selectedCategory"
            :options="invCategories"
            label="Categoría"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            outlined
            dense
            clearable
            class="form-input"
            @update:model-value="getConfigurations"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    {{ scope.opt.name }}
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>
                    {{ scope.opt.status?.nombre }}
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>
                    {{ scope.opt.inv_group?.name }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-list bordered separator>
            <q-item
              v-for="conf in configuracionesDisponibles"
              :key="conf.id"
              tag="label"
            >
              <q-item-section>
                <q-item-label class="item-code">{{ conf.code }}</q-item-label>
                <q-item-label caption>{{ conf.name }}</q-item-label>
              </q-item-section>

              <q-item-section avatar>
                <q-checkbox
                  v-model="selectedConfigurations"
                  :val="conf.id"
                  color="green"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>
    </q-splitter>
  </q-form>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { sendRequest } from "src/boot/functions";

const { invModel } = defineProps(["invModel"]);

const splitterModel = ref(50);

const assignedConfigurations = ref([]); // las del modelo (globales)
const categoryConfigurations = ref([]); // SOLO de la categoría activa
const selectedConfigurations = ref([]); // IDs asignados (truth)

const myForm = ref(null);
const model = ref(null);
const invCategories = ref([]);
const selectedCategory = ref(null);

const formModel = ref({
  id: invModel ? invModel.id : null,
  code: invModel ? invModel.code : null,
  name: invModel ? invModel.name : null,
  price: invModel ? invModel.price : null,
  description: invModel ? invModel.description : null,
  inv_configurations: invModel
    ? invModel.inv_configurations.map((c) => c.id)
    : [],
  base64: null,
});

const convertirFile = (event) => {
  const archivos = event.target.files;
  if (archivos) {
    Array.from(archivos).forEach((archivo) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        formModel.value.base64 = base64Data;
      };
      reader.readAsDataURL(archivo);
    });
  }
};

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/invModel/category",
    ""
  );
  invCategories.value = res.invCategories;
};

const getConfigurations = async (categoryId) => {
  if (!categoryId) {
    categoryConfigurations.value = [];
    return;
  }

  const res = await sendRequest(
    "GET",
    null,
    "/api/intranet/invModel/configurations/" + categoryId,
    ""
  );

  categoryConfigurations.value = res.invConfigurations;
};

const configuracionesAsignadasPorCategoria = computed(() => {
  const grupos = {};

  assignedConfigurations.value.forEach((conf) => {
    if (!selectedConfigurations.value.includes(conf.id)) return;

    const categoryId = conf.inv_category.id;
    const categoryName = conf.inv_category.name;

    if (!grupos[categoryId]) {
      grupos[categoryId] = {
        id: categoryId,
        name: categoryName,
        items: [],
      };
    }

    grupos[categoryId].items.push(conf);
  });

  return Object.values(grupos);
});

const configuracionesDisponibles = computed(() => {
  if (!selectedCategory.value) return [];

  return categoryConfigurations.value.filter(
    (c) => !selectedConfigurations.value.includes(c.id)
  );
});

watch(selectedConfigurations, (newVal, oldVal) => {
  // AGREGADAS
  const added = newVal.filter((id) => !oldVal.includes(id));
  added.forEach((id) => {
    const conf =
      categoryConfigurations.value.find((c) => c.id === id) ||
      assignedConfigurations.value.find((c) => c.id === id);

    if (conf && !assignedConfigurations.value.some((c) => c.id === id)) {
      assignedConfigurations.value.push(conf);
    }
  });

  // QUITADAS
  const removed = oldVal.filter((id) => !newVal.includes(id));
  assignedConfigurations.value = assignedConfigurations.value.filter(
    (c) => !removed.includes(c.id)
  );

  // sync form
  formModel.value.inv_configurations = newVal;
});

onMounted(async () => {
  await getOptions();

  if (invModel?.inv_configurations?.length) {
    assignedConfigurations.value = [...invModel.inv_configurations];
    selectedConfigurations.value = invModel.inv_configurations.map((c) => c.id);
  }
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formModel,
  validate,
});
</script>

<style scoped>
/* Contenedor general */
.form-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

/* Filas del formulario */

/* Splitter */
.splitter {
  margin-top: 24px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

/* Paneles izquierdo y derecho */
.panel {
  padding: 16px;
  height: 100%;
  background-color: #fafafa;
}

/* Títulos de panel */
.panel-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #37474f;
}

/* Expansion headers */
.expansion-header {
  background-color: #f5f7fa;
  border-radius: 8px;
  font-weight: 500;
}

/* Código destacado */
.item-code {
  font-weight: 600;
  color: #1e88e5;
}
</style>
