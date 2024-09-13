<template>
  <q-form ref="myForm">
    <q-item>
      <q-item-section>
        <q-input
          v-model="formAbastecimiento.cantidad"
          filled
          dense
          label="Cantidad"
          lazy-rules
          mask="#####"
          reverse-fill-mask
          unmasked-value
          :rules="[(val) => (val !== null && val !== '') || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formAbastecimiento.abastecimiento_id"
          :options="abastecimientos"
          label="Tipo de abastecimiento"
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

const { abastecimiento, cliente } = defineProps(["abastecimiento", "cliente"]);

const abastecimientos = ref([]);

const myForm = ref(null);

const formAbastecimiento = ref({
  id: abastecimiento ? abastecimiento.id : null,
  cantidad: abastecimiento ? abastecimiento.cantidad : null,
  abastecimiento_id: abastecimiento ? abastecimiento.abastecimiento_id : null,
  cliente_id: abastecimiento ? abastecimiento.cliente_id : cliente.id,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/abastecimiento", "");
  abastecimientos.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formAbastecimiento,
  validate,
});
</script>
