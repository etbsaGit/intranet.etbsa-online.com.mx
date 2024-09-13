<template>
  <q-form ref="myForm">
    <q-item>
      <q-item-section>
        <q-select
          v-model="formCultivo.cultivo_id"
          :options="cultivos"
          label="Cultivo"
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
      <q-item-section>
        <q-select
          v-model="formCultivo.tipo_cultivo_id"
          :options="tiposCultivo"
          label="Finalidad del cultivo"
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

const { cultivo, cliente } = defineProps(["cultivo", "cliente"]);

const cultivos = ref([]);
const tiposCultivo = ref([]);

const myForm = ref(null);

const formCultivo = ref({
  id: cultivo ? cultivo.id : null,
  cultivo_id: cultivo ? cultivo.cultivo_id : null,
  tipo_cultivo_id: cultivo ? cultivo.tipo_cultivo_id : null,
  cliente_id: cultivo ? cultivo.cliente_id : cliente.id,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/clienteCultivo/options",
    ""
  );
  cultivos.value = res.cultivos;
  tiposCultivo.value = res.tiposCultivo;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formCultivo,
  validate,
});
</script>
