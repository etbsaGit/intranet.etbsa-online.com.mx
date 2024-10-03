<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formSale.cliente_id"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
          @update:model-value="updateRefe(formSale.cliente_id)"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                <q-btn
                  outline
                  dense
                  color="primary"
                  icon="add"
                  label="Click para agrgear cliente nuevo"
                  @click="showAdd = true"
                />
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
        </q-select>
      </q-item-section>
    </q-item>
    <q-item v-if="selectedCliente">
      <q-item-section>
        <q-select
          v-model="formSale.referencia_id"
          :options="referencias"
          label="Contacto"
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
          hint
        >
          <template v-slot:after>
            <q-item>
              <q-item-section v-if="selectedRefe" side>
                <q-item-label>
                  <strong>Telefono:</strong>
                  {{ formatPhoneNumber(selectedRefe.telefono) }}
                </q-item-label>
              </q-item-section>
              <q-item-section class="text-grey">
                <q-btn
                  outline
                  dense
                  color="primary"
                  icon="add"
                  label="Click para agrgear referencia"
                  @click="showRefe = true"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          dense
          outlined
          v-model="formSale.date"
          label="Fecha del pedido"
          :rules="[(val) => val !== null || 'Obligatorio']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date minimal v-model="formSale.date" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formSale.order"
          outlined
          dense
          label="Pedido"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formSale.serial"
          outlined
          dense
          label="# de serie"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formSale.folio"
          outlined
          dense
          label="Folio"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formSale.economic"
          outlined
          dense
          label="# economico"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formSale.invoice"
          outlined
          dense
          label="Factura"
          lazy-rules
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          outlined
          dense
          v-model="formSale.amount"
          prefix="$"
          label="Monto"
          hint
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
          input-class="text-right"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formSale.status_id"
          :options="statuses"
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
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formSale.comments"
          outlined
          dense
          label="Comentarios"
          lazy-rules
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>

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
    v-model="showRefe"
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
          <q-btn label="Agregar" color="blue" @click="postItemRefe" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <referencia-form ref="refe" :cliente="selectedCliente" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest } from "src/boot/functions";
import { formatPhoneNumber } from "src/boot/format";

import ClienteForm from "src/components/Cliente/ClienteForm.vue";
import ReferenciaForm from "src/components/Referencia/ReferenciaForm.vue";

const { sale } = defineProps(["sale"]);

const showAdd = ref(false);
const add = ref(null);

const showRefe = ref(false);
const refe = ref(null);

const clientes = ref([]);
const referencias = ref([]);
const statuses = ref([]);
const filterClientes = ref(null);
const selectedCliente = ref(null);
const selectedRefe = ref(null);

const myForm = ref(null);

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
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/sale/options", "");
  clientes.value = res.clientes;
  statuses.value = res.statuses;
};

const updateRefe = (id) => {
  formSale.value.referencia_id = null;
  referencias.value = [];
  if (id) {
    getRefe(id);
  }
};

const getRefe = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/referencia/cliente/" + id,
    ""
  );
  referencias.value = res;
};

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

// Watch para obtener los datos del cliente seleccionado
watch(
  () => formSale.value.referencia_id,
  (newValue) => {
    selectedRefe.value =
      referencias.value.find((refe) => refe.id === newValue) || null;
  }
);

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formCliente,
  };
  let res = await sendRequest("POST", final, "/api/intranet/cliente", "");
  showAdd.value = false;
  getOptions();
};

const postItemRefe = async () => {
  const refe_valid = await refe.value.validate();
  if (!refe_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...refe.value.formReferencia,
  };
  let res = await sendRequest("POST", final, "/api/intranet/referencia", "");
  showRefe.value = false;
  getRefe(formSale.value.cliente_id);
};

const validate = async () => {
  return await myForm.value.validate();
};

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
  });
});

defineExpose({
  formSale,
  validate,
});
</script>
