<template>
  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Clientes"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[0]"
      >
        <template v-slot:top-right>
          <q-item>
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
            <q-item-section>
              <q-btn
                dense
                outline
                color="primary"
                icon="fa-solid fa-file-arrow-down"
                @click="getExcel"
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

        <template v-slot:body-cell-hectareas_propias="props">
          <q-td>
            {{ props.row.hectareasConectadas?.hectareas_propias }}
          </q-td>
        </template>
        <template v-slot:body-cell-hectareas_rentadas="props">
          <q-td>
            {{ props.row.hectareasConectadas?.hectareas_rentadas }}
          </q-td>
        </template>
        <template v-slot:body-cell-hectareas_conectadas="props">
          <q-td>
            {{ props.row.hectareasConectadas?.hectareas_conectadas }}
          </q-td>
        </template>
        <template v-slot:body-cell-hectareas_sin_conectar="props">
          <q-td>
            {{ props.row.hectareasConectadas?.hectareas_sin_conectar }}
          </q-td>
        </template>
      </q-table>
    </q-item-section>
  </q-item>

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
          <q-btn
            label="Cerrar"
            color="red"
            v-close-popup
            @click="getRows(current_page)"
          />
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
            @update:model-value="onInputChange"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";
import { formatPhoneNumber } from "src/boot/format.js";

import ClienteAllForms from "src/components/Cliente/ClienteAllForms.vue";

const rows = ref([]);
const selectedItem = ref(null);
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
});

const states = ref([]);
const towns = ref([]);

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
  {
    name: "hectareas_propias",
    label: "H. propias",
    align: "left",
    field: "hectareas_propias",
    sortable: true,
  },
  {
    name: "hectareas_rentadas",
    label: "H. rentadas",
    align: "left",
    field: "hectareas_rentadas",
    sortable: true,
  },
  {
    name: "hectareas_conectadas",
    label: "H. conectadas",
    align: "left",
    field: "hectareas_conectadas",
    sortable: true,
  },
  {
    name: "hectareas_sin_conectar",
    label: "H. sin conectar",
    align: "left",
    field: "hectareas_sin_conectar",
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
  current_page.value = 1;
  towns.value = [];
  getRows();
};

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/cliente/options", "");
  states.value = res.states;
};

const updateTowns = (id) => {
  filterForm.value.town_id = null;
  towns.value = [];
  getTowns(id);
  onInputChange();
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
  let res = await sendRequest("POST", final, "/api/intranet/nt/clientes", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const getExcel = async () => {
  const final = {
    ...filterForm.value,
  };
  const res = await sendRequest(
    "POST",
    final,
    "/api/intranet/nt/clientes/xls",
    ""
  );
  const base64Response = await fetch(
    `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.file_base64}`
  );
  const blob = await base64Response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = res.file_name;
  link.click();
  URL.revokeObjectURL(url);
};

watch(current_page, (newPage) => {
  getRows(newPage);
});

let timeout = null;

const onInputChange = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    getRows();
  }, 1000);
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
