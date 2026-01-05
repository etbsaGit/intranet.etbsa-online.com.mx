<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formRiego.riego_id"
          :options="riegos"
          label="Tipo de riego"
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          options-dense
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
          v-model="formRiego.hectareas_propias"
          filled
          dense
          label="Hectareas propias"
          lazy-rules
          hint
          mask="#####"
          reverse-fill-mask
          unmasked-value
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formRiego.hectareas_rentadas"
          filled
          dense
          label="Hectareas rentadas"
          lazy-rules
          hint
          mask="#####"
          reverse-fill-mask
          unmasked-value
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { riego, cliente } = defineProps(["riego", "cliente"]);

const riegos = ref([]);

const myForm = ref(null);

const formRiego = ref({
  id: riego ? riego.id : null,
  hectareas_propias: riego ? riego.hectareas_propias : null,
  hectareas_rentadas: riego ? riego.hectareas_rentadas : null,
  cliente_id: riego ? riego.cliente_id : cliente.id,
  riego_id: riego ? riego.riego_id : null,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/clienteRiego/cliente/form",
    ""
  );
  riegos.value = res.riegos;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formRiego,
  validate,
});
</script>
