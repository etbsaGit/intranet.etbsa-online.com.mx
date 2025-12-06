<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formInversion.year"
          :options="years()"
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
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formInversion.hectareas"
          label="# de hectareas"
          filled
          dense
          lazy-rules
          type="number"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="formInversion.cultivo_id"
          :options="filterCultivos"
          label="Cultivo"
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
          use-input
          @filter="filterFn"
          input-debounce="0"
          behavior="menu"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formInversion.costo"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          label="Costo por hectarea"
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
    <q-item>
      <q-item-section>
        <q-input
          v-model="formInversion.toneladas"
          label="Rendimiento toneladas p/ hectarea"
          filled
          dense
          lazy-rules
          mask="#####"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formInversion.precio"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          label="Precio por tonelada"
          :rules="[(val) => (val && val >= 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="ingreso"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          readonly
          label="Ingreso total"
          hint
        />
      </q-item-section>
      <q-item-section>
        <q-input
          :model-value="utilidadFormatted"
          filled
          dense
          readonly
          label="Utilidad del cultivo"
          :input-class="utilidad < 0 ? 'text-red' : 'text-green'"
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { sendRequest } from "src/boot/functions";
import { formatCurrency, years } from "src/boot/format";

const { inversion, cliente } = defineProps(["inversion", "cliente"]);

const cultivos = ref([]);
const filterCultivos = ref(null);
const ciclos = ref(["Primavera - Verano", "Otoño - Invierno"]);

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      filterCultivos.value = cultivos.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterCultivos.value = cultivos.value.filter(
      (customer) => customer.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

// --- CALCULOS AUTOMATICOS ---
const total = computed(() => {
  const h = Number(formInversion.value.hectareas) || 0;
  const c = Number(formInversion.value.costo) || 0;
  return h * c;
});

const ingreso = computed(() => {
  const t = Number(formInversion.value.toneladas) || 0;
  const h = Number(formInversion.value.hectareas) || 0;
  const p = Number(formInversion.value.precio) || 0;
  return t * h * p;
});

const utilidad = computed(() => {
  return ingreso.value - total.value;
});

const utilidadFormatted = computed(() => {
  return formatCurrency(utilidad.value);
});

// --------------------------------

const myForm = ref(null);

const formInversion = ref({
  id: inversion ? inversion.id : null,
  year: inversion ? inversion.year : null,
  ciclo: inversion ? inversion.ciclo : null,
  hectareas: inversion ? inversion.hectareas : null,
  costo: inversion ? inversion.costo : null,
  toneladas: inversion ? inversion.toneladas : null,
  precio: inversion ? inversion.precio : null,
  cultivo_id: inversion ? inversion.cultivo_id : null,
  cliente_id: inversion ? inversion.cliente_id : cliente.id,
});

const getOptions = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/clienteCultivo/options",
    ""
  );
  cultivos.value = res.cultivos;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
});

defineExpose({
  formInversion,
  validate,
});
</script>
