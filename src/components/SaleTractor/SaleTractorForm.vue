<template>

  <q-form>
    <!-- SELECCIONAR CLIENTE -->
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mb-md">
          Cliente
        </q-item-label>
        <q-select v-model="formSale.cliente_id" :options="filterClientes" label="Cliente" option-value="id"
          option-label="nombre" option-disable="inactive" emit-value map-options transition-show="jump-up"
          transition-hide="jump-up" outlined dense clearable options-dense use-input @filter="filterFn"
          input-debounce="0" behavior="menu" :rules="[(val) => val !== null || 'Obligatorio']"
          @update:model-value="updateRefe(formSale.cliente_id)">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                <q-btn outline dense color="primary" icon="add" label="Click para agregar cliente nuevo"
                  @click="showAdd = true" />
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:after>
            <q-item>
              <q-item-section v-if="selectedCliente" side>
                <q-item-label>
                  <strong>RFC:</strong>
                  {{ selectedCliente.rfc }}
                </q-item-label>
              </q-item-section>
              <q-item-section v-if="selectedCliente" side>
                <q-item-label>
                  <strong>CURP:</strong>
                  {{ selectedCliente.curp }}
                </q-item-label>
              </q-item-section>
              <q-item-section v-if="selectedCliente" side>
                <q-item-label>
                  <strong>Telefono:</strong>
                  {{ formatPhoneNumber(selectedCliente.telefono) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                {{ scope.opt.nombre }}
              </q-item-section>
              <q-item-section>
                Telefono: {{ formatPhoneNumber(scope.opt.telefono) }}
              </q-item-section>
              <q-item-section> RFC: {{ scope.opt.rfc }} </q-item-section>
              <q-item-section> CURP: {{ scope.opt.curp }} </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <!-- REFERENCIAS CLIENTE -->
    <q-item v-if="selectedCliente">
      <q-item-section>
        <q-select v-model="formSale.referencia_id" :options="referencias" label="Contacto" option-value="id"
          option-label="nombre" option-disable="inactive" emit-value map-options transition-show="jump-up"
          transition-hide="jump-up" outlined dense clearable options-dense hint>
          <template v-slot:after>
            <q-item>
              <q-item-section v-if="selectedRefe" side>
                <q-item-label>
                  <strong>Telefono:</strong>
                  {{ formatPhoneNumber(selectedRefe.telefono) }}
                </q-item-label>
              </q-item-section>
              <q-item-section class="text-grey">
                <q-btn outline dense color="primary" icon="add" label="Click para agrgear referencia"
                  @click="showRefe = true" />
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                {{ scope.opt.nombre }}
              </q-item-section>

              <q-item-section side>
                {{ formatPhoneNumber(scope.opt.telefono) }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <!-- VENDEDOR/SUCURSAL -->
    <q-item>
      <!-- SELECCIONAR VENDEDOR -->
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mb-md">
          Vendedor
        </q-item-label>
        <q-select v-model="formSale.empleado_id" :options="filterEmpleados" label="Vendedor" option-value="id"
          option-label="nombreCompleto" option-disable="inactive" emit-value map-options transition-show="jump-up"
          transition-hide="jump-up" outlined dense clearable options-dense use-input @filter="filterFnE"
          input-debounce="0" behavior="menu" :rules="[(val) => val !== null || 'Obligatorio']">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                <q-btn outline dense color="primary" icon="add" label="Click para agregar cliente nuevo"
                  @click="showAdd = true" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
      <!-- SELCCIONAR SUCURSAL -->
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mb-md">
          Sucursal
        </q-item-label>
        <q-select v-model="formSale.sucursal_id" :options="sucursales" label="Sucursal" option-value="id"
          option-label="nombre" option-disable="inactive" emit-value map-options transition-show="jump-up"
          transition-hide="jump-up" outlined dense clearable options-dense use-input input-debounce="0" behavior="menu"
          :rules="[(val) => val !== null || 'Obligatorio']">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                <q-btn outline dense color="primary" icon="add" label="Click para agregar cliente nuevo"
                  @click="showAdd = true" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <!-- SELECCIONAR MODELO TRACTOR -->
    <q-item>
      <!-- SELECCIÓN DE MODELO -->
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mb-md">
          Modelo
        </q-item-label>
        <q-select v-model="formSale.inv_model_id" :options="filterModelos" label="Tractor" option-value="id"
          option-label="name" option-disable="inactive" emit-value map-options transition-show="jump-up"
          transition-hide="jump-up" outlined dense clearable options-dense use-input @filter="filterFnM"
          input-debounce="0" behavior="menu" :rules="[(val) => val !== null || 'Obligatorio']">
          <!-- OPTIONS -->
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                Código:{{ scope.opt.code }}
              </q-item-section>
              <q-item-section>
                Modelo: {{ scope.opt.name }}
              </q-item-section>
              <q-item-section></q-item-section>
              <q-item-section></q-item-section>
            </q-item>
          </template>
        </q-select>
        <!-- Detalles del modelo -->
        <q-item v-if="selectedModelo" class="q-mt-sm">
          <q-item-section>
            <!-- TÍTULO -->
            <div class="text-subtitle2 q-mb-md">
              Detalles de la unidad:
              Código: <i>{{ selectedModelo.code }}</i>
              Modelo: <i>{{ selectedModelo.name }}</i>
            </div>
            <!-- CONFIGURACIONES -->
            <div>
              <div class="text-subtitle2 q-mb-sm">
                Configuraciones
              </div>
              <div class="row q-col-gutter-sm">
                <div v-for="config in selectedModelo.inv_configurations" :key="config.id"
                  class="col-12 col-sm-6 col-md-3">
                  <q-checkbox v-model="selectedConfigs" :val="config.id" :label="`${config.code} - ${config.name}`"
                    dense />
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <!-- CONFIGURACIONES EXTRAS -->
        <q-item v-if="selectedModelo">
          <q-item-section>
            <!-- BUSCADOR -->
            <q-select v-model="configSearch" :options="filteredConfigs" option-value="id"
              :option-label="opt => `${opt.code} - ${opt.name}`" use-input input-debounce="0"
              label="Buscar configuración" emit-value map-options outlined dense @update:model-value="addConfig"
              @filter="filterConfigs" class="q-mt-sm" />
            <!-- CHIPS -->
            <div class="q-mt-sm">
              <div class="text-subtitle2">Configuraciones agregadas</div>

              <q-chip v-for="id in manualConfigs" :key="id" removable @remove="removeConfig(id)"
                class="q-mt-sm q-mr-sm">
                {{ getConfigLabel(id) }}
              </q-chip>
            </div>
          </q-item-section>
        </q-item>
      </q-item-section>
    </q-item>
    <!-- POLZIA MTTO, M.OBRA, BOLETÍN, APORTACIÓN -->
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mb-md">
          Poliza de Mtto. 2000 Hrs
        </q-item-label>
        <q-input v-model="formSale.poliza_mtto" outlined dense label="Poliza de Mantenimiento 2000 Hrs" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mb-md">
          Táctica de M. Obra
        </q-item-label>
        <q-input v-model="formSale.tactica_mobra" outlined dense label="Táctica de M. Obra" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mb-md">
          Boletín
        </q-item-label>
        <q-input v-model="formSale.boletin" outlined dense label="Boletín" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mb-md">
          Aportación
        </q-item-label>
        <q-input v-model="formSale.aportación" outlined dense label="Aportación" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']" />
      </q-item-section>
    </q-item>
    <!-- PRECIO TOTAL -->
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mb-md">
          Precio
        </q-item-label>
        <q-input outlined dense v-model="formSale.precio" prefix="$" label="Monto" hint mask="#.##" fill-mask="0"
          reverse-fill-mask input-class="text-right" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mb-md">
          Forma de Pago
        </q-item-label>
        <q-select v-model="formSale.forma_pado_id" :options="formasPago" label="Forma de Pago" option-value="id"
          option-label="nombre" option-disable="inactive" emit-value map-options transition-show="jump-up"
          transition-hide="jump-up" clearable outlined dense :rules="[(val) => val !== null || 'Obligatorio']" />
      </q-item-section>
    </q-item>
    <!-- ENGANCHE, MONTO, PORCENTAJE -->
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mb-md">
          Enganche
        </q-item-label>
        <q-input outlined dense v-model="formSale.enganche" prefix="$" label="Monto" hint mask="#.##" fill-mask="0"
          reverse-fill-mask input-class="text-right" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mb-md">
          Porcentaje
        </q-item-label>
        <q-input outlined dense v-model="formSale.porcentaje" label="Porcentaje" input-class="text-right" suffix="%"
          hint readonly />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mb-md">
          Plazo
        </q-item-label>
        <q-input outlined dense v-model="formSale.plazo" label="Plazo" input-class="text-right" suffix="meses" />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest } from "src/boot/functions";
import { formatPhoneNumber } from "src/boot/format";
import { checkRole } from "src/boot/functions";
import ClienteForm from "src/components/Cliente/ClienteForm.vue";
import ReferenciaForm from "src/components/Referencia/ReferenciaForm.vue";
import { computed } from 'vue'

const showAdd = ref(false);
const add = ref(null);

const showRefe = ref(false);
const refe = ref(null);

const clientes = ref([]);
const referencias = ref([]);
const statuses = ref([]);
const empleados = ref([]);
const modelos_tractor = ref([]);
const sucursales = ref([]);
const formasPago = ref([]);
const filterEmpleados = ref(null);
const filterModelos = ref([null]);
const filterClientes = ref(null);
const selectedCliente = ref(null);
const selectedModelo = ref([null]);
const selectedRefe = ref(null);
const modelConfigs = ref([])     // las que vienen del modelo
const manualConfigs = ref([])    // las que agrega el usuario
const configSearch = ref(null);
const allConfigs = ref([]);
const filteredConfigs = ref([]);
const selectedConfigs = computed(() => {
  return [...modelConfigs.value, ...manualConfigs.value]
});

const myForm = ref(null);

const { sale } = defineProps(["sale"]);
const formSale = ref({
  id: sale ? sale.id : null,
  amount: sale ? sale.amount : null,
  comments: sale ? sale.comments : null,
  serial: sale ? sale.serial : null,
  invoice: sale ? sale.invoice : null,
  order: sale ? sale.order : null,
  folio: sale ? sale.folio : null,
  economic: sale ? sale.economic : null,
  validated: sale ? sale.validated : null,
  date: sale ? sale.date : null,
  cliente_id: sale ? sale.cliente_id : null,
  status_id: sale ? sale.status_id : null,
  referencia_id: sale ? sale.referencia_id : null,
  empleado_id: sale ? sale.empleado_id : null,
  sucursal_id: sale ? sale.sucursal_id : null,
  cancellation_date: sale ? sale.cancellation_date : null,
  cancellation_folio: sale ? sale.cancellation_folio : null,
  cancellation: sale ? sale.cancellation : 0,
  inv_model_id: sale ? sale.inv_model_id : null,
  precio: sale ? sale.precio : null,
  enganche: sale ? sale.enganche : null,


});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/sale-tractor/options", "");
  clientes.value = res.clientes;
  statuses.value = res.statuses;
  empleados.value = res.empleados;
  sucursales.value = res.sucursales;
  modelos_tractor.value = res.modelos_tractor;
  allConfigs.value = res.configuraciones;
  filteredConfigs.value = res.configuraciones;
  formasPago.value = res.forma_pago;
};

// FUNCIONES CLIENTE
const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      filterClientes.value = clientes.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterClientes.value = clientes.value.filter(
      (customer) => customer.nombre.toLowerCase().indexOf(needle) > -1
    );
  });
};
// Watch para obtener los datos del cliente seleccionado
watch(
  () => formSale.value.cliente_id,
  (newValue) => {
    selectedCliente.value =
      clientes.value.find((cliente) => cliente.id === newValue) || null;
  }
);
//filtro configuraciones
const filterConfigs = (val, update) => {
  update(() => {
    const needle = val.toLowerCase()

    filteredConfigs.value = allConfigs.value.filter(c =>
      c.name.toLowerCase().includes(needle) ||
      c.code.toLowerCase().includes(needle)
    )
  })
}
// FUNCIONES REFERECNIA DE CLIENTE
const getRefe = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/referencia/cliente/" + id,
    ""
  );
  referencias.value = res;
};
const updateRefe = (id) => {
  formSale.value.referencia_id = null;
  referencias.value = [];
  if (id) {
    getRefe(id);
  }
};
// Watch para obtener los datos de referencia por  seleccionado
watch(
  () => formSale.value.referencia_id,
  (newValue) => {
    selectedRefe.value =
      referencias.value.find((refe) => refe.id === newValue) || null;
  }
);

