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
        <q-item-label><strong>Telefono</strong></q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label><strong>Parentesco</strong></q-item-label>
      </q-item-section>
    </q-item>
    <q-item align="center" v-for="(referencia, index) in rows" :key="index">
      <q-item-section avatar>
        <q-btn
          dense
          color="primary"
          flat
          icon="edit_square"
          @click="openEdit(referencia)"
        />
      </q-item-section>
      <q-item-section>
        {{ referencia.nombre }}
      </q-item-section>
      <q-item-section>
        {{ formatPhoneNumber(referencia.telefono) }}
      </q-item-section>
      <q-item-section>
        {{ referencia.kinship.name }}
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn
          dense
          flat
          label="Nueva referencia"
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
          <referencia-form ref="add" :cliente="cliente" />
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
          <referencia-form ref="edit" :referencia="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { formatPhoneNumber } from "src/boot/format.js";
import { useQuasar } from "quasar";

const $q = useQuasar();

import ReferenciaForm from "src/components/Referencia/ReferenciaForm.vue";

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

const getRows = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/referencia/cliente/" + id,
    ""
  );
  rows.value = res;
};

const postItem = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...add.value.formReferencia,
  };
  let res = await sendRequest("POST", final, "/api/intranet/referencia", "");
  showAdd.value = false;
  getRows(cliente.id);
};

const putItem = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...edit.value.formReferencia,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/referencia/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(cliente.id);
};

const destroyItem = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/intranet/referencia/" + selectedItem.value.id,
    ""
  );
  selectedItem.value = null;
  showEdit.value = false;
  getRows(cliente.id);
};

onMounted(() => {
  getRows(cliente.id);
});
</script>
