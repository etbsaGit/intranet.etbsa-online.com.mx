<template>
  <q-form ref="myForm">
    <q-item>
      <q-item-section>
        <q-select
          v-model="formInversion.year"
          :options="years"
          label="Año"
          filled
          dense
          clearable
          options-dense
          transition-show="jump-up"
          transition-hide="jump-up"
          :rules="[(val) => !!val || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formInversion.ciclo"
          :options="ciclos"
          label="Ciclo"
          transition-show="jump-up"
          transition-hide="jump-up"
          options-dense
          filled
          dense
          clearable
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formInversion.unidades"
          label="# de cabezas"
          filled
          dense
          lazy-rules
          mask="#####"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formInversion.ganado_id"
          :options="ganados"
          label="Ganado"
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
      <q-item-section>
        <q-input
          v-model="formInversion.costo"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          label="Costo por cabeza"
          :rules="[(val) => (val && val >= 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="total"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          readonly
          label="Total"
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

const { inversion, cliente } = defineProps(["inversion", "cliente"]);

const ganados = ref([]);
const years = ref([]);
const ciclos = ref(["Primavera - Verano", "Otoño - Invierno"]);

const total = computed(() => {
  const h = Number(formInversion.value.unidades) || 0;
  const c = Number(formInversion.value.costo) || 0;
  return h * c;
});

const myForm = ref(null);

const formInversion = ref({
  id: inversion ? inversion.id : null,
  year: inversion ? inversion.year : null,
  ciclo: inversion ? inversion.ciclo : null,
  unidades: inversion ? inversion.unidades : null,
  costo: inversion ? inversion.costo : null,
  ganado_id: inversion ? inversion.ganado_id : null,
  cliente_id: inversion ? inversion.cliente_id : cliente.id,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/inversionesGanadera/options",
    ""
  );
  ganados.value = res.ganados;
};

const populateYears = () => {
  const current = new Date().getFullYear();
  // Genera [current-3, current-2, current-1, current]
  years.value = Array.from({ length: 4 }, (_, i) => current - 3 + i);
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  populateYears();
  getOptions();
});

defineExpose({
  formInversion,
  validate,
});
</script>