// FUNCIONES VENDEDORES/SUCURSAL
const filterFnE = (val, update) => {
  if (val === "") {
    update(() => {
      filterEmpleados.value = empleados.value;
    });
    return;
  }
};

// FUNCIONES MODELOS
const filterFnM = (val, update) => {
  update(() => {
    if (val === "") {
      filterModelos.value = modelos_tractor.value;
    } else {
      const needle = val.toLowerCase();

      filterModelos.value = modelos_tractor.value.filter(
        (v) =>
          v.name.toLowerCase().includes(needle) ||
          v.code.toLowerCase().includes(needle)
      );
    }
  });
};
// Watch para obtener los datos del modelo seleccionado
watch(
  () => formSale.value.inv_model_id,
  (newValue) => {
    selectedModelo.value =
      modelos_tractor.value.find((modelo) => modelo.id === newValue) || null;
  }
);
//watch para seleccionar todos los checkbox al cargar item
watch(() => selectedModelo.value, (newModelo) => {
  if (newModelo && newModelo.inv_configurations) {
    modelConfigs.value = newModelo.inv_configurations.map(c => c.id)
  }
})

// FUNCIÓN AGREGAR CONFIGURACIÓN
const addConfig = () => {
  if (!configSearch.value) return
  if (
    !manualConfigs.value.includes(configSearch.value) &&
    !modelConfigs.value.includes(configSearch.value)
  ) {
    manualConfigs.value.push(configSearch.value)
  }
  configSearch.value = null
}
// eliminar configuración:
const removeConfig = (id) => {
  manualConfigs.value = manualConfigs.value.filter(c => c !== id)
}
// helper
const getConfigLabel = (id) => {
  const config = allConfigs.value.find(c => c.id === id)
  return config ? `${config.code} - ${config.name}` : id
}

