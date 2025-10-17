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
        :rows="crud.paginatedItems"
        :columns="columns"
        row-key="id"
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
                @click="showRFC = true"
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
        <template v-slot:top-right>
          <q-item v-if="checkRole('Credito')">
            <q-item-section>
              <q-btn
                dense
                outline
                label="Asignar clientes"
                color="primary"
                @click="showAsync = true"
                icon="fa-solid fa-people-arrows"
              />
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:bottom>
          <q-space />
          <td>
            <q-pagination
              color="primary"
              v-model="crud.pagination.currentPage"
              :max="crud.pagination.lastPage"
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

  <BaseDialog v-model="showAdd" mode="create" @submit="postItem">
    <template #form>
      <cliente-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog maximized v-model="showEdit" mode="edit" @close="getRows()">
    <template #form>
      <cliente-all-forms ref="edit" :cliente="selectedItem" />
    </template>
  </BaseDialog>

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
            :options="crud.items.states"
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
            :options="crud.items.classifications"
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
            :options="crud.items.segmentations"
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
            v-model="filterForm.tactic_id"
            :options="crud.items.tactics"
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
            :options="crud.items.constructionClassifications"
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

  <BaseDialog v-model="showRFC" mode="create" @submit="getItem(rfc.rfc)">
    <template #form>
      <cliente-RFC ref="rfc" />
    </template>
  </BaseDialog>

  <BaseDialog
    fullWidth
    v-model="showAsync"
    mode="create"
    @submit="asyncCustomers"
  >
    <template #form>
      <cliente-async ref="refAsync" />
    </template>
  </BaseDialog>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { checkRole, sendRequest } from "src/boot/functions";
import { formatPhoneNumber } from "src/boot/format.js";
import { useCrudStore } from "src/stores/crud";

const crud = useCrudStore();

import BaseDialog from "src/bases/BaseDialog.vue";
import ClienteForm from "src/components/Cliente/ClienteForm.vue";
import ClienteAllForms from "src/components/Cliente/ClienteAllForms.vue";
import ClienteRFC from "src/components/Cliente/ClienteRFC.vue";
import ClienteAsync from "src/components/Cliente/ClienteAsync.vue";

const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);
const showFilters = ref(false);
const rfc = ref(null);
const showRFC = ref(false);
const showAsync = ref(false);
const refAsync = ref(null);

const baseURL = ref("/api/intranet/cliente");

const current_page = ref(1);
const towns = ref([]);

const filterForm = ref({
  search: null,
  state_entity_id: null,
  town_id: null,
  classification_id: null,
  segmentation_id: null,
  tactic_id: null,
  construction_classification_id: null,
});

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
  filterForm.value.tactic_id = null;
  filterForm.value.construction_classification_id = null;
  current_page.value = 1;
  towns.value = [];
  getRows();
};

const getOptions = async () => {
  await crud.getItems(baseURL.value + "/options");
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

const getRows = async () => {
  const filtersWithPage = {
    ...filterForm.value,
    page: crud.pagination.currentPage,
  };
  await crud.getPaginatedItems(baseURL.value + "s", filtersWithPage);
};

const postItem = async () => {
  const data = { ...add.value.formCliente };

  await crud.postItem(baseURL.value, data, add.value.validate, (res) => {
    showAdd.value = false;
    selectedItem.value = res;
    showEdit.value = true;
  });
};

const getItem = async (rfc) => {
  try {
    const res = await sendRequest(
      "GET",
      null,
      "/api/intranet/cliente/rfc/" + rfc,
      ""
    );
    const cliente = res?.cliente || res?.data?.cliente;

    selectedItem.value = cliente;
    showEdit.value = true;
    showRFC.value = false;
  } catch (error) {
    const status = error?.response?.status;
    if (status === 404) {
      showAdd.value = true;
      showRFC.value = false;
    }
  }
};

const asyncCustomers = async () => {
  const data = { ...refAsync.value };

  let res = await sendRequest(
    "POST",
    data,
    "/api/intranet/clientes/empleados/async",
    ""
  );
  showAsync.value = false;
};

watch(
  () => crud.pagination.currentPage,
  () => {
    getRows();
  }
);

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
