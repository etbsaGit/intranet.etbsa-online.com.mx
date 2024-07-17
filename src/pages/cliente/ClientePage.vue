<template>
  <q-item class="custom-item" align="center">
    <q-item-section>
      <q-item-label class="custom-label">-Clientes-</q-item-label>
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Clientes"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :dense="$q.screen.lt.md"
        :rows-per-page-options="[0]"
      >
        <template v-slot:top-left>
          <q-item>
            <q-item-section>
              <q-btn
                dense
                outline
                label="Nuevo cliente"
                color="primary"
                @click="showAdd = true"
                icon="add_circle"
              />
            </q-item-section>
            <q-item-section side>
              <q-btn
                outline
                dense
                color="primary"
                icon="filter_alt"
                label="Filtros"
                @click="showFilters = true"
              />
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:bottom>
          <q-space />
          <td>
            <q-pagination
              color="primary"
              v-model="current_page"
              :max="last_page"
              :max-pages="6"
              direction-links
              boundary-links
              gutter="10px"
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
            />
          </td>
          <q-space />
        </template>
        <template v-slot:body-cell-editar="props">
          <q-td>
            <q-btn
              dense
              color="primary"
              flat
              icon="loupe"
              @click="openEdit(props.row)"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td>
            {{ props.row.state_entity?.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-ciudad="props">
          <q-td>
            {{ props.row.town?.name }}
          </q-td>
        </template>

        <template v-slot:body-cell-telefono="props">
          <q-td>
            {{ formatPhoneNumber(props.row.telefono) }}
          </q-td>
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="showAdd"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    full-width
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agregar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agregar" color="blue" @click="postItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <cliente-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">{{ selectedItem.nombre }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup @click="getRows" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <cliente-all-forms ref="edit" :cliente="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showFilters" position="top" full-width>
    <q-card style="width: 900px">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Filtros</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" icon="close" dense color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn
            label="Buscar"
            icon="search"
            dense
            color="blue"
            @click="getRows"
          />
        </q-item-section>
        <q-item-section side>
          <q-btn
            dense
            label="limpiar"
            color="orange"
            @click="clearFilters"
            icon="filter_alt_off"
          />
        </q-item-section>
      </q-item>
      <q-separator />

      <q-item>
        <q-item-section>
          <q-input
            outlined
            dense
            label="Buscar por nombre, RFC o telefono"
            v-model="filterForm.search"
            @update:model-value="onInputChange"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="filterForm.state_entity_id"
            :options="states"
            label="Estado"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            outlined
            dense
            @update:model-value="updateTowns(filterForm.state_entity_id)"
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.town_id"
            :options="towns"
            label="Ciudad"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            clearable
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="filterForm.classification_id"
            :options="classifications"
            label="Clasificacion general"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            clearable
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.segmentation_id"
            :options="segmentations"
            label="Segmentacion"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            clearable
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="filterForm.technological_capability_id"
            :options="technologicalCapabilities"
            label="Capacidad tecnologica"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            clearable
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.tactic_id"
            :options="tactics"
            label="Tacticas John Deere"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            clearable
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.construction_classification_id"
            :options="constructionClassifications"
            label="Clasificacion Construccion"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            clearable
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest } from "src/boot/functions";
import { formatPhoneNumber } from "src/boot/format.js";
import { useQuasar } from "quasar";

const $q = useQuasar();

import ClienteForm from "src/components/Cliente/ClienteForm.vue";
import ClienteAllForms from "src/components/Cliente/ClienteAllForms.vue";

const rows = ref([]);
const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);
const showFilters = ref(false);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const filterForm = ref({
  search: null,
  state_entity_id: null,
  town_id: null,
  classification_id: null,
  segmentation_id: null,
  technological_capability_id: null,
  tactic_id: null,
  construction_classification_id: null,
});

const states = ref([]);
const towns = ref([]);
const classifications = ref([]);
const segmentations = ref([]);
const technologicalCapabilities = ref([]);
const tactics = ref([]);
const constructionClassifications = ref([]);

const columns = [
  {
    name: "editar",
    field: "editar",
    align: "left",
    label: "detalle",
  },
  {
    name: "equip",
    label: "# equip",
    align: "left",
    field: "equip",
    sortable: true,
  },
  {
    name: "nombre",
    label: "Nombre",
    align: "left",
    field: "nombre",
    sortable: true,
  },
  {
    name: "rfc",
    label: "RFC",
    align: "left",
    field: "rfc",
    sortable: true,
  },
  {
    name: "telefono",
    label: "Telefono",
    align: "left",
    field: "telefono",
    sortable: true,
  },
  {
    name: "estado",
    label: "Estado",
    align: "left",
    field: "estado",
    sortable: true,
  },
  {
    name: "ciudad",
    label: "Ciudad",
    align: "left",
    field: "ciudad",
    sortable: true,
  },
];

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const clearFilters = () => {
  filterForm.value.search = null;
  filterForm.value.state_entity_id = null;
  filterForm.value.town_id = null;
  filterForm.value.classification_id = null;
  filterForm.value.segmentation_id = null;
  filterForm.value.technological_capability_id = null;
  filterForm.value.tactic_id = null;
  filterForm.value.construction_classification_id = null;
  current_page.value = 1;
  towns.value = [];
  getRows();
};

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/cliente/options", "");
  states.value = res.states;
  classifications.value = res.classifications;
  segmentations.value = res.segmentations;
  technologicalCapabilities.value = res.technologicalCapabilities;
  tactics.value = res.tactics;
  constructionClassifications.value = res.constructionClassifications;
};

const updateTowns = (id) => {
  filterForm.value.town_id = null;
  towns.value = [];
  getTowns(id);
};

const getTowns = async (id) => {
  if (id == null) {
    return;
  }
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/town/state/" + id,
    ""
  );
  towns.value = res;
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/intranet/clientes", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...add.value.formCliente,
  };
  let res = await sendRequest("POST", final, "/api/intranet/cliente", "");
  showAdd.value = false;
  selectedItem.value = res;
  showEdit.value = true;
};

watch(current_page, (newPage) => {
  getRows(newPage);
});

let timeout = null;

const onInputChange = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    getRows();
  }, 2000);
};

onMounted(() => {
  getRows();
  getOptions();
});
</script>

<style scoped>
.custom-item {
  border-radius: 8px; /* Bordes redondeados */
  padding: 10px; /* Espaciado interno */
}

.custom-label {
  font-size: 1.2em; /* Tamaño de fuente aumentado */
  font-weight: bold; /* Negrita */
}
</style>
