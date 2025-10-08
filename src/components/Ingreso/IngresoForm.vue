<template>
  <q-form ref="myForm">
    <q-item>
      <q-item-section>
        <q-select
          v-model="formIngreso.year"
          :options="years"
          label="Año"
          filled
          dense
          options-dense
          transition-show="jump-up"
          transition-hide="jump-up"
          :rules="[(val) => !!val || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formIngreso.tipo"
          :options="types"
          label="Tipo"
          transition-show="jump-up"
          transition-hide="jump-up"
          filled
          dense
          options-dense
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formIngreso.monto"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          label="Monto mensual"
          :rules="[(val) => Number(val) > 0 || 'El monto debe ser mayor a 0']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          v-model="formIngreso.months"
          :options="months"
          label="Meses efectivos"
          filled
          dense
          options-dense
          transition-show="jump-up"
          transition-hide="jump-up"
          :rules="[(val) => !!val || 'Obligatorio']"
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
        <q-file
          clearable
          color="secondary"
          dense
          outlined
          v-model="formIngreso.file"
          label="Subir evidencia"
          lazy-rules
          accept=".jpg, .jpeg, .png, .jfif, .pdf"
          multiple
          @clear="formIngreso.base64 = []"
          @input="convertirFile($event)"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section align="center">
        <q-item-label caption>- Archivos ya guardados -</q-item-label>
      </q-item-section>
    </q-item>
    <q-list v-if="ingreso">
      <q-item v-for="(doc, index) in formIngreso.ingreso_docs" :key="index">
        <q-item-section avatar>
          <q-btn
            flat
            round
            dense
            icon="fa-solid fa-trash"
            color="red"
            @click="deleteDoc(doc.id)"
          />
        </q-item-section>
        <q-item-section avatar>
          <q-btn
            flat
            round
            dense
            icon="fa-solid fa-file-arrow-down"
            @click="openFile(doc.realpath)"
          />
        </q-item-section>
        <q-item-section>
          {{ doc.name }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-form>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { ingreso, cliente } = defineProps(["ingreso", "cliente"]);

const years = ref([]);
const months = ref([]);

const myForm = ref(null);

const types = ref([
  "Sueldos y salarios",
  "Pension",
  "Maquila",
  "Remesas",
  "Renta de maquinaria",
  "Renta de inmueble",
  "Negocio comercial",
]);

const formIngreso = ref({
  id: ingreso ? ingreso.id : null,
  tipo: ingreso ? ingreso.tipo : null,
  monto: ingreso ? ingreso.monto : 0,
  months: ingreso ? ingreso.months : 1,
  year: ingreso ? ingreso.year : null,
  cliente_id: ingreso ? ingreso.cliente_id : cliente.id,
  ingreso_docs: ingreso ? ingreso.ingreso_docs : [],

  base64: [],
  file: [],
});

// --- CALCULOS AUTOMATICOS ---
const total = computed(() => {
  const h = Number(formIngreso.value.monto) || 0;
  const c = Number(formIngreso.value.months) || 0;
  return h * c;
});

const deleteDoc = async (id) => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/intranet/ingresoDoc/" + id,
    ""
  );
  formIngreso.value.ingreso_docs = formIngreso.value.ingreso_docs.filter(
    (doc) => doc.id !== id
  );
};

const convertirFile = (event) => {
  const archivos = event.target.files;
  formIngreso.value.base64 = []; // limpiar antes de agregar nuevos

  if (archivos && archivos.length > 0) {
    Array.from(archivos).forEach((archivo) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        const objetoArchivo = {
          name: archivo.name,
          base64: base64Data,
        };
        formIngreso.value.base64.push(objetoArchivo);
      };
      reader.readAsDataURL(archivo);
    });
  }
};

const populateYears = () => {
  const current = new Date().getFullYear();
  years.value = Array.from({ length: 6 }, (_, i) => current - 4 + i);
};

const populateMonths = () => {
  // Genera [1, 2, 3, ..., 12]
  months.value = Array.from({ length: 12 }, (_, i) => i + 1);
};

const openFile = (url) => {
  window.open(url, "_blank");
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  populateYears();
  populateMonths();
});

defineExpose({
  formIngreso,
  validate,
});
</script>
