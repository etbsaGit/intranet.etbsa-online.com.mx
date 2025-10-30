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
      <q-item-section v-if="formFinca.estatus_id == 121">
        <q-input
          v-model="formFinca.costo"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          label="Costo de renta anual"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section v-if="formFinca.estatus_id == 120">
        <q-input
          v-model="formFinca.valor"
          prefix="$"
          mask="###,###,###"
          reverse-fill-mask
          unmasked-value
          filled
          dense
          label="Valor propiedad"
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item v-if="formFinca.estatus_id">
      <q-item-section>
        <q-file
          clearable
          color="secondary"
          dense
          outlined
          v-model="formFinca.file"
          :label="
            formFinca.estatus_id === 121
              ? 'Contrato de renta'
              : formFinca.estatus_id === 120
              ? 'Titulos parcelarios o escrituras'
              : 'Subir evidencia'
          "
          lazy-rules
          accept=".jpg, .jpeg, .png, .jfif, .pdf"
          multiple
          @clear="formFinca.base64 = []"
          @input="convertirFile($event)"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section align="center">
        <q-item-label caption>- Archivos ya guardados -</q-item-label>
      </q-item-section>
    </q-item>
    <q-list v-if="finca">
      <q-item v-for="(doc, index) in formFinca.finca_docs" :key="index">
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
  finca_docs: finca ? finca.finca_docs : [],

  base64: [],
  file: [],
});

const deleteDoc = async (id) => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/intranet/fincaDoc/" + id,
    ""
  );
  formFinca.value.finca_docs = formFinca.value.finca_docs.filter(
    (doc) => doc.id !== id
  );
};

const convertirFile = (event) => {
  const archivos = event.target.files;
  formFinca.value.base64 = []; // limpiar antes de agregar nuevos

  if (archivos && archivos.length > 0) {
    Array.from(archivos).forEach((archivo) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        const objetoArchivo = {
          name: archivo.name,
          base64: base64Data,
        };
        formFinca.value.base64.push(objetoArchivo);
      };
      reader.readAsDataURL(archivo);
    });
  }
};

const openFile = (url) => {
  window.open(url, "_blank");
};

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
