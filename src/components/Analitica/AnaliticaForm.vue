<template>
  <q-form ref="myForm" greedy>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="detalle" label="Detalle" />
      <q-tab name="docs" label="Documentos" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="detalle">
        <q-item>
          <q-item-section>
            <q-input
              v-model="formAnalitica.titulo"
              filled
              dense
              readonly
              label="Periodo"
              :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date minimal @update:model-value="handleDateChange">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
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
            <q-input
              v-model="formAnalitica.efectivo"
              prefix="$"
              mask="###,###,###"
              reverse-fill-mask
              unmasked-value
              filled
              dense
              label="Efectivo en caja"
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formAnalitica.caja"
              prefix="$"
              mask="###,###,###"
              reverse-fill-mask
              unmasked-value
              filled
              dense
              label="Bancos"
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formAnalitica.documentospc"
              prefix="$"
              mask="###,###,###"
              reverse-fill-mask
              unmasked-value
              filled
              dense
              label="Documentos por cobrar"
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formAnalitica.mercancias"
              prefix="$"
              mask="###,###,###"
              reverse-fill-mask
              unmasked-value
              filled
              dense
              label="Mercancias"
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formAnalitica.gastos"
              prefix="$"
              mask="###,###,###"
              reverse-fill-mask
              unmasked-value
              filled
              dense
              label="Gastos familiares anuales"
              hint
            />
          </q-item-section>
        </q-item>

        <q-item v-if="checkRole('Credito')">
          <q-item-section>
            <q-select
              v-model="formAnalitica.status"
              :options="estatus"
              label="Estatus"
              option-value="value"
              option-label="label"
              option-disable="inactive"
              emit-value
              map-options
              transition-show="jump-up"
              transition-hide="jump-up"
              filled
              dense
              options-dense
              hint
            />
          </q-item-section>
          <q-item-section>
            <q-input
              v-model="formAnalitica.comentarios"
              filled
              dense
              label="Comentarios"
              type="textarea"
              hint
            />
          </q-item-section>
        </q-item>
      </q-tab-panel>

      <q-tab-panel name="docs">
        <q-item>
          <q-item-section>
            <q-file
              clearable
              color="secondary"
              dense
              outlined
              v-model="formAnalitica.file"
              label="Subir evidencia"
              lazy-rules
              accept=".jpg, .jpeg, .png, .jfif, .pdf"
              @clear="formAnalitica.base64 = []"
              @input="convertirFile($event)"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section align="center">
            <q-item-label caption>- Archivos ya guardados -</q-item-label>
          </q-item-section>
        </q-item>
        <q-list v-if="analitica" bordered separator>
          <q-item
            v-for="(doc, index) in formAnalitica.analitica_docs"
            :key="index"
          >
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
                color="blue"
                icon="fa-solid fa-comment-dots"
                @click="openComent(doc)"
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
            <q-item-section>
              {{ doc.comentarios }}
            </q-item-section>
            <q-item-section side>
              <q-btn-dropdown
                v-if="checkRole('Credito')"
                dense
                :color="getDropdownPropsStatus(doc.status).color"
                :text-color="getDropdownPropsStatus(doc.status).textColor"
                :icon="getDropdownPropsStatus(doc.status).icon"
                :label="getDropdownPropsStatus(doc.status).label"
              >
                <q-list dense>
                  <q-item
                    v-if="doc.status != 1"
                    clickable
                    v-close-popup
                    class="bg-green-3"
                    @click="changeEstatus(doc.id, 1)"
                  >
                    <q-item-section>
                      <q-chip
                        color="green-3"
                        text-color="white"
                        icon="fa-solid fa-circle-check"
                        label="Autorizada"
                      />
                    </q-item-section>
                  </q-item>

                  <q-item
                    v-if="doc.status != 0"
                    clickable
                    v-close-popup
                    class="bg-red-3"
                    @click="changeEstatus(doc.id, 0)"
                  >
                    <q-item-section>
                      <q-chip
                        color="red-3"
                        text-color="white"
                        icon="fa-solid fa-circle-xmark"
                        label="Rechazada"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-chip
                v-else
                square
                :color="getDropdownPropsStatus(doc.status).color"
                :text-color="getDropdownPropsStatus(doc.status).textColor"
                :icon="getDropdownPropsStatus(doc.status).icon"
                :label="getDropdownPropsStatus(doc.status).label"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </q-form>

  <BaseDialog v-model="comentShow" mode="edit" @submit="setComentDoc">
    <template #form>
      <analitica-coment ref="coment" :doc="selectedDoc" />
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { date } from "quasar";
import { checkRole, sendRequest } from "src/boot/functions";
import BaseDialog from "src/bases/BaseDialog.vue";
import AnaliticaComent from "src/components/Analitica/AnaliticaComent.vue";
import { useCrudStore } from "src/stores/crud";

