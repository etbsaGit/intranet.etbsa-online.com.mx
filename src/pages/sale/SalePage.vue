<template>
  <q-item class="custom-item" align="center">
    <q-item-section>
      <q-item-label class="custom-label">-Pedidos-</q-item-label>
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        :rows="crud.paginatedItems"
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
                label="Agregar pedido"
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
        <template v-slot:top-right>
          <q-item v-if="checkRole('Admin')">
            <q-item-section>
              <q-btn
                dense
                outline
                label="Validar pedidos"
                color="primary"
                @click="showValid = true"
                icon="task_alt"
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
        <template v-slot:body-cell-cliente="props">
          <q-td>
            <q-item dense class="q-pa-none">
              <q-item-section>
                <q-item-label>
                  {{ props.row.cliente.nombre }}
                </q-item-label>
                <q-item-label caption>
                  {{ props.row.referencia?.nombre }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td>
            {{ props.row.status.nombre }}
          </q-td>
        </template>
        <template v-slot:body-cell-folio="props">
          <q-td>
            <q-item dense class="q-pa-none">
              <q-item-section>
                <q-chip
                  v-if="props.row.folio"
                  color="green-3"
                  text-color="black"
                  :label="props.row.folio"
                />
                <q-chip
                  v-if="props.row.cancellation_folio"
                  color="red-3"
                  text-color="black"
                  :label="props.row.cancellation_folio"
                />
              </q-item-section>
            </q-item>
          </q-td>
        </template>
        <template v-slot:body-cell-validated="props">
          <q-td>
            <q-chip
              clickable
              color="red-10"
              text-color="white"
              icon="close"
              v-if="props.row.validated == 0"
              @click="openEditValidate(props.row)"
            >
              <q-tooltip class="bg-red text-h6">
                {{ props.row.feedback }}
              </q-tooltip>
            </q-chip>
            <q-chip
              clickable
              color="green-10"
              text-color="white"
              icon="check"
              v-else-if="props.row.validated == 1"
              @click="openEditValidate(props.row)"
            >
              <q-tooltip class="bg-green text-h6">
                {{ props.row.feedback }}
              </q-tooltip>
            </q-chip>
            <q-chip color="grey-9" text-color="white" icon="error" v-else />
          </q-td>
        </template>
        <template v-slot:body-cell-date="props">
          <q-td>
            <q-item dense class="q-pa-none">
              <q-item-section>
                <q-chip color="green-3" text-color="black" icon="event">
                  {{ props.row.date }}
                </q-chip>
                <q-chip
                  v-if="props.row.cancellation_date"
                  color="red-3"
                  text-color="black"
                  icon="event"
                >
                  {{ props.row.date }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-td>
        </template>
        <template v-slot:body-cell-origin="props">
          <q-td>
            <q-item dense class="q-pa-none">
              <q-item-section>
                <q-item-label>
                  {{ props.row.empleado.nombreCompleto }}
                </q-item-label>
                <q-item-label caption>
                  {{ props.row.sucursal.nombre }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <BaseDialog full-width v-model="showAdd" mode="create" @submit="postItem">
    <template #form>
      <sale-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog full-width v-model="showEdit" mode="edit" @submit="putItem">
    <template #form>
      <sale-form ref="edit" :sale="selectedItem" />
    </template>
  </BaseDialog>

  <BaseDialog full-width v-model="showValid" mode="edit" @submit="putValidated">
    <template #form>
      <sale-validate-form ref="valid" />
    </template>
  </BaseDialog>

  <BaseDialog full-width v-model="showEditValid" mode="edit" @submit="putItem">
    <template #form>
      <sale-edit-validate-form ref="edit" :sale="selectedItem" />
    </template>
  </BaseDialog>

  <q-dialog v-model="showFilters" position="top" full-width>
    <q-card>
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
            label="Buscar"
            v-model="filterForm.search"
            @update:model-value="onInputChange"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            :color="filterForm.cancellation == 1 ? 'red' : 'green'"
            keep-color
            v-model="filterForm.cancellation"
            label="Canceladas"
            checked-icon="close"
            unchecked-icon="check"
            :true-value="1"
            :false-value="0"
          />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-select
            v-model="filterForm.cliente_id"
            :options="filterClientes"
            label="Cliente"
            option-value="id"
            option-label="nombre"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            clearable
            options-dense
            use-input
            @filter="filterFn"
            input-debounce="0"
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No result </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.status_id"
            :options="crud.items.statuses"
            label="Tipo de pedido"
            option-value="id"
            option-label="nombre"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            outlined
            dense
          />
        </q-item-section>
      </q-item>
      <q-item v-if="checkRole('Admin')">
        <q-item-section>
          <q-select
            v-model="filterForm.empleado_id"
            :options="filterEmpleados"
            label="Vendedor"
            option-value="id"
            option-label="apellidoCompleto"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            clearable
            options-dense
            use-input
            @filter="filterFnE"
            input-debounce="0"
            behavior="menu"
            hint
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No result </q-item-section>
              </q-item>
            </template>
            <!-- Esto es para editar como quieres que se vean las opciones -->
            <!-- <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-avatar v-if="scope.opt.picture">
                    <img :src="scope.opt.picture" />
                  </q-avatar>
                  <q-avatar v-else color="primary" text-color="white">
                    {{ scope.opt.nombre.charAt(0).toUpperCase()
                    }}{{ scope.opt.apellido_paterno.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  {{ scope.opt.apellidoCompleto }}
                </q-item-section>
              </q-item>
            </template> -->
          </q-select>
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.sucursal_id"
            :options="crud.items.sucursales"
            label="Sucursal"
            option-value="id"
            option-label="nombre"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            outlined
            dense
            hint
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";
import { checkRole } from "src/boot/functions";
import { useCrudStore } from "src/stores/crud";

const crud = useCrudStore();

import BaseDialog from "src/bases/BaseDialog.vue";
import SaleForm from "src/components/Sale/SaleForm.vue";
import SaleValidateForm from "src/components/Sale/SaleValidateForm.vue";
import SaleEditValidateForm from "src/components/Sale/SaleEditValidateForm.vue";

const rows = ref([]);
const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);
const showValid = ref(false);
const valid = ref(null);
const showEditValid = ref(false);
const showFilters = ref(false);

const baseURL = ref("/api/intranet/sale");

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const filterForm = ref({
  search: null,
  cancellation: null,
  cliente_id: null,
  status_id: null,
  sucursal_id: null,
  empleado_id: null,
  validate: null,
});

const clientes = ref([]);
const filterClientes = ref(null);
const statuses = ref([]);
const empleados = ref([]);
const filterEmpleados = ref(null);
const sucursales = ref([]);

const columns = [
  {
    name: "editar",
    field: "editar",
    align: "left",
    label: "detalle",
  },
  // {
  //   name: "order",
  //   label: "# de orden",
  //   align: "left",
  //   field: "order",
  //   sortable: true,
  // },
  // {
  //   name: "serial",
  //   label: "# de serie",
  //   align: "left",
  //   field: "serial",
  //   sortable: true,
  // },
  {
    name: "economic",
    label: "# economico",
    align: "left",
    field: "economic",
    sortable: true,
  },
  {
    name: "invoice",
    label: "Factura",
    align: "left",
    field: "invoice",
    sortable: true,
  },
  {
    name: "folio",
    label: "# de folio",
    align: "left",
    field: "folio",
    sortable: true,
  },
  {
    name: "date",
    label: "Fecha",
    align: "left",
    field: "date",
    sortable: true,
  },
  {
    name: "origin",
    label: "Origen",
    align: "left",
    field: "origin",
    sortable: true,
  },
  {
    name: "cliente",
    label: "Cliente",
    align: "left",
    field: "cliente",
    sortable: true,
  },

  // {
  //   name: "status",
  //   label: "Tipo",
  //   align: "left",
  //   field: "status",
  //   sortable: true,
  // },
  {
    name: "validated",
    label: "Validado",
    align: "left",
    field: "validated",
    sortable: true,
  },
];

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const openEditValidate = (item) => {
  if (checkRole("Admin")) {
    selectedItem.value = item;
    showEditValid.value = true;
  }
};

const clearFilters = () => {
  filterForm.value.search = null;
  filterForm.value.cancellation = null;
  filterForm.value.cliente_id = null;
  filterForm.value.status_id = null;
  filterForm.value.sucursal_id = null;
  filterForm.value.empleado_id = null;
  filterForm.value.validate = null;
  current_page.value = 1;
  getRows();
};

const getOptions = async () => {
  await crud.getItems(baseURL.value + "/options");
};

const getRows = async () => {
  const filtersWithPage = {
    ...filterForm.value,
    page: crud.pagination.currentPage,
  };
  await crud.getPaginatedItems(baseURL.value + "s", filtersWithPage);
};

const postItem = async () => {
  const data = { ...add.value.formSale };
  await crud.postItem(baseURL.value, data, add.value.validate, () => {
    showAdd.value = false;
    getRows();
  });
};

const putItem = async () => {
  const data = { ...edit.value.formSale };

  await crud.putItem(baseURL.value, data, edit.value.validate, () => {
    showEdit.value = false;
    showEditValid.value = false;
    getRows();
  });
};

const putValidated = async () => {
  const data = { ...valid.value.salesData };
  await crud.postItem(
    baseURL.value + "/post/validated",
    data,
    valid.value.validate,
    () => {
      showValid.value = false;
      getRows();
    }
  );
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
  }, 2000);
};

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      filterClientes.value = crud.items.clientes;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterClientes.value = crud.items.clientes.filter(
      (customer) => customer.nombre.toLowerCase().indexOf(needle) > -1
    );
  });
};

const filterFnE = (val, update) => {
  if (val === "") {
    update(() => {
      filterEmpleados.value = crud.items.empleados;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterEmpleados.value = crud.items.empleados.filter(
      (empleado) => empleado.apellidoCompleto.toLowerCase().indexOf(needle) > -1
    );
  });
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
