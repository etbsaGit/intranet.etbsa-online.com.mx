<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formRepresentante.nombre"
          filled
          dense
          label="Nombre"
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formRepresentante.rfc"
          filled
          dense
          label="RFC"
          lazy-rules
          hint
          :rules="[
            (val) => !!val || 'Este campo es obligatorio',
            (val) =>
              (val && val.length === 13) ||
              'El RFC debe tener exactamente 13 caracteres',
          ]"
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
          v-model="formRepresentante.telefono"
          label="Telefono"
          mask="(###) ### - ####"
          unmasked-value
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formRepresentante.email"
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
    <q-separator />
    <q-item>
      <q-item-section>
        <q-item-label caption align="center">-Domicilio-</q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formRepresentante.state_entity_id"
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
          @update:model-value="updateTowns(formRepresentante.state_entity_id)"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formRepresentante.town_id"
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
          v-model="formRepresentante.colonia"
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
          v-model="formRepresentante.calle"
          filled
          dense
          label="Calle"
          lazy-rules
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formRepresentante.codigo_postal"
          filled
          dense
          label="Codigo postal"
          lazy-rules
          mask="#####"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { representante, cliente } = defineProps(["representante", "cliente"]);

const states = ref([]);
const towns = ref([]);
const myForm = ref(null);

const formRepresentante = ref({
  id: representante ? representante.id : null,
  nombre: representante ? representante.nombre : null,
  rfc: representante ? representante.rfc : null,
  telefono: representante ? representante.telefono : null,
  email: representante ? representante.email : null,
  state_entity_id: representante ? representante.state_entity_id : null,
  town_id: representante ? representante.town_id : null,
  colonia: representante ? representante.colonia : null,
  calle: representante ? representante.calle : null,
  codigo_postal: representante ? representante.codigo_postal : null,
  cliente_id: representante ? representante.cliente_id : cliente.id,
});

const getStates = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/stateEntity", "");
  states.value = res;
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

const updateTowns = (id) => {
  formRepresentante.value.town_id = null;
  towns.value = [];
  getTowns(id);
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getStates();
  if (cliente && formRepresentante.value.state_entity_id) {
    getTowns(formRepresentante.value.state_entity_id);
  }
});

defineExpose({
  formRepresentante,
  validate,
});
</script>
