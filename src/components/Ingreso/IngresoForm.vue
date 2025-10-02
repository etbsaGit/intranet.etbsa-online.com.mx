<template>
  <q-form ref="myForm">
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
          label="Monto"
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
import { ref } from "vue";
import { sendRequest } from "src/boot/functions";

const { ingreso, cliente } = defineProps(["ingreso", "cliente"]);

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
  cliente_id: ingreso ? ingreso.cliente_id : cliente.id,
  ingreso_docs: ingreso ? ingreso.ingreso_docs : [],

  base64: [],
  file: [],
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

const openFile = (url) => {
  window.open(url, "_blank");
};

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formIngreso,
  validate,
});
</script>
