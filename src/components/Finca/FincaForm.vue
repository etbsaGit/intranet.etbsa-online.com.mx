<template>
  <q-form ref="myForm">
    <q-item>
      <q-item-section>
        <q-input
          v-model="formFinca.nombre"
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
          v-model="formFinca.descripcion"
          filled
          dense
          label="# de superficie "
          lazy-rules
          hint
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formFinca.estatus_id"
          :options="estatus"
          label="Tipo"
          option-value="id"
          option-label="nombre"
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
          v-model="formFinca.costo"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          label="Costo de renta"
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formFinca.valor"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          label="Valor propiedad"
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { sendRequest } from "src/boot/functions";
import { formatCurrency } from "src/boot/format";

const { finca, cliente } = defineProps(["finca", "cliente"]);

const estatus = ref([]);

const myForm = ref(null);

const formFinca = ref({
  id: finca ? finca.id : null,
  nombre: finca ? finca.nombre : null,
  descripcion: finca ? finca.descripcion : null,
  valor: finca ? finca.valor : null,
  costo: finca ? finca.costo : null,
  estatus_id: finca ? finca.estatus_id : null,
  cliente_id: finca ? finca.cliente_id : cliente.id,
});

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/intranet/finca/options", "");
  estatus.value = res.estatus;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formFinca,
  validate,
});
</script>
