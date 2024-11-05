<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section class="col-2">
        <q-input
          v-model="formCliente.equip"
          filled
          dense
          label="# Equip"
          lazy-rules
          hint
          mask="#####"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formCliente.nombre"
          filled
          dense
          label="Nombre / Razon social"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-select
          v-model="formCliente.tipo"
          :options="sat"
          label="Tipo de persona"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formCliente.rfc"
          filled
          dense
          label="RFC"
          lazy-rules
          hint
          :rules="[
            (val) => !!val || 'Este campo es obligatorio',
            (val) =>
              (val && val.length >= 12 && val.length <= 13) ||
              'El RFC debe tener entre 12 y 13 caracteres',
          ]"
        />
      </q-item-section>

      <q-item-section>
        <q-input
          v-model="formCliente.curp"
          filled
          dense
          label="CURP"
          lazy-rules
          hint
        />
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item>
      <q-item-section>
        <q-item-label caption align="center">-Datos de contacto-</q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formCliente.telefono"
          label="Telefono movil"
          mask="(###) ### - ####"
          unmasked-value
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        >
          <template v-slot:prepend>
            <q-icon name="fa-brands fa-whatsapp" />
          </template>
        </q-input>
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formCliente.telefono_casa"
          label="Telefono fijo"
          mask="(###) ### - ####"
          unmasked-value
          hint
        >
          <template v-slot:prepend>
            <q-icon name="fa-solid fa-phone" />
          </template>
        </q-input>
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formCliente.email"
          label="Email"
          :rules="[
            (val) =>
              !val ||
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
              'Formato de correo inválido',
          ]"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formCliente.state_entity_id"
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
          filled
          dense
          @update:model-value="updateTowns(formCliente.state_entity_id)"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formCliente.town_id"
          :options="towns"
          label="Ciudad"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formCliente.colonia"
          filled
          dense
          label="Colonia"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formCliente.calle"
          filled
          dense
          label="Calle"
          lazy-rules
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formCliente.codigo_postal"
          filled
          dense
          label="Codigo postal"
          lazy-rules
          mask="#####"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item>
      <q-item-section>
        <q-item-label caption align="center">
          -Segmentacion del cliente-
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formCliente.classification_id"
          :options="classifications"
          label="Clasificacion general"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formCliente.segmentation_id"
          :options="segmentations"
          label="Segmentacion"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formCliente.tactic_id"
          :options="tactics"
          label="Tacticas John Deere"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formCliente.construction_classification_id"
          :options="constructionClassifications"
          label="Clasificacion Construccion"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          clearable
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { cliente } = defineProps(["cliente"]);

const sat = ["fisica", "moral"];
const states = ref([]);
const towns = ref([]);
const classifications = ref([]);
const segmentations = ref([]);
const tactics = ref([]);
const constructionClassifications = ref([]);

const myForm = ref(null);

const formCliente = ref({
  id: cliente ? cliente.id : null,
  equip: cliente ? cliente.equip : null,
  nombre: cliente ? cliente.nombre : null,
  tipo: cliente ? cliente.tipo : null,
  rfc: cliente ? cliente.rfc : null,
  curp: cliente ? cliente.curp : null,
  telefono: cliente ? cliente.telefono : null,
  telefono_casa: cliente ? cliente.telefono_casa : null,
  email: cliente ? cliente.email : null,
  state_entity_id: cliente ? cliente.state_entity_id : null,
  town_id: cliente ? cliente.town_id : null,
  colonia: cliente ? cliente.colonia : null,
  calle: cliente ? cliente.calle : null,
  codigo_postal: cliente ? cliente.codigo_postal : null,
  classification_id: cliente ? cliente.classification_id : null,
  segmentation_id: cliente ? cliente.segmentation_id : null,

  tactic_id: cliente ? cliente.tactic_id : null,
  construction_classification_id: cliente
    ? cliente.construction_classification_id
    : null,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/cliente/options", "");
  states.value = res.states;
  classifications.value = res.classifications;
  segmentations.value = res.segmentations;
  tactics.value = res.tactics;
  constructionClassifications.value = res.constructionClassifications;
};

const updateTowns = (id) => {
  formCliente.value.town_id = null;
  towns.value = [];
  getTowns(id);
};

const getTowns = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/town/state/" + id,
    ""
  );
  towns.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  if (cliente && formCliente.value.state_entity_id) {
    getTowns(formCliente.value.state_entity_id);
  }
  getOptions();
});

defineExpose({
  formCliente,
  validate,
});
</script>