const crud = useCrudStore();

const { analitica, cliente } = defineProps(["analitica", "cliente"]);

const baseURL = ref("/api/intranet/analiticaDoc");

const myForm = ref(null);
const tab = ref("detalle");
const comentShow = ref(false);
const coment = ref(null);
const selectedDoc = ref(null);

const estatus = ref([
  { value: 0, label: "Rechazada" },
  { value: 1, label: "Autorizada" },
  { value: null, label: "Pendiente autorizacion" },
]);

const timeStamp = Date.now();
const formattedString = date.formatDate(timeStamp, "YYYY-MM-DD");

const formAnalitica = ref({
  id: analitica ? analitica.id : null,
  titulo: analitica ? analitica.titulo : null,
  efectivo: analitica ? analitica.efectivo : 0,
  caja: analitica ? analitica.caja : 0,
  gastos: analitica ? analitica.gastos : 0,
  documentospc: analitica ? analitica.documentospc : 0,
  mercancias: analitica ? analitica.mercancias : 0,
  status: analitica ? analitica.status : null,
  fecha: analitica ? analitica.fecha : formattedString,
  comentarios: analitica ? analitica.comentarios : null,
  cliente_id: analitica ? analitica.cliente_id : cliente.id,
  analitica_docs: analitica ? analitica.analitica_docs : [],

  base64: [],
  file: [],
});

const openComent = (item) => {
  selectedDoc.value = item;
  comentShow.value = true;
};

const setComentDoc = async () => {
  const data = { ...coment.value.formAnaliticaDoc };

  crud.putItem(baseURL.value, data, coment.value.validate, (response) => {
    // 🔹 Cierra el modal
    comentShow.value = false;

    // 🔹 Busca el documento correspondiente y actualiza sus datos en la lista reactiva
    const index = formAnalitica.value.analitica_docs.findIndex(
      (doc) => doc.id === data.id
    );
    if (index !== -1) {
      // Actualiza solo los campos que cambiaron
      formAnalitica.value.analitica_docs[index] = {
        ...formAnalitica.value.analitica_docs[index],
        ...data,
      };
    }
  });
};

const deleteDoc = async (id) => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/intranet/analiticaDoc/" + id,
    ""
  );
  formAnalitica.value.analitica_docs =
    formAnalitica.value.analitica_docs.filter((doc) => doc.id !== id);
};

const changeEstatus = async (id, status) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/analiticaDoc/status/" + id + "/" + status,
    ""
  );
  // 🔹 Si la petición fue exitosa, busca el archivo y actualiza su estatus
  const archive = formAnalitica.value.analitica_docs.find((a) => a.id === id);
  if (archive) {
    archive.status = status;
  }
};

const convertirFile = (event) => {
  const archivos = event.target.files;
  formAnalitica.value.base64 = []; // limpiar antes de agregar nuevos

  if (archivos && archivos.length > 0) {
    Array.from(archivos).forEach((archivo) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result;
        const objetoArchivo = {
          name: archivo.name,
          base64: base64Data,
        };
        formAnalitica.value.base64.push(objetoArchivo);
      };
      reader.readAsDataURL(archivo);
    });
  }
};

function handleDateChange(fechaSeleccionada) {
  // fechaSeleccionada llega como 'YYYY-MM-DD'
  const fecha = new Date(fechaSeleccionada);

  // Calcula la fecha + 1 año
  const fechaMasUnAno = new Date(fecha);
  fechaMasUnAno.setFullYear(fecha.getFullYear() - 1);

  // Función para formatear en DD/MM/YYYY
  const formato = (f) => {
    const dia = String(f.getDate()).padStart(2, "0");
    const mes = String(f.getMonth() + 1).padStart(2, "0");
    const anio = f.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  // Convierte ambas fechas
  const fechaStr = formato(fecha);
  const fechaMasUnAnoStr = formato(fechaMasUnAno);

  // Asigna el string combinado al input
  formAnalitica.value.titulo = `${fechaStr} - ${fechaMasUnAnoStr}`;
}

const openFile = (url) => {
  window.open(url, "_blank");
};

function getDropdownPropsStatus(validated) {
  if (validated === 0) {
    return {
      color: "red-3",
      textColor: "white",
      icon: "fa-solid fa-circle-xmark",
      label: "Rechazada",
    };
  } else if (validated === 1) {
    return {
      color: "green-3",
      textColor: "white",
      icon: "fa-solid fa-circle-check",
      label: "Autorizada",
    };
  } else {
    return {
      color: "primary",
      textColor: "white",
      icon: "fa-regular fa-hourglass-half",
      label: "Esperando autorizacion",
    };
  }
}

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {});

defineExpose({
  formAnalitica,
  validate,
});
</script>
