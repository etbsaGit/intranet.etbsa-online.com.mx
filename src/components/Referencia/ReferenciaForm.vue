<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formReferencia.nombre"
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
          filled
          dense
          v-model="formReferencia.telefono"
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
        <q-select
          v-model="formReferencia.kinship_id"
          :options="kinships"
          label="Parentesco"
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
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { referencia, cliente } = defineProps(["referencia", "cliente"]);

const kinships = ref([]);
const myForm = ref(null);

const formReferencia = ref({
  id: referencia ? referencia.id : null,
  nombre: referencia ? referencia.nombre : null,
  telefono: referencia ? referencia.telefono : null,
  kinship_id: referencia ? referencia.kinship_id : null,
  cliente_id: referencia ? referencia.cliente_id : cliente.id,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/kinship", "");
  kinships.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formReferencia,
  validate,
});
</script>