// FUNCIONES PARA PRECIO, ENGANCHE, PORCENTAJE
watch(
  () => [formSale.value.precio, formSale.value.enganche],
  ([precio, enganche]) => {
    const p = parseFloat(precio)
    const e = parseFloat(enganche)

    if (!isNaN(p) && p > 0 && !isNaN(e)) {
      formSale.value.porcentaje = ((e / p) * 100).toFixed(2)
    } else {
      formSale.value.porcentaje = null
    }
  }
)






// MOUNTED
onMounted(() => {
  if (sale && formSale.value.cliente_id) {
    getRefe(formSale.value.cliente_id);
  }
  getOptions().then(() => {
    // Esto asegura que `clientes` esté cargado antes de asignar `selectedCliente`
    if (formSale.value.cliente_id) {
      selectedCliente.value =
        clientes.value.find(
          (cliente) => cliente.id === formSale.value.cliente_id
        ) || null;
    }
    // Esto asegura que `clientes` esté cargado antes de asignar `selectedCliente`
    if (formSale.value.referencia_id) {
      selectedRefe.value =
        referencias.value.find(
          (refe) => refe.id === formSale.value.referencia_id
        ) || null;
    }
    // Esto asegura que `modelos` esté cargado antes de asignar `selectedModelo`
    if (formSale.value.inv_model_id) {
      selectedModelo.value =
        modelos_tractor.value.find(
          (modelo) => modelo.id === formSale.value.inv_model_id
        ) || null;
    }
  });
});



</script>
