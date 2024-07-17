<template>
  <q-item v-if="row == null">
    <q-item-section>
      <q-btn
        dense
        label="Agregar representante"
        color="primary"
        icon="add_circle"
        @click="showAdd = true"
      />
    </q-item-section>
  </q-item>

  <q-card flat bordered v-else>
    <q-item>
      <q-item-section class="text-h6">
        <q-item-label>
          <strong class="text-teal">Nombre:</strong>
          {{ row.nombre }}
        </q-item-label>
        <q-item-label>
          <strong class="text-teal">RFC:</strong>
          {{ row.rfc }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn dense color="primary" label="Editar" @click="openEdit(row)" />
      </q-item-section>
    </q-item>

    <q-separator />

    <q-item align="center">
      <q-item-section>
        <q-item-label>
          <strong>Email:</strong>
          {{ row.email }}
        </q-item-label>
        <q-item-label>
          <strong>Telefono:</strong>
          {{ row.telefono }}
        </q-item-label>
      </q-item-section>
      <q-separator vertical />
      <q-item-section>
        <q-item>
          <q-item-section>
            <q-item-label>
              <strong>Estado:</strong>
              {{ row.state_entity.name }}
            </q-item-label>
            <q-item-label>
              <strong>Ciudad:</strong>
              {{ row.town.name }}
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <strong>Colonia:</strong>
              {{ row.colonia }}
            </q-item-label>
            <q-item-label>
              <strong>Calle:</strong>
              {{ row.calle }}
            </q-item-label>
            <q-item-label>
              <strong>Codigo postal:</strong>
              {{ row.codigo_postal }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-item-section>
    </q-item>
  </q-card>

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
          <representante-form ref="add" :cliente="cliente" />
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
          <representante-form ref="edit" :representante="selectedItem" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";

const $q = useQuasar();

import RepresentanteForm from "src/components/Representante/RepresentanteForm.vue";

const { cliente } = defineProps(["cliente"]);

const row = ref(null);
const selectedItem = ref(null);
const showAdd = ref(false);
const add = ref(null);
const showEdit = ref(false);
const edit = ref(null);

const openEdit = (item) => {
  selectedItem.value = item;
  showEdit.value = true;
};

const getRow = async (id) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/intranet/representante/cliente/" + id,
    ""
  );
  row.value = res;
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
    ...add.value.formRepresentante,
  };
  let res = await sendRequest("POST", final, "/api/intranet/representante", "");
  showAdd.value = false;
  getRow(cliente.id);
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
    ...edit.value.formRepresentante,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/intranet/representante/" + final.id,
    ""
  );
  showEdit.value = false;
  getRow(cliente.id);
};

const destroyItem = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/intranet/representante/" + selectedItem.value.id,
    ""
  );
  selectedItem.value = null;
  showEdit.value = false;
  row.value = null;
  getRow(cliente.id);
};

onMounted(() => {
  getRow(cliente.id);
});
</script>
