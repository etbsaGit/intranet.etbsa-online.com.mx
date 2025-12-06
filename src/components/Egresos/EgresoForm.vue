<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formEgreso.year"
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
          v-model="formEgreso.type"
          :options="types"
          label="Tipo de pago"
          filled
          dense
          clearable
          options-dense
          option-value="id"
          option-label="name"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          :rules="[(val) => !!val || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEgreso.pago"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          label="Cantidad pago"
          :rules="[(val) => (val && val >= 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          v-model="formEgreso.months"
          label="Pagos restantes"
          filled
          dense
          lazy-rules
          mask="#####"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
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
          v-model="formEgreso.entidad"
          filled
          dense
          label="A quien le debe"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEgreso.concepto"
          filled
          dense
          label="Detalle de la deuda"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formEgreso.descripcion"
          filled
          dense
          label="Descripcion"
          hint
          type="textarea"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, computed } from "vue";
import { years } from "src/boot/format";

const { egreso, cliente } = defineProps(["egreso", "cliente"]);

const types = ref([
  { id: 12, name: "Mensual" },
  { id: 6, name: "Bimestral" },
  { id: 4, name: "Trimestral" },
  { id: 2, name: "Semestral" },
  { id: 1, name: "Anual" },
]);

// --- CALCULOS AUTOMATICOS ---
const total = computed(() => {
  const h = Number(formEgreso.value.pago) || 0;
  const c = Number(formEgreso.value.months) || 0;
  return h * c;
});

const myForm = ref(null);

const formEgreso = ref({
  id: egreso ? egreso.id : null,
  year: egreso ? egreso.year : null,
  pago: egreso ? egreso.pago : null,
  months: egreso ? egreso.months : null,
  type: egreso ? egreso.type : null,
  entidad: egreso ? egreso.entidad : null,
  concepto: egreso ? egreso.concepto : null,
  descripcion: egreso ? egreso.descripcion : null,
  cliente_id: egreso ? egreso.cliente_id : cliente.id,
});

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formEgreso,
  validate,
});
</script>
