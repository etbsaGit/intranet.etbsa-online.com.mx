<template>
  <q-list bordered separator dense style="border-radius: 10px">
    <q-item align="center">
      <q-item-section avatar>
        <q-item-label><strong>Editar</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Nombre</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Extencion</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Tipo</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Fecha de caducidad</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Ver / Descargar</strong></q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      align="center"
      v-for="(doc, index) in rows"
      :key="index"
      :class="{ 'text-red': isExpired(doc.expiration_date) }"
    >
      <q-item-section avatar>
        <q-btn
          dense
          color="primary"
          flat
          icon="edit_square"
          @click="openEdit(doc)"
        />
      </q-item-section>
      <q-item-section>
        {{ doc.name }}
      </q-item-section>
      <q-item-section>
        {{ doc.extension }}
      </q-item-section>
      <q-item-section>
        {{ doc.status?.nombre }}
      </q-item-section>
      <q-item-section>
        {{ doc.expiration_date }}
      </q-item-section>
      <q-item-section>
        <q-btn
          dense
          color="primary"
          flat
          icon="description"
          @click="openWindow(doc)"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn
          dense
          flat
          label="Agregar documento"
          color="primary"
          icon="add_circle"
          @click="showAdd = true"
        />
      </q-item-section>
    </q-item>
  </q-list>

  <q-dialog
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agregar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agregar" color="blue" @click="postItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <cliente-docs-form ref="add" :cliente="cliente" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Actualizar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Actualizar" color="blue" @click="putItem" />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Borrar" color="orange" @click="destroyItem" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <cliente-docs-form ref="edit" :doc="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";

import ClienteDocsForm from "src/components/ClienteDocs/ClienteDocsForm.vue";

const { cliente } = defineProps(["cliente"]);

const rows = ref([]);
const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const openWindow = (item) => {
  window.open(item.realpath, "_blank");
};

const getRows = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/clientesDoc/cliente/" + id,
    ""
  );
  rows.value = res;
};

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formDoc,
  };
  let res = await sendRequest("POST", final, "/api/intranet/clientesDoc", "");
  showAdd.value = false;
  getRows(cliente.id);
};

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...edit.value.formDoc,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/clientesDoc/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(cliente.id);
};

const destroyItem = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/intranet/clientesDoc/" + selectedItem.value.id,
    ""
  );
  selectedItem.value = null;
  showEdit.value = false;
  getRows(cliente.id);
};

const isExpired = (date) => {
  const now = new Date();
  return new Date(date) < now;
};

onMounted(() => {
  getRows(cliente.id);
});
</script>

<style scoped>
.text-red {
  color: red !important;
}
</style>
