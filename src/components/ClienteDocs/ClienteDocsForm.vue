<template>
  <q-form ref="myForm" greedy>
    <q-item v-if="checkRole('Credito')">
      <q-item-section>
        <q-select
          v-model="formDoc.status_id"
          :options="types"
          label="Tipo de documento"
          option-value="id"
          option-label="nombre"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          dense
          options-dense
          @clear="clearForm"
          :rules="[(val) => val !== null || 'Obligatorio']"
        />
      </q-item-section>
      <q-item-section>
        <q-input
          dense
          filled
          v-model="formDoc.expiration_date"
          label="Fecha de vencimiento"
          :rules="[(val) => val !== null || 'Obligatorio']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  minimal
                  v-model="formDoc.expiration_date"
                  mask="YYYY-MM-DD"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-file
          clearable
          filled
          dense
          v-model="model"
          hint
          label="Buscar aqui tu documento"
          @input="convertirFile($event)"
          @clear="clearForm"
          :disable="formDoc.status_id == null"
          :rules="[(val) => !!val || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item v-if="checkRole('Credito')">
      <q-item-section>
        <q-input
          v-model="formDoc.comments"
          filled
          dense
          label="Comentarios"
          lazy-rules
          hint
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { checkRole, sendRequest } from "src/boot/functions";

const { doc, cliente } = defineProps(["doc", "cliente"]);

const types = ref([]);

const myForm = ref(null);
const model = ref(null);
const path = ref(doc ? doc.realpath : null);

const formDoc = ref({
  id: doc ? doc.id : null,
  name: doc ? doc.name : null,
  expiration_date: doc ? doc.expiration_date : null,
  comments: doc ? doc.comments : null,
  status_id: doc ? doc.status_id : null,
  cliente_id: doc ? doc.cliente_id : cliente.id,
  extension: doc ? doc.extension : null,
  base64: null,
});

const clearForm = () => {
  formDoc.value.id = null;
  formDoc.value.name = null;
  formDoc.value.expiration_date = null;
  formDoc.value.comments = null;
  formDoc.value.status_id = null;
  formDoc.value.extension = null;
  formDoc.value.base64 = null;
  model.value = null;
  path.value = null;
};

const convertirFile = (event) => {
  const archivos = event.target.files;
  if (archivos) {
    Array.from(archivos).forEach((archivo) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        formDoc.value.name = archivo.name;
        formDoc.value.extension = archivo.name.split(".").pop();
        formDoc.value.base64 = base64Data;
      };
      reader.readAsDataURL(archivo);
    });
  }
};

const getOptions = async () => {
  let res = await sendRequest("GET", null, "/api/estatus/TypeDocs", "");
  types.value = res;
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getOptions();
  // Si no tiene fecha, asignamos la actual + 3 meses
  if (!formDoc.value.expiration_date) {
    const now = new Date();
    now.setMonth(now.getMonth() + 3); // suma 3 meses
    formDoc.value.expiration_date = now.toISOString().split("T")[0]; // formato YYYY-MM-DD
  }
});

defineExpose({
  formDoc,
  validate,
});
</script>
